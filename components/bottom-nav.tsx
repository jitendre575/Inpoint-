"use client"

import Link from "next/link"
import { Home, Wallet, Zap, Users, UserCircle, LayoutGrid, CircleUser } from "lucide-react"

interface BottomNavProps {
  active: "home" | "wallet" | "tool" | "team" | "mine"
}

export function BottomNav({ active }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-green-50 shadow-[0_-10px_40px_rgba(34,197,94,0.06)] z-50">
      <div className="max-w-md mx-auto flex items-center justify-around py-3 px-2 relative h-[84px] font-sans">

        {/* Home Item */}
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${active === "home" ? "text-green-600 scale-105" : "text-slate-300 hover:text-green-300"}`}
        >
          <div className="p-1">
            <LayoutGrid className={`h-[24px] w-[24px] ${active === "home" ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest leading-none mt-0.5">Home</span>
        </Link>

        {/* Assets Item */}
        <Link
          href="/deposit"
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${active === "wallet" ? "text-green-600 scale-105" : "text-slate-300 hover:text-green-300"}`}
        >
          <div className="p-1">
            <Wallet className={`h-[24px] w-[24px] ${active === "wallet" ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest leading-none mt-0.5">Assets</span>
        </Link>

        {/* Central Action Item (Invest) */}
        <Link
          href="/tool"
          className="flex flex-col items-center group -mt-10 relative"
        >
          <div className="h-[68px] w-[68px] rounded-[22px] premium-gradient flex items-center justify-center shadow-[0_12px_30px_-5px_rgba(34,197,94,0.4)] border-[5px] border-white active:scale-95 transition-all duration-300 group-hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 opacity-20" />
            <Zap className="h-9 w-9 text-white relative z-10 fill-white" />
          </div>
          <span className="text-[10px] font-bold text-green-600 uppercase tracking-[2px] mt-2 leading-none">Invest</span>
        </Link>

        {/* Network Item */}
        <Link
          href="/team"
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${active === "team" ? "text-green-600 scale-105" : "text-slate-300 hover:text-green-300"}`}
        >
          <div className="p-1">
            <Users className={`h-[24px] w-[24px] ${active === "team" ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest leading-none mt-0.5">Network</span>
        </Link>

        {/* Profile Item */}
        <Link
          href="/mine"
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${active === "mine" ? "text-green-600 scale-105" : "text-slate-300 hover:text-green-300"}`}
        >
          <div className="p-1">
            <CircleUser className={`h-[24px] w-[24px] ${active === "mine" ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest leading-none mt-0.5">Profile</span>
        </Link>

      </div>
    </div>
  )
}
