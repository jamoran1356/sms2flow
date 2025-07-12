"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Info, Loader2, Package, Plus, Save, Search, Trash, X } from "lucide-react"
import Swal from "sweetalert2"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DatePicker } from "@/components/ui/date-picker"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Datos de ejemplo para proveedores
const providers = [
  {
    id: "PROV-001",
    name: "Distribuidora Tecnológica S.A.",
    contactPerson: "Carlos Méndez",
    email: "carlos@distritec.com",
    phone: "+1 555-123-4567",
    category: "Electrónica",
    status: "active",
    paymentTerms: "30",
    discount: 5,
  },
  {
    id: "PROV-002",
    name: "Textiles Modernos",
    contactPerson: "Ana García",
    email: "ana@textmod.com",
    phone: "+1 555-987-6543",
    category: "Ropa",
    status: "active",
    paymentTerms: "15",
    discount: 3,
  },
  {
    id: "PROV-003",
    name: "Suministros Oficina Plus",
    contactPerson: "Roberto Sánchez",
    email: "roberto@soplus.com",
    phone: "+1 555-456-7890",
    category: "Oficina",
    status: "inactive",
    paymentTerms: "immediate",
    discount: 0,
  },
  {
    id: "PROV-004",
    name: "Muebles Elegantes",
    contactPerson: "María Torres",
    email: "maria@muebles-elegantes.com",
    phone: "+1 555-789-0123",
    category: "Hogar",
    status: "active",
    paymentTerms: "45",
    discount: 7,
  },
  {
    id: "PROV-005",
    name: "Alimentos Frescos S.A.",
    contactPerson: "Javier López",
    email: "javier@alimentosfrescos.com",
    phone: "+1 555-234-5678",
    category: "Alimentos",
    status: "active",
    paymentTerms: "7",
    discount: 2,
  },
]

// Datos de ejemplo para productos
const products = [
  {
    id: "PROD-001",
    name: 'Laptop HP 15.6"',
    sku: "LAP-HP-001",
    category: "Electrónica",
    price: 650.0,
    cost: 520.0,
    providerId: "PROV-001",
    stock: 15,
    minStock: 5,
  },
  {
    id: "PROD-002",
    name: 'Monitor Dell 24"',
    sku: "MON-DEL-001",
    category: "Electrónica",
    price: 250.0,
    cost: 180.0,
    providerId: "PROV-001",
    stock: 8,
    minStock: 3,
  },
  {
    id: "PROD-003",
    name: "Teclado Mecánico Logitech",
    sku: "TEC-LOG-001",
    category: "Electrónica",
    price: 85.0,
    cost: 60.0,
    providerId: "PROV-001",
    stock: 20,
    minStock: 7,
  },
  {
    id: "PROD-004",
    name: "Camiseta Algodón Premium",
    sku: "CAM-ALG-001",
    category: "Ropa",
    price: 25.0,
    cost: 12.5,
    providerId: "PROV-002",
    stock: 50,
    minStock: 15,
  },
  {
    id: "PROD-005",
    name: "Pantalón Formal",
    sku: "PAN-FOR-001",
    category: "Ropa",
    price: 45.0,
    cost: 22.5,
    providerId: "PROV-002",
    stock: 30,
    minStock: 10,
  },
  {
    id: "PROD-006",
    name: "Papel A4 (Resma)",
    sku: "PAP-A4-001",
    category: "Oficina",
    price: 5.5,
    cost: 3.2,
    providerId: "PROV-003",
    stock: 100,
    minStock: 30,
  },
  {
    id: "PROD-007",
    name: "Bolígrafos (Caja x12)",
    sku: "BOL-12-001",
    category: "Oficina",
    price: 8.75,
    cost: 4.5,
    providerId: "PROV-003",
    stock: 45,
    minStock: 15,
  },
  {
    id: "PROD-008",
    name: "Sofá 3 Plazas",
    sku: "SOF-3P-001",
    category: "Hogar",
    price: 450.0,
    cost: 280.0,
    providerId: "PROV-004",
    stock: 5,
    minStock: 2,
  },
  {
    id: "PROD-009",
    name: "Mesa de Centro",
    sku: "MES-CT-001",
    category: "Hogar",
    price: 120.0,
    cost: 75.0,
    providerId: "PROV-004",
    stock: 8,
    minStock: 3,
  },
  {
    id: "PROD-010",
    name: "Frutas Surtidas (Kg)",
    sku: "FRU-KG-001",
    category: "Alimentos",
    price: 3.5,
    cost: 1.8,
    providerId: "PROV-005",
    stock: 25,
    minStock: 10,
  },
]

