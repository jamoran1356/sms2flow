"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Loader2, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    // Basic validation
    if (!email) {
      setError("El correo electrónico es obligatorio")
      return
    }

    setIsLoading(true)

    try {
      // Here you would typically make an API call to send a password reset email
      // For now, we'll simulate a successful request
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccess(true)
    } catch (err) {
      setError("Ocurrió un error. Por favor, inténtalo de nuevo.")
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
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-slate-900">Restablecer tu contraseña</CardTitle>
            <CardDescription className="text-center text-slate-600">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
            </CardDescription>
          </CardHeader>
          {success ? (
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg text-green-700">
                <h3 className="font-medium">Revisa tu correo electrónico</h3>
                <p className="text-sm mt-1">
                  Hemos enviado un enlace para restablecer tu contraseña a {email}. Por favor, revisa tu bandeja de
                  entrada y sigue las instrucciones.
                </p>
              </div>
              <div className="text-center mt-4">
                <Link href="/login" className="text-primary hover:text-primary/90 font-medium">
                  Volver al inicio de sesión
                </Link>
              </div>
            </CardContent>
          ) : (
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
                      type="email"
                      placeholder="nombre@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      Enviando enlace...
                    </>
                  ) : (
                    "Enviar enlace"
                  )}
                </Button>
                <div className="text-center text-sm text-slate-600">
                  ¿Recuerdas tu contraseña?{" "}
                  <Link href="/login" className="font-medium text-primary hover:text-primary/90">
                    Iniciar sesión
                  </Link>
                </div>
              </CardFooter>
            </form>
          )}
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
