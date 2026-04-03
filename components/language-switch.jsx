"use client"

import { useLanguage } from "@/components/language-provider"

const OPTIONS = [
  { code: "es", label: "Español", short: "ES" },
  { code: "en", label: "English", short: "EN" },
]

export default function LanguageSwitch({ className = "" }) {
  const { locale, setLocale } = useLanguage()

  return (
    <div className={`flex items-center gap-0.5 rounded-full border border-slate-200 bg-white/80 p-0.5 dark:border-slate-700 dark:bg-slate-800/80 ${className}`}>
      {OPTIONS.map((option) => {
        const active = locale === option.code
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => setLocale(option.code)}
            className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
              active
                ? "bg-[#08f08f] text-black shadow-sm"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
            aria-pressed={active}
            aria-label={option.label}
            title={option.label}
          >
            {option.short}
          </button>
        )
      })}
    </div>
  )
}
