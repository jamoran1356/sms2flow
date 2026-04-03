"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  MessageSquare,
  Smartphone,
  Zap,
  Facebook,
  Twitter,
  Github,
  Instagram,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import LanguageSwitch from "@/components/language-switch"

// Wallet connection state and error handling
const useWalletConnection = () => {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletError, setWalletError] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  // Safe wallet connection function that handles errors properly
  const connectWallet = useCallback(async () => {
    try {
      setIsConnecting(true)
      // Check if we're in a browser environment
      if (typeof window === "undefined") return

      // Check if wallet extensions exist before trying to connect
      if (!window.FLOWereum) {
        console.log("No wallet detected. Please install a wallet extension.")
        setWalletError("No wallet detected. Please install a wallet extension.")
        return
      }

      // Request accounts using the existing FLOWereum provider
      const accounts = await window.FLOWereum.request({ mFLOWod: "FLOW_requestAccounts" })

      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0])
        setWalletConnected(true)
        setWalletError(null)
        console.log("Wallet connected:", accounts[0])
      } else {
        throw new Error("No accounts found")
      }
    } catch (error) {
      console.error("Wallet connection error:", error)
      if (error.code === 4001) {
        // User rejected the connection request
        setWalletError("Connection rejected. Please approve the connection request.")
      } else {
        setWalletError("Failed to connect wallet. Please try again later.")
      }
      setWalletConnected(false)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.FLOWereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // User has disconnected their wallet
          setWalletConnected(false)
          setWalletAddress("")
        } else if (accounts[0] !== walletAddress) {
          // User has switched accounts
          setWalletAddress(accounts[0])
          setWalletConnected(true)
        }
      }

      // Subscribe to accounts change
      window.FLOWereum.on("accountsChanged", handleAccountsChanged)

      // Cleanup listener on component unmount
      return () => {
        window.FLOWereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [walletAddress])

  return { walletConnected, walletError, isConnecting, walletAddress, connectWallet }
}

