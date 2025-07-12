"use client"

import { useState } from "react"
import { BadgeCheck, Download, Mail, MoreHorizontal, Phone, Search, Shield, Star, User } from "lucide-react"
import Link from "next/link"

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
  },
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [verificationFilter, setVerificationFilter] = useState("all")

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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Clientes</h1>
        <Link href="/dashboard/customers/new">
          <Button>
            <User className="mr-2 h-4 w-4" />
            Añadir Cliente
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Gestionar Clientes</CardTitle>
          <CardDescription>
            Visualiza y gestiona todos los clientes que han realizado transacciones con tu negocio.
          </CardDescription>
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
                <TableHead>Transacciones</TableHead>
                <TableHead>Total Gastado</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Valoración</TableHead>
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
                    <TableCell>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < customer.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200"
                            }`}
                          />
                        ))}
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
