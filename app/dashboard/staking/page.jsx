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
import { useLanguage } from "@/components/language-provider"

export default function StakingPage() {
  const { t, locale } = useLanguage()
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
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t("staking.title")}</h1>
          <p className="text-gray-500 mt-1">{t("staking.subtitle")}</p>
        </div>
      </div>

      {showSuccess && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>{t("staking.successAlert")}</AlertTitle>
          <AlertDescription>{t("staking.successMsg")}</AlertDescription>
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
                <p className="text-sm text-gray-500">{t("staking.totalStaked")}</p>
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
                <p className="text-sm text-gray-500">{t("staking.totalRewards")}</p>
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
                <p className="text-sm text-gray-500">{t("staking.activePositions")}</p>
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
              <CardTitle>{t("staking.stakeTitle")}</CardTitle>
              <CardDescription>{t("staking.stakeDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pools.length > 0 ? (
                <>
                  <div className="space-y-2">
                    <Label>{t("staking.poolLabel")}</Label>
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
                              {t("staking.lockDays", { n: pool.lockDays, m: parseFloat(pool.minAmount).toFixed(2) })}
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
                          <p className="text-gray-600">{t("staking.poolDetail.apy")}</p>
                          <p className="font-medium text-blue-800">{parseFloat(selectedPool.apy).toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">{t("staking.poolDetail.lockPeriod")}</p>
                          <p className="font-medium text-blue-800">{selectedPool.lockDays}{t("staking.poolDetail.lockDays")}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">{t("staking.poolDetail.minAmount")}</p>
                          <p className="font-medium text-blue-800">{parseFloat(selectedPool.minAmount).toFixed(2)} FLOW</p>
                        </div>
                        <div>
                          <p className="text-gray-600">{t("staking.poolDetail.maxCapacity")}</p>
                          <p className="font-medium text-blue-800">{parseFloat(selectedPool.maxCapacity || 0).toLocaleString()} FLOW</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>{t("staking.amountLabel")}</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder={selectedPool ? t("staking.minPlaceholder", { n: parseFloat(selectedPool.minAmount).toFixed(2) }) : "0.00"}
                      value={stakingAmount}
                      onChange={(e) => setStakingAmount(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {t("staking.noPools")}
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
                  {isStaking ? t("staking.processingStake") : (
                    <>{t("staking.stakeButton")} <ArrowRight className="ml-2 h-4 w-4" /></>
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
              <TabsTrigger value="active">{t("staking.activeTabs")}</TabsTrigger>
              <TabsTrigger value="completed">{t("staking.completedTabs")}</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="space-y-4 pt-4">
              {positions.filter((p) => p.status === "ACTIVE").length > 0 ? (
                positions.filter((p) => p.status === "ACTIVE").map((pos) => (
                  <Card key={pos.id} className="border-0 shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{pos.pool?.name || t("staking.stakingFallback")}</CardTitle>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{t("common.status.active")}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{t("staking.amountDetail")}</span>
                          <span className="font-medium">{parseFloat(pos.amount).toFixed(4)} FLOW</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{t("staking.apyDetail")}</span>
                          <span className="font-medium text-green-600">{parseFloat(pos.pool?.apy || 0).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{t("staking.startDate")}</span>
                          <span className="font-medium">{new Date(pos.startDate).toLocaleDateString(locale === "es" ? "es-ES" : "en-US")}</span>
                        </div>
                        {pos.endDate && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{t("staking.unlockDate")}</span>
                            <span className="font-medium">{new Date(pos.endDate).toLocaleDateString(locale === "es" ? "es-ES" : "en-US")}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{t("staking.rewardsDetail")}</span>
                          <span className="font-medium text-green-600">{parseFloat(pos.rewards || 0).toFixed(4)} FLOW</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-0 shadow-md">
                  <CardContent className="py-8 text-center text-gray-500">
                    {t("staking.noActivePositions")}
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
                        <span className="font-medium">{pos.pool?.name || t("staking.stakingFallback")}</span>
                        <Badge variant="secondary">{t("staking.completedBadge")}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-600">{t("staking.amountDetail")}</p>
                          <p className="font-medium">{parseFloat(pos.amount).toFixed(4)} FLOW</p>
                        </div>
                        <div>
                          <p className="text-gray-600">{t("staking.rewardDetail")}</p>
                          <p className="font-medium text-green-600">{parseFloat(pos.rewards || 0).toFixed(4)} FLOW</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-0 shadow-md">
                  <CardContent className="py-8 text-center text-gray-500">
                    {t("staking.noCompletedPositions")}
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
