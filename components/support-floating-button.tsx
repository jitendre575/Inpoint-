"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { HeadphonesIcon } from "lucide-react"

export function SupportFloatingButton() {
    const pathname = usePathname()
    const [show, setShow] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Ensure component is mounted before accessing browser APIs
    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        // Check if user is logged in
        const checkAuth = () => {
            const currentUser = localStorage.getItem("currentUser")
            // Show only if logged in AND not on auth pages
            if (currentUser && !["/login", "/admin", "/"].includes(pathname)) {
                setShow(true)
            } else {
                setShow(false)
            }
        }

        checkAuth()
        // Listen for storage events (login/logout sync)
        window.addEventListener("storage", checkAuth)
        // Also listen to custom event if we emit one on login
        window.addEventListener("login-state-change", checkAuth)

        return () => {
            window.removeEventListener("storage", checkAuth)
            window.removeEventListener("login-state-change", checkAuth)
        }
    }, [pathname, mounted])

    if (!show) return null

    return (
        <a
            href="/support"
            className="fixed bottom-24 right-5 z-50 h-16 w-16 bg-gradient-to-br from-theme-purple to-theme-violet hover:from-theme-violet hover:to-theme-purple text-white rounded-[2rem] shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 border-4 border-white"
            title="Customer Support"
        >
            <HeadphonesIcon className="h-8 w-8" />
        </a>
    )
}
