"use client"

import { useState, useEffect } from "react"
import { Wallet, ArrowUpRight, ArrowDownLeft, Send, Copy } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function AdminWallet() {
  const [loading, setLoading] = useState(true)
  const [wallets, setWallets] = useState([])
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wRes, tRes] = await Promise.all([
          fetch("/api/wallets"),
          fetch("/api/transactions"),
        ])
        if (wRes.ok) {
          const wData = await wRes.json()
          setWallets(wData.wallets || [])
        }
        if (tRes.ok) {
          const tData = await tRes.json()
          setTransactions(tData.transactions || [])
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  const totalBalance = wallets.reduce((sum, w) => sum + parseFloat(w.balance || 0), 0)

  const getTypeIcon = (type) => {
    switch (type) {
      case "DEPOSIT": return <ArrowDownLeft className="h-4 w-4 text-green-600" />
      case "TRANSFER": return <Send className="h-4 w-4 text-blue-600" />
      default: return <ArrowUpRight className="h-4 w-4 text-orange-600" />
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billetera Administrativa</h1>
        <p className="text-gray-500">Gestión de fondos y wallets del sistema</p>
      </div>

      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
        <CardHeader>
          <CardTitle className="text-lg">Balance Total del Sistema</CardTitle>
          <CardDescription className="text-blue-100">Valor total de todos los wallets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalBalance.toFixed(4)} FLOW</div>
          <p className="text-blue-100 text-sm mt-1">{wallets.length} wallet(s) registrados</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="wallets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
        </TabsList>

        <TabsContent value="wallets" className="space-y-4">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Wallets del Sistema</CardTitle>
              <CardDescription>Todas las billeteras registradas</CardDescription>
            </CardHeader>
            <CardContent>
              {wallets.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No hay wallets registrados</p>
              ) : (
                <div className="space-y-3">
                  {wallets.map((w) => (
                    <div key={w.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Wallet className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{w.user?.name || w.user?.email || "Usuario"}</p>
                          <p className="text-xs text-gray-500 font-mono">{w.address}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{parseFloat(w.balance || 0).toFixed(4)} FLOW</p>
                        <Badge variant="outline" className="text-xs">{w.network}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movimientos" className="space-y-4">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Movimientos Recientes</CardTitle>
              <CardDescription>Todas las transacciones del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No hay transacciones</p>
              ) : (
                <div className="space-y-3">
                  {transactions.slice(0, 20).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          {getTypeIcon(tx.type)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{tx.description || tx.type}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(tx.createdAt).toLocaleDateString("es-ES")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{parseFloat(tx.amount).toFixed(4)} FLOW</p>
                        <Badge
                          variant="outline"
                          className={
                            tx.status === "COMPLETED" ? "text-green-600 border-green-200" :
                            tx.status === "PENDING" ? "text-yellow-600 border-yellow-200" :
                            "text-red-600 border-red-200"
                          }
                        >
                          {tx.status === "COMPLETED" ? "Completada" : tx.status === "PENDING" ? "Pendiente" : "Fallida"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
