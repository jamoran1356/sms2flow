"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, CreditCard, Globe, MessageSquare, Moon, Shield, ShoppingCart, Sun, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  const [theme, setTheme] = useState("light")
  const [language, setLanguage] = useState("es")
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    promotionalAlerts: true,
    darkMode: false,
    defaultNetwork: "kii",
    defaultCurrency: "usd",
  })

  const handleToggle = (setting) => {
    setSettings((prev) => ({ ...prev, [setting]: !prev[setting] }))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <Button size="sm" className="bg-[#0a2463] hover:bg-[#0a2463]/90">
          Guardar Cambios
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="account">Cuenta</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="preferences">Preferencias</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 pt-4">
          <Card>
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
                      <Sun className="h-4 w-4" />
                      Claro
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
                      <Moon className="h-4 w-4" />
                      Oscuro
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system" className="cursor-pointer">
                      Sistema
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language" className="w-full">
                    <SelectValue placeholder="Selecciona un idioma" />
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
                <Label htmlFor="defaultNetwork">Red Blockchain Predeterminada</Label>
                <Select
                  value={settings.defaultNetwork}
                  onValueChange={(value) => setSettings({ ...settings, defaultNetwork: value })}
                >
                  <SelectTrigger id="defaultNetwork" className="w-full">
                    <SelectValue placeholder="Selecciona una red" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kii">
                      <div className="flex items-center">
                        <span className="mr-2">🔷</span>
                        <span>Kii Network (Principal)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ethereum">
                      <div className="flex items-center">
                        <span className="mr-2">💎</span>
                        <span>Ethereum</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="solana">
                      <div className="flex items-center">
                        <span className="mr-2">🟣</span>
                        <span>Solana</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="bsc">
                      <div className="flex items-center">
                        <span className="mr-2">🟡</span>
                        <span>Binance Smart Chain</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 mt-1">
                  La red Kii es nuestra blockchain nativa para transacciones más rápidas y económicas. También
                  soportamos otras blockchains a través de nuestra tecnología cross-chain.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultCurrency">Moneda Predeterminada para Mostrar</Label>
                <Select
                  value={settings.defaultCurrency}
                  onValueChange={(value) => setSettings({ ...settings, defaultCurrency: value })}
                >
                  <SelectTrigger id="defaultCurrency" className="w-full">
                    <SelectValue placeholder="Selecciona una moneda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD - Dólar Estadounidense</SelectItem>
                    <SelectItem value="eur">EUR - Euro</SelectItem>
                    <SelectItem value="kii">KII - Kii Token</SelectItem>
                    <SelectItem value="btc">BTC - Bitcoin</SelectItem>
                    <SelectItem value="eth">ETH - Ethereum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <p className="text-xs text-slate-500">
                Estos ajustes modifican tu experiencia visual al usar la plataforma
              </p>
              <Button size="sm" className="bg-[#0a2463] hover:bg-[#0a2463]/90">
                Guardar
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enlaces Rápidos</CardTitle>
              <CardDescription>Accede rápidamente a la configuración importante</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/dashboard/settings/security"
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50"
              >
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-slate-500 mr-3" />
                  <div>
                    <h3 className="font-medium">Seguridad</h3>
                    <p className="text-xs text-slate-500">Configuración de seguridad y autenticación</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>

              <Link
                href="/dashboard/profile"
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50"
              >
                <div className="flex items-center">
                  <User className="h-5 w-5 text-slate-500 mr-3" />
                  <div>
                    <h3 className="font-medium">Perfil</h3>
                    <p className="text-xs text-slate-500">Edita tu información personal</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>

              <Link
                href="/dashboard/wallet"
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50"
              >
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-slate-500 mr-3" />
                  <div>
                    <h3 className="font-medium">Billetera</h3>
                    <p className="text-xs text-slate-500">Gestiona tus activos y métodos de pago</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>

              <Link
                href="/dashboard/sms-payments"
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50"
              >
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-slate-500 mr-3" />
                  <div>
                    <h3 className="font-medium">Pagos SMS</h3>
                    <p className="text-xs text-slate-500">Configura los pagos por mensaje de texto</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>

              <Link
                href="/dashboard/settings/pos-config"
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50"
              >
                <div className="flex items-center">
                  <ShoppingCart className="h-5 w-5 text-slate-500 mr-3" />
                  <div>
                    <h3 className="font-medium">Configuración PDV</h3>
                    <p className="text-xs text-slate-500">Configura tu punto de venta e impresora</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Información de Cuenta</CardTitle>
              <CardDescription>Actualiza tu información personal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <input
                    id="name"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tu nombre"
                    defaultValue="Juan Pérez"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <input
                    id="email"
                    type="email"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="tu@email.com"
                    defaultValue="juan@ejemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <input
                    id="phone"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="+1234567890"
                    defaultValue="+34 612 345 678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Select defaultValue="es">
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Selecciona un país" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">España</SelectItem>
                      <SelectItem value="mx">México</SelectItem>
                      <SelectItem value="ar">Argentina</SelectItem>
                      <SelectItem value="co">Colombia</SelectItem>
                      <SelectItem value="us">Estados Unidos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografía</Label>
                <textarea
                  id="bio"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Cuéntanos sobre ti..."
                  defaultValue="Emprendedor digital y entusiasta de las criptomonedas. Especializado en comercio electrónico y soluciones de pago innovadoras."
                />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button className="ml-auto bg-[#0a2463] hover:bg-[#0a2463]/90">Guardar Cambios</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verificación KYC</CardTitle>
              <CardDescription>Verifica tu identidad para aumentar tus límites de transacción</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center mb-2">
                  <Shield className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-800">Verificación Básica Completada</span>
                </div>
                <p className="text-sm text-green-700">
                  Has completado la verificación básica de tu cuenta. Para aumentar tus límites de transacción,
                  considera completar la verificación avanzada.
                </p>
                <div className="mt-4">
                  <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-100">
                    Completar Verificación Avanzada
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Notificaciones</CardTitle>
              <CardDescription>Controla qué notificaciones recibes y cómo las recibes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Notificaciones por correo electrónico</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Transacciones</Label>
                    <p className="text-sm text-slate-500">Recibe notificaciones cuando se realicen transacciones</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={() => handleToggle("emailNotifications")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Emails de marketing</Label>
                    <p className="text-sm text-slate-500">Recibe noticias y actualizaciones de Kiipay</p>
                  </div>
                  <Switch checked={settings.marketingEmails} onCheckedChange={() => handleToggle("marketingEmails")} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Notificaciones por SMS</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Transacciones por SMS</Label>
                    <p className="text-sm text-slate-500">Recibe notificaciones SMS para tus transacciones</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={() => handleToggle("smsNotifications")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Alertas promocionales</Label>
                    <p className="text-sm text-slate-500">Recibe ofertas especiales vía SMS</p>
                  </div>
                  <Switch
                    checked={settings.promotionalAlerts}
                    onCheckedChange={() => handleToggle("promotionalAlerts")}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <p className="text-xs text-slate-500">
                Puedes cambiar tus preferencias de notificación en cualquier momento
              </p>
              <Button className="bg-[#0a2463] hover:bg-[#0a2463]/90">Guardar Preferencias</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Blockchain</CardTitle>
              <CardDescription>Configura tus preferencias para transacciones en blockchain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="explorerPreference">Preferencia de Explorador</Label>
                <Select defaultValue="kii">
                  <SelectTrigger id="explorerPreference">
                    <SelectValue placeholder="Selecciona una preferencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kii">Kii Explorer (Recomendado)</SelectItem>
                    <SelectItem value="etherscan">Etherscan</SelectItem>
                    <SelectItem value="bscscan">BSCscan</SelectItem>
                    <SelectItem value="solana">Solana Explorer</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 mt-1">
                  El Kii Explorer te permite verificar todas tus transacciones en la blockchain Kii y otras redes
                  compatibles.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gasPreference">Preferencia de Comisiones de Gas</Label>
                <Select defaultValue="standard">
                  <SelectTrigger id="gasPreference">
                    <SelectValue placeholder="Selecciona una preferencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Económico (más lento)</SelectItem>
                    <SelectItem value="standard">Estándar (recomendado)</SelectItem>
                    <SelectItem value="fast">Rápido (más caro)</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 mt-1">
                  La red Kii tiene comisiones significativamente más bajas que otras redes.
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center mb-2">
                  <Globe className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-800">Tecnología Cross-chain</span>
                </div>
                <p className="text-sm text-blue-700">
                  Kiipay utiliza tecnología cross-chain para permitirte operar con múltiples blockchains. Tu moneda
                  principal es KII, pero puedes enviar y recibir fondos en ETH, SOL, BNB y más.
                </p>
                <div className="mt-3 grid grid-cols-5 gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100">
                      <span>🔷</span>
                    </div>
                    <span className="text-xs mt-1">KII</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100">
                      <span>💎</span>
                    </div>
                    <span className="text-xs mt-1">ETH</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100">
                      <span>🟣</span>
                    </div>
                    <span className="text-xs mt-1">SOL</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100">
                      <span>🟡</span>
                    </div>
                    <span className="text-xs mt-1">BNB</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100">
                      <span>🔴</span>
                    </div>
                    <span className="text-xs mt-1">AVAX</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button className="ml-auto bg-[#0a2463] hover:bg-[#0a2463]/90">Guardar Preferencias</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Opciones de Visualización</CardTitle>
              <CardDescription>Personaliza la apariencia de la plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Modo oscuro</Label>
                  <p className="text-sm text-slate-500">Cambiar al tema oscuro</p>
                </div>
                <Switch checked={settings.darkMode} onCheckedChange={() => handleToggle("darkMode")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFormat">Formato de Fecha</Label>
                <Select defaultValue="dd/mm/yyyy">
                  <SelectTrigger id="dateFormat">
                    <SelectValue placeholder="Selecciona un formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeZone">Zona Horaria</Label>
                <Select defaultValue="europe-madrid">
                  <SelectTrigger id="timeZone">
                    <SelectValue placeholder="Selecciona una zona horaria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="europe-madrid">Europa/Madrid (GMT+1)</SelectItem>
                    <SelectItem value="america-mexico">América/Ciudad de México (GMT-6)</SelectItem>
                    <SelectItem value="america-bogota">América/Bogotá (GMT-5)</SelectItem>
                    <SelectItem value="america-buenosaires">América/Buenos Aires (GMT-3)</SelectItem>
                    <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button className="ml-auto bg-[#0a2463] hover:bg-[#0a2463]/90">Aplicar Cambios</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
