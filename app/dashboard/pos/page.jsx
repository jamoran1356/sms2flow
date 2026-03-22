"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BarChart3,
  Clock,
  DollarSign,
  Package2,
  Plus,
  Receipt,
  Search,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Truck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function POSPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Datos de ejemplo para ventas recientes
  const recentSales = [
    {
      id: "INV-001",
      customer: "María Rodríguez",
      date: "Hoy, 14:30",
      amount: "$125.00",
      items: 3,
      status: "completed",
      paymentMethod: "Crypto (KII)",
    },
    {
      id: "INV-002",
      customer: "Carlos Gómez",
      date: "Hoy, 12:15",
      amount: "$78.50",
      items: 2,
      status: "completed",
      paymentMethod: "Efectivo",
    },
    {
      id: "INV-003",
      customer: "Ana Martínez",
      date: "Hoy, 10:45",
      amount: "$210.75",
      items: 5,
      status: "pending",
      paymentMethod: "Tarjeta",
    },
    {
      id: "INV-004",
      customer: "Javier López",
      date: "Ayer, 16:20",
      amount: "$45.25",
      items: 1,
      status: "completed",
      paymentMethod: "Crypto (KII)",
    },
  ]

  // Datos de ejemplo para productos populares
  const popularProducts = [
    {
      id: "PROD-001",
      name: "Camiseta Premium",
      category: "Ropa",
      price: "$29.99",
      stock: 45,
      sold: 120,
    },
    {
      id: "PROD-002",
      name: "Auriculares Bluetooth",
      category: "Electrónica",
      price: "$89.99",
      stock: 18,
      sold: 75,
    },
    {
      id: "PROD-003",
      name: "Taza Personalizada",
      category: "Hogar",
      price: "$14.99",
      stock: 32,
      sold: 68,
    },
  ]

  // Datos de ejemplo para pedidos pendientes
  const pendingOrders = [
    {
      id: "ORD-001",
      customer: "Elena Gutiérrez",
      date: "Hoy, 09:30",
      amount: "$145.00",
      items: 4,
      status: "processing",
    },
    {
      id: "ORD-002",
      customer: "Miguel Fernández",
      date: "Ayer, 18:15",
      amount: "$67.50",
      items: 2,
      status: "shipped",
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Punto de Venta</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Historial
          </Button>
          <Button size="sm" className="bg-[#0a2463] hover:bg-[#0a2463]/90" asChild>
            <Link href="/dashboard/pos/new-sale">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Nueva Venta
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,234.56</div>
            <p className="text-xs text-muted-foreground">+15.3% desde ayer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transacciones</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+8 desde ayer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Vendidos</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-muted-foreground">+12 desde ayer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventario Bajo</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Productos por reponer</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Ventas Recientes</CardTitle>
              <CardDescription>Últimas transacciones realizadas en tu punto de venta</CardDescription>
            </div>
            <Link href="/dashboard/pos/sales">
              <Button variant="outline" size="sm">
                Ver Todas
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Método</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/pos/sales/${sale.id}`} className="hover:underline">
                        {sale.id}
                      </Link>
                    </TableCell>
                    <TableCell>{sale.customer}</TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>{sale.amount}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${
                          sale.status === "completed"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        }`}
                      >
                        {sale.status === "completed" ? "Completada" : "Pendiente"}
                      </Badge>
                    </TableCell>
                    <TableCell>{sale.paymentMethod}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Accede rápidamente a las funciones más utilizadas</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button className="w-full justify-start bg-[#0a2463] hover:bg-[#0a2463]/90" asChild>
              <Link href="/dashboard/pos/new-sale">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Nueva Venta
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/pos/inventory">
                <Plus className="mr-2 h-5 w-5" />
                Añadir Producto
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/pos/inventory">
                <Package2 className="mr-2 h-5 w-5" />
                Gestionar Inventario
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/pos/reports">
                <BarChart3 className="mr-2 h-5 w-5" />
                Ver Informes
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Productos Populares</TabsTrigger>
          <TabsTrigger value="orders">Pedidos Pendientes</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Productos Más Vendidos</CardTitle>
                <CardDescription>Los productos con mayor rotación en tu inventario</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Vendidos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {popularProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <Link href={`/dashboard/pos/inventory/${product.id}`} className="hover:underline">
                          {product.id}
                        </Link>
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>
                        <span className={product.stock < 20 ? "text-amber-600 font-medium" : ""}>{product.stock}</span>
                      </TableCell>
                      <TableCell>{product.sold}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-slate-500">Mostrando 3 de 120 productos</div>
              <Link href="/dashboard/pos/inventory">
                <Button variant="outline" size="sm">
                  Ver Inventario Completo
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Pendientes</CardTitle>
              <CardDescription>Pedidos que requieren procesamiento o envío</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Artículos</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.amount}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            order.status === "processing"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                              : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          }`}
                        >
                          {order.status === "processing" ? "Procesando" : "Enviado"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto" asChild>
                <Link href="/dashboard/pos/providers">
                  <Truck className="mr-2 h-4 w-4" />
                  Gestionar Pedidos
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
