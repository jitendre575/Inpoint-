
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
            {/* Refined Header */}
            <div className="bg-[#0B1020]/90 border-b border-white/5 px-5 pt-12 pb-6 sticky top-0 z-40 backdrop-blur-md shadow-xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-[#5B2EFF]/10 flex items-center justify-center border border-[#5B2EFF]/20 shadow-lg">
                            <Gamepad2 className="h-5 w-5 text-[#5B2EFF]" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-[8px] font-bold uppercase tracking-widest leading-none mb-1">Casino Arena</p>
                            <h1 className="text-lg font-bold text-white tracking-tight uppercase leading-none">Game Center</h1>
                        </div>
                    </div>
                    <div className="bg-white/5 px-3 py-2 rounded-xl border border-white/10 flex items-center gap-2 shadow-inner">
                        <Wallet className="h-3.5 w-3.5 text-[#00F0FF]" />
                        <span className="text-sm font-bold text-white tracking-tight">₹{user.wallet?.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="px-5 mt-6 space-y-6">
                {/* 2. Banner Card */}
                <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#0F1C3F] to-[#0B1020] p-6 rounded-2xl group shadow-2xl border border-white/5">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="h-3.5 w-3.5 text-[#00F0FF]" />
                            <span className="text-[8px] font-bold text-[#5B2EFF] uppercase tracking-widest">Supreme Wins</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white leading-tight mb-2 uppercase tracking-tight">Jackpot<br />Season Live</h2>
                        <p className="text-slate-500 text-[8px] font-semibold uppercase tracking-widest mb-6 leading-relaxed max-w-[200px]">Play your favorite games and win up to 100x rewards instantly.</p>
                        <Button className="premium-gradient text-white hover:scale-105 font-bold text-[9px] uppercase tracking-widest px-6 rounded-xl h-11 shadow-lg border-0 transition-all active:scale-95">
                            Explore Now
                        </Button>
                    </div>
                </Card>

                {/* 3. Section Title */}
                <div className="flex items-center justify-between px-1">
                    <div>
                        <h3 className="text-base font-bold text-white uppercase tracking-tight leading-none mb-1.5">Live Games</h3>
                        <div className="h-1 w-8 bg-[#5B2EFF] rounded-full shadow-[0_0_8px_rgba(91,46,255,0.4)]" />
                    </div>
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">4 Active Pools</span>
                </div>

                {/* 4. Games Grid */}
                <div className="grid grid-cols-1 gap-6">
                    {GAMES.map((game, idx) => (
                        <Card
                            key={game.id}
                            className="group relative overflow-hidden bg-[#0F1C3F]/40 glass-card border-white/5 rounded-2xl shadow-xl hover:shadow-[#5B2EFF]/5 transition-all duration-500 border-0"
                        >
                            <div className="flex h-36">
                                <div className="w-[45%] relative overflow-hidden">
                                    <img src={game.image} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-80" alt={game.name} />
                                    <div className={`absolute inset-0 bg-gradient-to-r from-[#0B1020]/20 to-transparent`} />
                                    <div className="absolute top-3 left-3">
                                        <Badge className="bg-[#5B2EFF] text-white border-0 text-[7px] font-bold uppercase px-2 py-0.5 rounded-lg shadow-lg">
                                            {game.tag}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="w-[55%] p-4 flex flex-col justify-between">
                                    <div className="space-y-1">
                                        <h4 className="text-base font-bold text-white uppercase tracking-tight leading-none group-hover:text-[#5B2EFF] transition-colors">{game.name}</h4>
                                        <p className="text-[8px] text-slate-500 font-semibold leading-relaxed uppercase tracking-widest">{game.description}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest leading-none">Live Nodes</span>
                                            <div className="flex items-center gap-1">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[9px] font-bold text-[#10B981] uppercase">{game.players}</span>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => router.push(`/casino/${game.id}`)}
                                            className="h-9 w-9 bg-white/5 hover:bg-[#5B2EFF] rounded-xl flex items-center justify-center border border-white/10 text-white transition-all shadow-lg group-active:scale-95"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* 5. Info Card */}
                <div className="mt-8 p-6 bg-[#0F1C3F]/40 glass-card rounded-2xl border border-white/5 text-center mb-10 shadow-xl">
                    <Zap className="h-8 w-8 text-[#5B2EFF] mx-auto mb-3" />
                    <h4 className="text-white font-bold text-xs mb-1.5 uppercase tracking-widest">Ultra-Fast Settlements</h4>
                    <p className="text-slate-500 text-[8px] font-semibold leading-relaxed uppercase tracking-widest max-w-[200px] mx-auto">All game winnings are credited to your wallet in real-time under 2 seconds.</p>
                </div>
            </div>

            <BottomNav active="home" />
        </div>
    )
}
