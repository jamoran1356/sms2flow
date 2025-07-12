"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  // Don't show navbar on certain paths
  const hideOnPaths = ["/login", "/register", "/dashboard", "/admin"]
  if (hideOnPaths.some((path) => pathname.startsWith(path))) {
    return null
  }

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const closeMenu = () => setMenuOpen(false)

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/#pricing" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <div className="relative h-[150px] w-[150px]">
              <Image
                src="/images/logo.webp"
                alt="sms2flow Logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            <span className="text-xl font-bold">sms2flow</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} className="text-sm font-medium transition-colors hover:text-primary">
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex gap-4">
          <Link href="/login">
            <Button variant="outline">Log in</Button>
          </Link>
          <Link href="/register">
            <Button>Sign up</Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-primary-foreground bg-primary hover:bg-primary/90 md:hidden"
          onClick={toggleMenu}
          aria-expanded={menuOpen}
        >
          <span className="sr-only">Toggle menu</span>
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-sm transform transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="container mt-4 flex flex-col gap-4 p-4">
          <nav className="flex flex-col gap-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-lg font-medium transition-colors hover:text-primary border-b border-muted pb-2"
                onClick={closeMenu}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2 mt-4">
            <Link href="/login" onClick={closeMenu}>
              <Button variant="outline" className="w-full bg-transparent">
                Log in
              </Button>
            </Link>
            <Link href="/register" onClick={closeMenu}>
              <Button className="w-full">Sign up</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
