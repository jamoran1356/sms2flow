"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  CreditCard,
  Home,
  Package,
  Settings,
  ShoppingCart,
  Users,
  MessageSquare,
  LogOut,
  Menu,
  Wallet,
  Shield,
  Layers,
  FileText,
  Truck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(false)

  // Comentado para desarrollo: Eliminamos la redirección a login
  // useEffect(() => {
  //   // Simulación de verificación de autenticación
  //   const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
  //   if (!isAuthenticated) {
  //     window.location.href = "/login"
  //   }
  // }, [])

  // Estructura del menú con categorías
  const menuCategories = [
    {
      title: "PRINCIPAL",
      items: [
        {
          title: "Panel",
          href: "/dashboard",
          icon: Home,
          variant: "ghost",
        },
        {
          title: "Transacciones",
          href: "/dashboard/transactions",
          icon: CreditCard,
          variant: "ghost",
        },
        {
          title: "Clientes",
          href: "/dashboard/customers",
          icon: Users,
          variant: "ghost",
        },
        {
          title: "Staking",
          href: "/dashboard/staking",
          icon: BarChart3,
          variant: "ghost",
        },
      ],
    },
    {
      title: "PAGOS",
      items: [
        {
          title: "Pagos SMS",
          href: "/dashboard/sms-payments",
          icon: MessageSquare,
          variant: "ghost",
        },
        {
          title: "Billetera",
          href: "/dashboard/wallet",
          icon: Wallet,
          variant: "ghost",
        },
      ],
    },
    {
      title: "PDV",
      items: [
        {
          title: "Panel PDV",
          href: "/dashboard/pos",
          icon: Home,
          variant: "ghost",
        },
        {
          title: "Inventario",
          href: "/dashboard/pos/inventory",
          icon: Package,
          variant: "ghost",
        },
        {
          title: "Ventas",
          href: "/dashboard/pos/sales",
          icon: ShoppingCart,
          variant: "ghost",
        },
        {
          title: "Nueva Venta",
          href: "/dashboard/pos/new-sale",
          icon: CreditCard,
          variant: "ghost",
        },
        {
          title: "Informes",
          href: "/dashboard/pos/reports",
          icon: FileText,
          variant: "ghost",
        },
        {
          title: "Contabilidad",
          href: "/dashboard/pos/accounting",
          icon: Layers,
          variant: "ghost",
        },
        {
          title: "Proveedores",
          href: "/dashboard/pos/providers",
          icon: Truck,
          variant: "ghost",
        },
      ],
    },
    {
      title: "CUENTA",
      items: [
        {
          title: "Configuración",
          href: "/dashboard/settings",
          icon: Settings,
          variant: "ghost",
        },
        {
          title: "Seguridad",
          href: "/dashboard/settings/security",
          icon: Shield,
          variant: "ghost",
        },
        {
          title: "Perfil",
          href: "/dashboard/profile",
          icon: Users,
          variant: "ghost",
        },
      ],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0">
            <div className="p-6 border-b">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/images/logo.webp" alt="Kiipay Logo" width={120} height={40} priority />
              </Link>
            </div>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-6 p-4">
                {menuCategories.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">{category.title}</div>
                    {category.items.map((item, itemIndex) => (
                      <Button
                        key={itemIndex}
                        variant={pathname === item.href ? "secondary" : item.variant}
                        size="sm"
                        className="w-full justify-start gap-2"
                        asChild
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          {item.title}
                        </Link>
                      </Button>
                    ))}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="border-t p-4">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
                <Link href="/login">
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 md:ml-0">
          <Image src="/images/logo.webp" alt="Kiipay Logo" width={120} height={40} priority />
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="hidden md:flex" asChild>
            <Link href="/login">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Link>
          </Button>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 shrink-0 border-r md:block">
          <ScrollArea className="h-[calc(100vh-4rem)] py-6">
            <div className="px-4 space-y-6">
              {menuCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">{category.title}</div>
                  {category.items.map((item, itemIndex) => (
                    <Button
                      key={itemIndex}
                      variant={pathname === item.href ? "secondary" : item.variant}
                      size="sm"
                      className="w-full justify-start gap-2"
                      asChild
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </Link>
                    </Button>
                  ))}
                </div>
              ))}
            </div>
          </ScrollArea>
        </aside>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
