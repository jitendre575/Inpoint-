"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before rendering to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const mobileKeywords = ["android", "webos", "iphone", "ipad", "ipod", "blackberry", "windows phone"]
      const isMobileDevice = mobileKeywords.some((keyword) => userAgent.includes(keyword))
      const isSmallScreen = window.innerWidth <= 768

      setIsMobile(isMobileDevice || isSmallScreen)
      setIsChecking(false)
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)
    return () => window.removeEventListener("resize", checkDevice)
  }, [mounted])

  useEffect(() => {
    if (!isChecking && isMobile) {
      router.push("/login")
    }
  }, [isChecking, isMobile, router])

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
      </div>
    )
  }

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
      </div>
    )
  }

  if (!isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Access Denied</h1>
          <p className="text-gray-600 mb-2 leading-relaxed">
            This application is exclusively designed for mobile devices.
          </p>
          <p className="text-sm text-gray-500">Please access this app from your smartphone or mobile device.</p>
        </div>
      </div>
    )
  }

  return null
}
