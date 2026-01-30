
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
            router.push("/login")
            return
        }
        setUser(JSON.parse(currentUser))
    }, [router])

    if (!user) return null

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-200 pb-24 font-sans selection:bg-indigo-500/30">
            {/* Premium Header */}
            <div className="bg-[#1E293B]/50 backdrop-blur-xl border-b border-slate-800 px-6 pt-10 pb-6 sticky top-0 z-40">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Gamepad2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Casino Arena</p>
                            <h1 className="text-xl font-black text-white tracking-tight">Game Center</h1>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 px-4 py-2 rounded-2xl border border-slate-800 flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm font-black text-white">₹{user.wallet?.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="px-6 mt-8">
                {/* Banner Card */}
                <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-indigo-900 to-purple-900 p-8 rounded-[2.5rem] mb-10 group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="h-4 w-4 text-amber-400 fill-amber-400" />
                            <span className="text-[10px] font-black text-indigo-200 uppercase tracking-[3px]">Supreme Wins</span>
                        </div>
                        <h2 className="text-3xl font-black text-white leading-tight mb-2">Jackpot<br />Season Live</h2>
                        <p className="text-indigo-200/60 text-xs font-bold uppercase tracking-widest mb-6 leading-relaxed">Play your favorite games and win up to 100x rewards instantly.</p>
                        <Button className="bg-white text-indigo-900 hover:bg-indigo-50 font-black text-xs uppercase tracking-widest px-8 rounded-xl h-12 shadow-xl border-0 transition-all active:scale-95">
                            Explore Now
                        </Button>
                    </div>
                    <Trophy className="absolute bottom-6 right-6 h-24 w-24 text-white/5 rotate-12" />
                </Card>

                {/* Section Title */}
                <div className="flex items-center justify-between mb-6 px-1">
                    <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tighter">Live Games</h3>
                        <div className="h-1 w-8 bg-indigo-500 rounded-full mt-1" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">4 Active Pools</span>
                </div>

                {/* Games Grid */}
                <div className="grid grid-cols-1 gap-6">
                    {GAMES.map((game, idx) => (
                        <Card
                            key={game.id}
                            className="group relative overflow-hidden bg-slate-900 border-0 rounded-[2rem] shadow-2xl hover:ring-2 hover:ring-indigo-500/50 transition-all duration-300"
                        >
                            <div className="flex h-40">
                                <div className="w-1/2 relative overflow-hidden">
                                    <img src={game.image} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" alt={game.name} />
                                    <div className={`absolute inset-0 bg-gradient-to-r ${game.color} opacity-20`} />
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full">
                                            {game.tag}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="w-1/2 p-5 flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-base font-black text-white mb-1 uppercase tracking-tight">{game.name}</h4>
                                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{game.description}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Live Players</span>
                                            <div className="flex items-center gap-1">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] font-bold text-emerald-400">{game.players}</span>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => router.push(`/casino/${game.id}`)}
                                            className="h-9 w-9 bg-white/5 hover:bg-indigo-600 rounded-xl flex items-center justify-center border border-white/10 text-white transition-all group-hover:bg-indigo-600 group-hover:border-indigo-500"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ backgroundImage: `linear-gradient(to right, ${game.color.split(' ')[1]}, ${game.color.split(' ')[3]})` }}
                            />
                        </Card>
                    ))}
                </div>

                {/* Info Card */}
                <div className="mt-10 p-6 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-center mb-10">
                    <Zap className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
                    <h4 className="text-white font-bold text-sm mb-1">Ultra-Fast Settlements</h4>
                    <p className="text-slate-400 text-[10px] leading-relaxed max-w-[200px] mx-auto">All game winnings are credited to your wallet in real-time under 2 seconds.</p>
                </div>
            </div>

            <BottomNav active="home" />
        </div>
    )
}
