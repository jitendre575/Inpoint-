"use client"

import Link from "next/link"
import { Home, Wallet, Zap, Users, UserCircle, LayoutGrid, CircleUser } from "lucide-react"

interface BottomNavProps {
  active: "home" | "wallet" | "tool" | "team" | "mine"
}

export function BottomNav({ active }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0B1020]/90 backdrop-blur-md border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50">
      <div className="max-w-md mx-auto flex items-center justify-around py-3 px-2 relative h-[84px] font-sans">

        {/* Home Item */}
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${active === "home" ? "text-[#5B2EFF] scale-105" : "text-slate-500 hover:text-slate-300"}`}
        >
          <div className="p-1">
            <LayoutGrid className={`h-[24px] w-[24px] ${active === "home" ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest leading-none mt-0.5">Home</span>
        </Link>

        {/* Assets Item */}
        <Link
          href="/deposit"
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${active === "wallet" ? "text-[#5B2EFF] scale-105" : "text-slate-500 hover:text-slate-300"}`}
        >
          <div className="p-1">
            <Wallet className={`h-[24px] w-[24px] ${active === "wallet" ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest leading-none mt-0.5">Assets</span>
        </Link>

        {/* Central Action Item (Invest) */}
        <Link
          href="/tool"
          className="flex flex-col items-center group -mt-10 relative"
        >
          <div className="h-[68px] w-[68px] rounded-[22px] premium-gradient flex items-center justify-center shadow-[0_12px_30px_-5px_rgba(91,46,255,0.4)] border-[5px] border-[#0B1020] active:scale-95 transition-all duration-300 group-hover:-translate-y-1 relative overflow-hidden purple-glow">
            <div className="absolute inset-0 bg-white/10 opacity-20" />
            <Zap className="h-9 w-9 text-white relative z-10 fill-white" />
          </div>
          <span className="text-[10px] font-black text-[#5B2EFF] uppercase tracking-[2px] mt-2 leading-none">Invest</span>
        </Link>

        {/* Network Item */}
        <Link
          href="/team"
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${active === "team" ? "text-[#5B2EFF] scale-105" : "text-slate-500 hover:text-slate-300"}`}
        >
          <div className="p-1">
            <Users className={`h-[24px] w-[24px] ${active === "team" ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest leading-none mt-0.5">Network</span>
        </Link>

        {/* Profile Item */}
        <Link
          href="/mine"
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${active === "mine" ? "text-[#5B2EFF] scale-105" : "text-slate-500 hover:text-slate-300"}`}
        >
          <div className="p-1">
            <CircleUser className={`h-[24px] w-[24px] ${active === "mine" ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest leading-none mt-0.5">Profile</span>
        </Link>

      </div>
    </div>
  )
}
