"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import LandingPage from "@/components/landing/LandingPage"

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      router.replace("/dashboard")
    } else {
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1020]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#5B2EFF] border-t-transparent purple-glow" />
      </div>
    )
  }

  return <LandingPage />
}
