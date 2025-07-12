"use client"

import { useState } from "react"
import { AlertCircle, ArrowRight, CheckCircle, ChevronDown, Info, Percent, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function StakingPage() {
  const [selectedChain, setSelectedChain] = useState("ethereum")
  const [stakingAmount, setStakingAmount] = useState("")
  const [isStaking, setIsStaking] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleStake = async () => {
    if (!stakingAmount || Number.parseFloat(stakingAmount) <= 0) return

    setIsStaking(true)

    // Simulación de proceso de staking
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsStaking(false)
    setShowSuccess(true)

    // Ocultar mensaje de éxito después de 5 segundos
    setTimeout(() => {
      setShowSuccess(false)
      setStakingAmount("")
    }, 5000)
  }

  const stakingOptions = {
    ethereum: {
      name: "Ethereum (ETH)",
      apy: "5.2%",
      lockPeriod: "30 días",
      minAmount: "0.1 ETH",
      balance: "1.45 ETH",
      icon: "🔷",
    },
    solana: {
      name: "Solana (SOL)",
      apy: "7.8%",
      lockPeriod: "14 días",
      minAmount: "1 SOL",
      balance: "12.3 SOL",
      icon: "🟣",
    },
    polkadot: {
      name: "Polkadot (DOT)",
      apy: "12%",
      lockPeriod: "60 días",
      minAmount: "5 DOT",
      balance: "25 DOT",
      icon: "⚪",
    },
    cardano: {
      name: "Cardano (ADA)",
      apy: "4.5%",
      lockPeriod: "No hay",
      minAmount: "100 ADA",
      balance: "350 ADA",
      icon: "🔵",
    },
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Staking de Criptomonedas</h1>
        <Button variant="outline" size="sm" className="gap-1">
          <Info className="h-4 w-4" />
          <span>Guía de Staking</span>
        </Button>
      </div>

      {showSuccess && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>¡Staking realizado con éxito!</AlertTitle>
          <AlertDescription>
            Tu staking ha sido procesado correctamente. Puedes ver los detalles en la pestaña "Mis Stakes".
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-7">
        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hacer Staking</CardTitle>
              <CardDescription>Genera rendimientos pasivos con tus criptomonedas a través de staking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chain">Selecciona la cadena de bloques</Label>
                <Select value={selectedChain} onValueChange={setSelectedChain}>
                  <SelectTrigger id="chain">
                    <SelectValue placeholder="Selecciona una cadena" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(stakingOptions).map(([key, option]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center">
                          <span className="mr-2">{option.icon}</span>
                          <span>{option.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-blue-800">Información de Staking</span>
                  <Percent className="h-4 w-4 text-blue-600" />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-600">APY:</p>
                    <p className="font-medium text-blue-800">{stakingOptions[selectedChain].apy}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Período de bloqueo:</p>
                    <p className="font-medium text-blue-800">{stakingOptions[selectedChain].lockPeriod}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Monto mínimo:</p>
                    <p className="font-medium text-blue-800">{stakingOptions[selectedChain].minAmount}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Tu balance:</p>
                    <p className="font-medium text-blue-800">{stakingOptions[selectedChain].balance}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="amount">Cantidad para hacer staking</Label>
                  <button
                    className="text-xs text-primary hover:underline"
                    onClick={() => setStakingAmount(stakingOptions[selectedChain].balance.split(" ")[0])}
                  >
                    Máximo
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    placeholder={`Ej: ${stakingOptions[selectedChain].minAmount}`}
                    value={stakingAmount}
                    onChange={(e) => setStakingAmount(e.target.value)}
                    className="pr-16"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-sm text-slate-500">
                      {selectedChain === "ethereum"
                        ? "ETH"
                        : selectedChain === "solana"
                          ? "SOL"
                          : selectedChain === "polkadot"
                            ? "DOT"
                            : "ADA"}
                    </span>
                  </div>
                </div>
              </div>

              <Alert variant="outline" className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  Recuerda que al hacer staking, tus fondos estarán bloqueados durante el período especificado.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#0a2463] hover:bg-[#0a2463]/90"
                onClick={handleStake}
                disabled={isStaking || !stakingAmount || Number.parseFloat(stakingAmount) <= 0}
              >
                {isStaking ? (
                  <>
                    <span className="animate-spin mr-2">⚙️</span>
                    Procesando...
                  </>
                ) : (
                  <>
                    Hacer Staking
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preguntas Frecuentes</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>¿Qué es el staking?</AccordionTrigger>
                  <AccordionContent>
                    El staking es un proceso en el que bloqueas tus criptomonedas para participar en la operación de una
                    blockchain de prueba de participación (PoS) y ganar recompensas a cambio. Es similar a ganar
                    intereses en una cuenta de ahorros.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>¿Cuáles son los riesgos del staking?</AccordionTrigger>
                  <AccordionContent>
                    Los principales riesgos incluyen la volatilidad del precio de la criptomoneda durante el período de
                    bloqueo, posibles penalizaciones por comportamiento malicioso del validador, y riesgos técnicos
                    asociados con la red blockchain específica.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>¿Cómo se calculan las recompensas?</AccordionTrigger>
                  <AccordionContent>
                    Las recompensas de staking se calculan en base a varios factores: la cantidad de tokens en staking,
                    el tiempo que han estado en staking, la tasa de inflación de la red, y el número total de tokens en
                    staking en la red.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>¿Puedo retirar mis fondos antes del período de bloqueo?</AccordionTrigger>
                  <AccordionContent>
                    Depende de la cadena de bloques. Algunas permiten retiros anticipados con penalizaciones, mientras
                    que otras requieren que esperes hasta que finalice el período de bloqueo. Consulta los términos
                    específicos de cada opción de staking.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3 space-y-6">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Mis Stakes</TabsTrigger>
              <TabsTrigger value="history">Historial</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="space-y-4 pt-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <span className="mr-2">🔷</span>
                    <div>
                      <CardTitle className="text-base">Ethereum (ETH)</CardTitle>
                      <CardDescription>Staking activo</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Cantidad:</span>
                      <span className="font-medium">0.5 ETH</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">APY:</span>
                      <span className="font-medium text-green-600">5.2%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Fecha de inicio:</span>
                      <span className="font-medium">15/04/2023</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Desbloqueo en:</span>
                      <span className="font-medium">15/05/2023</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Recompensas acumuladas:</span>
                      <span className="font-medium text-green-600">0.0068 ETH</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    Ver detalles
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <span className="mr-2">🟣</span>
                    <div>
                      <CardTitle className="text-base">Solana (SOL)</CardTitle>
                      <CardDescription>Staking activo</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Cantidad:</span>
                      <span className="font-medium">10 SOL</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">APY:</span>
                      <span className="font-medium text-green-600">7.8%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Fecha de inicio:</span>
                      <span className="font-medium">02/05/2023</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Desbloqueo en:</span>
                      <span className="font-medium">16/05/2023</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Recompensas acumuladas:</span>
                      <span className="font-medium text-green-600">0.32 SOL</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    Ver detalles
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="history" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Historial de Staking</CardTitle>
                  <CardDescription>Registro de tus actividades de staking anteriores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <span className="mr-2">⚪</span>
                          <span className="font-medium">Polkadot (DOT)</span>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Completado</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-slate-600">Cantidad:</p>
                          <p className="font-medium">15 DOT</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Recompensa:</p>
                          <p className="font-medium text-green-600">0.75 DOT</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Fecha de inicio:</p>
                          <p className="font-medium">10/02/2023</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Fecha de fin:</p>
                          <p className="font-medium">11/04/2023</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-b pb-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <span className="mr-2">🔷</span>
                          <span className="font-medium">Ethereum (ETH)</span>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Completado</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-slate-600">Cantidad:</p>
                          <p className="font-medium">0.25 ETH</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Recompensa:</p>
                          <p className="font-medium text-green-600">0.0032 ETH</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Fecha de inicio:</p>
                          <p className="font-medium">05/01/2023</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Fecha de fin:</p>
                          <p className="font-medium">04/02/2023</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Rendimiento Estimado</CardTitle>
              <CardDescription>Calcula tus ganancias potenciales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-green-800">Proyección de Ganancias</span>
                    <ChevronDown className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Diario:</span>
                      <span className="font-medium text-green-700">~0.0004 ETH</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Semanal:</span>
                      <span className="font-medium text-green-700">~0.0028 ETH</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Mensual:</span>
                      <span className="font-medium text-green-700">~0.0121 ETH</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Anual:</span>
                      <span className="font-medium text-green-700">~0.1456 ETH</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm text-blue-800">Staking seguro y verificado</span>
                  </div>
                  <Button variant="link" size="sm" className="text-blue-600 p-0">
                    Más info
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
