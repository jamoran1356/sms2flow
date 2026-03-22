import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""
    const role = searchParams.get("role") || ""
    const status = searchParams.get("status") || ""

    const where = {
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { phone: { contains: search } },
            ],
          }
        : {}),
      ...(role ? { role } : {}),
      ...(status === "active" ? { isActive: true } : {}),
      ...(status === "inactive" ? { isActive: false } : {}),
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
          image: true,
          _count: {
            select: {
              wallets: true,
              transactionsSent: true,
              transactionsReceived: true,
              customers: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("Admin users error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { userId, role, isActive, isVerified } = body

    if (!userId) {
      return NextResponse.json({ error: "userId requerido" }, { status: 400 })
    }

    const data = {}
    if (role !== undefined) data.role = role
    if (isActive !== undefined) data.isActive = isActive
    if (isVerified !== undefined) data.isVerified = isVerified

    const user = await prisma.user.update({
      where: { id: userId },
      data,
    })

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "USER_UPDATE",
        entity: "User",
        entityId: userId,
        details: data,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Admin user update error:", error)
    return NextResponse.json({ error: "Error actualizando usuario" }, { status: 500 })
  }
}
