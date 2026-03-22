"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Copy,
  MoreHorizontal,
  CreditCard,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const params = new URLSearchParams({ limit: "50" })
        if (filterType !== "all") params.set("type", filterType)
        const res = await fetch(`/api/transactions?${params}`)
        if (res.ok) {
          const data = await res.json()
          setTransactions(data.transactions || [])
        }
      } catch (e) {
        console.error("Error fetching transactions:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [filterType])

  const filteredTransactions = transactions.filter((tx) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      (tx.description || "").toLowerCase().includes(term) ||
      (tx.txHash || "").toLowerCase().includes(term) ||
      (tx.sender?.name || "").toLowerCase().includes(term) ||
      (tx.receiver?.name || "").toLowerCase().includes(term)
    )
  })

  const totalReceived = transactions
    .filter(t => t.type === "DEPOSIT" || t.type === "TRANSFER")
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)

  const totalSent = transactions
    .filter(t => t.type === "WITHDRAWAL" || t.type === "SMS_PAYMENT")
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)

  const copyToClipboard = (text) => {
    if (text) navigator.clipboard.writeText(text)
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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Transacciones</h1>
          <p className="text-gray-500 mt-1">Historial de transacciones en Flow Network</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Recibido</CardTitle>
            <div className="p-2 rounded-lg bg-green-50"><ArrowDown className="h-4 w-4 text-green-600" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalReceived.toFixed(4)} FLOW</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Enviado</CardTitle>
            <div className="p-2 rounded-lg bg-orange-50"><ArrowUp className="h-4 w-4 text-orange-600" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalSent.toFixed(4)} FLOW</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Balance Neto</CardTitle>
            <div className="p-2 rounded-lg bg-blue-50"><ArrowUpDown className="h-4 w-4 text-blue-600" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{(totalReceived - totalSent).toFixed(4)} FLOW</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="bg-white border shadow-sm">
            <TabsTrigger value="all" onClick={() => setFilterType("all")}>Todas</TabsTrigger>
            <TabsTrigger value="DEPOSIT" onClick={() => setFilterType("DEPOSIT")}>Depósitos</TabsTrigger>
            <TabsTrigger value="WITHDRAWAL" onClick={() => setFilterType("WITHDRAWAL")}>Retiros</TabsTrigger>
            <TabsTrigger value="SMS_PAYMENT" onClick={() => setFilterType("SMS_PAYMENT")}>SMS</TabsTrigger>
          </TabsList>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar transacciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[280px]"
            />
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Historial de Transacciones</CardTitle>
              <CardDescription>{filteredTransactions.length} transacción(es) encontrada(s)</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredTransactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{new Date(tx.createdAt).toLocaleDateString("es-ES")}</span>
                            <span className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleTimeString("es-ES")}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {tx.type === "DEPOSIT" || tx.type === "TRANSFER" ? (
                              <ArrowDown className="h-4 w-4 text-green-600" />
                            ) : (
                              <ArrowUp className="h-4 w-4 text-orange-600" />
                            )}
                            <Badge variant="outline" className="text-xs">
                              {tx.type === "DEPOSIT" ? "Depósito" : tx.type === "WITHDRAWAL" ? "Retiro" : tx.type === "SMS_PAYMENT" ? "SMS" : tx.type === "TRANSFER" ? "Transferencia" : tx.type}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${tx.type === "DEPOSIT" || tx.type === "TRANSFER" ? "text-green-600" : "text-orange-600"}`}>
                            {tx.type === "DEPOSIT" || tx.type === "TRANSFER" ? "+" : "-"}{parseFloat(tx.amount).toFixed(4)} {tx.currency}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{tx.description || "-"}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${tx.status === "COMPLETED" ? "bg-green-100 text-green-700" : tx.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                            {tx.status === "COMPLETED" ? "Completada" : tx.status === "PENDING" ? "Pendiente" : "Fallida"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {tx.txHash && (
                                <>
                                  <DropdownMenuItem onClick={() => copyToClipboard(tx.txHash)}>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copiar Hash
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => window.open(`https://flowscan.org/transaction/${tx.txHash}`, "_blank")}>
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Ver en Explorer
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p>No hay transacciones</p>
                  <p className="text-sm mt-1">Tus transacciones aparecerán aquí</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
