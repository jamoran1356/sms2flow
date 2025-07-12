"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, CreditCard, Download, Edit, Printer, Receipt, ShoppingBag, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Datos de ejemplo para la venta
const saleData = {
  id: "INV-001",
  date: "12/05/2023",
  time: "14:30",
  customer: {
    name: "María Rodríguez",
    email: "maria@example.com",
    phone: "+1 555-123-4567",
  },
  employee: "Juan Pérez",
  status: "completed",
  paymentMethod: "crypto",
  subtotal: 120.0,
  discount: 0,
  tax: 19.2,
  total: 139.2,
  note: "Cliente solicitó envolver para regalo",
  items: [
    {
      id: "PROD-001",
      name: "Camiseta Premium",
      sku: "RP-TS-001",
      quantity: 1,
      price: 29.99,
      total: 29.99,
    },
    {
      id: "PROD-003",
      name: "Taza Personalizada",
      sku: "HG-MG-003",
      quantity: 2,
      price: 14.99,
      total: 29.98,
    },
    {
      id: "PROD-004",
      name: "Libro - El Arte de la Guerra",
      sku: "BK-AW-004",
      quantity: 1,
      price: 24.99,
      total: 24.99,
    },
    {
      id: "PROD-006",
      name: "Zapatillas Deportivas",
      sku: "SH-SP-006",
      quantity: 1,
      price: 35.04,
      total: 35.04,
    },
  ],
}

export default function SaleDetailsPage({ params }) {
  const [sale] = useState(saleData)
  const [showRefundDialog, setShowRefundDialog] = useState(false)
  const [refundReason, setRefundReason] = useState("")
  const [refundProcessing, setRefundProcessing] = useState(false)

  // En una implementación real, se cargarían los datos de la venta usando el ID de los parámetros
  // const { id } = params
  // useEffect(() => { fetchSaleData(id) }, [id])

  // Procesar reembolso
  const processRefund = () => {
    setRefundProcessing(true)

    // Simular procesamiento
    setTimeout(() => {
      setRefundProcessing(false)
      setShowRefundDialog(false)
      // Aquí iría la lógica para actualizar el estado de la venta
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/pos/sales">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Detalles de Venta</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button size="sm" className="bg-[#0a2463] hover:bg-[#0a2463]/90" asChild>
            <Link href={`/dashboard/pos/sales/edit/${sale.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Columna izquierda - Información de la venta */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Venta #{sale.id}</CardTitle>
                  <CardDescription>
                    {sale.date} {sale.time}
                  </CardDescription>
                </div>
                <Badge
                  className={`${
                    sale.status === "completed"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : sale.status === "pending"
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        : sale.status === "refunded"
                          ? "bg-red-100 text-red-800 hover:bg-red-100"
                          : "bg-slate-100 text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  {sale.status === "completed"
                    ? "Completada"
                    : sale.status === "pending"
                      ? "Pendiente"
                      : sale.status === "refunded"
                        ? "Reembolsada"
                        : "Cancelada"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Cliente</h3>
                <div className="text-sm">
                  <p className="font-medium">{sale.customer.name}</p>
                  {sale.customer.email && <p className="text-slate-500">{sale.customer.email}</p>}
                  {sale.customer.phone && <p className="text-slate-500">{sale.customer.phone}</p>}
                </div>
              </div>

              <Separator className="my-2" />

              <div>
                <h3 className="text-sm font-medium mb-2">Detalles de Pago</h3>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Método:</span>
                    <span className="font-medium">
                      {sale.paymentMethod === "cash"
                        ? "Efectivo"
                        : sale.paymentMethod === "card"
                          ? "Tarjeta"
                          : sale.paymentMethod === "crypto"
                            ? "Crypto (KII)"
                            : "Transferencia"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Empleado:</span>
                    <span>{sale.employee}</span>
                  </div>
                </div>
              </div>

              {sale.note && (
                <>
                  <Separator className="my-2" />
                  <div>
                    <h3 className="text-sm font-medium mb-2">Nota</h3>
                    <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded-md">{sale.note}</p>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/dashboard/pos/new-sale?duplicate=${sale.id}`}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Nueva Venta Similar
                </Link>
              </Button>

              {sale.status === "completed" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-red-600 hover:text-red-600 hover:bg-red-50"
                  onClick={() => setShowRefundDialog(true)}
                >
                  <Receipt className="mr-2 h-4 w-4" />
                  Procesar Reembolso
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Columna derecha - Detalles de los productos */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Productos</CardTitle>
              <CardDescription>Artículos incluidos en esta venta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                      <TableHead className="text-right">Precio</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sale.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-slate-500">{item.sku}</div>
                        </TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal:</span>
                  <span>${sale.subtotal.toFixed(2)}</span>
                </div>

                {sale.discount > 0 && (
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Descuento:</span>
                    <span>-${sale.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm text-slate-500">
                  <span>Impuesto (16%):</span>
                  <span>${sale.tax.toFixed(2)}</span>
                </div>

                <Separator className="my-2" />

                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-lg">${sale.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/dashboard/pos/sales/receipt/${sale.id}`}>
                  <Printer className="mr-2 h-4 w-4" />
                  Ver Recibo
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard/pos/sales">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Ventas
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Ver Productos
          </Button>
          <Button className="bg-[#0a2463] hover:bg-[#0a2463]/90">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir Recibo
          </Button>
        </div>
      </div>

      {/* Diálogo de reembolso */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Procesar Reembolso</DialogTitle>
            <DialogDescription>Esta acción reembolsará el monto total de la venta al cliente.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Detalles de la Venta</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>ID:</span>
                  <span>{sale.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cliente:</span>
                  <span>{sale.customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fecha:</span>
                  <span>{sale.date}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Monto a Reembolsar:</span>
                  <span>${sale.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="refund-reason" className="text-sm font-medium">
                Motivo del Reembolso
              </label>
              <textarea
                id="refund-reason"
                className="w-full min-h-[80px] p-2 border rounded-md"
                placeholder="Ingresa el motivo del reembolso..."
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Método de Reembolso</h3>
              <div className="p-3 bg-slate-50 rounded-md flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-slate-500" />
                <div className="text-sm">
                  <p className="font-medium">Reembolsar al método de pago original</p>
                  <p className="text-slate-500">
                    {sale.paymentMethod === "cash"
                      ? "Efectivo"
                      : sale.paymentMethod === "card"
                        ? "Tarjeta"
                        : sale.paymentMethod === "crypto"
                          ? "Crypto (KII)"
                          : "Transferencia"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefundDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={processRefund} disabled={refundProcessing}>
              {refundProcessing ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Procesando...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Confirmar Reembolso
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
