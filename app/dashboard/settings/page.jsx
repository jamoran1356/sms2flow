"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { ChevronRight, CreditCard, Globe, MessageSquare, Moon, Shield, Sun, User, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  const { data: session } = useSession()
  const [theme, setTheme] = useState("light")
  const [language, setLanguage] = useState("es")
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    promotionalAlerts: true,
    defaultNetwork: "flow",
    defaultCurrency: "usd",
  })

  const handleToggle = (setting) => {
    setSettings((prev) => ({ ...prev, [setting]: !prev[setting] }))
  }

  const handleSave = async () => {
    setSaving(true)
    // Settings could be saved to an API in the future
    await new Promise((r) => setTimeout(r, 500))
    setSaving(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Configuración</h1>
          <p className="text-gray-500 mt-1">Personaliza tu experiencia en SMS2Flow</p>
        </div>
        <Button size="sm" onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="preferences">Preferencias</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 pt-4">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
              <CardDescription>Administra la configuración general de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Tema</Label>
                <RadioGroup value={theme} onValueChange={setTheme} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
                      <Sun className="h-4 w-4" /> Claro
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
                      <Moon className="h-4 w-4" /> Oscuro
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system" className="cursor-pointer">Sistema</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Idioma</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Red Blockchain Predeterminada</Label>
                <Select value={settings.defaultNetwork} onValueChange={(v) => setSettings({ ...settings, defaultNetwork: v })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flow">Flow Blockchain (Principal)</SelectItem>
                    <SelectItem value="flow-testnet">Flow Testnet</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Flow es la blockchain nativa de SMS2Flow para transacciones rápidas y económicas.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Moneda para Mostrar</Label>
                <Select value={settings.defaultCurrency} onValueChange={(v) => setSettings({ ...settings, defaultCurrency: v })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD - Dólar Estadounidense</SelectItem>
                    <SelectItem value="eur">EUR - Euro</SelectItem>
                    <SelectItem value="flow">FLOW - Flow Token</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Enlaces Rápidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { href: "/dashboard/profile", icon: <User className="h-5 w-5 text-gray-500" />, title: "Perfil", desc: "Edita tu información personal" },
                { href: "/dashboard/wallet", icon: <CreditCard className="h-5 w-5 text-gray-500" />, title: "Billetera", desc: "Gestiona tus activos Flow" },
                { href: "/dashboard/sms-payments", icon: <MessageSquare className="h-5 w-5 text-gray-500" />, title: "Pagos SMS", desc: "Configura pagos por mensaje de texto" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    {link.icon}
                    <div className="ml-3">
                      <h3 className="font-medium">{link.title}</h3>
                      <p className="text-xs text-gray-500">{link.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 pt-4">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
              <CardDescription>Controla qué notificaciones recibes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Correo Electrónico</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Transacciones</Label>
                    <p className="text-sm text-gray-500">Notificaciones cuando se realicen transacciones</p>
                  </div>
                  <Switch checked={settings.emailNotifications} onCheckedChange={() => handleToggle("emailNotifications")} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Marketing</Label>
                    <p className="text-sm text-gray-500">Noticias y actualizaciones de SMS2Flow</p>
                  </div>
                  <Switch checked={settings.marketingEmails} onCheckedChange={() => handleToggle("marketingEmails")} />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium">SMS</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Transacciones SMS</Label>
                    <p className="text-sm text-gray-500">Notificaciones SMS para transacciones</p>
                  </div>
                  <Switch checked={settings.smsNotifications} onCheckedChange={() => handleToggle("smsNotifications")} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Alertas Promocionales</Label>
                    <p className="text-sm text-gray-500">Ofertas especiales vía SMS</p>
                  </div>
                  <Switch checked={settings.promotionalAlerts} onCheckedChange={() => handleToggle("promotionalAlerts")} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6 pt-4">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Preferencias Blockchain</CardTitle>
              <CardDescription>Preferencias para transacciones en Flow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Explorador de Bloques</Label>
                <Select defaultValue="flowscan">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flowscan">Flowscan (Recomendado)</SelectItem>
                    <SelectItem value="flowview">Flowview</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center mb-2">
                  <Globe className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-800">Flow Blockchain</span>
                </div>
                <p className="text-sm text-blue-700">
                  SMS2Flow utiliza Flow blockchain para transacciones rápidas, seguras y con bajas comisiones.
                  Tu moneda principal es FLOW.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
