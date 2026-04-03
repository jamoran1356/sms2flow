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

export default function WalletPage() {
  const [wallets, setWallets] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [creating, setCreating] = useState(false)
  const [sendAddress, setSendAddress] = useState("")
  const [sendAmount, setSendAmount] = useState("")
  const [sending, setSending] = useState(false)
  const [sendDialogOpen, setSendDialogOpen] = useState(false)

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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Mi Billetera</h1>
          <p className="text-gray-500 mt-1">Gestiona tus billeteras Flow</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
          <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <ArrowUp className="h-4 w-4 mr-2" />
                Enviar FLOW
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enviar FLOW</DialogTitle>
                <DialogDescription>Transfiere tokens FLOW a otra dirección</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Dirección de destino</Label>
                  <Input
                    placeholder="0x..."
                    value={sendAddress}
                    onChange={(e) => setSendAddress(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Cantidad</Label>
                    <span className="text-xs text-gray-500">Disponible: {totalBalance.toFixed(4)} FLOW</span>
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
                <Button variant="outline" onClick={() => setSendDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleSend} disabled={sending || !sendAddress || !sendAmount} className="bg-blue-600 hover:bg-blue-700">
                  {sending ? "Enviando..." : "Confirmar Envío"}
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
            <p className="text-blue-100 text-sm font-medium">Balance Total</p>
            <p className="text-4xl font-bold mt-2">{totalBalance.toFixed(4)} FLOW</p>
            <p className="text-blue-200 text-sm mt-1">{wallets.length} billetera(s) activa(s)</p>
          </div>
        </CardContent>
      </Card>

      {/* Wallets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Mis Billeteras</h2>
          <Button variant="outline" size="sm" onClick={handleCreateWallet} disabled={creating}>
            <Plus className="h-4 w-4 mr-2" />
            {creating ? "Creando..." : "Nueva Billetera"}
          </Button>
        </div>

        {wallets.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {wallets.map((wallet) => (
              <Card key={wallet.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-blue-50">
                        <Wallet className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-sm">{wallet.network} Wallet</CardTitle>
                        <CardDescription className="text-xs">
                          {wallet.isDefault && <Badge className="bg-blue-600 text-xs mr-1">Principal</Badge>}
                          Creada {new Date(wallet.createdAt).toLocaleDateString("es-ES")}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <code className="text-xs font-mono text-gray-700 truncate max-w-[200px]">{wallet.address}</code>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => copyToClipboard(wallet.address)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => window.open(`https://testnet.flowscan.io/account/${wallet.address}`, "_blank")}>
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{parseFloat(wallet.balance).toFixed(4)}</p>
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
              <p className="text-gray-500">No tienes billeteras aún</p>
              <Button size="sm" className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={handleCreateWallet} disabled={creating}>
                {creating ? "Creando..." : "Crear tu primera billetera"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
