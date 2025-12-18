"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BottomNav } from "@/components/bottom-nav"
import { useToast } from "@/hooks/use-toast"
import { Lock, ArrowLeft } from "lucide-react"

export default function PasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      return
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")

    if (currentUser.password !== currentPassword) {
      toast({
        title: "Error",
        description: "Current password is incorrect",
        variant: "destructive",
      })
      return
    }

    currentUser.password = newPassword
    localStorage.setItem("currentUser", JSON.stringify(currentUser))

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = users.findIndex((u: any) => u.email === currentUser.email)
    users[userIndex] = currentUser
    localStorage.setItem("users", JSON.stringify(users))

    toast({
      title: "Success",
      description: "Password changed successfully",
    })

    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pb-20">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/20 rounded-full">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold">Change Password</h1>
        </div>
      </div>

      <div className="p-5">
        <Card className="p-6 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center">
              <Lock className="h-7 w-7 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Security</h2>
              <p className="text-sm text-gray-600">Update your password</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-5">
            <div>
              <Label htmlFor="current" className="text-gray-700 font-medium text-base">
                Current Password
              </Label>
              <Input
                id="current"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-2 h-12 text-base"
                required
              />
            </div>

            <div>
              <Label htmlFor="new" className="text-gray-700 font-medium text-base">
                New Password
              </Label>
              <Input
                id="new"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-2 h-12 text-base"
                required
              />
            </div>

            <div>
              <Label htmlFor="confirm" className="text-gray-700 font-medium text-base">
                Confirm New Password
              </Label>
              <Input
                id="confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-2 h-12 text-base"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-base shadow-lg"
            >
              Change Password
            </Button>
          </form>
        </Card>
      </div>

      <BottomNav active="mine" />
    </div>
  )
}
