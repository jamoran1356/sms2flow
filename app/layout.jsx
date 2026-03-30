import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import AuthProvider from "@/components/auth-provider"
import { LanguageProvider } from "@/components/language-provider"
import LanguageSwitch from "@/components/language-switch"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "sms2flow - SMS Crypto Payments",
  description:
    "Send and receive Flow blockchain tokens through simple SMS messages. Bringing crypto to everyone, one text at a time.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider attribute="class" defaultTheme="light">
              <LanguageSwitch />
              {children}
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
