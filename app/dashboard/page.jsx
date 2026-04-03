"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, CreditCard, DollarSign, LineChart, MessageSquare, Package, Wallet, TrendingUp, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"

export default function DashboardPage() {
  const { t, locale } = useLanguage()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard")
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch (e) {
        console.error("Error fetching dashboard:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
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
      title: t("dashboard.totalBalance"),
      value: `${(data?.totalBalance || 0).toFixed(4)} FLOW`,
      description: t("dashboard.walletsActive", { n: data?.wallets?.length || 0 }),
      icon: Wallet,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: t("dashboard.transactions"),
      value: `${data?.transactionsCount || 0}`,
      description: t("dashboard.thisMonth", { n: `${data?.txGrowth > 0 ? "+" : ""}${data?.txGrowth || 0}` }),
      icon: CreditCard,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: t("dashboard.smsCustomers"),
      value: `${data?.customersCount || 0}`,
      description: t("dashboard.registeredContacts"),
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: t("dashboard.inStaking"),
      value: `${(data?.totalStaked || 0).toFixed(2)} FLOW`,
      description: t("dashboard.positionsActive", { n: data?.stakingPositions?.length || 0 }),
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t("dashboard.title")}</h1>
          <p className="text-gray-500 mt-1">{t("dashboard.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/wallet">
            <Button variant="outline" size="sm" className="shadow-sm">
              <Wallet className="mr-2 h-4 w-4" />
              {t("dashboard.walletBtn")}
            </Button>
          </Link>
          <Link href="/dashboard/transactions">
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700">
              <DollarSign className="mr-2 h-4 w-4" />
              {t("dashboard.newTransaction")}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Wallet addresses */}
      {data?.wallets?.length > 0 && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-600" />
              {t("dashboard.yourWallets")}
            </CardTitle>
            <CardDescription>{t("dashboard.walletsDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.wallets.map((wallet) => (
                <div key={wallet.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <code className="text-sm font-mono text-gray-800">{wallet.address}</code>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{wallet.network}</Badge>
                      {wallet.isDefault && <Badge className="bg-blue-600 text-xs">{t("common.principal")}</Badge>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{parseFloat(wallet.balance).toFixed(4)} FLOW</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-white border shadow-sm">
          <TabsTrigger value="overview">{t("dashboard.summaryTab")}</TabsTrigger>
          <TabsTrigger value="recent">{t("dashboard.recentTxTab")}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 border-0 shadow-md">
              <CardHeader>
                <CardTitle>{t("dashboard.recentActivity")}</CardTitle>
              </CardHeader>
              <CardContent>
                {data?.recentTransactions?.length > 0 ? (
                  <div className="space-y-4">
                    {data.recentTransactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${tx.type === "DEPOSIT" ? "bg-green-100" : tx.type === "SMS_PAYMENT" ? "bg-purple-100" : "bg-blue-100"}`}>
                            {tx.type === "SMS_PAYMENT" ? <MessageSquare className="h-4 w-4 text-purple-600" /> : <CreditCard className="h-4 w-4 text-blue-600" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{tx.description || tx.type}</p>
                            <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleString(locale === "es" ? "es-ES" : "en-US")}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{parseFloat(tx.amount).toFixed(4)} {tx.currency}</p>
                          <Badge variant="outline" className={`text-xs ${tx.status === "COMPLETED" ? "text-green-600 border-green-200" : "text-yellow-600 border-yellow-200"}`}>
                            {tx.status === "COMPLETED" ? t("common.status.completed") : tx.status === "PENDING" ? t("common.status.pending") : tx.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p>{t("dashboard.noTransactions")}</p>
                    <p className="text-sm mt-1">{t("dashboard.firstTransaction")}</p>
                  </div>
                )}
              </CardContent>
              {data?.recentTransactions?.length > 0 && (
                <CardFooter>
                  <Link href="/dashboard/transactions" className="w-full">
                    <Button variant="outline" size="sm" className="w-full">
                      {t("common.viewAll")} <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              )}
            </Card>
            <Card className="col-span-3 border-0 shadow-md">
              <CardHeader>
                <CardTitle>{t("dashboard.activeStaking")}</CardTitle>
                <CardDescription>{t("dashboard.stakingDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                {data?.stakingPositions?.length > 0 ? (
                  <div className="space-y-3">
                    {data.stakingPositions.map((pos) => (
                      <div key={pos.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{pos.pool?.name || t("dashboard.poolFallback")}</p>
                          <Badge className="bg-green-100 text-green-700">{pos.pool?.apyRate}% APY</Badge>
                        </div>
                        <div className="flex justify-between mt-2 text-sm text-gray-600">
                          <span>Staked: {parseFloat(pos.amount).toFixed(2)} FLOW</span>
                          <span className="text-green-600">+{parseFloat(pos.rewards).toFixed(4)} rewards</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <TrendingUp className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm">{t("dashboard.noStakingPositions")}</p>
                    <Link href="/dashboard/staking">
                      <Button size="sm" variant="link" className="text-blue-600">{t("dashboard.explorePools")}</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="recent">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>{t("dashboard.fullHistory")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/transactions">
                <Button className="bg-blue-600 hover:bg-blue-700">{t("dashboard.viewAllTx")}</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
