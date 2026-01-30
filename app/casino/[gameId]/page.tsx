
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
            router.push("/login")
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
        'color-predict': { name: 'Color Prediction', colors: ['bg-green-500', 'bg-red-500', 'bg-violet-500'], choices: ['Green', 'Red', 'Violet'] },
        'mines': { name: 'Mines Gold', colors: ['bg-amber-500', 'bg-slate-700'], choices: ['Safe', 'Mine'] },
        'dice-duel': { name: 'Dice Duel', colors: ['bg-blue-500', 'bg-indigo-500'], choices: ['1-3', '4-6'] },
        'crash': { name: 'Neon Crash', colors: ['bg-purple-500'], choices: ['Cashout'] }
    }[gameId] || { name: 'Casino Game', colors: ['bg-indigo-500'], choices: ['Choice 1'] }

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-200 pb-12 font-sans selection:bg-indigo-500/30">
            {/* Game Header */}
            <div className="bg-[#1E293B] border-b border-slate-800 px-6 pt-10 pb-6 sticky top-0 z-40">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 rounded-full h-10 w-10 p-0" onClick={() => router.push('/casino')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-tight leading-none mb-1 uppercase">{gameInfo.name}</h1>
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Live Arena</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl px-4 py-2 flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm font-black text-white">₹{user.wallet?.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="px-6 py-8">
                {/* Round Timer Card */}
                <Card className="bg-gradient-to-br from-slate-900 via-[#1E293B] to-slate-900 border-0 rounded-[2.5rem] p-8 text-center mb-8 relative overflow-hidden shadow-2xl ring-1 ring-white/5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <Timer className="h-4 w-4 text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[4px]">Closing In</span>
                        </div>

                        <div className="text-6xl font-black text-white mb-6 tabular-nums tracking-tighter shadow-indigo-500/10 [text-shadow:0_0_30px_rgba(99,102,241,0.2)]">
                            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                        </div>

                        <div className="flex items-center justify-center gap-3">
                            <Badge className="bg-indigo-600/20 text-indigo-400 border-indigo-500/30 text-[9px] font-bold uppercase py-1 px-3 rounded-full">Round #290483</Badge>
                            <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/30 text-[9px] font-bold uppercase py-1 px-3 rounded-full">Betting Open</Badge>
                        </div>
                    </div>
                </Card>

                {/* Prediction Choices */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                    {gameInfo.choices.map((choice, i) => (
                        <button
                            key={choice}
                            onClick={() => setSelectedChoice(choice)}
                            className={`relative h-24 rounded-3xl p-1 transition-all duration-300 active:scale-95 ${selectedChoice === choice ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#0F172A]' : 'opacity-80 grayscale-[0.3]'}`}
                        >
                            <div className={`h-full w-full rounded-[1.4rem] ${gameInfo.colors[i % gameInfo.colors.length]} flex flex-col items-center justify-center shadow-lg`}>
                                <Gamepad2 className="h-6 w-6 text-white/50 mb-2" />
                                <span className="text-xs font-black text-white uppercase tracking-tight">{choice}</span>
                            </div>
                            {selectedChoice === choice && (
                                <div className="absolute -top-1 -right-1 h-6 w-6 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-xl scale-110 animate-in fade-in zoom-in">
                                    <Sparkles className="h-3 w-3 fill-current" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Bet Amount Selector */}
                <div className="space-y-4 mb-10">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stake Amount</h3>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Possible Win: ₹{Number(betAmount) * 2}</span>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
                        <div className="flex gap-4 mb-5">
                            {['50', '100', '500', '1000', '5000'].map(val => (
                                <button
                                    key={val}
                                    onClick={() => setBetAmount(val)}
                                    className={`flex-1 py-3 rounded-xl font-black text-[10px] transition-all ${betAmount === val ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                >
                                    ₹{val}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                            <input
                                type="number"
                                value={betAmount}
                                onChange={(e) => setBetAmount(e.target.value)}
                                className="w-full h-14 bg-slate-800 border-0 rounded-2xl pl-10 pr-5 text-lg font-black text-white focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="Custom amount..."
                            />
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <Button
                    onClick={handlePlaceBet}
                    disabled={isPlacingBet}
                    className="w-full h-16 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-0 rounded-2xl font-black text-base uppercase tracking-[3px] shadow-2xl shadow-indigo-900/40 active:scale-95 transition-all disabled:opacity-50"
                >
                    {isPlacingBet ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Staking Protocol...
                        </div>
                    ) : (
                        "LOCK PREDICTION"
                    )}
                </Button>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mt-12">
                    <Card className="bg-slate-900/50 border-slate-800 p-5 rounded-3xl flex items-center gap-4 group hover:bg-slate-800/50 transition-colors">
                        <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                            <History className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Round History</p>
                            <p className="text-xs font-bold text-white uppercase mt-0.5">View Results</p>
                        </div>
                    </Card>
                    <Card className="bg-slate-900/50 border-slate-800 p-5 rounded-3xl flex items-center gap-4 group hover:bg-slate-800/50 transition-colors">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <Info className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Game Rules</p>
                            <p className="text-xs font-bold text-white uppercase mt-0.5">Fair Protocol</p>
                        </div>
                    </Card>
                </div>

                {/* Warning Footer */}
                <div className="mt-12 flex items-center justify-center gap-3 opacity-30 select-none">
                    <AlertCircle className="h-4 w-4" />
                    <p className="text-[8px] font-black uppercase tracking-[3px]">Secure Encrypted Gaming Node</p>
                </div>
            </div>
        </div>
    )
}
