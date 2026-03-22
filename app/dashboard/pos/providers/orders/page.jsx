"use client"

import { useState } from "react"
import Link from "next/link"
import Swal from "sweetalert2"
import {
  ArrowLeft,
  ArrowUpDown,
  Calendar,
  Check,
  CreditCard,
  Download,
  Edit,
  Eye,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Truck,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePicker } from "@/components/ui/date-picker"

// Datos de ejemplo para órdenes de compra
const initialOrders = [
  {
    id: "PO-001",
    provider: "Distribuidora Tecnológica S.A.",
    providerId: "PROV-001",
    date: "2023-05-10",
    expectedDate: "2023-05-20",
    amount: 1250.75,
    status: "received",
    items: 5,
    paymentStatus: "paid",
    paymentMethod: "transfer",
  },
  {
    id: "PO-002",
    provider: "Textiles Modernos",
    providerId: "PROV-002",
    date: "2023-05-05",
    expectedDate: "2023-05-15",
    amount: 450.0,
    status: "sent",
    items: 3,
    paymentStatus: "pending",
    paymentMethod: "credit",
  },
  {
    id: "PO-003",
    provider: "Muebles Elegantes",
    providerId: "PROV-004",
    date: "2023-05-01",
    expectedDate: "2023-05-30",
    amount: 3200.5,
    status: "partially_received",
    items: 2,
    paymentStatus: "partially_paid",
    paymentMethod: "transfer",
  },
  {
    id: "PO-004",
    provider: "Alimentos Frescos S.A.",
    providerId: "PROV-005",
    date: "2023-05-11",
    expectedDate: "2023-05-18",
    amount: 875.25,
    status: "draft",
    items: 8,
    paymentStatus: "not_paid",
    paymentMethod: null,
  },
  {
    id: "PO-005",
    provider: "Suministros Oficina Plus",
    providerId: "PROV-003",
    date: "2023-04-28",
    expectedDate: "2023-05-10",
    amount: 320.15,
    status: "cancelled",
    items: 4,
    paymentStatus: "refunded",
    paymentMethod: "card",
  },
  {
    id: "PO-006",
    provider: "Distribuidora Tecnológica S.A.",
    providerId: "PROV-001",
    date: "2023-04-15",
    expectedDate: "2023-04-30",
    amount: 2150.0,
    status: "received",
    items: 7,
    paymentStatus: "paid",
    paymentMethod: "transfer",
  },
  {
    id: "PO-007",
    provider: "Textiles Modernos",
    providerId: "PROV-002",
    date: "2023-04-10",
    expectedDate: "2023-04-25",
    amount: 780.5,
    status: "received",
    items: 5,
    paymentStatus: "paid",
    paymentMethod: "cash",
  },
  {
    id: "PO-008",
    provider: "Muebles Elegantes",
    providerId: "PROV-004",
    date: "2023-05-12",
    expectedDate: "2023-06-01",
    amount: 1500.75,
    status: "sent",
    items: 1,
    paymentStatus: "pending",
    paymentMethod: "credit",
  },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [providerFilter, setProviderFilter] = useState("all")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState({ from: null, to: null })
  const [sortField, setSortField] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")

  // Obtener lista única de proveedores para el filtro
  const providers = [...new Set(orders.map((order) => order.provider))]

  // Filtrar órdenes
  const filteredOrders = orders
    .filter((order) => {
      // Filtro de búsqueda
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.provider.toLowerCase().includes(searchQuery.toLowerCase())

      // Filtro de estado
      const matchesStatus = statusFilter === "all" || order.status === statusFilter

      // Filtro de proveedor
      const matchesProvider = providerFilter === "all" || order.provider === providerFilter

      // Filtro de estado de pago
      const matchesPaymentStatus = paymentStatusFilter === "all" || order.paymentStatus === paymentStatusFilter

      // Filtro de fecha
      let matchesDate = true
      if (dateRange.from) {
        const orderDate = new Date(order.date)
        const fromDate = new Date(dateRange.from)
        if (dateRange.to) {
          const toDate = new Date(dateRange.to)
          matchesDate = orderDate >= fromDate && orderDate <= toDate
        } else {
          matchesDate = orderDate >= fromDate
        }
      }

      return matchesSearch && matchesStatus && matchesProvider && matchesPaymentStatus && matchesDate
    })
    .sort((a, b) => {
      // Ordenamiento
      if (sortField === "date") {
        return sortDirection === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
      } else if (sortField === "amount") {
        return sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount
      } else if (sortField === "id") {
        return sortDirection === "asc" ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)
      }
      return 0
    })

  // Función para cambiar el ordenamiento
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setProviderFilter("all")
    setPaymentStatusFilter("all")
    setDateRange({ from: null, to: null })
  }

  // Estadísticas
  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.status === "sent" || o.status === "partially_received").length
  const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0)

  // Función para obtener el color de la insignia según el estado
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "received":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "sent":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "partially_received":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      case "draft":
        return "bg-slate-100 text-slate-800 hover:bg-slate-100"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-slate-100 text-slate-800 hover:bg-slate-100"
    }
  }

  // Función para obtener el texto del estado
  const getStatusText = (status) => {
    switch (status) {
      case "received":
        return "Recibida"
      case "sent":
        return "Enviada"
      case "partially_received":
        return "Parcial"
      case "draft":
        return "Borrador"
      case "cancelled":
        return "Cancelada"
      default:
        return status
    }
  }

  // Función para obtener el color de la insignia según el estado de pago
  const getPaymentStatusBadgeClass = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "pending":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      case "partially_paid":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "not_paid":
        return "bg-slate-100 text-slate-800 hover:bg-slate-100"
      case "refunded":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      default:
        return "bg-slate-100 text-slate-800 hover:bg-slate-100"
    }
  }

  // Función para obtener el texto del estado de pago
  const getPaymentStatusText = (status) => {
    switch (status) {
      case "paid":
        return "Pagado"
      case "pending":
        return "Pendiente"
      case "partially_paid":
        return "Pago Parcial"
      case "not_paid":
        return "No Pagado"
      case "refunded":
        return "Reembolsado"
      default:
        return status
    }
  }

  // Función para obtener el texto del método de pago
  const getPaymentMethodText = (method) => {
    switch (method) {
      case "transfer":
        return "Transferencia"
      case "cash":
        return "Efectivo"
      case "card":
        return "Tarjeta"
      case "credit":
        return "Crédito"
      default:
        return "No definido"
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/pos/providers">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Órdenes de Compra</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button size="sm" className="bg-[#0a2463] hover:bg-[#0a2463]/90" asChild>
            <Link href="/dashboard/pos/providers/orders/new">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Orden
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Órdenes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">{pendingOrders} pendientes de recibir</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">En órdenes de compra</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 días</div>
            <p className="text-xs text-muted-foreground">De envío a recepción</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Órdenes de Compra</CardTitle>
          <CardDescription>Gestiona tus órdenes de compra a proveedores</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="mb-4">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setStatusFilter("all")}>
                Todas
              </TabsTrigger>
              <TabsTrigger value="sent" onClick={() => setStatusFilter("sent")}>
                Enviadas
              </TabsTrigger>
              <TabsTrigger value="partially_received" onClick={() => setStatusFilter("partially_received")}>
                Parciales
              </TabsTrigger>
              <TabsTrigger value="received" onClick={() => setStatusFilter("received")}>
                Recibidas
              </TabsTrigger>
              <TabsTrigger value="draft" onClick={() => setStatusFilter("draft")}>
                Borradores
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID o proveedor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={providerFilter} onValueChange={setProviderFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Proveedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los proveedores</SelectItem>
                  {providers.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Estado de Pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="paid">Pagados</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="partially_paid">Pago Parcial</SelectItem>
                  <SelectItem value="not_paid">No Pagados</SelectItem>
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-auto p-4" align="end">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Rango de Fechas</h4>
                      <p className="text-sm text-muted-foreground">Filtra órdenes por fecha</p>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="grid gap-1">
                          <label className="text-sm font-medium leading-none">Desde</label>
                          <DatePicker
                            selected={dateRange.from}
                            onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                          />
                        </div>
                        <div className="grid gap-1">
                          <label className="text-sm font-medium leading-none">Hasta</label>
                          <DatePicker
                            selected={dateRange.to}
                            onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="icon" onClick={clearFilters}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("id")}>
                    <div className="flex items-center">
                      ID
                      {sortField === "id" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                    </div>
                  </TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                    <div className="flex items-center">
                      Fecha
                      {sortField === "date" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                    </div>
                  </TableHead>
                  <TableHead>Entrega Estimada</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("amount")}>
                    <div className="flex items-center">
                      Monto
                      {sortField === "amount" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                    </div>
                  </TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{order.provider}</span>
                          <span className="text-xs text-slate-500">{order.providerId}</span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(order.expectedDate).toLocaleDateString()}</TableCell>
                      <TableCell>${order.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClass(order.status)}>{getStatusText(order.status)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge className={getPaymentStatusBadgeClass(order.paymentStatus)}>
                            {getPaymentStatusText(order.paymentStatus)}
                          </Badge>
                          {order.paymentMethod && (
                            <span className="text-xs text-slate-500">{getPaymentMethodText(order.paymentMethod)}</span>
                          )}
                        </div>
                      </TableCell>
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
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalles
                            </DropdownMenuItem>
                            {order.status !== "received" && order.status !== "cancelled" && (
                              <>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Package className="mr-2 h-4 w-4" />
                                  Registrar Recepción
                                </DropdownMenuItem>
                              </>
                            )}
                            {order.status === "draft" && (
                              <DropdownMenuItem>
                                <Check className="mr-2 h-4 w-4" />
                                Confirmar y Enviar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {order.paymentStatus !== "paid" && order.status !== "cancelled" && (
                              <DropdownMenuItem>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Registrar Pago
                              </DropdownMenuItem>
                            )}
                            {order.status !== "cancelled" && order.status !== "received" && (
                              <DropdownMenuItem className="text-red-600">
                                <X className="mr-2 h-4 w-4" />
                                <span
                                  onClick={() => {
                                    Swal.fire({
                                      title: "¿Cancelar orden?",
                                      text: "Esta acción no se puede revertir",
                                      icon: "warning",
                                      showCancelButton: true,
                                      confirmButtonColor: "#d33",
                                      cancelButtonColor: "#3085d6",
                                      confirmButtonText: "Sí, cancelar",
                                      cancelButtonText: "No, mantener",
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        // Aquí iría la lógica para cancelar la orden
                                        Swal.fire("¡Cancelada!", "La orden ha sido cancelada.", "success")
                                      }
                                    })
                                  }}
                                >
                                  Cancelar Orden
                                </span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                      No se encontraron órdenes. Intenta con una búsqueda diferente.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-slate-500">
            Mostrando {filteredOrders.length} de {orders.length} órdenes
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/pos/providers/orders/new">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Orden
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
