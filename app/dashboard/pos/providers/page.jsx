"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowUpDown,
  Building,
  CreditCard,
  Download,
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Trash,
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

// Datos de ejemplo para proveedores
const initialProviders = [
  {
    id: "PROV-001",
    name: "Distribuidora Tecnológica S.A.",
    contactPerson: "Carlos Méndez",
    email: "carlos@distritec.com",
    phone: "+1 555-123-4567",
    category: "Electrónica",
    status: "active",
    paymentTerms: "30 días",
    balance: 1250.75,
    lastOrder: "10/05/2023",
  },
  {
    id: "PROV-002",
    name: "Textiles Modernos",
    contactPerson: "Ana García",
    email: "ana@textmod.com",
    phone: "+1 555-987-6543",
    category: "Ropa",
    status: "active",
    paymentTerms: "15 días",
    balance: 450.0,
    lastOrder: "05/05/2023",
  },
  {
    id: "PROV-003",
    name: "Suministros Oficina Plus",
    contactPerson: "Roberto Sánchez",
    email: "roberto@soplus.com",
    phone: "+1 555-456-7890",
    category: "Oficina",
    status: "inactive",
    paymentTerms: "Inmediato",
    balance: 0,
    lastOrder: "15/04/2023",
  },
  {
    id: "PROV-004",
    name: "Muebles Elegantes",
    contactPerson: "María Torres",
    email: "maria@muebles-elegantes.com",
    phone: "+1 555-789-0123",
    category: "Hogar",
    status: "active",
    paymentTerms: "45 días",
    balance: 3200.5,
    lastOrder: "01/05/2023",
  },
  {
    id: "PROV-005",
    name: "Alimentos Frescos S.A.",
    contactPerson: "Javier López",
    email: "javier@alimentosfrescos.com",
    phone: "+1 555-234-5678",
    category: "Alimentos",
    status: "active",
    paymentTerms: "7 días",
    balance: 875.25,
    lastOrder: "11/05/2023",
  },
]

// Datos de ejemplo para órdenes de compra
const purchaseOrders = [
  {
    id: "PO-001",
    provider: "Distribuidora Tecnológica S.A.",
    date: "10/05/2023",
    amount: 1250.75,
    status: "received",
    items: 5,
  },
  {
    id: "PO-002",
    provider: "Textiles Modernos",
    date: "05/05/2023",
    amount: 450.0,
    status: "sent",
    items: 3,
  },
  {
    id: "PO-003",
    provider: "Muebles Elegantes",
    date: "01/05/2023",
    amount: 3200.5,
    status: "partially_received",
    items: 2,
  },
  {
    id: "PO-004",
    provider: "Alimentos Frescos S.A.",
    date: "11/05/2023",
    amount: 875.25,
    status: "draft",
    items: 8,
  },
]

// Datos de ejemplo para facturas pendientes
const pendingInvoices = [
  {
    id: "INV-001",
    provider: "Distribuidora Tecnológica S.A.",
    date: "12/05/2023",
    dueDate: "11/06/2023",
    amount: 1250.75,
    status: "pending",
  },
  {
    id: "INV-002",
    provider: "Muebles Elegantes",
    date: "05/05/2023",
    dueDate: "19/06/2023",
    amount: 3200.5,
    status: "partially_paid",
    amountPaid: 1500.0,
  },
  {
    id: "INV-003",
    provider: "Alimentos Frescos S.A.",
    date: "11/05/2023",
    dueDate: "18/05/2023",
    amount: 875.25,
    status: "overdue",
  },
]

