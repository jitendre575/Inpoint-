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
      {/* 1. Refined Header */}
      <div className="bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] text-white px-5 pt-12 pb-16 relative overflow-hidden rounded-b-2xl shadow-xl border-b border-white/5">
        <div className="relative z-10 flex flex-col items-center">
          <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md shadow-xl mb-4">
            <LayoutGrid className="h-6 w-6 text-[#5B2EFF]" />
          </div>
          <h1 className="text-xl font-bold tracking-tight uppercase leading-none">Maintenance Hub</h1>
          <p className="text-slate-500 text-[9px] font-semibold uppercase tracking-widest mt-2">Operational Protocol v5.2</p>
        </div>
      </div>

      <div className="px-5 -mt-10 relative z-20 space-y-8">
        {/* 2. Main Banner */}
        <Card className="p-6 bg-[#121A33]/80 glass-card border-white/5 shadow-xl rounded-2xl relative overflow-hidden text-center border-0">
          <div className="relative z-10">
            <h2 className="text-lg font-bold text-white mb-2 uppercase tracking-tight leading-none">Management Suite</h2>
            <p className="text-[9px] text-slate-500 font-semibold leading-relaxed uppercase tracking-widest max-w-[240px] mx-auto">Configure your liquidity flow and audit your portfolio nodes from a single dashboard.</p>
          </div>
        </Card>

        {/* 3. Action Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Deposit', sub: 'Credit Wallet', icon: ArrowDownCircle, color: 'text-[#5B2EFF]', bg: 'bg-[#5B2EFF]/10', path: '/deposit' },
            { label: 'Withdraw', sub: 'Exit Capital', icon: ArrowUpCircle, color: 'text-[#00F0FF]', bg: 'bg-[#00F0FF]/10', path: '/withdraw' },
            { label: 'Calculators', sub: 'Profit Projection', icon: Calculator, color: 'text-white', bg: 'bg-white/5' },
            { label: 'Analytics', sub: 'Growth Metrics', icon: PieChart, color: 'text-[#5B2EFF]', bg: 'bg-[#5B2EFF]/10' },
          ].map((item, idx) => (
            <Card
              key={idx}
              onClick={() => item.path && router.push(item.path)}
              className="p-5 cursor-pointer hover:shadow-[#5B2EFF]/5 transition-all active:scale-95 bg-[#0F1C3F]/40 glass-card border-white/5 rounded-2xl group border-0"
            >
              <div className={`h-10 w-10 ${item.bg} rounded-xl flex items-center justify-center mb-4 transition-transform shadow-lg`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <h3 className="font-bold text-white text-sm mb-1 uppercase tracking-tight leading-none">{item.label}</h3>
              <p className="text-[7px] text-slate-500 font-semibold uppercase tracking-widest leading-none">{item.sub}</p>
            </Card>
          ))}
        </div>

        {/* 4. Recent Activity Log */}
        <Card className="p-6 bg-[#0F1C3F]/40 glass-card border-white/5 shadow-xl rounded-2xl border-0">
          <div className="flex items-center justify-between mb-6 px-1">
            <h3 className="font-bold text-[9px] text-white uppercase tracking-widest">Audit Activity</h3>
            <History className="h-4 w-4 text-[#5B2EFF]" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 shadow-inner">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center shadow-lg border border-white/10">
                  <Activity className="h-5 w-5 text-[#10B981]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white uppercase tracking-tight mb-0.5">Node Sync Successful</p>
                  <p className="text-[8px] text-slate-500 font-semibold uppercase tracking-widest leading-none">Real-time update</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-800" />
            </div>

            <div className="text-center py-4">
              <p className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest">End of Registry</p>
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
