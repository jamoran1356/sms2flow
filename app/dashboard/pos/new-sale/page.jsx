"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  CreditCard,
  DollarSign,
  FileText,
  MinusCircle,
  Package2,
  Printer,
  PlusCircle,
  Receipt,
  Save,
  Search,
  ShoppingBag,
  Trash,
  Wallet,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Importar SweetAlert2
import Swal from "sweetalert2"

// Datos de ejemplo para productos
const inventoryItems = [
  {
    id: "PROD-001",
    name: "Camiseta Premium",
    description: "Camiseta de algodón 100% premium, talla M",
    category: "Ropa",
    price: 29.99,
    stock: 45,
    sku: "RP-TS-001",
    code: "CAM001",
  },
  {
    id: "PROD-002",
    name: "Auriculares Bluetooth",
    description: "Auriculares inalámbricos con cancelación de ruido",
    category: "Electrónica",
    price: 89.99,
    stock: 18,
    sku: "EL-HP-002",
    code: "AUR002",
  },
  {
    id: "PROD-003",
    name: "Taza Personalizada",
    description: "Taza de cerámica con diseño personalizable",
    category: "Hogar",
    price: 14.99,
    stock: 32,
    sku: "HG-MG-003",
    code: "TAZ003",
  },
]

// Añadir datos de ejemplo de clientes recurrentes después de la constante inventoryItems
const sampleCustomers = [
  {
    id: "1234567890",
    firstName: "Juan",
    lastName: "Pérez",
    address: "Av. Principal 123, Ciudad",
    email: "juan.perez@ejemplo.com",
    phone: "555-123-4567",
  },
  {
    id: "0987654321",
    firstName: "María",
    lastName: "González",
    address: "Calle Secundaria 456, Ciudad",
    email: "maria.gonzalez@ejemplo.com",
    phone: "555-765-4321",
  },
  {
    id: "1122334455",
    firstName: "Empresa",
    lastName: "XYZ S.A.",
    address: "Zona Industrial, Lote 789, Ciudad",
    email: "contacto@empresaxyz.com",
    phone: "555-987-6543",
  },
]

