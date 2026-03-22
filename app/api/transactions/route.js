import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status")
    const type = searchParams.get("type")

    const userId = session.user.id
    const isAdmin = session.user.role === "ADMIN"

    const where = {
      ...(isAdmin
        ? {}
        : { OR: [{ senderId: userId }, { receiverId: userId }] }),
      ...(status ? { status } : {}),
      ...(type ? { type } : {}),
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          sender: { select: { id: true, name: true, email: true, phone: true } },
          receiver: { select: { id: true, name: true, email: true, phone: true } },
          fromWallet: { select: { address: true, network: true } },
          toWallet: { select: { address: true, network: true } },
        },
      }),
      prisma.transaction.count({ where }),
    ])

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Transactions error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { toAddress, amount, type, description } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Monto inválido" }, { status: 400 })
    }

    const senderWallet = await prisma.wallet.findFirst({
      where: { userId: session.user.id, isDefault: true },
    })

    if (!senderWallet) {
      return NextResponse.json({ error: "No tienes una billetera configurada" }, { status: 400 })
    }

    if (parseFloat(senderWallet.balance) < amount) {
      return NextResponse.json({ error: "Saldo insuficiente" }, { status: 400 })
    }

    // Find receiver wallet
    let receiverWallet = null
    let receiverId = null
    if (toAddress) {
      receiverWallet = await prisma.wallet.findUnique({
        where: { address: toAddress },
        include: { user: true },
      })
      receiverId = receiverWallet?.userId || null
    }

    // Create transaction
    const transaction = await prisma.$transaction(async (tx) => {
      // Deduct from sender
      await tx.wallet.update({
        where: { id: senderWallet.id },
        data: {
          balance: { decrement: amount },
        },
      })

      // Add to receiver if internal
      if (receiverWallet) {
        await tx.wallet.update({
          where: { id: receiverWallet.id },
          data: {
            balance: { increment: amount },
          },
        })
      }

      // Create transaction record
      return tx.transaction.create({
        data: {
          senderId: session.user.id,
          receiverId,
          fromWalletId: senderWallet.id,
          toWalletId: receiverWallet?.id || null,
          type: type || "TRANSFER",
          amount,
          fee: 0.001,
          currency: "FLOW",
          status: "COMPLETED",
          network: senderWallet.network,
          description,
          txHash: `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`,
        },
      })
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "TRANSACTION_CREATE",
        entity: "Transaction",
        entityId: transaction.id,
        details: { type, amount, toAddress },
      },
    })

    return NextResponse.json({ transaction }, { status: 201 })
  } catch (error) {
    console.error("Transaction create error:", error)
    return NextResponse.json({ error: "Error creando transacción" }, { status: 500 })
  }
}
