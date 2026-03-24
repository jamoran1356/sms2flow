import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { normalizePhone, parseSmsTransferCommand } from "@/lib/flow"
import { performVirtualWalletTransfer } from "@/lib/services/virtual-wallet-service"

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

    const parsed = parseSmsTransferCommand(rawMessage)

    const senderUser = await prisma.user.findFirst({ where: { phone: fromPhone } })

    const smsRecord = await prisma.smsMessage.create({
      data: {
        userId: senderUser?.id || null,
        fromPhone,
        toPhone: process.env.SMS_INBOX_NUMBER || "sms2flow",
        message: rawMessage,
        command: parsed ? "SEND" : "UNKNOWN",
        amount: parsed?.amount || null,
        status: "received",
      },
    })

    if (!senderUser) {
      await prisma.smsMessage.update({ where: { id: smsRecord.id }, data: { status: "failed" } })
      return NextResponse.json({ error: "Sender phone not registered" }, { status: 404 })
    }

    if (!parsed) {
      await prisma.smsMessage.update({ where: { id: smsRecord.id }, data: { status: "failed" } })
      return NextResponse.json({
        error: "Invalid command format",
        expected: "SEND <amount> FLOW TO <phone>",
      }, { status: 400 })
    }

    const transaction = await performVirtualWalletTransfer({
      senderUserId: senderUser.id,
      amount: parsed.amount,
      toPhone: parsed.toPhone,
      type: "SMS_PAYMENT",
      description: `SMS transfer to ${parsed.toPhone}`,
      metadata: {
        source: "sms-command",
        smsMessageId: smsRecord.id,
        rawMessage,
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
      transaction,
      message: `Transfer completed: ${parsed.amount} FLOW to ${parsed.toPhone}`,
    }, { status: 201 })
  } catch (error) {
    console.error("SMS processing error:", error)
    return NextResponse.json({ error: error.message || "SMS processing failed" }, { status: 500 })
  }
}
