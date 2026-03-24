import autocannon from "autocannon"
import fs from "node:fs"
import path from "node:path"

function loadDotEnv() {
  const envPath = path.resolve(process.cwd(), ".env")
  if (!fs.existsSync(envPath)) return

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const separator = trimmed.indexOf("=")
    if (separator <= 0) continue
    const key = trimmed.slice(0, separator).trim()
    let value = trimmed.slice(separator + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

loadDotEnv()

function getArg(name, fallback = undefined) {
  const flag = `--${name}`
  const index = process.argv.indexOf(flag)
  if (index === -1 || index + 1 >= process.argv.length) return fallback
  return process.argv[index + 1]
}

function toNumber(value, fallback) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

async function run() {
  const baseUrl = process.env.BASE_URL || getArg("baseUrl", "http://localhost:3000")
  const path = process.env.STRESS_PATH || getArg("path", "/api/sms")
  const method = (process.env.STRESS_METHOD || getArg("method", "POST")).toUpperCase()
  const connections = toNumber(process.env.STRESS_CONNECTIONS || getArg("connections", "50"), 50)
  const duration = toNumber(process.env.STRESS_DURATION || getArg("duration", "30"), 30)
  const pipelining = toNumber(process.env.STRESS_PIPELINING || getArg("pipelining", "1"), 1)
  const maxP99Ms = toNumber(process.env.STRESS_MAX_P99_MS || getArg("maxP99", "1500"), 1500)
  const minReqPerSec = toNumber(process.env.STRESS_MIN_REQ_SEC || getArg("minReqSec", "20"), 20)

  const token = process.env.SMS_WEBHOOK_TOKEN || ""

  const body = JSON.stringify({
    fromPhone: process.env.STRESS_FROM_PHONE || "+10000000000",
    message: process.env.STRESS_MESSAGE || "SEND 0.1 FLOW TO +10000000001 KEY 1234",
  })

  const url = `${baseUrl}${path}`

  console.log("[stress] URL:", url)
  console.log("[stress] method:", method)
  console.log("[stress] connections:", connections, "duration:", duration, "seconds")

  const headers = {
    "content-type": "application/json",
  }

  if (token) {
    headers["x-sms2flow-token"] = token
  }

  const result = await new Promise((resolve, reject) => {
    const instance = autocannon(
      {
        url,
        method,
        connections,
        duration,
        pipelining,
        headers,
        body: method === "POST" ? body : undefined,
      },
      (error, report) => {
        if (error) {
          reject(error)
          return
        }
        resolve(report)
      }
    )

    autocannon.track(instance, { renderProgressBar: true, renderLatencyTable: true, renderResultsTable: true })
  })

  const p99 = result.latency.p99
  const avgReqSec = result.requests.average
  const non2xx = result.non2xx || 0
  const errors = result.errors || 0
  const timeouts = result.timeouts || 0

  console.log("[stress] Summary")
  console.log("[stress] p99 latency (ms):", p99)
  console.log("[stress] avg req/sec:", avgReqSec)
  console.log("[stress] non-2xx:", non2xx)
  console.log("[stress] errors:", errors, "timeouts:", timeouts)

  if (p99 > maxP99Ms) {
    throw new Error(`p99 latency ${p99}ms exceeded threshold ${maxP99Ms}ms`)
  }

  if (avgReqSec < minReqPerSec) {
    throw new Error(`average req/sec ${avgReqSec} below threshold ${minReqPerSec}`)
  }

  console.log("[stress] Stress test passed with configured thresholds.")
}

run().catch((error) => {
  console.error("[stress] FAILED:", error.message)
  process.exit(1)
})
