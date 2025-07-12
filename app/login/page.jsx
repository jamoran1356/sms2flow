"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Loader2, Lock, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Todos los campos son obligatorios")
      return
    }

    setIsLoading(true)

    try {
      // Here you would typically make an API call to authenticate the user
      // For now, we'll simulate a successful login
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to dashboard after successful login
      router.push("/dashboard")
    } catch (err) {
      setError("Correo electrónico o contraseña inválidos")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* Header with logo */}
      <header className="flex h-16 items-center px-4 md:px-6 border-b bg-white">
        <Link href="/" className="flex items-center">
          <Image src="/images/logo.webp" alt="Kiipay Logo" width={120} height={40} priority />
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="space-y-1 pb-8">
            <CardTitle className="text-2xl font-bold text-center text-slate-900">Bienvenido de nuevo</CardTitle>
            <CardDescription className="text-center text-slate-600">
              Ingresa tus credenciales para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nombre@ejemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 bg-slate-50 border-slate-200"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700">
                    Contraseña
                  </Label>
                  <Link href="/forgot-password" className="text-sm font-medium text-primary hover:text-primary/90">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 bg-slate-50 border-slate-200"
                    required
                  />
                </div>
              </div>
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 pt-2">
              <Button type="submit" className="w-full bg-[#0a2463] hover:bg-[#0a2463]/90" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
              <div className="text-center text-sm text-slate-600">
                ¿No tienes una cuenta?{" "}
                <Link href="/register" className="font-medium text-primary hover:text-primary/90">
                  Crear una cuenta
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-6 text-center text-sm text-slate-600">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Kiipay. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
