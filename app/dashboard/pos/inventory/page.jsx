"use client"

import { useState } from "react"
import {
  AlertCircle,
  ArrowUpDown,
  Calculator,
  Download,
  Edit,
  FileText,
  Filter,
  MoreHorizontal,
  Package2,
  Plus,
  Search,
  Tag,
  Trash,
  Upload,
  ImageIcon,
  Globe,
  MessageSquare,
  ShoppingCart,
  Truck,
  Store,
  DownloadIcon,
  X,
  Save,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

// Datos de ejemplo para el inventario
const initialInventory = [
  {
    id: "PROD-001",
    name: "Camiseta Premium",
    category: "Ropa",
    price: 29.99,
    cost: 12.5,
    stock: 45,
    sku: "RP-TS-001",
    status: "active",
    lastUpdated: "12/05/2023",
    supplier: "Textiles Modernos S.A.",
    profit: 58.32, // Porcentaje de ganancia
    type: "physical",
    platforms: ["pdv", "web"],
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "PROD-002",
    name: "Auriculares Bluetooth",
    category: "Electrónica",
    price: 89.99,
    cost: 45.0,
    stock: 18,
    sku: "EL-HP-002",
    status: "active",
    lastUpdated: "10/05/2023",
    supplier: "TechImport Inc.",
    profit: 50.0,
    type: "physical",
    platforms: ["pdv", "web", "sms"],
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "PROD-003",
    name: "Taza Personalizada",
    category: "Hogar",
    price: 14.99,
    cost: 5.25,
    stock: 32,
    sku: "HG-MG-003",
    status: "active",
    lastUpdated: "08/05/2023",
    supplier: "Cerámica Artesanal",
    profit: 65.0,
    type: "physical",
    platforms: ["pdv"],
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "PROD-004",
    name: "Libro - El Arte de la Guerra",
    category: "Libros",
    price: 24.99,
    cost: 10.0,
    stock: 15,
    sku: "BK-AW-004",
    status: "active",
    lastUpdated: "05/05/2023",
    supplier: "Editorial Clásicos",
    profit: 60.0,
    type: "physical",
    platforms: ["pdv", "web"],
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "PROD-005",
    name: "Reloj Inteligente",
    category: "Electrónica",
    price: 129.99,
    cost: 65.0,
    stock: 8,
    sku: "EL-SW-005",
    status: "low_stock",
    lastUpdated: "03/05/2023",
    supplier: "TechImport Inc.",
    profit: 50.0,
    type: "physical",
    platforms: ["pdv", "web", "sms"],
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "PROD-006",
    name: "Zapatillas Deportivas",
    category: "Calzado",
    price: 79.99,
    cost: 35.0,
    stock: 22,
    sku: "SH-SP-006",
    status: "active",
    lastUpdated: "01/05/2023",
    supplier: "Deportes Élite",
    profit: 56.24,
    type: "physical",
    platforms: ["pdv", "web"],
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "PROD-007",
    name: "Bolso de Cuero",
    category: "Accesorios",
    price: 149.99,
    cost: 70.0,
    stock: 5,
    sku: "AC-LB-007",
    status: "low_stock",
    lastUpdated: "28/04/2023",
    supplier: "Cueros Finos",
    profit: 53.33,
    type: "physical",
    platforms: ["pdv", "web"],
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "PROD-008",
    name: "Cargador Inalámbrico",
    category: "Electrónica",
    price: 34.99,
    cost: 15.0,
    stock: 0,
    sku: "EL-WC-008",
    status: "out_of_stock",
    lastUpdated: "25/04/2023",
    supplier: "TechImport Inc.",
    profit: 57.13,
    type: "physical",
    platforms: ["pdv", "web"],
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "PROD-009",
    name: "Curso de Programación",
    category: "Educación",
    price: 199.99,
    cost: 50.0,
    stock: 999,
    sku: "DG-CR-009",
    status: "active",
    lastUpdated: "20/04/2023",
    supplier: "Academia Digital",
    profit: 75.0,
    type: "digital",
    platforms: ["web", "sms"],
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "PROD-010",
    name: "Servicio de Consultoría",
    category: "Servicios",
    price: 299.99,
    cost: 150.0,
    stock: 999,
    sku: "SV-CN-010",
    status: "active",
    lastUpdated: "15/04/2023",
    supplier: "Consultores Asociados",
    profit: 50.0,
    type: "service",
    platforms: ["web"],
    image: "/placeholder.svg?height=100&width=100",
  },
]

// Categorías disponibles
const categories = [
  "Todas",
  "Ropa",
  "Electrónica",
  "Hogar",
  "Libros",
  "Calzado",
  "Accesorios",
  "Educación",
  "Servicios",
]

// Proveedores disponibles
const suppliers = [
  "Textiles Modernos S.A.",
  "TechImport Inc.",
  "Cerámica Artesanal",
  "Editorial Clásicos",
  "Deportes Élite",
  "Cueros Finos",
  "Distribuidora General",
  "Importaciones Rápidas",
  "Academia Digital",
  "Consultores Asociados",
]

export default function InventoryPage() {
  const [inventory, setInventory] = useState(initialInventory)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("Todas")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    code: "",
    name: "",
    description: "",
    supplier: "",
    cost: "",
    price: "",
    profit: "30",
    publicPrice: "",
    category: "",
    stock: "0",
    type: "physical",
    platforms: ["pdv"],
    shippingOptions: {
      shipping: true,
      pickup: true,
      download: false,
    },
    image: null,
    imagePreview: null,
  })
  const [errors, setErrors] = useState({})
  const [activeTab, setActiveTab] = useState("basic")

  // Filtrar y ordenar inventario
  const filteredInventory = inventory
    .filter((item) => {
      // Filtro de búsqueda
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())

      // Filtro de categoría
      const matchesCategory = categoryFilter === "Todas" || item.category === categoryFilter

      // Filtro de estado
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "in_stock" && item.stock > 0) ||
        (statusFilter === "low_stock" && item.status === "low_stock") ||
        (statusFilter === "out_of_stock" && item.stock === 0)

      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      // Ordenamiento
      if (sortField === "name") {
        return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortField === "price") {
        return sortDirection === "asc" ? a.price - b.price : b.price - a.price
      } else if (sortField === "stock") {
        return sortDirection === "asc" ? a.stock - b.stock : b.stock - a.stock
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

  // Estadísticas de inventario
  const totalProducts = inventory.length
  const totalValue = inventory.reduce((sum, item) => sum + item.price * item.stock, 0)
  const lowStockItems = inventory.filter((item) => item.status === "low_stock").length
  const outOfStockItems = inventory.filter((item) => item.stock === 0).length

  // Manejar cambios en el formulario de nuevo producto
  const handleProductChange = (e) => {
    const { name, value } = e.target
    setNewProduct((prev) => {
      const updated = { ...prev, [name]: value }

      // Calcular precio de venta o porcentaje de ganancia automáticamente
      if (name === "cost" || name === "profit") {
        if (updated.cost && updated.profit) {
          const cost = Number.parseFloat(updated.cost)
          const profitPercent = Number.parseFloat(updated.profit)
          if (!isNaN(cost) && !isNaN(profitPercent)) {
            const calculatedPrice = cost * (1 + profitPercent / 100)
            updated.price = calculatedPrice.toFixed(2)
            updated.publicPrice = calculatedPrice.toFixed(2)
          }
        }
      } else if (name === "price") {
        if (updated.cost && updated.price) {
          const cost = Number.parseFloat(updated.cost)
          const price = Number.parseFloat(updated.price)
          if (!isNaN(cost) && !isNaN(price) && cost > 0) {
            const calculatedProfit = ((price - cost) / cost) * 100
            updated.profit = calculatedProfit.toFixed(2)
            updated.publicPrice = price.toFixed(2)
          }
        }
      }

      // Actualizar opciones de envío según el tipo de producto
      if (name === "type") {
        if (value === "physical") {
          updated.shippingOptions = {
            shipping: true,
            pickup: true,
            download: false,
          }
        } else if (value === "digital") {
          updated.shippingOptions = {
            shipping: false,
            pickup: false,
            download: true,
          }
        } else if (value === "service") {
          updated.shippingOptions = {
            shipping: false,
            pickup: false,
            download: false,
          }
        }
      }

      return updated
    })
  }

  // Manejar cambios en las plataformas
  const handlePlatformChange = (platform, checked) => {
    setNewProduct((prev) => {
      const updatedPlatforms = checked ? [...prev.platforms, platform] : prev.platforms.filter((p) => p !== platform)
      return { ...prev, platforms: updatedPlatforms }
    })
  }

  // Manejar cambios en las opciones de envío
  const handleShippingOptionChange = (option, checked) => {
    setNewProduct((prev) => ({
      ...prev,
      shippingOptions: {
        ...prev.shippingOptions,
        [option]: checked,
      },
    }))
  }

  // Manejar carga de imagen
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // En un entorno real, aquí subirías la imagen a un servidor
      // Para este ejemplo, simplemente creamos una URL local
      const imageUrl = URL.createObjectURL(file)
      setNewProduct((prev) => ({
        ...prev,
        image: file,
        imagePreview: imageUrl,
      }))
    }
  }

  // Simular carga de imagen (para el botón de ejemplo)
  const handleDemoImageUpload = () => {
    // Crear una imagen de ejemplo
    const randomId = Math.floor(Math.random() * 1000)
    const imageUrl = `/placeholder.svg?height=200&width=200&text=Producto+${randomId}`

    setNewProduct((prev) => ({
      ...prev,
      image: "demo-image.jpg",
      imagePreview: imageUrl,
    }))
  }

  // Eliminar imagen
  const removeImage = () => {
    setNewProduct((prev) => ({
      ...prev,
      image: null,
      imagePreview: null,
    }))
  }

  // Validar formulario de nuevo producto
  const validateProductForm = () => {
    const newErrors = {}

    if (!newProduct.code) newErrors.code = "El código es obligatorio"
    if (!newProduct.name) newErrors.name = "El nombre es obligatorio"
    if (!newProduct.supplier) newErrors.supplier = "El proveedor es obligatorio"
    if (!newProduct.cost) newErrors.cost = "El precio de compra es obligatorio"
    if (!newProduct.price) newErrors.price = "El precio de venta es obligatorio"
    if (!newProduct.category) newErrors.category = "La categoría es obligatoria"

    if (newProduct.cost && isNaN(Number.parseFloat(newProduct.cost)))
      newErrors.cost = "El precio de compra debe ser un número"

    if (newProduct.price && isNaN(Number.parseFloat(newProduct.price)))
      newErrors.price = "El precio de venta debe ser un número"

    if (newProduct.profit && isNaN(Number.parseFloat(newProduct.profit)))
      newErrors.profit = "El porcentaje de ganancia debe ser un número"

    if (newProduct.stock && isNaN(Number.parseInt(newProduct.stock)))
      newErrors.stock = "El stock debe ser un número entero"

    if (newProduct.platforms.length === 0) newErrors.platforms = "Debe seleccionar al menos una plataforma"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Guardar nuevo producto
  const handleSaveProduct = () => {
    if (!validateProductForm()) {
      // Si hay errores, mostrar el tab correspondiente
      if (errors.name || errors.code || errors.supplier || errors.category || errors.description) {
        setActiveTab("basic")
      } else if (errors.cost || errors.price || errors.profit || errors.stock) {
        setActiveTab("pricing")
      } else if (errors.platforms) {
        setActiveTab("platforms")
      }
      return
    }

    const newId = `PROD-${String(inventory.length + 1).padStart(3, "0")}`
    const newSku = `${newProduct.code.substring(0, 6).toUpperCase()}`

    const productToAdd = {
      id: newId,
      name: newProduct.name,
      category: newProduct.category,
      price: Number.parseFloat(newProduct.price),
      cost: Number.parseFloat(newProduct.cost),
      stock: Number.parseInt(newProduct.stock),
      sku: newSku,
      status:
        Number.parseInt(newProduct.stock) === 0
          ? "out_of_stock"
          : Number.parseInt(newProduct.stock) <= 10
            ? "low_stock"
            : "active",
      lastUpdated: new Date().toLocaleDateString(),
      supplier: newProduct.supplier,
      profit: Number.parseFloat(newProduct.profit),
      description: newProduct.description,
      type: newProduct.type,
      platforms: newProduct.platforms,
      shippingOptions: newProduct.shippingOptions,
      image: newProduct.imagePreview || "/placeholder.svg?height=100&width=100",
    }

    setInventory([...inventory, productToAdd])
    setNewProduct({
      code: "",
      name: "",
      description: "",
      supplier: "",
      cost: "",
      price: "",
      profit: "30",
      publicPrice: "",
      category: "",
      stock: "0",
      type: "physical",
      platforms: ["pdv"],
      shippingOptions: {
        shipping: true,
        pickup: true,
        download: false,
      },
      image: null,
      imagePreview: null,
    })
    setIsAddProductOpen(false)
    setActiveTab("basic")
  }

  // Función para renderizar el badge de tipo de producto
  const renderProductTypeBadge = (type) => {
    switch (type) {
      case "physical":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Físico</Badge>
      case "digital":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Digital</Badge>
      case "service":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Servicio</Badge>
      default:
        return <Badge>Desconocido</Badge>
    }
  }

  // Función para renderizar los iconos de plataforma
  const renderPlatformIcons = (platforms) => {
    return (
      <div className="flex space-x-1">
        {platforms.includes("pdv") && (
          <span title="Punto de Venta">
            <ShoppingCart className="h-4 w-4 text-slate-500" />
          </span>
        )}
        {platforms.includes("web") && (
          <span title="Tienda Web">
            <Globe className="h-4 w-4 text-slate-500" />
          </span>
        )}
        {platforms.includes("sms") && (
          <span title="Pagos SMS">
            <MessageSquare className="h-4 w-4 text-slate-500" />
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Inventario</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Importar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importar Inventario</DialogTitle>
                <DialogDescription>
                  Sube un archivo CSV o Excel con tu inventario para importarlo al sistema.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                  <p className="text-sm font-medium mb-1">Arrastra y suelta tu archivo aquí</p>
                  <p className="text-xs text-slate-500 mb-4">Soporta archivos CSV, XLS y XLSX</p>
                  <Button variant="outline" size="sm">
                    Seleccionar Archivo
                  </Button>
                </div>
                <div className="text-xs text-slate-500">
                  <p className="font-medium mb-1">El archivo debe contener las siguientes columnas:</p>
                  <p>Nombre, Categoría, Precio, Costo, Stock, SKU</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button>Importar Inventario</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-[#0a2463] hover:bg-[#0a2463]/90">
                <Plus className="mr-2 h-4 w-4" />
                Añadir Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Añadir Nuevo Producto</DialogTitle>
                <DialogDescription>
                  Ingresa la información del producto para añadirlo al inventario y configurar en qué plataformas estará
                  disponible.
                </DialogDescription>
              </DialogHeader>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="basic">Información Básica</TabsTrigger>
                  <TabsTrigger value="pricing">Precios e Inventario</TabsTrigger>
                  <TabsTrigger value="platforms">Plataformas y Envío</TabsTrigger>
                  <TabsTrigger value="images">Imágenes</TabsTrigger>
                </TabsList>

                {/* Pestaña de Información Básica */}
                <TabsContent value="basic" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="code">
                        Código <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="code"
                        name="code"
                        placeholder="Ej: PRD001"
                        value={newProduct.code}
                        onChange={handleProductChange}
                        className={errors.code ? "border-red-500" : ""}
                      />
                      {errors.code && <p className="text-xs text-red-500">{errors.code}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Nombre <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Ej: Camiseta Premium"
                        value={newProduct.name}
                        onChange={handleProductChange}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">
                        Categoría <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                      >
                        <SelectTrigger id="category" className={errors.category ? "border-red-500" : ""}>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories
                            .filter((cat) => cat !== "Todas")
                            .map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplier">
                        Proveedor <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={newProduct.supplier}
                        onValueChange={(value) => setNewProduct({ ...newProduct, supplier: value })}
                      >
                        <SelectTrigger id="supplier" className={errors.supplier ? "border-red-500" : ""}>
                          <SelectValue placeholder="Seleccionar proveedor" />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliers.map((supplier) => (
                            <SelectItem key={supplier} value={supplier}>
                              {supplier}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.supplier && <p className="text-xs text-red-500">{errors.supplier}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe el producto..."
                      value={newProduct.description}
                      onChange={handleProductChange}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productType">
                      Tipo de Producto <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      value={newProduct.type}
                      onValueChange={(value) => handleProductChange({ target: { name: "type", value } })}
                      className="grid grid-cols-2 gap-2"
                    >
                      <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-slate-50">
                        <RadioGroupItem value="physical" id="physical" />
                        <Label htmlFor="physical" className="flex items-center cursor-pointer">
                          <Package2 className="mr-2 h-4 w-4 text-blue-600" />
                          Producto Físico
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-slate-50">
                        <RadioGroupItem value="digital" id="digital" />
                        <Label htmlFor="digital" className="flex items-center cursor-pointer">
                          <DownloadIcon className="mr-2 h-4 w-4 text-purple-600" />
                          Producto Digital
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-slate-50">
                        <RadioGroupItem value="service" id="service" />
                        <Label htmlFor="service" className="flex items-center cursor-pointer">
                          <Tag className="mr-2 h-4 w-4 text-green-600" />
                          Servicio
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-slate-50">
                        <RadioGroupItem value="subscription" id="subscription" />
                        <Label htmlFor="subscription" className="flex items-center cursor-pointer">
                          <Calculator className="mr-2 h-4 w-4 text-amber-600" />
                          Suscripción
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </TabsContent>

                {/* Pestaña de Precios e Inventario */}
                <TabsContent value="pricing" className="space-y-4 pt-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cost">
                        Precio de Compra <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">$</span>
                        <Input
                          id="cost"
                          name="cost"
                          type="text"
                          placeholder="0.00"
                          value={newProduct.cost}
                          onChange={handleProductChange}
                          className={`pl-7 ${errors.cost ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.cost && <p className="text-xs text-red-500">{errors.cost}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profit">% Ganancia</Label>
                      <div className="relative">
                        <Input
                          id="profit"
                          name="profit"
                          type="text"
                          placeholder="30.00"
                          value={newProduct.profit}
                          onChange={handleProductChange}
                          className={errors.profit ? "border-red-500" : ""}
                        />
                        <span className="absolute right-3 top-2.5">%</span>
                      </div>
                      {errors.profit && <p className="text-xs text-red-500">{errors.profit}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">
                        Precio de Venta <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">$</span>
                        <Input
                          id="price"
                          name="price"
                          type="text"
                          placeholder="0.00"
                          value={newProduct.price}
                          onChange={handleProductChange}
                          className={`pl-7 ${errors.price ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="publicPrice">Precio de Venta al Público</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">$</span>
                      <Input
                        id="publicPrice"
                        name="publicPrice"
                        type="text"
                        placeholder="0.00"
                        value={newProduct.publicPrice}
                        onChange={handleProductChange}
                        className="pl-7"
                      />
                    </div>
                    <p className="text-xs text-slate-500">Si es diferente al precio de venta</p>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <Label htmlFor="stock">
                      Cantidad en Stock {newProduct.type === "physical" && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      placeholder="0"
                      value={newProduct.stock}
                      onChange={handleProductChange}
                      className={errors.stock ? "border-red-500" : ""}
                      disabled={newProduct.type !== "physical"}
                    />
                    {errors.stock && <p className="text-xs text-red-500">{errors.stock}</p>}
                    {newProduct.type !== "physical" && (
                      <p className="text-xs text-slate-500">
                        Los productos digitales y servicios no requieren control de stock
                      </p>
                    )}
                  </div>
                </TabsContent>

                {/* Pestaña de Plataformas y Envío */}
                <TabsContent value="platforms" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label className="text-base">
                      Plataformas de Venta <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Selecciona en qué plataformas estará disponible este producto
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-md p-4 hover:bg-slate-50">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="platform-pdv"
                            checked={newProduct.platforms.includes("pdv")}
                            onCheckedChange={(checked) => handlePlatformChange("pdv", checked)}
                          />
                          <Label htmlFor="platform-pdv" className="font-medium cursor-pointer">
                            Punto de Venta (PDV)
                          </Label>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 ml-6">Disponible para vender en tiendas físicas</p>
                      </div>

                      <div className="border rounded-md p-4 hover:bg-slate-50">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="platform-web"
                            checked={newProduct.platforms.includes("web")}
                            onCheckedChange={(checked) => handlePlatformChange("web", checked)}
                          />
                          <Label htmlFor="platform-web" className="font-medium cursor-pointer">
                            Tienda Web
                          </Label>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 ml-6">Disponible en tu tienda online</p>
                      </div>

                      <div className="border rounded-md p-4 hover:bg-slate-50">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="platform-sms"
                            checked={newProduct.platforms.includes("sms")}
                            onCheckedChange={(checked) => handlePlatformChange("sms", checked)}
                          />
                          <Label htmlFor="platform-sms" className="font-medium cursor-pointer">
                            Pagos por SMS
                          </Label>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 ml-6">Disponible para comprar vía SMS</p>
                      </div>
                    </div>
                    {errors.platforms && <p className="text-xs text-red-500 mt-2">{errors.platforms}</p>}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <Label className="text-base">Opciones de Entrega</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Configura cómo se entregará este producto a los clientes
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div
                        className={`border rounded-md p-4 ${newProduct.type !== "physical" ? "opacity-50" : "hover:bg-slate-50"}`}
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="shipping-option"
                            checked={newProduct.shippingOptions.shipping}
                            onCheckedChange={(checked) => handleShippingOptionChange("shipping", checked)}
                            disabled={newProduct.type !== "physical"}
                          />
                          <Label htmlFor="shipping-option" className="font-medium cursor-pointer">
                            <div className="flex items-center">
                              <Truck className="mr-2 h-4 w-4 text-blue-600" />
                              Envío a Domicilio
                            </div>
                          </Label>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 ml-6">
                          Envío del producto a la dirección del cliente
                        </p>
                      </div>

                      <div
                        className={`border rounded-md p-4 ${newProduct.type !== "physical" ? "opacity-50" : "hover:bg-slate-50"}`}
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="pickup-option"
                            checked={newProduct.shippingOptions.pickup}
                            onCheckedChange={(checked) => handleShippingOptionChange("pickup", checked)}
                            disabled={newProduct.type !== "physical"}
                          />
                          <Label htmlFor="pickup-option" className="font-medium cursor-pointer">
                            <div className="flex items-center">
                              <Store className="mr-2 h-4 w-4 text-green-600" />
                              Recogida en Tienda
                            </div>
                          </Label>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 ml-6">El cliente recoge el producto en tienda</p>
                      </div>

                      <div
                        className={`border rounded-md p-4 ${newProduct.type !== "digital" ? "opacity-50" : "hover:bg-slate-50"}`}
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="download-option"
                            checked={newProduct.shippingOptions.download}
                            onCheckedChange={(checked) => handleShippingOptionChange("download", checked)}
                            disabled={newProduct.type !== "digital"}
                          />
                          <Label htmlFor="download-option" className="font-medium cursor-pointer">
                            <div className="flex items-center">
                              <DownloadIcon className="mr-2 h-4 w-4 text-purple-600" />
                              Descarga Digital
                            </div>
                          </Label>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 ml-6">El cliente descarga el producto digital</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Pestaña de Imágenes */}
                <TabsContent value="images" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label className="text-base">Imagen del Producto</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Añade una imagen para mostrar en todas las plataformas
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        {newProduct.imagePreview ? (
                          <div className="relative border rounded-md overflow-hidden">
                            <img
                              src={newProduct.imagePreview || "/placeholder.svg"}
                              alt="Vista previa"
                              className="w-full h-48 object-contain"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-6 w-6 rounded-full"
                              onClick={removeImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed rounded-md flex flex-col items-center justify-center h-48 cursor-pointer hover:bg-slate-50">
                            <ImageIcon className="h-8 w-8 text-slate-400 mb-2" />
                            <span className="text-sm font-medium">No hay imagen</span>
                            <span className="text-xs text-slate-500 mt-1">Sube una imagen para el producto</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="product-image">Subir Imagen</Label>
                          <Input id="product-image" type="file" accept="image/*" onChange={handleImageUpload} />
                          <p className="text-xs text-slate-500">
                            Formatos soportados: JPG, PNG, GIF. Tamaño máximo: 5MB
                          </p>
                        </div>

                        <div className="pt-2">
                          <Button variant="outline" type="button" className="w-full" onClick={handleDemoImageUpload}>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Usar Imagen de Ejemplo
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveProduct} className="bg-[#0a2463] hover:bg-[#0a2463]/90">
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Producto
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">En {categories.length - 1} categorías</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor del Inventario</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Basado en precios de venta</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Productos por reponer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sin Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStockItems}</div>
            <p className="text-xs text-muted-foreground">Productos agotados</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Inventario</CardTitle>
          <CardDescription>Administra todos los productos disponibles en tu tienda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos por nombre, SKU o ID..."
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
                  <SelectItem value="in_stock">En Stock</SelectItem>
                  <SelectItem value="low_stock">Stock Bajo</SelectItem>
                  <SelectItem value="out_of_stock">Sin Stock</SelectItem>
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
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                    <div className="flex items-center">
                      Producto
                      {sortField === "name" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                    </div>
                  </TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Plataformas</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("price")}>
                    <div className="flex items-center">
                      Precio
                      {sortField === "price" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                    </div>
                  </TableHead>
                  <TableHead>Costo</TableHead>
                  <TableHead>% Ganancia</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("stock")}>
                    <div className="flex items-center">
                      Stock
                      {sortField === "stock" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                    </div>
                  </TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length > 0 ? (
                  filteredInventory.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-8 w-8 mr-2 rounded-md overflow-hidden">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          {product.name}
                        </div>
                      </TableCell>
                      <TableCell>{renderProductTypeBadge(product.type)}</TableCell>
                      <TableCell>{renderPlatformIcons(product.platforms)}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>${product.cost.toFixed(2)}</TableCell>
                      <TableCell>{product.profit.toFixed(2)}%</TableCell>
                      <TableCell>
                        <span
                          className={
                            product.stock === 0
                              ? "text-red-600 font-medium"
                              : product.stock < 10
                                ? "text-amber-600 font-medium"
                                : ""
                          }
                        >
                          {product.type === "physical" ? product.stock : "∞"}
                        </span>
                      </TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            product.stock === 0
                              ? "bg-red-100 text-red-800 hover:bg-red-100"
                              : product.status === "low_stock"
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                : "bg-green-100 text-green-800 hover:bg-green-100"
                          }`}
                        >
                          {product.stock === 0 ? "Sin Stock" : product.status === "low_stock" ? "Stock Bajo" : "Activo"}
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
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Plus className="mr-2 h-4 w-4" />
                              Añadir Stock
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calculator className="mr-2 h-4 w-4" />
                              Ajustar Precios
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
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
                    <TableCell colSpan={10} className="text-center py-4 text-muted-foreground">
                      No se encontraron productos. Intenta con una búsqueda diferente.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
