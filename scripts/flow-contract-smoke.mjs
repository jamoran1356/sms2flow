import * as fcl from "@onflow/fcl"
import { SHA3 } from "sha3"
import elliptic from "elliptic"
import fs from "node:fs"
import path from "node:path"

const ec = new elliptic.ec("p256")

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

function asHex(value = "") {
  return String(value).replace(/^0x/i, "")
}

function withPrefix(value = "") {
  const clean = asHex(value)
  return clean ? `0x${clean}` : ""
}

function hashMessage(messageHex) {
  const sha = new SHA3(256)
  sha.update(Buffer.from(messageHex, "hex"))
  return sha.digest()
}

function signWithPrivateKey(privateKeyHex, messageHex) {
  const key = ec.keyFromPrivate(Buffer.from(asHex(privateKeyHex), "hex"))
  const sig = key.sign(hashMessage(messageHex))
  const n = 32
  const r = sig.r.toArrayLike(Buffer, "be", n)
  const s = sig.s.toArrayLike(Buffer, "be", n)
  return Buffer.concat([r, s]).toString("hex")
}

function getEnv(name, fallback = "") {
  return process.env[name] || fallback
}

function requireEnv(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required env var: ${name}`)
  }
  return value
}

function toUFix64(value) {
  return Number(value).toFixed(8)
}

function toNumber(value) {
  return Number.parseFloat(String(value))
}

async function runScript(cadence, args = []) {
  return fcl.query({ cadence, args })
}

function getAdminAuthorization() {
  const address = withPrefix(requireEnv("FLOW_ADMIN_ADDRESS"))
  const privateKey = requireEnv("FLOW_ADMIN_PRIVATE_KEY")
  const keyId = Number(getEnv("FLOW_ADMIN_KEY_ID", "0"))

  return {
    address,
    keyId,
    tempId: `${address}-${keyId}`,
    signingFunction: async (signable) => {
      const signature = signWithPrivateKey(privateKey, signable.message)
      return {
        addr: asHex(address),
        keyId,
        signature,
      }
    },
  }
}

async function sendTransaction(cadence, args = []) {
  const admin = getAdminAuthorization()

  const txId = await fcl.mutate({
    cadence,
    args,
    proposer: admin,
    payer: admin,
    authorizations: [admin],
    limit: 9999,
  })

  const sealed = await fcl.tx(txId).onceSealed()
  if (sealed.statusCode !== 0) {
    throw new Error(sealed.errorMessage || `Flow tx failed: ${txId}`)
  }

  return { txId, sealed }
}

function parseTransferIdFromEvents(events = []) {
  const event = events.find((item) => String(item.type || "").includes("SMS2FlowCommandTransfer.TransferRequested"))
  if (!event) return 0
  return Number(event.data?.transferId || 0)
}

async function getWalletBalance(walletContractAddress, walletId) {
  const cadence = `
    import SMS2FlowVirtualWallet from ${walletContractAddress}

    access(all) fun main(walletId: String): UFix64 {
      return SMS2FlowVirtualWallet.getBalance(walletId: walletId)
    }
  `
  const result = await runScript(cadence, [(arg, t) => arg(walletId, t.String)])
  return toNumber(result)
}

async function getTransferStatus(commandContractAddress, transferId) {
  const cadence = `
    import SMS2FlowCommandTransfer from ${commandContractAddress}

    access(all) fun main(transferId: UInt64): UInt8 {
      return SMS2FlowCommandTransfer.getTransferStatus(transferId: transferId)
    }
  `
  return Number(await runScript(cadence, [(arg, t) => arg(String(transferId), t.UInt64)]))
}

async function getLatestTransferId(commandContractAddress) {
  const cadence = `
    import SMS2FlowCommandTransfer from ${commandContractAddress}

    access(all) fun main(): UInt64 {
      return SMS2FlowCommandTransfer.getLatestTransferId()
    }
  `
  return Number(await runScript(cadence))
}

async function main() {
  const writeMode = process.argv.includes("--write")

  const accessNode = getEnv("FLOW_ACCESS_NODE", "https://rest-testnet.onflow.org")
  const network = getEnv("FLOW_NETWORK", "testnet")

  const commandContractAddress = withPrefix(requireEnv("FLOW_COMMAND_TRANSFER_CONTRACT_ADDRESS"))
  const walletContractAddress = withPrefix(requireEnv("FLOW_VIRTUAL_WALLET_CONTRACT_ADDRESS"))

  fcl.config({
    "accessNode.api": accessNode,
    "flow.network": network,
  })

  console.log("[flow-smoke] Network:", network)
  console.log("[flow-smoke] Access node:", accessNode)
  console.log("[flow-smoke] Command contract:", commandContractAddress)
  console.log("[flow-smoke] Wallet contract:", walletContractAddress)

  const latestTransferId = await getLatestTransferId(commandContractAddress)
  console.log("[flow-smoke] Latest transfer id:", latestTransferId)

  if (!writeMode) {
    console.log("[flow-smoke] Read-only smoke test passed.")
    return
  }

  const fromWalletId = requireEnv("FLOW_TEST_FROM_WALLET_ID")
  const toWalletId = requireEnv("FLOW_TEST_TO_WALLET_ID")
  const amount = toUFix64(getEnv("FLOW_TEST_AMOUNT", "0.00000001"))
  const confirmationKey = requireEnv("FLOW_TEST_KEY")

  const fromBefore = await getWalletBalance(walletContractAddress, fromWalletId)
  const toBefore = await getWalletBalance(walletContractAddress, toWalletId)
  console.log("[flow-smoke] Balances before -> from:", fromBefore, "to:", toBefore)

  const requestCadence = `
    import SMS2FlowCommandTransfer from ${commandContractAddress}

    transaction(fromWalletId: String, toWalletId: String, amount: UFix64, memo: String, confirmationKey: String) {
      prepare(signer: auth(BorrowValue) &Account) {}
      execute {
        SMS2FlowCommandTransfer.requestTransfer(
          fromWalletId: fromWalletId,
          toWalletId: toWalletId,
          amount: amount,
          memo: memo,
          confirmationKey: confirmationKey
        )
      }
    }
  `

  const request = await sendTransaction(requestCadence, [
    (arg, t) => arg(fromWalletId, t.String),
    (arg, t) => arg(toWalletId, t.String),
    (arg, t) => arg(amount, t.UFix64),
    (arg, t) => arg("flow-contract-smoke", t.String),
    (arg, t) => arg(confirmationKey, t.String),
  ])

  const transferId = parseTransferIdFromEvents(request.sealed.events)
  if (!transferId) {
    throw new Error("Could not parse transferId from TransferRequested event")
  }

  console.log("[flow-smoke] request tx:", request.txId, "transferId:", transferId)

  const confirmCadence = `
    import SMS2FlowCommandTransfer from ${commandContractAddress}

    transaction(transferId: UInt64, confirmationKey: String) {
      prepare(signer: auth(BorrowValue) &Account) {}
      execute {
        SMS2FlowCommandTransfer.confirmTransfer(transferId: transferId, confirmationKey: confirmationKey)
      }
    }
  `

  const confirm = await sendTransaction(confirmCadence, [
    (arg, t) => arg(String(transferId), t.UInt64),
    (arg, t) => arg(confirmationKey, t.String),
  ])

  const status = await getTransferStatus(commandContractAddress, transferId)
  const fromAfter = await getWalletBalance(walletContractAddress, fromWalletId)
  const toAfter = await getWalletBalance(walletContractAddress, toWalletId)

  console.log("[flow-smoke] confirm tx:", confirm.txId)
  console.log("[flow-smoke] transfer status:", status)
  console.log("[flow-smoke] Balances after -> from:", fromAfter, "to:", toAfter)

  if (status !== 2) {
    throw new Error(`Unexpected transfer status ${status}. Expected 2 (confirmed).`)
  }

  const deltaFrom = Number((fromBefore - fromAfter).toFixed(8))
  const deltaTo = Number((toAfter - toBefore).toFixed(8))
  const expected = Number(amount)

  if (deltaFrom < expected || deltaTo < expected) {
    throw new Error(
      `Unexpected wallet balance deltas. expected>=${expected}, got deltaFrom=${deltaFrom}, deltaTo=${deltaTo}`
    )
  }

  console.log("[flow-smoke] Write test passed. Confirmation gate is working on-chain.")
}

main().catch((error) => {
  console.error("[flow-smoke] FAILED:", error.message)
  process.exit(1)
})
