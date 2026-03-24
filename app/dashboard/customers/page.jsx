"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Send, Phone, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [sendAmount, setSendAmount] = useState("")
  const [sendDialogOpen, setSendDialogOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [newDialogOpen, setNewDialogOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "" })
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState("")
  const [createSuccess, setCreateSuccess] = useState("")

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers")
      if (res.ok) {
        const data = await res.json()
        setCustomers(data.customers || [])
      }
    } catch (e) {
      console.error("Error fetching customers:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCustomers() }, [])

  const filteredCustomers = customers.filter((c) =>
    (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSend = async () => {
    if (!selectedCustomer || !sendAmount) return
    setSending(true)
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "SMS_PAYMENT",
          amount: parseFloat(sendAmount),
          currency: "FLOW",
          toPhone: selectedCustomer.phone,
          description: `Envío SMS a ${selectedCustomer.name}`,
        }),
      })
      if (res.ok) {
        setSendDialogOpen(false)
        setSendAmount("")
        setSelectedCustomer(null)
      }
    } catch (e) {
      console.error("Error sending:", e)
    } finally {
      setSending(false)
    }
  }

  const handleCreateCustomer = async () => {
    setCreateError("")
    setCreateSuccess("")

    if (!newCustomer.name || !newCustomer.phone) {
      setCreateError("Nombre y teléfono son obligatorios")
      return
    }

    setCreating(true)
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setNewDialogOpen(false)
        setNewCustomer({ name: "", email: "", phone: "" })
        setCreateSuccess("Cliente agregado correctamente")
        fetchCustomers()
      } else {
        setCreateError(data.error || "No se pudo crear el cliente")
      }
    } catch (e) {
      console.error("Error creating customer:", e)
      setCreateError("Error de conexión al crear el cliente")
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Clientes</h1>
          <p className="text-gray-500 mt-1">Gestiona tus clientes y contactos</p>
          {createSuccess && <p className="mt-2 text-sm text-green-600">{createSuccess}</p>}
        </div>
        <Dialog open={newDialogOpen} onOpenChange={setNewDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Cliente</DialogTitle>
              <DialogDescription>Agrega un nuevo cliente a tu lista</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {createError && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {createError}
                </div>
              )}
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} placeholder="Nombre completo" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} placeholder="correo@ejemplo.com" />
              </div>
              <div className="space-y-2">
                <Label>Teléfono (obligatorio)</Label>
                <Input value={newCustomer.phone} onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })} placeholder="+34 612 345 678" />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setCreateError("")
                  setCreateSuccess("")
                  setNewDialogOpen(false)
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreateCustomer} disabled={creating || !newCustomer.name || !newCustomer.phone} className="bg-blue-600 hover:bg-blue-700">
                {creating ? "Creando..." : "Crear Cliente"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Lista de Clientes
          </CardTitle>
          <CardDescription>
            {customers.length} cliente(s) registrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o teléfono..."
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
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Registrado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-2">
                          <span className="text-xs font-medium text-blue-600">
                            {(customer.name || "?").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </span>
                        </div>
                        <span className="font-medium">{customer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500">{customer.email || "—"}</TableCell>
                    <TableCell>
                      {customer.phone ? (
                        <div className="flex items-center">
                          <Phone className="h-3.5 w-3.5 text-gray-400 mr-1" />
                          {customer.phone}
                        </div>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {new Date(customer.createdAt).toLocaleDateString("es-ES")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setSelectedCustomer(customer); setSendDialogOpen(true) }}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Enviar FLOW
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchQuery ? "No se encontraron clientes con esa búsqueda." : "No tienes clientes aún. Agrega tu primer cliente."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="text-sm text-gray-500">
            Mostrando {filteredCustomers.length} de {customers.length} clientes
          </div>
        </CardFooter>
      </Card>

      {/* Dialog para enviar FLOW */}
      <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enviar FLOW</DialogTitle>
            <DialogDescription>Envía tokens FLOW a este cliente</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{selectedCustomer.name}</p>
                <p className="text-sm text-gray-500">{selectedCustomer.phone || selectedCustomer.email}</p>
              </div>
              <div className="space-y-2">
                <Label>Cantidad (FLOW)</Label>
                <Input
                  type="number"
                  step="0.0001"
                  placeholder="0.00"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSend} disabled={sending || !sendAmount} className="bg-blue-600 hover:bg-blue-700">
              {sending ? "Enviando..." : "Confirmar Envío"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
