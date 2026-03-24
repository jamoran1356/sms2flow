import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { virtualWalletIdFromUserId } from "@/lib/flow"
import { getContractAddresses, hasFlowAdminConfig, runScript, sendTransaction } from "@/lib/flow-onchain"

// GET staking pools and user positions
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [pools, positions] = await Promise.all([
      prisma.stakingPool.findMany({
        where: { isActive: true },
        orderBy: { apyRate: "desc" },
      }),
      prisma.stakingPosition.findMany({
        where: { userId: session.user.id },
        include: { pool: true },
        orderBy: { createdAt: "desc" },
      }),
    ])

    let onchain = null
    const contracts = getContractAddresses()
    if (contracts.staking) {
      try {
        const walletId = virtualWalletIdFromUserId(session.user.id)
        const staked = await runScript({
          cadence: `
            import SMS2FlowStaking from 0xSTAKING
            access(all) fun main(walletId: String): UFix64 {
              return SMS2FlowStaking.getStakedBalance(walletId: walletId)
            }
          `,
          imports: { "0xSTAKING": contracts.staking },
          args: (arg, t) => [arg(walletId, t.String)],
        })
        const rewards = await runScript({
          cadence: `
            import SMS2FlowStaking from 0xSTAKING
            access(all) fun main(walletId: String): UFix64 {
              return SMS2FlowStaking.getRewardBalance(walletId: walletId)
            }
          `,
          imports: { "0xSTAKING": contracts.staking },
          args: (arg, t) => [arg(walletId, t.String)],
        })
        onchain = {
          staked: Number(staked || 0),
          rewards: Number(rewards || 0),
          contractAddress: contracts.staking,
        }
      } catch (e) {
        onchain = null
      }
    }

    const totalStaked = positions
      .filter((p) => p.status === "ACTIVE")
      .reduce((sum, p) => sum + parseFloat(p.amount), 0)

    const totalRewards = positions.reduce(
      (sum, p) => sum + parseFloat(p.rewards),
      0
    )

    return NextResponse.json({
      pools,
      positions,
      totalStaked,
      totalRewards,
      onchain,
    })
  } catch (error) {
    console.error("Staking error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

// POST - stake tokens
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { poolId, amount } = body

    if (!poolId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Pool y monto son requeridos" }, { status: 400 })
    }

    const pool = await prisma.stakingPool.findUnique({ where: { id: poolId } })
    if (!pool || !pool.isActive) {
      return NextResponse.json({ error: "Pool no disponible" }, { status: 400 })
    }

    if (amount < parseFloat(pool.minStake)) {
      return NextResponse.json(
        { error: `Monto mínimo: ${pool.minStake} ${pool.token}` },
        { status: 400 }
      )
    }

    // Check wallet balance
    const wallet = await prisma.wallet.findFirst({
      where: { userId: session.user.id, isDefault: true },
    })

    if (!wallet || parseFloat(wallet.balance) < amount) {
      return NextResponse.json({ error: "Saldo insuficiente" }, { status: 400 })
    }

    const contracts = getContractAddresses()
    let stakingExecution = null

    if (hasFlowAdminConfig() && contracts.staking) {
      const walletId = virtualWalletIdFromUserId(session.user.id)
      const result = await sendTransaction({
        cadence: `
          import SMS2FlowStaking from 0xSTAKING

          transaction(walletId: String, amount: UFix64) {
            prepare(signer: auth(BorrowValue) &Account) {}
            execute {
              SMS2FlowStaking.stake(walletId: walletId, amount: amount)
            }
          }
        `,
        imports: { "0xSTAKING": contracts.staking },
        args: (arg, t) => [
          arg(walletId, t.String),
          arg(Number(amount).toFixed(8), t.UFix64),
        ],
      })

      if (result.statusCode !== 0) {
        return NextResponse.json({ error: result.errorMessage || "On-chain staking failed" }, { status: 500 })
      }

      stakingExecution = {
        mode: "onchain",
        txId: result.txId,
        statusCode: result.statusCode,
        contractAddress: contracts.staking,
      }
    }

    const position = await prisma.$transaction(async (tx) => {
      // Deduct from wallet
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amount } },
      })

      // Update pool stats
      await tx.stakingPool.update({
        where: { id: poolId },
        data: {
          totalStaked: { increment: amount },
          participants: { increment: 1 },
        },
      })

      // Create position
      return tx.stakingPosition.create({
        data: {
          userId: session.user.id,
          poolId,
          amount,
          status: "ACTIVE",
          rewards: 0,
        },
        include: { pool: true },
      })
    })

    return NextResponse.json({ position, execution: stakingExecution }, { status: 201 })
  } catch (error) {
    console.error("Staking error:", error)
    return NextResponse.json({ error: "Error en staking" }, { status: 500 })
  }
}
