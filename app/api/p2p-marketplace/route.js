import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { virtualWalletIdFromUserId } from "@/lib/flow"
import { getContractAddresses, hasFlowAdminConfig, runScript, sendTransaction } from "@/lib/flow-onchain"

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const contracts = getContractAddresses()
    if (!contracts.p2p) {
      return NextResponse.json({ error: "P2P contract address is not configured" }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const offerId = Number(searchParams.get("offerId") || 0)

    if (!offerId) {
      return NextResponse.json({
        contractAddress: contracts.p2p,
        note: "Send offerId query param to fetch offer",
      })
    }

    const offer = await runScript({
      cadence: `
        import SMS2FlowP2PMarketplace from 0xP2P

        access(all) fun main(offerId: UInt64): SMS2FlowP2PMarketplace.Offer? {
          return SMS2FlowP2PMarketplace.getOffer(offerId: offerId)
        }
      `,
      imports: { "0xP2P": contracts.p2p },
      args: (arg, t) => [arg(String(offerId), t.UInt64)],
    })

    return NextResponse.json({ contractAddress: contracts.p2p, offer })
  } catch (error) {
    console.error("P2P GET error:", error)
    return NextResponse.json({ error: error.message || "P2P read failed" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const contracts = getContractAddresses()
    if (!contracts.p2p) {
      return NextResponse.json({ error: "P2P contract address is not configured" }, { status: 400 })
    }

    if (!hasFlowAdminConfig()) {
      return NextResponse.json({ error: "FLOW admin credentials are missing" }, { status: 400 })
    }

    const body = await request.json()
    const { action = "create", amount, price, offerId, takerWalletId } = body

    const walletId = virtualWalletIdFromUserId(session.user.id)

    let result

    if (action === "create") {
      if (!amount || !price || Number(amount) <= 0 || Number(price) <= 0) {
        return NextResponse.json({ error: "amount and price are required" }, { status: 400 })
      }

      result = await sendTransaction({
        cadence: `
          import SMS2FlowP2PMarketplace from 0xP2P

          transaction(makerWalletId: String, amount: UFix64, price: UFix64) {
            prepare(signer: auth(BorrowValue) &Account) {}
            execute {
              SMS2FlowP2PMarketplace.createOffer(
                makerWalletId: makerWalletId,
                amount: amount,
                price: price
              )
            }
          }
        `,
        imports: { "0xP2P": contracts.p2p },
        args: (arg, t) => [
          arg(walletId, t.String),
          arg(Number(amount).toFixed(8), t.UFix64),
          arg(Number(price).toFixed(8), t.UFix64),
        ],
      })
    } else if (action === "fill") {
      if (!offerId) {
        return NextResponse.json({ error: "offerId is required for fill" }, { status: 400 })
      }

      result = await sendTransaction({
        cadence: `
          import SMS2FlowP2PMarketplace from 0xP2P

          transaction(offerId: UInt64, takerWalletId: String) {
            prepare(signer: auth(BorrowValue) &Account) {}
            execute {
              SMS2FlowP2PMarketplace.fillOffer(offerId: offerId, takerWalletId: takerWalletId)
            }
          }
        `,
        imports: { "0xP2P": contracts.p2p },
        args: (arg, t) => [
          arg(String(offerId), t.UInt64),
          arg(takerWalletId || walletId, t.String),
        ],
      })
    } else if (action === "cancel") {
      if (!offerId) {
        return NextResponse.json({ error: "offerId is required for cancel" }, { status: 400 })
      }

      result = await sendTransaction({
        cadence: `
          import SMS2FlowP2PMarketplace from 0xP2P

          transaction(offerId: UInt64) {
            prepare(signer: auth(BorrowValue) &Account) {}
            execute {
              SMS2FlowP2PMarketplace.cancelOffer(offerId: offerId)
            }
          }
        `,
        imports: { "0xP2P": contracts.p2p },
        args: (arg, t) => [arg(String(offerId), t.UInt64)],
      })
    } else {
      return NextResponse.json({ error: "action must be create, fill or cancel" }, { status: 400 })
    }

    if (result.statusCode !== 0) {
      return NextResponse.json({ error: result.errorMessage || "P2P tx failed" }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      action,
      txId: result.txId,
      statusCode: result.statusCode,
      contractAddress: contracts.p2p,
      events: result.events,
    }, { status: 201 })
  } catch (error) {
    console.error("P2P POST error:", error)
    return NextResponse.json({ error: error.message || "P2P create failed" }, { status: 500 })
  }
}
