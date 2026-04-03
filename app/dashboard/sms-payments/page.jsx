"use client"

import { useState, useEffect } from "react"
import {
  Copy,
  Phone,
  MessageSquare,
  Send,
  Wallet,
  History,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "@/components/language-provider"

export default function SMSPayments() {
  const { t, locale } = useLanguage()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [phone, setPhone] = useState("")
  const [amount, setAmount] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const fetchSmsTransactions = async () => {
      try {
        const res = await fetch("/api/transactions?type=SMS_PAYMENT")
        if (res.ok) {
          const data = await res.json()
          setTransactions(data.transactions || [])
        }
      } catch (e) {
        console.error("Error fetching SMS txs:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchSmsTransactions()
  }, [])

  const handleSendSms = async () => {
    if (!phone || !amount) return
    setSending(true)
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "SMS_PAYMENT",
          amount: parseFloat(amount),
          currency: "FLOW",
          toPhone: phone,
          description: `Pago SMS a ${phone}`,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setTransactions((prev) => [data.transaction, ...prev])
        setPhone("")
        setAmount("")
      }
    } catch (e) {
      console.error("Error sending SMS payment:", e)
    } finally {
      setSending(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "COMPLETED": return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "PENDING": return <Clock className="h-4 w-4 text-yellow-500" />
      case "FAILED": return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t("smsPayments.title")}</h1>
          <p className="text-gray-500 mt-1">{t("smsPayments.subtitle")}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Enviar pago SMS */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-600" />
              {t("smsPayments.sendTitle")}
            </CardTitle>
            <CardDescription>{t("smsPayments.sendDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("smsPayments.phoneLabel")}</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("smsPayments.phonePlaceholder")}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("smsPayments.amountLabel")}</Label>
              <Input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t("smsPayments.amountPlaceholder")}
              />
            </div>
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
              onClick={handleSendSms}
              disabled={sending || !phone || !amount}
            >
              {sending ? t("smsPayments.sending") : (
                <><Send className="h-4 w-4 mr-2" /> {t("smsPayments.sendButton")}</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Comandos SMS */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>{t("smsPayments.commandsTitle")}</CardTitle>
            <CardDescription>{t("smsPayments.commandsDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert className="bg-blue-50 border-blue-200">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                {t("smsPayments.commandsAlert")}
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {[
                { icon: <Send className="h-4 w-4 text-green-600" />, label: "Enviar", cmd: "SMS2FLOW ENVIAR [cantidad] a [número]", example: "SMS2FLOW ENVIAR 50 a +34612345678" },
                { icon: <Wallet className="h-4 w-4 text-blue-600" />, label: "Saldo", cmd: "SMS2FLOW SALDO", example: "Consulta tu saldo actual" },
                { icon: <MessageSquare className="h-4 w-4 text-purple-600" />, label: "Solicitar", cmd: "SMS2FLOW SOLICITAR [cantidad] a [número]", example: "SMS2FLOW SOLICITAR 100 a +34654321987" },
                { icon: <History className="h-4 w-4 text-orange-600" />, label: "Historial", cmd: "SMS2FLOW HISTORIAL", example: "Ver últimas transacciones" },
              ].map((item) => (
                <div key={item.label} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => copyToClipboard(item.cmd)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <code className="text-xs bg-white p-2 rounded block">{item.cmd}</code>
                  <p className="text-xs text-gray-500 mt-1">{item.example}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historial */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>{t("smsPayments.historyTitle")}</CardTitle>
          <CardDescription>{t("smsPayments.historyDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("smsPayments.historyHeaders.status")}</TableHead>
                  <TableHead>{t("smsPayments.historyHeaders.dest")}</TableHead>
                  <TableHead>{t("smsPayments.historyHeaders.amount")}</TableHead>
                  <TableHead>{t("smsPayments.historyHeaders.date")}</TableHead>
                  <TableHead>{t("smsPayments.historyHeaders.txHash")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(tx.status)}
                        <Badge variant={tx.status === "COMPLETED" ? "default" : "secondary"}>
                          {tx.status === "COMPLETED" ? t("common.status.completed") : tx.status === "PENDING" ? t("common.status.pending") : t("common.status.failed")}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{tx.toAddress || tx.description || "—"}</TableCell>
                    <TableCell className="font-medium">{parseFloat(tx.amount).toFixed(2)} FLOW</TableCell>
                    <TableCell className="text-sm">{new Date(tx.createdAt).toLocaleString(locale === "es" ? "es-ES" : "en-US")}</TableCell>
                    <TableCell>
                      {tx.txHash ? (
                        <div className="flex items-center gap-1">
                          <code className="text-xs">{tx.txHash.slice(0, 8)}...</code>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => window.open(`https://flowscan.org/transaction/${tx.txHash}`, "_blank")}>
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p>{t("smsPayments.noHistory")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
