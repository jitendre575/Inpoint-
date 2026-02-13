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
      {/* 1. Refined Header */}
      <div className="bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] text-white px-5 pt-12 pb-16 relative overflow-hidden rounded-b-2xl shadow-xl border-b border-white/5">
        <div className="relative z-10 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-md active:scale-90 transition-all"
          >
            <ArrowLeft className="h-5 w-5 text-[#00F0FF]" />
          </button>
          <div>
            <p className="text-slate-500 text-[8px] font-semibold tracking-widest uppercase mb-0.5">Operational Control</p>
            <h1 className="text-lg font-bold tracking-tight uppercase text-white leading-none">Device Core</h1>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-6 relative z-20 space-y-3">
        {settingsOptions.map((option, index) => (
          <Card
            key={index}
            onClick={() => option.path !== "#" && router.push(option.path)}
            className="bg-[#0F1C3F]/40 glass-card border-white/5 shadow-lg rounded-xl hover:shadow-[#5B2EFF]/5 transition-all cursor-pointer active:scale-[0.99] border-0"
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-black/20 flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
                  <option.icon className="h-5 w-5 text-[#5B2EFF]" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-white text-sm block tracking-tight uppercase leading-none mb-1">{option.label}</span>
                  <span className="text-[8px] text-slate-500 font-semibold tracking-widest leading-none block uppercase">{option.sub}</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-700" />
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
