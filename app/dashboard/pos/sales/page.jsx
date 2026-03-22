"use client"

import { useState } from "react"
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  ChevronDown,
  Download,
  Eye,
  Filter,
  MoreHorizontal,
  Plus,
  Printer,
  Receipt,
  Search,
  ShoppingCart,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

// Datos de ejemplo para ventas
const initialSales = [
  {
    id: "INV-001",
    customer: "María Rodríguez",
    date: "12/05/2023",
    time: "14:30",
    amount: 125.0,
    items: 3,
    status: "completed",
    paymentMethod: "crypto",
    employee: "Juan Pérez",
  },
  {
    id: "INV-002",
    customer: "Carlos Gómez",
    date: "12/05/2023",
    time: "12:15",
    amount: 78.5,
    items: 2,
    status: "completed",
    paymentMethod: "cash",
    employee: "Ana López",
  },
  {
    id: "INV-003",
    customer: "Ana Martínez",
    date: "12/05/2023",
    time: "10:45",
    amount: 210.75,
    items: 5,
    status: "pending",
    paymentMethod: "card",
    employee: "Juan Pérez",
  },
  {
    id: "INV-004",
    customer: "Javier López",
    date: "11/05/2023",
    time: "16:20",
    amount: 45.25,
    items: 1,
    status: "completed",
    paymentMethod: "crypto",
    employee: "Laura Sánchez",
  },
  {
    id: "INV-005",
    customer: "Elena Gutiérrez",
    date: "11/05/2023",
    time: "09:30",
    amount: 145.0,
    items: 4,
    status: "completed",
    paymentMethod: "cash",
    employee: "Ana López",
  },
  {
    id: "INV-006",
    customer: "Miguel Fernández",
    date: "10/05/2023",
    time: "18:15",
    amount: 67.5,
    items: 2,
    status: "cancelled",
    paymentMethod: "card",
    employee: "Juan Pérez",
  },
  {
    id: "INV-007",
    customer: "Laura Sánchez",
    date: "10/05/2023",
    time: "14:00",
    amount: 95.25,
    items: 3,
    status: "completed",
    paymentMethod: "cash",
    employee: "Laura Sánchez",
  },
  {
    id: "INV-008",
    customer: "Pablo Ruiz",
    date: "09/05/2023",
    time: "10:45",
    amount: 32.99,
    items: 1,
    status: "completed",
    paymentMethod: "crypto",
    employee: "Ana López",
  },
]

// Detalles de venta de ejemplo
const saleDetails = {
  id: "INV-001",
  customer: "María Rodríguez",
  date: "12/05/2023",
  time: "14:30",
  status: "completed",
  paymentMethod: "crypto",
  employee: "Juan Pérez",
  subtotal: 120.0,
  tax: 5.0,
  total: 125.0,
  items: [
    {
      id: "PROD-001",
      name: "Camiseta Premium",
      quantity: 1,
      price: 29.99,
      total: 29.99,
    },
    {
      id: "PROD-003",
      name: "Taza Personalizada",
      quantity: 2,
      price: 14.99,
      total: 29.98,
    },
    {
      id: "PROD-004",
      name: "Libro - El Arte de la Guerra",
      quantity: 1,
      price: 24.99,
      total: 24.99,
    },
    {
      id: "PROD-006",
      name: "Zapatillas Deportivas",
      quantity: 1,
      price: 35.04,
      total: 35.04,
    },
  ],
}

