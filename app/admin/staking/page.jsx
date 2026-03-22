"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Users, DollarSign, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminStaking() {
  const [loading, setLoading] = useState(true)
  const [pools, setPools] = useState([])
  const [positions, setPositions] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/staking")
        if (res.ok) {
          const data = await res.json()
          setPools(data.pools || [])
          setPositions(data.positions || [])
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

  const totalStaked = positions.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Staking</h1>
          <p className="text-gray-500">Administra los pools de staking y recompensas</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total en Staking</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaked.toFixed(2)} FLOW</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pools Activos</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pools.filter((p) => p.isActive).length}</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posiciones Activas</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positions.filter((p) => p.status === "ACTIVE").length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pools" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pools">Pools</TabsTrigger>
          <TabsTrigger value="positions">Posiciones</TabsTrigger>
        </TabsList>

        <TabsContent value="pools" className="space-y-4">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Pools de Staking</CardTitle>
              <CardDescription>Gestiona los pools activos</CardDescription>
            </CardHeader>
            <CardContent>
              {pools.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No hay pools configurados</p>
              ) : (
                <div className="space-y-4">
                  {pools.map((pool) => (
                    <div key={pool.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{pool.name}</h3>
                          <p className="text-sm text-gray-500">APY: {pool.apy}% &bull; Mín: {pool.minStake} FLOW</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{pool.totalStaked || "0"} FLOW</p>
                        <p className={`text-sm ${pool.isActive ? "text-green-600" : "text-red-600"}`}>
                          {pool.isActive ? "Activo" : "Inactivo"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Posiciones de Staking</CardTitle>
              <CardDescription>Todas las posiciones de usuarios</CardDescription>
            </CardHeader>
            <CardContent>
              {positions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No hay posiciones de staking</p>
              ) : (
                <div className="space-y-3">
                  {positions.map((pos) => (
                    <div key={pos.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{pos.user?.name || pos.user?.email || "Usuario"}</p>
                        <p className="text-sm text-gray-500">{pos.pool?.name || "Pool"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{parseFloat(pos.amount).toFixed(2)} FLOW</p>
                        <p className={`text-xs ${pos.status === "ACTIVE" ? "text-green-600" : "text-gray-500"}`}>
                          {pos.status === "ACTIVE" ? "Activa" : "Completada"}
                        </p>
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
