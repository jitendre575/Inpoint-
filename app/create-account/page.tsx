"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function CreateAccountPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Multi-step state
  const [step, setStep] = useState<'details' | 'otp'>('details')

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    identifier: "", // Email or Phone
    password: "",
    confirmPassword: "",
  })

  // OTP state
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [timer, setTimer] = useState(0)
  const [normalizedIdentifier, setNormalizedIdentifier] = useState("") // Store normalized identifier

  // Timer countdown for resend
  const startTimer = () => {
    setTimer(60)
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Step 1: Create Account - This automatically sends OTP
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Send OTP automatically when user clicks Create Account
      const otpRes = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: formData.identifier })
      })

      const otpData = await otpRes.json()

      if (!otpRes.ok) {
        throw new Error(otpData.message || 'Failed to send OTP')
      }

      // Store normalized identifier for verification
      setNormalizedIdentifier(otpData.identifier || formData.identifier)

      // OTP sent successfully
      setOtpSent(true)
      setStep('otp')
      startTimer()

      toast({
        title: "OTP Sent! 📱",
        description: otpData.message,
        className: "bg-blue-600 text-white border-0"
      })
    } catch (error: any) {
      console.error("OTP Send error:", error)
      toast({
        title: "Failed to Send OTP",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP and Create Account
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()

    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // First verify OTP using normalized identifier
      const verifyRes = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: normalizedIdentifier, // Use normalized identifier
          otp: otp,
          name: formData.name
        })
      })

      const verifyData = await verifyRes.json()

      if (!verifyRes.ok) {
        throw new Error(verifyData.message || 'OTP verification failed')
      }

      // If OTP verified and user exists, they can login
      if (!verifyData.isNewUser) {
        toast({
          title: "Account Already Exists",
          description: "Please login with your credentials.",
          className: "bg-amber-600 text-white border-0"
        })
        router.push("/login")
        return
      }

      // Create new account with password
      const registerRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.identifier,
          password: formData.password
        })
      })

      const registerData = await registerRes.json()

      if (!registerRes.ok) {
        if (registerRes.status === 409) {
          throw new Error("Account already exists with this Email or Mobile.")
        }
        throw new Error(registerData.message || 'Registration failed')
      }

      toast({
        title: "Account Created Successfully! 🎉",
        description: "Your account has been created. Please login.",
        className: "bg-emerald-600 text-white border-0"
      })

      router.push("/login")
    } catch (error: any) {
      console.error("Verification error:", error)
      toast({
        title: "Verification Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    if (timer > 0) return

    setResendLoading(true)

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: formData.identifier })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to resend OTP')
      }

      // Update normalized identifier if it changed
      setNormalizedIdentifier(data.identifier || normalizedIdentifier)

      startTimer()
      toast({
        title: "OTP Resent! 📱",
        description: data.message,
        className: "bg-blue-600 text-white border-0"
      })
    } catch (error: any) {
      toast({
        title: "Resend Failed",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-400 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="h-16 w-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              {step === 'details' ? (
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              ) : (
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {step === 'details' ? 'Create Account' : 'Verify OTP'}
            </h1>
            <p className="text-gray-600">
              {step === 'details'
                ? 'Join us and start investing today'
                : `Enter the OTP sent to ${normalizedIdentifier || formData.identifier}`}
            </p>
          </div>

          {/* Step 1: Account Details */}
          {step === 'details' && (
            <form onSubmit={handleCreateAccount} className="space-y-5">
              <div>
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2 h-12 text-base focus-visible:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="identifier" className="text-gray-700 font-medium">
                  Email / Mobile Number
                </Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="Enter your email or mobile"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  className="mt-2 h-12 text-base focus-visible:ring-emerald-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">OTP will be sent automatically</p>
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password (min 6 characters)"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-2 h-12 text-base focus-visible:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="mt-2 h-12 text-base focus-visible:ring-emerald-500"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold text-base shadow-lg"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Create Account & Send OTP"}
              </Button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-800">
                  <strong>📱 OTP Sent!</strong> Please check your {(normalizedIdentifier || formData.identifier).includes('@') ? 'email' : 'phone'} for the verification code.
                </p>
              </div>

              <div>
                <Label htmlFor="otp" className="text-gray-700 font-medium">
                  Enter 6-Digit OTP
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="mt-2 h-14 text-center text-2xl font-bold tracking-widest focus-visible:ring-emerald-500"
                  maxLength={6}
                  required
                />
                <p className="text-xs text-gray-500 mt-1 text-center">Valid for 5 minutes</p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold text-base shadow-lg"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP & Create Account"}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendOTP}
                  disabled={timer > 0 || resendLoading}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  {resendLoading ? "Resending..." : timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                </Button>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStep('details')
                  setOtp('')
                }}
                className="w-full"
              >
                ← Back to Details
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button onClick={() => router.push("/login")} className="text-emerald-600 font-semibold hover:underline">
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
