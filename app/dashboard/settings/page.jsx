"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { ChevronRight, CreditCard, Globe, MessageSquare, Moon, Shield, Sun, User, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/components/language-provider"

export default function SettingsPage() {
  const { t } = useLanguage()
  const { data: session } = useSession()
  const [theme, setTheme] = useState("light")
  const [language, setLanguage] = useState("es")
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    promotionalAlerts: true,
    defaultNetwork: "flow",
    defaultCurrency: "usd",
  })

  const handleToggle = (setting) => {
    setSettings((prev) => ({ ...prev, [setting]: !prev[setting] }))
  }

  const handleSave = async () => {
    setSaving(true)
    // Settings could be saved to an API in the future
    await new Promise((r) => setTimeout(r, 500))
    setSaving(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t("settings.title")}</h1>
          <p className="text-gray-500 mt-1">{t("settings.subtitle")}</p>
        </div>
        <Button size="sm" onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <Save className="h-4 w-4 mr-2" />
          {saving ? t("common.saving") : t("common.save")}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">{t("settings.tabs.general")}</TabsTrigger>
          <TabsTrigger value="notifications">{t("settings.tabs.notifications")}</TabsTrigger>
          <TabsTrigger value="preferences">{t("settings.tabs.preferences")}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 pt-4">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>{t("settings.general.title")}</CardTitle>
              <CardDescription>{t("settings.general.desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>{t("settings.general.theme")}</Label>
                <RadioGroup value={theme} onValueChange={setTheme} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
                      <Sun className="h-4 w-4" /> {t("settings.general.themeOptions.light")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
                      <Moon className="h-4 w-4" /> {t("settings.general.themeOptions.dark")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system" className="cursor-pointer">{t("settings.general.themeOptions.system")}</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>{t("settings.general.language")}</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("settings.general.blockchain")}</Label>
                <Select value={settings.defaultNetwork} onValueChange={(v) => setSettings({ ...settings, defaultNetwork: v })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flow">{t("settings.general.blockchainOptions.mainnet")}</SelectItem>
                    <SelectItem value="flow-testnet">{t("settings.general.blockchainOptions.testnet")}</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  {t("settings.general.blockchainDesc")}
                </p>
              </div>

              <div className="space-y-2">
                <Label>{t("settings.general.currency")}</Label>
                <Select value={settings.defaultCurrency} onValueChange={(v) => setSettings({ ...settings, defaultCurrency: v })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">{t("settings.general.currencyOptions.usd")}</SelectItem>
                    <SelectItem value="eur">{t("settings.general.currencyOptions.eur")}</SelectItem>
                    <SelectItem value="flow">{t("settings.general.currencyOptions.flow")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>{t("settings.quickLinks.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { href: "/dashboard/profile", icon: <User className="h-5 w-5 text-gray-500" />, title: t("settings.quickLinks.profile"), desc: t("settings.quickLinks.profileDesc") },
                { href: "/dashboard/wallet", icon: <CreditCard className="h-5 w-5 text-gray-500" />, title: t("settings.quickLinks.wallet"), desc: t("settings.quickLinks.walletDesc") },
                { href: "/dashboard/sms-payments", icon: <MessageSquare className="h-5 w-5 text-gray-500" />, title: t("settings.quickLinks.smsPayments"), desc: t("settings.quickLinks.smsPaymentsDesc") },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    {link.icon}
                    <div className="ml-3">
                      <h3 className="font-medium">{link.title}</h3>
                      <p className="text-xs text-gray-500">{link.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 pt-4">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>{t("settings.notifications.title")}</CardTitle>
              <CardDescription>{t("settings.notifications.desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">{t("settings.notifications.emailSection")}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">{t("settings.notifications.txNotif")}</Label>
                    <p className="text-sm text-gray-500">{t("settings.notifications.txNotifDesc")}</p>
                  </div>
                  <Switch checked={settings.emailNotifications} onCheckedChange={() => handleToggle("emailNotifications")} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">{t("settings.notifications.marketing")}</Label>
                    <p className="text-sm text-gray-500">{t("settings.notifications.marketingDesc")}</p>
                  </div>
                  <Switch checked={settings.marketingEmails} onCheckedChange={() => handleToggle("marketingEmails")} />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium">{t("settings.notifications.smsSection")}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">{t("settings.notifications.smsTx")}</Label>
                    <p className="text-sm text-gray-500">{t("settings.notifications.smsTxDesc")}</p>
                  </div>
                  <Switch checked={settings.smsNotifications} onCheckedChange={() => handleToggle("smsNotifications")} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">{t("settings.notifications.smsPromo")}</Label>
                    <p className="text-sm text-gray-500">{t("settings.notifications.smsPromoDesc")}</p>
                  </div>
                  <Switch checked={settings.promotionalAlerts} onCheckedChange={() => handleToggle("promotionalAlerts")} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6 pt-4">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>{t("settings.preferences.title")}</CardTitle>
              <CardDescription>{t("settings.preferences.desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>{t("settings.preferences.explorer")}</Label>
                <Select defaultValue="flowscan">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flowscan">{t("settings.preferences.explorerOptions.flowscan")}</SelectItem>
                    <SelectItem value="flowview">{t("settings.preferences.explorerOptions.flowview")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center mb-2">
                  <Globe className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-800">{t("settings.preferences.flowInfo")}</span>
                </div>
                <p className="text-sm text-blue-700">
                  {t("settings.preferences.flowDesc")}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
