import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { virtualWalletIdFromUserId } from "@/lib/flow"
import { getContractAddresses, hasFlowAdminConfig, runScript, sendTransaction } from "@/lib/flow-onchain"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const contracts = getContractAddresses()
    if (!contracts.defi) {
      return NextResponse.json({ error: "DeFi contract address is not configured" }, { status: 400 })
    }

    const walletId = virtualWalletIdFromUserId(session.user.id)

    const balance = await runScript({
      cadence: `
        import SMS2FlowDeFiVault from 0xDEFI

        access(all) fun main(walletId: String): UFix64 {
          return SMS2FlowDeFiVault.getBalance(walletId: walletId)
        }
      `,
      imports: { "0xDEFI": contracts.defi },
      args: (arg, t) => [arg(walletId, t.String)],
    })

    return NextResponse.json({
      walletId,
      contractAddress: contracts.defi,
      balance: Number(balance || 0),
    })
  } catch (error) {
    console.error("DeFi GET error:", error)
    return NextResponse.json({ error: error.message || "DeFi read failed" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const contracts = getContractAddresses()
    if (!contracts.defi) {
      return NextResponse.json({ error: "DeFi contract address is not configured" }, { status: 400 })
    }

    if (!hasFlowAdminConfig()) {
      return NextResponse.json({ error: "FLOW admin credentials are missing" }, { status: 400 })
    }

    const body = await request.json()
    const { action, amount } = body

    if (!["deposit", "withdraw"].includes(action)) {
      return NextResponse.json({ error: "action must be deposit or withdraw" }, { status: 400 })
    }

    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ error: "amount must be > 0" }, { status: 400 })
    }

    const walletId = virtualWalletIdFromUserId(session.user.id)
    const functionName = action === "deposit" ? "deposit" : "withdraw"

    const result = await sendTransaction({
      cadence: `
        import SMS2FlowDeFiVault from 0xDEFI

        transaction(walletId: String, amount: UFix64) {
          prepare(signer: auth(BorrowValue) &Account) {}
          execute {
            SMS2FlowDeFiVault.${functionName}(walletId: walletId, amount: amount)
          }
        }
      `,
      imports: { "0xDEFI": contracts.defi },
      args: (arg, t) => [
        arg(walletId, t.String),
        arg(Number(amount).toFixed(8), t.UFix64),
      ],
    })

    if (result.statusCode !== 0) {
      return NextResponse.json({ error: result.errorMessage || "DeFi tx failed" }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      txId: result.txId,
      statusCode: result.statusCode,
      contractAddress: contracts.defi,
      events: result.events,
    }, { status: 201 })
  } catch (error) {
    console.error("DeFi POST error:", error)
    return NextResponse.json({ error: error.message || "DeFi write failed" }, { status: 500 })
  }
}
