import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hashPassword } from "@/lib/auth-helpers"
import { createFlowWallet } from "@/lib/flow"

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

    // Create user with wallet in transaction
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        hashedPassword,
        wallets: walletAddress
          ? {
              create: {
                address: walletAddress,
                network: "TESTNET",
                isDefault: true,
              },
            }
          : undefined,
      },
      include: {
        wallets: true,
      },
    })

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
