"use client"

import Link from "next/link"
import { Home, ArrowUpCircle, PlusCircle, Users, User } from "lucide-react"

interface BottomNavProps {
  active: "home" | "wallet" | "tool" | "team" | "mine"
}

export function BottomNav({ active }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-theme-purple/10 shadow-[0_-8px_32px_rgba(109,40,217,0.08)] z-50">
      <div className="flex items-center justify-around py-3 px-2">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-1.5 px-4 py-1 transition-all duration-300 ${active === "home" ? "text-theme-purple scale-110" : "text-theme-lavender-foreground/40 hover:text-theme-purple"
            }`}
        >
          <Home className={`h-6 w-6 ${active === "home" ? "fill-theme-purple/10" : ""}`} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${active === "home" ? "opacity-100" : "opacity-0"}`}>Home</span>
        </Link>

        <Link
          href="/deposit"
          className={`flex flex-col items-center gap-1.5 px-4 py-1 transition-all duration-300 ${active === "wallet" ? "text-theme-purple scale-110" : "text-theme-lavender-foreground/40 hover:text-theme-purple"
            }`}
        >
          <ArrowUpCircle className={`h-6 w-6 ${active === "wallet" ? "fill-theme-purple/10" : ""}`} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${active === "wallet" ? "opacity-100" : "opacity-0"}`}>Deposit</span>
        </Link>

        {/* Center Tool Button */}
        <Link
          href="/tool"
          className="flex flex-col items-center group -mt-12 transition-transform active:scale-90"
        >
          <div className="h-16 w-16 rounded-[2.2rem] bg-gradient-to-br from-theme-purple to-theme-violet flex items-center justify-center shadow-[0_12px_24px_rgba(124,58,237,0.4)] border-4 border-white transform group-hover:rotate-12 transition-transform duration-500">
            <PlusCircle className="h-9 w-9 text-white" />
          </div>
          <span className="text-[10px] font-black text-theme-purple uppercase tracking-widest mt-2">Invest</span>
        </Link>

        <Link
          href="/team"
          className={`flex flex-col items-center gap-1.5 px-4 py-1 transition-all duration-300 ${active === "team" ? "text-theme-purple scale-110" : "text-theme-lavender-foreground/40 hover:text-theme-purple"
            }`}
        >
          <Users className={`h-6 w-6 ${active === "team" ? "fill-theme-purple/10" : ""}`} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${active === "team" ? "opacity-100" : "opacity-0"}`}>Network</span>
        </Link>

        <Link
          href="/mine"
          className={`flex flex-col items-center gap-1.5 px-4 py-1 transition-all duration-300 ${active === "mine" ? "text-theme-purple scale-110" : "text-theme-lavender-foreground/40 hover:text-theme-purple"
            }`}
        >
          <User className={`h-6 w-6 ${active === "mine" ? "fill-theme-purple/10" : ""}`} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${active === "mine" ? "opacity-100" : "opacity-0"}`}>Menu</span>
        </Link>
      </div>
    </div>
  )
}
