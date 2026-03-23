"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { BarChart3, CreditCard, Home, Settings, Users, MessageSquare, LogOut, Menu, Wallet, Shield, Store, Bell } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useIsMobile } from "@/hooks/use-mobile"

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  const menuCategories = [
    {
      title: "PRINCIPAL",
      items: [
        { title: "Panel", href: "/dashboard", icon: Home },
        { title: "Transacciones", href: "/dashboard/transactions", icon: CreditCard },
        { title: "Usuarios SMS", href: "/dashboard/customers", icon: Users },
        { title: "Staking", href: "/dashboard/staking", icon: BarChart3 },
      ],
    },
    {
      title: "PAGOS",
      items: [
        { title: "Pagos SMS", href: "/dashboard/sms-payments", icon: MessageSquare },
        { title: "Billetera", href: "/dashboard/wallet", icon: Wallet },
        { title: "Punto de Venta", href: "/dashboard/pos", icon: Store },
      ],
    },
    {
      title: "CUENTA",
      items: [
        { title: "Configuración", href: "/dashboard/settings", icon: Settings },
        { title: "Perfil", href: "/dashboard/profile", icon: Users },
      ],
    },
  ]

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" })
  }

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U"

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-blue-800/50">
        <Link href="/" className="flex items-center justify-center">
          <Image src="/images/sms2flow-logo.png" alt="SMS2FLOW Logo" width={130} height={44} priority className="brightness-0 invert" />
        </Link>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-blue-800/50">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-blue-400">
            <AvatarImage src={session?.user?.image} />
            <AvatarFallback className="bg-blue-600 text-white text-sm font-bold">{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{session?.user?.name || "Usuario"}</p>
            <p className="text-xs text-blue-300 truncate">{session?.user?.email}</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-6 p-4">
          {menuCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-1">
              <div className="text-xs font-semibold text-blue-300/70 uppercase tracking-wider px-3 mb-2">{category.title}</div>
              {category.items.map((item, itemIndex) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={itemIndex}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                        : "text-blue-100 hover:bg-blue-800/60 hover:text-white"
                    }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.title}
                  </Link>
                )
              })}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Logout */}
      <div className="border-t border-blue-800/50 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-200 hover:bg-red-600/20 hover:text-red-300 transition-all duration-200 w-full"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-lg border-0">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0 w-72 bg-gradient-to-b from-[#0a1628] to-[#0f2347] border-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden w-72 shrink-0 md:flex md:flex-col bg-gradient-to-b from-[#0a1628] to-[#0f2347] shadow-2xl">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
          <div className="md:hidden w-10" />
          <h2 className="text-lg font-semibold text-gray-800 hidden md:block">
            {menuCategories.flatMap(c => c.items).find(i => i.href === pathname)?.title || "Panel"}
          </h2>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-500" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src={session?.user?.image} />
              <AvatarFallback className="bg-blue-600 text-white text-xs">{userInitials}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
