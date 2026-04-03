import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { normalizePhone } from "@/lib/flow"
import { processSmsCommand, identifyCommand } from "@/lib/services/sms-command-processor"
import { purchaseMachineProduct, toDecimal8FromWei } from "@/lib/services/machine-onchain-service"

function parseSmsMachineBuyCommand(message) {
  const text = String(message || "").trim()
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

    // MACHINE_BUY uses BSC — handle separately
    const parsedMachineBuy = parseSmsMachineBuyCommand(rawMessage)
    if (parsedMachineBuy) {
      const senderUser = await prisma.user.findFirst({ where: { phone: fromPhone } })

      const smsRecord = await prisma.smsMessage.create({
        data: {
          userId: senderUser?.id || null,
          fromPhone,
          toPhone: process.env.SMS_INBOX_NUMBER || "sms2flow",
          message: rawMessage,
          command: "MACHINE_BUY",
          status: "received",
        },
      })

      if (!senderUser) {
        await prisma.smsMessage.update({ where: { id: smsRecord.id }, data: { status: "failed" } })
        return NextResponse.json({ error: "Sender phone not registered" }, { status: 404 })
      }

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
        data: { status: "processed", processedAt: new Date() },
      })

      return NextResponse.json({
        ok: true,
        transaction: machineTx,
        purchaseId: onchain.purchaseId,
        message: `Purchase registered. machine=${parsedMachineBuy.machineId} product=${parsedMachineBuy.productId} purchaseId=${onchain.purchaseId ?? "pending"}`,
      }, { status: 201 })
    }

    // All other commands go through the shared processor
    const result = await processSmsCommand(fromPhone, rawMessage, { source: "webhook" })

    const status = result.ok ? 200 : 400
    return NextResponse.json(result, { status })
  } catch (error) {
    console.error("SMS processing error:", error)
    return NextResponse.json({ error: error.message || "SMS processing failed" }, { status: 500 })
  }
}
