"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { HeadphonesIcon } from "lucide-react"

export function SupportFloatingButton() {
    const pathname = usePathname()
    const [show, setShow] = useState(false)

    useEffect(() => {
        // Check if user is logged in
        const checkAuth = () => {
            const currentUser = localStorage.getItem("currentUser")
            // Show only if logged in AND not on auth pages
            if (currentUser && !["/login", "/create-account", "/admin", "/"].includes(pathname)) {
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
    }, [pathname])

    if (!show) return null

    return (
        <a
            href="/support"
            className="fixed bottom-24 right-5 z-50 h-14 w-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 border-2 border-white/20"
            title="Customer Support"
        >
            <HeadphonesIcon className="h-6 w-6" />
        </a>
    )
}
