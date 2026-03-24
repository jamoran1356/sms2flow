import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hashPassword } from "@/lib/auth-helpers"
import { createFlowWallet, virtualWalletIdFromUserId } from "@/lib/flow"
import { getContractAddresses, hasFlowAdminConfig, sendTransaction } from "@/lib/flow-onchain"

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, phone, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nombre, email y contraseña son requeridos" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Formato de email inválido" },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 8 caracteres" },
        { status: 400 }
      )
    }

    // Check existing user
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(phone ? [{ phone }] : []),
        ],
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con ese email o teléfono" },
        { status: 409 }
      )
    }

    const hashedPassword = await hashPassword(password)

    // Create Flow wallet for user
    let walletAddress
    try {
      walletAddress = await createFlowWallet()
    } catch (e) {
      console.error("Error creating wallet:", e)
    }

    const virtualContractAddress = process.env.FLOW_VIRTUAL_WALLET_CONTRACT_ADDRESS || null
    const stakingContractAddress = process.env.FLOW_STAKING_CONTRACT_ADDRESS || null
    const p2pContractAddress = process.env.FLOW_P2P_CONTRACT_ADDRESS || null
    const defiContractAddress = process.env.FLOW_DEFI_CONTRACT_ADDRESS || null

    // Create user with wallet and virtual contract record in one operation
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        hashedPassword,
        ...(walletAddress
          ? {
              wallets: {
                create: {
                  address: walletAddress,
                  network: "TESTNET",
                  isDefault: true,
                  contracts: {
                    create: [
                      {
                        name: "SMS2FlowVirtualWallet",
                        address: virtualContractAddress,
                        network: "TESTNET",
                        isDeployed: Boolean(virtualContractAddress),
                        abi: {
                          model: "virtual-balance",
                          virtualWalletId: virtualWalletIdFromUserId("pending"),
                        },
                      },
                      {
                        name: "SMS2FlowStaking",
                        address: stakingContractAddress,
                        network: "TESTNET",
                        isDeployed: Boolean(stakingContractAddress),
                        abi: {
                          model: "staking",
                          virtualWalletId: virtualWalletIdFromUserId("pending"),
                        },
                      },
                      {
                        name: "SMS2FlowP2PMarketplace",
                        address: p2pContractAddress,
                        network: "TESTNET",
                        isDeployed: Boolean(p2pContractAddress),
                        abi: {
                          model: "p2p-marketplace",
                          virtualWalletId: virtualWalletIdFromUserId("pending"),
                        },
                      },
                      {
                        name: "SMS2FlowDeFiVault",
                        address: defiContractAddress,
                        network: "TESTNET",
                        isDeployed: Boolean(defiContractAddress),
                        abi: {
                          model: "defi-vault",
                          virtualWalletId: virtualWalletIdFromUserId("pending"),
                        },
                      },
                    ],
                  },
                },
              },
            }
          : {}),
      },
      include: {
        wallets: {
          include: { contracts: true },
        },
      },
    })

    if (user.wallets[0]?.contracts?.length) {
      await Promise.all(
        user.wallets[0].contracts.map((contract) =>
          prisma.contract.update({
            where: { id: contract.id },
            data: {
              abi: {
                ...(contract.abi || {}),
                virtualWalletId: virtualWalletIdFromUserId(user.id),
              },
            },
          })
        )
      )
    }

    const contracts = getContractAddresses()
    let onchainProvisioning = null

    if (hasFlowAdminConfig() && contracts.virtualWallet && user.wallets[0]?.address) {
      const walletId = virtualWalletIdFromUserId(user.id)
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
          arg(user.wallets[0].address, t.Address),
        ],
      })

      if (result.statusCode !== 0) {
        return NextResponse.json(
          { error: result.errorMessage || "On-chain wallet provisioning failed" },
          { status: 500 }
        )
      }

      onchainProvisioning = {
        txId: result.txId,
        statusCode: result.statusCode,
      }
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "REGISTER",
        entity: "User",
        entityId: user.id,
        details: { email, name },
      },
    })

    return NextResponse.json(
      {
        message: "Cuenta creada exitosamente",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          walletAddress: user.wallets[0]?.address || null,
        },
        onchainProvisioning,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
