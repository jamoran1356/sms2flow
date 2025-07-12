"use client"

import { useState } from "react"
import {
  BadgeCheck,
  ChevronDown,
  Download,
  ExternalLink,
  Globe,
  Mail,
  MoreHorizontal,
  Phone,
  Search,
  Shield,
  Star,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo para clientes
const initialCustomers = [
  {
    id: "1",
    name: "María Rodríguez",
    email: "maria@ejemplo.com",
    phone: "+34 612 345 678",
    totalSpent: "1,250.00",
    transactions: 12,
    lastPurchase: "10/05/2023",
    status: "Active",
    verified: true,
    rating: 5,
    websites: [
      {
        url: "https://tienda-maria.com",
        name: "Tienda Online María",
        status: "active",
        scriptType: "payment-button",
        lastTransaction: "10/05/2023",
        monthlyVolume: "450.00",
      },
      {
        url: "https://blog-maria.com",
        name: "Blog Personal",
        status: "active",
        scriptType: "donation-button",
        lastTransaction: "05/05/2023",
        monthlyVolume: "120.00",
      },
    ],
  },
  {
    id: "2",
    name: "Carlos Gómez",
    email: "carlos@ejemplo.com",
    phone: "+34 623 456 789",
    totalSpent: "750.50",
    transactions: 8,
    lastPurchase: "05/05/2023",
    status: "Active",
    verified: true,
    rating: 4,
    websites: [
      {
        url: "https://carlos-tech.com",
        name: "Carlos Tech Solutions",
        status: "active",
        scriptType: "subscription-form",
        lastTransaction: "05/05/2023",
        monthlyVolume: "350.50",
      },
    ],
  },
  {
    id: "3",
    name: "Ana Martínez",
    email: "ana@ejemplo.com",
    phone: "+34 634 567 890",
    totalSpent: "2,430.75",
    transactions: 24,
    lastPurchase: "12/05/2023",
    status: "Active",
    verified: true,
    rating: 5,
    websites: [
      {
        url: "https://ana-design.com",
        name: "Ana Design Studio",
        status: "active",
        scriptType: "payment-button",
        lastTransaction: "12/05/2023",
        monthlyVolume: "980.25",
      },
      {
        url: "https://ana-courses.com",
        name: "Ana Courses Platform",
        status: "active",
        scriptType: "subscription-form",
        lastTransaction: "10/05/2023",
        monthlyVolume: "1,200.50",
      },
      {
        url: "https://ana-blog.com",
        name: "Ana Personal Blog",
        status: "inactive",
        scriptType: "donation-button",
        lastTransaction: "01/04/2023",
        monthlyVolume: "0.00",
      },
    ],
  },
  {
    id: "4",
    name: "Javier López",
    email: "javier@ejemplo.com",
    phone: "+34 645 678 901",
    totalSpent: "320.25",
    transactions: 3,
    lastPurchase: "28/04/2023",
    status: "Inactive",
    verified: false,
    rating: 3,
    websites: [],
  },
  {
    id: "5",
    name: "Laura Sánchez",
    email: "laura@ejemplo.com",
    phone: "+34 656 789 012",
    totalSpent: "1,875.30",
    transactions: 15,
    lastPurchase: "08/05/2023",
    status: "Active",
    verified: true,
    rating: 4,
    websites: [
      {
        url: "https://laura-shop.com",
        name: "Laura's Fashion Shop",
        status: "active",
        scriptType: "payment-button",
        lastTransaction: "08/05/2023",
        monthlyVolume: "875.30",
      },
      {
        url: "https://laura-blog.com",
        name: "Laura's Lifestyle Blog",
        status: "active",
        scriptType: "donation-button",
        lastTransaction: "06/05/2023",
        monthlyVolume: "150.00",
      },
    ],
  },
  {
    id: "6",
    name: "Miguel Fernández",
    email: "miguel@ejemplo.com",
    phone: "+34 667 890 123",
    totalSpent: "540.00",
    transactions: 6,
    lastPurchase: "01/05/2023",
    status: "Active",
    verified: false,
    rating: 4,
    websites: [
      {
        url: "https://miguel-tech.com",
        name: "Miguel's Tech Blog",
        status: "active",
        scriptType: "payment-button",
        lastTransaction: "01/05/2023",
        monthlyVolume: "240.00",
      },
    ],
  },
]

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [verificationFilter, setVerificationFilter] = useState("all")
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  // Filtrar clientes basado en búsqueda y filtros
  const filteredCustomers = customers.filter((customer) => {
    // Filtro de búsqueda
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchQuery.toLowerCase())

    // Filtro de estado
    const matchesStatus = statusFilter === "all" || customer.status.toLowerCase() === statusFilter.toLowerCase()

    // Filtro de verificación
    const matchesVerification =
      verificationFilter === "all" ||
      (verificationFilter === "verified" && customer.verified) ||
      (verificationFilter === "unverified" && !customer.verified)

    return matchesSearch && matchesStatus && matchesVerification
  })

  const handleViewCustomerDetails = (customer) => {
    setSelectedCustomer(customer)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Clientes</h1>
        <Button>
          <User className="mr-2 h-4 w-4" />
          Añadir Cliente
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Gestionar Clientes</CardTitle>
          <CardDescription>Visualiza y gestiona todos los clientes registrados en la plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                </SelectContent>
              </Select>
              <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Verificación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="verified">Verificados</SelectItem>
                  <SelectItem value="unverified">No verificados</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Sitios Web</TableHead>
                <TableHead>Transacciones</TableHead>
                <TableHead>Total Gastado</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-2">
                          <span className="text-xs font-medium">
                            {customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium flex items-center">
                            {customer.name}
                            {customer.verified && (
                              <BadgeCheck className="h-4 w-4 text-blue-500 ml-1" title="Verificado" />
                            )}
                          </div>
                          <div className="text-xs text-slate-500">Última compra: {customer.lastPurchase}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center">
                          <Mail className="h-3.5 w-3.5 text-slate-400 mr-1" />
                          {customer.email}
                        </div>
                        <div className="flex items-center mt-1">
                          <Phone className="h-3.5 w-3.5 text-slate-400 mr-1" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-2">
                          <Globe className="h-4 w-4 text-slate-500" />
                        </div>
                        <div>
                          <div className="font-medium">{customer.websites.length}</div>
                          <div className="text-xs text-slate-500">
                            {customer.websites.length > 0
                              ? `${customer.websites.filter((w) => w.status === "active").length} activos`
                              : "Sin sitios"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{customer.transactions}</TableCell>
                    <TableCell>
                      <div className="font-medium">${customer.totalSpent}</div>
                      <div className="text-xs text-slate-500">
                        {(Number.parseFloat(customer.totalSpent.replace(",", "")) / 2).toFixed(2)} KII
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          customer.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                        }`}
                      >
                        {customer.status === "Active" ? "Activo" : "Inactivo"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewCustomerDetails(customer)}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menú</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <User className="mr-2 h-4 w-4" />
                              Ver Perfil
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Enviar Mensaje
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4" />
                              Verificar Cliente
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Ban className="mr-2 h-4 w-4" />
                              Bloquear Cliente
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    No se encontraron clientes. Intenta con una búsqueda diferente.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-slate-500">
            Mostrando {filteredCustomers.length} de {customers.length} clientes
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm">
              Siguiente
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Diálogo de detalles del cliente */}
      {selectedCustomer && (
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="sm:max-w-[900px]">
            <DialogHeader>
              <DialogTitle>Detalles del Cliente</DialogTitle>
              <DialogDescription>Información detallada sobre {selectedCustomer.name}</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="websites" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="websites">Sitios Web</TabsTrigger>
                <TabsTrigger value="transactions">Transacciones</TabsTrigger>
                <TabsTrigger value="profile">Perfil</TabsTrigger>
              </TabsList>
              <TabsContent value="websites" className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Sitios Web Integrados</h3>
                  <Button size="sm">
                    <Globe className="mr-2 h-4 w-4" />
                    Añadir Sitio
                  </Button>
                </div>
                {selectedCustomer.websites.length > 0 ? (
                  <div className="space-y-4">
                    {selectedCustomer.websites.map((website, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start">
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-3 shrink-0">
                                <Globe className="h-5 w-5 text-slate-500" />
                              </div>
                              <div>
                                <h4 className="font-medium">{website.name}</h4>
                                <a
                                  href={website.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline flex items-center"
                                >
                                  {website.url}
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                                <div className="flex items-center mt-2">
                                  <Badge
                                    className={`${
                                      website.status === "active"
                                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                    }`}
                                  >
                                    {website.status === "active" ? "Activo" : "Inactivo"}
                                  </Badge>
                                  <Badge variant="outline" className="ml-2">
                                    {website.scriptType === "payment-button"
                                      ? "Botón de Pago"
                                      : website.scriptType === "subscription-form"
                                        ? "Formulario de Suscripción"
                                        : "Botón de Donación"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">${website.monthlyVolume}</div>
                              <div className="text-xs text-slate-500">Volumen mensual</div>
                              <div className="text-xs text-slate-500 mt-1">
                                Última transacción: {website.lastTransaction}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t flex justify-between items-center">
                            <div className="text-sm">
                              <span className="font-medium">Script ID:</span>{" "}
                              {website.url.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Ver Código
                              </Button>
                              <Button variant="outline" size="sm">
                                Monitorear
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                Desactivar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-md">
                    <Globe className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-700">Sin sitios web integrados</h3>
                    <p className="text-slate-500 mt-1">Este cliente no tiene ningún sitio web integrado con Kiipay.</p>
                    <Button className="mt-4">
                      <Globe className="mr-2 h-4 w-4" />
                      Añadir Sitio Web
                    </Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="transactions" className="space-y-4 pt-4">
                <h3 className="text-lg font-medium">Historial de Transacciones</h3>
                <div className="text-center py-8 border rounded-md">
                  <p className="text-slate-500">
                    Consulta las transacciones de este cliente en la sección de Transacciones.
                  </p>
                  <Button className="mt-4" onClick={() => (window.location.href = "/admin/transactions")}>
                    Ver Transacciones
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="profile" className="space-y-4 pt-4">
                <h3 className="text-lg font-medium">Información del Perfil</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Información Personal</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Nombre:</span>
                        <span className="font-medium">{selectedCustomer.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Email:</span>
                        <span className="font-medium">{selectedCustomer.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Teléfono:</span>
                        <span className="font-medium">{selectedCustomer.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Estado:</span>
                        <Badge
                          className={`${
                            selectedCustomer.status === "Active"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          }`}
                        >
                          {selectedCustomer.status === "Active" ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Verificado:</span>
                        <span className="font-medium flex items-center">
                          {selectedCustomer.verified ? (
                            <>
                              <BadgeCheck className="h-4 w-4 text-blue-500 mr-1" />
                              Sí
                            </>
                          ) : (
                            "No"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Estadísticas</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Total Gastado:</span>
                        <span className="font-medium">${selectedCustomer.totalSpent}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Transacciones:</span>
                        <span className="font-medium">{selectedCustomer.transactions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Última Compra:</span>
                        <span className="font-medium">{selectedCustomer.lastPurchase}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Sitios Web:</span>
                        <span className="font-medium">{selectedCustomer.websites.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Valoración:</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < selectedCustomer.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline">Editar Perfil</Button>
                  <Button>Ver Detalles Completos</Button>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function Ban(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  )
}
