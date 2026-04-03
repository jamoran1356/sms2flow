"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle, MessageSquare } from "lucide-react"
import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "@/components/language-provider"
import LanguageSwitch from "@/components/language-switch"

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#08f08f]"></div></div>}>
      <AuthPageInner />
    </Suspense>
  )
}

function AuthPageInner() {
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("login")

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "register") setActiveTab("register")
  }, [searchParams])

  // Login state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState("")

  // Register state
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [regData, setRegData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })
  const [regLoading, setRegLoading] = useState(false)
  const [regError, setRegError] = useState("")
  const [regSuccess, setRegSuccess] = useState(false)

  const [googleLoading, setGoogleLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError("")
    try {
      const result = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      })
      if (result?.error) {
        setLoginError(result.error)
      } else {
        window.location.href = "/dashboard"
      }
    } catch {
      setLoginError(t("auth.loginError"))
    } finally {
      setLoginLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setRegError("")
    if (regData.password !== regData.confirmPassword) {
      setRegError(t("auth.passwordMismatch"))
      return
    }
    if (regData.password.length < 8) {
      setRegError(t("auth.passwordTooShort"))
      return
    }
    if (!regData.acceptTerms) {
      setRegError(t("auth.acceptTermsError"))
      return
    }
    setRegLoading(true)
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regData.name,
          email: regData.email,
          phone: regData.phone || undefined,
          password: regData.password,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setRegError(data.error || t("auth.registerError"))
        return
      }
      setRegSuccess(true)
      const signInResult = await signIn("credentials", {
        email: regData.email,
        password: regData.password,
        redirect: false,
      })
      if (signInResult?.ok) {
        window.location.href = "/dashboard"
      }
    } catch {
      setRegError(t("auth.connectionError"))
    } finally {
      setRegLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    try {
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch {
      setGoogleLoading(false)
    }
  }

  const handleRegInput = (e) => {
    const { name, value } = e.target
    setRegData((prev) => ({ ...prev, [name]: value }))
    setRegError("")
  }

  if (regSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-[#08f08f] mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900">{t("auth.accountCreated")}</h2>
          <p className="text-slate-600">{t("auth.walletGenerated")}</p>
          <div className="w-8 h-8 border-2 border-[#08f08f] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel - Brand visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#08f08f] via-emerald-500 to-teal-600 overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wOCI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTMwVjBoLTEydjRoMTJ6TTI0IDI0aDEydi0ySDE0djJoMTB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>

        <div className="relative flex flex-col items-center justify-center w-full p-12">
          {/* Logo */}
          <Link href="/" className="absolute top-8 left-8">
            <div className="relative h-16 w-16">
              <Image src="/images/logo.webp" alt="sms2flow" fill style={{ objectFit: "contain" }} priority />
            </div>
          </Link>

          {/* Person with phone illustration */}
          <div className="relative mb-8">
            <div className="w-64 h-64 relative">
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                <circle cx="100" cy="50" r="25" fill="white" fillOpacity="0.9" />
                <path d="M60 90 Q60 75 100 75 Q140 75 140 90 L140 160 Q140 170 130 170 L70 170 Q60 170 60 160 Z" fill="white" fillOpacity="0.9" />
                <path d="M70 100 L40 130" stroke="white" strokeWidth="8" strokeLinecap="round" strokeOpacity="0.9" />
                <path d="M130 100 L155 115" stroke="white" strokeWidth="8" strokeLinecap="round" strokeOpacity="0.9" />
                <rect x="145" y="100" width="25" height="40" rx="4" fill="white" stroke="#08f08f" strokeWidth="2" />
                <rect x="148" y="105" width="19" height="28" rx="2" fill="#08f08f" fillOpacity="0.3" />
                <rect x="135" y="60" width="50" height="20" rx="10" fill="white" />
                <text x="145" y="74" fontSize="8" fill="#08f08f" fontWeight="bold">SEND 5</text>
                <rect x="140" y="35" width="45" height="18" rx="9" fill="white" fillOpacity="0.7" />
                <text x="148" y="48" fontSize="7" fill="#059669" fontWeight="bold">✓ Enviado</text>
              </svg>
            </div>
          </div>

          {/* Text */}
          <div className="text-center space-y-4 max-w-md">
            <h1 className="text-3xl font-extrabold text-white leading-tight">
              {t("auth.brandTitle")}
            </h1>
            <p className="text-white/80 text-lg leading-relaxed">
              {t("auth.brandSubtitle")}
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 mt-8 justify-center">
            {t("auth.brandPills").map((feat) => (
              <span key={feat} className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white border border-white/30">
                <CheckCircle className="h-3.5 w-3.5" />
                {feat}
              </span>
            ))}
          </div>

          {/* Floating SMS bubbles decoration */}
          <div className="absolute bottom-12 left-12 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-white" />
              <code className="text-white/90 text-sm font-mono">SEND 5 FLOW +573...</code>
            </div>
          </div>
          <div className="absolute top-24 right-12 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <code className="text-white/90 text-xs font-mono">✓ 5 FLOW enviados</code>
          </div>
        </div>
      </div>

      {/* Right panel - Auth forms */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex justify-center mb-6 lg:hidden">
            <Link href="/">
              <div className="relative h-16 w-16">
                <Image src="/images/logo.webp" alt="sms2flow" fill style={{ objectFit: "contain" }} priority />
              </div>
            </Link>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-8">
            <button
              type="button"
              onClick={() => { setActiveTab("login"); setLoginError(""); }}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                activeTab === "login"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t("auth.loginTab")}
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("register"); setRegError(""); }}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                activeTab === "register"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t("auth.registerTab")}
            </button>
          </div>

          {/* Google button - shared */}
          <Button
            variant="outline"
            className="w-full bg-white hover:bg-gray-50 border-gray-200 shadow-sm h-11"
            onClick={handleGoogle}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2" />
            ) : (
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            {t("auth.continueGoogle")}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">{t("auth.orContinueEmail")}</span>
            </div>
          </div>

          {/* ─── Login Form ─── */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {loginError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="login-email">{t("auth.email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder={t("auth.emailPlaceholder")}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">{t("auth.password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    {showLoginPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <Link href="/forgot-password" className="text-sm text-[#08f08f] hover:underline font-medium">
                  {t("auth.forgotPassword")}
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#08f08f] hover:bg-[#07d07d] text-white font-semibold h-11 shadow-lg shadow-[#08f08f]/20"
                disabled={loginLoading}
              >
                {loginLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />}
                {t("auth.loginButton")}
              </Button>
            </form>
          )}

          {/* ─── Register Form ─── */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              {regError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {regError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="reg-name">{t("auth.fullName")}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="reg-name" name="name" type="text" placeholder={t("auth.fullNamePlaceholder")} value={regData.name} onChange={handleRegInput} className="pl-10" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">{t("auth.email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="reg-email" name="email" type="email" placeholder={t("auth.emailPlaceholder")} value={regData.email} onChange={handleRegInput} className="pl-10" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-phone">{t("auth.phone")}</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="reg-phone" name="phone" type="tel" placeholder={t("auth.phonePlaceholder")} value={regData.phone} onChange={handleRegInput} className="pl-10" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="reg-password">{t("auth.password")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="reg-password" name="password" type={showRegPassword ? "text" : "password"} placeholder={t("auth.passwordMin")} value={regData.password} onChange={handleRegInput} className="pl-10 pr-10" required minLength={8} />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowRegPassword(!showRegPassword)}>
                      {showRegPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-confirm">{t("auth.confirmPassword")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="reg-confirm" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" value={regData.confirmPassword} onChange={handleRegInput} className="pl-10 pr-10" required />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={regData.acceptTerms} onCheckedChange={(checked) => setRegData((prev) => ({ ...prev, acceptTerms: checked }))} />
                <Label htmlFor="terms" className="text-sm">
                  {t("auth.acceptTerms")}
                  <Link href="/terms" className="text-[#08f08f] hover:underline">{t("auth.terms")}</Link>
                  {t("auth.and")}
                  <Link href="/privacy" className="text-[#08f08f] hover:underline">{t("auth.privacyPolicy")}</Link>
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#08f08f] hover:bg-[#07d07d] text-white font-semibold h-11 shadow-lg shadow-[#08f08f]/20"
                disabled={regLoading}
              >
                {regLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />}
                {t("auth.createAccount")}
              </Button>
            </form>
          )}

          {/* Bottom link */}
          <p className="text-center text-sm text-slate-500 mt-6">
            {activeTab === "login" ? (
              <>{t("auth.noAccount")} <button type="button" onClick={() => setActiveTab("register")} className="text-[#08f08f] hover:underline font-medium">{t("auth.register")}</button></>
            ) : (
              <>{t("auth.hasAccount")} <button type="button" onClick={() => setActiveTab("login")} className="text-[#08f08f] hover:underline font-medium">{t("auth.login")}</button></>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
