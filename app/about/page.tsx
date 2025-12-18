"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      <div className="bg-gradient-to-r from-blue-500 to-emerald-600 text-white p-6 rounded-b-[2rem] shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <Button onClick={() => router.back()} variant="ghost" className="text-white hover:bg-white/20 p-2">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <h1 className="text-2xl font-bold">About Us</h1>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <Card className="p-6 shadow-lg">
          <div className="text-center mb-6">
            <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">InvestPro</h2>
            <p className="text-gray-600">Your Trusted Investment Partner</p>
          </div>
          <p className="text-gray-700 leading-relaxed text-center">
            We provide secure and transparent investment opportunities with guaranteed returns. Join thousands of
            satisfied investors building their financial future with us.
          </p>
        </Card>

        <Card className="p-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Why Choose Us?</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">100% Secure</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your investments are protected with bank-grade security
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Guaranteed Returns</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Fixed returns on all investment plans with no hidden charges
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Instant Withdrawals</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Quick and hassle-free withdrawal process</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Support</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm text-gray-700">support@investpro.com</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span className="text-sm text-gray-700">+91 1800 123 4567</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Terms & Conditions</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            By using this app, you agree to our terms and conditions. Please read them carefully before investing.
          </p>
          <Button variant="outline" className="w-full bg-transparent">
            Read Full Terms
          </Button>
        </Card>
      </div>

      <BottomNav active="about" />
    </div>
  )
}