export default function ProvidersPage() {
  const [providers, setProviders] = useState(initialProviders)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [activeTab, setActiveTab] = useState("orders")

  // Filtrar proveedores
  const filteredProviders = providers
    .filter((provider) => {
      // Filtro de búsqueda
      const matchesSearch =
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.email.toLowerCase().includes(searchQuery.toLowerCase())

      // Filtro de categoría
      const matchesCategory = categoryFilter === "all" || provider.category === categoryFilter

      // Filtro de estado
      const matchesStatus = statusFilter === "all" || provider.status === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      // Ordenamiento
      if (sortField === "name") {
        return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortField === "balance") {
        return sortDirection === "asc" ? a.balance - b.balance : b.balance - a.balance
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

  // Función para eliminar un proveedor
  const handleDeleteProvider = (providerId) => {
    // Mostrar un diálogo de confirmación nativo en lugar de SweetAlert2
    if (window.confirm("¿Estás seguro de que deseas eliminar este proveedor? Esta acción no se puede deshacer.")) {
      // Filtrar el proveedor eliminado
      const updatedProviders = providers.filter((provider) => provider.id !== providerId)
      setProviders(updatedProviders)
      alert("Proveedor eliminado correctamente")
    }
  }

  // Categorías disponibles
  const categories = ["Electrónica", "Ropa", "Oficina", "Hogar", "Alimentos"]

  // Estadísticas
  const totalProviders = providers.length
  const activeProviders = providers.filter((p) => p.status === "active").length
  const totalBalance = providers.reduce((sum, provider) => sum + provider.balance, 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Proveedores</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Link href="/dashboard/pos/providers/new">
            <Button size="sm" className="bg-[#0a2463] hover:bg-[#0a2463]/90">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proveedor
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proveedores</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProviders}</div>
            <p className="text-xs text-muted-foreground">
              {activeProviders} activos, {totalProviders - activeProviders} inactivos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Pendiente</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Facturas por pagar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órdenes Pendientes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchaseOrders.filter((po) => po.status !== "received").length}</div>
            <p className="text-xs text-muted-foreground">Órdenes en proceso</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Directorio de Proveedores</CardTitle>
          <CardDescription>Gestiona tus proveedores y sus datos de contacto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, contacto o email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
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
                  <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                    <div className="flex items-center">
                      Proveedor
                      {sortField === "name" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                    </div>
                  </TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Términos</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("balance")}>
                    <div className="flex items-center">
                      Saldo
                      {sortField === "balance" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                    </div>
                  </TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProviders.length > 0 ? (
                  filteredProviders.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell className="font-medium">
                        <div>{provider.name}</div>
                        <div className="text-xs text-slate-500">{provider.id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{provider.contactPerson}</span>
                          <span className="text-xs text-slate-500">{provider.email}</span>
                          <span className="text-xs text-slate-500">{provider.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>{provider.category}</TableCell>
                      <TableCell>{provider.paymentTerms}</TableCell>
                      <TableCell>${provider.balance.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            provider.status === "active"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-slate-100 text-slate-800 hover:bg-slate-100"
                          }`}
                        >
                          {provider.status === "active" ? "Activo" : "Inactivo"}
                        </Badge>
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
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Nueva Orden
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CreditCard className="mr-2 h-4 w-4" />
                              Registrar Pago
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteProvider(provider.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                      No se encontraron proveedores. Intenta con una búsqueda diferente.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-slate-500">
            Mostrando {filteredProviders.length} de {providers.length} proveedores
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/pos/providers/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proveedor
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium ${activeTab === "orders" ? "border-b-2 border-[#0a2463] text-[#0a2463]" : "text-gray-500"}`}
            onClick={() => setActiveTab("orders")}
          >
            Órdenes de Compra
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "invoices" ? "border-b-2 border-[#0a2463] text-[#0a2463]" : "text-gray-500"}`}
            onClick={() => setActiveTab("invoices")}
          >
            Facturas Pendientes
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "payments" ? "border-b-2 border-[#0a2463] text-[#0a2463]" : "text-gray-500"}`}
            onClick={() => setActiveTab("payments")}
          >
            Pagos a Proveedores
          </button>
        </div>

        {activeTab === "orders" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Órdenes de Compra</CardTitle>
                <CardDescription>Gestiona tus órdenes de compra a proveedores</CardDescription>
              </div>
              <Button size="sm" className="bg-[#0a2463] hover:bg-[#0a2463]/90">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Orden
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Proveedor</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Artículos</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.provider}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>${order.amount.toFixed(2)}</TableCell>
                        <TableCell>{order.items}</TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              order.status === "received"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : order.status === "sent"
                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                  : order.status === "partially_received"
                                    ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                    : "bg-slate-100 text-slate-800 hover:bg-slate-100"
                            }`}
                          >
                            {order.status === "received"
                              ? "Recibida"
                              : order.status === "sent"
                                ? "Enviada"
                                : order.status === "partially_received"
                                  ? "Parcial"
                                  : "Borrador"}
                          </Badge>
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
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Package className="mr-2 h-4 w-4" />
                                Registrar Recepción
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Crear Factura
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/pos/providers/orders" className="ml-auto">
                  Ver Todas las Órdenes
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}

        {activeTab === "invoices" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Facturas Pendientes</CardTitle>
                <CardDescription>Facturas por pagar a proveedores</CardDescription>
              </div>
              <Button size="sm" className="bg-[#0a2463] hover:bg-[#0a2463]/90">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Factura
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Proveedor</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Vencimiento</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.provider}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.dueDate}</TableCell>
                        <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              invoice.status === "pending"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                : invoice.status === "partially_paid"
                                  ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                            }`}
                          >
                            {invoice.status === "pending"
                              ? "Pendiente"
                              : invoice.status === "partially_paid"
                                ? "Pago Parcial"
                                : "Vencida"}
                          </Badge>
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
                              <DropdownMenuItem>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Registrar Pago
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/pos/providers/invoices" className="ml-auto">
                  Ver Todas las Facturas
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}

        {activeTab === "payments" && (
          <Card>
            <CardHeader>
              <CardTitle>Pagos a Proveedores</CardTitle>
              <CardDescription>Registro de pagos realizados a proveedores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-500">
                <CreditCard className="h-8 w-8 mx-auto mb-2" />
                <p>Selecciona "Facturas Pendientes" y usa la opción "Registrar Pago" para añadir un nuevo pago.</p>
                <Button variant="outline" size="sm" className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar Nuevo Pago
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
