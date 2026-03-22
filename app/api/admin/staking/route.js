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

    const [pools, positions] = await Promise.all([
      prisma.stakingPool.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { positions: true } },
        },
      }),
      prisma.stakingPosition.findMany({
        include: {
          user: { select: { name: true, email: true } },
          pool: true,
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ])

    return NextResponse.json({ pools, positions })
  } catch (error) {
    console.error("Admin staking error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

// Create/update staking pool
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { id, name, token, apyRate, minStake, maxStake, lockPeriodDays, isActive } = body

    if (!name || !apyRate || !minStake) {
      return NextResponse.json(
        { error: "name, apyRate y minStake son requeridos" },
        { status: 400 }
      )
    }

    const data = {
      name,
      token: token || "FLOW",
      apyRate,
      minStake,
      maxStake: maxStake || null,
      lockPeriodDays: lockPeriodDays || 30,
      isActive: isActive !== undefined ? isActive : true,
    }

    let pool
    if (id) {
      pool = await prisma.stakingPool.update({ where: { id }, data })
    } else {
      pool = await prisma.stakingPool.create({ data })
    }

    return NextResponse.json({ pool })
  } catch (error) {
    console.error("Admin staking pool error:", error)
    return NextResponse.json({ error: "Error en pool" }, { status: 500 })
  }
}
