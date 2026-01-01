"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CreateAccountPage() {
  const router = useRouter()

  useEffect(() => {
    // Immediately redirect to login page
    // Account creation is disabled
    router.replace("/login")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
    </div>
  )
}
