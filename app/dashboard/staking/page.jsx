"use client"

import { useState, useEffect } from "react"
import { ArrowRight, CheckCircle, Info, Percent, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export default function StakingPage() {
  const [pools, setPools] = useState([])
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPool, setSelectedPool] = useState(null)
  const [stakingAmount, setStakingAmount] = useState("")
  const [isStaking, setIsStaking] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/staking")
        if (res.ok) {
          const data = await res.json()
          setPools(data.pools || [])
          setPositions(data.positions || [])
          if (data.pools?.length > 0) setSelectedPool(data.pools[0])
        }
      } catch (e) {
        console.error("Error fetching staking:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleStake = async () => {
    if (!stakingAmount || !selectedPool || parseFloat(stakingAmount) <= 0) return
    setIsStaking(true)
    try {
      const res = await fetch("/api/staking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          poolId: selectedPool.id,
          amount: parseFloat(stakingAmount),
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setPositions((prev) => [...prev, data.position])
        setShowSuccess(true)
        setTimeout(() => { setShowSuccess(false); setStakingAmount("") }, 5000)
      }
    } catch (e) {
      console.error("Error staking:", e)
    } finally {
      setIsStaking(false)
    }
  }

  const totalStaked = positions
    .filter((p) => p.status === "ACTIVE")
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)

  const totalRewards = positions
    .reduce((sum, p) => sum + parseFloat(p.rewards || 0), 0)

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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Staking FLOW</h1>
          <p className="text-gray-500 mt-1">Genera rendimientos con tus tokens FLOW</p>
        </div>
      </div>

      {showSuccess && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Staking realizado con éxito</AlertTitle>
          <AlertDescription>Tu posición ha sido creada. Puedes verla en "Mis Posiciones".</AlertDescription>
        </Alert>
      )}

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total en Staking</p>
                <p className="text-xl font-bold text-gray-900">{totalStaked.toFixed(4)} FLOW</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50">
                <Percent className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Recompensas Totales</p>
                <p className="text-xl font-bold text-green-600">{totalRewards.toFixed(4)} FLOW</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50">
                <Info className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Posiciones Activas</p>
                <p className="text-xl font-bold text-gray-900">{positions.filter((p) => p.status === "ACTIVE").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Stake form */}
        <div className="md:col-span-4 space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Hacer Staking</CardTitle>
              <CardDescription>Selecciona un pool y la cantidad a depositar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pools.length > 0 ? (
                <>
                  <div className="space-y-2">
                    <Label>Pool de Staking</Label>
                    <div className="grid gap-2">
                      {pools.map((pool) => (
                        <button
                          key={pool.id}
                          onClick={() => setSelectedPool(pool)}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-colors text-left ${
                            selectedPool?.id === pool.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-200"
                          }`}
                        >
                          <div>
                            <p className="font-medium">{pool.name}</p>
                            <p className="text-xs text-gray-500">
                              Bloqueo: {pool.lockDays} días | Mín: {parseFloat(pool.minAmount).toFixed(2)} FLOW
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            {parseFloat(pool.apy).toFixed(1)}% APY
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedPool && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">APY:</p>
                          <p className="font-medium text-blue-800">{parseFloat(selectedPool.apy).toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Período de bloqueo:</p>
                          <p className="font-medium text-blue-800">{selectedPool.lockDays} días</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Monto mínimo:</p>
                          <p className="font-medium text-blue-800">{parseFloat(selectedPool.minAmount).toFixed(2)} FLOW</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Capacidad total:</p>
                          <p className="font-medium text-blue-800">{parseFloat(selectedPool.maxCapacity || 0).toLocaleString()} FLOW</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Cantidad (FLOW)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder={selectedPool ? `Mín. ${parseFloat(selectedPool.minAmount).toFixed(2)}` : "0.00"}
                      value={stakingAmount}
                      onChange={(e) => setStakingAmount(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay pools de staking disponibles en este momento.
                </div>
              )}
            </CardContent>
            {pools.length > 0 && (
              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                  onClick={handleStake}
                  disabled={isStaking || !stakingAmount || parseFloat(stakingAmount) <= 0}
                >
                  {isStaking ? "Procesando..." : (
                    <>Hacer Staking <ArrowRight className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        {/* Positions */}
        <div className="md:col-span-3 space-y-6">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Activas</TabsTrigger>
              <TabsTrigger value="completed">Completadas</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="space-y-4 pt-4">
              {positions.filter((p) => p.status === "ACTIVE").length > 0 ? (
                positions.filter((p) => p.status === "ACTIVE").map((pos) => (
                  <Card key={pos.id} className="border-0 shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{pos.pool?.name || "Staking FLOW"}</CardTitle>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Activo</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Cantidad:</span>
                          <span className="font-medium">{parseFloat(pos.amount).toFixed(4)} FLOW</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">APY:</span>
                          <span className="font-medium text-green-600">{parseFloat(pos.pool?.apy || 0).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Inicio:</span>
                          <span className="font-medium">{new Date(pos.startDate).toLocaleDateString("es-ES")}</span>
                        </div>
                        {pos.endDate && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Desbloqueo:</span>
                            <span className="font-medium">{new Date(pos.endDate).toLocaleDateString("es-ES")}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Recompensas:</span>
                          <span className="font-medium text-green-600">{parseFloat(pos.rewards || 0).toFixed(4)} FLOW</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-0 shadow-md">
                  <CardContent className="py-8 text-center text-gray-500">
                    No tienes posiciones de staking activas.
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="completed" className="space-y-4 pt-4">
              {positions.filter((p) => p.status === "COMPLETED").length > 0 ? (
                positions.filter((p) => p.status === "COMPLETED").map((pos) => (
                  <Card key={pos.id} className="border-0 shadow-md">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{pos.pool?.name || "Staking FLOW"}</span>
                        <Badge variant="secondary">Completado</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-600">Cantidad:</p>
                          <p className="font-medium">{parseFloat(pos.amount).toFixed(4)} FLOW</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Recompensa:</p>
                          <p className="font-medium text-green-600">{parseFloat(pos.rewards || 0).toFixed(4)} FLOW</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-0 shadow-md">
                  <CardContent className="py-8 text-center text-gray-500">
                    No tienes posiciones completadas.
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
