import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import { verifyPassword } from "@/lib/auth-helpers"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña son requeridos")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.hashedPassword) {
          throw new Error("Credenciales inválidas")
        }

        if (!user.isActive) {
          throw new Error("Cuenta desactivada")
        }

        const isValid = await verifyPassword(credentials.password, user.hashedPassword)
        if (!isValid) {
          throw new Error("Credenciales inválidas")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      if (trigger === "update" && session) {
        token.name = session.name
        token.email = session.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role
        session.user.id = token.id
      }
      return session
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { wallets: true },
        })
        if (existingUser && existingUser.wallets.length === 0) {
          const { createFlowWallet } = await import("@/lib/flow")
          try {
            const address = await createFlowWallet()
            await prisma.wallet.create({
              data: {
                userId: existingUser.id,
                address,
                network: "TESTNET",
                isDefault: true,
              },
            })
          } catch (e) {
            console.error("Error creating Flow wallet on Google sign-in:", e)
          }
        }
      }
      return true
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
