"use client"

import { createContext, useContext, useCallback, useEffect, useMemo, useState } from "react"
import translations from "@/lib/translations"

const STORAGE_KEY = "sms2flow.locale"

const LanguageContext = createContext({
  locale: "es",
  setLocale: () => {},
  t: (key) => key,
})

/**
 * Resolve a dot-notation key against a nested object.
 * e.g. resolve(dict, "landing.hero.title")
 */
function resolve(obj, path) {
  return path.split(".").reduce((acc, part) => acc?.[part], obj)
}

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

  const t = useCallback(
    (key, vars) => {
      const dict = translations[locale] || translations.es
      let val = resolve(dict, key)
      if (val === undefined) {
        // fallback to Spanish
        val = resolve(translations.es, key)
      }
      if (val === undefined) return key
      if (typeof val === "string" && vars) {
        return val.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : `{${k}}`))
      }
      return val
    },
    [locale],
  )

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}