export default function SalesPage() {
  const [sales, setSales] = useState(initialSales)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [selectedSale, setSelectedSale] = useState(null)

  // Filtrar ventas
  const filteredSales = sales.filter((sale) => {
    // Filtro de búsqueda
    const matchesSearch =
      sale.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.employee.toLowerCase().includes(searchQuery.toLowerCase())

    // Filtro de estado
    const matchesStatus = statusFilter === "all" || sale.status === statusFilter

    // Filtro de método de pago
    const matchesPayment = paymentFilter === "all" || sale.paymentMethod === paymentFilter

    // Filtro de fecha
    let matchesDate = true
    if (startDate && endDate) {
      const saleDate = new Date(sale.date.split("/").reverse().join("-"))
      const start = new Date(startDate)
      const end = new Date(endDate)
      matchesDate = saleDate >= start && saleDate <= end
    }

    return matchesSearch && matchesStatus && matchesPayment && matchesDate
  })

  // Estadísticas de ventas
  const totalSales = filteredSales.length
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.amount, 0)
  const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0
  const cryptoSales = filteredSales.filter((sale) => sale.paymentMethod === "crypto").length

  // Ver detalles de venta
  const handleViewDetails = (sale) => {
    setSelectedSale(sale.id === "INV-001" ? saleDetails : sale)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Ventas</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button size="sm" className="bg-[#0a2463] hover:bg-[#0a2463]/90">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Nueva Venta
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
            <p className="text-xs text-muted-foreground">En el período seleccionado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <ArrowUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+15% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Venta Promedio</CardTitle>
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageSale.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Por transacción</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos Crypto</CardTitle>
            <ShoppingCart className="h-4 w-4 text-[#0a2463]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cryptoSales}</div>
            <p className="text-xs text-muted-foreground">{((cryptoSales / totalSales) * 100).toFixed(1)}% del total</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Ventas</CardTitle>
          <CardDescription>Visualiza y gestiona todas las transacciones de tu punto de venta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID, cliente o empleado..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="completed">Completadas</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                </SelectContent>
              </Select>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Método de Pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="cash">Efectivo</SelectItem>
                  <SelectItem value="card">Tarjeta</SelectItem>
                  <SelectItem value="crypto">Crypto</SelectItem>
                </SelectContent>
              </Select>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Fecha</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Filtrar por Fecha</DialogTitle>
                    <DialogDescription>Selecciona un rango de fechas para filtrar las ventas.</DialogDescription>
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
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Artículos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Empleado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.length > 0 ? (
                  filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.id}</TableCell>
                      <TableCell>{sale.customer}</TableCell>
                      <TableCell>
                        {sale.date}
                        <div className="text-xs text-slate-500">{sale.time}</div>
                      </TableCell>
                      <TableCell>${sale.amount.toFixed(2)}</TableCell>
                      <TableCell>{sale.items}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            sale.status === "completed"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : sale.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                          }`}
                        >
                          {sale.status === "completed"
                            ? "Completada"
                            : sale.status === "pending"
                              ? "Pendiente"
                              : "Cancelada"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {sale.paymentMethod === "cash"
                            ? "Efectivo"
                            : sale.paymentMethod === "card"
                              ? "Tarjeta"
                              : "Crypto"}
                        </Badge>
                      </TableCell>
                      <TableCell>{sale.employee}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menú</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewDetails(sale)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Printer className="mr-2 h-4 w-4" />
                              Imprimir Recibo
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Plus className="mr-2 h-4 w-4" />
                              Nueva Venta Similar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4 text-muted-foreground">
                      No se encontraron ventas. Intenta con una búsqueda diferente.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de detalles de venta */}
      {selectedSale && (
        <Dialog open={!!selectedSale} onOpenChange={() => setSelectedSale(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Detalles de la Venta</DialogTitle>
              <DialogDescription>Información detallada sobre la venta {selectedSale.id}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Información General</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">ID:</span>
                      <span className="font-medium">{selectedSale.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cliente:</span>
                      <span className="font-medium">{selectedSale.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fecha:</span>
                      <span className="font-medium">
                        {selectedSale.date} {selectedSale.time}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Empleado:</span>
                      <span className="font-medium">{selectedSale.employee}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Detalles de Pago</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Estado:</span>
                      <Badge
                        className={`${
                          selectedSale.status === "completed"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : selectedSale.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                        }`}
                      >
                        {selectedSale.status === "completed"
                          ? "Completada"
                          : selectedSale.status === "pending"
                            ? "Pendiente"
                            : "Cancelada"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Método de Pago:</span>
                      <span className="font-medium">
                        {selectedSale.paymentMethod === "cash"
                          ? "Efectivo"
                          : selectedSale.paymentMethod === "card"
                            ? "Tarjeta"
                            : "Crypto (KII)"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Subtotal:</span>
                      <span className="font-medium">${selectedSale.subtotal?.toFixed(2) || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Impuestos:</span>
                      <span className="font-medium">${selectedSale.tax?.toFixed(2) || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total:</span>
                      <span className="font-medium">
                        ${selectedSale.total?.toFixed(2) || selectedSale.amount?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedSale.items && selectedSale.items.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Artículos</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Producto</TableHead>
                          <TableHead>Cantidad</TableHead>
                          <TableHead>Precio</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedSale.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>${item.price.toFixed(2)}</TableCell>
                            <TableCell>${item.total.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir Recibo
                </Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Venta Similar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
