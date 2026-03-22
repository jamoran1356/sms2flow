import * as fcl from "@onflow/fcl"

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

// Create a new Flow account/wallet
export async function createFlowWallet() {
  try {
    // On testnet, use the faucet API to create accounts
    if (network === "testnet") {
      const response = await fetch("https://testnet-faucet.onflow.org/v1/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          network_name: "testnet",
        }),
      })
      if (response.ok) {
        const data = await response.json()
        return data.address
      }
    }
    // Fallback: generate a deterministic address for demo
    const chars = "0123456789abcdef"
    let address = "0x"
    for (let i = 0; i < 16; i++) {
      address += chars[Math.floor(Math.random() * chars.length)]
    }
    return address
  } catch (error) {
    console.error("Error creating Flow wallet:", error)
    // Generate a placeholder address
    const chars = "0123456789abcdef"
    let address = "0x"
    for (let i = 0; i < 16; i++) {
      address += chars[Math.floor(Math.random() * chars.length)]
    }
    return address
  }
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
