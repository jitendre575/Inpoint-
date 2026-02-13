"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"
import { Wallet, ArrowDownCircle, ArrowUpCircle, Calculator, PieChart, Activity, ShieldCheck, Zap, History, ChevronRight } from "lucide-react"

export default function ToolPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/")
    } else {
      setUser(JSON.parse(currentUser))
    }
  }, [router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#0B1020] pb-32 font-sans selection:bg-purple-500/30 uppercase">
      {/* 1. Purple Header */}
      <div className="bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] text-white px-6 pt-16 pb-24 relative overflow-hidden rounded-b-[4rem] shadow-3xl border-b border-white/5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#5B2EFF]/10 rounded-full -mr-20 -mt-20 blur-[100px]" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md shadow-3xl mb-6 purple-glow">
            <LayoutGrid className="h-9 w-9 text-[#5B2EFF]" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">Maintenance Hub</h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[5px] mt-2">Operational Protocol v5.2</p>
        </div>
      </div>

      <div className="px-5 -mt-10 relative z-20 space-y-8">
        {/* 2. Main Banner */}
        <Card className="p-10 bg-[#121A33]/80 glass-card border-white/5 shadow-3xl rounded-[3.5rem] relative overflow-hidden text-center border-0">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <ShieldCheck className="h-28 w-28 text-white" />
          </div>
          <div className="relative z-10">
            <h2 className="text-xl font-black text-white mb-3 uppercase tracking-tight leading-none">Management Suite</h2>
            <p className="text-[10px] text-slate-500 font-black leading-loose uppercase tracking-widest max-w-[240px] mx-auto">Configure your liquidity flow and audit your portfolio nodes from a single dashboard.</p>
          </div>
        </Card>

        {/* 3. Action Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Deposit', sub: 'Credit Wallet', icon: ArrowDownCircle, color: 'text-[#5B2EFF]', bg: 'bg-[#5B2EFF]/10', path: '/deposit' },
            { label: 'Withdraw', sub: 'Exit Capital', icon: ArrowUpCircle, color: 'text-[#00F0FF]', bg: 'bg-[#00F0FF]/10', path: '/withdraw' },
            { label: 'Calculators', sub: 'Profit Projection', icon: Calculator, color: 'text-white', bg: 'bg-white/5' },
            { label: 'Analytics', sub: 'Growth Metrics', icon: PieChart, color: 'text-[#5B2EFF]', bg: 'bg-[#5B2EFF]/10' },
          ].map((item, idx) => (
            <Card
              key={idx}
              onClick={() => item.path && router.push(item.path)}
              className="p-7 cursor-pointer hover:shadow-[#5B2EFF]/10 transition-all active:scale-95 bg-[#0F1C3F]/40 glass-card border-white/5 rounded-[2.5rem] group border-0"
            >
              <div className={`h-12 w-12 ${item.bg} rounded-2xl flex items-center justify-center mb-5 group-hover:rotate-6 transition-transform shadow-xl purple-glow`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <h3 className="font-black text-white text-base mb-1.5 uppercase tracking-tight leading-none">{item.label}</h3>
              <p className="text-[8px] text-slate-500 font-black uppercase tracking-[3px] leading-none">{item.sub}</p>
            </Card>
          ))}
        </div>

        {/* 4. Recent Activity Log */}
        <Card className="p-10 bg-[#0F1C3F]/40 glass-card border-white/5 shadow-3xl rounded-[3.5rem] border-0">
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="font-black text-[10px] text-white uppercase tracking-[5px]">Audit Activity</h3>
            <History className="h-5 w-5 text-[#5B2EFF]" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 bg-black/20 rounded-[2rem] border border-white/5 shadow-inner">
              <div className="flex items-center gap-5">
                <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center shadow-2xl border border-white/10">
                  <Activity className="h-6 w-6 text-[#10B981]" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-white uppercase tracking-tight mb-1">Node Sync Successful</p>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Real-time update</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-800" />
            </div>

            <div className="text-center py-8">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[5px]">End of Registry</p>
            </div>
          </div>
        </Card>
      </div>

      <BottomNav active="tool" />
    </div>
  )
}

function LayoutGrid({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  )
}
