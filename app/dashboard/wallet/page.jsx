"use client"

import { useState } from "react"
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Clock,
  Copy,
  DollarSign,
  Download,
  ExternalLink,
  RefreshCw,
  Shield,
  Wallet,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function WalletPage() {
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawCurrency, setWithdrawCurrency] = useState("eth")
  const [withdrawAddress, setWithdrawAddress] = useState("")
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [withdrawType, setWithdrawType] = useState("standard")

  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawAddress) return

    setIsWithdrawing(true)

    // Simulación de proceso de retiro
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsWithdrawing(false)
    setWithdrawAmount("")
    setWithdrawAddress("")
  }

  const walletBalances = [
    { currency: "ETH", name: "Ethereum", balance: "1.45", usdValue: "2,755.00", icon: "🔷" },
    { currency: "SOL", name: "Solana", balance: "12.3", usdValue: "492.00", icon: "🟣" },
    { currency: "DOT", name: "Polkadot", balance: "25", usdValue: "175.00", icon: "⚪" },
    { currency: "ADA", name: "Cardano", balance: "350", usdValue: "140.00", icon: "🔵" },
    { currency: "USDT", name: "Tether", balance: "500", usdValue: "500.00", icon: "💵" },
  ]

  const recentTransactions = [
    {
      type: "deposit",
      amount: "0.5 ETH",
      usdValue: "$950.00",
      date: "10/05/2023 14:32",
      status: "completed",
      txHash: "0x1a2b...3c4d",
    },
    {
      type: "withdraw",
      amount: "100 USDT",
      usdValue: "$100.00",
      date: "05/05/2023 09:15",
      status: "completed",
      txHash: "0x5e6f...7g8h",
    },
    {
      type: "deposit",
      amount: "5 SOL",
      usdValue: "$200.00",
      date: "01/05/2023 18:45",
      status: "completed",
      txHash: "0x9i10j...11k12l",
    },
    {
      type: "withdraw",
      amount: "0.25 ETH",
      usdValue: "$475.00",
      date: "25/04/2023 11:20",
      status: "completed",
      txHash: "0x13m14n...15o16p",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Mi Billetera</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <RefreshCw className="h-4 w-4" />
            <span>Actualizar</span>
          </Button>
          <Button size="sm" className="bg-[#0a2463] hover:bg-[#0a2463]/90 gap-1">
            <ArrowDown className="h-4 w-4" />
            <span>Depositar</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Balance Total</CardTitle>
              <CardDescription>Valor total de tus activos en Kiipay</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <div className="text-3xl font-bold text-[#0a2463]">$4,062.00 USD</div>
                <p className="text-sm text-slate-600 mt-1">Actualizado: 12/05/2023 15:45</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Mis Activos</h3>
                  <Button variant="ghost" size="sm" className="h-8 gap-1 text-slate-600">
                    <Download className="h-3.5 w-3.5" />
                    <span className="text-xs">Exportar</span>
                  </Button>
                </div>

                <div className="space-y-3">
                  {walletBalances.map((coin) => (
                    <div
                      key={coin.currency}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 mr-3">
                          <span>{coin.icon}</span>
                        </div>
                        <div>
                          <p className="font-medium">{coin.name}</p>
                          <p className="text-xs text-slate-500">{coin.currency}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {coin.balance} {coin.currency}
                        </p>
                        <p className="text-xs text-slate-500">${coin.usdValue} USD</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transacciones Recientes</CardTitle>
              <CardDescription>Historial de depósitos y retiros</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((tx, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                          tx.type === "deposit" ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {tx.type === "deposit" ? (
                          <ArrowDown className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowUp className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{tx.type === "deposit" ? "Depósito" : "Retiro"}</p>
                        <p className="text-xs text-slate-500">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${tx.type === "deposit" ? "text-green-600" : "text-red-600"}`}>
                        {tx.type === "deposit" ? "+" : "-"}
                        {tx.amount}
                      </p>
                      <p className="text-xs text-slate-500">{tx.usdValue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button variant="outline" size="sm">
                Ver todas las transacciones
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Retirar Fondos</CardTitle>
              <CardDescription>Transfiere tus criptomonedas a otra billetera</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Selecciona la moneda</Label>
                <Select value={withdrawCurrency} onValueChange={setWithdrawCurrency}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Selecciona una moneda" />
                  </SelectTrigger>
                  <SelectContent>
                    {walletBalances.map((coin) => (
                      <SelectItem key={coin.currency.toLowerCase()} value={coin.currency.toLowerCase()}>
                        <div className="flex items-center">
                          <span className="mr-2">{coin.icon}</span>
                          <span>
                            {coin.name} ({coin.currency})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="amount">Cantidad a retirar</Label>
                  <button
                    className="text-xs text-primary hover:underline"
                    onClick={() => {
                      const selectedCoin = walletBalances.find((c) => c.currency.toLowerCase() === withdrawCurrency)
                      setWithdrawAmount(selectedCoin ? selectedCoin.balance : "")
                    }}
                  >
                    Máximo
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="pr-16"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-sm text-slate-500">{withdrawCurrency.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección de destino</Label>
                <div className="relative">
                  <Input
                    id="address"
                    placeholder="0x..."
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                  />
                  <button
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                    onClick={() => navigator.clipboard.readText().then((text) => setWithdrawAddress(text))}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tipo de retiro</Label>
                <RadioGroup value={withdrawType} onValueChange={setWithdrawType} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:bg-slate-50">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="flex-1 cursor-pointer">
                      <div className="font-medium">Estándar (24h)</div>
                      <div className="text-xs text-slate-500">Procesamiento en 24 horas. Sin comisión.</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:bg-slate-50">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="flex-1 cursor-pointer">
                      <div className="font-medium">Express (1h)</div>
                      <div className="text-xs text-slate-500">Procesamiento en 1 hora. Comisión: 1%.</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:bg-slate-50">
                    <RadioGroupItem value="instant" id="instant" />
                    <Label htmlFor="instant" className="flex-1 cursor-pointer">
                      <div className="font-medium">Instantáneo</div>
                      <div className="text-xs text-slate-500">Procesamiento inmediato. Comisión: 2.5%.</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Alert variant="outline" className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  Los retiros instantáneos solo están disponibles para productos digitales. Los bienes físicos requieren
                  un período de espera de 24 horas por seguridad.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex-col space-y-2">
              <Button
                className="w-full bg-[#0a2463] hover:bg-[#0a2463]/90"
                onClick={handleWithdraw}
                disabled={isWithdrawing || !withdrawAmount || !withdrawAddress}
              >
                {isWithdrawing ? (
                  <>
                    <span className="animate-spin mr-2">⚙️</span>
                    Procesando...
                  </>
                ) : (
                  "Retirar Fondos"
                )}
              </Button>
              <p className="text-xs text-center text-slate-500">
                Asegúrate de verificar la dirección antes de confirmar el retiro.
              </p>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Políticas de Retiro</CardTitle>
              <CardDescription>Información importante sobre los retiros</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 mr-3 shrink-0">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Tiempos de procesamiento</p>
                    <p className="text-sm text-slate-600">
                      Los retiros estándar se procesan en un plazo de 24 horas. Los retiros express se procesan en 1
                      hora. Los retiros instantáneos son inmediatos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 mr-3 shrink-0">
                    <Shield className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Productos digitales vs. físicos</p>
                    <p className="text-sm text-slate-600">
                      Los retiros instantáneos solo están disponibles para productos digitales (suscripciones, NFTs,
                      software). Los bienes físicos tienen un período de espera obligatorio de 24 horas para proteger a
                      compradores y vendedores.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 mr-3 shrink-0">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Comisiones</p>
                    <p className="text-sm text-slate-600">
                      Retiros estándar: sin comisión. Retiros express: 1% del monto. Retiros instantáneos: 2.5% del
                      monto.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 mr-3 shrink-0">
                    <Wallet className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Límites</p>
                    <p className="text-sm text-slate-600">
                      Retiro mínimo: $10 USD. Retiro máximo diario: $5,000 USD. Puedes solicitar un aumento de límites
                      verificando tu cuenta.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    Ver política completa
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Política de Retiros Completa</DialogTitle>
                    <DialogDescription>Información detallada sobre nuestras políticas de retiro</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 max-h-[60vh] overflow-auto pr-2">
                    <p className="text-sm">
                      Kiipay implementa políticas de retiro diseñadas para garantizar la seguridad de todos los usuarios
                      mientras mantiene la eficiencia en las transacciones.
                    </p>

                    <h3 className="text-base font-medium">Tiempos de procesamiento</h3>
                    <p className="text-sm">
                      • Retiros estándar: Procesados en un plazo de 24 horas.
                      <br />• Retiros express: Procesados en un plazo de 1 hora.
                      <br />• Retiros instantáneos: Procesados inmediatamente.
                    </p>

                    <h3 className="text-base font-medium">Productos digitales vs. físicos</h3>
                    <p className="text-sm">
                      Los retiros instantáneos solo están disponibles para transacciones que involucren productos
                      digitales como:
                      <br />• Suscripciones a servicios
                      <br />• NFTs y activos digitales
                      <br />• Software y licencias
                      <br />• Contenido digital
                      <br />
                      <br />
                      Para transacciones que involucren bienes físicos, se aplica un período de espera obligatorio de 24
                      horas. Esta medida protege tanto a compradores como a vendedores contra fraudes y disputas.
                    </p>

                    <h3 className="text-base font-medium">Comisiones</h3>
                    <p className="text-sm">
                      • Retiros estándar: Sin comisión
                      <br />• Retiros express: 1% del monto retirado
                      <br />• Retiros instantáneos: 2.5% del monto retirado
                    </p>

                    <h3 className="text-base font-medium">Límites</h3>
                    <p className="text-sm">
                      • Retiro mínimo: $10 USD o equivalente
                      <br />• Retiro máximo diario: $5,000 USD o equivalente
                      <br />• Retiro máximo mensual: $50,000 USD o equivalente
                    </p>
                    <p className="text-sm">
                      Los usuarios pueden solicitar un aumento de estos límites completando el proceso de verificación
                      avanzada.
                    </p>

                    <h3 className="text-base font-medium">Verificación de seguridad</h3>
                    <p className="text-sm">
                      Para retiros que excedan $1,000 USD, se requerirá una verificación adicional que puede incluir:
                      <br />• Autenticación de dos factores
                      <br />• Confirmación por correo electrónico
                      <br />• Verificación biométrica (si está configurada)
                    </p>

                    <h3 className="text-base font-medium">Cancelaciones</h3>
                    <p className="text-sm">
                      Los retiros estándar pueden ser cancelados antes de su procesamiento. Los retiros express e
                      instantáneos no pueden ser cancelados una vez iniciados.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Descargar PDF
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