// Componente para las preguntas frecuentes
const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08f08f] to-teal-400 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
      <div className="relative bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
        <button
          className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h3 className="text-lg font-semibold text-slate-900">{question}</h3>
          <svg
            className={`h-5 w-5 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div className="p-6 pt-0 border-t border-slate-100">
            <p className="text-slate-600">{answer}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Navbar component
const Navbar = () => {
  const { t } = useLanguage()

  return (
    <header className="px-4 lg:px-6 h-[100px] flex items-center backdrop-blur-sm bg-white/80 border-b border-slate-200 sticky top-0 z-50">
       <div className="max-w-[1250px] mx-auto w-full flex items-center justify-between">
          <Link className="flex items-center justify-center" href="/">
          <div className="flex items-center space-x-2">
            <div className="relative h-[100px] w-[100px]">
              <Image src="/images/logo.webp" alt="sms2flow Logo" fill style={{ objectFit: "contain" }} priority />
            </div>
          </div>
        </Link>
        <nav className="ml-auto flex gap-6">
          <Link className="text-sm font-medium text-slate-700 hover:text-[#08f08f] transition-colors" href="/machines">
            {t("nav.machines")}
          </Link>
          <Link className="text-sm font-medium text-slate-700 hover:text-[#08f08f] transition-colors" href="#features">
            {t("nav.features")}
          </Link>
          <Link
            className="text-sm font-medium text-slate-700 hover:text-[#08f08f] transition-colors"
            href="#how-it-works"
          >
            {t("nav.howItWorks")}
          </Link>
          <Link
            className="text-sm font-medium text-slate-700 hover:text-[#08f08f] transition-colors"
            href="#p2p-marketplace"
          >
            {t("nav.p2pMarketplace")}
          </Link>
          <Link className="text-sm font-medium text-slate-700 hover:text-[#08f08f] transition-colors" href="#pricing">
            {t("nav.pricing")}
          </Link>
          <Link
            className="text-sm font-medium text-slate-700 hover:text-[#08f08f] transition-colors"
            href="#testimonials"
          >
            {t("nav.testimonials")}
          </Link>
        </nav>
        <div className="ml-6 flex items-center gap-2">
          <LanguageSwitch />
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-slate-700 hover:text-[#08f08f]">
              {t("nav.signIn")}
            </Button>
          </Link>
          <Link href="/login?tab=register">
            <Button size="sm" className="bg-[#08f08f] hover:bg-[#07d07d] text-white border-0">
              {t("nav.getStarted")}
            </Button>
          </Link>
        </div>
       </div>
    </header>
  )
}

export default function Home() {
  // Use our custom hook but don't auto-connect
  const { walletConnected, walletError, isConnecting, walletAddress, connectWallet } = useWalletConnection()
  const { t } = useLanguage()

  const faqItems = t("landing.faq.items")

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#08f08f] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
          </div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-block px-3 py-1 text-sm text-white bg-[#08f08f] rounded-full shadow-lg">
                  {t("landing.hero.badge")}
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none lg:text-7xl/none text-slate-900">
                    {t("landing.hero.title")}
                  </h1>
                  <p className="max-w-[600px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    {t("landing.hero.subtitle")}
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/login?tab=register">
                    <Button className="px-8 bg-[#08f08f] hover:bg-[#07d07d] text-white border-0 shadow-lg shadow-[#08f08f]/20">
                      {t("landing.hero.cta")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button
                      variant="outline"
                      className="w-full border-slate-300 text-slate-700 hover:bg-slate-100 bg-transparent"
                    >
                      {t("landing.hero.demo")}
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center space-x-4 text-sm text-slate-600">
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                    {t("landing.hero.noInternet")}
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                    {t("landing.hero.anyPhone")}
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                    {t("landing.hero.instantTx")}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px]">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#08f08f] to-teal-400 opacity-75 blur-lg"></div>
                  <div className="relative bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center mb-6">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div className="ml-4 text-sm text-slate-500">{t("landing.mockup.dashTitle")}</div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center bg-slate-100 p-4 rounded-lg">
                          <div>
                            <div className="text-sm text-slate-500">{t("landing.mockup.totalBalance")}</div>
                            <div className="text-xl font-bold text-slate-900">4.28 FLOW</div>
                          </div>
                          <div className="text-green-500 flex items-center">
                            <span>+12%</span>
                            <svg
                              className="w-4 h-4 ml-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-100 p-4 rounded-lg">
                            <div className="text-sm text-slate-500">{t("landing.mockup.smsTx")}</div>
                            <div className="text-xl font-bold text-slate-900">128</div>
                          </div>
                          <div className="bg-slate-100 p-4 rounded-lg">
                            <div className="text-sm text-slate-500">{t("landing.mockup.successRate")}</div>
                            <div className="text-xl font-bold text-slate-900">99.8%</div>
                          </div>
                        </div>
                        <div className="bg-slate-100 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-sm text-slate-500">{t("landing.mockup.recentTx")}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center py-2 border-b border-slate-200">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-[#08f08f] flex items-center justify-center mr-2">
                                  <MessageSquare className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                  <div className="text-sm text-slate-900">{t("landing.mockup.smsTransfer")}</div>
                                  <div className="text-xs text-slate-500">{t("landing.mockup.hoursAgo2")}</div>
                                </div>
                              </div>
                              <div className="text-green-500">+0.25 FLOW</div>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center mr-2">
                                  <Smartphone className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                  <div className="text-sm text-slate-900">{t("landing.mockup.textPayment")}</div>
                                  <div className="text-xs text-slate-500">{t("landing.mockup.hoursAgo5")}</div>
                                </div>
                              </div>
                              <div className="text-green-500">+0.17 FLOW</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SMS Payments Highlight Section */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-r from-[#08f08f]/10 to-teal-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              {/* Left column */}
              <div className="flex flex-col space-y-4">
                <div className="inline-block px-3 py-1 text-sm text-white bg-[#08f08f] rounded-full shadow-lg">
                  {t("landing.smsHighlight.badge")}
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900">
                  {t("landing.smsHighlight.title")}
                </h2>
                <p className="text-slate-600 md:text-lg">
                  {t("landing.smsHighlight.subtitle")}
                </p>

                <ul className="space-y-3 mt-6">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{t("landing.smsHighlight.feat1")}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{t("landing.smsHighlight.feat2")}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{t("landing.smsHighlight.feat3")}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{t("landing.smsHighlight.feat4")}</span>
                  </li>
                </ul>

                <div className="pt-4">
                  <Link href="/login?tab=register">
                    <Button className="px-8 bg-[#08f08f] hover:bg-[#07d07d] text-white border-0 shadow-lg shadow-[#08f08f]/20">
                      {t("landing.smsHighlight.cta")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right column - visual demo */}
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#08f08f] to-teal-400 opacity-30 blur-lg"></div>
                <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#08f08f]/10 flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-[#08f08f]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{t("landing.smsHighlight.demoTitle")}</h3>
                      <p className="text-sm text-slate-500">{t("landing.smsHighlight.demoSubtitle")}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-100 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                          <span className="text-green-600 text-xs font-bold">1</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-slate-900">{t("landing.smsHighlight.step1Title")}</h4>
                          <p className="text-xs text-slate-500 mt-1">
                            {t("landing.smsHighlight.step1Desc")}
                          </p>
                          <div className="mt-2 bg-white p-2 rounded border border-slate-200 text-xs font-mono">
                            {t("landing.smsHighlight.step1Code")}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-100 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[#08f08f]/20 flex items-center justify-center shrink-0">
                          <span className="text-[#08f08f] text-xs font-bold">2</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-slate-900">{t("landing.smsHighlight.step2Title")}</h4>
                          <p className="text-xs text-slate-500 mt-1">
                            {t("landing.smsHighlight.step2Desc")}
                          </p>
                          <div className="mt-2 bg-white p-2 rounded border border-slate-200 text-xs font-mono">
                            {t("landing.smsHighlight.step2Code")}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-100 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                          <span className="text-teal-600 text-xs font-bold">3</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-slate-900">{t("landing.smsHighlight.step3Title")}</h4>
                          <p className="text-xs text-slate-500 mt-1">
                            {t("landing.smsHighlight.step3Desc")}
                          </p>
                          <div className="mt-2 bg-white p-2 rounded border border-slate-200 text-xs font-mono">
                            {t("landing.smsHighlight.step3Code")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Financial Inclusion Section */}
        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <div className="flex flex-col space-y-4">
                <div className="inline-block px-3 py-1 text-sm text-white bg-[#08f08f] rounded-full shadow-lg">
                  {t("landing.inclusion.badge")}
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900">
                  {t("landing.inclusion.title")}
                </h2>
                <p className="text-slate-600 md:text-lg">
                  {t("landing.inclusion.subtitle")}
                </p>

                <div className="space-y-4">
                  <div className="border-l-4 border-[#08f08f] pl-4">
                    <h3 className="font-semibold text-slate-900">{t("landing.inclusion.item1Title")}</h3>
                    <p className="text-slate-600 text-sm">
                      {t("landing.inclusion.item1Desc")}
                    </p>
                  </div>

                  <div className="border-l-4 border-[#08f08f] pl-4">
                    <h3 className="font-semibold text-slate-900">{t("landing.inclusion.item2Title")}</h3>
                    <p className="text-slate-600 text-sm">
                      {t("landing.inclusion.item2Desc")}
                    </p>
                  </div>

                  <div className="border-l-4 border-[#08f08f] pl-4">
                    <h3 className="font-semibold text-slate-900">{t("landing.inclusion.item3Title")}</h3>
                    <p className="text-slate-600 text-sm">
                      {t("landing.inclusion.item3Desc")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#08f08f] to-teal-400 opacity-30 blur-lg"></div>
                <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">{t("landing.inclusion.statsTitle")}</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-700">{t("landing.inclusion.stat1")}</span>
                      <span className="font-bold text-[#08f08f]">{t("landing.inclusion.stat1Val")}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-700">{t("landing.inclusion.stat2")}</span>
                      <span className="font-bold text-[#08f08f]">{t("landing.inclusion.stat2Val")}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-700">{t("landing.inclusion.stat3")}</span>
                      <span className="font-bold text-[#08f08f]">{t("landing.inclusion.stat3Val")}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-700">{t("landing.inclusion.stat4")}</span>
                      <span className="font-bold text-[#08f08f]">{t("landing.inclusion.stat4Val")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Benefits Section */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-r from-slate-50 to-[#08f08f]/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block px-3 py-1 text-sm text-white bg-[#08f08f] rounded-full shadow-lg">
                {t("landing.security.badge")}
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-slate-900">
                {t("landing.security.title")}
              </h2>
              <p className="max-w-[900px] text-slate-600 md:text-lg">
                {t("landing.security.subtitle")}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08f08f] to-teal-400 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative bg-white p-6 rounded-xl border border-slate-200 shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-[#08f08f]/10 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#08f08f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{t("landing.security.card1Title")}</h3>
                  <p className="text-slate-600">
                    {t("landing.security.card1Desc")}
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08f08f] to-teal-400 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative bg-white p-6 rounded-xl border border-slate-200 shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-[#08f08f]/10 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#08f08f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{t("landing.security.card2Title")}</h3>
                  <p className="text-slate-600">
                    {t("landing.security.card2Desc")}
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08f08f] to-teal-400 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative bg-white p-6 rounded-xl border border-slate-200 shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-[#08f08f]/10 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#08f08f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{t("landing.security.card3Title")}</h3>
                  <p className="text-slate-600">
                    {t("landing.security.card3Desc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-slate-50" id="features">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-[#08f08f] px-3 py-1 text-sm text-white shadow-lg">
                  {t("landing.features.badge")}
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-slate-900">
                  {t("landing.features.title")}
                </h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t("landing.features.subtitle")}
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-12">
              <div className="relative group h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08f08f] to-teal-400 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative flex flex-col items-center space-y-4 rounded-xl bg-white p-8 border border-slate-200 shadow-lg h-full">
                  <div className="rounded-full bg-[#08f08f] p-3 text-white shadow-lg">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 text-center">{t("landing.features.card1Title")}</h3>
                  <p className="text-center text-slate-600 flex-1">
                    {t("landing.features.card1Desc")}
                  </p>
                </div>
              </div>

              <div className="relative group h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08f08f] to-teal-400 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative flex flex-col items-center space-y-4 rounded-xl bg-white p-8 border border-slate-200 shadow-lg h-full">
                  <div className="rounded-full bg-[#08f08f] p-3 text-white shadow-lg">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 text-center">{t("landing.features.card2Title")}</h3>
                  <p className="text-center text-slate-600 flex-1">
                    {t("landing.features.card2Desc")}
                  </p>
                </div>
              </div>

              <div className="relative group h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08f08f] to-teal-400 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative flex flex-col items-center space-y-4 rounded-xl bg-white p-8 border border-slate-200 shadow-lg h-full">
                  <div className="rounded-full bg-[#08f08f] p-3 text-white shadow-lg">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 text-center">{t("landing.features.card3Title")}</h3>
                  <p className="text-center text-slate-600 flex-1">
                    {t("landing.features.card3Desc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 border-t border-slate-200 bg-white" id="how-it-works">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-[#08f08f] px-3 py-1 text-sm text-white shadow-lg">
                  {t("landing.howItWorks.badge")}
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-slate-900">
                  {t("landing.howItWorks.title")}
                </h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t("landing.howItWorks.subtitle")}
                </p>
              </div>

              <div className="mt-16 relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#08f08f] to-teal-400 hidden md:block"></div>

                <div className="space-y-16">
                  <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                    <div className="md:text-right mb-8 md:mb-0 relative">
                      <div className="absolute top-0 right-0 md:-right-12 w-8 h-8 rounded-full bg-[#08f08f] z-10 hidden md:flex items-center justify-center">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{t("landing.howItWorks.step1Title")}</h3>
                      <p className="text-slate-600 mt-2">
                        {t("landing.howItWorks.step1Desc")}
                      </p>
                    </div>
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#08f08f] to-teal-400 opacity-30 blur-lg"></div>
                      <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
                        <div className="p-4">
                          <div className="flex items-center mb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          </div>
                          <div className="bg-slate-100 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                              <div className="text-sm font-medium text-slate-900">{t("landing.howItWorks.step1Setup")}</div>
                              <Button size="sm" className="bg-[#08f08f] hover:bg-[#07d07d] text-white border-0">
                                Connect
                              </Button>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <label className="text-xs text-slate-500">{t("landing.howItWorks.step1Address")}</label>
                                <div className="bg-white p-2 rounded mt-1 border border-slate-200 text-slate-900">
                                  0x1234...5678
                                </div>
                              </div>
                              <div>
                                <label className="text-xs text-slate-500">{t("landing.howItWorks.step1Phone")}</label>
                                <div className="bg-white p-2 rounded mt-1 border border-slate-200 text-slate-900">
                                  +1 (555) 123-4567
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                    <div className="order-2 md:order-1 relative">
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-teal-400 to-[#08f08f] opacity-30 blur-lg"></div>
                      <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
                        <div className="p-4">
                          <div className="flex items-center mb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          </div>
                          <div className="bg-slate-100 p-4 rounded-lg">
                            <div className="text-sm font-medium mb-2 text-slate-900">{t("landing.howItWorks.step2Label")}</div>
                            <div className="bg-white p-3 rounded text-xs font-mono text-slate-700 overflow-x-auto border border-slate-200">
                              {t("landing.howItWorks.step2To")}
                              <br />
                              {t("landing.howItWorks.step2Msg")}
                            </div>
                            <Button size="sm" className="mt-3 bg-teal-500 hover:bg-teal-600 text-white border-0">
                              {t("landing.howItWorks.step2Btn")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="order-1 md:order-2 mb-8 md:mb-0 relative">
                      <div className="absolute top-0 left-0 md:-left-12 w-8 h-8 rounded-full bg-teal-500 z-10 hidden md:flex items-center justify-center">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <h3 className="text-xl font-bold md:text-left text-slate-900">{t("landing.howItWorks.step2Title")}</h3>
                      <p className="text-slate-600 mt-2 md:text-left">
                        {t("landing.howItWorks.step2Desc")}
                      </p>
                    </div>
                  </div>

                  <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                    <div className="md:text-right mb-8 md:mb-0 relative">
                      <div className="absolute top-0 right-0 md:-right-12 w-8 h-8 rounded-full bg-emerald-500 z-10 hidden md:flex items-center justify-center">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{t("landing.howItWorks.step3Title")}</h3>
                      <p className="text-slate-600 mt-2">
                        {t("landing.howItWorks.step3Desc")}
                      </p>
                    </div>
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-400 to-[#08f08f] opacity-30 blur-lg"></div>
                      <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
                        <div className="p-4">
                          <div className="flex items-center mb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          </div>
                          <div className="bg-slate-100 p-4 rounded-lg">
                            <div className="text-sm font-medium mb-2 text-slate-900">{t("landing.howItWorks.step3Label")}</div>
                            <div className="bg-white p-3 rounded border border-slate-200">
                              <div className="text-xs text-green-600 font-medium mb-2">{t("landing.howItWorks.step3Success")}</div>
                              <div className="text-xs text-slate-700">
                                Sent: 0.5 FLOW
                                <br />
                                To: 0xabcd...ef12
                                <br />
                                TX Hash: 0x9876...5432
                                <br />
                                Gas Fee: 0.002 FLOW
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DeFi P2P Marketplace Section */}
        <section
          className="w-full py-12 md:py-24 lg:py-32 border-t border-slate-200 bg-gradient-to-b from-white to-emerald-50/40"
          id="p2p-marketplace"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-[#08f08f] px-3 py-1 text-sm text-white shadow-lg">
                  {t("landing.p2p.badge")}
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-slate-900">
                  {t("landing.p2p.title")}
                </h2>
                <p className="max-w-[960px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t("landing.p2p.subtitle")}
                </p>
              </div>
            </div>

            <div className="mt-12 relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#08f08f] to-teal-400 opacity-30 blur-xl"></div>
              <div className="relative rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-2xl">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#08f08f] text-white font-bold">
                      1
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{t("landing.p2p.step1")}</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {t("landing.p2p.step1Desc")}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 text-white font-bold">
                      2
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{t("landing.p2p.step2")}</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {t("landing.p2p.step2Desc")}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white font-bold">
                      3
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{t("landing.p2p.step3")}</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {t("landing.p2p.step3Desc")}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 text-white font-bold">
                      4
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{t("landing.p2p.step4")}</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {t("landing.p2p.step4Desc")}
                    </p>
                  </div>
                </div>

                <div className="mt-8 rounded-xl bg-slate-900 p-5 text-slate-100">
                  <div className="text-xs uppercase tracking-[0.2em] text-[#08f08f]">{t("landing.p2p.flowLabel")}</div>
                  <p className="mt-2 text-sm md:text-base">
                    {t("landing.p2p.flowDesc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-white" id="testimonials">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-[#08f08f] px-3 py-1 text-sm text-white shadow-lg">
                  {t("landing.testimonials.badge")}
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-slate-900">{t("landing.testimonials.title")}</h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t("landing.testimonials.subtitle")}
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              {/* Testimonial 1 */}
              <div className="relative group h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08f08f] to-teal-400 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative flex flex-col space-y-4 rounded-xl bg-white p-8 border border-slate-200 shadow-lg h-full">
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-slate-600 flex-1">
                    &ldquo;{t("landing.testimonials.t1Text")}
                    <span className="font-semibold text-[#08f08f]">
                      {" "}{t("landing.testimonials.t1Highlight")}
                    </span>
                    {" "}{t("landing.testimonials.t1Suffix")}&rdquo;
                  </p>
                  <div className="flex items-center space-x-4 mt-auto">
                    <div className="rounded-full bg-[#08f08f] h-10 w-10 flex items-center justify-center">
                      <span className="text-white font-bold">MK</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{t("landing.testimonials.t1Name")}</h4>
                      <p className="text-sm text-slate-500">{t("landing.testimonials.t1Role")}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="relative group h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative flex flex-col space-y-4 rounded-xl bg-white p-8 border border-slate-200 shadow-lg h-full">
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-slate-600 flex-1">
                    &ldquo;{t("landing.testimonials.t2Text")}
                    <span className="font-semibold text-teal-600">
                      {" "}{t("landing.testimonials.t2Highlight")}
                    </span>
                    {" "}{t("landing.testimonials.t2Suffix")}&rdquo;
                  </p>
                  <div className="flex items-center space-x-4 mt-auto">
                    <div className="rounded-full bg-teal-500 h-10 w-10 flex items-center justify-center">
                      <span className="text-white font-bold">JC</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{t("landing.testimonials.t2Name")}</h4>
                      <p className="text-sm text-slate-500">{t("landing.testimonials.t2Role")}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="relative group h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-[#08f08f] rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative flex flex-col space-y-4 rounded-xl bg-white p-8 border border-slate-200 shadow-lg h-full">
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-slate-600 flex-1">
                    &ldquo;{t("landing.testimonials.t3Text")}
                    <span className="font-semibold text-emerald-600">
                      {" "}{t("landing.testimonials.t3Highlight")}
                    </span>
                    {" "}{t("landing.testimonials.t3Suffix")}&rdquo;
                  </p>
                  <div className="flex items-center space-x-4 mt-auto">
                    <div className="rounded-full bg-emerald-500 h-10 w-10 flex items-center justify-center">
                      <span className="text-white font-bold">AR</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{t("landing.testimonials.t3Name")}</h4>
                      <p className="text-sm text-slate-500">{t("landing.testimonials.t3Role")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 border-t border-slate-200 bg-white" id="pricing">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-[#08f08f] px-3 py-1 text-sm text-white shadow-lg">
                  {t("landing.pricing.badge")}
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-slate-900">
                  {t("landing.pricing.title")}
                </h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t("landing.pricing.subtitle")}
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-12">
              {/* Basic */}
              <div className="relative group h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08f08f] to-teal-400 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative flex flex-col rounded-xl bg-white border border-slate-200 shadow-xl h-full">
                  <div className="p-6 flex-1">
                    <h3 className="text-2xl font-bold text-slate-900">{t("landing.pricing.basic")}</h3>
                    <div className="mt-4 text-3xl font-bold text-slate-900">
                      {t("landing.pricing.basicPrice")}<span className="text-sm font-normal text-slate-500">{t("landing.pricing.perMonth")}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {t("landing.pricing.basicDesc")}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {t("landing.pricing.basicFeatures").map((feat, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                          <span className="text-slate-700">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 mt-auto">
                    <Link href="/login?tab=register&plan=basic">
                      <Button className="w-full bg-[#08f08f] hover:bg-[#07d07d] text-white border-0">
                        {t("landing.pricing.cta")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Pro */}
              <div className="relative group h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative flex flex-col rounded-xl bg-white border border-slate-200 shadow-xl h-full">
                  <div className="absolute top-0 right-0 bg-[#08f08f] text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                    {t("landing.pricing.popular")}
                  </div>
                  <div className="p-6 flex-1">
                    <h3 className="text-2xl font-bold text-slate-900">{t("landing.pricing.pro")}</h3>
                    <div className="mt-4 text-3xl font-bold text-slate-900">
                      {t("landing.pricing.proPrice")}<span className="text-sm font-normal text-slate-500">{t("landing.pricing.perMonth")}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {t("landing.pricing.proDesc")}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {t("landing.pricing.proFeatures").map((feat, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                          <span className="text-slate-700">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 mt-auto">
                    <Link href="/login?tab=register&plan=pro">
                      <Button className="w-full bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-white border-0 shadow-lg shadow-teal-400/20">
                        {t("landing.pricing.cta")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Enterprise */}
              <div className="relative group h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-[#08f08f] rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative flex flex-col rounded-xl bg-white border border-slate-200 shadow-xl h-full">
                  <div className="p-6 flex-1">
                    <h3 className="text-2xl font-bold text-slate-900">{t("landing.pricing.enterprise")}</h3>
                    <div className="mt-4 text-3xl font-bold text-slate-900">{t("landing.pricing.enterprisePrice")}</div>
                    <p className="mt-2 text-sm text-slate-600">
                      {t("landing.pricing.enterpriseDesc")}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {t("landing.pricing.enterpriseFeatures").map((feat, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                          <span className="text-slate-700">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 mt-auto">
                    <Link href="/contact">
                      <Button
                        variant="outline"
                        className="w-full border-slate-300 text-slate-700 hover:bg-slate-100 bg-transparent"
                      >
                        {t("landing.pricing.contactSales")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-slate-600">{t("landing.pricing.questionsTitle")}</p>
              <Link
                href="/contact"
                className="text-[#08f08f] hover:text-[#07d07d] font-medium inline-flex items-center mt-2"
              >
                {t("landing.pricing.talkTeam")}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-[#08f08f] to-teal-400">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                  {t("landing.cta.title")}
                </h2>
                <p className="max-w-[900px] text-teal-100 md:text-xl/relaxed">
                  {t("landing.cta.subtitle")}
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/login?tab=register">
                  <Button variant="outline" className="w-full border-white text-white hover:bg-white/10 bg-white/20">
                    {t("landing.cta.createAccount")}
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 border-white text-white hover:bg-white/10 bg-teal-600/30"
                  onClick={(e) => {
                    e.preventDefault()
                    connectWallet()
                  }}
                >
                  {isConnecting ? t("landing.cta.connecting") : t("landing.cta.connectWallet")}
                </Button>
              </div>
              {walletError && <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">{walletError}</div>}
              {walletConnected && (
                <div className="mt-4 p-2 bg-green-100 text-green-700 rounded-md text-sm">
                  Wallet connected successfully! Address: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white border-t border-slate-200">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-[#08f08f] px-3 py-1 text-sm text-white shadow-lg">
                  {t("landing.faq.badge")}
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-slate-900">
                  {t("landing.faq.title")}
                </h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t("landing.faq.subtitle")}
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-3xl mt-12 space-y-6">
              {Array.isArray(faqItems) && faqItems.map((item, i) => (
                <FaqItem key={i} question={item.q} answer={item.a} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-slate-50 border-t border-slate-200">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="col-span-1 lg:col-span-2">
              <Link className="flex items-center" href="/">
                <div className="flex items-center space-x-2">
                  <div className="relative h-[100px] w-[100px]">
                    <Image src="/images/logo.webp" alt="sms2flow Logo" fill style={{ objectFit: "contain" }} />
                  </div>
                </div>
              </Link>
              <p className="mt-4 text-slate-600 text-sm">
                {t("landing.footer.description")}
              </p>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="text-slate-400 hover:text-[#08f08f]" aria-label="Facebook">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-slate-400 hover:text-[#08f08f]" aria-label="Twitter">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-slate-400 hover:text-[#08f08f]" aria-label="GitHub">
                  <Github className="h-6 w-6" />
                </a>
                <a href="#" className="text-slate-400 hover:text-[#08f08f]" aria-label="Instagram">
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">{t("landing.footer.product")}</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#features" className="text-sm text-slate-600 hover:text-[#08f08f]">
                    {t("landing.footer.productLinks.features")}
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-sm text-slate-600 hover:text-[#08f08f]">
                    {t("landing.footer.productLinks.pricing")}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-600 hover:text-[#08f08f]">
                    {t("landing.footer.productLinks.api")}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-600 hover:text-[#08f08f]">
                    {t("landing.footer.productLinks.currencies")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">{t("landing.footer.support")}</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-slate-600 hover:text-[#08f08f]">
                    {t("landing.footer.supportLinks.helpCenter")}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-600 hover:text-[#08f08f]">
                    {t("landing.footer.supportLinks.gettingStarted")}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-600 hover:text-[#08f08f]">
                    {t("landing.footer.supportLinks.smsCommands")}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-600 hover:text-[#08f08f]">
                    {t("landing.footer.supportLinks.securityGuide")}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-600 hover:text-[#08f08f]">
                    {t("landing.footer.supportLinks.contactSupport")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">{t("landing.footer.company")}</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-slate-600 hover:text-[#08f08f]">
                    {t("landing.footer.companyLinks.aboutUs")}
                  </a>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-slate-600 hover:text-[#08f08f]">
                    {t("landing.footer.companyLinks.privacy")}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-slate-600 hover:text-[#08f08f]">
                    {t("landing.footer.companyLinks.terms")}
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-600 hover:text-[#08f08f]">
                    {t("landing.footer.companyLinks.security")}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} sms2flow. {t("landing.footer.copyright")}</p>
              <div className="mt-4 md:mt-0 flex space-x-6">
                <a href="#" className="text-sm text-slate-500 hover:text-[#08f08f]">
                  Status
                </a>
                <a href="#" className="text-sm text-slate-500 hover:text-[#08f08f]">
                  Blog
                </a>
                <a href="#" className="text-sm text-slate-500 hover:text-[#08f08f]">
                  Careers
                </a>
              </div>
            </div>
            <div className="mt-4 text-xs text-slate-400 text-center">
              {t("landing.footer.disclaimer")}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
