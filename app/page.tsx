"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, ShieldCheck, Zap, Headphones, Star, TrendingUp, Award, Rocket, CheckCircle2 } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setMounted(true)
    const currentUser = localStorage.getItem("currentUser")
    setIsLoggedIn(!!currentUser)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const mobileKeywords = ["android", "webos", "iphone", "ipad", "ipod", "blackberry", "windows phone"]
      const isMobileDevice = mobileKeywords.some((keyword) => userAgent.includes(keyword))
      const isSmallScreen = window.innerWidth <= 768

      setIsMobile(isMobileDevice || isSmallScreen)
      setIsChecking(false)
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)
    return () => window.removeEventListener("resize", checkDevice)
  }, [mounted])

  if (!mounted || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F071F]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-theme-violet border-t-transparent" />
      </div>
    )
  }

  if (!isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F071F] p-6 selection:bg-theme-violet selection:text-white">
        <div className="max-w-md w-full bg-[#1A0B2E] rounded-[3rem] shadow-2xl p-10 text-center border border-theme-purple/20">
          <div className="mb-8 flex justify-center">
            <div className="h-24 w-24 rounded-3xl bg-theme-violet/10 flex items-center justify-center border border-theme-violet/20">
              <ShieldCheck className="h-12 w-12 text-theme-violet" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white mb-4 tracking-tight">Mobile Only</h1>
          <p className="text-theme-lavender/60 mb-6 leading-relaxed font-medium">
            This high-frequency trading platform is optimized exclusively for mobile devices to ensure maximum security and speed.
          </p>
          <div className="p-4 bg-theme-purple/10 rounded-2xl border border-theme-purple/20">
            <p className="text-xs text-theme-gold font-black uppercase tracking-widest">Please switch to your smartphone</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F071F] text-white overflow-x-hidden pb-20 font-sans selection:bg-theme-violet">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-theme-purple/20 rounded-full blur-[120px] -mr-40 -mt-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-theme-violet/10 rounded-full blur-[100px] -ml-20 -mb-20" />

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
            <h2 className="text-2xl font-black tracking-tighter">Inpoint<span className="text-theme-gold">Rose</span></h2>
            <div className="h-1 w-8 bg-theme-gold rounded-full" />
          </div>

          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-5xl font-black tracking-tighter leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700">
              Start Earning <br />
              <span className="bg-gradient-to-r from-theme-violet to-theme-gold bg-clip-text text-transparent">Smarter Today</span>
            </h1>
            <p className="text-theme-lavender/60 text-lg font-medium max-w-xs mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
              Real-time insights, powerful tools, and proven strategies — sab kuch ek hi jagah.
            </p>

            <div className="pt-8 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
              <Button
                onClick={() => router.push(isLoggedIn ? "/dashboard" : "/create-account")}
                className="h-16 bg-gradient-to-r from-theme-purple to-theme-violet hover:from-theme-violet hover:to-theme-purple text-white font-black rounded-2xl text-lg shadow-[0_0_20px_rgba(124,58,237,0.3)] active:scale-95 transition-all group overflow-hidden relative border-0"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoggedIn ? "Go to Dashboard" : "Create Account"}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push("/login")}
                className="h-16 border-2 border-theme-purple/20 hover:bg-theme-purple/10 rounded-2xl font-black text-theme-lavender active:scale-95 transition-all text-white"
              >
                Sign In to Account
              </Button>
            </div>
          </div>
        </div>

        {/* Hero Image / Illustration */}
        <div className="mt-16 relative animate-in fade-in zoom-in duration-1000 delay-700">
          <div className="absolute inset-0 bg-theme-violet/20 rounded-full blur-3xl opacity-50" />
          <div className="relative p-1 bg-gradient-to-br from-theme-violet/30 to-theme-gold/30 rounded-[2.5rem] shadow-2xl">
            <img
              src="/landing-hero.png"
              alt="Hero Illustration"
              className="w-full h-auto object-contain rounded-[2.4rem] transform hover:scale-[1.02] transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="px-6 py-12">
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-[#1A0B2E] border-theme-purple/20 p-6 rounded-[2rem] backdrop-blur-md">
            <h3 className="text-3xl font-black text-white mb-1">50K+</h3>
            <p className="text-[10px] text-theme-gold font-black uppercase tracking-widest">Active Users</p>
          </Card>
          <Card className="bg-[#1A0B2E] border-theme-purple/20 p-6 rounded-[2rem] backdrop-blur-md">
            <h3 className="text-3xl font-black text-theme-gold mb-1">₹10Cr+</h3>
            <p className="text-[10px] text-theme-lavender/60 font-black uppercase tracking-widest">Paid Out</p>
          </Card>
        </div>
      </section>

      {/* 3. Why Choose Us Section */}
      <section className="px-6 py-16 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-white">Why Choose Us?</h2>
          <div className="h-1 w-12 bg-theme-gold mx-auto rounded-full" />
        </div>

        <div className="space-y-4">
          {[
            { icon: Zap, title: "Fast Withdrawals", desc: "Get your earnings settled in minutes, not days.", bg: "bg-theme-gold/10", color: "text-theme-gold" },
            { icon: ShieldCheck, title: "Secure System", desc: "Bank-grade encryption for your funds and data.", bg: "bg-theme-violet/10", color: "text-theme-violet" },
            { icon: Headphones, title: "24/7 Support", desc: "Expert help desk available around the clock.", bg: "bg-theme-purple/10", color: "text-theme-purple" }
          ].map((feature, idx) => (
            <Card key={idx} className="bg-[#1A0B2E] border-theme-purple/20 p-6 rounded-[2.5rem] flex items-center gap-5 hover:border-theme-purple/40 transition-colors group">
              <div className={`h-16 w-16 ${feature.bg} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
              </div>
              <div>
                <h4 className="font-black text-white text-lg mb-1">{feature.title}</h4>
                <p className="text-theme-lavender/60 text-sm font-medium leading-relaxed">{feature.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. User Benefits Section */}
      <section className="py-16 bg-[#1A0B2E]/40 border-y border-theme-purple/10">
        <div className="px-6 mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-tight text-white leading-tight">Member Benefits</h2>
          <p className="text-[10px] text-theme-gold font-black uppercase tracking-widest">Elite Access</p>
        </div>

        <div className="flex overflow-x-auto gap-5 px-6 pb-8 snap-x no-scrollbar">
          {[
            { tag: "Bonus", title: "Signup Reward", value: "₹299", desc: "Instant bonus for new verified users.", icon: Star },
            { tag: "Referral", title: "Team Commission", value: "10%", desc: "Lifetime earnings from your direct network.", icon: Award },
            { tag: "Growth", title: "Daily Payouts", value: "30%", desc: "Guaranteed daily returns on every plan.", icon: TrendingUp }
          ].map((benefit, idx) => (
            <Card key={idx} className="min-w-[260px] snap-center bg-gradient-to-br from-theme-purple to-theme-indigo border-0 p-8 rounded-[3rem] relative overflow-hidden group shadow-xl">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-white/20 transition-all duration-500" />
              <benefit.icon className="h-10 w-10 text-theme-gold absolute bottom-6 right-6 opacity-30 group-hover:opacity-100 transition-opacity" />

              <p className="text-[10px] font-black text-theme-lavender uppercase tracking-widest mb-2">{benefit.tag}</p>
              <h4 className="text-xl font-black text-white mb-1 leading-tight">{benefit.title}</h4>
              <div className="text-3xl font-black text-theme-gold mb-4">{benefit.value}</div>
              <p className="text-theme-lavender/80 text-xs font-semibold leading-relaxed">{benefit.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. Final CTA Section */}
      <section className="px-6 py-20 text-center space-y-8">
        <div className="space-y-4">
          <div className="h-20 w-20 bg-theme-gold/10 rounded-[2.5rem] flex items-center justify-center mx-auto border border-theme-gold/20 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
            <Rocket className="h-10 w-10 text-theme-gold" />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter leading-tight">Ready to Invest?</h2>
          <p className="text-theme-lavender/60 font-medium max-w-xs mx-auto">Start your journey today and earn institutional-grade returns on your capital.</p>
        </div>

        <Button
          onClick={() => router.push(isLoggedIn ? "/dashboard" : "/create-account")}
          className="w-full h-18 bg-gradient-to-r from-theme-gold to-yellow-500 hover:from-yellow-400 hover:to-theme-gold text-theme-indigo font-black rounded-[2rem] text-xl shadow-2xl shadow-theme-gold/20 border-0 active:scale-95 transition-all"
        >
          {isLoggedIn ? "Access Dashboard" : "Create Account Now"}
        </Button>

        <div className="flex items-center justify-center gap-6 opacity-60">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3 text-theme-gold" />
            <span className="text-[10px] font-black uppercase tracking-widest text-theme-lavender">Verified Secure</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3 text-theme-gold" />
            <span className="text-[10px] font-black uppercase tracking-widest text-theme-lavender">Trusted Platform</span>
          </div>
        </div>
      </section>
    </div>
  )
}
