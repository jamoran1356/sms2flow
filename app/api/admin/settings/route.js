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
    const group = searchParams.get("group")

    const settings = await prisma.systemSetting.findMany({
      where: group ? { group } : {},
      orderBy: [{ group: "asc" }, { key: "asc" }],
    })

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Settings error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { settings } = body // Array of { key, value, group }

    if (!Array.isArray(settings)) {
      return NextResponse.json({ error: "settings debe ser un array" }, { status: 400 })
    }

    const results = await Promise.all(
      settings.map((s) =>
        prisma.systemSetting.upsert({
          where: { key: s.key },
          update: { value: s.value, group: s.group || "general" },
          create: { key: s.key, value: s.value, group: s.group || "general" },
        })
      )
    )

    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "SETTINGS_UPDATE",
        entity: "SystemSetting",
        details: { count: settings.length },
      },
    })

    return NextResponse.json({ settings: results })
  } catch (error) {
    console.error("Settings update error:", error)
    return NextResponse.json({ error: "Error actualizando configuración" }, { status: 500 })
  }
}
