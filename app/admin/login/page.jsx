"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import Image from "next/image"
import { Shield, Eye, EyeOff, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminLogin() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // If already authenticated as admin, redirect
  if (status === "authenticated" && session?.user?.role === "ADMIN") {
    router.push("/admin")
    return null
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!email || !password) {
      setError("Por favor, completa todos los campos")
      setIsLoading(false)
      return
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Credenciales incorrectas o no tienes permisos de administrador")
      setIsLoading(false)
      return
    }

    // Verify the session has admin role
    const res = await fetch("/api/auth/session")
    const sess = await res.json()
    if (sess?.user?.role !== "ADMIN") {
      setError("Tu cuenta no tiene permisos de administrador")
      setIsLoading(false)
      return
    }

    router.push("/admin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/sms2flow-logo.png"
              alt="SMS2Flow Logo"
              width={180}
              height={60}
              priority
              className="brightness-0 invert drop-shadow-lg"
            />
          </div>
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-2 bg-red-500/20 rounded-full">
              <Shield className="h-6 w-6 text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">Panel Administrativo</h2>
          </div>
          <p className="text-blue-200/70 max-w-sm mx-auto">
            Acceso restringido exclusivamente para administradores del sistema SMS2Flow
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-white flex items-center justify-center gap-2">
              <LogIn className="h-5 w-5" />
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-center text-blue-200/70 text-base">
              Ingresa tus credenciales administrativas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-100 font-semibold text-sm">
                  Email de Administrador
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@sms2flow.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 bg-white/10 border-white/20 text-white placeholder:text-blue-200/40 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-100 font-semibold text-sm">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-12 pr-12 bg-white/10 border-white/20 text-white placeholder:text-blue-200/40 focus:border-blue-400 focus:ring-blue-400"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-blue-200/50 hover:text-white" />
                    ) : (
                      <Eye className="h-5 w-5 text-blue-200/50 hover:text-white" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold text-base shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verificando acceso...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <span>Acceder al Panel</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center space-y-2">
          <p className="text-xs text-blue-200/40">&copy; 2024 SMS2Flow. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
}
