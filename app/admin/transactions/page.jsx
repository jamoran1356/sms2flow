"use client"

import { useState, useEffect } from "react"
import { Search, Download, ArrowUpDown, ExternalLink, Copy, MoreHorizontal, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AdminTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const url = filterType === "all" ? "/api/transactions" : `/api/transactions?type=${filterType}`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setTransactions(data.transactions || [])
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [filterType])

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const getTypeLabel = (type) => {
    const types = { TRANSFER: "Transferencia", SMS_PAYMENT: "Pago SMS", DEPOSIT: "Depósito", WITHDRAWAL: "Retiro", STAKING: "Staking" }
    return types[type] || type
  }

  const getTypeColor = (type) => {
    const colors = { TRANSFER: "bg-blue-100 text-blue-800", SMS_PAYMENT: "bg-green-100 text-green-800", DEPOSIT: "bg-purple-100 text-purple-800", WITHDRAWAL: "bg-orange-100 text-orange-800", STAKING: "bg-cyan-100 text-cyan-800" }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  const getStatusBadge = (status) => {
    if (status === "COMPLETED") return <Badge className="bg-green-100 text-green-800">Completada</Badge>
    if (status === "PENDING") return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
    return <Badge className="bg-red-100 text-red-800">Fallida</Badge>
  }

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = (tx.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.toAddress || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.txHash || "").toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Transacciones</h1>
          <p className="text-gray-500">Monitorea todas las transacciones de la plataforma</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transacciones</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{transactions.filter((t) => t.status === "COMPLETED").length}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{transactions.filter((t) => t.status === "PENDING").length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <Tabs value={filterType} onValueChange={setFilterType}>
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="SMS_PAYMENT">SMS</TabsTrigger>
            <TabsTrigger value="TRANSFER">Transferencias</TabsTrigger>
            <TabsTrigger value="DEPOSIT">Depósitos</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 w-[250px]" />
        </div>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="text-sm">{new Date(tx.createdAt).toLocaleString("es")}</TableCell>
                  <TableCell><Badge className={getTypeColor(tx.type)}>{getTypeLabel(tx.type)}</Badge></TableCell>
                  <TableCell>
                    <span className="font-medium">{parseFloat(tx.amount).toFixed(2)} {tx.currency || "FLOW"}</span>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{tx.toAddress ? `${tx.toAddress.slice(0, 10)}...` : "-"}</TableCell>
                  <TableCell>{getStatusBadge(tx.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {tx.txHash && (
                          <>
                            <DropdownMenuItem onClick={() => copyToClipboard(tx.txHash)}>
                              <Copy className="mr-2 h-4 w-4" /> Copiar Hash
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.open(`https://flowscan.io/tx/${tx.txHash}`, "_blank", "noopener,noreferrer")}>
                              <ExternalLink className="mr-2 h-4 w-4" /> Ver en Flowscan
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> Ver Detalles</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">No hay transacciones</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
