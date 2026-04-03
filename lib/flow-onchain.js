import * as fcl from "@onflow/fcl"
import { SHA3 } from "sha3"
import elliptic from "elliptic"

const ec = new elliptic.ec("p256")

let configured = false

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

export function configureFlowOnchain() {
  if (configured) return

  const accessNode = process.env.FLOW_ACCESS_NODE || "https://rest-testnet.onflow.org"
  const network = process.env.FLOW_NETWORK || "testnet"

  fcl.config({
    "accessNode.api": accessNode,
    "flow.network": network,
  })

  configured = true
}

export function hasFlowAdminConfig() {
  return Boolean(process.env.FLOW_ADMIN_ADDRESS && process.env.FLOW_ADMIN_PRIVATE_KEY)
}

export function getContractAddresses() {
  return {
    virtualWallet: withPrefix(process.env.FLOW_VIRTUAL_WALLET_CONTRACT_ADDRESS),
    commandTransfer: withPrefix(process.env.FLOW_COMMAND_TRANSFER_CONTRACT_ADDRESS),
    staking: withPrefix(process.env.FLOW_STAKING_CONTRACT_ADDRESS),
    p2p: withPrefix(process.env.FLOW_P2P_CONTRACT_ADDRESS),
    defi: withPrefix(process.env.FLOW_DEFI_CONTRACT_ADDRESS),
  }
}

export function getAdminAuthorization() {
  const address = withPrefix(process.env.FLOW_ADMIN_ADDRESS)
  const privateKey = process.env.FLOW_ADMIN_PRIVATE_KEY
  const keyId = Number(process.env.FLOW_ADMIN_KEY_ID || 0)

  if (!address || !privateKey) {
    throw new Error("Flow admin credentials are missing")
  }

  return (account) => ({
    ...account,
    addr: fcl.withPrefix(address),
    keyId,
    tempId: `${address}-${keyId}`,
    signingFunction: async (signable) => {
      const signature = signWithPrivateKey(privateKey, signable.message)
      return {
        addr: fcl.withPrefix(address),
        keyId,
        signature,
      }
    },
  })
}

function replaceImports(cadence, imports = {}) {
  let code = cadence
  Object.entries(imports).forEach(([placeholder, value]) => {
    code = code.replaceAll(placeholder, value)
  })
  return code
}

export async function sendTransaction({ cadence, args, imports = {}, limit = 9999 }) {
  configureFlowOnchain()
  const admin = getAdminAuthorization()
  const preparedCadence = replaceImports(cadence, imports)

  const txId = await fcl.mutate({
    cadence: preparedCadence,
    args,
    proposer: admin,
    payer: admin,
    authorizations: [admin],
    limit,
  })

  const sealed = await fcl.tx(txId).onceSealed()
  return {
    txId,
    status: sealed.status,
    statusCode: sealed.statusCode,
    errorMessage: sealed.errorMessage,
    events: sealed.events || [],
  }
}

export async function runScript({ cadence, args = [], imports = {} }) {
  configureFlowOnchain()
  const preparedCadence = replaceImports(cadence, imports)

  return fcl.query({
    cadence: preparedCadence,
    args,
  })
}

/**
 * Create a real Flow account on-chain using the admin as payer.
 * Returns { address, privateKey } with a valid testnet/emulator address.
 */
export async function createOnchainAccount() {
  configureFlowOnchain()

  // Generate a new ECDSA_P256 key pair
  const keyPair = ec.genKeyPair()
  const privateKey = keyPair.getPrivate("hex")
  // Uncompressed public key without the 04 prefix
  const publicKey = keyPair.getPublic("hex").slice(2)

  const cadence = `
    transaction(publicKey: String) {
      prepare(signer: auth(BorrowValue) &Account) {
        let key = PublicKey(
          publicKey: publicKey.decodeHex(),
          signatureAlgorithm: SignatureAlgorithm.ECDSA_P256
        )
        let account = Account(payer: signer)
        account.keys.add(
          publicKey: key,
          hashAlgorithm: HashAlgorithm.SHA3_256,
          weight: 1000.0
        )
      }
    }
  `

  const result = await sendTransaction({
    cadence,
    args: (arg, t) => [arg(publicKey, t.String)],
  })

  if (result.statusCode !== 0) {
    throw new Error(`Account creation failed: ${result.errorMessage || "unknown error"}`)
  }

  const createdEvent = result.events.find((e) => e.type === "flow.AccountCreated")
  if (!createdEvent) {
    throw new Error("Account creation failed: no AccountCreated event")
  }

  return {
    address: withPrefix(createdEvent.data.address),
    privateKey,
  }
}
