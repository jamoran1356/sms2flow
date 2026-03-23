"use client"

import { useState } from "react"
import { ArrowLeftRight, Building2, CheckCircle2, MessageSquareText, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export default function P2PMarketplacePage() {
  const [autoPayoutEnabled, setAutoPayoutEnabled] = useState(true)
  const [aiRoutingEnabled, setAiRoutingEnabled] = useState(true)
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    accountOwner: "",
    bankName: "",
    accountNumber: "",
    routingCode: "",
    minDealRate: "0.98",
    payoutPhone: "",
    notes: "",
  })

  const onChange = (field, value) => {
    setSaved(false)
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const onSave = () => {
    setSaved(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 p-6 shadow-sm">
        <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-emerald-300/20 blur-2xl" />
        <div className="absolute bottom-0 left-1/3 h-20 w-20 rounded-full bg-cyan-300/20 blur-2xl" />

        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            <Badge className="bg-emerald-600">New</Badge>
            <Badge variant="outline" className="border-emerald-300 text-emerald-700">
              DeFi + P2P Automation
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Marketplace P2P</h1>
          <p className="mt-2 max-w-3xl text-slate-600">
            Configure your flow to receive funds directly into your bank account automatically whenever FLOW is sent to
            you by SMS. The system uses AI agents to find the best available deal in the P2P market and coordinates the
            release through SMS confirmation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-emerald-600" />
              Bank Account Setup
            </CardTitle>
            <CardDescription>
              These details are used to send your fiat funds once an automated P2P sale is completed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="accountOwner">Account holder</Label>
                <Input
                  id="accountOwner"
                  value={form.accountOwner}
                  onChange={(e) => onChange("accountOwner", e.target.value)}
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank</Label>
                <Input
                  id="bankName"
                  value={form.bankName}
                  onChange={(e) => onChange("bankName", e.target.value)}
                  placeholder="Bank name"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account number</Label>
                <Input
                  id="accountNumber"
                  value={form.accountNumber}
                  onChange={(e) => onChange("accountNumber", e.target.value)}
                  placeholder="Account or IBAN"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="routingCode">Bank code (CCI/CLABE/SWIFT)</Label>
                <Input
                  id="routingCode"
                  value={form.routingCode}
                  onChange={(e) => onChange("routingCode", e.target.value)}
                  placeholder="Routing code"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="payoutPhone">Phone for SMS confirmation</Label>
                <Input
                  id="payoutPhone"
                  value={form.payoutPhone}
                  onChange={(e) => onChange("payoutPhone", e.target.value)}
                  placeholder="+57 300 000 0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minDealRate">Minimum acceptable deal rate</Label>
                <Input
                  id="minDealRate"
                  value={form.minDealRate}
                  onChange={(e) => onChange("minDealRate", e.target.value)}
                  placeholder="0.98"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Instructions for AI agents</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => onChange("notes", e.target.value)}
                placeholder="Example: prioritize instant liquidity and banks with confirmation in under 10 minutes"
                rows={4}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                onClick={onSave}
                className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:from-emerald-700 hover:to-cyan-700"
              >
                Save configuration
              </Button>
              {saved && (
                <div className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Configuration saved successfully.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-cyan-600" />
                Automation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-slate-900">Auto payout to bank</p>
                  <p className="text-xs text-slate-500">Convert and withdraw automatically</p>
                </div>
                <Switch checked={autoPayoutEnabled} onCheckedChange={setAutoPayoutEnabled} />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-slate-900">AI agents</p>
                  <p className="text-xs text-slate-500">Search for the best available P2P quote</p>
                </div>
                <Switch checked={aiRoutingEnabled} onCheckedChange={setAiRoutingEnabled} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ArrowLeftRight className="h-4 w-4 text-emerald-600" />
                Operational flow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <div className="rounded-lg bg-slate-50 p-3">1. Customer A sends FLOW by SMS to Customer B.</div>
              <div className="rounded-lg bg-slate-50 p-3">2. The system detects Customer B's active bank payout setup.</div>
              <div className="rounded-lg bg-slate-50 p-3">3. AI compares P2P offers and executes the best option.</div>
              <div className="rounded-lg bg-slate-50 p-3">4. Customer B receives an SMS, verifies the bank deposit, and confirms release.</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquareText className="h-4 w-4 text-emerald-600" />
                SMS example
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-slate-900 p-3 font-mono text-xs text-emerald-300">
                DEPOSIT DETECTED: COP 480,000 at XYZ Bank.\n
                Reply RELEASE to complete the P2P sale.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
