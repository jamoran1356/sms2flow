"use client"

import { useState, useEffect } from "react"
import {
  ArrowDown,
  ArrowUp,
  Copy,
  ExternalLink,
  RefreshCw,
  Wallet,
  Plus,
  Star,
  Check,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useLanguage } from "@/components/language-provider"

function formatBalance(value, locale) {
  const num = parseFloat(value || 0)
  return new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(num)
}

export default function WalletPage() {
  const { t, locale } = useLanguage()
  const [wallets, setWallets] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [creating, setCreating] = useState(false)
  const [settingDefault, setSettingDefault] = useState(null)
  const [sendAddress, setSendAddress] = useState("")
  const [sendAmount, setSendAmount] = useState("")
  const [sending, setSending] = useState(false)
  const [sendDialogOpen, setSendDialogOpen] = useState(false)
  const [copied, setCopied] = useState(null)

  const fetchWallets = async () => {
    try {
      const res = await fetch("/api/wallets")
      if (res.ok) {
        const data = await res.json()
        setWallets(data.wallets || [])
      }
    } catch (e) {
      console.error("Error fetching wallets:", e)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchWallets() }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchWallets()
  }

  const handleCreateWallet = async () => {
    setCreating(true)
    try {
      const res = await fetch("/api/wallets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ network: "TESTNET" }),
      })
      if (res.ok) {
        await fetchWallets()
      }
    } catch (e) {
      console.error("Error creating wallet:", e)
    } finally {
      setCreating(false)
    }
  }

  const handleSetDefault = async (walletId) => {
    setSettingDefault(walletId)
    try {
      const res = await fetch("/api/wallets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletId }),
      })
      if (res.ok) {
        await fetchWallets()
      }
    } catch (e) {
      console.error("Error setting default:", e)
    } finally {
      setSettingDefault(null)
    }
  }

  const handleSend = async () => {
    if (!sendAddress || !sendAmount) return
    setSending(true)
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "TRANSFER",
          amount: parseFloat(sendAmount),
          currency: "FLOW",
          toAddress: sendAddress,
          description: "Transferencia de FLOW",
        }),
      })
      if (res.ok) {
        setSendDialogOpen(false)
        setSendAddress("")
        setSendAmount("")
        fetchWallets()
      }
    } catch (e) {
      console.error("Error sending:", e)
    } finally {
      setSending(false)
    }
  }

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const totalBalance = wallets.reduce((sum, w) => sum + parseFloat(w.balance || 0), 0)

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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t("wallet.title")}</h1>
          <p className="text-gray-500 mt-1">{t("wallet.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            {t("wallet.refresh")}
          </Button>
          <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <ArrowUp className="h-4 w-4 mr-2" />
                {t("wallet.sendFlow")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("wallet.sendTitle")}</DialogTitle>
                <DialogDescription>{t("wallet.sendDesc")}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>{t("wallet.destAddress")}</Label>
                  <Input
                    placeholder="0x..."
                    value={sendAddress}
                    onChange={(e) => setSendAddress(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>{t("wallet.amount")}</Label>
                    <span className="text-xs text-gray-500">{t("wallet.available", { n: formatBalance(totalBalance, locale) })}</span>
                  </div>
                  <Input
                    type="number"
                    step="0.0001"
                    placeholder="0.00"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSendDialogOpen(false)}>{t("common.cancel")}</Button>
                <Button onClick={handleSend} disabled={sending || !sendAddress || !sendAmount} className="bg-blue-600 hover:bg-blue-700">
                  {sending ? t("wallet.sending") : t("wallet.confirmSend")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Total Balance */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardContent className="py-8">
          <div className="text-center">
            <p className="text-blue-100 text-sm font-medium">{t("wallet.totalBalance")}</p>
            <p className="text-4xl font-bold mt-2">{formatBalance(totalBalance, locale)} FLOW</p>
            <p className="text-blue-200 text-sm mt-1">{t("wallet.walletsCount", { n: wallets.length })}</p>
          </div>
        </CardContent>
      </Card>

      {/* Wallets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{t("wallet.myWallets")}</h2>
          <Button variant="outline" size="sm" onClick={handleCreateWallet} disabled={creating}>
            <Plus className="h-4 w-4 mr-2" />
            {creating ? t("wallet.creating") : t("wallet.newWallet")}
          </Button>
        </div>

        {wallets.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {wallets.map((wallet) => (
              <Card key={wallet.id} className={`border-0 shadow-md hover:shadow-lg transition-shadow ${wallet.isDefault ? "ring-2 ring-blue-500" : ""}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-blue-50">
                        <Wallet className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-sm">{wallet.network}{t("wallet.walletSuffix")}</CardTitle>
                        <CardDescription className="text-xs">
                          {wallet.isDefault && <Badge className="bg-blue-600 text-xs mr-1">{t("common.principal")}</Badge>}
                          {t("wallet.createdOn")}{new Date(wallet.createdAt).toLocaleDateString(locale === "es" ? "es-ES" : "en-US")}
                        </CardDescription>
                      </div>
                    </div>
                    {!wallet.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-gray-500 hover:text-blue-600"
                        onClick={() => handleSetDefault(wallet.id)}
                        disabled={settingDefault === wallet.id}
                      >
                        <Star className="h-3.5 w-3.5 mr-1" />
                        {settingDefault === wallet.id ? "..." : t("wallet.makeDefault")}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <code className="text-xs font-mono text-gray-700 truncate max-w-[200px]">{wallet.address}</code>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => copyToClipboard(wallet.address, wallet.id)}>
                          {copied === wallet.id ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => window.open(`https://testnet.flowscan.io/account/${wallet.address}`, "_blank")}>
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{formatBalance(wallet.balance, locale)}</p>
                      <p className="text-sm text-gray-500">FLOW</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-md">
            <CardContent className="py-12 text-center">
              <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{t("wallet.noWallets")}</p>
              <Button size="sm" className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={handleCreateWallet} disabled={creating}>
                {creating ? t("wallet.creating") : t("wallet.createFirst")}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
