import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { purchaseMachineProduct, toDecimal8FromWei } from "@/lib/services/machine-onchain-service"

function isAuthorizedByToken(req) {
  const configuredToken = process.env.SMS_WEBHOOK_TOKEN
  if (!configuredToken) return false
  const received = req.headers.get("x-sms2flow-token")
  return received === configuredToken
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    const hasSession = Boolean(session?.user?.id)
    const hasWebhookToken = isAuthorizedByToken(request)

    if (!hasSession && !hasWebhookToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const machineId = Number(body.machineId)
    const productId = Number(body.productId)
    const smsReference = String(body.smsReference || "").trim()

    if (!Number.isInteger(machineId) || machineId <= 0) {
      return NextResponse.json({ error: "machineId must be a positive integer" }, { status: 400 })
    }

    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json({ error: "productId must be a positive integer" }, { status: 400 })
    }

    if (!smsReference) {
      return NextResponse.json({ error: "smsReference is required" }, { status: 400 })
    }

    const onchain = await purchaseMachineProduct({ machineId, productId, smsReference })

    const transaction = await prisma.transaction.create({
      data: {
        senderId: session?.user?.id || null,
        type: "SMS_PAYMENT",
        amount: toDecimal8FromWei(onchain.amountWei),
        fee: 0,
        currency: "BNB",
        status: "PENDING",
        network: "TESTNET",
        txHash: onchain.txHash,
        description: `Machine purchase ${machineId}/${productId}`,
        metadata: {
          source: "api-machines-purchase",
          machineId,
          productId,
          machinePurchaseId: onchain.purchaseId,
          smsReference,
          buyerAddress: onchain.buyer,
          blockNumber: onchain.blockNumber,
        },
      },
    })

    return NextResponse.json(
      {
        ok: true,
        transaction,
        onchain,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Machine purchase API error:", error)
    return NextResponse.json({ error: error.message || "Machine purchase failed" }, { status: 500 })
  }
}
