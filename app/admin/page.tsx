"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ShieldCheck } from "lucide-react"

export default function AdminLoginPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Verify against API by trying to fetch users
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            if (!res.ok) {
                throw new Error('Invalid Admin Password');
            }

            // If success, store password in sessionStorage to access protected routes
            sessionStorage.setItem("adminSecret", password);

            router.push("/admin/dashboard");
        } catch (error) {
            toast({
                title: "Access Denied",
                description: "Incorrect Admin Password",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="bg-neutral-800 rounded-2xl shadow-2xl p-8 border border-neutral-700">
                    <div className="text-center mb-8">
                        <div className="h-16 w-16 bg-red-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-red-900/20">
                            <ShieldCheck className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
                        <p className="text-neutral-400">Restricted Access Area</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <Label htmlFor="password" className="text-neutral-300 font-medium">
                                Admin Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter admin key..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-2 h-12 text-base bg-neutral-900 border-neutral-700 text-white focus-visible:ring-red-500 placeholder:text-neutral-600"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-base shadow-lg transition-all"
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Access Dashboard"}
                        </Button>
                    </form>
                    <div className="mt-6 text-center">
                        <Button variant="link" className="text-neutral-500 hover:text-white" onClick={() => router.push('/')}>
                            Return to Home
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
