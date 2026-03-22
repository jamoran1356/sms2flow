"use client"

import { useState, useEffect } from "react"
import {
  BadgeCheck,
  Download,
  Mail,
  Phone,
  Search,
  Shield,
  User,
  CircleSlash,
  MoreHorizontal,
  ChevronDown,
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
import { Badge } from "@/components/ui/badge"

export default function AdminCustomersPage() {
  const [loading, setLoading] = useState(true)
  const [customers, setCustomers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/customers")
        if (res.ok) {
          const data = await res.json()
          setCustomers(data.customers || [])
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase()
    return (
      (c.name || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q) ||
      (c.phone || "").toLowerCase().includes(q)
    )
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Gestionar Clientes</CardTitle>
          <CardDescription>Clientes registrados en la plataforma SMS2Flow</CardDescription>
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
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Registro</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                          <span className="text-xs font-medium text-blue-600">
                            {(customer.name || "?").charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{customer.name || "Sin nombre"}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {customer.email && (
                          <div className="flex items-center">
                            <Mail className="h-3.5 w-3.5 text-slate-400 mr-1" />
                            {customer.email}
                          </div>
                        )}
                        {customer.phone && (
                          <div className="flex items-center mt-1">
                            <Phone className="h-3.5 w-3.5 text-slate-400 mr-1" />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(customer.createdAt).toLocaleDateString("es-ES")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No se encontraron clientes
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-slate-500">
            Mostrando {filteredCustomers.length} de {customers.length} clientes
          </div>
        </CardFooter>
      </Card>

      {selectedCustomer && (
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Detalles del Cliente</DialogTitle>
              <DialogDescription>{selectedCustomer.name || "Cliente"}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Nombre:</span>
                <span className="font-medium">{selectedCustomer.name || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-medium">{selectedCustomer.email || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Teléfono:</span>
                <span className="font-medium">{selectedCustomer.phone || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dirección Flow:</span>
                <span className="font-medium font-mono text-xs">{selectedCustomer.flowAddress || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Registrado:</span>
                <span className="font-medium">{new Date(selectedCustomer.createdAt).toLocaleDateString("es-ES")}</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
