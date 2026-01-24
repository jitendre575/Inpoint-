"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"
import { ArrowLeft, ShieldCheck, Zap, TrendingUp, HeadphonesIcon, FileText, Globe, Activity } from "lucide-react"

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#F8FAF8] pb-24 font-sans selection:bg-green-100 uppercase">
      {/* 1. Deep Green Header */}
      <div className="bg-[#14532D] text-white px-6 pt-16 pb-24 relative overflow-hidden rounded-b-[4rem] shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/10 rounded-full -mr-20 -mt-20 blur-[100px]" />

        <div className="relative z-10 flex items-center gap-6">
          <button
            onClick={() => router.back()}
            className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md active:scale-90 transition-all border-0 shadow-inner"
          >
            <ArrowLeft className="h-6 w-6 text-green-300" />
          </button>
          <div>
            <p className="text-green-300/40 text-[9px] font-bold uppercase tracking-[0.3em] mb-1">Corporate Registry</p>
            <h1 className="text-2xl font-bold tracking-tight uppercase not-italic">System Info</h1>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-10 relative z-20 space-y-6 font-sans">
        {/* Branding Node */}
        <Card className="p-8 bg-white border border-green-50 shadow-sm rounded-[3rem] relative overflow-hidden group border-0 text-center">
          <div className="h-20 w-20 bg-green-50 rounded-3xl mx-auto mb-6 flex items-center justify-center border border-green-100 shadow-inner group-hover:rotate-6 transition-transform">
            <Zap className="h-10 w-10 text-green-600 fill-green-600/10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-2">Inpoint Green Grow</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed px-4">The industry standard for secure digital asset management and tiered liquidity growth.</p>
        </Card>

        {/* Core Values */}
        <div className="space-y-4">
          <p className="text-slate-900 text-[10px] font-bold uppercase tracking-[3px] px-1">Infrastructure Pillars</p>
          <div className="grid gap-3">
            {[
              { title: "Bank-Grade Security", desc: "Military-grade encryption for all user nodes.", icon: ShieldCheck, color: "text-green-600", bg: "bg-green-50" },
              { title: "Yield Performance", desc: "Optimized ROI algorithms for max capital growth.", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
              { title: "Instant Settlements", desc: "Direct-to-bank automated payout resolution.", icon: Activity, color: "text-green-700", bg: "bg-green-100/50" }
            ].map((item, idx) => (
              <Card key={idx} className="p-5 bg-white border border-green-50 shadow-sm rounded-[2rem] flex gap-5 items-center border-0">
                <div className={`h-14 w-14 ${item.bg} rounded-2xl flex items-center justify-center shrink-0 border border-transparent shadow-inner`}>
                  <item.icon className={`h-7 w-7 ${item.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-[13px] uppercase tracking-tight mb-0.5">{item.title}</h3>
                  <p className="text-[9px] text-slate-400 font-medium uppercase tracking-widest">{item.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Transparency Registry */}
        <Card className="p-8 bg-white border border-green-50 shadow-sm rounded-[3rem] border-0">
          <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-[3px] mb-6">Transparency Registry</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-600 uppercase">Operational Status</span>
              </div>
              <span className="text-[8px] font-black bg-emerald-500 text-white px-2 py-1 rounded-lg uppercase animate-pulse">Online</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-600 uppercase">License Version</span>
              </div>
              <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">v4.1-STABLE</span>
            </div>
          </div>
        </Card>

        {/* Legal/T&C */}
        <div className="pb-12 px-2">
          <p className="text-[9px] text-slate-300 font-bold tracking-widest text-center uppercase leading-loose">
            By accessing this node, you confirm compliance with our tiered asset protocols and maintenance agreements. All capital is protected by secure-hash registry.
          </p>
        </div>
      </div>

      <BottomNav active="mine" />
    </div>
  )
}
