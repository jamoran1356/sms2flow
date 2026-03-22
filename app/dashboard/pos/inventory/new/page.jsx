"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ImageIcon, Package2, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function NewProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    category: "",
    price: "",
    cost: "",
    stock: "",
    alertThreshold: "5",
    barcode: "",
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
    active: true,
    featured: false,
    taxable: true,
    taxRate: "16",
  })
  const [images, setImages] = useState([])
  const [variants, setVariants] = useState([])
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  // Categorías disponibles
  const categories = ["Ropa", "Electrónica", "Hogar", "Libros", "Calzado", "Accesorios", "Alimentos", "Bebidas"]

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Manejar cambios en dimensiones
  const handleDimensionChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      dimensions: {
        ...formData.dimensions,
        [name]: value,
      },
    })
  }

  // Manejar cambios en switches
  const handleSwitchChange = (name, checked) => {
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  // Simular carga de imágenes - Versión simplificada
  const handleImageUpload = () => {
    // Crear una imagen de ejemplo en lugar de procesar archivos reales
    const newImage = {
      id: Date.now().toString(),
      name: "imagen-ejemplo.jpg",
      url: "/placeholder.svg?height=200&width=200",
      size: 1024 * 100, // 100KB
    }

    setImages([...images, newImage])
  }

  // Eliminar imagen
  const removeImage = (id) => {
    setImages(images.filter((image) => image.id !== id))
  }

  // Añadir variante
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: Date.now().toString(),
        name: "",
        sku: "",
        price: "",
        stock: "",
      },
    ])
  }

  // Actualizar variante
  const updateVariant = (id, field, value) => {
    setVariants(variants.map((variant) => (variant.id === id ? { ...variant, [field]: value } : variant)))
  }

  // Eliminar variante
  const removeVariant = (id) => {
    setVariants(variants.filter((variant) => variant.id !== id))
  }

  // Generar SKU automático
  const generateSku = () => {
    if (!formData.category || !formData.name) {
      setErrors({
        ...errors,
        sku: "Se necesita categoría y nombre para generar SKU",
      })
      return
    }

    const categoryPrefix = formData.category.substring(0, 2).toUpperCase()
    const namePrefix = formData.name.substring(0, 2).toUpperCase()
    const randomNum = Math.floor(1000 + Math.random() * 9000)

    setFormData({
      ...formData,
      sku: `${categoryPrefix}-${namePrefix}-${randomNum}`,
    })
  }

  // Validar formulario
  const validateForm = () => {
    const newErrors = {}

    if (!formData.name) newErrors.name = "El nombre es obligatorio"
    if (!formData.sku) newErrors.sku = "El SKU es obligatorio"
    if (!formData.category) newErrors.category = "La categoría es obligatoria"
    if (!formData.price) newErrors.price = "El precio es obligatorio"
    if (formData.price && isNaN(Number.parseFloat(formData.price))) newErrors.price = "El precio debe ser un número"
    if (formData.cost && isNaN(Number.parseFloat(formData.cost))) newErrors.cost = "El costo debe ser un número"
    if (formData.stock && isNaN(Number.parseInt(formData.stock))) newErrors.stock = "El stock debe ser un número entero"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Guardar producto
  const saveProduct = () => {
    if (!validateForm()) return

    setSaving(true)

    // Simular guardado
    setTimeout(() => {
      setSaving(false)
      alert("Producto guardado correctamente")
      // Aquí iría la redirección a la página de inventario o detalles del producto
      // router.push('/dashboard/pos/inventory')
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/pos/inventory">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Nuevo Producto</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/pos/inventory">Cancelar</Link>
          </Button>
          <Button size="sm" className="bg-[#0a2463] hover:bg-[#0a2463]/90" onClick={saveProduct} disabled={saving}>
            {saving ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Producto
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Información Básica</TabsTrigger>
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
          <TabsTrigger value="images">Imágenes</TabsTrigger>
          <TabsTrigger value="variants">Variantes</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>Información general del producto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nombre del Producto <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Ej: Camiseta Premium"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="sku">
                      SKU <span className="text-red-500">*</span>
                    </Label>
                    <Button variant="link" size="sm" className="h-5 p-0" onClick={generateSku}>
                      Generar automáticamente
                    </Button>
                  </div>
                  <Input
                    id="sku"
                    name="sku"
                    placeholder="Ej: RP-TS-1234"
                    value={formData.sku}
                    onChange={handleChange}
                    className={errors.sku ? "border-red-500" : ""}
                  />
                  {errors.sku && <p className="text-xs text-red-500">{errors.sku}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe el producto..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Categoría <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger id="category" className={errors.category ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barcode">Código de Barras</Label>
                  <Input
                    id="barcode"
                    name="barcode"
                    placeholder="Ej: 123456789012"
                    value={formData.barcode}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      value={formData.price}
                      onChange={handleChange}
                      className={`pl-7 ${errors.price ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost">Costo</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">$</span>
                    <Input
                      id="cost"
                      name="cost"
                      type="text"
                      placeholder="0.00"
                      value={formData.cost}
                      onChange={handleChange}
                      className={errors.cost ? "pl-7 border-red-500" : "pl-7"}
                    />
                  </div>
                  {errors.cost && <p className="text-xs text-red-500">{errors.cost}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tasa de Impuesto (%)</Label>
                  <Input
                    id="taxRate"
                    name="taxRate"
                    type="number"
                    placeholder="16"
                    value={formData.taxRate}
                    onChange={handleChange}
                    disabled={!formData.taxable}
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => handleSwitchChange("active", checked)}
                  />
                  <Label htmlFor="active">Producto Activo</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                  />
                  <Label htmlFor="featured">Producto Destacado</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="taxable"
                    checked={formData.taxable}
                    onCheckedChange={(checked) => handleSwitchChange("taxable", checked)}
                  />
                  <Label htmlFor="taxable">Aplicar Impuestos</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventario</CardTitle>
              <CardDescription>Gestión de stock y detalles de inventario</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Cantidad en Stock</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    placeholder="0"
                    value={formData.stock}
                    onChange={handleChange}
                    className={errors.stock ? "border-red-500" : ""}
                  />
                  {errors.stock && <p className="text-xs text-red-500">{errors.stock}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alertThreshold">Umbral de Alerta</Label>
                  <Input
                    id="alertThreshold"
                    name="alertThreshold"
                    type="number"
                    placeholder="5"
                    value={formData.alertThreshold}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-slate-500">Alerta cuando el stock sea menor a este valor</p>
                </div>

                <div className="space-y-2">
                  <Label>Estado de Inventario</Label>
                  <div className="h-10 flex items-center">
                    {Number.parseInt(formData.stock || "0") > 0 ? (
                      Number.parseInt(formData.stock || "0") <= Number.parseInt(formData.alertThreshold || "5") ? (
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Stock Bajo</Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">En Stock</Badge>
                      )
                    ) : (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Sin Stock</Badge>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="text"
                    placeholder="0.00"
                    value={formData.weight}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Dimensiones (cm)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      name="length"
                      placeholder="Largo"
                      value={formData.dimensions.length}
                      onChange={handleDimensionChange}
                    />
                    <Input
                      name="width"
                      placeholder="Ancho"
                      value={formData.dimensions.width}
                      onChange={handleDimensionChange}
                    />
                    <Input
                      name="height"
                      placeholder="Alto"
                      value={formData.dimensions.height}
                      onChange={handleDimensionChange}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Imágenes del Producto</CardTitle>
              <CardDescription>Añade imágenes para mostrar el producto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative border rounded-md overflow-hidden">
                    <img src={image.url || "/placeholder.svg"} alt={image.name} className="w-full h-40 object-cover" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={() => removeImage(image.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="p-2 text-xs truncate">{image.name}</div>
                  </div>
                ))}

                {/* Reemplazado el input file con un botón simple */}
                <div
                  className="border border-dashed rounded-md flex flex-col items-center justify-center h-40 cursor-pointer hover:bg-slate-50"
                  onClick={handleImageUpload}
                >
                  <ImageIcon className="h-8 w-8 text-slate-400 mb-2" />
                  <span className="text-sm font-medium">Añadir Imágenes</span>
                  <span className="text-xs text-slate-500 mt-1">Haz clic para añadir una imagen de ejemplo</span>
                </div>
              </div>

              {images.length > 0 && (
                <p className="text-xs text-slate-500 mt-2">
                  {images.length} {images.length === 1 ? "imagen" : "imágenes"} cargadas
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variants" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Variantes del Producto</CardTitle>
                <CardDescription>Añade variantes como tallas, colores, etc.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={addVariant}>
                Añadir Variante
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {variants.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Package2 className="h-8 w-8 mx-auto mb-2" />
                  <p>No hay variantes</p>
                  <p className="text-xs mt-1">Añade variantes para productos con diferentes opciones</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {variants.map((variant, index) => (
                    <div key={variant.id} className="border rounded-md p-4 relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => removeVariant(variant.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>

                      <h3 className="font-medium mb-3">Variante {index + 1}</h3>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`variant-name-${variant.id}`}>Nombre</Label>
                          <Input
                            id={`variant-name-${variant.id}`}
                            placeholder="Ej: Rojo, XL, etc."
                            value={variant.name}
                            onChange={(e) => updateVariant(variant.id, "name", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`variant-sku-${variant.id}`}>SKU</Label>
                          <Input
                            id={`variant-sku-${variant.id}`}
                            placeholder="Ej: RP-TS-1234-RED"
                            value={variant.sku}
                            onChange={(e) => updateVariant(variant.id, "sku", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`variant-price-${variant.id}`}>Precio</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5">$</span>
                            <Input
                              id={`variant-price-${variant.id}`}
                              placeholder="0.00"
                              value={variant.price}
                              onChange={(e) => updateVariant(variant.id, "price", e.target.value)}
                              className="pl-7"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`variant-stock-${variant.id}`}>Stock</Label>
                          <Input
                            id={`variant-stock-${variant.id}`}
                            type="number"
                            placeholder="0"
                            value={variant.stock}
                            onChange={(e) => updateVariant(variant.id, "stock", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <p className="text-xs text-slate-500">
                Las variantes son útiles para productos que vienen en diferentes opciones como tallas, colores,
                materiales, etc.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
