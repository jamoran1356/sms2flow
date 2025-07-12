"use client"

import { useState } from "react"
import Link from "next/link"
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  ExternalLink,
  MessageSquare,
  RefreshCw,
  Settings,
  Shield,
  Smartphone,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function SmsPaymentsPage() {
  const [isConfigured, setIsConfigured] = useState(true)
  const [smsEnabled, setSmsEnabled] = useState(true)
  const [phoneNumber, setPhoneNumber] = useState("+34 612 345 678")
  const [keyword, setKeyword] = useState("KIIPAY")
  const [defaultChain, setDefaultChain] = useState("kii")
  const [confirmationRequired, setConfirmationRequired] = useState(true)

  const handleCopyCommand = (command) => {
    navigator.clipboard
      .writeText(command)
      .then(() => {
        alert("Comando copiado al portapapeles")
      })
      .catch((err) => {
        console.error("Error al copiar: ", err)
      })
  }

  const smsTransactions = [
    {
      id: "tx-1",
      type: "received",
      amount: "50 KII",
      usdValue: "$25.00",
      date: "12/05/2023 14:32",
      sender: "+34 698 765 432",
      status: "completed",
      txHash: "0x1a2b...3c4d",
    },
    {
      id: "tx-2",
      type: "sent",
      amount: "100 KII",
      usdValue: "$50.00",
      date: "05/05/2023 09:15",
      recipient: "+34 654 321 987",
      status: "completed",
      txHash: "0x5e6f...7g8h",
    },
    {
      id: "tx-3",
      type: "received",
      amount: "25 KII",
      usdValue: "$12.50",
      date: "01/05/2023 18:45",
      sender: "+34 634 765 123",
      status: "completed",
      txHash: "0x9i10j...11k12l",
    },
    {
      id: "tx-4",
      type: "sent",
      amount: "75 KII",
      usdValue: "$37.50",
      date: "25/04/2023 11:20",
      recipient: "+34 612 345 678",
      status: "completed",
      txHash: "0x13m14n...15o16p",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Pagos por SMS</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <RefreshCw className="h-4 w-4" />
            <span>Actualizar</span>
          </Button>
          <Link href="/dashboard/settings">
            <Button variant="outline" size="sm" className="gap-1">
              <Settings className="h-4 w-4" />
              <span>Configuración</span>
            </Button>
          </Link>
        </div>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <MessageSquare className="h-4 w-4 text-blue-600" />
        <AlertTitle>Pagos por SMS</AlertTitle>
        <AlertDescription className="text-blue-800">
          Envía y recibe pagos en KII a través de mensajes de texto, sin necesidad de internet. Funciona en cualquier
          teléfono, incluso en modelos básicos.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Pagos SMS</CardTitle>
              <CardDescription>Configura tus preferencias para enviar y recibir pagos por SMS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Activar Pagos SMS</Label>
                  <p className="text-sm text-slate-500">
                    Habilita o deshabilita la capacidad de enviar y recibir pagos por SMS
                  </p>
                </div>
                <Switch checked={smsEnabled} onCheckedChange={setSmsEnabled} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Número de Teléfono</Label>
                <div className="flex gap-2">
                  <Input
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+34 612 345 678"
                    disabled={!smsEnabled}
                  />
                  <Button variant="outline" disabled={!smsEnabled}>
                    Verificar
                  </Button>
                </div>
                <p className="text-xs text-slate-500">
                  Este es el número de teléfono registrado para enviar y recibir pagos por SMS
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keyword">Palabra Clave</Label>
                <Input
                  id="keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="KIIPAY"
                  disabled={!smsEnabled}
                />
                <p className="text-xs text-slate-500">
                  Esta palabra clave se utiliza para iniciar comandos SMS. Por ejemplo: KIIPAY ENVIAR 50 a +34612345678
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultChain">Red Blockchain Predeterminada</Label>
                <Select value={defaultChain} onValueChange={setDefaultChain} disabled={!smsEnabled}>
                  <SelectTrigger id="defaultChain">
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
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">
                  Por defecto, los pagos se realizan en KII a través de la red blockchain Kii.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Confirmación Requerida</Label>
                  <p className="text-sm text-slate-500">Requiere confirmación por SMS para todas las transacciones</p>
                </div>
                <Switch
                  checked={confirmationRequired}
                  onCheckedChange={setConfirmationRequired}
                  disabled={!smsEnabled}
                />
              </div>

              <Alert variant="outline" className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  Para mayor seguridad, te recomendamos mantener activada la confirmación por SMS para todas las
                  transacciones.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button className="ml-auto bg-[#0a2463] hover:bg-[#0a2463]/90" disabled={!smsEnabled}>
                Guardar Configuración
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historial de Transacciones SMS</CardTitle>
              <CardDescription>Visualiza todas tus transacciones realizadas por SMS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {smsTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                          tx.type === "received" ? "bg-green-100" : "bg-amber-100"
                        }`}
                      >
                        {tx.type === "received" ? (
                          <ArrowDown className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowUp className="h-4 w-4 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {tx.type === "received" ? "Recibido" : "Enviado"}{" "}
                          <span className="text-xs text-slate-500">
                            {tx.type === "received" ? `de ${tx.sender}` : `a ${tx.recipient}`}
                          </span>
                        </p>
                        <p className="text-xs text-slate-500">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${tx.type === "received" ? "text-green-600" : "text-amber-600"}`}>
                        {tx.type === "received" ? "+" : "-"}
                        {tx.amount}
                      </p>
                      <div className="flex items-center justify-end text-xs text-slate-500">
                        {tx.usdValue}
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="ml-1 text-blue-600 hover:underline flex items-center">
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Detalles de la Transacción</DialogTitle>
                              <DialogDescription>Información detallada sobre esta transacción</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <div className="text-slate-500">ID de Transacción:</div>
                                <div className="font-medium">{tx.id}</div>
                                <div className="text-slate-500">Hash de Transacción:</div>
                                <div className="font-medium flex items-center">
                                  {tx.txHash}
                                  <button className="ml-1 text-blue-600 hover:text-blue-800">
                                    <Copy className="h-3 w-3" />
                                  </button>
                                </div>
                                <div className="text-slate-500">Tipo:</div>
                                <div className="font-medium">{tx.type === "received" ? "Recibido" : "Enviado"}</div>
                                <div className="text-slate-500">Cantidad:</div>
                                <div className="font-medium">{tx.amount}</div>
                                <div className="text-slate-500">Valor en USD:</div>
                                <div className="font-medium">{tx.usdValue}</div>
                                <div className="text-slate-500">Fecha:</div>
                                <div className="font-medium">{tx.date}</div>
                                <div className="text-slate-500">Estado:</div>
                                <div className="font-medium flex items-center text-green-600">
                                  <Check className="h-3 w-3 mr-1" />
                                  Completado
                                </div>
                                <div className="text-slate-500">
                                  {tx.type === "received" ? "Remitente:" : "Destinatario:"}
                                </div>
                                <div className="font-medium">{tx.type === "received" ? tx.sender : tx.recipient}</div>
                                <div className="text-slate-500">Red:</div>
                                <div className="font-medium">Kii Network</div>
                                <div className="text-slate-500">Moneda:</div>
                                <div className="font-medium">KII</div>
                              </div>
                              <div className="flex justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    window.open(`https://kii-explorer.com/tx/${tx.txHash.replace("...", "")}`, "_blank")
                                  }
                                >
                                  Ver en Kii Explorer
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button variant="outline" size="sm">
                Ver todas las transacciones
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cómo Usar los Pagos SMS</CardTitle>
              <CardDescription>Comandos básicos para enviar y recibir pagos por SMS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center mb-3">
                  <Shield className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-medium text-blue-800">Red Blockchain Kii</h3>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  Todos los pagos por SMS se realizan a través de la red blockchain Kii, utilizando la criptomoneda
                  nativa KII. Esta red ofrece transacciones rápidas y bajas comisiones, ideales para pagos móviles.
                </p>
                <div className="text-xs text-blue-600">
                  Los pagos en KII se pueden verificar utilizando el{" "}
                  <a href="https://kii-explorer.com" target="_blank" rel="noopener noreferrer" className="underline">
                    Kii Explorer
                  </a>
                  .
                </div>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <MessageSquare className="h-4 w-4 text-slate-500 mr-2" />
                    Enviar Pagos
                  </h3>
                  <div className="p-3 bg-slate-50 rounded-md font-mono text-sm">
                    KIIPAY ENVIAR [cantidad] a [número]
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Ejemplo: KIIPAY ENVIAR 50 a +34612345678</p>
                  <div className="mt-2 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7"
                      onClick={() => handleCopyCommand("KIIPAY ENVIAR 50 a +34612345678")}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copiar
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <MessageSquare className="h-4 w-4 text-slate-500 mr-2" />
                    Consultar Saldo
                  </h3>
                  <div className="p-3 bg-slate-50 rounded-md font-mono text-sm">KIIPAY SALDO</div>
                  <p className="text-xs text-slate-500 mt-2">Consulta tu saldo actual de KII</p>
                  <div className="mt-2 flex justify-end">
                    <Button variant="ghost" size="sm" className="h-7" onClick={() => handleCopyCommand("KIIPAY SALDO")}>
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copiar
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <MessageSquare className="h-4 w-4 text-slate-500 mr-2" />
                    Solicitar Pago
                  </h3>
                  <div className="p-3 bg-slate-50 rounded-md font-mono text-sm">
                    KIIPAY SOLICITAR [cantidad] a [número]
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Ejemplo: KIIPAY SOLICITAR 100 a +34654321987</p>
                  <div className="mt-2 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7"
                      onClick={() => handleCopyCommand("KIIPAY SOLICITAR 100 a +34654321987")}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copiar
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <MessageSquare className="h-4 w-4 text-slate-500 mr-2" />
                    Últimas Transacciones
                  </h3>
                  <div className="p-3 bg-slate-50 rounded-md font-mono text-sm">KIIPAY HISTORIAL</div>
                  <p className="text-xs text-slate-500 mt-2">Recibe un resumen de tus últimas 5 transacciones</p>
                  <div className="mt-2 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7"
                      onClick={() => handleCopyCommand("KIIPAY HISTORIAL")}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copiar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seguridad de Pagos SMS</CardTitle>
              <CardDescription>Protección para tus transacciones por SMS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 shrink-0">
                  <Shield className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Confirmación de dos pasos</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Todas las transacciones requieren una confirmación adicional por SMS para mayor seguridad.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 shrink-0">
                  <Smartphone className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Verificación de número</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Solo los números de teléfono verificados pueden realizar transacciones por SMS.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 shrink-0">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Palabra clave personalizada</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Tu palabra clave personalizada garantiza que solo tú puedas iniciar comandos desde tu número.
                  </p>
                </div>
              </div>

              <Alert variant="outline" className="bg-blue-50 border-blue-100 mt-4">
                <AlertDescription className="text-blue-800">
                  Todas las transacciones SMS se procesan en la blockchain Kii, proporcionando la misma seguridad y
                  transparencia que las transacciones web. Recibes y envías KII, la criptomoneda nativa de la red Kii.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Límites de Transacción</CardTitle>
              <CardDescription>Límites para tus pagos por SMS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">Transacción Individual</h3>
                  <p className="text-lg font-bold">500 KII</p>
                  <p className="text-xs text-slate-500">Aproximadamente $250 USD</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">Límite Diario</h3>
                  <p className="text-lg font-bold">2,000 KII</p>
                  <p className="text-xs text-slate-500">Aproximadamente $1,000 USD</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">Límite Semanal</h3>
                  <p className="text-lg font-bold">10,000 KII</p>
                  <p className="text-xs text-slate-500">Aproximadamente $5,000 USD</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="text-sm font-medium mb-1">Transacciones / Día</h3>
                  <p className="text-lg font-bold">20</p>
                  <p className="text-xs text-slate-500">Máximo de transacciones diarias</p>
                </div>
              </div>

              <div className="text-center">
                <Link href="/dashboard/settings/security">
                  <Button variant="outline" size="sm">
                    Aumentar Límites con Verificación
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
