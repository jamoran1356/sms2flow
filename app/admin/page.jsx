"use client"

import { useEffect, useState } from "react"
import {
  TrendingUp,
  Users,
  CreditCard,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Eye,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/dashboard")
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch (e) {
        console.error("Error fetching admin dashboard:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  const stats = [
    {
      title: "Total Transacciones",
      value: data?.totalTransactions?.toLocaleString() || "0",
      description: "procesadas",
      icon: CreditCard,
      color: "bg-blue-500",
    },
    {
      title: "Volumen FLOW",
      value: `${(data?.totalVolume || 0).toFixed(2)} FLOW`,
      description: "volumen total",
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      title: "Pagos SMS",
      value: data?.totalSmsPayments?.toLocaleString() || "0",
      description: "transacciones SMS",
      icon: MessageSquare,
      color: "bg-purple-500",
    },
    {
      title: "Usuarios Activos",
      value: data?.totalUsers?.toLocaleString() || "0",
      description: "registrados",
      icon: Users,
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel Administrativo</h1>
          <p className="text-gray-600 mt-1">Monitorea y gestiona todas las operaciones de SMS2Flow</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar Reporte
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Transactions */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Transacciones Recientes</CardTitle>
          <CardDescription>Últimas transacciones procesadas en la plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          {data?.recentTransactions?.length > 0 ? (
            <div className="space-y-3">
              {data.recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${tx.type === "SMS_PAYMENT" ? "bg-purple-100" : tx.type === "DEPOSIT" ? "bg-green-100" : "bg-blue-100"}`}>
                      {tx.type === "SMS_PAYMENT" ? <MessageSquare className="h-4 w-4 text-purple-600" /> : <CreditCard className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{tx.sender?.name || tx.receiver?.name || "Usuario"}</p>
                      <p className="text-sm text-gray-500">{tx.description || tx.type}</p>
                      <p className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleString("es-ES")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{parseFloat(tx.amount).toFixed(4)} {tx.currency}</p>
                    <Badge
                      variant="outline"
                      className={`text-xs ${tx.status === "COMPLETED" ? "text-green-600 border-green-200 bg-green-50" : "text-yellow-600 border-yellow-200 bg-yellow-50"}`}
                    >
                      {tx.status === "COMPLETED" ? "Completada" : tx.status === "PENDING" ? "Pendiente" : tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p>No hay transacciones aún</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Users */}
      {data?.recentUsers?.length > 0 && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Usuarios Recientes</CardTitle>
            <CardDescription>Últimos usuarios registrados en la plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                      {user.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">{user.role}</Badge>
                    <p className="text-xs text-gray-400 mt-1">{new Date(user.createdAt).toLocaleDateString("es-ES")}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
