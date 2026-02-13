
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"
import { ChevronRight, Gamepad2, Sparkles, Trophy, Wallet, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const GAMES = [
    {
        id: "color-predict",
        name: "Color Prediction",
        image: "https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?q=80&w=400&auto=format&fit=crop",
        description: "Predict the winning color to double your stake.",
        players: "1.2k+",
        tag: "Popular",
        color: "from-red-500 to-green-500"
    },
    {
        id: "mines",
        name: "Mines Gold",
        image: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=400&auto=format&fit=crop",
        description: "Uncover gold but beware of the hidden mines.",
        players: "800+",
        tag: "Hot",
        color: "from-amber-400 to-amber-600"
    },
    {
        id: "dice-duel",
        name: "Dice Duel",
        image: "https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=400&auto=format&fit=crop",
        description: "Fast-paced dice rolling action for big wins.",
        players: "500+",
        tag: "New",
        color: "from-blue-500 to-indigo-600"
    },
    {
        id: "crash",
        name: "Neon Crash",
        image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=400&auto=format&fit=crop",
        description: "Watch the multiplier grow and cash out before it crashes.",
        players: "2.1k+",
        tag: "Trending",
        color: "from-purple-500 to-pink-500"
    }
]

export default function CasinoPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const currentUser = localStorage.getItem("currentUser")
        if (!currentUser) {
            router.push("/")
            return
        }
        setUser(JSON.parse(currentUser))
    }, [router])

    if (!user) return null

    return (
        <div className="min-h-screen bg-[#0B1020] text-slate-200 pb-24 font-sans selection:bg-purple-500/30 uppercase">
            {/* 1. Purple Header */}
            <div className="bg-[#0B1020]/80 border-b border-white/5 px-6 pt-10 pb-6 sticky top-0 z-40 backdrop-blur-md">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-[#5B2EFF]/10 flex items-center justify-center border border-[#5B2EFF]/20 shadow-xl purple-glow">
                            <Gamepad2 className="h-6 w-6 text-[#5B2EFF]" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[3px] mb-1 leading-none">Casino Arena</p>
                            <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-none">Game Center</h1>
                        </div>
                    </div>
                    <div className="bg-white/5 px-4 py-2.5 rounded-2xl border border-white/10 flex items-center gap-2 shadow-inner">
                        <Wallet className="h-4 w-4 text-[#00F0FF]" />
                        <span className="text-sm font-black text-white tracking-tighter">₹{user.wallet?.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="px-6 mt-8 space-y-10">
                {/* 2. Banner Card */}
                <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] p-10 rounded-[3.5rem] mb-10 group shadow-3xl border border-white/5">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#5B2EFF]/10 rounded-full blur-[100px] -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="h-4.5 w-4.5 text-[#00F0FF]" />
                            <span className="text-[10px] font-black text-[#5B2EFF] uppercase tracking-[4px]">Supreme Wins</span>
                        </div>
                        <h2 className="text-4xl font-black text-white leading-none mb-3 uppercase tracking-tighter">Jackpot<br />Season Live</h2>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[3px] mb-10 leading-relaxed max-w-[220px]">Play your favorite games and win up to 100x rewards instantly.</p>
                        <Button className="premium-gradient text-white hover:scale-105 font-black text-[10px] uppercase tracking-[4px] px-10 rounded-2xl h-14 shadow-3xl border-0 transition-all active:scale-95 purple-glow">
                            Explore Now
                        </Button>
                    </div>
                    <Trophy className="absolute bottom-8 right-8 h-32 w-32 text-white/5 rotate-12" />
                </Card>

                {/* 3. Section Title */}
                <div className="flex items-center justify-between mb-8 px-2">
                    <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tighter leading-none mb-2">Live Games</h3>
                        <div className="h-1.5 w-10 bg-[#5B2EFF] rounded-full purple-glow" />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[4px]">4 Active Pools</span>
                </div>

                {/* 4. Games Grid */}
                <div className="grid grid-cols-1 gap-8">
                    {GAMES.map((game, idx) => (
                        <Card
                            key={game.id}
                            className="group relative overflow-hidden bg-[#0F1C3F]/40 glass-card border-white/5 rounded-[3rem] shadow-2xl hover:shadow-[#5B2EFF]/10 transition-all duration-500 border-0"
                        >
                            <div className="flex h-44">
                                <div className="w-1/2 relative overflow-hidden">
                                    <img src={game.image} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80" alt={game.name} />
                                    <div className={`absolute inset-0 bg-gradient-to-r from-[#0B1020] to-transparent opacity-60`} />
                                    <div className="absolute top-5 left-5">
                                        <Badge className="bg-[#5B2EFF] text-white border-0 text-[8px] font-black uppercase px-3 py-1.5 rounded-xl shadow-xl purple-glow">
                                            {game.tag}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="w-1/2 p-7 flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <h4 className="text-lg font-black text-white uppercase tracking-tight leading-none group-hover:text-[#5B2EFF] transition-colors">{game.name}</h4>
                                        <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-wider">{game.description}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto pt-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Live Nodes</span>
                                            <div className="flex items-center gap-1.5">
                                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                                <span className="text-[10px] font-black text-[#10B981] uppercase">{game.players}</span>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => router.push(`/casino/${game.id}`)}
                                            className="h-12 w-12 bg-white/5 hover:bg-[#5B2EFF] rounded-2xl flex items-center justify-center border border-white/10 text-white transition-all shadow-xl group-hover:scale-110 group-active:scale-95"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* 5. Info Card */}
                <div className="mt-12 p-8 bg-[#0F1C3F]/40 glass-card rounded-[2.5rem] border border-white/5 text-center mb-10 shadow-3xl">
                    <Zap className="h-10 w-10 text-[#5B2EFF] mx-auto mb-4 purple-glow" />
                    <h4 className="text-white font-black text-sm mb-2 uppercase tracking-[2px]">Ultra-Fast Settlements</h4>
                    <p className="text-slate-500 text-[10px] font-black leading-relaxed uppercase tracking-[3px] max-w-[240px] mx-auto">All game winnings are credited to your wallet in real-time under 2 seconds.</p>
                </div>
            </div>

            <BottomNav active="home" />
        </div>
    )
}
