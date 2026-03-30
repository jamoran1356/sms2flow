import { ethers } from "ethers"
import { MachineRegistryService } from "@/lib/blockchain/machines"

function getRpcUrl() {
  return process.env.BSC_TESTNET_RPC || process.env.BSC_MAINNET_RPC
}

function getOperatorPrivateKey() {
  return process.env.MACHINE_OPERATOR_PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY
}

function getRegistryAddress() {
  return process.env.MACHINE_REGISTRY_ADDRESS
}

function ensureConfig() {
  const rpcUrl = getRpcUrl()
  const privateKey = getOperatorPrivateKey()
  const registryAddress = getRegistryAddress()

  if (!rpcUrl) {
    throw new Error("Missing BSC RPC URL. Set BSC_TESTNET_RPC or BSC_MAINNET_RPC")
  }
  if (!privateKey) {
    throw new Error("Missing operator private key. Set MACHINE_OPERATOR_PRIVATE_KEY or DEPLOYER_PRIVATE_KEY")
  }
  if (!registryAddress) {
    throw new Error("Missing MACHINE_REGISTRY_ADDRESS")
  }

  return { rpcUrl, privateKey, registryAddress }
}

function parseTxForEvent(contract, receipt, eventName) {
  for (const log of receipt.logs || []) {
    try {
      const parsed = contract.interface.parseLog(log)
      if (parsed?.name === eventName) {
        return parsed
      }
    } catch {
      // ignore logs from other contracts
    }
  }
  return null
}

export function toDecimal8FromWei(amountWei) {
  const asEther = ethers.formatEther(amountWei)
  return Number(asEther).toFixed(8)
}

function getSignerService() {
  const { rpcUrl, privateKey, registryAddress } = ensureConfig()
  const provider = new ethers.JsonRpcProvider(rpcUrl)
  const signer = new ethers.Wallet(privateKey, provider)
  const service = MachineRegistryService.fromSigner(signer, registryAddress)
  return { provider, signer, service }
}

export async function purchaseMachineProduct({ machineId, productId, smsReference }) {
  const { service } = getSignerService()
  const product = await service.getProduct(productId)

  const tx = await service.purchaseProduct(
    machineId,
    productId,
    smsReference,
    product.priceWei,
  )

  const receipt = await tx.wait()
  const event = receipt ? parseTxForEvent(service.raw(), receipt, "ProductPurchased") : null

  return {
    txHash: tx.hash,
    blockNumber: receipt?.blockNumber || null,
    amountWei: product.priceWei,
    purchaseId: event?.args?.purchaseId ? Number(event.args.purchaseId) : null,
    buyer: event?.args?.buyer || null,
    machineId: event?.args?.machineId ? Number(event.args.machineId) : Number(machineId),
    productId: event?.args?.productId ? Number(event.args.productId) : Number(productId),
    smsReference,
  }
}

export async function confirmMachineDispense({ purchaseId }) {
  const { service } = getSignerService()
  const tx = await service.confirmDispense(purchaseId)
  const receipt = await tx.wait()

  return {
    txHash: tx.hash,
    blockNumber: receipt?.blockNumber || null,
    purchaseId: Number(purchaseId),
  }
}
