"use client"

import { useState } from "react"
import {
  Printer,
  Save,
  Receipt,
  Building,
  CreditCard,
  Percent,
  FileText,
  ShoppingCart,
  Code,
  Copy,
  ExternalLink,
  Laptop,
  Package2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"

export default function POSConfigPage() {
  // Estados para los diferentes formularios
  const [printerConfig, setPrinterConfig] = useState({
    enabled: true,
    type: "thermal",
    model: "EPSON TM-T20III",
    connection: "usb",
    ipAddress: "",
    port: "9100",
    paperWidth: "80",
    printLogo: true,
    printDuplicate: true,
  })

  const [taxConfig, setTaxConfig] = useState({
    taxIncluded: true,
    generalTaxRate: "16",
    reducedTaxRate: "8",
    zeroTaxRate: "0",
    applyTaxToAll: true,
    showTaxBreakdown: true,
  })

  const [invoiceConfig, setInvoiceConfig] = useState({
    invoicePrefix: "FACT-",
    nextInvoiceNumber: "0001",
    autoGenerateInvoice: true,
    invoiceNotes: "Gracias por su compra",
    invoiceDueDays: "30",
    showDueDate: true,
    termsAndConditions: "Los productos electrónicos tienen 30 días de garantía.",
  })

  const [companyConfig, setCompanyConfig] = useState({
    companyName: "Mi Empresa, S.A.",
    taxId: "A12345678",
    address: "Calle Principal 123",
    city: "Madrid",
    state: "Madrid",
    postalCode: "28001",
    country: "España",
    phone: "+34 91 123 4567",
    email: "info@miempresa.com",
    website: "www.miempresa.com",
  })

  const [paymentConfig, setPaymentConfig] = useState({
    acceptCash: true,
    acceptCard: true,
    acceptCrypto: true,
    acceptTransfer: true,
    defaultPaymentMethod: "cash",
    allowMultiplePaymentMethods: true,
    requirePaymentToComplete: true,
  })

  const [receiptConfig, setReceiptConfig] = useState({
    showLogo: true,
    showTaxId: true,
    showItemPrice: true,
    showDiscounts: true,
    showTaxBreakdown: true,
    footerText: "Gracias por su compra. ¡Vuelva pronto!",
    printCustomerCopy: true,
    printMerchantCopy: true,
  })

  const [posConfig, setPosConfig] = useState({
    theme: "light",
    language: "es",
    currency: "EUR",
    decimalPlaces: "2",
    showProductImages: true,
    enableBarcodeScan: true,
    enableQuickSale: true,
    requireLogin: true,
    allowDiscounts: true,
    allowPriceChange: false,
    allowReturnWithoutReceipt: false,
    showStockWarnings: true,
    lowStockThreshold: "10",
    autoLogoutTime: "30",
    defaultView: "grid",
    categoriesEnabled: true,
    searchOnType: true,
    confirmBeforeDelete: true,
  })

  const [integrationConfig, setIntegrationConfig] = useState({
    enableEmbedding: true,
    allowExternalAccess: true,
    apiEnabled: true,
    apiKey: "kp_" + Math.random().toString(36).substring(2, 15),
    allowCrossOrigin: true,
    allowedDomains: "*",
    syncInterval: "5",
    offlineMode: true,
    maxOfflineTransactions: "100",
  })

  const [terminalConfig, setTerminalConfig] = useState({
    enableMultipleTerminals: true,
    centralizedInventory: true,
    terminalPrefix: "CAJA-",
    syncOnTransaction: true,
    requireTerminalAuth: true,
    allowCashDrawerOverride: false,
    showTerminalId: true,
    terminalTimeout: "120",
  })

  const [productConfig, setProductConfig] = useState({
    defaultProductType: "physical",
    defaultPlatforms: ["pdv", "web"],
    enableDigitalProducts: true,
    enablePhysicalProducts: true,
    enableServices: true,
    enableSubscriptions: true,
    requireSKU: true,
    autoGenerateSKU: true,
    skuPrefix: "KP-",
    enableVariants: true,
    enableInventoryTracking: true,
    lowStockNotification: true,
    lowStockThreshold: "10",
    enableShipping: true,
    enablePickup: true,
    defaultShippingFee: "5.00",
    taxByProductType: true,
    showInAllPlatforms: false,
    requireProductApproval: false,
    enableProductReviews: true,
    enableProductImport: true,
    enableProductExport: true,
  })

  // Lista de terminales activas
  const [terminals, setTerminals] = useState([
    {
      id: "CAJA-001",
      name: "Caja Principal",
      location: "Tienda Central",
      status: "active",
      lastSync: "Hace 5 minutos",
    },
    {
      id: "CAJA-002",
      name: "Caja Secundaria",
      location: "Tienda Central",
      status: "active",
      lastSync: "Hace 10 minutos",
    },
    { id: "CAJA-003", name: "Terminal Móvil", location: "Eventos", status: "inactive", lastSync: "Hace 2 días" },
  ])

  // Manejador de cambios simplificado
  const handleChange = (section, field, value) => {
    switch (section) {
      case "printer":
        setPrinterConfig((prev) => ({ ...prev, [field]: value }))
        break
      case "tax":
        setTaxConfig((prev) => ({ ...prev, [field]: value }))
        break
      case "invoice":
        setInvoiceConfig((prev) => ({ ...prev, [field]: value }))
        break
      case "company":
        setCompanyConfig((prev) => ({ ...prev, [field]: value }))
        break
      case "payment":
        setPaymentConfig((prev) => ({ ...prev, [field]: value }))
        break
      case "receipt":
        setReceiptConfig((prev) => ({ ...prev, [field]: value }))
        break
      case "pos":
        setPosConfig((prev) => ({ ...prev, [field]: value }))
        break
      case "integration":
        setIntegrationConfig((prev) => ({ ...prev, [field]: value }))
        break
      case "terminal":
        setTerminalConfig((prev) => ({ ...prev, [field]: value }))
        break
      case "product":
        setProductConfig((prev) => ({ ...prev, [field]: value }))
        break
      default:
        break
    }
  }

  // Guardar configuración
  const saveConfig = () => {
    // Aquí iría la lógica para guardar la configuración
    console.log("Configuración guardada", {
      printerConfig,
      taxConfig,
      invoiceConfig,
      companyConfig,
      paymentConfig,
      receiptConfig,
      posConfig,
      integrationConfig,
      terminalConfig,
      productConfig,
    })
    alert("Configuración guardada correctamente")
  }

  // Generar nuevo terminal
  const addNewTerminal = () => {
    const newId = `CAJA-${String(terminals.length + 1).padStart(3, "0")}`
    const newTerminal = {
      id: newId,
      name: `Terminal ${terminals.length + 1}`,
      location: "Sin asignar",
      status: "inactive",
      lastSync: "Nunca",
    }
    setTerminals([...terminals, newTerminal])
  }

  // Copiar código al portapapeles
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert("Código copiado al portapapeles")
  }

  // Código de integración para iframe
  const iframeCode = `<iframe 
  src="https://app.kiipay.com/embed/pos?terminal=${terminalConfig.terminalPrefix}XXX&apiKey=${integrationConfig.apiKey}" 
  width="100%" 
  height="700px" 
  frameborder="0" 
  allow="camera; microphone; fullscreen">
</iframe>`

  // Código de integración para JavaScript
  const jsCode = `<div id="kiipay-pos-container"></div>
<script src="https://app.kiipay.com/js/pos-embed.js"></script>
<script>
  KiipayPOS.init({
    container: 'kiipay-pos-container',
    terminal: '${terminalConfig.terminalPrefix}XXX',
    apiKey: '${integrationConfig.apiKey}',
    theme: '${posConfig.theme}',
    offlineMode: ${integrationConfig.offlineMode},
    syncInterval: ${integrationConfig.syncInterval}
  });
</script>`

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Configuración del PDV</h1>
        <Button onClick={saveConfig} className="bg-[#0a2463] hover:bg-[#0a2463]/90">
          <Save className="mr-2 h-4 w-4" />
          Guardar Configuración
        </Button>
      </div>

      <Tabs defaultValue="pos" className="w-full">
        <TabsList className="grid grid-cols-4 lg:grid-cols-9 w-full">
          <TabsTrigger value="pos">General</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="company">Empresa</TabsTrigger>
          <TabsTrigger value="invoice">Facturación</TabsTrigger>
          <TabsTrigger value="tax">Impuestos</TabsTrigger>
          <TabsTrigger value="printer">Impresora</TabsTrigger>
          <TabsTrigger value="payment">Pagos</TabsTrigger>
          <TabsTrigger value="receipt">Tickets</TabsTrigger>
          <TabsTrigger value="integration">Integración</TabsTrigger>
        </TabsList>

        {/* Pestaña de Configuración General del PDV */}
        <TabsContent value="pos" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Configuración General del Punto de Venta
              </CardTitle>
              <CardDescription>Personaliza el comportamiento y apariencia de tu punto de venta</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="appearance">
                  <AccordionTrigger>Apariencia y Visualización</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="posTheme">Tema</Label>
                          <Select
                            value={posConfig.theme}
                            onValueChange={(value) => handleChange("pos", "theme", value)}
                          >
                            <SelectTrigger id="posTheme">
                              <SelectValue placeholder="Selecciona un tema" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="light">Claro</SelectItem>
                              <SelectItem value="dark">Oscuro</SelectItem>
                              <SelectItem value="system">Según sistema</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="posLanguage">Idioma</Label>
                          <Select
                            value={posConfig.language}
                            onValueChange={(value) => handleChange("pos", "language", value)}
                          >
                            <SelectTrigger id="posLanguage">
                              <SelectValue placeholder="Selecciona un idioma" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="es">Español</SelectItem>
                              <SelectItem value="en">Inglés</SelectItem>
                              <SelectItem value="fr">Francés</SelectItem>
                              <SelectItem value="pt">Portugués</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="defaultView">Vista predeterminada de productos</Label>
                          <Select
                            value={posConfig.defaultView}
                            onValueChange={(value) => handleChange("pos", "defaultView", value)}
                          >
                            <SelectTrigger id="defaultView">
                              <SelectValue placeholder="Selecciona una vista" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="grid">Cuadrícula</SelectItem>
                              <SelectItem value="list">Lista</SelectItem>
                              <SelectItem value="compact">Compacta</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between space-y-0">
                          <div className="space-y-0.5">
                            <Label className="text-base">Mostrar imágenes de productos</Label>
                            <p className="text-sm text-muted-foreground">
                              Muestra las imágenes de los productos en la pantalla de venta
                            </p>
                          </div>
                          <Switch
                            checked={posConfig.showProductImages}
                            onCheckedChange={(checked) => handleChange("pos", "showProductImages", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between space-y-0">
                          <div className="space-y-0.5">
                            <Label className="text-base">Habilitar categorías</Label>
                            <p className="text-sm text-muted-foreground">
                              Organiza los productos por categorías en la pantalla de venta
                            </p>
                          </div>
                          <Switch
                            checked={posConfig.categoriesEnabled}
                            onCheckedChange={(checked) => handleChange("pos", "categoriesEnabled", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between space-y-0">
                          <div className="space-y-0.5">
                            <Label className="text-base">Búsqueda mientras escribes</Label>
                            <p className="text-sm text-muted-foreground">
                              Busca productos automáticamente mientras escribes
                            </p>
                          </div>
                          <Switch
                            checked={posConfig.searchOnType}
                            onCheckedChange={(checked) => handleChange("pos", "searchOnType", checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="currency">
                  <AccordionTrigger>Moneda y Formato</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="posCurrency">Moneda</Label>
                        <Select
                          value={posConfig.currency}
                          onValueChange={(value) => handleChange("pos", "currency", value)}
                        >
                          <SelectTrigger id="posCurrency">
                            <SelectValue placeholder="Selecciona una moneda" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EUR">Euro (€)</SelectItem>
                            <SelectItem value="USD">Dólar estadounidense ($)</SelectItem>
                            <SelectItem value="GBP">Libra esterlina (£)</SelectItem>
                            <SelectItem value="MXN">Peso mexicano ($)</SelectItem>
                            <SelectItem value="COP">Peso colombiano ($)</SelectItem>
                            <SelectItem value="ARS">Peso argentino ($)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="decimalPlaces">Decimales</Label>
                        <Select
                          value={posConfig.decimalPlaces}
                          onValueChange={(value) => handleChange("pos", "decimalPlaces", value)}
                        >
                          <SelectTrigger id="decimalPlaces">
                            <SelectValue placeholder="Número de decimales" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0 decimales</SelectItem>
                            <SelectItem value="1">1 decimal</SelectItem>
                            <SelectItem value="2">2 decimales</SelectItem>
                            <SelectItem value="3">3 decimales</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="features">
                  <AccordionTrigger>Funcionalidades</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between space-y-0">
                          <div className="space-y-0.5">
                            <Label className="text-base">Habilitar escáner de códigos</Label>
                            <p className="text-sm text-muted-foreground">
                              Permite usar un escáner de códigos de barras
                            </p>
                          </div>
                          <Switch
                            checked={posConfig.enableBarcodeScan}
                            onCheckedChange={(checked) => handleChange("pos", "enableBarcodeScan", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between space-y-0">
                          <div className="space-y-0.5">
                            <Label className="text-base">Venta rápida</Label>
                            <p className="text-sm text-muted-foreground">Permite completar ventas con un solo clic</p>
                          </div>
                          <Switch
                            checked={posConfig.enableQuickSale}
                            onCheckedChange={(checked) => handleChange("pos", "enableQuickSale", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between space-y-0">
                          <div className="space-y-0.5">
                            <Label className="text-base">Permitir descuentos</Label>
                            <p className="text-sm text-muted-foreground">
                              Permite aplicar descuentos a productos o ventas
                            </p>
                          </div>
                          <Switch
                            checked={posConfig.allowDiscounts}
                            onCheckedChange={(checked) => handleChange("pos", "allowDiscounts", checked)}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between space-y-0">
                          <div className="space-y-0.5">
                            <Label className="text-base">Permitir cambio de precio</Label>
                            <p className="text-sm text-muted-foreground">
                              Permite modificar el precio durante la venta
                            </p>
                          </div>
                          <Switch
                            checked={posConfig.allowPriceChange}
                            onCheckedChange={(checked) => handleChange("pos", "allowPriceChange", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between space-y-0">
                          <div className="space-y-0.5">
                            <Label className="text-base">Devoluciones sin ticket</Label>
                            <p className="text-sm text-muted-foreground">
                              Permite realizar devoluciones sin ticket original
                            </p>
                          </div>
                          <Switch
                            checked={posConfig.allowReturnWithoutReceipt}
                            onCheckedChange={(checked) => handleChange("pos", "allowReturnWithoutReceipt", checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between space-y-0">
                          <div className="space-y-0.5">
                            <Label className="text-base">Confirmar antes de eliminar</Label>
                            <p className="text-sm text-muted-foreground">
                              Solicita confirmación antes de eliminar elementos
                            </p>
                          </div>
                          <Switch
                            checked={posConfig.confirmBeforeDelete}
                            onCheckedChange={(checked) => handleChange("pos", "confirmBeforeDelete", checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="inventory">
                  <AccordionTrigger>Inventario</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div className="flex items-center justify-between space-y-0">
                        <div className="space-y-0.5">
                          <Label className="text-base">Mostrar alertas de stock</Label>
                          <p className="text-sm text-muted-foreground">Muestra alertas cuando el stock está bajo</p>
                        </div>
                        <Switch
                          checked={posConfig.showStockWarnings}
                          onCheckedChange={(checked) => handleChange("pos", "showStockWarnings", checked)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lowStockThreshold">Umbral de stock bajo</Label>
                        <Input
                          id="lowStockThreshold"
                          type="number"
                          value={posConfig.lowStockThreshold}
                          onChange={(e) => handleChange("pos", "lowStockThreshold", e.target.value)}
                          placeholder="Ej: 10"
                        />
                        <p className="text-xs text-muted-foreground">
                          Cantidad a partir de la cual se considera stock bajo
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="security">
                  <AccordionTrigger>Seguridad</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div className="flex items-center justify-between space-y-0">
                        <div className="space-y-0.5">
                          <Label className="text-base">Requerir inicio de sesión</Label>
                          <p className="text-sm text-muted-foreground">
                            Requiere que los usuarios inicien sesión para usar el PDV
                          </p>
                        </div>
                        <Switch
                          checked={posConfig.requireLogin}
                          onCheckedChange={(checked) => handleChange("pos", "requireLogin", checked)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="autoLogoutTime">Tiempo de cierre automático (minutos)</Label>
                        <Input
                          id="autoLogoutTime"
                          type="number"
                          value={posConfig.autoLogoutTime}
                          onChange={(e) => handleChange("pos", "autoLogoutTime", e.target.value)}
                          placeholder="Ej: 30"
                        />
                        <p className="text-xs text-muted-foreground">
                          Tiempo de inactividad antes de cerrar sesión automáticamente (0 para desactivar)
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter>
              <Button onClick={saveConfig} className="ml-auto bg-[#0a2463] hover:bg-[#0a2463]/90">
                <Save className="mr-2 h-4 w-4" />
                Guardar Configuración General
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Pestaña de Configuración de Productos */}
        <TabsContent value="products" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package2 className="mr-2 h-5 w-5" />
                Configuración Central de Productos
              </CardTitle>
              <CardDescription>
                Gestiona cómo se comportan los productos en todas las plataformas (PDV, Web, SMS)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="product-types">
                  <AccordionTrigger>Tipos de Productos y Plataformas</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <h3 className="text-sm font-medium mb-2">Tipos de Productos Habilitados</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between space-y-0">
                            <div className="space-y-0.5">
                              <Label className="text-base">Productos Físicos</Label>
                              <p className="text-sm text-muted-foreground">
                                Productos tangibles que requieren envío o recogida
                              </p>
                            </div>
                            <Switch
                              checked={productConfig.enablePhysicalProducts}
                              onCheckedChange={(checked) => handleChange("product", "enablePhysicalProducts", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between space-y-0">
                            <div className="space-y-0.5">
                              <Label className="text-base">Productos Digitales</Label>
                              <p className="text-sm text-muted-foreground">
                                Productos descargables o accesibles en línea
                              </p>
                            </div>
                            <Switch
                              checked={productConfig.enableDigitalProducts}
                              onCheckedChange={(checked) => handleChange("product", "enableDigitalProducts", checked)}
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between space-y-0">
                            <div className="space-y-0.5">
                              <Label className="text-base">Servicios</Label>
                              <p className="text-sm text-muted-foreground">Servicios prestados por tiempo o proyecto</p>
                            </div>
                            <Switch
                              checked={productConfig.enableServices}
                              onCheckedChange={(checked) => handleChange("product", "enableServices", checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between space-y-0">
                            <div className="space-y-0.5">
                              <Label className="text-base">Suscripciones</Label>
                              <p className="text-sm text-muted-foreground">Productos o servicios con pago recurrente</p>
                            </div>
                            <Switch
                              checked={productConfig.enableSubscriptions}
                              onCheckedChange={(checked) => handleChange("product", "enableSubscriptions", checked)}
                            />
                          </div>
                        </div>
                      </div>

                      <Separator className="my-4" />
                      <h3 className="text-sm font-medium mb-2">Plataformas de Venta</h3>

                      <div className="space-y-2">
                        <Label>Plataformas Predeterminadas para Nuevos Productos</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="platform-pdv"
                              checked={productConfig.defaultPlatforms.includes("pdv")}
                              onCheckedChange={(checked) => {
                                const newPlatforms = checked
                                  ? [...productConfig.defaultPlatforms, "pdv"]
                                  : productConfig.defaultPlatforms.filter((p) => p !== "pdv")
                                handleChange("product", "defaultPlatforms", newPlatforms)
                              }}
                            />
                            <Label htmlFor="platform-pdv" className="font-normal">
                              Punto de Venta (PDV)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="platform-web"
                              checked={productConfig.defaultPlatforms.includes("web")}
                              onCheckedChange={(checked) => {
                                const newPlatforms = checked
                                  ? [...productConfig.defaultPlatforms, "web"]
                                  : productConfig.defaultPlatforms.filter((p) => p !== "web")
                                handleChange("product", "defaultPlatforms", newPlatforms)
                              }}
                            />
                            <Label htmlFor="platform-web" className="font-normal">
                              Tienda Web
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="platform-sms"
                              checked={productConfig.defaultPlatforms.includes("sms")}
                              onCheckedChange={(checked) => {
                                const newPlatforms = checked
                                  ? [...productConfig.defaultPlatforms, "sms"]
                                  : productConfig.defaultPlatforms.filter((p) => p !== "sms")
                                handleChange("product", "defaultPlatforms", newPlatforms)
                              }}
                            />
                            <Label htmlFor="platform-sms" className="font-normal">
                              Pagos por SMS
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between space-y-0 pt-4">
                        <div className="space-y-0.5">
                          <Label className="text-base">Mostrar en Todas las Plataformas por Defecto</Label>
                          <p className="text-sm text-muted-foreground">
                            Los nuevos productos estarán disponibles en todas las plataformas automáticamente
                          </p>
                        </div>
                        <Switch
                          checked={productConfig.showInAllPlatforms}
                          onCheckedChange={(checked) => handleChange("product", "showInAllPlatforms", checked)}
                        />
                      </div>

                      <div className="space-y-2 pt-4">
                        <Label htmlFor="defaultProductType">Tipo de Producto Predeterminado</Label>
                        <Select
                          value={productConfig.defaultProductType}
                          onValueChange={(value) => handleChange("product", "defaultProductType", value)}
                        >
                          <SelectTrigger id="defaultProductType">
                            <SelectValue placeholder="Selecciona un tipo predeterminado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="physical">Producto Físico</SelectItem>
                            <SelectItem value="digital">Producto Digital</SelectItem>
                            <SelectItem value="service">Servicio</SelectItem>
                            <SelectItem value="subscription">Suscripción</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="inventory">
                  <AccordionTrigger>Inventario y SKU</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between space-y-0">
                        <div className="space-y-0.5">
                          <Label className="text-base">Seguimiento de Inventario</Label>
                          <p className="text-sm text-muted-foreground">
                            Controla el stock de productos en todas las plataformas
                          </p>
                        </div>
                        <Switch
                          checked={productConfig.enableInventoryTracking}
                          onCheckedChange={(checked) => handleChange("product", "enableInventoryTracking", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between space-y-0">
                        <div className="space-y-0.5">
                          <Label className="text-base">Notificaciones de Stock Bajo</Label>
                          <p className="text-sm text-muted-foreground">
                            Recibe alertas cuando el stock esté por debajo del umbral
                          </p>
                        </div>
                        <Switch
                          checked={productConfig.lowStockNotification}
                          onCheckedChange={(checked) => handleChange("product", "lowStockNotification", checked)}
                        />
                      </div>

                      <div className="space-y-2 pt-2">
                        <Label htmlFor="lowStockThreshold">Umbral de Stock Bajo</Label>
                        <Input
                          id="lowStockThreshold"
                          type="number"
                          value={productConfig.lowStockThreshold}
                          onChange={(e) => handleChange("product", "lowStockThreshold", e.target.value)}
                          placeholder="Ej: 10"
                        />
                        <p className="text-xs text-muted-foreground">
                          Cantidad a partir de la cual se considera stock bajo
                        </p>
                      </div>

                      <Separator className="my-4" />
                      <h3 className="text-sm font-medium mb-2">Configuración de SKU</h3>

                      <div className="flex items-center justify-between space-y-0">
                        <div className="space-y-0.5">
                          <Label className="text-base">Requerir SKU</Label>
                          <p className="text-sm text-muted-foreground">Todos los productos deben tener un SKU único</p>
                        </div>
                        <Switch
                          checked={productConfig.requireSKU}
                          onCheckedChange={(checked) => handleChange("product", "requireSKU", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between space-y-0 pt-2">
                        <div className="space-y-0.5">
                          <Label className="text-base">Generar SKU Automáticamente</Label>
                          <p className="text-sm text-muted-foreground">Crea SKUs automáticos para nuevos productos</p>
                        </div>
                        <Switch
                          checked={productConfig.autoGenerateSKU}
                          onCheckedChange={(checked) => handleChange("product", "autoGenerateSKU", checked)}
                        />
                      </div>

                      <div className="space-y-2 pt-2">
                        <Label htmlFor="skuPrefix">Prefijo de SKU</Label>
                        <Input
                          id="skuPrefix"
                          value={productConfig.skuPrefix}
                          onChange={(e) => handleChange("product", "skuPrefix", e.target.value)}
                          placeholder="Ej: KP-"
                        />
                        <p className="text-xs text-muted-foreground">
                          Prefijo que se añadirá a los SKUs generados automáticamente
                        </p>
                      </div>

                      <div className="flex items-center justify-between space-y-0 pt-4">
                        <div className="space-y-0.5">
                          <Label className="text-base">Habilitar Variantes de Productos</Label>
                          <p className="text-sm text-muted-foreground">
                            Permite crear variantes (talla, color, etc.) para los productos
                          </p>
                        </div>
                        <Switch
                          checked={productConfig.enableVariants}
                          onCheckedChange={(checked) => handleChange("product", "enableVariants", checked)}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="shipping">
                  <AccordionTrigger>Envío y Entrega</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between space-y-0">
                        <div className="space-y-0.5">
                          <Label className="text-base">Habilitar Envío</Label>
                          <p className="text-sm text-muted-foreground">
                            Permite enviar productos físicos a los clientes
                          </p>
                        </div>
                        <Switch
                          checked={productConfig.enableShipping}
                          onCheckedChange={(checked) => handleChange("product", "enableShipping", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between space-y-0">
                        <div className="space-y-0.5">
                          <Label className="text-base">Habilitar Recogida</Label>
                          <p className="text-sm text-muted-foreground">
                            Permite a los clientes recoger productos en tienda
                          </p>
                        </div>
                        <Switch
                          checked={productConfig.enablePickup}
                          onCheckedChange={(checked) => handleChange("product", "enablePickup", checked)}
                        />
                      </div>

                      <div className="space-y-2 pt-2">
                        <Label htmlFor="defaultShippingFee">Tarifa de Envío Predeterminada</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5">$</span>
                          <Input
                            id="defaultShippingFee"
                            type="text"
                            value={productConfig.defaultShippingFee}
                            onChange={(e) => handleChange("product", "defaultShippingFee", e.target.value)}
                            placeholder="0.00"
                            className="pl-7"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Costo de envío predeterminado para productos físicos
                        </p>
                      </div>

                      <div className="flex items-center justify-between space-y-0 pt-4">
                        <div className="space-y-0.5">
                          <Label className="text-base">Impuestos por Tipo de Producto</Label>
                          <p className="text-sm text-muted-foreground">
                            Aplica diferentes tasas de impuestos según el tipo de producto
                          </p>
                        </div>
                        <Switch
                          checked={productConfig.taxByProductType}
                          onCheckedChange={(checked) => handleChange("product", "taxByProductType", checked)}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="advanced">
                  <AccordionTrigger>Opciones Avanzadas</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between space-y-0">
                        <div className="space-y-0.5">
                          <Label className="text-base">Requerir Aprobación de Productos</Label>
                          <p className="text-sm text-muted-foreground">
                            Los nuevos productos requieren aprobación antes de publicarse
                          </p>
                        </div>
                        <Switch
                          checked={productConfig.requireProductApproval}
                          onCheckedChange={(checked) => handleChange("product", "requireProductApproval", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between space-y-0">
                        <div className="space-y-0.5">
                          <Label className="text-base">Habilitar Reseñas de Productos</Label>
                          <p className="text-sm text-muted-foreground">
                            Permite a los clientes dejar reseñas en los productos
                          </p>
                        </div>
                        <Switch
                          checked={productConfig.enableProductReviews}
                          onCheckedChange={(checked) => handleChange("product", "enableProductReviews", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between space-y-0">
                        <div className="space-y-0.5">
                          <Label className="text-base">Importación de Productos</Label>
                          <p className="text-sm text-muted-foreground">Permite importar productos desde CSV o Excel</p>
                        </div>
                        <Switch
                          checked={productConfig.enableProductImport}
                          onCheckedChange={(checked) => handleChange("product", "enableProductImport", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between space-y-0">
                        <div className="space-y-0.5">
                          <Label className="text-base">Exportación de Productos</Label>
                          <p className="text-sm text-muted-foreground">Permite exportar productos a CSV o Excel</p>
                        </div>
                        <Switch
                          checked={productConfig.enableProductExport}
                          onCheckedChange={(checked) => handleChange("product", "enableProductExport", checked)}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter>
              <Button onClick={saveConfig} className="ml-auto bg-[#0a2463] hover:bg-[#0a2463]/90">
                <Save className="mr-2 h-4 w-4" />
                Guardar Configuración de Productos
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Pestaña de Información de Empresa */}
        <TabsContent value="company" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                Información Fiscal y de Empresa
              </CardTitle>
              <CardDescription>
                Esta información aparecerá en tus facturas, tickets y documentos oficiales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nombre de la Empresa *</Label>
                  <Input
                    id="companyName"
                    value={companyConfig.companyName}
                    onChange={(e) => handleChange("company", "companyName", e.target.value)}
                    placeholder="Nombre legal de tu empresa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">NIF/CIF *</Label>
                  <Input
                    id="taxId"
                    value={companyConfig.taxId}
                    onChange={(e) => handleChange("company", "taxId", e.target.value)}
                    placeholder="Identificación fiscal"
                  />
                </div>
              </div>

              <Separator className="my-4" />
              <h3 className="text-sm font-medium mb-2">Dirección Fiscal</h3>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección *</Label>
                <Input
                  id="address"
                  value={companyConfig.address}
                  onChange={(e) => handleChange("company", "address", e.target.value)}
                  placeholder="Calle y número"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input
                    id="city"
                    value={companyConfig.city}
                    onChange={(e) => handleChange("company", "city", e.target.value)}
                    placeholder="Ciudad"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Provincia/Estado *</Label>
                  <Input
                    id="state"
                    value={companyConfig.state}
                    onChange={(e) => handleChange("company", "state", e.target.value)}
                    placeholder="Provincia o estado"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Código Postal *</Label>
                  <Input
                    id="postalCode"
                    value={companyConfig.postalCode}
                    onChange={(e) => handleChange("company", "postalCode", e.target.value)}
                    placeholder="Código postal"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">País *</Label>
                <Input
                  id="country"
                  value={companyConfig.country}
                  onChange={(e) => handleChange("company", "country", e.target.value)}
                  placeholder="País"
                />
              </div>

              <Separator className="my-4" />
              <h3 className="text-sm font-medium mb-2">Información de Contacto</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={companyConfig.phone}
                    onChange={(e) => handleChange("company", "phone", e.target.value)}
                    placeholder="Teléfono de contacto"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={companyConfig.email}
                    onChange={(e) => handleChange("company", "email", e.target.value)}
                    placeholder="Email de contacto"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Sitio Web</Label>
                <Input
                  id="website"
                  value={companyConfig.website}
                  onChange={(e) => handleChange("company", "website", e.target.value)}
                  placeholder="Sitio web (opcional)"
                />
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Los campos marcados con * son obligatorios para la emisión de facturas válidas.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Pestaña de Facturación */}
        <TabsContent value="invoice" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Configuración de Facturación
              </CardTitle>
              <CardDescription>Configura cómo se generan y numeran tus facturas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoicePrefix">Prefijo de Factura</Label>
                  <Input
                    id="invoicePrefix"
                    value={invoiceConfig.invoicePrefix}
                    onChange={(e) => handleChange("invoice", "invoicePrefix", e.target.value)}
                    placeholder="Ej: FACT-"
                  />
                  <p className="text-xs text-muted-foreground">Este prefijo aparecerá antes del número de factura</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextInvoiceNumber">Próximo Número de Factura</Label>
                  <Input
                    id="nextInvoiceNumber"
                    value={invoiceConfig.nextInvoiceNumber}
                    onChange={(e) => handleChange("invoice", "nextInvoiceNumber", e.target.value)}
                    placeholder="Ej: 0001"
                  />
                  <p className="text-xs text-muted-foreground">El sistema incrementará automáticamente este número</p>
                </div>
              </div>

              <div className="flex items-center justify-between space-y-0 pt-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Generar Facturas Automáticamente</Label>
                  <p className="text-sm text-muted-foreground">Crear facturas para todas las ventas</p>
                </div>
                <Switch
                  checked={invoiceConfig.autoGenerateInvoice}
                  onCheckedChange={(checked) => handleChange("invoice", "autoGenerateInvoice", checked)}
                />
              </div>

              <Separator className="my-4" />
              <h3 className="text-sm font-medium mb-2">Plazos y Condiciones</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceDueDays">Días para Vencimiento</Label>
                  <Input
                    id="invoiceDueDays"
                    type="number"
                    value={invoiceConfig.invoiceDueDays}
                    onChange={(e) => handleChange("invoice", "invoiceDueDays", e.target.value)}
                    placeholder="Ej: 30"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <Switch
                    id="showDueDate"
                    checked={invoiceConfig.showDueDate}
                    onCheckedChange={(checked) => handleChange("invoice", "showDueDate", checked)}
                  />
                  <Label htmlFor="showDueDate">Mostrar fecha de vencimiento en facturas</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceNotes">Notas en Facturas</Label>
                <Textarea
                  id="invoiceNotes"
                  value={invoiceConfig.invoiceNotes}
                  onChange={(e) => handleChange("invoice", "invoiceNotes", e.target.value)}
                  placeholder="Estas notas aparecerán en todas las facturas"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="termsAndConditions">Términos y Condiciones</Label>
                <Textarea
                  id="termsAndConditions"
                  value={invoiceConfig.termsAndConditions}
                  onChange={(e) => handleChange("invoice", "termsAndConditions", e.target.value)}
                  placeholder="Términos y condiciones que aparecerán en las facturas"
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveConfig} className="ml-auto bg-[#0a2463] hover:bg-[#0a2463]/90">
                <Save className="mr-2 h-4 w-4" />
                Guardar Configuración de Facturación
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Pestaña de Impuestos */}
        <TabsContent value="tax" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Percent className="mr-2 h-5 w-5" />
                Configuración de Impuestos
              </CardTitle>
              <CardDescription>Configura los tipos de impuestos y cómo se aplican a tus productos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-y-0">
                <div className="space-y-0.5">
                  <Label className="text-base">Precios con Impuestos Incluidos</Label>
                  <p className="text-sm text-muted-foreground">Los precios mostrados ya incluyen impuestos</p>
                </div>
                <Switch
                  checked={taxConfig.taxIncluded}
                  onCheckedChange={(checked) => handleChange("tax", "taxIncluded", checked)}
                />
              </div>

              <Separator className="my-4" />
              <h3 className="text-sm font-medium mb-2">Tasas de Impuestos</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="generalTaxRate">Tasa General (%)</Label>
                  <div className="relative">
                    <Input
                      id="generalTaxRate"
                      type="number"
                      value={taxConfig.generalTaxRate}
                      onChange={(e) => handleChange("tax", "generalTaxRate", e.target.value)}
                      placeholder="Ej: 16"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Percent className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reducedTaxRate">Tasa Reducida (%)</Label>
                  <div className="relative">
                    <Input
                      id="reducedTaxRate"
                      type="number"
                      value={taxConfig.reducedTaxRate}
                      onChange={(e) => handleChange("tax", "reducedTaxRate", e.target.value)}
                      placeholder="Ej: 8"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Percent className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zeroTaxRate">Tasa Cero (%)</Label>
                  <div className="relative">
                    <Input
                      id="zeroTaxRate"
                      type="number"
                      value={taxConfig.zeroTaxRate}
                      onChange={(e) => handleChange("tax", "zeroTaxRate", e.target.value)}
                      placeholder="Ej: 0"
                      disabled
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Percent className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between space-y-0 pt-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Aplicar Impuestos a Todos los Productos</Label>
                  <p className="text-sm text-muted-foreground">
                    Si está desactivado, podrás elegir qué productos tienen impuestos
                  </p>
                </div>
                <Switch
                  checked={taxConfig.applyTaxToAll}
                  onCheckedChange={(checked) => handleChange("tax", "applyTaxToAll", checked)}
                />
              </div>

              <div className="flex items-center justify-between space-y-0 pt-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Mostrar Desglose de Impuestos</Label>
                  <p className="text-sm text-muted-foreground">
                    Muestra el desglose de impuestos en facturas y tickets
                  </p>
                </div>
                <Switch
                  checked={taxConfig.showTaxBreakdown}
                  onCheckedChange={(checked) => handleChange("tax", "showTaxBreakdown", checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveConfig} className="ml-auto bg-[#0a2463] hover:bg-[#0a2463]/90">
                <Save className="mr-2 h-4 w-4" />
                Guardar Configuración de Impuestos
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Pestaña de Impresora */}
        <TabsContent value="printer" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Printer className="mr-2 h-5 w-5" />
                Configuración de Impresora
              </CardTitle>
              <CardDescription>Configura tu impresora para tickets y facturas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-y-0">
                <div className="space-y-0.5">
                  <Label className="text-base">Impresora Habilitada</Label>
                  <p className="text-sm text-muted-foreground">Activar o desactivar la impresión automática</p>
                </div>
                <Switch
                  checked={printerConfig.enabled}
                  onCheckedChange={(checked) => handleChange("printer", "enabled", checked)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="printerType">Tipo de Impresora</Label>
                  <Select value={printerConfig.type} onValueChange={(value) => handleChange("printer", "type", value)}>
                    <SelectTrigger id="printerType">
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thermal">Térmica</SelectItem>
                      <SelectItem value="inkjet">Inyección de Tinta</SelectItem>
                      <SelectItem value="laser">Láser</SelectItem>
                      <SelectItem value="dot-matrix">Matriz de Puntos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="printerModel">Modelo de Impresora</Label>
                  <Input
                    id="printerModel"
                    value={printerConfig.model}
                    onChange={(e) => handleChange("printer", "model", e.target.value)}
                    placeholder="Ej: EPSON TM-T20III"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="printerConnection">Tipo de Conexión</Label>
                <Select
                  value={printerConfig.connection}
                  onValueChange={(value) => handleChange("printer", "connection", value)}
                >
                  <SelectTrigger id="printerConnection">
                    <SelectValue placeholder="Selecciona un tipo de conexión" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usb">USB</SelectItem>
                    <SelectItem value="network">Red (Ethernet/WiFi)</SelectItem>
                    <SelectItem value="bluetooth">Bluetooth</SelectItem>
                    <SelectItem value="serial">Puerto Serial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {printerConfig.connection === "network" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="printerIp">Dirección IP</Label>
                    <Input
                      id="printerIp"
                      value={printerConfig.ipAddress}
                      onChange={(e) => handleChange("printer", "ipAddress", e.target.value)}
                      placeholder="Ej: 192.168.1.100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="printerPort">Puerto</Label>
                    <Input
                      id="printerPort"
                      value={printerConfig.port}
                      onChange={(e) => handleChange("printer", "port", e.target.value)}
                      placeholder="Ej: 9100"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <Label htmlFor="paperWidth">Ancho del Papel (mm)</Label>
                <Select
                  value={printerConfig.paperWidth}
                  onValueChange={(value) => handleChange("printer", "paperWidth", value)}
                >
                  <SelectTrigger id="paperWidth">
                    <SelectValue placeholder="Selecciona el ancho del papel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="58">58mm</SelectItem>
                    <SelectItem value="80">80mm</SelectItem>
                    <SelectItem value="112">112mm (A6)</SelectItem>
                    <SelectItem value="210">210mm (A4)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between space-y-0 pt-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Imprimir Logo</Label>
                  <p className="text-sm text-muted-foreground">Incluir el logo de la empresa en los tickets</p>
                </div>
                <Switch
                  checked={printerConfig.printLogo}
                  onCheckedChange={(checked) => handleChange("printer", "printLogo", checked)}
                />
              </div>

              <div className="flex items-center justify-between space-y-0 pt-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Imprimir Duplicado</Label>
                  <p className="text-sm text-muted-foreground">
                    Imprimir una copia para el cliente y otra para el comercio
                  </p>
                </div>
                <Switch
                  checked={printerConfig.printDuplicate}
                  onCheckedChange={(checked) => handleChange("printer", "printDuplicate", checked)}
                />
              </div>

              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  Imprimir Página de Prueba
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveConfig} className="ml-auto bg-[#0a2463] hover:bg-[#0a2463]/90">
                <Save className="mr-2 h-4 w-4" />
                Guardar Configuración de Impresora
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Pestaña de Pagos */}
        <TabsContent value="payment" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Configuración de Métodos de Pago
              </CardTitle>
              <CardDescription>Configura los métodos de pago aceptados en tu punto de venta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <Label className="text-base">Efectivo</Label>
                      <p className="text-sm text-muted-foreground">Aceptar pagos en efectivo</p>
                    </div>
                    <Switch
                      checked={paymentConfig.acceptCash}
                      onCheckedChange={(checked) => handleChange("payment", "acceptCash", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <Label className="text-base">Tarjeta</Label>
                      <p className="text-sm text-muted-foreground">Aceptar pagos con tarjeta de crédito/débito</p>
                    </div>
                    <Switch
                      checked={paymentConfig.acceptCard}
                      onCheckedChange={(checked) => handleChange("payment", "acceptCard", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <Label className="text-base">Criptomonedas</Label>
                      <p className="text-sm text-muted-foreground">Aceptar pagos con criptomonedas (KII, BTC, ETH)</p>
                    </div>
                    <Switch
                      checked={paymentConfig.acceptCrypto}
                      onCheckedChange={(checked) => handleChange("payment", "acceptCrypto", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <Label className="text-base">Transferencia Bancaria</Label>
                      <p className="text-sm text-muted-foreground">Aceptar pagos por transferencia bancaria</p>
                    </div>
                    <Switch
                      checked={paymentConfig.acceptTransfer}
                      onCheckedChange={(checked) => handleChange("payment", "acceptTransfer", checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultPaymentMethod">Método de Pago Predeterminado</Label>
                    <Select
                      value={paymentConfig.defaultPaymentMethod}
                      onValueChange={(value) => handleChange("payment", "defaultPaymentMethod", value)}
                    >
                      <SelectTrigger id="defaultPaymentMethod">
                        <SelectValue placeholder="Selecciona un método predeterminado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Efectivo</SelectItem>
                        <SelectItem value="card">Tarjeta</SelectItem>
                        <SelectItem value="crypto">Criptomoneda</SelectItem>
                        <SelectItem value="transfer">Transferencia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between space-y-0 pt-4">
                    <div className="space-y-0.5">
                      <Label className="text-base">Permitir Múltiples Métodos de Pago</Label>
                      <p className="text-sm text-muted-foreground">
                        Permitir pagar una venta con varios métodos de pago
                      </p>
                    </div>
                    <Switch
                      checked={paymentConfig.allowMultiplePaymentMethods}
                      onCheckedChange={(checked) => handleChange("payment", "allowMultiplePaymentMethods", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between space-y-0 pt-2">
                    <div className="space-y-0.5">
                      <Label className="text-base">Requerir Pago para Completar Venta</Label>
                      <p className="text-sm text-muted-foreground">
                        No permitir completar una venta sin registrar el pago
                      </p>
                    </div>
                    <Switch
                      checked={paymentConfig.requirePaymentToComplete}
                      onCheckedChange={(checked) => handleChange("payment", "requirePaymentToComplete", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveConfig} className="ml-auto bg-[#0a2463] hover:bg-[#0a2463]/90">
                <Save className="mr-2 h-4 w-4" />
                Guardar Configuración de Pagos
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Pestaña de Tickets */}
        <TabsContent value="receipt" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Receipt className="mr-2 h-5 w-5" />
                Configuración de Tickets
              </CardTitle>
              <CardDescription>Personaliza la apariencia y contenido de los tickets de venta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <Label className="text-base">Mostrar Logo</Label>
                      <p className="text-sm text-muted-foreground">Incluir el logo de la empresa en los tickets</p>
                    </div>
                    <Switch
                      checked={receiptConfig.showLogo}
                      onCheckedChange={(checked) => handleChange("receipt", "showLogo", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <Label className="text-base">Mostrar NIF/CIF</Label>
                      <p className="text-sm text-muted-foreground">Incluir el identificador fiscal en los tickets</p>
                    </div>
                    <Switch
                      checked={receiptConfig.showTaxId}
                      onCheckedChange={(checked) => handleChange("receipt", "showTaxId", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <Label className="text-base">Mostrar Precio Unitario</Label>
                      <p className="text-sm text-muted-foreground">Mostrar el precio unitario de cada artículo</p>
                    </div>
                    <Switch
                      checked={receiptConfig.showItemPrice}
                      onCheckedChange={(checked) => handleChange("receipt", "showItemPrice", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <Label className="text-base">Mostrar Descuentos</Label>
                      <p className="text-sm text-muted-foreground">Mostrar los descuentos aplicados a cada artículo</p>
                    </div>
                    <Switch
                      checked={receiptConfig.showDiscounts}
                      onCheckedChange={(checked) => handleChange("receipt", "showDiscounts", checked)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <Label className="text-base">Mostrar Desglose de Impuestos</Label>
                      <p className="text-sm text-muted-foreground">Incluir el desglose de impuestos en los tickets</p>
                    </div>
                    <Switch
                      checked={receiptConfig.showTaxBreakdown}
                      onCheckedChange={(checked) => handleChange("receipt", "showTaxBreakdown", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <Label className="text-base">Imprimir Copia para Cliente</Label>
                      <p className="text-sm text-muted-foreground">Imprimir una copia del ticket para el cliente</p>
                    </div>
                    <Switch
                      checked={receiptConfig.printCustomerCopy}
                      onCheckedChange={(checked) => handleChange("receipt", "printCustomerCopy", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between space-y-0">
                    <div className="space-y-0.5">
                      <Label className="text-base">Imprimir Copia para Comercio</Label>
                      <p className="text-sm text-muted-foreground">Imprimir una copia del ticket para el comercio</p>
                    </div>
                    <Switch
                      checked={receiptConfig.printMerchantCopy}
                      onCheckedChange={(checked) => handleChange("receipt", "printMerchantCopy", checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Label htmlFor="footerText">Texto de Pie de Página</Label>
                <Textarea
                  id="footerText"
                  value={receiptConfig.footerText}
                  onChange={(e) => handleChange("receipt", "footerText", e.target.value)}
                  placeholder="Texto que aparecerá al final de cada ticket"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Puedes incluir mensajes de agradecimiento, políticas de devolución, etc.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveConfig} className="ml-auto bg-[#0a2463] hover:bg-[#0a2463]/90">
                <Save className="mr-2 h-4 w-4" />
                Guardar Configuración de Tickets
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Pestaña de Integración */}
        <TabsContent value="integration" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="mr-2 h-5 w-5" />
                Integración y Múltiples Terminales
              </CardTitle>
              <CardDescription>
                Configura cómo integrar el PDV en otros sitios y gestiona múltiples terminales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="embed">
                  <AccordionTrigger>Integración Web</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between space-y-0">
                        <div className="space-y-0.5">
                          <Label className="text-base">Permitir Embebido</Label>
                          <p className="text-sm text-muted-foreground">Permite integrar el PDV en otros sitios web</p>
                        </div>
                        <Switch
                          checked={integrationConfig.enableEmbedding}
                          onCheckedChange={(checked) => handleChange("integration", "enableEmbedding", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between space-y-0">
                        <div className="space-y-0.5">
                          <Label className="text-base">Permitir Acceso Externo</Label>
                          <p className="text-sm text-muted-foreground">
                            Permite acceder al PDV desde dominios externos
                          </p>
                        </div>
                        <Switch
                          checked={integrationConfig.allowExternalAccess}
                          onCheckedChange={(checked) => handleChange("integration", "allowExternalAccess", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between space-y-0">
                        <div className="space-y-0.5">
                          <Label className="text-base">Permitir CORS</Label>
                          <p className="text-sm text-muted-foreground">Habilita el acceso desde orígenes cruzados</p>
                        </div>
                        <Switch
                          checked={integrationConfig.allowCrossOrigin}
                          onCheckedChange={(checked) => handleChange("integration", "allowCrossOrigin", checked)}
                        />
                      </div>

                      <div className="space-y-2 pt-2">
                        <Label htmlFor="allowedDomains">Dominios Permitidos</Label>
                        <Input
                          id="allowedDomains"
                          value={integrationConfig.allowedDomains}
                          onChange={(e) => handleChange("integration", "allowedDomains", e.target.value)}
                          placeholder="* para todos, o lista separada por comas"
                        />
                        <p className="text-xs text-muted-foreground">
                          Especifica qué dominios pueden embeber el PDV (ej: tudominio.com,otrodominio.com)
                        </p>
                      </div>

                      <Separator className="my-4" />
                      <h3 className="text-sm font-medium mb-2">Código de Integración</h3>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="iframeCode">Integración con iframe</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(iframeCode)}
                            className="flex items-center gap-1"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            Copiar
                          </Button>
                        </div>
                        <div className="relative">
                          <pre className="bg-slate-100 p-4 rounded-md text-xs overflow-x-auto">{iframeCode}</pre>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Copia este código para embeber el PDV en tu sitio web usando un iframe
                        </p>
                      </div>

                      <div className="space-y-2 pt-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="jsCode">Integración con JavaScript</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(jsCode)}
                            className="flex items-center gap-1"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            Copiar
                          </Button>
                        </div>
                        <div className="relative">
                          <pre className="bg-slate-100 p-4 rounded-md text-xs overflow-x-auto">{jsCode}</pre>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Copia este código para embeber el PDV en tu sitio web usando JavaScript
                        </p>
                      </div>

                      <div className="pt-4">
                        <Button variant="outline" className="w-full" asChild>
                          <a
                            href="https://docs.kiipay.com/pos/integration"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Ver documentación completa de integración
                          </a>
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="api">
                  <AccordionTrigger>API y Conexiones</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between space-y-0">
                        <div className="space-y-0.5">
                          <Label className="text-base">Habilitar API</Label>
                          <p className="text-sm text-muted-foreground">
                            Permite el acceso programático al PDV mediante API
                          </p>
                        </div>
                        <Switch
                          checked={integrationConfig.apiEnabled}
                          onCheckedChange={(checked) => handleChange("integration", "apiEnabled", checked)}
                        />
                      </div>

                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="apiKey">Clave de API</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(integrationConfig.apiKey)}
                            className="flex items-center gap-1"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            Copiar
                          </Button>
                        </div>
                        <div className="relative">
                          <Input
                            id="apiKey"
                            value={integrationConfig.apiKey}
                            readOnly
                            className="pr-24 font-mono text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1 h-7"
                            onClick={() =>
                              handleChange("integration", "apiKey", "kp_" + Math.random().toString(36).substring(2, 15))
                            }
                          >
                            Regenerar
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Esta clave es necesaria para autenticar las solicitudes a la API
                        </p>
                      </div>

                      <Separator className="my-4" />
                      <h3 className="text-sm font-medium mb-2">Configuración de Sincronización</h3>

                      <div className="space-y-2">
                        <Label htmlFor="syncInterval">Intervalo de Sincronización (minutos)</Label>
                        <Input
                          id="syncInterval"
                          type="number"
                          value={integrationConfig.syncInterval}
                          onChange={(e) => handleChange("integration", "syncInterval", e.target.value)}
                          placeholder="Ej: 5"
                        />
                        <p className="text-xs text-muted-foreground">
                          Frecuencia con la que los terminales sincronizarán datos con el servidor
                        </p>
                      </div>

                      <div className="flex items-center justify-between space-y-0 pt-4">
                        <div className="space-y-0.5">
                          <Label className="text-base">Modo Offline</Label>
                          <p className="text-sm text-muted-foreground">
                            Permite que el PDV funcione sin conexión a internet
                          </p>
                        </div>
                        <Switch
                          checked={integrationConfig.offlineMode}
                          onCheckedChange={(checked) => handleChange("integration", "offlineMode", checked)}
                        />
                      </div>

                      <div className="space-y-2 pt-2">
                        <Label htmlFor="maxOfflineTransactions">Máximo de Transacciones Offline</Label>
                        <Input
                          id="maxOfflineTransactions"
                          type="number"
                          value={integrationConfig.maxOfflineTransactions}
                          onChange={(e) => handleChange("integration", "maxOfflineTransactions", e.target.value)}
                          placeholder="Ej: 100"
                        />
                        <p className="text-xs text-muted-foreground">
                          Número máximo de transacciones que se pueden realizar sin conexión
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="terminals">
                  <AccordionTrigger>Múltiples Terminales</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between space-y-0">
                        <div className="space-y-0.5">
                          <Label className="text-base">Habilitar Múltiples Terminales</Label>
                          <p className="text-sm text-muted-foreground">
                            Permite usar el PDV en múltiples dispositivos simultáneamente
                          </p>
                        </div>
                        <Switch
                          checked={terminalConfig.enableMultipleTerminals}
                          onCheckedChange={(checked) => handleChange("terminal", "enableMultipleTerminals", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between space-y-0">
                        <div className="space-y-0.5">
                          <Label className="text-base">Inventario Centralizado</Label>
                          <p className="text-sm text-muted-foreground">
                            Mantiene un inventario único compartido entre todos los terminales
                          </p>
                        </div>
                        <Switch
                          checked={terminalConfig.centralizedInventory}
                          onCheckedChange={(checked) => handleChange("terminal", "centralizedInventory", checked)}
                        />
                      </div>

                      <div className="space-y-2 pt-2">
                        <Label htmlFor="terminalPrefix">Prefijo de Terminal</Label>
                        <Input
                          id="terminalPrefix"
                          value={terminalConfig.terminalPrefix}
                          onChange={(e) => handleChange("terminal", "terminalPrefix", e.target.value)}
                          placeholder="Ej: CAJA-"
                        />
                        <p className="text-xs text-muted-foreground">
                          Prefijo para identificar cada terminal (seguido de un número)
                        </p>
                      </div>

                      <div className="flex items-center justify-between space-y-0 pt-4">
                        <div className="space-y-0.5">
                          <Label className="text-base">Sincronizar en cada Transacción</Label>
                          <p className="text-sm text-muted-foreground">
                            Sincroniza datos con el servidor después de cada venta
                          </p>
                        </div>
                        <Switch
                          checked={terminalConfig.syncOnTransaction}
                          onCheckedChange={(checked) => handleChange("terminal", "syncOnTransaction", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between space-y-0">
                        <div className="space-y-0.5">
                          <Label className="text-base">Requerir Autenticación por Terminal</Label>
                          <p className="text-sm text-muted-foreground">
                            Cada terminal requiere credenciales específicas
                          </p>
                        </div>
                        <Switch
                          checked={terminalConfig.requireTerminalAuth}
                          onCheckedChange={(checked) => handleChange("terminal", "requireTerminalAuth", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between space-y-0">
                        <div className="space-y-0.5">
                          <Label className="text-base">Mostrar ID de Terminal</Label>
                          <p className="text-sm text-muted-foreground">
                            Muestra el identificador del terminal en la interfaz
                          </p>
                        </div>
                        <Switch
                          checked={terminalConfig.showTerminalId}
                          onCheckedChange={(checked) => handleChange("terminal", "showTerminalId", checked)}
                        />
                      </div>

                      <Separator className="my-4" />
                      <h3 className="text-sm font-medium mb-2">Terminales Activos</h3>

                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
                              <TableHead>Nombre</TableHead>
                              <TableHead>Ubicación</TableHead>
                              <TableHead>Estado</TableHead>
                              <TableHead>Última Sincronización</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {terminals.map((terminal) => (
                              <TableRow key={terminal.id}>
                                <TableCell className="font-medium">{terminal.id}</TableCell>
                                <TableCell>{terminal.name}</TableCell>
                                <TableCell>{terminal.location}</TableCell>
                                <TableCell>
                                  <Badge
                                    className={`${
                                      terminal.status === "active"
                                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                                        : "bg-slate-100 text-slate-800 hover:bg-slate-100"
                                    }`}
                                  >
                                    {terminal.status === "active" ? "Activo" : "Inactivo"}
                                  </Badge>
                                </TableCell>
                                <TableCell>{terminal.lastSync}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <div className="pt-4">
                        <Button variant="outline" className="w-full" onClick={addNewTerminal}>
                          <Laptop className="mr-2 h-4 w-4" />
                          Añadir Nuevo Terminal
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter>
              <Button onClick={saveConfig} className="ml-auto bg-[#0a2463] hover:bg-[#0a2463]/90">
                <Save className="mr-2 h-4 w-4" />
                Guardar Configuración de Integración
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