export default function NewOrderPage() {
  const [activeTab, setActiveTab] = useState("provider")
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [orderItems, setOrderItems] = useState([])
  const [orderDate, setOrderDate] = useState(new Date())
  const [expectedDate, setExpectedDate] = useState(null)
  const [notes, setNotes] = useState("")
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [paymentMethod, setPaymentMethod] = useState("transfer")
  const [isLoading, setIsLoading] = useState(false)

  // Calcular totales
  const subtotal = orderItems.reduce((sum, item) => sum + item.cost * item.quantity, 0)
  const discount = selectedProvider ? (subtotal * selectedProvider.discount) / 100 : 0
  const tax = (subtotal - discount) * 0.12 // IVA 12%
  const total = subtotal - discount + tax

  // Filtrar productos por proveedor seleccionado
  const filteredProducts = selectedProvider
    ? products.filter(
        (product) =>
          product.providerId === selectedProvider.id && product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

  // Agregar producto a la orden
  const addProductToOrder = (product) => {
    // Verificar si el producto ya está en la orden
    const existingItem = orderItems.find((item) => item.id === product.id)

    if (existingItem) {
      // Actualizar cantidad si ya existe
      setOrderItems(
        orderItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)),
      )
    } else {
      // Agregar nuevo item
      setOrderItems([...orderItems, { ...product, quantity: 1 }])
    }
  }

  // Actualizar cantidad de un producto
  const updateItemQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      // Eliminar producto si la cantidad es 0 o negativa
      setOrderItems(orderItems.filter((item) => item.id !== productId))
    } else {
      // Actualizar cantidad
      setOrderItems(orderItems.map((item) => (item.id === productId ? { ...item, quantity } : item)))
    }
  }

  // Eliminar producto de la orden
  const removeItem = (productId) => {
    setOrderItems(orderItems.filter((item) => item.id !== productId))
  }

  // Guardar orden
  const saveOrder = () => {
    if (!selectedProvider) {
      Swal.fire({
        title: "Error",
        text: "Debes seleccionar un proveedor",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#0a2463",
      })
      return
    }

    if (orderItems.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Debes agregar al menos un producto a la orden",
        icon: "error",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#0a2463",
      })
      return
    }

    setIsLoading(true)

    // Simulación de guardado
    setTimeout(() => {
      setIsLoading(false)

      Swal.fire({
        title: "¡Éxito!",
        text: "Orden de compra creada correctamente",
        icon: "success",
        confirmButtonText: "Continuar",
        confirmButtonColor: "#0a2463",
      }).then((result) => {
        if (result.isConfirmed) {
          // En un entorno real, redirigir a la página de órdenes
          window.location.href = "/dashboard/pos/providers/orders"
        }
      })
    }, 1500)
  }

  // Establecer fecha estimada automáticamente según términos de pago
  useEffect(() => {
    if (selectedProvider && orderDate) {
      const days = Number.parseInt(selectedProvider.paymentTerms) || 0
      const date = new Date(orderDate)
      date.setDate(date.getDate() + days)
      setExpectedDate(date)
    }
  }, [selectedProvider, orderDate])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/pos/providers/orders">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Nueva Orden de Compra</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/pos/providers/orders">
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Link>
          </Button>
          <Button size="sm" className="bg-[#0a2463] hover:bg-[#0a2463]/90" onClick={saveOrder} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Orden
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="provider">Proveedor</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="details">Detalles de Envío y Pago</TabsTrigger>
        </TabsList>

        {/* Pestaña de Proveedor */}
        <TabsContent value="provider" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Seleccionar Proveedor</CardTitle>
              <CardDescription>Elige el proveedor para esta orden de compra</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar proveedor por nombre o ID..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Proveedor</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Términos</TableHead>
                      <TableHead>Descuento</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {providers
                      .filter(
                        (provider) =>
                          provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          provider.id.toLowerCase().includes(searchQuery.toLowerCase()),
                      )
                      .map((provider) => (
                        <TableRow
                          key={provider.id}
                          className={selectedProvider?.id === provider.id ? "bg-slate-50" : ""}
                        >
                          <TableCell className="font-medium">{provider.id}</TableCell>
                          <TableCell>{provider.name}</TableCell>
                          <TableCell>{provider.category}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{provider.contactPerson}</span>
                              <span className="text-xs text-slate-500">{provider.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {provider.paymentTerms === "immediate" ? "Inmediato" : `${provider.paymentTerms} días`}
                          </TableCell>
                          <TableCell>{provider.discount}%</TableCell>
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
                            <Button
                              variant={selectedProvider?.id === provider.id ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedProvider(provider)}
                              className={
                                selectedProvider?.id === provider.id ? "bg-[#0a2463] hover:bg-[#0a2463]/90" : ""
                              }
                            >
                              {selectedProvider?.id === provider.id ? (
                                <>
                                  <Check className="mr-2 h-4 w-4" />
                                  Seleccionado
                                </>
                              ) : (
                                "Seleccionar"
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-slate-500">
                {selectedProvider ? (
                  <span>
                    Proveedor seleccionado: <strong>{selectedProvider.name}</strong>
                  </span>
                ) : (
                  "Selecciona un proveedor para continuar"
                )}
              </div>
              <Button
                onClick={() => {
                  if (!selectedProvider) {
                    Swal.fire({
                      title: "Atención",
                      text: "Debes seleccionar un proveedor para continuar",
                      icon: "warning",
                      confirmButtonText: "Entendido",
                      confirmButtonColor: "#0a2463",
                    })
                    return
                  }
                  setActiveTab("products")
                }}
                className="bg-[#0a2463] hover:bg-[#0a2463]/90"
                disabled={!selectedProvider}
              >
                Siguiente: Productos
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Pestaña de Productos */}
        <TabsContent value="products" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Productos del Proveedor</CardTitle>
                  <CardDescription>
                    Productos disponibles de {selectedProvider?.name || "proveedor seleccionado"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar producto por nombre o SKU..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>SKU</TableHead>
                          <TableHead>Producto</TableHead>
                          <TableHead>Categoría</TableHead>
                          <TableHead>Costo</TableHead>
                          <TableHead>Stock Actual</TableHead>
                          <TableHead>Stock Mínimo</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell className="font-medium">{product.sku}</TableCell>
                              <TableCell>{product.name}</TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell>${product.cost.toFixed(2)}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <span className={product.stock <= product.minStock ? "text-red-500" : ""}>
                                    {product.stock}
                                  </span>
                                  {product.stock <= product.minStock && (
                                    <Badge className="ml-2 bg-red-100 text-red-800 hover:bg-red-100">Bajo</Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{product.minStock}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    addProductToOrder(product)
                                    Swal.fire({
                                      title: "Producto añadido",
                                      text: `${product.name} añadido a la orden`,
                                      icon: "success",
                                      toast: true,
                                      position: "bottom-end",
                                      showConfirmButton: false,
                                      timer: 3000,
                                      timerProgressBar: true,
                                    })
                                  }}
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Agregar
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                              {selectedProvider
                                ? "No se encontraron productos para este proveedor. Intenta con una búsqueda diferente."
                                : "Selecciona un proveedor para ver sus productos."}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Resumen de la Orden</CardTitle>
                  <CardDescription>Productos seleccionados</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orderItems.length > 0 ? (
                    <div className="space-y-4">
                      {orderItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center border-b pb-2">
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-slate-500">{item.sku}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                            >
                              <span>-</span>
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItemQuantity(item.id, Number.parseInt(e.target.value) || 0)}
                              className="w-16 h-8 text-center"
                              min="1"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                            >
                              <span>+</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-red-500"
                              onClick={() => {
                                Swal.fire({
                                  title: "¿Eliminar producto?",
                                  text: "¿Estás seguro de que deseas eliminar este producto de la orden?",
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonText: "Sí, eliminar",
                                  cancelButtonText: "Cancelar",
                                  confirmButtonColor: "#d33",
                                  cancelButtonColor: "#3085d6",
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    removeItem(item.id)
                                  }
                                })
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-right ml-4 w-20">
                            <div className="font-medium">${(item.cost * item.quantity).toFixed(2)}</div>
                            <div className="text-xs text-slate-500">
                              ${item.cost.toFixed(2)} x {item.quantity}
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="space-y-2 pt-4">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Descuento ({selectedProvider.discount}%):</span>
                            <span>-${discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span>IVA (12%):</span>
                          <span>${tax.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold">
                          <span>Total:</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Package className="h-8 w-8 mx-auto mb-2" />
                      <p>No hay productos en la orden</p>
                      <p className="text-sm mt-1">Agrega productos desde la lista</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("provider")}>
                    Anterior: Proveedor
                  </Button>
                  <Button
                    onClick={() => {
                      if (orderItems.length === 0) {
                        Swal.fire({
                          title: "Atención",
                          text: "Debes agregar al menos un producto a la orden",
                          icon: "warning",
                          confirmButtonText: "Entendido",
                          confirmButtonColor: "#0a2463",
                        })
                        return
                      }
                      setActiveTab("details")
                    }}
                    className="bg-[#0a2463] hover:bg-[#0a2463]/90"
                    disabled={orderItems.length === 0}
                  >
                    Siguiente: Detalles
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Pestaña de Detalles */}
        <TabsContent value="details" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalles de la Orden</CardTitle>
                <CardDescription>Información general de la orden de compra</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orderDate">Fecha de Orden</Label>
                    <DatePicker id="orderDate" selected={orderDate} onSelect={setOrderDate} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedDate">Fecha Estimada de Entrega</Label>
                    <DatePicker id="expectedDate" selected={expectedDate} onSelect={setExpectedDate} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notas / Instrucciones Especiales</Label>
                  <Textarea
                    id="notes"
                    placeholder="Añade notas o instrucciones para el proveedor..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Envío y Pago</CardTitle>
                <CardDescription>Método de envío y forma de pago</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Método de Envío</Label>
                  <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="cursor-pointer">
                        Estándar
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="cursor-pointer">
                        Express
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="cursor-pointer">
                        Recoger en Proveedor
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Método de Pago</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="transfer" id="transfer" />
                      <Label htmlFor="transfer" className="cursor-pointer">
                        Transferencia Bancaria
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit" id="credit" />
                      <Label htmlFor="credit" className="cursor-pointer">
                        Crédito ({selectedProvider?.paymentTerms} días)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="cursor-pointer">
                        Efectivo
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="crypto" id="crypto" />
                      <Label htmlFor="crypto" className="cursor-pointer">
                        Criptomoneda (KII)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="pt-2 mt-2 border-t">
                  <div className="flex items-center space-x-2">
                    <Info className="h-4 w-4 text-slate-500" />
                    <p className="text-sm text-slate-500">
                      Los términos de pago se aplicarán según la configuración del proveedor.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("products")}>
                  Anterior: Productos
                </Button>
                <Button onClick={saveOrder} className="bg-[#0a2463] hover:bg-[#0a2463]/90" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Orden
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resumen de la Orden</CardTitle>
              <CardDescription>Revisa los detalles antes de guardar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Proveedor</h3>
                  {selectedProvider && (
                    <div className="text-sm space-y-1">
                      <p className="font-medium">{selectedProvider.name}</p>
                      <p>{selectedProvider.contactPerson}</p>
                      <p className="text-slate-500">{selectedProvider.email}</p>
                      <p className="text-slate-500">{selectedProvider.phone}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-medium mb-2">Detalles de la Orden</h3>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-slate-500">Fecha de Orden:</span> {orderDate?.toLocaleDateString()}
                    </p>
                    <p>
                      <span className="text-slate-500">Entrega Estimada:</span>{" "}
                      {expectedDate?.toLocaleDateString() || "No especificada"}
                    </p>
                    <p>
                      <span className="text-slate-500">Método de Envío:</span>{" "}
                      {shippingMethod === "standard"
                        ? "Estándar"
                        : shippingMethod === "express"
                          ? "Express"
                          : "Recoger en Proveedor"}
                    </p>
                    <p>
                      <span className="text-slate-500">Método de Pago:</span>{" "}
                      {paymentMethod === "transfer"
                        ? "Transferencia Bancaria"
                        : paymentMethod === "credit"
                          ? "Crédito"
                          : paymentMethod === "cash"
                            ? "Efectivo"
                            : "Criptomoneda (KII)"}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Resumen de Costos</h3>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-slate-500">Productos:</span> {orderItems.length}
                    </p>
                    <p>
                      <span className="text-slate-500">Unidades Totales:</span>{" "}
                      {orderItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </p>
                    <p>
                      <span className="text-slate-500">Subtotal:</span> ${subtotal.toFixed(2)}
                    </p>
                    {discount > 0 && (
                      <p>
                        <span className="text-slate-500">Descuento ({selectedProvider?.discount}%):</span> -$
                        {discount.toFixed(2)}
                      </p>
                    )}
                    <p>
                      <span className="text-slate-500">IVA (12%):</span> ${tax.toFixed(2)}
                    </p>
                    <p className="font-medium">
                      <span className="text-slate-500">Total:</span> ${total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {notes && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-medium mb-2">Notas</h3>
                  <p className="text-sm">{notes}</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={saveOrder} className="ml-auto bg-[#0a2463] hover:bg-[#0a2463]/90" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Finalizar y Guardar Orden
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
