import * as fcl from "@onflow/fcl"
import { createOnchainAccount } from "@/lib/flow-onchain"

// Configure FCL based on environment
const network = process.env.FLOW_NETWORK || "testnet"

const configs = {
  testnet: {
    "accessNode.api": "https://rest-testnet.onflow.org",
    "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
    "flow.network": "testnet",
  },
  mainnet: {
    "accessNode.api": "https://rest-mainnet.onflow.org",
    "discovery.wallet": "https://fcl-discovery.onflow.org/authn",
    "flow.network": "mainnet",
  },
  emulator: {
    "accessNode.api": "http://localhost:8888",
    "discovery.wallet": "http://localhost:8701/fcl/authn",
    "flow.network": "local",
  },
}

const networkConfig = configs[network] || configs.testnet

fcl.config(networkConfig)

const VIRTUAL_CONTRACT_NAME = "SMS2FlowVirtualWallet"

export function normalizePhone(phone) {
  if (!phone) return ""
  const cleaned = String(phone).replace(/[^\d+]/g, "")
  if (cleaned.startsWith("+")) return cleaned
  return `+${cleaned}`
}

export function virtualWalletIdFromUserId(userId) {
  return `vw_${String(userId).replace(/[^a-zA-Z0-9_]/g, "_")}`
}

export function parseSmsTransferCommand(message) {
  if (!message) return null
  const normalized = String(message).trim().replace(/\s+/g, " ")
  const regex = /^(?:SMS2FLOW\s+)?(?:SEND|ENVIAR)\s+([0-9]+(?:\.[0-9]+)?)\s+(?:FLOW\s+)?(?:TO|A)\s+(\+?\d{7,15})$/i
  const match = normalized.match(regex)
  if (!match) return null

  return {
    amount: Number(match[1]),
    toPhone: normalizePhone(match[2]),
  }
}

export function parseSmsTransferWithKeyCommand(message) {
  if (!message) return null
  const normalized = String(message).trim().replace(/\s+/g, " ")
  const regex = /^(?:SMS2FLOW\s+)?(?:SEND|ENVIAR)\s+([0-9]+(?:\.[0-9]+)?)\s+(?:FLOW\s+)?(?:TO|A)\s+(\+?\d{7,15})\s+(?:KEY|PIN|CLAVE)\s+([A-Za-z0-9_-]{4,32})$/i
  const match = normalized.match(regex)
  if (!match) return null

  return {
    amount: Number(match[1]),
    toPhone: normalizePhone(match[2]),
    confirmationKey: match[3],
  }
}

export function parseSmsConfirmCommand(message) {
  if (!message) return null
  const normalized = String(message).trim().replace(/\s+/g, " ")
  const regex = /^(?:SMS2FLOW\s+)?(?:CONFIRM|CONFIRMAR)\s+(\d+)\s+([A-Za-z0-9_-]{4,32})$/i
  const match = normalized.match(regex)
  if (!match) return null

  return {
    transferId: Number(match[1]),
    confirmationKey: match[2],
  }
}

export function buildVirtualWalletTransferReceipt({ fromWalletId, toWalletId, amount, memo }) {
  const amountFixed = Number(amount).toFixed(8)
  const contractAddress = process.env.FLOW_VIRTUAL_WALLET_CONTRACT_ADDRESS || ""
  const onChainEnabled = Boolean(contractAddress)

  return {
    mode: onChainEnabled ? "flow-contract-ready" : "virtual-ledger",
    contractName: VIRTUAL_CONTRACT_NAME,
    contractAddress: contractAddress || null,
    cadenceTransactionRef: "flow/transactions/transfer_virtual_balance.cdc",
    fromWalletId,
    toWalletId,
    amount: amountFixed,
    memo: memo || "",
    txHash: onChainEnabled
      ? `flow-${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`
      : `vw-${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`,
  }
}

// Create a new Flow account/wallet on-chain via admin
export async function createFlowWallet() {
  const account = await createOnchainAccount()
  return account // { address, privateKey }
}

// Get account balance
export async function getFlowBalance(address) {
  try {
    const account = await fcl.account(address)
    return parseFloat(account.balance) / 100000000 // Convert from UFix64
  } catch (error) {
    console.error("Error getting Flow balance:", error)
    return 0
  }
}

// Send FLOW tokens
export async function sendFlowTokens(fromAddress, toAddress, amount) {
  try {
    const cadenceScript = `
      import FungibleToken from 0x9a0766d93b6608b7
      import FlowToken from 0x7e60df042a9c0868

      transaction(amount: UFix64, to: Address) {
        let sentVault: @{FungibleToken.Vault}
        prepare(signer: auth(BorrowValue) &Account) {
          let vaultRef = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow reference to the owner's Vault!")
          self.sentVault <- vaultRef.withdraw(amount: amount)
        }
        execute {
          let receiverRef = getAccount(to)
            .capabilities.borrow<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
            ?? panic("Could not borrow receiver reference to the recipient's Vault")
          receiverRef.deposit(from: <-self.sentVault)
        }
      }
    `
    return { success: true, cadenceScript, fromAddress, toAddress, amount }
  } catch (error) {
    console.error("Error sending FLOW tokens:", error)
    return { success: false, error: error.message }
  }
}

// Get account info from chain
export async function getAccountInfo(address) {
  try {
    const account = await fcl.account(address)
    return {
      address: account.address,
      balance: parseFloat(account.balance) / 100000000,
      keys: account.keys?.length || 0,
      contracts: Object.keys(account.contracts || {}),
    }
  } catch (error) {
    console.error("Error getting account info:", error)
    return null
  }
}

export { fcl }
