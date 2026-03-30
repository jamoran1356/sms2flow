import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { confirmMachineDispense } from "@/lib/services/machine-onchain-service"

function isAuthorized(req) {
  const configuredToken =
    process.env.MACHINE_CALLBACK_TOKEN ||
    process.env.MACHINE_IOT_WEBHOOK_SECRET ||
    process.env.SMS_WEBHOOK_TOKEN

  if (!configuredToken) return true
  const received = req.headers.get("x-machine-callback-token") || req.headers.get("x-sms2flow-token")
  return received === configuredToken
}

export async function POST(request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized machine callback" }, { status: 401 })
    }

    const body = await request.json()
    const purchaseId = Number(body.purchaseId)

    if (!Number.isInteger(purchaseId) || purchaseId <= 0) {
      return NextResponse.json({ error: "purchaseId must be a positive integer" }, { status: 400 })
    }

    const onchain = await confirmMachineDispense({ purchaseId })

    const pendingTransactions = await prisma.transaction.findMany({
      where: {
        status: "PENDING",
        type: "SMS_PAYMENT",
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    })

    const matched = pendingTransactions.find((tx) => Number(tx.metadata?.machinePurchaseId || 0) === purchaseId)

    let updatedTransaction = null
    if (matched) {
      updatedTransaction = await prisma.transaction.update({
        where: { id: matched.id },
        data: {
          status: "COMPLETED",
          metadata: {
            ...(matched.metadata || {}),
            stage: "DISPENSE_CONFIRMED",
            dispenseConfirmedAt: new Date().toISOString(),
            dispenseConfirmTxHash: onchain.txHash,
            dispenseConfirmBlockNumber: onchain.blockNumber,
          },
        },
      })
    }

    return NextResponse.json({
      ok: true,
      onchain,
      updatedTransaction,
    })
  } catch (error) {
    console.error("Dispense callback error:", error)
    return NextResponse.json({ error: error.message || "Dispense callback failed" }, { status: 500 })
  }
}
