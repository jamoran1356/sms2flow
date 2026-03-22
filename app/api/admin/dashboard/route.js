import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const [
      totalUsers,
      activeUsers,
      totalTransactions,
      totalSmsPayments,
      totalStaked,
      recentTransactions,
      recentUsers,
      networkConfigs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.transaction.count(),
      prisma.transaction.count({ where: { type: "SMS_PAYMENT" } }),
      prisma.stakingPosition.aggregate({
        where: { status: "ACTIVE" },
        _sum: { amount: true },
      }),
      prisma.transaction.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          sender: { select: { name: true, email: true, phone: true } },
          receiver: { select: { name: true, email: true, phone: true } },
        },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          _count: { select: { wallets: true, transactionsSent: true } },
        },
      }),
      prisma.networkConfig.findMany(),
    ])

    // Volume stats
    const volumeResult = await prisma.transaction.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true, fee: true },
    })

    return NextResponse.json({
      stats: {
        totalUsers,
        activeUsers,
        totalTransactions,
        totalSmsPayments,
        totalStaked: totalStaked._sum.amount || 0,
        totalVolume: volumeResult._sum.amount || 0,
        totalFees: volumeResult._sum.fee || 0,
      },
      recentTransactions,
      recentUsers,
      networkConfigs,
    })
  } catch (error) {
    console.error("Admin dashboard error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}
