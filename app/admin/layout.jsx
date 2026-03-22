"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  LayoutDashboard,
  CreditCard,
  Users,
  TrendingUp,
  MessageSquare,
  Wallet,
  Settings,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  Globe,
} from "lucide-react"

import { Button } from "@/components/ui/button"

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  if (pathname === "/admin/login") {
    return children
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!session || session.user?.role !== "ADMIN") {
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login"
    }
    return null
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/admin/login" })
  }

  const navigationSections = [
    {
      title: "PRINCIPAL",
      items: [
        { name: "Panel", href: "/admin", icon: LayoutDashboard },
        { name: "Transacciones", href: "/admin/transactions", icon: CreditCard },
        { name: "Usuarios", href: "/admin/users", icon: Users },
        { name: "Staking", href: "/admin/staking", icon: TrendingUp },
      ],
    },
    {
      title: "PAGOS",
      items: [
        { name: "Pagos SMS", href: "/admin/sms-payments", icon: MessageSquare },
        { name: "Billetera", href: "/admin/wallet", icon: Wallet },
      ],
    },
    {
      title: "SISTEMA",
      items: [
        { name: "Redes", href: "/admin/settings", icon: Globe },
        { name: "Seguridad", href: "/admin/security", icon: Shield },
        { name: "Configuración", href: "/admin/settings", icon: Settings },
      ],
    },
  ]

  const initials = session.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AD"

  return (
    <div className="flex h-screen bg-gray-50">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#0a1628] to-[#0f2347] shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col items-center pt-6 pb-4 px-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center">
            <Image
              src="/images/sms2flow-logo.png"
              alt="sms2flow Logo"
              width={140}
              height={46}
              priority
              className="brightness-0 invert"
            />
          </Link>
          <span className="mt-2 px-2 py-0.5 bg-red-500/20 text-red-300 text-[10px] font-bold rounded-full uppercase tracking-wider">
            Admin Panel
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
          {navigationSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="px-3 text-[10px] font-bold text-blue-300/60 uppercase tracking-widest mb-3">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                        ${
                          isActive
                            ? "bg-blue-600/30 text-white shadow-lg shadow-blue-900/20 border border-blue-500/20"
                            : "text-blue-200/70 hover:bg-white/5 hover:text-white"
                        }
                      `}
                    >
                      <item.icon className={`h-4 w-4 ${isActive ? "text-blue-300" : ""}`} />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Admin info */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{session.user?.name || "Admin"}</p>
              <p className="text-[11px] text-blue-300/60 truncate">{session.user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-300/80 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="sticky top-0 z-30 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shadow-sm">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h2 className="text-sm font-semibold text-gray-700 hidden sm:block">Administración SMS2Flow</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4 text-gray-500" />
              <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center">3</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
