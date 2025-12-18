"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"
import { ArrowLeft, ChevronRight, Bell, Shield, User, HelpCircle, Info } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()

  const settingsOptions = [
    { icon: User, label: "Account Information", path: "/mine" },
    { icon: Bell, label: "Notifications", path: "#" },
    { icon: Shield, label: "Security & Privacy", path: "/password" },
    { icon: HelpCircle, label: "Help & Support", path: "#" },
    { icon: Info, label: "About", path: "/about" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pb-20">
      <div className="bg-gradient-to-r from-emerald-600 to-purple-600 text-white p-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/20 rounded-full">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
      </div>

      <div className="p-5 space-y-3">
        {settingsOptions.map((option, index) => (
          <Card
            key={index}
            onClick={() => option.path !== "#" && router.push(option.path)}
            className="p-4 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <option.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <span className="font-semibold text-gray-900 text-base">{option.label}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Card>
        ))}
      </div>

      <BottomNav active="mine" />
    </div>
  )
}
