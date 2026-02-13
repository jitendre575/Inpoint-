"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"
import { ArrowLeft, ChevronRight, Bell, Shield, User, HelpCircle, Info, Settings, ShieldCheck, Activity } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()

  const settingsOptions = [
    { icon: User, label: "Account Configuration", path: "/mine", sub: "User Identity & Node Details" },
    { icon: Bell, label: "Transmission Logs", path: "#", sub: "Node Synchronization Alerts" },
    { icon: ShieldCheck, label: "Security & Encryption", path: "/password", sub: "Credential Protocol Manager" },
    { icon: Activity, label: "Support Diagnostic", path: "/support", sub: "Live Ticket Resolution" },
    { icon: Info, label: "System Information", path: "/about", sub: "Legal & Maintenance Registry" },
  ]

  return (
    <div className="min-h-screen bg-[#0B1020] pb-24 font-sans selection:bg-purple-500/30 uppercase">
      {/* 1. Purple Header */}
      <div className="bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] text-white px-6 pt-16 pb-24 relative overflow-hidden rounded-b-[4rem] shadow-3xl border-b border-white/5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#5B2EFF]/10 rounded-full -mr-20 -mt-20 blur-[100px]" />

        <div className="relative z-10 flex items-center gap-6">
          <button
            onClick={() => router.back()}
            className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-md active:scale-90 transition-all border-0 shadow-inner"
          >
            <ArrowLeft className="h-6 w-6 text-[#00F0FF]" />
          </button>
          <div>
            <p className="text-slate-500 text-[9px] font-black tracking-[3px] mb-1">Operational Control</p>
            <h1 className="text-2xl font-black tracking-tight uppercase text-white leading-none">Device Core</h1>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-10 relative z-20 space-y-4 font-sans">
        {settingsOptions.map((option, index) => (
          <Card
            key={index}
            onClick={() => option.path !== "#" && router.push(option.path)}
            className="p-1 px-1 bg-[#0F1C3F]/40 glass-card border-white/5 shadow-xl rounded-[2rem] hover:shadow-[#5B2EFF]/10 transition-all cursor-pointer active:scale-[0.98] border-0"
          >
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 rounded-2xl bg-black/20 flex items-center justify-center shrink-0 border border-white/10 shadow-inner purple-glow">
                  <option.icon className="h-7 w-7 text-[#5B2EFF]" />
                </div>
                <div className="text-left font-sans">
                  <span className="font-black text-white text-[14px] block tracking-tight uppercase leading-none mb-1.5">{option.label}</span>
                  <span className="text-[9px] text-slate-500 font-black tracking-widest leading-none block">{option.sub}</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-700" />
            </div>
          </Card>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-12 text-center px-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-1.5 w-1.5 rounded-full bg-[#5B2EFF] animate-pulse" />
          <p className="text-[9px] text-slate-600 font-black tracking-[4px]">Verified Infrastructure Node</p>
        </div>
        <p className="text-[8px] text-slate-800 font-black tracking-widest">Version 5.2.9-PURPLE Built-in-Registry</p>
      </div>

      <BottomNav active="mine" />
    </div>
  )
}
