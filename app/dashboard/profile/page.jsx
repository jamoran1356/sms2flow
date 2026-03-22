"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import {
  BadgeCheck,
  Edit,
  Mail,
  Phone,
  Shield,
  User,
  Wallet,
  ArrowUpRight,
  Copy,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

export default function ProfilePage() {
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [stats, setStats] = useState({ transactions: 0, totalValue: "0.00", wallets: 0, customers: 0 })
  const [wallets, setWallets] = useState([])
  const [profileData, setProfileData] = useState({ name: "", email: "", phone: "" })

  useEffect(() => {
    if (!session?.user) return
    setProfileData({
      name: session.user.name || "",
      email: session.user.email || "",
      phone: "",
    })
    const fetchData = async () => {
      try {
        const [dashRes, walletRes] = await Promise.all([
          fetch("/api/dashboard"),
          fetch("/api/wallets"),
        ])
        if (dashRes.ok) {
          const d = await dashRes.json()
          setStats({
            transactions: d.transactionsCount || 0,
            totalValue: d.totalBalance || "0.00",
            wallets: d.walletsCount || 0,
            customers: d.customersCount || 0,
          })
        }
        if (walletRes.ok) {
          const w = await walletRes.json()
          setWallets(w.wallets || [])
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [session])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const saveChanges = async () => {
    setSaving(true)
    // Could be connected to a user update API
    await new Promise((r) => setTimeout(r, 500))
    setSaving(false)
    setIsEditing(false)
  }

  const copyAddress = (addr) => {
    navigator.clipboard.writeText(addr)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  const completionPercent = [profileData.name, profileData.email, wallets.length > 0].filter(Boolean).length * 33

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Mi Perfil</h1>
          <p className="text-gray-500 mt-1">Gestiona tu información personal</p>
        </div>
        <Button
          size="sm"
          onClick={() => (isEditing ? saveChanges() : setIsEditing(true))}
          disabled={saving}
          className={isEditing ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" : ""}
          variant={isEditing ? "default" : "outline"}
        >
          {isEditing ? (saving ? "Guardando..." : "Guardar Cambios") : (
            <><Edit className="mr-2 h-4 w-4" /> Editar Perfil</>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-3 space-y-6">
          {/* Profile card */}
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-0">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mb-4">
                  {session?.user?.image ? (
                    <img src={session.user.image} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                  ) : (
                    <span className="text-white text-3xl font-bold">
                      {(profileData.name || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                {isEditing ? (
                  <Input name="name" value={profileData.name} onChange={handleChange} className="text-center font-bold text-xl max-w-[250px]" />
                ) : (
                  <h2 className="text-xl font-bold">{profileData.name || "Sin nombre"}</h2>
                )}
                <p className="text-sm text-gray-500 mt-1">{profileData.email}</p>
                <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  <BadgeCheck className="h-3 w-3 mr-1" />
                  {session?.user?.role === "ADMIN" ? "Administrador" : "Usuario Verificado"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  {isEditing ? (
                    <Input name="email" value={profileData.email} onChange={handleChange} className="h-8 text-sm" />
                  ) : (
                    <span className="text-sm">{profileData.email}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  {isEditing ? (
                    <Input name="phone" value={profileData.phone} onChange={handleChange} className="h-8 text-sm" placeholder="+1234567890" />
                  ) : (
                    <span className="text-sm">{profileData.phone || "No configurado"}</span>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Perfil completado</span>
                  <span className="text-sm text-gray-500">{completionPercent}%</span>
                </div>
                <Progress value={completionPercent} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Wallets */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="h-5 w-5 mr-2 text-blue-600" />
                Mis Billeteras Flow
              </CardTitle>
              <CardDescription>Direcciones asociadas a tu cuenta</CardDescription>
            </CardHeader>
            <CardContent>
              {wallets.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No tienes billeteras aún</p>
              ) : (
                <div className="space-y-3">
                  {wallets.map((w) => (
                    <div key={w.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{w.label || "Billetera Flow"}</p>
                        <p className="text-xs text-gray-500 font-mono">{w.address?.slice(0, 8)}...{w.address?.slice(-6)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-blue-600">{parseFloat(w.balance || 0).toFixed(2)} FLOW</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyAddress(w.address)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-4 space-y-6">
          {/* Stats */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
              <CardDescription>Resumen de tu actividad en la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">{stats.transactions}</div>
                  <p className="text-sm text-gray-600">Transacciones</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-indigo-50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-700">{stats.totalValue} FLOW</div>
                  <p className="text-sm text-gray-600">Balance Total</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-700">{stats.wallets}</div>
                  <p className="text-sm text-gray-600">Billeteras</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-cyan-50 rounded-lg">
                  <div className="text-2xl font-bold text-cyan-700">{stats.customers}</div>
                  <p className="text-sm text-gray-600">Clientes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Verificación de Identidad</CardTitle>
              <CardDescription>Estado de verificación de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Cuenta Activa</h3>
                      <p className="text-xs text-green-600">Registrado</p>
                    </div>
                  </div>
                  <BadgeCheck className="h-5 w-5 text-green-600" />
                </div>

                <div className={`flex items-center justify-between p-4 rounded-lg border ${profileData.email ? "bg-green-50 border-green-100" : "bg-amber-50 border-amber-100"}`}>
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${profileData.email ? "bg-green-100" : "bg-amber-100"}`}>
                      <Mail className={`h-5 w-5 ${profileData.email ? "text-green-600" : "text-amber-600"}`} />
                    </div>
                    <div>
                      <h3 className="font-medium">Correo Electrónico</h3>
                      <p className={`text-xs ${profileData.email ? "text-green-600" : "text-amber-600"}`}>
                        {profileData.email ? "Verificado" : "Pendiente"}
                      </p>
                    </div>
                  </div>
                  {profileData.email && <BadgeCheck className="h-5 w-5 text-green-600" />}
                </div>

                <div className={`flex items-center justify-between p-4 rounded-lg border ${wallets.length > 0 ? "bg-green-50 border-green-100" : "bg-amber-50 border-amber-100"}`}>
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${wallets.length > 0 ? "bg-green-100" : "bg-amber-100"}`}>
                      <Shield className={`h-5 w-5 ${wallets.length > 0 ? "text-green-600" : "text-amber-600"}`} />
                    </div>
                    <div>
                      <h3 className="font-medium">Billetera Flow</h3>
                      <p className={`text-xs ${wallets.length > 0 ? "text-green-600" : "text-amber-600"}`}>
                        {wallets.length > 0 ? "Configurada" : "Sin configurar"}
                      </p>
                    </div>
                  </div>
                  {wallets.length > 0 && <BadgeCheck className="h-5 w-5 text-green-600" />}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
