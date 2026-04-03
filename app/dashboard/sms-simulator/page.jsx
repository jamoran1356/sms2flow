"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Send, Phone, Wifi, Battery, Signal, HelpCircle, RotateCcw, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const QUICK_COMMANDS = [
  { label: "HELP", cmd: "HELP" },
  { label: "BALANCE", cmd: "BALANCE" },
  { label: "HISTORY", cmd: "HISTORY" },
  { label: "MARKET", cmd: "MARKET" },
  { label: "REGISTER", cmd: "REGISTER Demo User" },
  { label: "SEND", cmd: "SEND 1.0 TO +5215512345678 KEY abc123" },
  { label: "SELL", cmd: "SELL 10 4.50 USD" },
  { label: "P2PBUY", cmd: "P2PBUY 5 4.20 USD" },
]

function PhoneStatusBar() {
  const now = new Date()
  const time = now.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })
  return (
    <div className="flex items-center justify-between px-5 py-1.5 text-white text-[11px] font-medium">
      <span>{time}</span>
      <div className="flex items-center gap-1">
        <Signal className="h-3 w-3" />
        <Wifi className="h-3 w-3" />
        <Battery className="h-3.5 w-3.5" />
      </div>
    </div>
  )
}

function MessageBubble({ message }) {
  const isUser = message.type === "sent"
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm shadow-sm ${
          isUser
            ? "bg-blue-500 text-white rounded-br-md"
            : "bg-white text-gray-900 rounded-bl-md border border-gray-100"
        }`}
      >
        <p className="whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
        <p className={`text-[10px] mt-1 ${isUser ? "text-blue-100" : "text-gray-400"} text-right`}>
          {message.time}
        </p>
      </div>
    </div>
  )
}

export default function SmsSimulatorPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      type: "received",
      text: "Bienvenido al simulador SMS2Flow!\nEscribe un comando SMS o usa los botones rapidos.\n\nEnvia HELP para ver todos los comandos.",
      time: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
    },
  ])
  const [input, setInput] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("+5215512345678")
  const [sending, setSending] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const getTime = () => new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })

  const sendMessage = async (text) => {
    if (!text.trim() || sending) return

    const userMsg = {
      id: `sent-${Date.now()}`,
      type: "sent",
      text: text.trim(),
      time: getTime(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setSending(true)

    try {
      const res = await fetch("/api/sms/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim(), fromPhone: phoneNumber }),
      })

      const data = await res.json()

      const replyMsg = {
        id: `received-${Date.now()}`,
        type: "received",
        text: data.reply || data.error || "Sin respuesta",
        time: getTime(),
        command: data.command,
        ok: data.ok,
      }
      setMessages((prev) => [...prev, replyMsg])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          type: "received",
          text: "Error de conexion. Intenta de nuevo.",
          time: getTime(),
          ok: false,
        },
      ])
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleQuickCommand = (cmd) => {
    sendMessage(cmd)
  }

  const clearChat = () => {
    setMessages([
      {
        id: "welcome-new",
        type: "received",
        text: "Chat reiniciado. Envia HELP para ver los comandos.",
        time: getTime(),
      },
    ])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Simulador SMS</h1>
          <p className="text-gray-500">Prueba los comandos SMS como si enviaras mensajes de texto</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Phone Mockup */}
        <div className="flex justify-center lg:justify-start">
          <div className="relative">
            {/* Phone Frame */}
            <div className="w-[340px] h-[680px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl shadow-gray-900/30 ring-1 ring-gray-700">
              {/* Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-black rounded-b-2xl z-10" />

              {/* Screen */}
              <div className="w-full h-full bg-gray-100 rounded-[2.3rem] overflow-hidden flex flex-col">
                {/* Status Bar */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 shrink-0">
                  <PhoneStatusBar />
                  {/* SMS Header */}
                  <div className="flex items-center gap-2 px-4 pb-2.5 pt-1">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <Smartphone className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">SMS2Flow</p>
                      <p className="text-blue-200 text-[10px]">Servicio de pagos</p>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto px-3 py-3 bg-gradient-to-b from-gray-50 to-gray-100"
                >
                  {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))}
                  {sending && (
                    <div className="flex justify-start mb-2">
                      <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="shrink-0 bg-white border-t border-gray-200 px-2 py-2">
                  <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value.toUpperCase())}
                      placeholder="Escribe un comando SMS..."
                      className="flex-1 rounded-full text-sm h-9 bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-blue-400 px-4"
                      disabled={sending}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!input.trim() || sending}
                      className="h-9 w-9 rounded-full bg-blue-500 hover:bg-blue-600 shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="space-y-4">
          {/* Phone Config */}
          <Card className="bg-white border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Phone className="h-4 w-4" />
                Configuracion del Simulador
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">Numero de telefono (remitente)</label>
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+5215512345678"
                  className="font-mono"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Este es el numero que envia los SMS. Usa un numero registrado para probar comandos que requieren cuenta.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={clearChat} className="gap-2">
                <RotateCcw className="h-3.5 w-3.5" />
                Reiniciar chat
              </Button>
            </CardContent>
          </Card>

          {/* Quick Commands */}
          <Card className="bg-white border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <HelpCircle className="h-4 w-4" />
                Comandos Rapidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {QUICK_COMMANDS.map((qc) => (
                  <Button
                    key={qc.label}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickCommand(qc.cmd)}
                    disabled={sending}
                    className="text-xs font-mono justify-start"
                  >
                    {qc.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Commands Reference */}
          <Card className="bg-white border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Referencia de Comandos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-[120px_1fr] gap-1">
                  <Badge variant="secondary" className="font-mono text-xs justify-center">HELP</Badge>
                  <span className="text-gray-600">Ver todos los comandos disponibles</span>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-1">
                  <Badge variant="secondary" className="font-mono text-xs justify-center">REGISTER</Badge>
                  <span className="text-gray-600">REGISTER &lt;nombre&gt; — Crear cuenta nueva</span>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-1">
                  <Badge variant="secondary" className="font-mono text-xs justify-center">BALANCE</Badge>
                  <span className="text-gray-600">Consultar saldo de billeteras</span>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-1">
                  <Badge variant="secondary" className="font-mono text-xs justify-center">SEND</Badge>
                  <span className="text-gray-600">SEND &lt;monto&gt; TO &lt;tel&gt; KEY &lt;clave&gt;</span>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-1">
                  <Badge variant="secondary" className="font-mono text-xs justify-center">CONFIRM</Badge>
                  <span className="text-gray-600">CONFIRM &lt;id&gt; &lt;clave&gt; — Confirmar envio</span>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-1">
                  <Badge variant="secondary" className="font-mono text-xs justify-center">SELL</Badge>
                  <span className="text-gray-600">SELL &lt;monto&gt; &lt;precio&gt; &lt;moneda&gt;</span>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-1">
                  <Badge variant="secondary" className="font-mono text-xs justify-center">P2PBUY</Badge>
                  <span className="text-gray-600">P2PBUY &lt;monto&gt; &lt;precio&gt; &lt;moneda&gt;</span>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-1">
                  <Badge variant="secondary" className="font-mono text-xs justify-center">MARKET</Badge>
                  <span className="text-gray-600">MARKET [BUY|SELL] — Ver anuncios P2P</span>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-1">
                  <Badge variant="secondary" className="font-mono text-xs justify-center">HISTORY</Badge>
                  <span className="text-gray-600">HISTORY [n] — Ultimas n transacciones</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integration Info */}
          <Card className="bg-white border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Integracion Twilio</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-2">
              <p>
                Este simulador usa el mismo procesador de comandos que el webhook de Twilio.
                Para activar SMS reales:
              </p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Configura tus credenciales Twilio en <strong>Admin → Configuracion</strong></li>
                <li>Configura el webhook en Twilio Console:</li>
              </ol>
              <code className="block bg-gray-100 rounded px-3 py-2 text-xs font-mono break-all">
                POST https://tu-dominio.com/api/sms/twilio
              </code>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
