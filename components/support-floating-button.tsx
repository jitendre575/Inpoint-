"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { HeadphonesIcon, MessageCircle } from "lucide-react"

export function SupportFloatingButton() {
    const pathname = usePathname()
    const [show, setShow] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        const checkAuth = () => {
            const currentUser = localStorage.getItem("currentUser")
            if (currentUser && !["/login", "/admin", "/"].includes(pathname)) {
                setShow(true)
            } else {
                setShow(false)
            }
        }

        checkAuth()
        window.addEventListener("storage", checkAuth)
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
            className="fixed bottom-[110px] right-6 z-40 h-[56px] w-[56px] bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.2)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 border-2 border-white/10 group"
            title="Customer Support"
        >
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white" />
            <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        </a>
    )
}
