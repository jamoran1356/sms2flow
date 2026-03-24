import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { virtualWalletIdFromUserId } from "@/lib/flow"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const contracts = await prisma.contract.findMany({
      where: { userId: session.user.id },
      include: {
        wallet: { select: { id: true, address: true, network: true, balance: true, isDefault: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      contracts,
      virtualWalletId: virtualWalletIdFromUserId(session.user.id),
      contractTemplate: "flow/contracts/SMS2FlowVirtualWallet.cdc",
      transferTemplate: "flow/transactions/transfer_virtual_balance.cdc",
    })
  } catch (error) {
    console.error("Contracts error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
