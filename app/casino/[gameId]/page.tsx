
"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {
    ArrowLeft, Wallet, Timer, Trophy, History,
    Gamepad2, Info, Loader2, Sparkles, AlertCircle
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function GamePlayPage() {
    const router = useRouter()
    const params = useParams()
    const { toast } = useToast()
    const gameId = params.gameId as string

    const [user, setUser] = useState<any>(null)
    const [betAmount, setBetAmount] = useState<string>("100")
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
    const [isPlacingBet, setIsPlacingBet] = useState(false)
    const [timeLeft, setTimeLeft] = useState(60)

    useEffect(() => {
        const currentUser = localStorage.getItem("currentUser")
        if (!currentUser) {
            router.push("/")
            return
        }
        const userData = JSON.parse(currentUser)
        setUser(userData)
        refreshBalance(userData.id)

        const timer = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 60)
        }, 1000)

        return () => clearInterval(timer)
    }, [router])

    const refreshBalance = async (userId: string) => {
        try {
            const res = await fetch(`/api/user?userId=${userId}`)
            if (res.ok) {
                const data = await res.json()
                setUser(data.user)
                localStorage.setItem("currentUser", JSON.stringify(data.user))
            }
        } catch (e) { }
    }

    const handlePlaceBet = async () => {
        if (!selectedChoice) {
            toast({ title: "Selection Required", description: "Please pick a choice before betting.", variant: "destructive" })
            return
        }
        if (!user || user.wallet < Number(betAmount)) {
            toast({ title: "Low Balance", description: "Please top up your wallet to continue.", variant: "destructive" })
            return
        }

        setIsPlacingBet(true)
        try {
            const res = await fetch('/api/casino/bet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    gameId,
                    amount: Number(betAmount),
                    choice: selectedChoice
                })
            })

            if (res.ok) {
                toast({ title: "Bet Placed Successfully!", description: `₹${betAmount} staked on ${selectedChoice}.` })
                refreshBalance(user.id)
                setSelectedChoice(null)
            } else {
                const data = await res.json()
                toast({ title: "Bet Failed", description: data.message, variant: "destructive" })
            }
        } catch (e) {
            toast({ title: "Error", description: "Internal Server Error", variant: "destructive" })
        } finally {
            setIsPlacingBet(false)
        }
    }

    if (!user) return null

    const gameInfo = {
        'color-predict': { name: 'Color Prediction', colors: ['bg-[#10B981]', 'bg-[#EF4444]', 'bg-[#5B2EFF]'], choices: ['Green', 'Red', 'Violet'] },
        'mines': { name: 'Mines Gold', colors: ['bg-[#F59E0B]', 'bg-slate-700'], choices: ['Safe', 'Mine'] },
        'dice-duel': { name: 'Dice Duel', colors: ['bg-[#3B82F6]', 'bg-[#5B2EFF]'], choices: ['1-3', '4-6'] },
        'crash': { name: 'Neon Crash', colors: ['bg-[#5B2EFF]'], choices: ['Cashout'] }
    }[gameId] || { name: 'Casino Game', colors: ['bg-[#5B2EFF]'], choices: ['Choice 1'] }

    return (
        <div className="min-h-screen bg-[#0B1020] text-slate-200 pb-12 font-sans selection:bg-purple-500/30 uppercase">
            {/* 1. Purple Header */}
            <div className="bg-[#0B1020]/80 border-b border-white/5 px-6 pt-10 pb-6 sticky top-0 z-40 backdrop-blur-md">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl h-11 w-11 p-0 border border-white/5 shadow-inner" onClick={() => router.push('/casino')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-tighter leading-none mb-1.5 uppercase">{gameInfo.name}</h1>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                <span className="text-[10px] font-black text-[#10B981] uppercase tracking-[3px]">Live Arena</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-inner">
                        <Wallet className="h-4 w-4 text-[#00F0FF]" />
                        <span className="text-sm font-black text-white tracking-tighter">₹{user.wallet?.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="px-6 py-8 space-y-10">
                {/* 2. Round Timer Card */}
                <Card className="bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] border-white/5 rounded-[3.5rem] p-10 text-center relative overflow-hidden shadow-3xl border-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#5B2EFF]/10 rounded-full blur-[80px] -mr-10 -mt-10" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-center gap-2 mb-8 px-4 py-1.5 bg-black/20 rounded-full w-fit mx-auto border border-white/5">
                            <Timer className="h-4 w-4 text-[#5B2EFF]" />
                            <span className="text-[10px] font-black text-[#5B2EFF] uppercase tracking-[5px]">Closing In</span>
                        </div>

                        <div className="text-7xl font-black text-white mb-10 tabular-nums tracking-tighter [text-shadow:0_0_40px_rgba(91,46,255,0.4)]">
                            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                        </div>

                        <div className="flex items-center justify-center gap-3">
                            <Badge className="bg-white/5 text-slate-500 border border-white/5 text-[9px] font-black uppercase py-2 px-4 rounded-xl tracking-widest">Round #290483</Badge>
                            <Badge className="bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 text-[9px] font-black uppercase py-2 px-4 rounded-xl tracking-widest">Betting Open</Badge>
                        </div>
                    </div>
                </Card>

                {/* 3. Prediction Choices */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    {gameInfo.choices.map((choice, i) => (
                        <button
                            key={choice}
                            onClick={() => setSelectedChoice(choice)}
                            className={`relative h-28 rounded-[2.5rem] p-1.5 transition-all duration-500 active:scale-95 border-0 ${selectedChoice === choice ? 'scale-105 shadow-3xl shadow-[#5B2EFF]/20' : 'opacity-60 grayscale-[0.4]'}`}
                        >
                            <div className={`h-full w-full rounded-[2.2rem] ${gameInfo.colors[i % gameInfo.colors.length]} flex flex-col items-center justify-center shadow-2xl relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-white/10 opacity-20" />
                                <Gamepad2 className="h-7 w-7 text-white/50 mb-2 relative z-10" />
                                <span className="text-[11px] font-black text-white uppercase tracking-tight relative z-10">{choice}</span>
                            </div>
                            {selectedChoice === choice && (
                                <div className="absolute -top-1.5 -right-1.5 h-8 w-8 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-2xl scale-110 animate-in fade-in zoom-in border-4 border-[#0B1020]">
                                    <Sparkles className="h-4 w-4 fill-current" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* 4. Bet Amount Selector */}
                <div className="space-y-6 mb-12">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[5px]">Stake Amount</h3>
                        <span className="text-[10px] font-black text-[#10B981] uppercase tracking-[3px] bg-[#10B981]/10 px-3 py-1.5 rounded-xl border border-[#10B981]/10">Win: ₹{Number(betAmount) * 2}</span>
                    </div>

                    <Card className="bg-[#0F1C3F]/40 glass-card border-white/5 rounded-[3.5rem] p-8 space-y-8 border-0">
                        <div className="flex gap-3">
                            {['50', '100', '500', '1000', '5000'].map(val => (
                                <button
                                    key={val}
                                    onClick={() => setBetAmount(val)}
                                    className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${betAmount === val ? 'bg-[#5B2EFF] text-white shadow-2xl purple-glow' : 'bg-black/20 text-slate-500 hover:text-white border border-white/5 shadow-inner'}`}
                                >
                                    ₹{val}
                                </button>
                            ))}
                        </div>
                        <div className="relative group">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 font-black text-xl group-focus-within:text-[#5B2EFF] transition-colors">₹</span>
                            <input
                                type="number"
                                value={betAmount}
                                onChange={(e) => setBetAmount(e.target.value)}
                                className="w-full h-16 bg-black/40 border-2 border-white/5 rounded-[2rem] pl-12 pr-6 text-xl font-black text-white focus:ring-4 focus:ring-[#5B2EFF]/10 focus:border-[#5B2EFF]/30 transition-all placeholder:text-slate-800"
                                placeholder="Custom amount..."
                            />
                        </div>
                    </Card>
                </div>

                {/* 5. Action Button */}
                <Button
                    onClick={handlePlaceBet}
                    disabled={isPlacingBet}
                    className="w-full h-18 premium-gradient text-white border-0 rounded-[2.5rem] font-black text-base uppercase tracking-[5px] shadow-3xl shadow-purple-900/40 active:scale-95 transition-all disabled:opacity-50 purple-glow py-8"
                >
                    {isPlacingBet ? (
                        <div className="flex items-center gap-3">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            Staking Protocol...
                        </div>
                    ) : (
                        "LOCK PREDICTION"
                    )}
                </Button>

                {/* 6. Info Grid */}
                <div className="grid grid-cols-2 gap-4 mt-12 pb-10">
                    <Card className="bg-[#0F1C3F]/40 glass-card border-white/5 p-6 rounded-[2.5rem] flex items-center gap-5 group hover:shadow-[#5B2EFF]/5 transition-all border-0 shadow-xl overflow-hidden active:scale-95">
                        <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl group-hover:rotate-6 transition-transform">
                            <History className="h-6 w-6 text-[#5B2EFF]" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[3px] mb-1">History</p>
                            <p className="text-xs font-black text-white uppercase leading-none">View Log</p>
                        </div>
                    </Card>
                    <Card className="bg-[#0F1C3F]/40 glass-card border-white/5 p-6 rounded-[2.5rem] flex items-center gap-5 group hover:shadow-[#00F0FF]/5 transition-all border-0 shadow-xl overflow-hidden active:scale-95">
                        <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl group-hover:rotate-6 transition-transform">
                            <Info className="h-6 w-6 text-[#00F0FF]" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[3px] mb-1">Rules</p>
                            <p className="text-xs font-black text-white uppercase leading-none">Fair Net</p>
                        </div>
                    </Card>
                </div>

                {/* 7. Warning Footer */}
                <div className="mt-16 flex items-center justify-center gap-4 opacity-40 select-none pb-12">
                    <ShieldCheck className="h-5 w-5 text-[#5B2EFF]" />
                    <p className="text-[9px] font-black uppercase tracking-[5px] text-slate-500">Secure Encrypted Gaming Node</p>
                </div>
            </div>
        </div>
    )
}
