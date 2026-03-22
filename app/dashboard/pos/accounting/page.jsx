"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Calendar,
  ChevronDown,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Filter,
  LineChart,
  PieChart,
  Plus,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo para transacciones contables
const recentTransactions = [
  {
    id: "TRX-001",
    date: "12/05/2023",
    description: "Venta #INV-001",
    type: "revenue",
    debit: 0,
    credit: 125.0,
    balance: 125.0,
  },
  {
    id: "TRX-002",
    date: "12/05/2023",
    description: "Compra de inventario",
    type: "expense",
    debit: 350.0,
    credit: 0,
    balance: -225.0,
  },
  {
    id: "TRX-003",
    date: "11/05/2023",
    description: "Pago a proveedor",
    type: "expense",
    debit: 200.0,
    credit: 0,
    balance: -425.0,
  },
  {
    id: "TRX-004",
    date: "11/05/2023",
    description: "Venta #INV-002",
    type: "revenue",
    debit: 0,
    credit: 78.5,
    balance: -346.5,
  },
  {
    id: "TRX-005",
    date: "10/05/2023",
    description: "Pago de servicios",
    type: "expense",
    debit: 120.0,
    credit: 0,
    balance: -466.5,
  },
]

// Datos de ejemplo para cuentas contables
const accountBalances = [
  {
    id: "ACC-001",
    number: "1000",
    name: "Caja",
    type: "asset",
    balance: 1250.0,
  },
  {
    id: "ACC-002",
    number: "1100",
    name: "Banco",
    type: "asset",
    balance: 5680.75,
  },
  {
    id: "ACC-003",
    number: "1200",
    name: "Cuentas por Cobrar",
    type: "asset",
    balance: 2450.0,
  },
  {
    id: "ACC-004",
    number: "2000",
    name: "Cuentas por Pagar",
    type: "liability",
    balance: 1875.25,
  },
  {
    id: "ACC-005",
    number: "4000",
    name: "Ventas",
    type: "revenue",
    balance: 8750.0,
  },
  {
    id: "ACC-006",
    number: "5000",
    name: "Costo de Ventas",
    type: "expense",
    balance: 4320.0,
  },
]

export default function AccountingPage() {
  const [period, setPeriod] = useState("month")
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [accountType, setAccountType] = useState("all")

  // Filtrar cuentas
  const filteredAccounts = accountBalances.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) || account.number.includes(searchQuery)
    const matchesType = accountType === "all" || account.type === accountType

    return matchesSearch && matchesType
  })

  // Calcular totales
  const totalAssets = accountBalances
    .filter((account) => account.type === "asset")
    .reduce((sum, account) => sum + account.balance, 0)

  const totalLiabilities = accountBalances
    .filter((account) => account.type === "liability")
    .reduce((sum, account) => sum + account.balance, 0)

  const totalRevenue = accountBalances
    .filter((account) => account.type === "revenue")
    .reduce((sum, account) => sum + account.balance, 0)

  const totalExpenses = accountBalances
    .filter((account) => account.type === "expense")
    .reduce((sum, account) => sum + account.balance, 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Contabilidad</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Calendar className="h-4 w-4" />
                <span>Período</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Seleccionar Período</DialogTitle>
                <DialogDescription>Elige un rango de fechas para los informes contables.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Fecha Inicio</label>
                    <DatePicker selected={startDate} onSelect={setStartDate} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Fecha Fin</label>
                    <DatePicker selected={endDate} onSelect={setEndDate} />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setStartDate(null)
                      setEndDate(null)
                    }}
                  >
                    Limpiar
                  </Button>
                  <Button type="button" onClick={() => {}}>
                    Aplicar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mes</SelectItem>
              <SelectItem value="quarter">Este Trimestre</SelectItem>
              <SelectItem value="year">Este Año</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAssets.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+8.2% desde el período anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pasivos Totales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalLiabilities.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">-3.5% desde el período anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <ArrowUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+12.3% desde el período anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos</CardTitle>
            <ArrowDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+5.7% desde el período anterior</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Libro Mayor</CardTitle>
            <CardDescription>Registro de transacciones contables</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Débito</TableHead>
                    <TableHead>Crédito</TableHead>
                    <TableHead>Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>${transaction.debit.toFixed(2)}</TableCell>
                      <TableCell>${transaction.credit.toFixed(2)}</TableCell>
                      <TableCell className={transaction.balance < 0 ? "text-red-500" : "text-green-500"}>
                        ${Math.abs(transaction.balance).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Ver Libro Mayor Completo
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Resumen Financiero</CardTitle>
            <CardDescription>Estado financiero actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-slate-100 rounded-md flex items-center justify-center">
              <PieChart className="h-8 w-8 text-slate-400" />
              <span className="ml-2 text-slate-500">Gráfico de distribución financiera</span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Capital Neto:</span>
                <span className="font-bold">${(totalAssets - totalLiabilities).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Beneficio Neto:</span>
                <span className="font-bold">${(totalRevenue - totalExpenses).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Ratio de Liquidez:</span>
                <span className="font-bold">1.8</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Plan de Cuentas</CardTitle>
            <CardDescription>Listado de cuentas contables y sus saldos actuales</CardDescription>
          </div>
          <Button size="sm" className="bg-[#0a2463] hover:bg-[#0a2463]/90">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Cuenta
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o número de cuenta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={accountType} onValueChange={setAccountType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Tipo de Cuenta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="asset">Activos</SelectItem>
                  <SelectItem value="liability">Pasivos</SelectItem>
                  <SelectItem value="equity">Patrimonio</SelectItem>
                  <SelectItem value="revenue">Ingresos</SelectItem>
                  <SelectItem value="expense">Gastos</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.number}</TableCell>
                    <TableCell>{account.name}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${
                          account.type === "asset"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            : account.type === "liability"
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                              : account.type === "revenue"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : account.type === "expense"
                                  ? "bg-red-100 text-red-800 hover:bg-red-100"
                                  : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                        }`}
                      >
                        {account.type === "asset"
                          ? "Activo"
                          : account.type === "liability"
                            ? "Pasivo"
                            : account.type === "revenue"
                              ? "Ingreso"
                              : account.type === "expense"
                                ? "Gasto"
                                : "Patrimonio"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">${account.balance.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-slate-500">
            Mostrando {filteredAccounts.length} de {accountBalances.length} cuentas
          </div>
          <Link href="/dashboard/pos/accounting/accounts">
            <Button variant="outline" size="sm">
              Gestionar Plan de Cuentas
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Informes Contables</TabsTrigger>
          <TabsTrigger value="entries">Entradas/Salidas</TabsTrigger>
          <TabsTrigger value="balance">Balance General</TabsTrigger>
        </TabsList>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informes Disponibles</CardTitle>
              <CardDescription>Informes contables que puedes generar y descargar</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Balance General</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Estado financiero que muestra activos, pasivos y patrimonio de la empresa.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Generar
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Estado de Resultados</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Informe de ingresos, gastos y beneficios durante un período específico.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Generar
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Flujo de Efectivo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Análisis de entradas y salidas de efectivo durante un período.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Generar
                  </Button>
                </CardFooter>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="entries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Entradas y Salidas</CardTitle>
              <CardDescription>Movimientos de efectivo y recursos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-500">
                <LineChart className="h-8 w-8 mx-auto mb-2" />
                <p>Selecciona la pestaña "Informes Contables" para ver los informes principales.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="balance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Balance General</CardTitle>
              <CardDescription>Estado financiero actual de la empresa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-500">
                <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                <p>Selecciona la pestaña "Informes Contables" para ver los informes principales.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
