"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

const STORAGE_KEY = "sms2flow.locale"

const LanguageContext = createContext({
  locale: "es",
  setLocale: () => {},
})

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState("es")

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === "es" || saved === "en") {
      setLocale(saved)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    window.localStorage.setItem(STORAGE_KEY, locale)
  }, [locale])

  const value = useMemo(() => ({ locale, setLocale }), [locale])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}
