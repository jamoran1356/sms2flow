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

const BASE_URL = process.env.BASE_URL || "http://localhost:3000"
const WEBHOOK_TOKEN = process.env.SMS_WEBHOOK_TOKEN || ""

function buildHeaders(token) {
  const headers = {
    "content-type": "application/json",
  }
  if (token) {
    headers["x-sms2flow-token"] = token
  }
  return headers
}

async function postSms(body, token) {
  const response = await fetch(`${BASE_URL}/api/sms`, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(body),
  })

  let payload = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  return {
    status: response.status,
    payload,
  }
}

function assertCondition(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

async function main() {
  console.log("[security-smoke] Base URL:", BASE_URL)

  const checks = []

  if (WEBHOOK_TOKEN) {
    const unauthorized = await postSms(
      { fromPhone: "+10000000000", message: "SEND 1 FLOW TO +10000000001 KEY 1234" },
      "invalid-token"
    )

    checks.push({
      name: "Reject invalid webhook token",
      passed: unauthorized.status === 401,
      detail: `status=${unauthorized.status}`,
    })
  }

  const malformed = await postSms({}, WEBHOOK_TOKEN || undefined)
  checks.push({
    name: "Reject malformed payload",
    passed: malformed.status === 400,
    detail: `status=${malformed.status}`,
  })

  if (WEBHOOK_TOKEN && process.env.SMS_TEST_REGISTERED_PHONE) {
    const invalidCmd = await postSms(
      {
        fromPhone: process.env.SMS_TEST_REGISTERED_PHONE,
        message: "HELLO WORLD",
      },
      WEBHOOK_TOKEN
    )

    checks.push({
      name: "Reject unknown SMS command",
      passed: invalidCmd.status === 400,
      detail: `status=${invalidCmd.status}`,
    })
  }

  checks.forEach((check) => {
    const mark = check.passed ? "PASS" : "FAIL"
    console.log(`[security-smoke] ${mark} - ${check.name} (${check.detail})`)
  })

  const failed = checks.filter((check) => !check.passed)
  assertCondition(failed.length === 0, `Security smoke failed in ${failed.length} check(s)`)

  console.log("[security-smoke] Security smoke checks passed.")
}

main().catch((error) => {
  console.error("[security-smoke] FAILED:", error.message)
  process.exit(1)
})
