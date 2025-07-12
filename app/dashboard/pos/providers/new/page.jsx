"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Building, Info, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export default function NewProviderPage() {
  const [activeTab, setActiveTab] = useState("basic")
  const [logoPreview, setLogoPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Información básica
    code: "",
    name: "",
    taxId: "",
    category: "",
    status: "active",
    website: "",
    description: "",

    // Contacto
    contactPerson: "",
    email: "",
    phone: "",
    alternatePhone: "",

    // Dirección
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Ecuador",

    // Términos comerciales
    paymentTerms: "30",
    creditLimit: "0",
    discount: "0",
    currency: "USD",

    // Datos bancarios
    bankName: "",
    accountNumber: "",
    accountType: "checking",
    accountHolder: "",
    swiftCode: "",

    // Configuración
    taxExempt: false,
    preferredSupplier: false,
    sendAutomaticOrders: false,
    minimumOrderAmount: "0",
  })

  const [errors, setErrors] = useState({})

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Limpiar error cuando el usuario corrige el campo
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  // Manejar cambios en switches
  const handleSwitchChange = (name, checked) => {
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  // Manejar carga de logo
  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // En un entorno real, aquí subirías la imagen a un servidor
      // Para este ejemplo, simplemente creamos una URL local
      const imageUrl = URL.createObjectURL(file)
      setLogoPreview(imageUrl)
    }
  }

  // Eliminar logo
  const removeLogo = () => {
    setLogoPreview(null)
  }

  // Validar formulario
  const validateForm = () => {
    const newErrors = {}

    // Validar campos obligatorios en la pestaña actual
    if (activeTab === "basic") {
      if (!formData.code.trim()) newErrors.code = "El código es obligatorio"
      if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio"
      if (!formData.taxId.trim()) newErrors.taxId = "El RUC/ID fiscal es obligatorio"
      if (!formData.category) newErrors.category = "La categoría es obligatoria"
    } else if (activeTab === "contact") {
      if (!formData.contactPerson.trim()) newErrors.contactPerson = "El nombre de contacto es obligatorio"
      if (!formData.email.trim()) newErrors.email = "El email es obligatorio"
      if (!formData.phone.trim()) newErrors.phone = "El teléfono es obligatorio"
    } else if (activeTab === "address") {
      if (!formData.address.trim()) newErrors.address = "La dirección es obligatoria"
      if (!formData.city.trim()) newErrors.city = "La ciudad es obligatoria"
    } else if (activeTab === "commercial") {
      // Validar que los valores numéricos sean correctos
      if (isNaN(Number.parseFloat(formData.creditLimit))) {
        newErrors.creditLimit = "El límite de crédito debe ser un número"
      }
      if (
        isNaN(Number.parseFloat(formData.discount)) ||
        Number.parseFloat(formData.discount) < 0 ||
        Number.parseFloat(formData.discount) > 100
      ) {
        newErrors.discount = "El descuento debe ser un número entre 0 y 100"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Validar todo el formulario
  const validateAllForm = () => {
    const newErrors = {}

    // Validar campos obligatorios en todas las pestañas
    if (!formData.code.trim()) newErrors.code = "El código es obligatorio"
    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio"
    if (!formData.taxId.trim()) newErrors.taxId = "El RUC/ID fiscal es obligatorio"
    if (!formData.category) newErrors.category = "La categoría es obligatoria"
    if (!formData.contactPerson.trim()) newErrors.contactPerson = "El nombre de contacto es obligatorio"
    if (!formData.email.trim()) newErrors.email = "El email es obligatorio"
    if (!formData.phone.trim()) newErrors.phone = "El teléfono es obligatorio"
    if (!formData.address.trim()) newErrors.address = "La dirección es obligatoria"
    if (!formData.city.trim()) newErrors.city = "La ciudad es obligatoria"

    // Validar que los valores numéricos sean correctos
    if (isNaN(Number.parseFloat(formData.creditLimit))) {
      newErrors.creditLimit = "El límite de crédito debe ser un número"
    }
    if (
      isNaN(Number.parseFloat(formData.discount)) ||
      Number.parseFloat(formData.discount) < 0 ||
      Number.parseFloat(formData.discount) > 100
    ) {
      newErrors.discount = "El descuento debe ser un número entre 0 y 100"
    }

    setErrors(newErrors)

    // Si hay errores, mostrar la pestaña con el primer error
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.code || newErrors.name || newErrors.taxId || newErrors.category) {
        setActiveTab("basic")
      } else if (newErrors.contactPerson || newErrors.email || newErrors.phone) {
        setActiveTab("contact")
      } else if (newErrors.address || newErrors.city) {
        setActiveTab("address")
      } else if (newErrors.creditLimit || newErrors.discount) {
        setActiveTab("commercial")
      }
    }

    return Object.keys(newErrors).length === 0
  }

  // Guardar proveedor
  const saveProvider = () => {
    // Validar todos los campos obligatorios antes de guardar
    if (!validateAllForm()) {
      alert("Por favor, completa todos los campos obligatorios")
      return
    }

    setIsSubmitting(true)

    // Simulación de guardado (en un entorno real, aquí iría la llamada a la API)
    setTimeout(() => {
      setIsSubmitting(false)

      // Mostrar mensaje de éxito
      alert("Proveedor guardado correctamente")

      // Redirigir a la página de proveedores
      window.location.href = "/dashboard/pos/providers"
    }, 1000)
  }

  // Categorías disponibles
  const categories = ["Electrónica", "Ropa", "Oficina", "Hogar", "Alimentos", "Servicios", "Otro"]

  // Términos de pago disponibles
  const paymentTermsOptions = [
    { value: "immediate", label: "Pago inmediato" },
    { value: "7", label: "7 días" },
    { value: "15", label: "15 días" },
    { value: "30", label: "30 días" },
    { value: "45", label: "45 días" },
    { value: "60", label: "60 días" },
    { value: "90", label: "90 días" },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/pos/providers">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Nuevo Proveedor</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/pos/providers">
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Link>
          </Button>
          <Button
            size="sm"
            className="bg-[#0a2463] hover:bg-[#0a2463]/90"
            onClick={saveProvider}
            disabled={isSubmitting}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Guardando..." : "Guardar Proveedor"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="basic">Información Básica</TabsTrigger>
          <TabsTrigger value="contact">Contacto</TabsTrigger>
          <TabsTrigger value="address">Dirección</TabsTrigger>
          <TabsTrigger value="commercial">Términos Comerciales</TabsTrigger>
          <TabsTrigger value="banking">Datos Bancarios</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        {/* Pestaña de Información Básica */}
        <TabsContent value="basic" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Información del Proveedor</CardTitle>
                  <CardDescription>Datos básicos para identificar al proveedor</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="code">
                        Código <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="code"
                        name="code"
                        placeholder="Ej: PROV001"
                        value={formData.code}
                        onChange={handleChange}
                        className={errors.code ? "border-red-500" : ""}
                      />
                      {errors.code && <p className="text-xs text-red-500">{errors.code}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxId">
                        RUC / ID Fiscal <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="taxId"
                        name="taxId"
                        placeholder="Ej: 1234567890001"
                        value={formData.taxId}
                        onChange={handleChange}
                        className={errors.taxId ? "border-red-500" : ""}
                      />
                      {errors.taxId && <p className="text-xs text-red-500">{errors.taxId}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Nombre / Razón Social <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Ej: Distribuidora Tecnológica S.A."
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">
                        Categoría <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => {
                          setFormData({ ...formData, category: value })
                          if (errors.category) {
                            setErrors({ ...errors, category: null })
                          }
                        }}
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
                      <Label htmlFor="status">Estado</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Activo</SelectItem>
                          <SelectItem value="inactive">Inactivo</SelectItem>
                          <SelectItem value="pending">Pendiente de aprobación</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Sitio Web</Label>
                    <Input
                      id="website"
                      name="website"
                      placeholder="Ej: https://www.ejemplo.com"
                      value={formData.website}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe brevemente a este proveedor..."
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Logo</CardTitle>
                  <CardDescription>Imagen o logo del proveedor</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {logoPreview ? (
                    <div className="relative border rounded-md overflow-hidden">
                      <img
                        src={logoPreview || "/placeholder.svg"}
                        alt="Logo del proveedor"
                        className="w-full h-48 object-contain"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 rounded-full"
                        onClick={removeLogo}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed rounded-md flex flex-col items-center justify-center h-48 cursor-pointer hover:bg-slate-50">
                      <Building className="h-8 w-8 text-slate-400 mb-2" />
                      <span className="text-sm font-medium">No hay logo</span>
                      <span className="text-xs text-slate-500 mt-1">Sube una imagen para el proveedor</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="logo-upload">Subir Logo</Label>
                    <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} />
                    <p className="text-xs text-slate-500">Formatos soportados: JPG, PNG, GIF. Tamaño máximo: 5MB</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={() => {
                if (validateForm()) {
                  setActiveTab("contact")
                }
              }}
              className="bg-[#0a2463] hover:bg-[#0a2463]/90"
            >
              Siguiente: Contacto
            </Button>
          </div>
        </TabsContent>

        {/* Pestaña de Contacto */}
        <TabsContent value="contact" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
              <CardDescription>Datos para comunicarse con el proveedor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">
                  Persona de Contacto <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contactPerson"
                  name="contactPerson"
                  placeholder="Ej: Juan Pérez"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className={errors.contactPerson ? "border-red-500" : ""}
                />
                {errors.contactPerson && <p className="text-xs text-red-500">{errors.contactPerson}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Correo Electrónico <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Ej: contacto@empresa.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Teléfono <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Ej: +593 99 123 4567"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alternatePhone">Teléfono Alternativo</Label>
                <Input
                  id="alternatePhone"
                  name="alternatePhone"
                  placeholder="Ej: +593 2 123 4567"
                  value={formData.alternatePhone}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("basic")}>
              Anterior: Información Básica
            </Button>
            <Button
              onClick={() => {
                if (validateForm()) {
                  setActiveTab("address")
                }
              }}
              className="bg-[#0a2463] hover:bg-[#0a2463]/90"
            >
              Siguiente: Dirección
            </Button>
          </div>
        </TabsContent>

        {/* Pestaña de Dirección */}
        <TabsContent value="address" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Dirección</CardTitle>
              <CardDescription>Ubicación física del proveedor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">
                  Dirección <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Ej: Av. Principal #123"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? "border-red-500" : ""}
                  rows={2}
                />
                {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">
                    Ciudad <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="Ej: Quito"
                    value={formData.city}
                    onChange={handleChange}
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Provincia / Estado</Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="Ej: Pichincha"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Código Postal</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    placeholder="Ej: 170150"
                    value={formData.postalCode}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Input
                    id="country"
                    name="country"
                    placeholder="Ej: Ecuador"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("contact")}>
              Anterior: Contacto
            </Button>
            <Button
              onClick={() => {
                if (validateForm()) {
                  setActiveTab("commercial")
                }
              }}
              className="bg-[#0a2463] hover:bg-[#0a2463]/90"
            >
              Siguiente: Términos Comerciales
            </Button>
          </div>
        </TabsContent>

        {/* Pestaña de Términos Comerciales */}
        <TabsContent value="commercial" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Términos Comerciales</CardTitle>
              <CardDescription>Condiciones de pago y descuentos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Términos de Pago</Label>
                  <Select
                    value={formData.paymentTerms}
                    onValueChange={(value) => setFormData({ ...formData, paymentTerms: value })}
                  >
                    <SelectTrigger id="paymentTerms">
                      <SelectValue placeholder="Seleccionar términos" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentTermsOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Moneda</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Seleccionar moneda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">Dólar Estadounidense (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="KII">KII Token</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="creditLimit">Límite de Crédito</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">$</span>
                    <Input
                      id="creditLimit"
                      name="creditLimit"
                      type="text"
                      placeholder="0.00"
                      value={formData.creditLimit}
                      onChange={handleChange}
                      className={`pl-7 ${errors.creditLimit ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.creditLimit && <p className="text-xs text-red-500">{errors.creditLimit}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">Descuento (%)</Label>
                  <div className="relative">
                    <Input
                      id="discount"
                      name="discount"
                      type="text"
                      placeholder="0.00"
                      value={formData.discount}
                      onChange={handleChange}
                      className={errors.discount ? "border-red-500" : ""}
                    />
                    <span className="absolute right-3 top-2.5">%</span>
                  </div>
                  {errors.discount && <p className="text-xs text-red-500">{errors.discount}</p>}
                </div>
              </div>

              <div className="pt-2 mt-2 border-t">
                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4 text-slate-500" />
                  <p className="text-sm text-slate-500">
                    Los términos comerciales se aplicarán automáticamente a las órdenes de compra para este proveedor.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("address")}>
              Anterior: Dirección
            </Button>
            <Button
              onClick={() => {
                if (validateForm()) {
                  setActiveTab("banking")
                }
              }}
              className="bg-[#0a2463] hover:bg-[#0a2463]/90"
            >
              Siguiente: Datos Bancarios
            </Button>
          </div>
        </TabsContent>

        {/* Pestaña de Datos Bancarios */}
        <TabsContent value="banking" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Datos Bancarios</CardTitle>
              <CardDescription>Información para realizar pagos al proveedor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">Nombre del Banco</Label>
                <Input
                  id="bankName"
                  name="bankName"
                  placeholder="Ej: Banco Pichincha"
                  value={formData.bankName}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Número de Cuenta</Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    placeholder="Ej: 1234567890"
                    value={formData.accountNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountType">Tipo de Cuenta</Label>
                  <Select
                    value={formData.accountType}
                    onValueChange={(value) => setFormData({ ...formData, accountType: value })}
                  >
                    <SelectTrigger id="accountType">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Cuenta Corriente</SelectItem>
                      <SelectItem value="savings">Cuenta de Ahorros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountHolder">Titular de la Cuenta</Label>
                <Input
                  id="accountHolder"
                  name="accountHolder"
                  placeholder="Ej: Distribuidora Tecnológica S.A."
                  value={formData.accountHolder}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="swiftCode">Código SWIFT / BIC (para transferencias internacionales)</Label>
                <Input
                  id="swiftCode"
                  name="swiftCode"
                  placeholder="Ej: PICHECEQ"
                  value={formData.swiftCode}
                  onChange={handleChange}
                />
              </div>

              <div className="pt-2 mt-2 border-t">
                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4 text-slate-500" />
                  <p className="text-sm text-slate-500">
                    Esta información se utilizará para procesar pagos a este proveedor. Asegúrate de verificar los datos
                    bancarios.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("commercial")}>
              Anterior: Términos Comerciales
            </Button>
            <Button
              onClick={() => {
                if (validateForm()) {
                  setActiveTab("settings")
                }
              }}
              className="bg-[#0a2463] hover:bg-[#0a2463]/90"
            >
              Siguiente: Configuración
            </Button>
          </div>
        </TabsContent>

        {/* Pestaña de Configuración */}
        <TabsContent value="settings" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración Adicional</CardTitle>
              <CardDescription>Preferencias y configuraciones para este proveedor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="taxExempt">Exento de Impuestos</Label>
                  <p className="text-sm text-slate-500">El proveedor está exento de pagar impuestos</p>
                </div>
                <Switch
                  id="taxExempt"
                  checked={formData.taxExempt}
                  onCheckedChange={(checked) => handleSwitchChange("taxExempt", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="preferredSupplier">Proveedor Preferido</Label>
                  <p className="text-sm text-slate-500">Marcar como proveedor preferido para estos productos</p>
                </div>
                <Switch
                  id="preferredSupplier"
                  checked={formData.preferredSupplier}
                  onCheckedChange={(checked) => handleSwitchChange("preferredSupplier", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sendAutomaticOrders">Órdenes Automáticas</Label>
                  <p className="text-sm text-slate-500">Enviar órdenes automáticamente cuando el stock esté bajo</p>
                </div>
                <Switch
                  id="sendAutomaticOrders"
                  checked={formData.sendAutomaticOrders}
                  onCheckedChange={(checked) => handleSwitchChange("sendAutomaticOrders", checked)}
                />
              </div>

              {formData.sendAutomaticOrders && (
                <div className="space-y-2 pl-6 border-l-2 border-slate-100 ml-2">
                  <Label htmlFor="minimumOrderAmount">Monto Mínimo de Orden</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">$</span>
                    <Input
                      id="minimumOrderAmount"
                      name="minimumOrderAmount"
                      type="text"
                      placeholder="0.00"
                      value={formData.minimumOrderAmount}
                      onChange={handleChange}
                      className="pl-7"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Las órdenes automáticas se generarán solo si el valor total supera este monto
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" onClick={() => setActiveTab("banking")}>
                Anterior: Datos Bancarios
              </Button>
              <Button onClick={saveProvider} className="bg-[#0a2463] hover:bg-[#0a2463]/90" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Guardando..." : "Guardar Proveedor"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
