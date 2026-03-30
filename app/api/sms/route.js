import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import {
  normalizePhone,
  parseSmsConfirmCommand,
  parseSmsTransferWithKeyCommand,
  virtualWalletIdFromUserId,
} from "@/lib/flow"
import { getContractAddresses, hasFlowAdminConfig, sendTransaction } from "@/lib/flow-onchain"
import { purchaseMachineProduct, toDecimal8FromWei } from "@/lib/services/machine-onchain-service"

function parseSmsMachineBuyCommand(message) {
  const text = String(message || "").trim()
  // BUY <machineId> <productId> [REF <reference>]
  const match = text.match(/^BUY\s+(\d+)\s+(\d+)(?:\s+REF\s+([A-Za-z0-9_:\-.]+))?$/i)
  if (!match) return null

  return {
    machineId: Number(match[1]),
    productId: Number(match[2]),
    smsReference: match[3] || null,
  }
}

function isAuthorized(req) {
  const configuredToken = process.env.SMS_WEBHOOK_TOKEN
  if (!configuredToken) return true
  const received = req.headers.get("x-sms2flow-token")
  return received === configuredToken
}

export async function POST(request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized SMS webhook" }, { status: 401 })
    }

    const body = await request.json()
    const rawFromPhone = body.fromPhone || body.from || ""
    const rawMessage = body.message || body.body || ""
    const fromPhone = normalizePhone(rawFromPhone)

    if (!fromPhone || !rawMessage) {
      return NextResponse.json({ error: "fromPhone and message are required" }, { status: 400 })
    }

    const parsedTransfer = parseSmsTransferWithKeyCommand(rawMessage)
    const parsedConfirm = parseSmsConfirmCommand(rawMessage)
    const parsedMachineBuy = parseSmsMachineBuyCommand(rawMessage)

    const senderUser = await prisma.user.findFirst({ where: { phone: fromPhone } })

    const smsRecord = await prisma.smsMessage.create({
      data: {
        userId: senderUser?.id || null,
        fromPhone,
        toPhone: process.env.SMS_INBOX_NUMBER || "sms2flow",
        message: rawMessage,
        command: parsedTransfer ? "SEND" : parsedConfirm ? "CONFIRM" : parsedMachineBuy ? "MACHINE_BUY" : "UNKNOWN",
        amount: parsedTransfer?.amount || null,
        status: "received",
      },
    })

    if (!senderUser) {
      await prisma.smsMessage.update({ where: { id: smsRecord.id }, data: { status: "failed" } })
      return NextResponse.json({ error: "Sender phone not registered" }, { status: 404 })
    }

    if (!parsedTransfer && !parsedConfirm && !parsedMachineBuy) {
      await prisma.smsMessage.update({ where: { id: smsRecord.id }, data: { status: "failed" } })
      return NextResponse.json({
        error: "Invalid command format",
        expected: "SEND <amount> FLOW TO <phone> KEY <pin> OR CONFIRM <transferId> <pin> OR BUY <machineId> <productId> [REF <reference>]",
      }, { status: 400 })
    }

    if (parsedMachineBuy) {
      const generatedReference = `SMS-${smsRecord.id}`
      const smsReference = parsedMachineBuy.smsReference || generatedReference

      const onchain = await purchaseMachineProduct({
        machineId: parsedMachineBuy.machineId,
        productId: parsedMachineBuy.productId,
        smsReference,
      })

      const machineTx = await prisma.transaction.create({
        data: {
          senderId: senderUser.id,
          type: "SMS_PAYMENT",
          amount: toDecimal8FromWei(onchain.amountWei),
          fee: 0,
          currency: "BNB",
          status: "PENDING",
          network: "TESTNET",
          txHash: onchain.txHash,
          description: `SMS machine purchase ${parsedMachineBuy.machineId}/${parsedMachineBuy.productId}`,
          metadata: {
            source: "sms-command-machine-buy",
            smsMessageId: smsRecord.id,
            machineId: parsedMachineBuy.machineId,
            productId: parsedMachineBuy.productId,
            machinePurchaseId: onchain.purchaseId,
            smsReference,
            fromPhone,
            buyerAddress: onchain.buyer,
            blockNumber: onchain.blockNumber,
          },
        },
      })

      await prisma.smsMessage.update({
        where: { id: smsRecord.id },
        data: {
          status: "processed",
          processedAt: new Date(),
        },
      })

      return NextResponse.json({
        ok: true,
        transaction: machineTx,
        purchaseId: onchain.purchaseId,
        message: `Purchase registered. machine=${parsedMachineBuy.machineId} product=${parsedMachineBuy.productId} purchaseId=${onchain.purchaseId ?? "pending"}`,
      }, { status: 201 })
    }

    if (!hasFlowAdminConfig()) {
      await prisma.smsMessage.update({ where: { id: smsRecord.id }, data: { status: "failed" } })
      return NextResponse.json({ error: "Flow admin config missing" }, { status: 500 })
    }

    const contracts = getContractAddresses()
    if (!contracts.commandTransfer) {
      await prisma.smsMessage.update({ where: { id: smsRecord.id }, data: { status: "failed" } })
      return NextResponse.json({ error: "Command transfer contract not configured" }, { status: 500 })
    }

    if (parsedTransfer) {
      const senderWallet = await prisma.wallet.findFirst({
        where: { userId: senderUser.id, isDefault: true },
      })

      if (!senderWallet) {
        await prisma.smsMessage.update({ where: { id: smsRecord.id }, data: { status: "failed" } })
        return NextResponse.json({ error: "Sender wallet not configured" }, { status: 400 })
      }

      const receiverUser = await prisma.user.findFirst({ where: { phone: parsedTransfer.toPhone } })
      if (!receiverUser) {
        await prisma.smsMessage.update({ where: { id: smsRecord.id }, data: { status: "failed" } })
        return NextResponse.json({ error: "Receiver phone not registered" }, { status: 404 })
      }

      const receiverWallet = await prisma.wallet.findFirst({
        where: { userId: receiverUser.id, isDefault: true },
      })

      if (!receiverWallet) {
        await prisma.smsMessage.update({ where: { id: smsRecord.id }, data: { status: "failed" } })
        return NextResponse.json({ error: "Receiver wallet not configured" }, { status: 400 })
      }

      if (Number(senderWallet.balance) < parsedTransfer.amount) {
        await prisma.smsMessage.update({ where: { id: smsRecord.id }, data: { status: "failed" } })
        return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
      }

      const fromWalletId = virtualWalletIdFromUserId(senderUser.id)
      const toWalletId = virtualWalletIdFromUserId(receiverUser.id)

      const requestTx = await sendTransaction({
        cadence: `
          import SMS2FlowCommandTransfer from 0xCOMMAND_TRANSFER

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
        `,
        imports: { "0xCOMMAND_TRANSFER": contracts.commandTransfer },
        args: (arg, t) => [
          arg(fromWalletId, t.String),
          arg(toWalletId, t.String),
          arg(parsedTransfer.amount.toFixed(8), t.UFix64),
          arg(`SMS transfer to ${parsedTransfer.toPhone}`, t.String),
          arg(parsedTransfer.confirmationKey, t.String),
        ],
      })

      if (requestTx.statusCode !== 0) {
        await prisma.smsMessage.update({ where: { id: smsRecord.id }, data: { status: "failed" } })
        return NextResponse.json({ error: requestTx.errorMessage || "On-chain request failed" }, { status: 500 })
      }

      const transferIdEvent = (requestTx.events || []).find((e) =>
        String(e.type || "").includes("SMS2FlowCommandTransfer.TransferRequested")
      )
      const transferId = Number(
        transferIdEvent?.data?.transferId ||
        transferIdEvent?.payload?.value?.fields?.find((f) => f.name === "transferId")?.value?.value ||
        0
      )

      if (!transferId) {
        await prisma.smsMessage.update({ where: { id: smsRecord.id }, data: { status: "failed" } })
        return NextResponse.json({ error: "Could not resolve transferId from event" }, { status: 500 })
      }

      const pendingTx = await prisma.transaction.create({
        data: {
          senderId: senderUser.id,
          receiverId: receiverUser.id,
          fromWalletId: senderWallet.id,
          toWalletId: receiverWallet.id,
          type: "SMS_PAYMENT",
          amount: parsedTransfer.amount,
          fee: 0.001,
          currency: "FLOW",
          status: "PENDING",
          network: senderWallet.network,
          description: `Pending SMS transfer to ${parsedTransfer.toPhone}`,
          txHash: requestTx.txId,
          metadata: {
            source: "sms-command",
            smsMessageId: smsRecord.id,
            flowCommandTransferId: transferId,
            fromPhone,
            toPhone: parsedTransfer.toPhone,
            confirmationKeyHint: `***${parsedTransfer.confirmationKey.slice(-2)}`,
            stage: "REQUESTED",
          },
        },
      })

      await prisma.smsMessage.update({
        where: { id: smsRecord.id },
        data: { status: "processed", processedAt: new Date() },
      })

      return NextResponse.json({
        ok: true,
        transaction: pendingTx,
        transferId,
        message: `Transfer requested. Reply: CONFIRM ${transferId} ${parsedTransfer.confirmationKey}`,
      }, { status: 201 })
    }

    const pendingTransactions = await prisma.transaction.findMany({
      where: {
        senderId: senderUser.id,
        status: "PENDING",
        type: "SMS_PAYMENT",
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    const pending = pendingTransactions.find((tx) => Number(tx.metadata?.flowCommandTransferId || 0) === parsedConfirm.transferId)

    if (!pending) {
      await prisma.smsMessage.update({ where: { id: smsRecord.id }, data: { status: "failed" } })
      return NextResponse.json({ error: "Pending transfer not found" }, { status: 404 })
    }

    const confirmTx = await sendTransaction({
      cadence: `
        import SMS2FlowCommandTransfer from 0xCOMMAND_TRANSFER

        transaction(transferId: UInt64, confirmationKey: String) {
          prepare(signer: auth(BorrowValue) &Account) {}
          execute {
            SMS2FlowCommandTransfer.confirmTransfer(transferId: transferId, confirmationKey: confirmationKey)
          }
        }
      `,
      imports: { "0xCOMMAND_TRANSFER": contracts.commandTransfer },
      args: (arg, t) => [
        arg(String(parsedConfirm.transferId), t.UInt64),
        arg(parsedConfirm.confirmationKey, t.String),
      ],
    })

    if (confirmTx.statusCode !== 0) {
      await prisma.smsMessage.update({ where: { id: smsRecord.id }, data: { status: "failed" } })
      return NextResponse.json({ error: confirmTx.errorMessage || "On-chain confirmation failed" }, { status: 500 })
    }

    const completedTx = await prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: pending.fromWalletId },
        data: { balance: { decrement: Number(pending.amount) } },
      })

      await tx.wallet.update({
        where: { id: pending.toWalletId },
        data: { balance: { increment: Number(pending.amount) } },
      })

      return tx.transaction.update({
        where: { id: pending.id },
        data: {
          status: "COMPLETED",
          txHash: confirmTx.txId,
          metadata: {
            ...(pending.metadata || {}),
            stage: "CONFIRMED",
            confirmedBySmsMessageId: smsRecord.id,
            confirmedAt: new Date().toISOString(),
            confirmationTxId: confirmTx.txId,
          },
        },
      })
    })

    await prisma.smsMessage.update({
      where: { id: smsRecord.id },
      data: {
        status: "processed",
        processedAt: new Date(),
      },
    })

    return NextResponse.json({
      ok: true,
      transaction: completedTx,
      message: `Transfer ${parsedConfirm.transferId} confirmed and funds sent.`,
    }, { status: 201 })
  } catch (error) {
    console.error("SMS processing error:", error)
    return NextResponse.json({ error: error.message || "SMS processing failed" }, { status: 500 })
  }
}
