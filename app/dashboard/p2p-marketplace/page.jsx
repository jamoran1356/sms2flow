"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeftRight,
  Plus,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Clock,
  User,
  DollarSign,
  Coins,
  X,
  Ban,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function formatNumber(value) {
  const num = parseFloat(value || 0)
  return new Intl.NumberFormat("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(num)
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "ahora"
  if (mins < 60) return `hace ${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `hace ${hrs}h`
  const days = Math.floor(hrs / 24)
  return `hace ${days}d`
}

const PAYMENT_METHODS = {
  bank_transfer: "Transferencia bancaria",
  mobile_payment: "Pago móvil",
  cash: "Efectivo",
  other: "Otro",
}

export default function P2PMarketplacePage() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("ALL") // ALL, BUY, SELL
  const [searchTerm, setSearchTerm] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [showMyListings, setShowMyListings] = useState(false)
  const [cancelling, setCancelling] = useState(null)

  const [form, setForm] = useState({
    type: "SELL",
    amount: "",
    price: "",
    currency: "USD",
    minAmount: "",
    maxAmount: "",
    paymentMethod: "bank_transfer",
    description: "",
  })

  const fetchListings = async () => {
    try {
      const params = new URLSearchParams()
      if (filter !== "ALL") params.set("type", filter)
      if (showMyListings) params.set("mine", "true")
      const res = await fetch(`/api/p2p-marketplace/listings?${params}`)
      if (res.ok) {
        const data = await res.json()
        setListings(data.listings || [])
      }
    } catch (e) {
      console.error("Error fetching listings:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchListings()
  }, [filter, showMyListings])

  const handleCreate = async () => {
    if (!form.amount || !form.price) return
    setCreating(true)
    try {
      const res = await fetch("/api/p2p-marketplace/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setCreateOpen(false)
        setForm({ type: "SELL", amount: "", price: "", currency: "USD", minAmount: "", maxAmount: "", paymentMethod: "bank_transfer", description: "" })
        fetchListings()
      }
    } catch (e) {
      console.error("Error creating listing:", e)
    } finally {
      setCreating(false)
    }
  }

  const handleCancel = async (listingId) => {
    setCancelling(listingId)
    try {
      const res = await fetch("/api/p2p-marketplace/listings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, status: "CANCELLED" }),
      })
      if (res.ok) {
        fetchListings()
      }
    } catch (e) {
      console.error("Error cancelling:", e)
    } finally {
      setCancelling(null)
    }
  }

  const filtered = listings.filter((l) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      l.user?.name?.toLowerCase().includes(term) ||
      l.currency?.toLowerCase().includes(term) ||
      l.description?.toLowerCase().includes(term)
    )
  })

  const stats = {
    totalListings: listings.length,
    buyOrders: listings.filter((l) => l.type === "BUY").length,
    sellOrders: listings.filter((l) => l.type === "SELL").length,
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Marketplace P2P</h1>
          <p className="text-gray-500 mt-1">Compra y vende FLOW directamente con otros usuarios</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Crear anuncio
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Crear anuncio P2P</DialogTitle>
              <DialogDescription>Publica una oferta de compra o venta de FLOW</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={form.type === "SELL" ? "default" : "outline"}
                  onClick={() => setForm((f) => ({ ...f, type: "SELL" }))}
                  className={form.type === "SELL" ? "bg-red-500 hover:bg-red-600" : ""}
                >
                  <TrendingDown className="h-4 w-4 mr-2" />
                  Vender FLOW
                </Button>
                <Button
                  type="button"
                  variant={form.type === "BUY" ? "default" : "outline"}
                  onClick={() => setForm((f) => ({ ...f, type: "BUY" }))}
                  className={form.type === "BUY" ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Comprar FLOW
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Cantidad (FLOW)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="100.00"
                    value={form.amount}
                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Precio por FLOW</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.85"
                      value={form.price}
                      onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                      className="flex-1"
                    />
                    <Select value={form.currency} onValueChange={(v) => setForm((f) => ({ ...f, currency: v }))}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="COP">COP</SelectItem>
                        <SelectItem value="MXN">MXN</SelectItem>
                        <SelectItem value="BRL">BRL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Mínimo (FLOW)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Opcional"
                    value={form.minAmount}
                    onChange={(e) => setForm((f) => ({ ...f, minAmount: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Máximo (FLOW)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Opcional"
                    value={form.maxAmount}
                    onChange={(e) => setForm((f) => ({ ...f, maxAmount: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Método de pago</Label>
                <Select value={form.paymentMethod} onValueChange={(v) => setForm((f) => ({ ...f, paymentMethod: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Transferencia bancaria</SelectItem>
                    <SelectItem value="mobile_payment">Pago móvil</SelectItem>
                    <SelectItem value="cash">Efectivo</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Descripción (opcional)</Label>
                <Textarea
                  placeholder="Condiciones, horarios, bancos aceptados..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                />
              </div>

              {form.amount && form.price && (
                <div className="rounded-lg bg-gray-50 p-3 text-sm">
                  <span className="text-gray-500">Total estimado: </span>
                  <span className="font-semibold">
                    {formatNumber(Number(form.amount) * Number(form.price))} {form.currency}
                  </span>
                  <span className="text-gray-400"> por {formatNumber(form.amount)} FLOW</span>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
              <Button
                onClick={handleCreate}
                disabled={creating || !form.amount || !form.price}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {creating ? "Publicando..." : "Publicar anuncio"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.totalListings}</p>
            <p className="text-xs text-gray-500">Anuncios activos</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.buyOrders}</p>
            <p className="text-xs text-gray-500">Compran FLOW</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="py-4 text-center">
            <p className="text-2xl font-bold text-red-500">{stats.sellOrders}</p>
            <p className="text-xs text-gray-500">Venden FLOW</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por usuario, moneda..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          {["ALL", "BUY", "SELL"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className={filter === f ? (f === "BUY" ? "bg-green-500 hover:bg-green-600" : f === "SELL" ? "bg-red-500 hover:bg-red-600" : "bg-blue-600") : ""}
            >
              {f === "ALL" ? "Todos" : f === "BUY" ? "Compra" : "Venta"}
            </Button>
          ))}
          <Button
            variant={showMyListings ? "default" : "outline"}
            size="sm"
            onClick={() => setShowMyListings(!showMyListings)}
          >
            Mis anuncios
          </Button>
        </div>
      </div>

      {/* Listings */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((listing) => {
            const isBuy = listing.type === "BUY"
            const total = Number(listing.amount) * Number(listing.price)
            const initials = listing.user?.name
              ? listing.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
              : "?"

            return (
              <Card key={listing.id} className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className={isBuy ? "bg-green-500" : "bg-red-500"}>
                      {isBuy ? "COMPRA" : "VENTA"}
                    </Badge>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {timeAgo(listing.createdAt)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* User */}
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={listing.user?.image} />
                      <AvatarFallback className="bg-gray-200 text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700">{listing.user?.name || "Anónimo"}</span>
                  </div>

                  {/* Amount & Price */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                        <Coins className="h-3 w-3" /> Cantidad
                      </div>
                      <p className="font-semibold text-gray-900">{formatNumber(listing.amount)} FLOW</p>
                      {(listing.minAmount || listing.maxAmount) && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {listing.minAmount ? `Mín: ${formatNumber(listing.minAmount)}` : ""}
                          {listing.minAmount && listing.maxAmount ? " · " : ""}
                          {listing.maxAmount ? `Máx: ${formatNumber(listing.maxAmount)}` : ""}
                        </p>
                      )}
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                        <DollarSign className="h-3 w-3" /> Precio
                      </div>
                      <p className="font-semibold text-gray-900">{formatNumber(listing.price)} {listing.currency}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Total: {formatNumber(total)} {listing.currency}
                      </p>
                    </div>
                  </div>

                  {/* Payment method */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{PAYMENT_METHODS[listing.paymentMethod] || listing.paymentMethod}</span>
                  </div>

                  {/* Description */}
                  {listing.description && (
                    <p className="text-xs text-gray-500 bg-gray-50 rounded p-2 line-clamp-2">{listing.description}</p>
                  )}

                  {/* Actions */}
                  {showMyListings ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-red-500 hover:bg-red-50"
                      onClick={() => handleCancel(listing.id)}
                      disabled={cancelling === listing.id}
                    >
                      <Ban className="h-3.5 w-3.5 mr-1" />
                      {cancelling === listing.id ? "Cancelando..." : "Cancelar anuncio"}
                    </Button>
                  ) : (
                    <Button size="sm" className={`w-full ${isBuy ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}>
                      {isBuy ? "Vender a este usuario" : "Comprar a este usuario"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-0 shadow-md bg-white">
          <CardContent className="py-16 text-center">
            <ArrowLeftRight className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-lg font-medium">No hay anuncios activos</p>
            <p className="text-gray-400 text-sm mt-1">Sé el primero en publicar una oferta</p>
            <Button
              size="sm"
              className="mt-4 bg-emerald-600 hover:bg-emerald-700"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear anuncio
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
