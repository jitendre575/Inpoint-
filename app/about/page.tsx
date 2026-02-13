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
      {/* Refined Header */}
      <div className="bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] text-white px-5 pt-12 pb-16 relative overflow-hidden rounded-b-2xl shadow-xl border-b border-white/5">
        <div className="relative z-10 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-md active:scale-95 transition-all shadow-lg"
          >
            <ArrowLeft className="h-5 w-5 text-[#00F0FF]" />
          </button>
          <div>
            <p className="text-slate-500 text-[8px] font-bold uppercase tracking-widest leading-none mb-1.5">Corporate Registry</p>
            <h1 className="text-xl font-bold tracking-tight uppercase text-white leading-none">System Info</h1>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-8 relative z-20 space-y-6 font-sans">
        {/* Branding Node */}
        <Card className="p-8 glass-card bg-[#121A33]/80 border-white/5 shadow-xl rounded-2xl relative overflow-hidden group text-center border-0">
          <div className="h-16 w-16 bg-[#5B2EFF]/10 rounded-2xl mx-auto mb-4 flex items-center justify-center border border-[#5B2EFF]/20 shadow-lg group-hover:rotate-3 transition-transform">
            <Zap className="h-8 w-8 text-[#00F0FF] fill-[#00F0FF]/10" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight uppercase mb-2">Inpoint Purple Elite</h2>
          <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed px-4">The industry standard for secure digital asset management and tiered liquidity growth.</p>
        </Card>

        {/* Core Values */}
        <div className="space-y-3.5">
          <p className="text-[#00F0FF] text-[8px] font-bold uppercase tracking-widest px-1">Infrastructure Pillars</p>
          <div className="grid gap-3">
            {[
              { title: "Quantum Security", desc: "Military-grade encryption for all user nodes.", icon: ShieldCheck, color: "text-[#00F0FF]", bg: "bg-[#00F0FF]/10" },
              { title: "Yield Performance", desc: "Optimized ROI algorithms for max capital growth.", icon: TrendingUp, color: "text-[#5B2EFF]", bg: "bg-[#5B2EFF]/10" },
              { title: "Instant Settlements", desc: "Direct-to-bank automated payout resolution.", icon: Activity, color: "text-emerald-400", bg: "bg-emerald-400/10" }
            ].map((item, idx) => (
              <Card key={idx} className="p-5 glass-card bg-[#0F1C3F]/40 border-white/5 shadow-lg rounded-2xl flex gap-4 items-center border-0">
                <div className={`h-11 w-11 ${item.bg} rounded-xl flex items-center justify-center shrink-0 border border-white/5 shadow-lg`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-xs uppercase tracking-tight mb-0.5 leading-none">{item.title}</h3>
                  <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">{item.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Transparency Registry */}
        <Card className="p-6 glass-card bg-[#0F1C3F]/40 border-white/5 shadow-xl rounded-2xl border-0">
          <h3 className="text-[8px] font-bold text-white uppercase tracking-widest mb-6">Transparency Registry</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-[#5B2EFF]" />
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Operational Status</span>
              </div>
              <span className="text-[7px] font-bold bg-emerald-500 text-white px-2 py-1 rounded-md uppercase animate-pulse">Online</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-[#00F0FF]" />
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Protocol Version</span>
              </div>
              <span className="text-[8px] font-bold text-white uppercase tracking-widest">v5.2-PURPLE</span>
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
