"use client"

import { Languages } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

const OPTIONS = [
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "en", label: "English", flag: "🇺🇸" },
]

export default function LanguageSwitch() {
  const { locale, setLocale } = useLanguage()

  return (
    <div className="fixed right-4 top-4 z-[70]">
      <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/95 p-1 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95">
        <span className="pl-2 text-slate-500 dark:text-slate-300" aria-hidden="true">
          <Languages className="h-4 w-4" />
        </span>
        {OPTIONS.map((option) => {
          const active = locale === option.code
          return (
            <button
              key={option.code}
              type="button"
              onClick={() => setLocale(option.code)}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                active
                  ? "bg-emerald-600 text-white shadow"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              }`}
              aria-pressed={active}
              aria-label={`Cambiar idioma a ${option.label}`}
              title={option.label}
            >
              <span className="text-sm" aria-hidden="true">
                {option.flag}
              </span>
              <span>{option.code.toUpperCase()}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
