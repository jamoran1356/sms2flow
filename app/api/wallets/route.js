import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { createFlowWallet, getFlowBalance } from "@/lib/flow"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const wallets = await prisma.wallet.findMany({
      where: { userId: session.user.id },
      include: {
        contracts: true,
      },
    })

    // Try to update balance from chain
    for (const wallet of wallets) {
      try {
        const chainBalance = await getFlowBalance(wallet.address)
        if (chainBalance > 0) {
          await prisma.wallet.update({
            where: { id: wallet.id },
            data: { balance: chainBalance },
          })
          wallet.balance = chainBalance
        }
      } catch (e) {
        // Use DB balance as fallback
      }
    }

    return NextResponse.json({ wallets })
  } catch (error) {
    console.error("Wallets error:", error)
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
    const { network } = body

    const address = await createFlowWallet()

    const wallet = await prisma.wallet.create({
      data: {
        userId: session.user.id,
        address,
        network: network || "TESTNET",
        isDefault: false,
      },
    })

    return NextResponse.json({ wallet }, { status: 201 })
  } catch (error) {
    console.error("Create wallet error:", error)
    return NextResponse.json({ error: "Error creando billetera" }, { status: 500 })
  }
}
