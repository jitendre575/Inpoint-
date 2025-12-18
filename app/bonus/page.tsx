"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"
import { Gift, TrendingUp, Users, Award } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function BonusPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/login")
    } else {
      setUser(JSON.parse(currentUser))
    }
  }, [router])

  const handleClaimBonus = (type: string, amount: number) => {
    toast({
      title: "Bonus Claimed!",
      description: `₹${amount} has been added to your wallet`,
    })
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pb-20">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <h1 className="text-center text-2xl font-bold">Bonus & Rewards</h1>
      </div>

      <div className="p-5 space-y-4">
        <Card className="p-6 bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <Gift className="h-10 w-10" />
            <div>
              <h2 className="text-2xl font-bold">Welcome Bonus</h2>
              <p className="text-sm text-amber-100">First login gift received</p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-3xl font-bold">₹50</p>
            <p className="text-sm text-amber-100 mt-1">Already credited to your wallet</p>
          </div>
        </Card>

        <Card className="p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8 text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-900">Investment Bonus</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Earn 20% instant credit on every plan purchase</p>
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={() => router.push("/dashboard")}>
            View Plans
          </Button>
        </Card>

        <Card className="p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-8 w-8 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">Referral Bonus</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Earn 0.3% from direct referrals and 0.1% from sub-referrals</p>
          <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => router.push("/team")}>
            Invite Friends
          </Button>
        </Card>

        <Card className="p-6 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <Award className="h-8 w-8 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">Daily Check-in</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Coming soon! Check in daily to earn extra rewards</p>
          <Button className="w-full bg-gray-300 text-gray-600" disabled>
            Coming Soon
          </Button>
        </Card>
      </div>

      <BottomNav active="mine" />
    </div>
  )
}