export default function NewSalePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [cart, setCart] = useState([])
  const [customer, setCustomer] = useState({
    id: "",
    firstName: "",
    lastName: "",
    address: "",
    email: "",
    phone: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [note, setNote] = useState("")
  const [discount, setDiscount] = useState(0)
  const [tax, setTax] = useState(16) // Porcentaje de impuesto predeterminado
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [amountReceived, setAmountReceived] = useState("")
  const [saleCompleted, setSaleCompleted] = useState(false)
  const [showReceiptDialog, setShowReceiptDialog] = useState(false)
  const receiptRef = useRef(null)

  // Verificar si hay una venta pendiente al cargar el componente
  useEffect(() => {
    const pendingSale = localStorage.getItem("pendingSale")

    if (pendingSale) {
      try {
        const saleData = JSON.parse(pendingSale)

        // Restaurar los datos de la venta pendiente
        if (saleData.cart) setCart(saleData.cart)
        if (saleData.customer) setCustomer(saleData.customer)
        if (saleData.paymentMethod) setPaymentMethod(saleData.paymentMethod)
        if (saleData.note) setNote(saleData.note)
        if (saleData.discount) setDiscount(saleData.discount)
        if (saleData.tax) setTax(saleData.tax)

        // Limpiar el localStorage
        localStorage.removeItem("pendingSale")

        // Mostrar notificación
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        })

        Toast.fire({
          icon: "info",
          title: "Venta pendiente restaurada",
        })
      } catch (error) {
        console.error("Error al restaurar venta pendiente:", error)
        localStorage.removeItem("pendingSale")
      }
    }
  }, [])

  // Filtrar productos
  const filteredProducts = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // Categorías disponibles
  const categories = ["Ropa", "Electrónica", "Hogar", "Libros", "Calzado"]

  // Añadir producto al carrito
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      // Si ya existe, incrementar cantidad
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item,
        ),
      )
    } else {
      // Si no existe, añadir nuevo item
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: 1,
          total: product.price,
          sku: product.sku,
          code: product.code,
        },
      ])
    }
  }

  // Eliminar producto del carrito
  const removeFromCart = (productId) => {
    const productToRemove = cart.find((item) => item.id === productId)

    if (productToRemove) {
      Swal.fire({
        title: "¿Estás seguro?",
        text: `¿Deseas eliminar ${productToRemove.name} del carrito?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0a2463",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          setCart(cart.filter((item) => item.id !== productId))
          Swal.fire({
            title: "Eliminado",
            text: "El producto ha sido eliminado del carrito",
            icon: "success",
            confirmButtonColor: "#0a2463",
          })
        }
      })
    }
  }

  // Actualizar cantidad de producto
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return

    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity, total: newQuantity * item.price } : item,
      ),
    )
  }

  // Calcular subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0)

  // Calcular descuento
  const discountAmount = (subtotal * discount) / 100

  // Calcular impuesto
  const taxAmount = ((subtotal - discountAmount) * tax) / 100

  // Calcular total
  const total = subtotal - discountAmount + taxAmount

  // Calcular cambio
  const calculateChange = () => {
    const received = Number.parseFloat(amountReceived) || 0
    return received > total ? received - total : 0
  }

  // Completar venta
  const completeSale = () => {
    // Validar que se hayan ingresado los datos necesarios
    if (paymentMethod === "cash" && (!amountReceived || Number.parseFloat(amountReceived) < total)) {
      Swal.fire({
        title: "Error",
        text: "El monto recibido debe ser igual o mayor al total de la venta",
        icon: "error",
        confirmButtonColor: "#0a2463",
      })
      return
    }

    // Aquí iría la lógica para guardar la venta en la base de datos
    setSaleCompleted(true)

    // Cerrar diálogo de pago y mostrar recibo sin mostrar mensaje de éxito
    setShowPaymentDialog(false)
    setShowReceiptDialog(true)
  }

  // Imprimir recibo
  const printReceipt = () => {
    if (!receiptRef.current) {
      Swal.fire({
        title: "Error",
        text: "No se pudo generar el recibo para imprimir",
        icon: "error",
        confirmButtonColor: "#0a2463",
      })
      return
    }

    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      Swal.fire({
        title: "Error",
        text: "Por favor, permite las ventanas emergentes para imprimir la factura",
        icon: "warning",
        confirmButtonColor: "#0a2463",
      })
      return
    }

    // Crear contenido HTML para la impresión
    printWindow.document.write(`
  <html>
    <head>
      <title>Factura Kiipay</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .invoice-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        th { font-weight: bold; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .summary { margin-left: auto; width: 50%; }
        .total-row { font-weight: bold; border-top: 1px solid #000; }
        .footer { text-align: center; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      ${receiptRef.current.innerHTML}
    </body>
  </html>
`)

    printWindow.document.close()

    // Esperar a que el contenido se cargue antes de imprimir
    printWindow.onload = () => {
      printWindow.focus()
      printWindow.print()
      printWindow.onafterprint = () => {
        printWindow.close()
      }
    }
  }

  // Generar número de factura
  const invoiceNumber = `FAC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
  const currentDate = new Date().toLocaleDateString("es-ES")

  // Guardar como PDF
  const savePDF = () => {
    if (!receiptRef.current) {
      Swal.fire({
        title: "Error",
        text: "No se pudo generar el recibo para guardar como PDF",
        icon: "error",
        confirmButtonColor: "#0a2463",
      })
      return
    }

    // Usar la función de impresión del navegador para guardar como PDF
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      Swal.fire({
        title: "Error",
        text: "Por favor, permite las ventanas emergentes para guardar como PDF",
        icon: "warning",
        confirmButtonColor: "#0a2463",
      })
      return
    }

    // Crear contenido HTML para la impresión/PDF
    printWindow.document.write(`
  <html>
    <head>
      <title>Factura-${invoiceNumber}.pdf</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .invoice-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        th { font-weight: bold; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .summary { margin-left: auto; width: 50%; }
        .total-row { font-weight: bold; border-top: 1px solid #000; }
        .footer { text-align: center; font-size: 12px; margin-top: 30px; }
        @media print {
          body { -webkit-print-color-adjust: exact; }
        }
      </style>
      <script>
        function onLoad() {
          setTimeout(() => {
            window.print();
            window.onafterprint = () => window.close();
          }, 1000);
        }
      </script>
    </head>
    <body onload="onLoad()">
      ${receiptRef.current.innerHTML}
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>Para guardar como PDF, seleccione "Guardar como PDF" en las opciones de impresión</p>
      </div>
    </body>
  </html>
`)

    printWindow.document.close()
  }

  // Reiniciar venta
  const resetSale = () => {
    // Confirmar antes de cancelar la venta
    if (cart.length > 0) {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Desea cancelar la venta? Se perderán todos los datos.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#0a2463",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, cancelar venta",
        cancelButtonText: "No, mantener venta",
      }).then((result) => {
        if (result.isConfirmed) {
          // Reiniciar todos los estados
          setCart([])
          setCustomer({
            id: "",
            firstName: "",
            lastName: "",
            address: "",
            email: "",
            phone: "",
          })
          setPaymentMethod("cash")
          setNote("")
          setDiscount(0)
          setAmountReceived("")
          setSaleCompleted(false)
          setShowPaymentDialog(false)
          setShowReceiptDialog(false)

          Swal.fire({
            title: "Venta cancelada",
            text: "La venta ha sido cancelada correctamente",
            icon: "success",
            confirmButtonColor: "#0a2463",
          })
        }
      })
    } else {
      // Si no hay productos en el carrito, simplemente reiniciar
      setCart([])
      setCustomer({
        id: "",
        firstName: "",
        lastName: "",
        address: "",
        email: "",
        phone: "",
      })
      setPaymentMethod("cash")
      setNote("")
      setDiscount(0)
      setAmountReceived("")
      setSaleCompleted(false)
      setShowPaymentDialog(false)
      setShowReceiptDialog(false)
    }
  }

  // Buscar cliente por ID
  const searchCustomer = () => {
    if (!customer.id.trim()) {
      Swal.fire({
        title: "Error",
        text: "Por favor, ingrese una identificación para buscar",
        icon: "error",
        confirmButtonColor: "#0a2463",
      })
      return
    }

    // Buscar en los clientes de ejemplo
    const foundCustomer = sampleCustomers.find((c) => c.id === customer.id)

    if (foundCustomer) {
      // Cliente encontrado - cargar datos automáticamente sin confirmación
      setCustomer(foundCustomer)

      // Mostrar una notificación pequeña y temporal
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      })

      Toast.fire({
        icon: "success",
        title: "Cliente encontrado",
      })
    } else {
      // Cliente no encontrado - dar opción de crear nuevo o continuar
      Swal.fire({
        title: "Cliente no encontrado",
        text: "Este cliente no existe en la base de datos",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#0a2463",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Crear nuevo cliente",
        cancelButtonText: "Continuar sin crear",
      }).then((result) => {
        if (result.isConfirmed) {
          // Guardar datos actuales en localStorage para no perderlos
          localStorage.setItem(
            "pendingSale",
            JSON.stringify({
              cart,
              customer,
              paymentMethod,
              note,
              discount,
              tax,
            }),
          )

          // Redirigir a la página de nuevo cliente
          window.location.href = `/dashboard/customers/new?id=${customer.id}`
        }
      })
    }
  }

  // Validar venta antes de mostrar diálogo de pago
  const validateAndShowPaymentDialog = () => {
    if (cart.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Debe añadir al menos un producto al carrito",
        icon: "error",
        confirmButtonColor: "#0a2463",
      })
      return
    }

    if (!customer.id.trim()) {
      Swal.fire({
        title: "Error",
        text: "Debe ingresar la identificación del cliente para continuar",
        icon: "error",
        confirmButtonColor: "#0a2463",
      })
      return
    }

    setShowPaymentDialog(true)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/pos">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Nueva Venta</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetSale}>
            <Trash className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button
            size="sm"
            className="bg-[#0a2463] hover:bg-[#0a2463]/90"
            onClick={validateAndShowPaymentDialog}
            disabled={cart.length === 0}
          >
            <Save className="mr-2 h-4 w-4" />
            Finalizar Venta
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Columna izquierda - Productos y Carrito */}
        <div className="md:col-span-2 space-y-4">
          {/* Búsqueda de productos */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Productos</CardTitle>
              <CardDescription>Selecciona los productos para esta venta</CardDescription>
              <div className="flex flex-col md:flex-row gap-4 mt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar productos por nombre, código o SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
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
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm">{product.name}</CardTitle>
                      <CardDescription className="text-xs">{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 pb-2">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">{product.category}</Badge>
                        <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
                      </div>
                      <div className="mt-1 text-xs text-slate-500 flex justify-between">
                        <span>Código: {product.code}</span>
                        <span>
                          Stock:{" "}
                          <span className={product.stock < 10 ? "text-amber-600 font-medium" : ""}>
                            {product.stock}
                          </span>
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-2 bg-slate-50">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Añadir
                      </Button>
                    </CardFooter>
                  </Card>
                ))}

                {filteredProducts.length === 0 && (
                  <div className="col-span-full text-center py-8 text-slate-500">
                    <Package2 className="h-8 w-8 mx-auto mb-2" />
                    <p>No se encontraron productos. Intenta con una búsqueda diferente.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Carrito */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Carrito</CardTitle>
              <CardDescription>Productos seleccionados para esta venta</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {cart.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Producto</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead className="text-center">Cant.</TableHead>
                        <TableHead className="text-right">Precio Unit.</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.code}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-sm text-slate-600">{item.description}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <MinusCircle className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <PlusCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-medium">${item.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <ShoppingBag className="h-8 w-8 mx-auto mb-2" />
                  <p>El carrito está vacío</p>
                  <p className="text-xs mt-1">Añade productos desde la lista de arriba</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha - Datos del cliente y resumen */}
        <div className="space-y-4">
          {/* Datos del cliente */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Datos del Cliente</CardTitle>
              <CardDescription>Información para la factura fiscal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customer-id">Identificación / RUC</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="customer-id"
                    placeholder="Cédula, RUC o Pasaporte"
                    value={customer.id}
                    onChange={(e) => setCustomer({ ...customer, id: e.target.value })}
                  />
                  <Button variant="outline" size="icon" onClick={searchCustomer} title="Buscar cliente">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer-first-name">Nombre</Label>
                  <Input
                    id="customer-first-name"
                    placeholder="Nombre"
                    value={customer.firstName}
                    onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="customer-last-name">Apellido</Label>
                  <Input
                    id="customer-last-name"
                    placeholder="Apellido"
                    value={customer.lastName}
                    onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="customer-address">Dirección</Label>
                <Textarea
                  id="customer-address"
                  placeholder="Dirección completa"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className="mt-1"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer-email">Correo (opcional)</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="customer-phone">Teléfono (opcional)</Label>
                  <Input
                    id="customer-phone"
                    placeholder="Número de teléfono"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumen */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Descuento (%):</span>
                  <div className="flex items-center w-20">
                    <Input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number.parseFloat(e.target.value) || 0)}
                      className="h-8 text-right"
                      min="0"
                      max="100"
                    />
                    <span className="ml-1">%</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Monto descuento:</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Impuesto (%):</span>
                  <div className="flex items-center w-20">
                    <Input
                      type="number"
                      value={tax}
                      onChange={(e) => setTax(Number.parseFloat(e.target.value) || 0)}
                      className="h-8 text-right"
                      min="0"
                      max="100"
                    />
                    <span className="ml-1">%</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Monto impuesto:</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="pt-2 mt-2 border-t flex justify-between">
                  <span className="font-medium">Total:</span>
                  <span className="text-lg font-bold">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t">
                <div>
                  <Label htmlFor="payment-method">Método de Pago</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger id="payment-method" className="mt-1">
                      <SelectValue placeholder="Seleccionar método de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Efectivo</SelectItem>
                      <SelectItem value="card">Tarjeta</SelectItem>
                      <SelectItem value="crypto">Crypto (KII)</SelectItem>
                      <SelectItem value="transfer">Transferencia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sale-note">Nota (opcional)</Label>
                  <Textarea
                    id="sale-note"
                    placeholder="Añadir nota a esta venta"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#0a2463] hover:bg-[#0a2463]/90"
                onClick={validateAndShowPaymentDialog}
                disabled={cart.length === 0}
              >
                <Save className="mr-2 h-4 w-4" />
                Finalizar Venta
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Diálogo de pago */}
      {showPaymentDialog && (
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Finalizar Venta</DialogTitle>
              <DialogDescription>Completa la información de pago para finalizar la venta.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Total a pagar:</span>
                  <span className="text-lg font-bold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Método de pago:</span>
                  <span>
                    {paymentMethod === "cash"
                      ? "Efectivo"
                      : paymentMethod === "card"
                        ? "Tarjeta"
                        : paymentMethod === "crypto"
                          ? "Crypto (KII)"
                          : "Transferencia"}
                  </span>
                </div>
              </div>

              {paymentMethod === "cash" && (
                <div className="space-y-2">
                  <Label htmlFor="amount-received">Monto recibido</Label>
                  <Input
                    id="amount-received"
                    type="number"
                    placeholder="0.00"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                  />
                  {Number.parseFloat(amountReceived) >= total && (
                    <div className="flex justify-between pt-2">
                      <span className="text-sm font-medium">Cambio:</span>
                      <span className="font-bold">${calculateChange().toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === "crypto" && (
                <div className="space-y-2 text-center">
                  <div className="p-4 bg-slate-100 rounded-md">
                    <Wallet className="h-8 w-8 mx-auto mb-2 text-[#0a2463]" />
                    <p className="text-sm font-medium">
                      Escanea el código QR o envía el pago a la siguiente dirección:
                    </p>
                    <p className="mt-2 p-2 bg-white rounded border text-xs font-mono break-all">
                      0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="space-y-2 text-center">
                  <div className="p-4 bg-slate-100 rounded-md">
                    <CreditCard className="h-8 w-8 mx-auto mb-2 text-[#0a2463]" />
                    <p className="text-sm font-medium">Procesa el pago con tarjeta en el terminal.</p>
                    <p className="text-xs text-slate-500 mt-1">Confirma cuando la transacción haya sido aprobada.</p>
                  </div>
                </div>
              )}

              {paymentMethod === "transfer" && (
                <div className="space-y-2 text-center">
                  <div className="p-4 bg-slate-100 rounded-md">
                    <DollarSign className="h-8 w-8 mx-auto mb-2 text-[#0a2463]" />
                    <p className="text-sm font-medium">Datos para transferencia:</p>
                    <div className="mt-2 text-left text-xs space-y-1">
                      <p>
                        <span className="font-medium">Banco:</span> Banco Nacional
                      </p>
                      <p>
                        <span className="font-medium">Titular:</span> Kiipay S.A.
                      </p>
                      <p>
                        <span className="font-medium">Cuenta:</span> 1234-5678-9012-3456
                      </p>
                      <p>
                        <span className="font-medium">Referencia:</span> {`VENTA-${Date.now().toString().slice(-6)}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={completeSale} className="bg-[#0a2463] hover:bg-[#0a2463]/90">
                {saleCompleted ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Completado
                  </>
                ) : (
                  <>
                    <Receipt className="mr-2 h-4 w-4" />
                    Completar Venta
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Diálogo de recibo/factura */}
      {showReceiptDialog && (
        <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
          <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Factura Generada</DialogTitle>
            </DialogHeader>

            <div ref={receiptRef} className="p-4 border rounded-md bg-white">
              {/* Cabecera de la factura */}
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold">KIIPAY S.A.</h2>
                <p className="text-sm">Av. Principal #123, Ciudad</p>
                <p className="text-sm">RUC: 1234567890001</p>
                <p className="text-sm">Tel: (123) 456-7890</p>
              </div>

              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="font-bold">CLIENTE</h3>
                  <p className="text-sm">
                    {customer.firstName} {customer.lastName}
                  </p>
                  <p className="text-sm">{customer.id || "Consumidor Final"}</p>
                  <p className="text-sm">{customer.address || "---"}</p>
                  {customer.phone && <p className="text-sm">Tel: {customer.phone}</p>}
                  {customer.email && <p className="text-sm">Email: {customer.email}</p>}
                </div>
                <div className="text-right">
                  <h3 className="font-bold">FACTURA</h3>
                  <p className="text-sm">No. {invoiceNumber}</p>
                  <p className="text-sm">Fecha: {currentDate}</p>
                  <p className="text-sm">
                    Forma de pago:{" "}
                    {paymentMethod === "cash"
                      ? "Efectivo"
                      : paymentMethod === "card"
                        ? "Tarjeta"
                        : paymentMethod === "crypto"
                          ? "Crypto (KII)"
                          : "Transferencia"}
                  </p>
                </div>
              </div>

              {/* Detalle de productos */}
              <table className="w-full mb-4 text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2">Código</th>
                    <th className="text-left py-2">Descripción</th>
                    <th className="text-center py-2">Cant.</th>
                    <th className="text-right py-2">Precio Unit.</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2">{item.code}</td>
                      <td className="py-2">{item.name}</td>
                      <td className="text-center py-2">{item.quantity}</td>
                      <td className="text-right py-2">${item.price.toFixed(2)}</td>
                      <td className="text-right py-2">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Resumen */}
              <div className="flex justify-end">
                <div className="w-1/2">
                  <div className="flex justify-between py-1">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between py-1">
                      <span>Descuento ({discount}%):</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1">
                    <span>IVA ({tax}%):</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 font-bold border-t mt-1 pt-1">
                    <span>TOTAL:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="text-xs mt-2">
                    <p>
                      Forma de pago:{" "}
                      {paymentMethod === "cash"
                        ? "Efectivo"
                        : paymentMethod === "card"
                          ? "Tarjeta"
                          : paymentMethod === "crypto"
                            ? "Crypto (KII)"
                            : "Transferencia"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pie de factura */}
              <div className="mt-8 text-center text-xs">
                <p>¡Gracias por su compra!</p>
                <p>Este documento es un comprobante válido para fines fiscales</p>
                <p>www.kiipay.com</p>
              </div>
            </div>

            <DialogFooter className="flex justify-between mt-4">
              <div className="flex gap-2">
                <Button variant="outline" onClick={printReceipt}>
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir
                </Button>
                <Button variant="outline" onClick={savePDF}>
                  <FileText className="mr-2 h-4 w-4" />
                  Guardar PDF
                </Button>
              </div>
              <Button onClick={resetSale} className="bg-[#0a2463] hover:bg-[#0a2463]/90">
                Nueva Venta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
