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

    const { address, privateKey } = await createFlowWallet()

    const wallet = await prisma.wallet.create({
      data: {
        userId: session.user.id,
        address,
        privateKey,
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

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { walletId } = body

    if (!walletId) {
      return NextResponse.json({ error: "walletId is required" }, { status: 400 })
    }

    const wallet = await prisma.wallet.findFirst({
      where: { id: walletId, userId: session.user.id },
    })

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 })
    }

    // Unset current default
    await prisma.wallet.updateMany({
      where: { userId: session.user.id, isDefault: true },
      data: { isDefault: false },
    })

    // Set new default
    const updated = await prisma.wallet.update({
      where: { id: walletId },
      data: { isDefault: true },
    })

    return NextResponse.json({ wallet: updated })
  } catch (error) {
    console.error("Set default wallet error:", error)
    return NextResponse.json({ error: "Error actualizando billetera" }, { status: 500 })
  }
}
