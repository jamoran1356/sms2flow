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
    const type = searchParams.get("type") // BUY or SELL
    const mine = searchParams.get("mine") === "true"

    const where = { status: "ACTIVE" }
    if (type) where.type = type
    if (mine) where.userId = session.user.id

    const listings = await prisma.p2pListing.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json({ listings })
  } catch (error) {
    console.error("P2P listings GET error:", error)
    return NextResponse.json({ error: "Error fetching listings" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, amount, price, currency, minAmount, maxAmount, paymentMethod, description } = body

    if (!type || !amount || !price) {
      return NextResponse.json({ error: "type, amount and price are required" }, { status: 400 })
    }

    if (!["BUY", "SELL"].includes(type)) {
      return NextResponse.json({ error: "type must be BUY or SELL" }, { status: 400 })
    }

    if (Number(amount) <= 0 || Number(price) <= 0) {
      return NextResponse.json({ error: "amount and price must be positive" }, { status: 400 })
    }

    const listing = await prisma.p2pListing.create({
      data: {
        userId: session.user.id,
        type,
        amount: Number(amount),
        price: Number(price),
        currency: currency || "USD",
        minAmount: minAmount ? Number(minAmount) : null,
        maxAmount: maxAmount ? Number(maxAmount) : null,
        paymentMethod: paymentMethod || "bank_transfer",
        description: description ? String(description).slice(0, 500) : null,
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    })

    return NextResponse.json({ listing }, { status: 201 })
  } catch (error) {
    console.error("P2P listings POST error:", error)
    return NextResponse.json({ error: "Error creating listing" }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { listingId, status } = body

    if (!listingId || !status) {
      return NextResponse.json({ error: "listingId and status are required" }, { status: 400 })
    }

    const listing = await prisma.p2pListing.findFirst({
      where: { id: listingId, userId: session.user.id },
    })

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    const updated = await prisma.p2pListing.update({
      where: { id: listingId },
      data: { status },
    })

    return NextResponse.json({ listing: updated })
  } catch (error) {
    console.error("P2P listings PATCH error:", error)
    return NextResponse.json({ error: "Error updating listing" }, { status: 500 })
  }
}
