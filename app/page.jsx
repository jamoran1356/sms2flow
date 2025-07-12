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
      if (!window.ethereum) {
        console.log("No wallet detected. Please install a wallet extension.")
        setWalletError("No wallet detected. Please install a wallet extension.")
        return
      }

      // Request accounts using the existing ethereum provider
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

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
    if (typeof window !== "undefined" && window.ethereum) {
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
      window.ethereum.on("accountsChanged", handleAccountsChanged)

      // Cleanup listener on component unmount
      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
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
          <Link className="text-sm font-medium text-slate-700 hover:text-[#08f08f] transition-colors" href="#features">
            Features
          </Link>
          <Link
            className="text-sm font-medium text-slate-700 hover:text-[#08f08f] transition-colors"
            href="#how-it-works"
          >
            How It Works
          </Link>
          <Link className="text-sm font-medium text-slate-700 hover:text-[#08f08f] transition-colors" href="#pricing">
            Pricing
          </Link>
          <Link
            className="text-sm font-medium text-slate-700 hover:text-[#08f08f] transition-colors"
            href="#testimonials"
          >
            Testimonials
          </Link>
        </nav>
        <div className="ml-6 flex items-center gap-2">
          <Link href="#">
            <Button variant="ghost" size="sm" className="text-slate-700 hover:text-[#08f08f]">
              Sign In
            </Button>
          </Link>
          <Link href="#">
            <Button size="sm" className="bg-[#08f08f] hover:bg-[#07d07d] text-white border-0">
              Get Started
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
                  Bringing Crypto to Everyone, One Text at a Time
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none lg:text-7xl/none text-slate-900">
                    Send Flow tokens via SMS from any mobile phone
                  </h1>
                  <p className="max-w-[600px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    sms2flow is a revolutionary platform that allows anyone to send and receive Flow tokens using
                    nothing but a basic mobile phone and SMS. No apps, no internet, no wallets to download. Just a text
                    message.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button className="px-8 bg-[#08f08f] hover:bg-[#07d07d] text-white border-0 shadow-lg shadow-[#08f08f]/20">
                      Start Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button
                      variant="outline"
                      className="w-full border-slate-300 text-slate-700 hover:bg-slate-100 bg-transparent"
                    >
                      See Demo
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center space-x-4 text-sm text-slate-600">
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                    No Internet Required
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                    Works on Any Phone
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                    Instant Transactions
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
                        <div className="ml-4 text-sm text-slate-500">SMS Transaction Dashboard</div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center bg-slate-100 p-4 rounded-lg">
                          <div>
                            <div className="text-sm text-slate-500">Total Balance</div>
                            <div className="text-xl font-bold text-slate-900">4.28 ETH</div>
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
                            <div className="text-sm text-slate-500">SMS Transactions</div>
                            <div className="text-xl font-bold text-slate-900">128</div>
                          </div>
                          <div className="bg-slate-100 p-4 rounded-lg">
                            <div className="text-sm text-slate-500">Success Rate</div>
                            <div className="text-xl font-bold text-slate-900">99.8%</div>
                          </div>
                        </div>
                        <div className="bg-slate-100 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-sm text-slate-500">Recent SMS Transactions</div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center py-2 border-b border-slate-200">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-[#08f08f] flex items-center justify-center mr-2">
                                  <MessageSquare className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                  <div className="text-sm text-slate-900">SMS Transfer</div>
                                  <div className="text-xs text-slate-500">2 hours ago</div>
                                </div>
                              </div>
                              <div className="text-green-500">+0.25 ETH</div>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center mr-2">
                                  <Smartphone className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                  <div className="text-sm text-slate-900">Text Payment</div>
                                  <div className="text-xs text-slate-500">5 hours ago</div>
                                </div>
                              </div>
                              <div className="text-green-500">+0.15 ETH</div>
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
              {/* Columna izquierda - Texto descriptivo */}
              <div className="flex flex-col space-y-4">
                <div className="inline-block px-3 py-1 text-sm text-white bg-[#08f08f] rounded-full shadow-lg">
                  Works Anywhere, Anytime
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900">
                  Blockchain Transactions via SMS: Always Available
                </h2>
                <p className="text-slate-600 md:text-lg">
                  sms2flow enables secure blockchain transactions using only text messages. No smartphone required, no
                  internet connection needed, no apps to download.
                </p>

                <ul className="space-y-3 mt-6">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700">Works on any mobile phone, including basic feature phones</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700">Perfect for areas with limited or unstable connectivity</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700">Secure transactions backed by blockchain technology</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700">Available 24/7, even when internet services fail</span>
                  </li>
                </ul>

                <div className="pt-4">
                  <Link href="/register">
                    <Button className="px-8 bg-[#08f08f] hover:bg-[#07d07d] text-white border-0 shadow-lg shadow-[#08f08f]/20">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Columna derecha - Demostración visual */}
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#08f08f] to-teal-400 opacity-30 blur-lg"></div>
                <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#08f08f]/10 flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-[#08f08f]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">SMS Transactions</h3>
                      <p className="text-sm text-slate-500">No internet required</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-100 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                          <span className="text-green-600 text-xs font-bold">1</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-slate-900">Send an SMS</h4>
                          <p className="text-xs text-slate-500 mt-1">
                            Text your transaction details to the sms2flow number
                          </p>
                          <div className="mt-2 bg-white p-2 rounded border border-slate-200 text-xs font-mono">
                            SEND 5 FLOW TO +5734567890
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
                          <h4 className="text-sm font-medium text-slate-900">Confirm Transaction</h4>
                          <p className="text-xs text-slate-500 mt-1">
                            Receive SMS confirmation with transaction details
                          </p>
                          <div className="mt-2 bg-white p-2 rounded border border-slate-200 text-xs font-mono">
                            Confirm: Send 0.5 ETH to 0x1234...5678? Reply YES to proceed.
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
                          <h4 className="text-sm font-medium text-slate-900">Transaction Complete!</h4>
                          <p className="text-xs text-slate-500 mt-1">
                            Transaction processed on blockchain and confirmation sent
                          </p>
                          <div className="mt-2 bg-white p-2 rounded border border-slate-200 text-xs font-mono">
                            Success! 0.5 ETH sent. TX: 0xabcd...ef12. Thank you for using sms2flow.
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
                  Financial Inclusion
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900">
                  Bridging the Global Digital Divide
                </h2>
                <p className="text-slate-600 md:text-lg">
                  While blockchain innovation accelerates, billions remain excluded from this financial frontier. Most
                  crypto tools require smartphones, stable internet, and technical literacy. But what about the rest of
                  the world?
                </p>

                <div className="space-y-4">
                  <div className="border-l-4 border-[#08f08f] pl-4">
                    <h3 className="font-semibold text-slate-900">2G Networks & Basic Phones</h3>
                    <p className="text-slate-600 text-sm">
                      In many regions, people rely on simple mobile phones and 2G networks. These users are underserved,
                      yet they could benefit the most from decentralized financial tools.
                    </p>
                  </div>

                  <div className="border-l-4 border-[#08f08f] pl-4">
                    <h3 className="font-semibold text-slate-900">Remittances & Aid Distribution</h3>
                    <p className="text-slate-600 text-sm">
                      Perfect for individuals receiving remittances, merchants in cash-heavy economies, or unbanked
                      populations without traditional banking access.
                    </p>
                  </div>

                  <div className="border-l-4 border-[#08f08f] pl-4">
                    <h3 className="font-semibold text-slate-900">Micro-Finance & P2P Payments</h3>
                    <p className="text-slate-600 text-sm">
                      Enable peer-to-peer payments, micro-finance solutions, and remittance corridors through simple
                      text messages.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#08f08f] to-teal-400 opacity-30 blur-lg"></div>
                <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Global Impact Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-700">Unbanked Population</span>
                      <span className="font-bold text-[#08f08f]">1.7 Billion</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-700">People with Basic Phones</span>
                      <span className="font-bold text-[#08f08f]">3.2 Billion</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-700">2G Network Users</span>
                      <span className="font-bold text-[#08f08f]">2.8 Billion</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-700">Annual Remittances</span>
                      <span className="font-bold text-[#08f08f]">$589B</span>
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
                Enhanced Security
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-slate-900">
                Safer Than Traditional Mobile Wallets
              </h2>
              <p className="max-w-[900px] text-slate-600 md:text-lg">
                One of the major advantages of sms2flow is not needing to carry a hot wallet on your phone. If your
                phone is lost or stolen, your funds remain secure.
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
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Off-Device Security</h3>
                  <p className="text-slate-600">
                    Keep your funds safe, your wallet is securely managed off-device. Phone theft or loss doesn't put your funds at risk.
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
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No Hot Wallet Risk</h3>
                  <p className="text-slate-600">
                    Unlike traditional mobile wallets, there's no risk of exposing private keys or losing funds through
                    device compromise.
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
                  <h3 className="text-xl font-bold text-slate-900 mb-2">SMS Encryption</h3>
                  <p className="text-slate-600">
                    All SMS communications are encrypted and parsed securely through our backend infrastructure.
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
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-slate-900">
                  Revolutionary Technology
                </h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides the world's first SMS-to-blockchain transaction system, making crypto accessible
                  to everyone.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-12">
              {/* Tarjeta 1 */}
              <div className="relative group h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08f08f] to-teal-400 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative flex flex-col items-center space-y-4 rounded-xl bg-white p-8 border border-slate-200 shadow-lg h-full">
                  <div className="rounded-full bg-[#08f08f] p-3 text-white shadow-lg">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 text-center">SMS Transactions</h3>
                  <p className="text-center text-slate-600 flex-1">
                    Send blockchain transactions via SMS - a world first. Works without internet and on any phone.
                  </p>
                </div>
              </div>

              {/* Tarjeta 2 */}
              <div className="relative group h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08f08f] to-teal-400 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative flex flex-col items-center space-y-4 rounded-xl bg-white p-8 border border-slate-200 shadow-lg h-full">
                  <div className="rounded-full bg-[#08f08f] p-3 text-white shadow-lg">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 text-center">Instant Processing</h3>
                  <p className="text-center text-slate-600 flex-1">
                    Lightning-fast transaction processing with real-time SMS confirmations and blockchain execution.
                  </p>
                </div>
              </div>

              {/* Replace the third feature card with Flow-specific content */}
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
                  <h3 className="text-xl font-bold text-slate-900 text-center">Flow Blockchain Integration</h3>
                  <p className="text-center text-slate-600 flex-1">
                    Built on Flow's developer-friendly environment and scalable architecture, perfect for accessible
                    innovation and global adoption.
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
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-slate-900">
                  Simple SMS-to-Blockchain Process
                </h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See how sms2flow transforms simple text messages into secure blockchain transactions.
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
                      <h3 className="text-xl font-bold text-slate-900">Set Up Your Wallet</h3>
                      <p className="text-slate-600 mt-2">
                        Connect your blockchain wallet to sms2flow. We support all major wallets and cryptocurrencies.
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
                              <div className="text-sm font-medium text-slate-900">Wallet Setup</div>
                              <Button size="sm" className="bg-[#08f08f] hover:bg-[#07d07d] text-white border-0">
                                Connect
                              </Button>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <label className="text-xs text-slate-500">Wallet Address</label>
                                <div className="bg-white p-2 rounded mt-1 border border-slate-200 text-slate-900">
                                  0x1234...5678
                                </div>
                              </div>
                              <div>
                                <label className="text-xs text-slate-500">Phone Number</label>
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
                            <div className="text-sm font-medium mb-2 text-slate-900">SMS Command</div>
                            <div className="bg-white p-3 rounded text-xs font-mono text-slate-700 overflow-x-auto border border-slate-200">
                              To: +1-SMS2FLOW
                              <br />
                              Message: SEND 0.5 ETH TO 0xabcd...ef12
                            </div>
                            <Button size="sm" className="mt-3 bg-teal-500 hover:bg-teal-600 text-white border-0">
                              Send SMS
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="order-1 md:order-2 mb-8 md:mb-0 relative">
                      <div className="absolute top-0 left-0 md:-left-12 w-8 h-8 rounded-full bg-teal-500 z-10 hidden md:flex items-center justify-center">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <h3 className="text-xl font-bold md:text-left text-slate-900">Send SMS Command</h3>
                      <p className="text-slate-600 mt-2 md:text-left">
                        Text your transaction details to our SMS number. Use simple commands like "SEND [amount] [token]
                        TO [address]".
                      </p>
                    </div>
                  </div>

                  <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                    <div className="md:text-right mb-8 md:mb-0 relative">
                      <div className="absolute top-0 right-0 md:-right-12 w-8 h-8 rounded-full bg-emerald-500 z-10 hidden md:flex items-center justify-center">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Transaction Executed</h3>
                      <p className="text-slate-600 mt-2">
                        Your transaction is processed on the blockchain and you receive SMS confirmation with the
                        transaction hash.
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
                            <div className="text-sm font-medium mb-2 text-slate-900">Transaction Confirmation</div>
                            <div className="bg-white p-3 rounded border border-slate-200">
                              <div className="text-xs text-green-600 font-medium mb-2">✓ Transaction Successful</div>
                              <div className="text-xs text-slate-700">
                                Sent: 0.5 ETH
                                <br />
                                To: 0xabcd...ef12
                                <br />
                                TX Hash: 0x9876...5432
                                <br />
                                Gas Fee: 0.002 ETH
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

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-white" id="testimonials">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-[#08f08f] px-3 py-1 text-sm text-white shadow-lg">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-slate-900">What Our Users Say</h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover how sms2flow is revolutionizing blockchain accessibility worldwide.
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              {/* Testimonio 1 */}
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
                    "sms2flow is a game-changer! I can now send crypto transactions from my basic phone without any
                    internet.
                    <span className="font-semibold text-[#08f08f]">
                      It's incredibly simple and works perfectly every time.
                    </span>
                    This technology is the future of financial inclusion."
                  </p>
                  <div className="flex items-center space-x-4 mt-auto">
                    <div className="rounded-full bg-[#08f08f] h-10 w-10 flex items-center justify-center">
                      <span className="text-white font-bold">MK</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">Maria Kowalski</h4>
                      <p className="text-sm text-slate-500">Small Business Owner</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonio 2 */}
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
                    "As a developer, I was skeptical about SMS blockchain transactions, but sms2flow proved me wrong.
                    <span className="font-semibold text-teal-600">
                      The security is top-notch and the reliability is outstanding.
                    </span>
                    This opens up crypto to billions of people worldwide."
                  </p>
                  <div className="flex items-center space-x-4 mt-auto">
                    <div className="rounded-full bg-teal-500 h-10 w-10 flex items-center justify-center">
                      <span className="text-white font-bold">JC</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">James Chen</h4>
                      <p className="text-sm text-slate-500">Blockchain Developer</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonio 3 */}
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
                    "Living in a rural area with poor internet, sms2flow has been a lifesaver.
                    <span className="font-semibold text-emerald-600">
                      I can now participate in the crypto economy using just my old Nokia phone.
                    </span>
                    The transaction fees are reasonable and it's incredibly reliable."
                  </p>
                  <div className="flex items-center space-x-4 mt-auto">
                    <div className="rounded-full bg-emerald-500 h-10 w-10 flex items-center justify-center">
                      <span className="text-white font-bold">AR</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">Ahmed Rahman</h4>
                      <p className="text-sm text-slate-500">Farmer & Entrepreneur</p>
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
                  Pricing
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-slate-900">
                  Simple, Transparent Pricing
                </h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that fits your transaction needs. No hidden fees, no surprises.
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-12">
              {/* Plan Basic */}
              <div className="relative group h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#08f08f] to-teal-400 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative flex flex-col rounded-xl bg-white border border-slate-200 shadow-xl h-full">
                  <div className="p-6 flex-1">
                    <h3 className="text-2xl font-bold text-slate-900">Basic</h3>
                    <div className="mt-4 text-3xl font-bold text-slate-900">
                      $9<span className="text-sm font-normal text-slate-500">/month</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      Perfect for individuals getting started with SMS blockchain transactions.
                    </p>
                    <ul className="mt-6 space-y-3">
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        <span className="text-slate-700">Up to 50 SMS transactions/month</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        <span className="text-slate-700">Basic transaction history</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        <span className="text-slate-700">Email support</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        <span className="text-slate-700">Standard processing speed</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-6 mt-auto">
                    <Link href="/register?plan=basic">
                      <Button className="w-full bg-[#08f08f] hover:bg-[#07d07d] text-white border-0">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Plan Pro */}
              <div className="relative group h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative flex flex-col rounded-xl bg-white border border-slate-200 shadow-xl h-full">
                  <div className="absolute top-0 right-0 bg-[#08f08f] text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                    Popular
                  </div>
                  <div className="p-6 flex-1">
                    <h3 className="text-2xl font-bold text-slate-900">Pro</h3>
                    <div className="mt-4 text-3xl font-bold text-slate-900">
                      $29<span className="text-sm font-normal text-slate-500">/month</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      For power users and small businesses with higher transaction volumes.
                    </p>
                    <ul className="mt-6 space-y-3">
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        <span className="text-slate-700">Up to 500 SMS transactions/month</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        <span className="text-slate-700">Advanced analytics & reporting</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        <span className="text-slate-700">Priority support</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        <span className="text-slate-700">Fast processing speed</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        <span className="text-slate-700">API access for integrations</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        <span className="text-slate-700">Multi-currency support</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-6 mt-auto">
                    <Link href="/register?plan=pro">
                      <Button className="w-full bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-white border-0 shadow-lg shadow-teal-400/20">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Plan Enterprise */}
              <div className="relative group h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-[#08f08f] rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                <div className="relative flex flex-col rounded-xl bg-white border border-slate-200 shadow-xl h-full">
                  <div className="p-6 flex-1">
                    <h3 className="text-2xl font-bold text-slate-900">Enterprise</h3>
                    <div className="mt-4 text-3xl font-bold text-slate-900">Custom</div>
                    <p className="mt-2 text-sm text-slate-600">
                      Tailored solutions for large organizations with specific requirements.
                    </p>
                    <ul className="mt-6 space-y-3">
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        <span className="text-slate-700">Unlimited SMS transactions</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        <span className="text-slate-700">Custom integrations</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        <span className="text-slate-700">Dedicated account manager</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        <span className="text-slate-700">24/7 phone support</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        <span className="text-slate-700">Custom SLA agreements</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                        <span className="text-slate-700">White-label solutions</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-6 mt-auto">
                    <Link href="/contact">
                      <Button
                        variant="outline"
                        className="w-full border-slate-300 text-slate-700 hover:bg-slate-100 bg-transparent"
                      >
                        Contact Sales
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-slate-600">Questions about our pricing?</p>
              <Link
                href="/contact"
                className="text-[#08f08f] hover:text-[#07d07d] font-medium inline-flex items-center mt-2"
              >
                Talk to our team
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
                  Start sending blockchain transactions via SMS today
                </h2>
                <p className="max-w-[900px] text-teal-100 md:text-xl/relaxed">
                  Join thousands of users who are already using sms2flow to access blockchain technology from anywhere.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button variant="outline" className="w-full border-white text-white hover:bg-white/10 bg-white/20">
                    Create Free Account
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
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
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
                  Frequently Asked Questions
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-slate-900">
                  Everything you need to know
                </h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get answers to common questions about sms2flow and SMS blockchain transactions.
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-3xl mt-12 space-y-6">
              <FaqItem
                question="Why is sms2flow built on the Flow blockchain?"
                answer="Flow's developer-friendly environment and scalable architecture make it perfect for accessible innovation. Flow was designed to support mainstream adoption with low fees, fast transactions, and user-friendly features - exactly what's needed for SMS-based crypto transactions that serve underbanked populations globally."
              />

              <FaqItem
                question="How does SMS-to-blockchain technology work?"
                answer="sms2flow uses advanced SMS gateway technology combined with secure blockchain APIs. When you send an SMS with transaction details, our system processes the message, validates your identity, and executes the transaction on the blockchain. The entire process is secured with military-grade encryption and multi-factor authentication."
              />

              <FaqItem
                question="What cryptocurrencies are supported?"
                answer="sms2flow supports all major cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), and popular stablecoins like USDC and USDT. We're constantly adding support for new tokens and blockchain networks based on user demand."
              />

              <FaqItem
                question="Is it safe to send transactions via SMS?"
                answer="Absolutely. All SMS messages are encrypted end-to-end, and we never store your private keys. Each transaction requires multiple confirmations and our AI-powered fraud detection system monitors all activity 24/7. Your funds are always under your control."
              />

              <FaqItem
                question="Do I need a smartphone to use sms2flow?"
                answer="No! That's the beauty of sms2flow - it works on any mobile phone that can send text messages, including basic feature phones. You don't need internet access, apps, or a smartphone. Just your regular mobile phone."
              />

              <FaqItem
                question="What are the transaction fees?"
                answer="Our fees are transparent and competitive. You pay a small SMS processing fee (typically $0.10-0.50 per transaction) plus standard blockchain network fees. There are no hidden charges, and you'll always see the total cost before confirming any transaction."
              />

              <FaqItem
                question="How fast are SMS transactions processed?"
                answer="SMS transactions are typically processed within 1-3 minutes. The speed depends on your mobile carrier and the blockchain network congestion. You'll receive SMS confirmations at each step of the process, so you're always informed about your transaction status."
              />
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
                The world's first SMS-to-blockchain transaction platform. Send secure cryptocurrency transactions from
                any mobile phone, anywhere in the world.
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
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Product</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#features" className="text-sm text-slate-600 hover:text-[#08f08f]">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-sm text-slate-600 hover:text-[#08f08f]">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-600 hover:text-[#08f08f]">
                    API Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-600 hover:text-[#08f08f]">
                    Supported Currencies
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Support</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-slate-600 hover:text-[#08f08f]">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-600 hover:text-[#08f08f]">
                    Getting Started
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-600 hover:text-[#08f08f]">
                    SMS Commands
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-600 hover:text-[#08f08f]">
                    Security Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-600 hover:text-[#08f08f]">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-slate-600 hover:text-[#08f08f]">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-600 hover:text-[#08f08f]">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-600 hover:text-[#08f08f]">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-slate-600 hover:text-[#08f08f]">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} sms2flow. All rights reserved.</p>
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
              Cryptocurrency transactions involve risk. Please transact responsibly. sms2flow does not provide financial
              advice.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
