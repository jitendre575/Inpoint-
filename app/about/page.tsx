"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"
import { ArrowLeft, ShieldCheck, Zap, TrendingUp, HeadphonesIcon, FileText, Globe, Activity } from "lucide-react"

export default function AboutPage() {
  const router = useRouter()

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
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[3px] mb-1">Corporate Registry</p>
            <h1 className="text-2xl font-black tracking-tight uppercase text-white leading-none">System Info</h1>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-10 relative z-20 space-y-6 font-sans">
        {/* Branding Node */}
        <Card className="p-10 glass-card bg-[#121A33]/80 border-white/5 shadow-3xl rounded-[3rem] relative overflow-hidden group text-center border-0">
          <div className="h-20 w-20 bg-[#5B2EFF]/10 rounded-3xl mx-auto mb-6 flex items-center justify-center border border-[#5B2EFF]/20 shadow-2xl group-hover:rotate-6 transition-transform purple-glow">
            <Zap className="h-10 w-10 text-[#00F0FF] fill-[#00F0FF]/10" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase mb-3">Inpoint Purple Elite</h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-loose px-4">The industry standard for secure digital asset management and tiered liquidity growth.</p>
        </Card>

        {/* Core Values */}
        <div className="space-y-4">
          <p className="text-white text-[10px] font-black uppercase tracking-[5px] px-1">Infrastructure Pillars</p>
          <div className="grid gap-3">
            {[
              { title: "Quantum Security", desc: "Military-grade encryption for all user nodes.", icon: ShieldCheck, color: "text-[#00F0FF]", bg: "bg-[#00F0FF]/10" },
              { title: "Yield Performance", desc: "Optimized ROI algorithms for max capital growth.", icon: TrendingUp, color: "text-[#5B2EFF]", bg: "bg-[#5B2EFF]/10" },
              { title: "Instant Settlements", desc: "Direct-to-bank automated payout resolution.", icon: Activity, color: "text-emerald-400", bg: "bg-emerald-400/10" }
            ].map((item, idx) => (
              <Card key={idx} className="p-6 glass-card bg-[#0F1C3F]/40 border-white/5 shadow-xl rounded-[2rem] flex gap-5 items-center border-0">
                <div className={`h-14 w-14 ${item.bg} rounded-2xl flex items-center justify-center shrink-0 border border-white/5 shadow-2xl`}>
                  <item.icon className={`h-7 w-7 ${item.color}`} />
                </div>
                <div>
                  <h3 className="font-black text-white text-[13px] uppercase tracking-tight mb-1 leading-none">{item.title}</h3>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">{item.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Transparency Registry */}
        <Card className="p-8 glass-card bg-[#0F1C3F]/40 border-white/5 shadow-xl rounded-[3rem] border-0">
          <h3 className="text-[10px] font-black text-white uppercase tracking-[5px] mb-8">Transparency Registry</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 bg-black/20 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-[#5B2EFF]" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operational Status</span>
              </div>
              <span className="text-[8px] font-black bg-emerald-500 text-white px-3 py-1.5 rounded-lg uppercase animate-pulse shadow-lg shadow-emerald-900/40">Online</span>
            </div>
            <div className="flex items-center justify-between p-5 bg-black/20 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-[#00F0FF]" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Version</span>
              </div>
              <span className="text-[10px] font-black text-white uppercase tracking-widest">v5.2-PURPLE</span>
            </div>
          </div>
        </Card>

        {/* Legal/T&C */}
        <div className="pb-12 px-6">
          <p className="text-[9px] text-slate-700 font-black tracking-[4px] text-center uppercase leading-loose">
            By accessing this node, you confirm compliance with our tiered asset protocols and maintenance agreements. All capital is protected by secure-hash registry.
          </p>
        </div>
      </div>

      <BottomNav active="mine" />
    </div>
  )
}
