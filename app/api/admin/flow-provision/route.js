import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { virtualWalletIdFromUserId } from "@/lib/flow"
import { getContractAddresses, hasFlowAdminConfig, sendTransaction } from "@/lib/flow-onchain"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!hasFlowAdminConfig()) {
      return NextResponse.json({ error: "FLOW admin credentials are missing" }, { status: 400 })
    }

    const contracts = getContractAddresses()
    if (!contracts.virtualWallet) {
      return NextResponse.json({ error: "Virtual wallet contract is not configured" }, { status: 400 })
    }

    const users = await prisma.user.findMany({
      include: {
        wallets: {
          where: { isDefault: true },
          take: 1,
        },
      },
    })

    const results = []

    for (const user of users) {
      const defaultWallet = user.wallets[0]
      if (!defaultWallet?.address) {
        results.push({ userId: user.id, status: "skipped", reason: "missing default wallet" })
        continue
      }

      const walletId = virtualWalletIdFromUserId(user.id)

      try {
        const result = await sendTransaction({
          cadence: `
            import SMS2FlowVirtualWallet from 0xVIRTUAL_WALLET

            transaction(walletId: String, owner: Address) {
              prepare(signer: auth(BorrowValue) &Account) {}
              execute {
                SMS2FlowVirtualWallet.createWallet(walletId: walletId, owner: owner)
              }
            }
          `,
          imports: {
            "0xVIRTUAL_WALLET": contracts.virtualWallet,
          },
          args: (arg, t) => [
            arg(walletId, t.String),
            arg(defaultWallet.address, t.Address),
          ],
        })

        if (result.statusCode !== 0) {
          results.push({ userId: user.id, status: "failed", reason: result.errorMessage || "unknown" })
        } else {
          results.push({ userId: user.id, status: "provisioned", txId: result.txId })
        }
      } catch (error) {
        if (String(error.message || "").toLowerCase().includes("wallet already exists")) {
          results.push({ userId: user.id, status: "already-exists" })
        } else {
          results.push({ userId: user.id, status: "failed", reason: error.message || "unknown" })
        }
      }
    }

    return NextResponse.json({ ok: true, total: users.length, results })
  } catch (error) {
    console.error("Flow provision error:", error)
    return NextResponse.json({ error: error.message || "Provision failed" }, { status: 500 })
  }
}
