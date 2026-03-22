import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET /api/dashboard - Get dashboard stats for current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Get wallet info
    const wallets = await prisma.wallet.findMany({
      where: { userId },
    })

    const totalBalance = wallets.reduce(
      (sum, w) => sum + parseFloat(w.balance),
      0
    )

    // Get transactions count
    const transactionsCount = await prisma.transaction.count({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
    })

    // Recent transactions
    const recentTransactions = await prisma.transaction.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        sender: { select: { name: true, email: true } },
        receiver: { select: { name: true, email: true } },
      },
    })

    // SMS payments count
    const smsCount = await prisma.transaction.count({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
        type: "SMS_PAYMENT",
      },
    })

    // Staking positions
    const stakingPositions = await prisma.stakingPosition.findMany({
      where: { userId, status: "ACTIVE" },
      include: { pool: true },
    })

    const totalStaked = stakingPositions.reduce(
      (sum, p) => sum + parseFloat(p.amount),
      0
    )

    // Customers count
    const customersCount = await prisma.customer.count({
      where: { userId },
    })

    // Monthly comparison
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const thisMonthTx = await prisma.transaction.count({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
        createdAt: { gte: startOfMonth },
      },
    })

    const lastMonthTx = await prisma.transaction.count({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
        createdAt: { gte: startOfLastMonth, lt: startOfMonth },
      },
    })

    const txGrowth =
      lastMonthTx > 0
        ? (((thisMonthTx - lastMonthTx) / lastMonthTx) * 100).toFixed(1)
        : 0

    return NextResponse.json({
      totalBalance,
      transactionsCount,
      smsCount,
      customersCount,
      totalStaked,
      txGrowth,
      recentTransactions,
      wallets,
      stakingPositions,
    })
  } catch (error) {
    console.error("Dashboard error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
