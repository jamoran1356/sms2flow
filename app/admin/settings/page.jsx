"use client"

import { useState, useEffect } from "react"
import { Settings, Database, Mail, Blocks, Zap, Shield, Wifi, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({})

  // General
  const [systemName, setSystemName] = useState("SMS2Flow")
  const [systemDescription, setSystemDescription] = useState("Plataforma de pagos blockchain via SMS")
  const [timezone, setTimezone] = useState("America/Mexico_City")
  const [language, setLanguage] = useState("es")
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [debugMode, setDebugMode] = useState(false)

  // Blockchain
  const [flowNetwork, setFlowNetwork] = useState("testnet")
  const [flowEndpoint, setFlowEndpoint] = useState("")
  const [contractAddress, setContractAddress] = useState("")
  const [gasLimit, setGasLimit] = useState("")
  const [transactionFee, setTransactionFee] = useState("")
  const [supportedTokens, setSupportedTokens] = useState("FLOW")

  // SMTP
  const [smtpHost, setSmtpHost] = useState("")
  const [smtpPort, setSmtpPort] = useState("")
  const [smtpUser, setSmtpUser] = useState("")

  // SMS / Twilio
  const [smsProvider, setSmsProvider] = useState("twilio")
  const [smsSid, setSmsSid] = useState("")
  const [smsAuthToken, setSmsAuthToken] = useState("")
  const [smsFrom, setSmsFrom] = useState("")
  const [smsWebhookUrl, setSmsWebhookUrl] = useState("")
  const [twilioTestStatus, setTwilioTestStatus] = useState(null)
  const [twilioTesting, setTwilioTesting] = useState(false)

  // Advanced
  const [logLevel, setLogLevel] = useState("info")
  const [cacheTtl, setCacheTtl] = useState("")
  const [rateLimit, setRateLimit] = useState("")

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings")
        if (res.ok) {
          const data = await res.json()
          const s = data.settings || []
          const map = {}
          s.forEach((item) => { map[item.key] = item.value })
          setSettings(map)
          if (map.systemName) setSystemName(map.systemName)
          if (map.systemDescription) setSystemDescription(map.systemDescription)
          if (map.timezone) setTimezone(map.timezone)
          if (map.language) setLanguage(map.language)
          if (map.maintenanceMode) setMaintenanceMode(map.maintenanceMode === "true")
          if (map.debugMode) setDebugMode(map.debugMode === "true")
          if (map.flowNetwork) setFlowNetwork(map.flowNetwork)
          if (map.flowEndpoint) setFlowEndpoint(map.flowEndpoint)
          if (map.contractAddress) setContractAddress(map.contractAddress)
          if (map.gasLimit) setGasLimit(map.gasLimit)
          if (map.transactionFee) setTransactionFee(map.transactionFee)
          if (map.supportedTokens) setSupportedTokens(map.supportedTokens)
          if (map.smtpHost) setSmtpHost(map.smtpHost)
          if (map.smtpPort) setSmtpPort(map.smtpPort)
          if (map.smtpUser) setSmtpUser(map.smtpUser)
          if (map.smsProvider) setSmsProvider(map.smsProvider)
          if (map.smsSid) setSmsSid(map.smsSid)
          if (map.smsAuthToken) setSmsAuthToken(map.smsAuthToken)
          if (map.smsFrom) setSmsFrom(map.smsFrom)
          if (map.smsWebhookUrl) setSmsWebhookUrl(map.smsWebhookUrl)
          if (map.logLevel) setLogLevel(map.logLevel)
          if (map.cacheTtl) setCacheTtl(map.cacheTtl)
          if (map.rateLimit) setRateLimit(map.rateLimit)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        systemName, systemDescription, timezone, language,
        maintenanceMode: String(maintenanceMode), debugMode: String(debugMode),
        flowNetwork, flowEndpoint, contractAddress, gasLimit, transactionFee, supportedTokens,
        smtpHost, smtpPort, smtpUser, smsProvider, smsSid, smsAuthToken, smsFrom, smsWebhookUrl,
        logLevel, cacheTtl, rateLimit,
      }
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h1>
          <p className="text-gray-500">Gestiona las configuraciones globales de SMS2Flow</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Guardando..." : "Guardar"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          <TabsTrigger value="advanced">Avanzado</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Información del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nombre del Sistema</Label>
                  <Input value={systemName} onChange={(e) => setSystemName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Zona Horaria</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Mexico_City">México (GMT-6)</SelectItem>
                      <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                      <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                      <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea value={systemDescription} onChange={(e) => setSystemDescription(e.target.value)} rows={2} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Idioma por Defecto</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <Label className="text-base">Modo Mantenimiento</Label>
                  <p className="text-sm text-muted-foreground">Desactiva el acceso público</p>
                </div>
                <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Configuración SMTP
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Servidor SMTP</Label>
                  <Input placeholder="smtp.gmail.com" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Puerto</Label>
                  <Input placeholder="587" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Usuario</Label>
                  <Input placeholder="noreply@sms2flow.com" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} />
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  Configuración SMS / Twilio
                </CardTitle>
                <CardDescription>Configura la integración con Twilio para enviar y recibir SMS reales</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Proveedor SMS</Label>
                  <Select value={smsProvider} onValueChange={setSmsProvider}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="nexmo">Nexmo</SelectItem>
                      <SelectItem value="aws">AWS SNS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Account SID</Label>
                  <Input placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" value={smsSid} onChange={(e) => setSmsSid(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Auth Token</Label>
                  <Input type="password" placeholder="Tu auth token de Twilio" value={smsAuthToken} onChange={(e) => setSmsAuthToken(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Número de Origen (From)</Label>
                  <Input placeholder="+1234567890" value={smsFrom} onChange={(e) => setSmsFrom(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Webhook URL</Label>
                  <Input
                    placeholder="https://tu-dominio.com/api/sms/twilio"
                    value={smsWebhookUrl}
                    onChange={(e) => setSmsWebhookUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Configura esta URL como webhook en tu panel de Twilio (Messaging → Webhooks)
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={twilioTesting || !smsSid || !smsAuthToken}
                    onClick={async () => {
                      setTwilioTesting(true)
                      setTwilioTestStatus(null)
                      try {
                        const res = await fetch("/api/admin/twilio/test", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ accountSid: smsSid, authToken: smsAuthToken }),
                        })
                        const data = await res.json()
                        setTwilioTestStatus(data.ok ? "success" : "error")
                      } catch {
                        setTwilioTestStatus("error")
                      } finally {
                        setTwilioTesting(false)
                      }
                    }}
                  >
                    {twilioTesting ? "Probando..." : "Probar Conexión"}
                  </Button>
                  {twilioTestStatus === "success" && (
                    <span className="text-sm text-green-600 font-medium">✓ Conexión exitosa</span>
                  )}
                  {twilioTestStatus === "error" && (
                    <span className="text-sm text-red-600 font-medium">✗ Error de conexión</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blockchain" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Blocks className="h-5 w-5" />
                Configuración Flow Blockchain
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Red Flow</Label>
                  <Select value={flowNetwork} onValueChange={setFlowNetwork}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mainnet">Mainnet</SelectItem>
                      <SelectItem value="testnet">Testnet</SelectItem>
                      <SelectItem value="emulator">Emulator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Endpoint RPC</Label>
                  <Input placeholder="https://rest-testnet.onflow.org" value={flowEndpoint} onChange={(e) => setFlowEndpoint(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Dirección del Contrato</Label>
                <Input placeholder="0x1234567890abcdef" value={contractAddress} onChange={(e) => setContractAddress(e.target.value)} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Límite de Gas</Label>
                  <Input placeholder="1000" value={gasLimit} onChange={(e) => setGasLimit(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Comisión por Transacción (%)</Label>
                  <Input placeholder="2.5" value={transactionFee} onChange={(e) => setTransactionFee(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tokens Soportados</Label>
                <Textarea placeholder="FLOW, USDC, FUSD" rows={2} value={supportedTokens} onChange={(e) => setSupportedTokens(e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Configuraciones Avanzadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Modo Debug</Label>
                  <p className="text-sm text-muted-foreground">Habilita logs detallados</p>
                </div>
                <Switch checked={debugMode} onCheckedChange={setDebugMode} />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Nivel de Logs</Label>
                  <Select value={logLevel} onValueChange={setLogLevel}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="warn">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="debug">Debug</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>TTL de Cache (seg)</Label>
                  <Input placeholder="3600" value={cacheTtl} onChange={(e) => setCacheTtl(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Rate Limit (req/min)</Label>
                  <Input placeholder="100" value={rateLimit} onChange={(e) => setRateLimit(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
