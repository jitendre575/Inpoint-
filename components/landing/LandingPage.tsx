"use client"

import { useState, useEffect } from "react"
import {
    ShieldCheck,
    TrendingUp,
    Users,
    Menu,
    X,
    Lock,
    Zap,
    HelpCircle,
    FileText,
    DollarSign,
    Briefcase,
    Activity,
    Globe,
    Settings,
    Target,
    Rocket,
    Sparkles,
    ChevronDown,
    Award,
    CreditCard,
    CheckCircle2,
    ArrowRight,
    Trophy,
    Handshake,
    PieChart,
    Timer,
    Flame,
    Gem,
    Megaphone,
    ShieldAlert,
    Star,
    Wallet,
    LayoutDashboard
} from "lucide-react"
import AuthModal from "../auth/AuthModal"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export default function LandingPage() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [authMode, setAuthMode] = useState<"login" | "signup">("login")
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [activeFaq, setActiveFaq] = useState<number | null>(null)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    const openAuth = (mode: "login" | "signup") => {
        setAuthMode(mode)
        setIsAuthModalOpen(true)
    }

    const referralTiers = [
        { level: "L1 Member", reward: "10% Commission", color: "bg-purple-500", text: "Direct sub-node activation" },
        { level: "L2 Partner", reward: "5% Commission", color: "bg-cyan-500", text: "Secondary cluster returns" },
        { level: "L3 Elite", reward: "2% Commission", color: "bg-emerald-500", text: "Tier 3 network yields" }
    ]

    const successStories = [
        { name: "Rahul S.", profit: "₹45,200", text: "Stable daily alpha for 4 months.", icon: <Star className="text-yellow-400" size={16} /> },
        { name: "Priya K.", profit: "₹1,12,000", text: "Passive yields transformed my ledger.", icon: <Flame className="text-orange-500" size={16} /> },
        { name: "Amit M.", profit: "₹28,500", text: "Instant settlements, zero friction.", icon: <Zap className="text-blue-400" size={16} /> }
    ]

    return (
        <div className="min-h-screen bg-[#0B1020] text-slate-300 font-sans selection:bg-purple-500/30 scroll-smooth">
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
            />

            {/* Modern Floating Mobile CTA */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] md:hidden w-[85%] max-w-[320px]">
                <button
                    onClick={() => openAuth("signup")}
                    className="w-full flex items-center justify-center gap-2.5 py-4 premium-gradient text-white font-bold rounded-lg shadow-[0_10px_30px_-10px_rgba(91,46,255,1)] text-[10px] uppercase tracking-[3px] border-0 animate-pulse-glow"
                >
                    <Sparkles size={14} /> Start Earning Today
                </button>
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B1020]/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 premium-gradient rounded-md flex items-center justify-center shadow-lg shadow-purple-500/20">
                                <ShieldCheck className="text-white h-5 w-5" />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-white uppercase">Inpoint <span className="text-[#00F0FF]">Purple</span></span>
                        </div>

                        <div className="hidden md:flex items-center gap-8">
                            <a href="#how-it-works" className="text-[9px] font-bold text-slate-400 hover:text-white transition-all uppercase tracking-[2.5px]">Protocol</a>
                            <a href="#benefits" className="text-[9px] font-bold text-slate-400 hover:text-white transition-all uppercase tracking-[2.5px]">Authority</a>
                            <a href="#pricing" className="text-[9px] font-bold text-slate-400 hover:text-white transition-all uppercase tracking-[2.5px]">Capital</a>
                            <div className="w-px h-3.5 bg-white/10" />
                            <button onClick={() => openAuth("login")} className="text-[9px] font-bold text-slate-400 hover:text-white uppercase tracking-[2px]">Log In</button>
                            <button
                                onClick={() => openAuth("signup")}
                                className="px-6 py-2.5 premium-gradient text-white text-[9px] font-bold uppercase tracking-[2px] rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all outline-none border-0 purple-glow"
                            >
                                Join Now
                            </button>
                        </div>

                        <button className="md:hidden p-2 text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-40 bg-[#0B1020] pt-24 px-8 md:hidden transition-all duration-500 transform ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
                <div className="flex flex-col gap-6">
                    <a href="#how-it-works" className="text-xl font-bold text-white uppercase tracking-tight" onClick={() => setIsMobileMenuOpen(false)}>The Protocol</a>
                    <a href="#benefits" className="text-xl font-bold text-white uppercase tracking-tight" onClick={() => setIsMobileMenuOpen(false)}>Security Node</a>
                    <a href="#pricing" className="text-xl font-bold text-white uppercase tracking-tight" onClick={() => setIsMobileMenuOpen(false)}>Wealth Tiers</a>
                    <div className="h-px bg-white/5 w-16" />
                    <button onClick={() => { setIsMobileMenuOpen(false); openAuth("login"); }} className="w-full py-4 text-center font-bold text-white bg-white/5 rounded-lg uppercase tracking-widest text-[10px]">Access Hub</button>
                    <button onClick={() => { setIsMobileMenuOpen(false); openAuth("signup"); }} className="w-full py-4 text-center font-bold text-white premium-gradient rounded-lg uppercase tracking-widest text-[10px]">Create Profile</button>
                </div>
            </div>

            <main>
                {/* Modern Hero Section */}
                <section className="relative pt-32 pb-20 overflow-hidden bg-[#0B1020]">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#5B2EFF]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-40" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00F0FF]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-20" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <div className="text-center max-w-4xl mx-auto space-y-8">
                            <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                <button onClick={() => openAuth("signup")} className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#5B2EFF]/20 border border-[#5B2EFF]/30 rounded-full text-[10px] font-black uppercase tracking-[3px] text-[#00F0FF] mb-6 hover:bg-[#5B2EFF]/30 transition-all group">
                                    <Trophy size={14} className="group-hover:rotate-12 transition-transform" /> New User Bonus: Claim ₹200 trial node
                                </button>
                                <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.95] uppercase">
                                    Digital Wealth <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B2EFF] to-[#00F0FF] drop-shadow-[0_0_20px_rgba(0,240,255,0.2)]">Precision Mastery</span>
                                </h1>
                                <p className="mt-8 text-base md:text-lg text-slate-400 font-bold uppercase tracking-widest leading-relaxed max-w-3xl mx-auto opacity-70">
                                    Deploy low-latency capital nodes into our high-performance alpha protocol. Securely manage institutional-grade assets through our distributed cluster.
                                </p>
                            </div>

                            <div className={`flex flex-col sm:flex-row items-center justify-center gap-5 transition-all duration-1000 delay-200 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                <button onClick={() => openAuth("signup")} className="w-full sm:w-auto px-12 py-5 premium-gradient text-white font-black rounded-xl shadow-2xl hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-[4px] border-0 animate-pulse-glow">Initialize Account</button>
                                <button onClick={() => openAuth("login")} className="w-full sm:w-auto px-12 py-5 bg-white/5 border border-white/10 text-white font-black rounded-xl hover:bg-white/10 transition-all text-xs uppercase tracking-[4px]">Member Access</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Join Us / Daily Profit Section */}
                <section className="py-24 bg-[#0B1020]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-10">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[5px] text-[#5B2EFF]">Yield Infrastructure</span>
                                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mt-4 uppercase leading-none">Why Choose <br /> Inpoint Purple?</h2>
                                    <p className="text-slate-500 font-bold text-sm mt-6 leading-relaxed max-w-xl uppercase tracking-widest">
                                        We provide the world's most stable digital asset growth node system, built on high-probability alpha algorithms.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { t: "Automated Daily ROI", d: "Harvest yields every 24 hours without manual intervention.", i: <TrendingUp className="text-[#00F0FF]" /> },
                                        { t: "Secured Nodes", d: "Your principal is protected by multi-signature cold storage.", i: <ShieldCheck className="text-[#5B2EFF]" /> },
                                        { t: "Instant Liquidity", d: "Withdraw your profits directly to any verified bank node.", i: <Zap className="text-emerald-400" /> }
                                    ].map((item, idx) => (
                                        <div key={idx} className="glass-card p-6 flex gap-6 items-center hover-lift neon-border">
                                            <div className="h-12 w-12 bg-[#0F1C3F] rounded-xl flex items-center justify-center border border-white/5 shrink-0 shadow-lg">
                                                {item.i}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-white uppercase text-xs tracking-widest mb-1">{item.t}</h4>
                                                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider leading-relaxed">{item.d}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#5B2EFF]/10 blur-[100px] rounded-full" />
                                <Card className="relative glass-card p-10 bg-gradient-to-br from-[#121A33] to-[#0B1020] border-white/10 overflow-hidden shadow-3xl">
                                    <div className="flex items-center justify-between mb-10">
                                        <h3 className="text-xs font-black text-white uppercase tracking-[4px]">Daily Profit Engine</h3>
                                        <Badge className="bg-[#00F0FF]/10 text-[#00F0FF] border-0 text-[8px] font-black uppercase tracking-widest">v4.0 Live</Badge>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="flex justify-between items-end border-b border-white/5 pb-6">
                                            <div>
                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Alpha Payout Goal</p>
                                                <p className="text-4xl font-black text-white tracking-tighter">₹2,500 <span className="text-emerald-400">/ DAY</span></p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Node Efficiency</p>
                                                <p className="text-xl font-black text-[#00F0FF]">98.7%</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="flex-1 bg-white/5 p-5 rounded-xl border border-white/5">
                                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Cycle Length</p>
                                                <p className="text-sm font-black text-white uppercase">30 Days</p>
                                            </div>
                                            <div className="flex-1 bg-white/5 p-5 rounded-xl border border-white/5">
                                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Net ROI</p>
                                                <p className="text-sm font-black text-emerald-400 uppercase">150% - 300%</p>
                                            </div>
                                        </div>
                                        <button onClick={() => openAuth("signup")} className="w-full py-5 premium-gradient text-white font-black text-[10px] uppercase tracking-[4px] rounded-xl shadow-xl hover:scale-105 transition-all border-0">Initiate Growth Protocol</button>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Passive Income / After Login Benefits */}
                <section className="py-24 bg-[#0B1020] border-y border-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
                        <span className="text-[10px] font-black uppercase tracking-[5px] text-[#00F0FF]">Elite Membership</span>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mt-4 uppercase">Portal Access Benefits</h2>
                        <div className="h-1 w-12 bg-[#5B2EFF] mx-auto mt-6 rounded-full" />
                    </div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { t: "Dashboard Control", d: "Manage all capital nodes from a unified high-latency interface.", i: <LayoutDashboard className="text-[#5B2EFF]" /> },
                            { t: "Wealth Vault", d: "Multi-currency support with direct bridge to bank nodes.", i: <Wallet className="text-[#00F0FF]" /> },
                            { t: "24/7 Monitoring", d: "Real-time auditing of your profit logs and yield cycles.", i: <Activity className="text-emerald-400" /> },
                            { t: "Loyalty Tiers", d: "Unlock higher daily ROI cap by maintaining active stakings.", i: <Gem className="text-purple-400" /> },
                            { t: "Instant Payouts", d: "Request settlements at any time with <120min latency.", i: <Zap className="text-yellow-400" /> },
                            { t: "Dedicated Agent", d: "Direct encryption node link to our senior growth advisors.", i: <Users className="text-blue-400" /> }
                        ].map((benefit, idx) => (
                            <div key={idx} className="glass-card p-10 text-left hover-lift neon-border group">
                                <div className="w-14 h-14 bg-[#0F1C3F] rounded-2xl flex items-center justify-center mb-8 border border-white/5 shadow-2xl group-hover:bg-[#5B2EFF]/20 transition-colors">
                                    {benefit.i}
                                </div>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">{benefit.t}</h3>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-loose">{benefit.d}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Referral Rewards Section */}
                <section className="py-24 bg-gradient-to-b from-[#0B1020] to-[#0F1C3F]/30 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                            <div className="flex-1 w-full max-w-xl">
                                <Card className="p-1 glass-card border-white/5 bg-[#0F1C3F]/40 shadow-3xl">
                                    <div className="p-10 space-y-10">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-purple-500/20 rounded-xl">
                                                <Handshake className="text-[#5B2EFF]" size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-white uppercase tracking-tight">Affiliate Node Network</h3>
                                                <p className="text-[10px] font-black text-[#00F0FF] uppercase tracking-[3px]">Scale your network yields</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            {referralTiers.map((tier, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-[#5B2EFF]/30 transition-all group">
                                                    <div className="flex items-center gap-5">
                                                        <div className={`h-1.5 w-1.5 rounded-full ${tier.color} shadow-[0_0_10px_currentColor]`} />
                                                        <div>
                                                            <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1.5">{tier.level}</p>
                                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{tier.text}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs font-black text-white uppercase">{tier.reward}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={() => openAuth("signup")} className="w-full py-5 premium-gradient text-white font-black text-[11px] uppercase tracking-[4px] rounded-xl shadow-2xl border-0 active:scale-95 transition-all">Generate Invite Link</button>
                                    </div>
                                </Card>
                            </div>
                            <div className="flex-1 space-y-8">
                                <span className="text-[10px] font-black uppercase tracking-[5px] text-[#5B2EFF]">Passive Income Network</span>
                                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">Refer Friends. <br /> Earn Recurring Commissions.</h2>
                                <p className="text-slate-400 font-bold text-sm uppercase leading-loose tracking-widest max-w-lg">
                                    Unlock a massive secondary revenue stream by inviting others into the Inpoint Purple cluster. Earn a percentage of every yield settlement they harvest.
                                </p>
                                <div className="grid grid-cols-2 gap-6 pt-6">
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[4px] mb-2">Total Paid Rewards</p>
                                        <p className="text-2xl font-black text-white tracking-tight uppercase">₹12.4M+</p>
                                    </div>
                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[4px] mb-2">Active Partners</p>
                                        <p className="text-2xl font-black text-[#5B2EFF] tracking-tight uppercase">8.5K+</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Capital Tiers / Growth Plan */}
                <section id="pricing" className="py-24 bg-[#0B1020]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-[10px] font-black uppercase tracking-[5px] text-[#5B2EFF]">Capital Deployment</span>
                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mt-4 uppercase">Growth Deployment Tiers</h2>
                            <p className="text-slate-500 text-xs mt-6 font-bold uppercase tracking-[3px]">Standardized Daily Alpha Settlement Cycles</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="glass-card p-10 bg-[#0F1C3F]/40 border-white/5 hover:border-purple-500/20 group animate-reveal hover-lift neon-border">
                                <Badge className="bg-[#5B2EFF]/10 text-white border-white/10 px-3 py-1.5 mb-8 text-[9px] font-black uppercase tracking-widest rounded-md">Growth Node I</Badge>
                                <h3 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">Starter Cell</h3>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-10 opacity-70">Base Deployment Principal</p>

                                <div className="flex items-baseline gap-2 mb-10">
                                    <span className="text-5xl font-black text-white tracking-tighter">₹500</span>
                                    <span className="text-slate-500 text-[12px] font-black uppercase tracking-widest">Base</span>
                                </div>

                                <ul className="space-y-5 mb-10">
                                    {[{ l: "Daily Yield", v: "₹25" }, { l: "Alpha Cycle", v: "30 Days" }, { l: "Total Exit", v: "₹750" }].map((it, i) => (
                                        <li key={i} className="flex justify-between items-center border-b border-white/5 pb-3">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{it.l}</span>
                                            <span className="text-[11px] font-black text-white uppercase">{it.v}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button onClick={() => openAuth("signup")} className="w-full h-14 premium-gradient text-white font-black rounded-xl hover:shadow-xl hover:shadow-purple-500/20 transition-all uppercase tracking-[4px] text-[10px] border-0 animate-pulse-glow">Authorize Node</button>
                            </div>

                            <div className="glass-card p-10 bg-[#121A33] border-[#5B2EFF]/40 shadow-3xl group animate-reveal [animation-delay:200ms] hover-lift relative overflow-hidden">
                                <div className="absolute top-0 right-0 py-2 px-10 bg-[#5B2EFF] text-white text-[8px] font-black uppercase tracking-widest rotate-45 translate-x-8 -translate-y-0.5">Popular</div>
                                <Badge className="bg-[#00F0FF]/10 text-white border-white/10 px-3 py-1.5 mb-8 text-[9px] font-black uppercase tracking-widest rounded-md">Precision Node II</Badge>
                                <h3 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">Master Cell</h3>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-10 opacity-70">Institutional Grade Node</p>

                                <div className="flex items-baseline gap-2 mb-10">
                                    <span className="text-5xl font-black text-[#00F0FF] tracking-tighter shadow-[#00F0FF]/20 text-glow">₹2000</span>
                                    <span className="text-slate-500 text-[12px] font-black uppercase tracking-widest">Base</span>
                                </div>

                                <ul className="space-y-5 mb-10">
                                    {[{ l: "Daily Yield", v: "₹100" }, { l: "Alpha Cycle", v: "35 Days" }, { l: "Total Exit", v: "₹3500" }].map((it, i) => (
                                        <li key={i} className="flex justify-between items-center border-b border-white/5 pb-3">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{it.l}</span>
                                            <span className="text-[11px] font-black text-white uppercase">{it.v}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button onClick={() => openAuth("signup")} className="w-full h-14 premium-gradient text-white font-black rounded-xl shadow-xl shadow-purple-500/20 transition-all uppercase tracking-[4px] text-[10px] border-0 animate-pulse-glow">Authorize Master Node</button>
                            </div>

                            <div className="glass-card p-10 bg-white/[0.02] border-white/10 hover:border-[#00F0FF]/20 group animate-reveal [animation-delay:400ms] hover-lift neon-border">
                                <Badge className="bg-emerald-500/10 text-white border-white/10 px-3 py-1.5 mb-8 text-[9px] font-black uppercase tracking-widest rounded-md">Elite Cluster III</Badge>
                                <h3 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">Capital Hub</h3>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-10 opacity-70">Tier-one Asset Infrastructure</p>

                                <div className="flex items-baseline gap-2 mb-10">
                                    <span className="text-5xl font-black text-white tracking-tighter">₹5000</span>
                                    <span className="text-slate-500 text-[12px] font-black uppercase tracking-widest">Base</span>
                                </div>

                                <ul className="space-y-5 mb-10">
                                    {[{ l: "Daily Yield", v: "₹250" }, { l: "Alpha Cycle", v: "40 Days" }, { l: "Total Exit", v: "₹10,000" }].map((it, i) => (
                                        <li key={i} className="flex justify-between items-center border-b border-white/5 pb-3">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{it.l}</span>
                                            <span className="text-[11px] font-black text-white uppercase">{it.v}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button onClick={() => openAuth("signup")} className="w-full h-14 bg-white text-[#0B1020] font-black rounded-xl hover:bg-slate-100 transition-all uppercase tracking-[4px] text-[10px] border-0 shadow-lg">Initialize Node</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Success Stories / Proof of Growth */}
                <section className="py-24 bg-[#0F1C3F]/20 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="text-[10px] font-black uppercase tracking-[5px] text-[#00F0FF]">Growth Validation</span>
                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mt-4 uppercase">Success Stories</h2>
                            <p className="text-slate-500 text-xs mt-4 font-bold uppercase tracking-[2px]">Verified member settlements from the Inpoint Cluster</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {successStories.map((story, idx) => (
                                <div key={idx} className="glass-card p-10 bg-white/[0.03] border-white/5 hover-lift">
                                    <div className="flex items-center gap-2 mb-6 text-yellow-400">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                                    </div>
                                    <p className="text-slate-300 font-bold text-xs uppercase italic tracking-wider leading-relaxed mb-8 opacity-70">
                                        "{story.text}"
                                    </p>
                                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                        <div>
                                            <p className="font-black text-white text-[10px] uppercase tracking-widest mb-1">{story.name}</p>
                                            <p className="text-[9px] text-[#00F0FF] font-black uppercase tracking-widest">Verified Member</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[14px] font-black text-emerald-400 uppercase">{story.profit}</p>
                                            <p className="text-[7px] text-slate-500 font-black uppercase tracking-widest leading-none">Net Payout</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Authority Support / FAQ */}
                <section id="faq" className="py-24 bg-[#0B1020]">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <Megaphone className="h-10 w-10 text-[#5B2EFF] mx-auto mb-6 opacity-40 animate-float" />
                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">Protocol Support</h2>
                            <div className="h-1 w-10 bg-[#5B2EFF] mx-auto mt-6 rounded-full" />
                        </div>

                        <div className="space-y-4 mb-24 font-sans">
                            {[
                                { q: "Is principal liquidity guaranteed?", a: "Every member node is protected by a multi-signature escrow trust. We maintain 100% solvency parity for all active capital plans through distributed hash registries." },
                                { q: "What is the exit sequence timing?", a: "Settlements are processed via our high-speed node gateway. Average exit latency is typically optimized within a 120-minute window across all global regions." },
                                { q: "Can I manage multiple nodes?", a: "Yes. Our platform allows unified control of multiple deployment clusters, allowing you to diversify your alpha strategy across various capital tiers." }
                            ].map((faq, idx) => (
                                <div key={idx} className="glass-card p-8 rounded-xl cursor-pointer hover:bg-white/[0.08] neon-border" onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[11px] font-black text-white uppercase tracking-[2px]">{faq.q}</span>
                                        <ChevronDown size={14} className={`text-slate-500 transition-transform duration-500 ${activeFaq === idx ? 'rotate-180 text-[#00F0FF]' : ''}`} />
                                    </div>
                                    {activeFaq === idx && <p className="mt-6 text-[10px] text-slate-400 font-bold leading-loose uppercase tracking-[3px] animate-in slide-in-from-top-4 transition-all opacity-80">{faq.a}</p>}
                                </div>
                            ))}
                        </div>

                        {/* Trust & Security / Compliance */}
                        <div className="glass-card rounded-[2.5rem] p-12 bg-gradient-to-br from-[#0B1020] to-[#0F1C3F] border-white/5 relative overflow-hidden shadow-3xl">
                            <div className="absolute top-0 right-0 p-8 opacity-5 -mr-16 -mt-16">
                                <ShieldAlert size={250} className="text-white" />
                            </div>
                            <h3 className="text-xl font-black text-white mb-10 uppercase flex items-center gap-5">
                                <ShieldCheck className="text-[#00F0FF]" size={32} /> Security Protocol v4.1
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-[11px] font-black text-white uppercase tracking-[4px] mb-3">Audited Node Escrow</h4>
                                        <p className="text-[10px] font-bold text-slate-500 leading-loose uppercase tracking-widest">
                                            Our capital reserve is audited in real-time by third-party protocols to ensure 100% solvency.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-black text-white uppercase tracking-[4px] mb-3">Tiered Data Protection</h4>
                                        <p className="text-[10px] font-bold text-slate-500 leading-loose uppercase tracking-widest">
                                            End-to-end encryption for all identity logs and payout credentials using RSA-4096 standards.
                                        </p>
                                    </div>
                                </div>
                                <div className="h-full bg-black/20 rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="text-[9px] font-black text-[#10B981] uppercase tracking-[3px] flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" /> Protocol Fully Synced
                                        </div>
                                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-loose">
                                            Inpoint Purple maintains a strict zero-breach registry. Your wealth infrastructure is managed inside a military-grade security perimeter.
                                        </p>
                                    </div>
                                    <button className="text-[10px] font-black text-[#00F0FF] hover:text-white transition-colors uppercase tracking-[3px] text-left">View Audit Logs →</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Redesigned Footer Section */}
            <footer className="bg-[#0B1020] relative border-t border-white/5 pt-20 pb-16 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#5B2EFF]/30 to-transparent" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-2xl">
                                    <ShieldCheck className="text-white h-6 w-6" />
                                </div>
                                <span className="text-2xl font-black tracking-tighter text-white uppercase">Inpoint <span className="text-[#00F0FF]">Purple</span></span>
                            </div>
                            <p className="text-[11px] font-bold text-slate-500 leading-loose uppercase tracking-[4px] opacity-70">
                                THE WORLD'S PREMIER INFRASTRUCTURE FOR DIGITAL ASSET GROWTH. SECURE, AUTOMATED, AND BACK-TESTED.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <h4 className="text-[12px] font-black text-white uppercase tracking-[5px]">Protocol Hub</h4>
                            <ul className="space-y-5">
                                <li><a href="#" className="text-[10px] font-bold text-slate-400 hover:text-[#00F0FF] transition-all uppercase tracking-[3px]">Member Node Access</a></li>
                                <li><a href="#" className="text-[10px] font-bold text-slate-400 hover:text-[#00F0FF] transition-all uppercase tracking-[3px]">Alpha Yield Engine</a></li>
                                <li><a href="#" className="text-[10px] font-bold text-slate-400 hover:text-[#00F0FF] transition-all uppercase tracking-[3px]">Capital Vault Link</a></li>
                            </ul>
                        </div>

                        <div className="space-y-8">
                            <h4 className="text-[12px] font-black text-white uppercase tracking-[5px]">Authority</h4>
                            <ul className="space-y-5">
                                <li><a href="#" className="text-[10px] font-bold text-slate-400 hover:text-[#00F0FF] transition-all uppercase tracking-[3px]">Compliance Registry</a></li>
                                <li><a href="#" className="text-[10px] font-bold text-slate-400 hover:text-[#00F0FF] transition-all uppercase tracking-[3px]">Terms of Sovereignty</a></li>
                                <li><a href="#" className="text-[10px] font-bold text-slate-400 hover:text-[#00F0FF] transition-all uppercase tracking-[3px]">Legal Escalation</a></li>
                            </ul>
                        </div>

                        <div className="space-y-8">
                            <h4 className="text-[12px] font-black text-white uppercase tracking-[5px]">Global Status</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 group-hover:bg-[#5B2EFF]/20 transition-all">
                                        <Globe size={18} className="text-slate-400 group-hover:text-[#00F0FF]" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Global Ops Node B</span>
                                </div>
                                <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 group-hover:bg-[#5B2EFF]/20 transition-all">
                                        <Activity size={18} className="text-slate-400 group-hover:text-[#00F0FF]" />
                                    </div>
                                    <span className="text-[10px] font-black text-[#10B981] uppercase tracking-widest leading-none">Network: Optimal</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[5px] text-center">
                            © 2026 INPOINT PURPLE CLUSTER. TOTAL AUTHORITY ENCRYPTION.
                        </p>
                        <div className="flex items-center gap-8">
                            <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">BUILD 4.1.9 ALPHA</span>
                            <div className="h-4 w-[1px] bg-white/10" />
                            <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">NODE_RSA_4096</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
