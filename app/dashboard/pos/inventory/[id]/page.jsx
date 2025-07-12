"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, BarChart3, Edit, Package2, Printer, ShoppingBag, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"

// Datos de ejemplo para el producto
const productData = {
  id: "PROD-001",
  name: "Camiseta Premium",
  sku: "RP-TS-001",
  description: "Camiseta de algodón 100% de alta calidad con diseño exclusivo. Disponible en varios colores y tallas.",
  category: "Ropa",
  price: 29.99,
  cost: 12.5,
  stock: 45,
  alertThreshold: 10,
  barcode: "7890123456789",
  weight: "0.25",
  dimensions: {
    length: "30",
    width: "20",
    height: "2",
  },
  active: true,
  featured: true,
  taxable: true,
  taxRate: 16,
  createdAt: "10/04/2023",
  updatedAt: "12/05/2023",
  images: [
    {
      id: "img-001",
      url: "/placeholder.svg?height=300&width=300",
      main: true,
    },
    {
      id: "img-002",
      url: "/placeholder.svg?height=300&width=300",
      main: false,
    },
  ],
  variants: [
    {
      id: "var-001",
      name: "Rojo - M",
      sku: "RP-TS-001-RM",
      price: 29.99,
      stock: 15,
    },
    {
      id: "var-002",
      name: "Rojo - L",
      sku: "RP-TS-001-RL",
      price: 29.99,
      stock: 12,
    },
    {
      id: "var-003",
      name: "Azul - M",
      sku: "RP-TS-001-AM",
      price: 29.99,
      stock: 10,
    },
    {
      id: "var-004",
      name: "Azul - L",
      sku: "RP-TS-001-AL",
      price: 29.99,
      stock: 8,
    },
  ],
}

// Datos de ejemplo para el historial de movimientos
const movementHistory = [
  {
    id: "MOV-001",
    date: "12/05/2023",
    type: "sale",
    quantity: -2,
    reference: "Venta #INV-001",
    user: "Juan Pérez",
  },
  {
    id: "MOV-002",
    date: "10/05/2023",
    type: "purchase",
    quantity: 10,
    reference: "Compra #PO-002",
    user: "Ana López",
  },
  {
    id: "MOV-003",
    date: "05/05/2023",
    type: "adjustment",
    quantity: -1,
    reference: "Ajuste de inventario",
    user: "Juan Pérez",
  },
  {
    id: "MOV-004",
    date: "01/05/2023",
    type: "purchase",
    quantity: 20,
    reference: "Compra #PO-001",
    user: "Ana López",
  },
]

// Datos de ejemplo para las ventas
const salesData = [
  {
    id: "INV-001",
    date: "12/05/2023",
    customer: "María Rodríguez",
    quantity: 2,
    total: 59.98,
  },
  {
    id: "INV-004",
    date: "08/05/2023",
    customer: "Carlos Gómez",
    quantity: 1,
    total: 29.99,
  },
  {
    id: "INV-008",
    date: "02/05/2023",
    customer: "Ana Martínez",
    quantity: 3,
    total: 89.97,
  },
]

