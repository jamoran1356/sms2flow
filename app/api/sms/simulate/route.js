import { NextResponse } from "next/server"
import { processSmsCommand } from "@/lib/services/sms-command-processor"
import { normalizePhone } from "@/lib/flow"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { message, fromPhone } = body

    if (!message || !fromPhone) {
      return NextResponse.json({ error: "message and fromPhone are required" }, { status: 400 })
    }

    const phone = normalizePhone(fromPhone)
    if (!phone) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 })
    }

    const result = await processSmsCommand(phone, message, { source: "simulator" })

    return NextResponse.json(result)
  } catch (error) {
    console.error("SMS simulate error:", error)
    return NextResponse.json({ error: error.message || "Simulation failed" }, { status: 500 })
  }
}

// GET: retrieve SMS conversation history for a phone number
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const fromPhone = searchParams.get("phone")
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 200)

    if (!fromPhone) {
      return NextResponse.json({ error: "phone param required" }, { status: 400 })
    }

    const phone = normalizePhone(fromPhone)

    const messages = await prisma.smsMessage.findMany({
      where: { fromPhone: phone },
      orderBy: { createdAt: "asc" },
      take: limit,
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("SMS history error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
