import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { performVirtualWalletTransfer } from "@/lib/services/virtual-wallet-service"

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
    const { toAddress, toPhone, amount, type, description } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Monto inválido" }, { status: 400 })
    }

    const transaction = await performVirtualWalletTransfer({
      senderUserId: session.user.id,
      amount,
      toAddress,
      toPhone,
      type: type || "TRANSFER",
      description,
      metadata: {
        source: "dashboard-api",
        requestedToAddress: toAddress || null,
        requestedToPhone: toPhone || null,
      },
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "TRANSACTION_CREATE",
        entity: "Transaction",
        entityId: transaction.id,
        details: { type, amount, toAddress, toPhone },
      },
    })

    return NextResponse.json({ transaction }, { status: 201 })
  } catch (error) {
    console.error("Transaction create error:", error)
    return NextResponse.json({ error: "Error creando transacción" }, { status: 500 })
  }
}