export default function ProductDetailsPage({ params }) {
  const [product] = useState(productData)

  // En una implementación real, se cargarían los datos del producto usando el ID de los parámetros
  // const { id } = params
  // useEffect(() => { fetchProductData(id) }, [id])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/pos/inventory">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Detalles del Producto</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button size="sm" className="bg-[#0a2463] hover:bg-[#0a2463]/90" asChild>
            <Link href={`/dashboard/pos/inventory/edit/${product.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Columna izquierda - Imágenes */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="aspect-square rounded-md overflow-hidden border">
                <img
                  src={product.images[0].url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {product.images.map((image) => (
                    <div
                      key={image.id}
                      className={`aspect-square rounded-md overflow-hidden border ${image.main ? "ring-2 ring-[#0a2463]" : ""}`}
                    >
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Información Rápida</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Estado:</span>
                <Badge
                  className={`${
                    product.active
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-slate-100 text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  {product.active ? "Activo" : "Inactivo"}
                </Badge>
              </div>

              <div className="flex justify-between">
                <span className="text-sm font-medium">Inventario:</span>
                <Badge
                  className={`${
                    product.stock === 0
                      ? "bg-red-100 text-red-800 hover:bg-red-100"
                      : product.stock <= product.alertThreshold
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                        : "bg-green-100 text-green-800 hover:bg-green-100"
                  }`}
                >
                  {product.stock === 0
                    ? "Sin Stock"
                    : product.stock <= product.alertThreshold
                      ? "Stock Bajo"
                      : "En Stock"}
                </Badge>
              </div>

              <div className="flex justify-between">
                <span className="text-sm font-medium">Destacado:</span>
                <span>{product.featured ? "Sí" : "No"}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm font-medium">Creado:</span>
                <span>{product.createdAt}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm font-medium">Actualizado:</span>
                <span>{product.updatedAt}</span>
              </div>

              <Separator className="my-2" />

              <div className="flex justify-between">
                <span className="text-sm font-medium">Margen:</span>
                <span className="font-bold text-green-600">
                  {(((product.price - product.cost) / product.price) * 100).toFixed(2)}%
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm font-medium">Ganancia:</span>
                <span className="font-bold">${(product.price - product.cost).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha - Detalles */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>
                <span className="font-medium">SKU:</span> {product.sku} |{" "}
                <span className="font-medium">Categoría:</span> {product.category}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Descripción</h3>
                  <p className="text-sm text-slate-600">{product.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Precio de Venta:</span>
                    <span className="font-bold">${product.price.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Costo:</span>
                    <span>${product.cost.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Stock Actual:</span>
                    <span className={product.stock <= product.alertThreshold ? "text-amber-600 font-medium" : ""}>
                      {product.stock} unidades
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Umbral de Alerta:</span>
                    <span>{product.alertThreshold} unidades</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Código de Barras:</span>
                    <span>{product.barcode || "No disponible"}</span>
                  </div>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Dimensiones</h3>
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span>Largo:</span>
                      <span>{product.dimensions.length} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ancho:</span>
                      <span>{product.dimensions.width} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Alto:</span>
                      <span>{product.dimensions.height} cm</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Peso</h3>
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span>Peso:</span>
                      <span>{product.weight} kg</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Impuestos</h3>
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span>Aplicar Impuestos:</span>
                      <span>{product.taxable ? "Sí" : "No"}</span>
                    </div>
                    {product.taxable && (
                      <div className="flex justify-between">
                        <span>Tasa de Impuesto:</span>
                        <span>{product.taxRate}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="variants" className="space-y-4">
            <TabsList>
              <TabsTrigger value="variants">Variantes</TabsTrigger>
              <TabsTrigger value="movements">Movimientos</TabsTrigger>
              <TabsTrigger value="sales">Ventas</TabsTrigger>
            </TabsList>

            <TabsContent value="variants" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Variantes del Producto</CardTitle>
                  <CardDescription>Diferentes opciones disponibles para este producto</CardDescription>
                </CardHeader>
                <CardContent>
                  {product.variants && product.variants.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Variante</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Estado</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {product.variants.map((variant) => (
                            <TableRow key={variant.id}>
                              <TableCell className="font-medium">{variant.name}</TableCell>
                              <TableCell>{variant.sku}</TableCell>
                              <TableCell>${variant.price.toFixed(2)}</TableCell>
                              <TableCell>
                                <span
                                  className={
                                    variant.stock <= product.alertThreshold ? "text-amber-600 font-medium" : ""
                                  }
                                >
                                  {variant.stock}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={`${
                                    variant.stock === 0
                                      ? "bg-red-100 text-red-800 hover:bg-red-100"
                                      : variant.stock <= product.alertThreshold
                                        ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                        : "bg-green-100 text-green-800 hover:bg-green-100"
                                  }`}
                                >
                                  {variant.stock === 0
                                    ? "Sin Stock"
                                    : variant.stock <= product.alertThreshold
                                      ? "Stock Bajo"
                                      : "En Stock"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Package2 className="h-8 w-8 mx-auto mb-2" />
                      <p>No hay variantes para este producto</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="movements" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Historial de Movimientos</CardTitle>
                  <CardDescription>Registro de entradas y salidas de inventario</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Cantidad</TableHead>
                          <TableHead>Referencia</TableHead>
                          <TableHead>Usuario</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {movementHistory.map((movement) => (
                          <TableRow key={movement.id}>
                            <TableCell>{movement.date}</TableCell>
                            <TableCell>
                              <Badge
                                className={`${
                                  movement.type === "sale"
                                    ? "bg-red-100 text-red-800 hover:bg-red-100"
                                    : movement.type === "purchase"
                                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                                      : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                }`}
                              >
                                {movement.type === "sale"
                                  ? "Venta"
                                  : movement.type === "purchase"
                                    ? "Compra"
                                    : "Ajuste"}
                              </Badge>
                            </TableCell>
                            <TableCell className={movement.quantity < 0 ? "text-red-600" : "text-green-600"}>
                              {movement.quantity > 0 ? `+${movement.quantity}` : movement.quantity}
                            </TableCell>
                            <TableCell>{movement.reference}</TableCell>
                            <TableCell>{movement.user}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="ml-auto">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Ver Informe Completo
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="sales" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Historial de Ventas</CardTitle>
                  <CardDescription>Ventas que incluyen este producto</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID Venta</TableHead>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Cantidad</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {salesData.map((sale) => (
                          <TableRow key={sale.id}>
                            <TableCell className="font-medium">{sale.id}</TableCell>
                            <TableCell>{sale.date}</TableCell>
                            <TableCell>{sale.customer}</TableCell>
                            <TableCell>{sale.quantity}</TableCell>
                            <TableCell>${sale.total.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="ml-auto">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Ver Todas las Ventas
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard/pos/inventory">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Inventario
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">
            <Truck className="mr-2 h-4 w-4" />
            Ordenar Más
          </Button>
          <Button className="bg-[#0a2463] hover:bg-[#0a2463]/90" asChild>
            <Link href={`/dashboard/pos/inventory/edit/${product.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Producto
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
