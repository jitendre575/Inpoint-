"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

export default function OTPLoginPage() {
    const router = useRouter()
    const { toast } = useToast()

    const [step, setStep] = useState<'identifier' | 'otp' | 'name'>('identifier')
    const [identifier, setIdentifier] = useState("")
    const [otp, setOtp] = useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [identifierType, setIdentifierType] = useState<'email' | 'phone'>('email')
    const [isNewUser, setIsNewUser] = useState(false)

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || 'Failed to send OTP')
            }

            setIdentifierType(data.type)
            setStep('otp')

            toast({
                title: "OTP Sent! 📱",
                description: data.message,
            })
        } catch (error: any) {
            toast({
                title: "Failed to Send OTP",
                description: error.message,
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault()

        if (otp.length !== 6) {
            toast({
                title: "Invalid OTP",
                description: "Please enter a 6-digit OTP",
                variant: "destructive",
            })
            return
        }

        setLoading(true)

        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, otp, name: name || undefined })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || 'Failed to verify OTP')
            }

            // Check if this is a new user
            if (data.isNewUser && !name) {
                setIsNewUser(true)
                setStep('name')
                toast({
                    title: "Welcome! 👋",
                    description: "Please enter your name to complete registration",
                })
                return
            }

            // Store user to localStorage for session management
            localStorage.setItem("currentUser", JSON.stringify(data.user))

            toast({
                title: data.isNewUser ? "Account Created! 🎉" : "Login Successful! ✅",
                description: data.isNewUser
                    ? "₹50 welcome bonus added to your wallet!"
                    : "Welcome back!",
            })

            router.push("/dashboard")
        } catch (error: any) {
            toast({
                title: "Verification Failed",
                description: error.message,
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCompleteName = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim()) {
            toast({
                title: "Name Required",
                description: "Please enter your name",
                variant: "destructive",
            })
            return
        }

        // Re-verify with name
        await handleVerifyOTP(e)
    }

    const handleResendOTP = async () => {
        setOtp("")
        await handleSendOTP(new Event('submit') as any)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-400 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="h-16 w-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {step === 'identifier' && 'Login with OTP'}
                            {step === 'otp' && 'Verify OTP'}
                            {step === 'name' && 'Complete Profile'}
                        </h1>
                        <p className="text-gray-600">
                            {step === 'identifier' && 'Enter your email or phone number'}
                            {step === 'otp' && `OTP sent to your ${identifierType}`}
                            {step === 'name' && 'Just one more step!'}
                        </p>
                    </div>

                    {/* Step 1: Enter Email/Phone */}
                    {step === 'identifier' && (
                        <form onSubmit={handleSendOTP} className="space-y-5">
                            <div>
                                <Label htmlFor="identifier" className="text-gray-700 font-medium">
                                    Email or Phone Number
                                </Label>
                                <Input
                                    id="identifier"
                                    type="text"
                                    placeholder="email@example.com or +1234567890"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="mt-2 h-12 text-base focus-visible:ring-emerald-500"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold text-base shadow-lg"
                                disabled={loading}
                            >
                                {loading ? "Sending OTP..." : "Send OTP"}
                            </Button>
                        </form>
                    )}

                    {/* Step 2: Enter OTP */}
                    {step === 'otp' && (
                        <form onSubmit={handleVerifyOTP} className="space-y-5">
                            <div>
                                <Label className="text-gray-700 font-medium mb-4 block text-center">
                                    Enter 6-digit OTP
                                </Label>
                                <div className="flex justify-center">
                                    <InputOTP
                                        maxLength={6}
                                        value={otp}
                                        onChange={(value) => setOtp(value)}
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} className="h-14 w-12 text-xl" />
                                            <InputOTPSlot index={1} className="h-14 w-12 text-xl" />
                                            <InputOTPSlot index={2} className="h-14 w-12 text-xl" />
                                            <InputOTPSlot index={3} className="h-14 w-12 text-xl" />
                                            <InputOTPSlot index={4} className="h-14 w-12 text-xl" />
                                            <InputOTPSlot index={5} className="h-14 w-12 text-xl" />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold text-base shadow-lg"
                                disabled={loading || otp.length !== 6}
                            >
                                {loading ? "Verifying..." : "Verify OTP"}
                            </Button>

                            <div className="flex justify-between items-center text-sm">
                                <button
                                    type="button"
                                    onClick={() => setStep('identifier')}
                                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                    ← Change Number
                                </button>
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                                    disabled={loading}
                                >
                                    Resend OTP
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: Enter Name (for new users) */}
                    {step === 'name' && (
                        <form onSubmit={handleCompleteName} className="space-y-5">
                            <div>
                                <Label htmlFor="name" className="text-gray-700 font-medium">
                                    Your Name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-2 h-12 text-base focus-visible:ring-emerald-500"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold text-base shadow-lg"
                                disabled={loading}
                            >
                                {loading ? "Creating Account..." : "Complete Registration"}
                            </Button>
                        </form>
                    )}

                    {/* Alternative Login Option */}
                    {step === 'identifier' && (
                        <div className="mt-6 text-center">
                            <p className="text-gray-600 mb-3">Or login with password</p>
                            <Button
                                onClick={() => router.push("/login")}
                                variant="outline"
                                className="w-full h-12 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-semibold text-base"
                            >
                                Login with Password
                            </Button>
                        </div>
                    )}
                </div>

                {/* Development Mode Notice */}
                {process.env.NODE_ENV === 'development' && step === 'otp' && (
                    <div className="mt-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                        <p className="text-sm text-yellow-800 font-medium text-center">
                            🔧 Development Mode: Check your console for the OTP
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
