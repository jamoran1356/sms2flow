"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the unified auth page with register tab active
    router.replace("/login?tab=register")
  }, [router])

  return null
}
