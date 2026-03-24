import prisma from "@/lib/prisma"
import { buildVirtualWalletTransferReceipt, normalizePhone, virtualWalletIdFromUserId } from "@/lib/flow"
import { getContractAddresses, hasFlowAdminConfig, sendTransaction } from "@/lib/flow-onchain"

function normalizeAmount(amount) {
  const parsed = Number(amount)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error("Invalid amount")
  }
  return parsed
}

export async function performVirtualWalletTransfer({
  senderUserId,
  amount,
  toAddress,
  toPhone,
  type = "TRANSFER",
  description,
  metadata = {},
}) {
  if (!senderUserId) {
    throw new Error("Missing sender user")
  }

  const normalizedAmount = normalizeAmount(amount)

  const senderWallet = await prisma.wallet.findFirst({
    where: { userId: senderUserId, isDefault: true },
    include: { user: true },
  })

  if (!senderWallet) {
    throw new Error("Sender wallet not configured")
  }

  let receiverWallet = null

  if (toAddress && String(toAddress).startsWith("0x")) {
    receiverWallet = await prisma.wallet.findUnique({
      where: { address: String(toAddress) },
      include: { user: true },
    })
  }

  if (!receiverWallet && toPhone) {
    const phone = normalizePhone(toPhone)
    const receiverUser = await prisma.user.findFirst({ where: { phone } })
    if (receiverUser) {
      receiverWallet = await prisma.wallet.findFirst({
        where: { userId: receiverUser.id, isDefault: true },
        include: { user: true },
      })
    }
  }

  if (!receiverWallet) {
    throw new Error("Receiver wallet not found")
  }

  if (senderWallet.userId === receiverWallet.userId) {
    throw new Error("Cannot transfer to the same wallet owner")
  }

  const senderBalance = Number(senderWallet.balance)
  if (senderBalance < normalizedAmount) {
    throw new Error("Insufficient balance")
  }

  const senderVirtualWalletId = virtualWalletIdFromUserId(senderWallet.userId)
  const receiverVirtualWalletId = virtualWalletIdFromUserId(receiverWallet.userId)

  const contracts = getContractAddresses()
  let onChainReceipt = null

  if (hasFlowAdminConfig() && contracts.virtualWallet) {
    const cadence = `
      import SMS2FlowVirtualWallet from 0xVIRTUAL_WALLET

      transaction(fromWalletId: String, toWalletId: String, amount: UFix64, memo: String) {
        prepare(signer: auth(BorrowValue) &Account) {}
        execute {
          SMS2FlowVirtualWallet.transfer(
            fromWalletId: fromWalletId,
            toWalletId: toWalletId,
            amount: amount,
            memo: memo
          )
        }
      }
    `

    const result = await sendTransaction({
      cadence,
      imports: {
        "0xVIRTUAL_WALLET": contracts.virtualWallet,
      },
      args: (arg, t) => [
        arg(senderVirtualWalletId, t.String),
        arg(receiverVirtualWalletId, t.String),
        arg(normalizedAmount.toFixed(8), t.UFix64),
        arg(description || `SMS2FLOW ${type}`, t.String),
      ],
    })

    if (result.statusCode !== 0) {
      throw new Error(result.errorMessage || "On-chain transfer failed")
    }

    onChainReceipt = {
      mode: "onchain",
      txId: result.txId,
      status: result.status,
      statusCode: result.statusCode,
      events: result.events,
      contractAddress: contracts.virtualWallet,
      contractName: "SMS2FlowVirtualWallet",
    }
  }

  const fallbackReceipt = buildVirtualWalletTransferReceipt({
    fromWalletId: senderVirtualWalletId,
    toWalletId: receiverVirtualWalletId,
    amount: normalizedAmount,
    memo: description || `SMS2FLOW ${type}`,
  })

  const executionReceipt = onChainReceipt || fallbackReceipt

  const transaction = await prisma.$transaction(async (tx) => {
    await tx.wallet.update({
      where: { id: senderWallet.id },
      data: { balance: { decrement: normalizedAmount } },
    })

    await tx.wallet.update({
      where: { id: receiverWallet.id },
      data: { balance: { increment: normalizedAmount } },
    })

    return tx.transaction.create({
      data: {
        senderId: senderWallet.userId,
        receiverId: receiverWallet.userId,
        fromWalletId: senderWallet.id,
        toWalletId: receiverWallet.id,
        type,
        amount: normalizedAmount,
        fee: 0.001,
        currency: "FLOW",
        status: "COMPLETED",
        network: senderWallet.network,
        description: description || `Transfer to ${receiverWallet.user.phone || receiverWallet.address}`,
        txHash: executionReceipt.txId || executionReceipt.txHash,
        metadata: {
          ...metadata,
          execution: executionReceipt,
          virtualWallet: {
            fromWalletId: senderVirtualWalletId,
            toWalletId: receiverVirtualWalletId,
            contract: "SMS2FlowVirtualWallet",
          },
          recipient: {
            phone: receiverWallet.user.phone,
            address: receiverWallet.address,
          },
        },
      },
      include: {
        sender: { select: { id: true, name: true, email: true, phone: true } },
        receiver: { select: { id: true, name: true, email: true, phone: true } },
        fromWallet: { select: { address: true, network: true } },
        toWallet: { select: { address: true, network: true } },
      },
    })
  })

  return transaction
}
