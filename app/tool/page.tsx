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
      router.push("/login")
    } else {
      setUser(JSON.parse(currentUser))
    }
  }, [router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#F8FAF8] pb-32 font-sans selection:bg-green-100">
      {/* Premium Header */}
      <div className="bg-[#14532D] text-white px-6 pt-16 pb-24 relative overflow-hidden rounded-b-[4rem] shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/10 rounded-full -mr-20 -mt-20 blur-[100px]" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md shadow-inner mb-4">
            <LayoutGrid className="h-8 w-8 text-green-300" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight uppercase not-italic">Maintenance Hub</h1>
          <p className="text-green-300/40 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Operational Protocol v2.0</p>
        </div>
      </div>

      <div className="px-5 -mt-10 relative z-20 space-y-6">
        {/* Main Banner */}
        <Card className="p-8 bg-white border border-green-50 shadow-[0_20px_50px_rgba(20,83,45,0.06)] rounded-[3rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <ShieldCheck className="h-24 w-24 text-green-900" />
          </div>
          <div className="relative z-10">
            <h2 className="text-lg font-bold text-slate-900 mb-2 uppercase tracking-tight leading-none">Management Suite</h2>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed uppercase tracking-wider">Configure your liquidity flow and audit your portfolio nodes from a single dashboard.</p>
          </div>
        </Card>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card
            onClick={() => router.push("/deposit")}
            className="p-6 cursor-pointer hover:shadow-xl transition-all active:scale-95 bg-white border border-green-50 rounded-[2.5rem] group"
          >
            <div className="h-11 w-11 rounded-xl bg-green-50 flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
              <ArrowDownCircle className="h-6 w-6 text-green-600 group-hover:text-white transition-all" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1 uppercase tracking-tight">Deposit</h3>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Credit Wallet</p>
          </Card>

          <Card
            onClick={() => router.push("/withdraw")}
            className="p-6 cursor-pointer hover:shadow-xl transition-all active:scale-95 bg-white border border-green-50 rounded-[2.5rem] group"
          >
            <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition-colors">
              <ArrowUpCircle className="h-6 w-6 text-emerald-600 group-hover:text-white transition-all" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1 uppercase tracking-tight">Withdraw</h3>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Exit Capital</p>
          </Card>

          <Card className="p-6 cursor-pointer hover:shadow-xl transition-all active:scale-95 bg-white border border-green-50 rounded-[2.5rem] group">
            <div className="h-11 w-11 rounded-xl bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-[#14532D] transition-colors">
              <Calculator className="h-6 w-6 text-slate-600 group-hover:text-white transition-all" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1 uppercase tracking-tight">Calculators</h3>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Profit Projection</p>
          </Card>

          <Card className="p-6 cursor-pointer hover:shadow-xl transition-all active:scale-95 bg-white border border-green-50 rounded-[2.5rem] group">
            <div className="h-11 w-11 rounded-xl bg-green-50 flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
              <PieChart className="h-6 w-6 text-green-600 group-hover:text-white transition-all" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1 uppercase tracking-tight">Analytics</h3>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Growth Metrics</p>
          </Card>
        </div>

        {/* Recent Activity Log */}
        <Card className="p-8 bg-white border border-green-50 shadow-sm rounded-[3rem]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[11px] text-slate-900 uppercase tracking-[3px]">Audit Activity</h3>
            <History className="h-4 w-4 text-green-200" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50/50 rounded-2xl border border-green-50">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <Activity className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Node Sync Successful</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Real-time update</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-green-100" />
            </div>

            <div className="text-center py-6">
              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[4px]">End of Registry</p>
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
