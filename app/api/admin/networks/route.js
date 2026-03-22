import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET network configurations
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const networks = await prisma.networkConfig.findMany({
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json({ networks })
  } catch (error) {
    console.error("Networks error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

// POST - create or update network config
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { network, name, rpcUrl, explorerUrl, chainId, isActive } = body

    if (!network || !name || !rpcUrl) {
      return NextResponse.json(
        { error: "network, name y rpcUrl son requeridos" },
        { status: 400 }
      )
    }

    // If setting as active, deactivate others
    if (isActive) {
      await prisma.networkConfig.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      })
    }

    const config = await prisma.networkConfig.upsert({
      where: { network },
      update: { name, rpcUrl, explorerUrl, chainId, isActive },
      create: { network, name, rpcUrl, explorerUrl, chainId, isActive },
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "NETWORK_CONFIG_UPDATE",
        entity: "NetworkConfig",
        entityId: config.id,
        details: { network, isActive },
      },
    })

    return NextResponse.json({ config })
  } catch (error) {
    console.error("Network config error:", error)
    return NextResponse.json({ error: "Error configurando red" }, { status: 500 })
  }
}
