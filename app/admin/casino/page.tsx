
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
    ShieldCheck, ArrowLeft, RefreshCw, Users, Wallet,
    Gamepad2, CheckCircle2, XCircle, Timer, Activity
} from "lucide-react"

export default function AdminCasinoPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [bets, setBets] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const adminSecret = sessionStorage.getItem("adminSecret")
        if (!adminSecret) {
            router.push("/admin")
            return
        }
        fetchBets()
        const interval = setInterval(fetchBets, 5000)
        return () => clearInterval(interval)
    }, [])

    const fetchBets = async () => {
        const adminSecret = sessionStorage.getItem("adminSecret")
        try {
            const res = await fetch('/api/admin/casino', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminSecret, action: 'get_active_bets' })
            })
            if (res.ok) {
                const data = await res.json()
                setBets(data.bets || [])
            }
        } catch (e) {
            console.error("Fetch Error")
        } finally {
            setLoading(false)
        }
    }

    const handleResolve = async (betId: string, status: 'Win' | 'Loss', winAmount: number) => {
        const adminSecret = sessionStorage.getItem("adminSecret")
        try {
            const res = await fetch('/api/admin/casino', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminSecret, action: 'resolve_bet', betId, status, winAmount })
            })
            if (res.ok) {
                toast({ title: "Bet Resolved", description: `Bet status set to ${status}` })
                fetchBets()
            }
        } catch (e) {
            toast({ title: "Error", description: "Operation failed", variant: "destructive" })
        }
    }

    return (
        <div className="min-h-screen bg-[#F0FDF4] pb-20 font-sans">
            <header className="bg-indigo-900 text-white shadow-2xl sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full h-10 w-10 p-0" onClick={() => router.push('/admin/dashboard')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 bg-indigo-500 rounded-xl flex items-center justify-center p-1.5 shadow-lg">
                                <ShieldCheck className="h-full w-full text-white" />
                            </div>
                            <h1 className="text-xl font-black uppercase tracking-tight">Casino<span className="text-indigo-300">Control</span></h1>
                        </div>
                    </div>
                    <Button onClick={fetchBets} className="bg-white/10 text-white border-white/20 h-10 px-4 rounded-xl font-bold flex items-center gap-2">
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Sync
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: 'Active Bets', value: bets.length, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-100' },
                        { label: 'Live Rounds', value: '3', icon: Gamepad2, color: 'text-purple-600', bg: 'bg-purple-100' },
                        { label: 'Today Turnover', value: '₹42,500', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                        { label: 'Active Users', value: new Set(bets.map(b => b.userId)).size, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
                    ].map((stat, i) => (
                        <Card key={i} className="p-4 border-0 shadow-sm bg-white rounded-2xl flex items-center gap-3">
                            <div className={`${stat.bg} h-10 w-10 rounded-xl flex items-center justify-center shrink-0`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
                                <p className="text-lg font-black text-slate-900 leading-none mt-0.5">{stat.value}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Bets Monitoring */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                            <Timer className="h-5 w-5 text-indigo-500" /> Real-time Bets
                        </h2>
                        <Badge className="bg-indigo-600 text-white rounded-lg px-3 py-1 text-[10px] font-bold">LIVE FEED</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bets.length === 0 ? (
                            <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300">
                                <Gamepad2 className="h-12 w-12 mb-4 opacity-20" />
                                <p className="font-bold uppercase tracking-widest text-xs">Waiting for bets...</p>
                            </div>
                        ) : (
                            bets.map((bet) => (
                                <Card key={bet.id} className="p-5 border-0 shadow-md rounded-[2rem] bg-white hover:shadow-xl transition-all group overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <Gamepad2 className="h-10 w-10 text-indigo-900" />
                                    </div>

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center font-black text-indigo-600 uppercase border border-indigo-100">
                                            {bet.userName?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 leading-none text-sm">{bet.userName}</h4>
                                            <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{bet.gameId}</p>
                                        </div>
                                        <div className="ml-auto text-right">
                                            <p className="text-lg font-black text-indigo-700 leading-none">₹{bet.amount}</p>
                                            <p className="text-[8px] text-slate-300 font-bold uppercase mt-1">{new Date(bet.createdAt).toLocaleTimeString()}</p>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Selected Choice</span>
                                            <Badge className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-lg border-0">{bet.choice}</Badge>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleResolve(bet.id, 'Loss', 0)}
                                            className="flex-1 h-10 rounded-xl bg-red-50 hover:bg-red-500 hover:text-white text-red-600 font-bold text-[9px] uppercase tracking-widest border-0 transition-all active:scale-95"
                                        >
                                            <XCircle className="h-3.5 w-3.5 mr-1" /> Set Loss
                                        </Button>
                                        <Button
                                            onClick={() => handleResolve(bet.id, 'Win', bet.amount * 2)}
                                            className="flex-1 h-10 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-[9px] uppercase tracking-widest border-0 shadow-lg shadow-green-100 transition-all active:scale-95"
                                        >
                                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Win (2x)
                                        </Button>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
