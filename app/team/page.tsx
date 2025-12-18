"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"
import { useToast } from "@/hooks/use-toast"

export default function TeamPage() {
  const router = useRouter()
  const { toast } = useToast()
  const inviteLink = "https://newh5.incoinpay.net?inviteCode=0805b87exf"

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink)
    toast({
      title: "Copied!",
      description: "Invite link copied to clipboard",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-purple-600 text-white p-6">
        <h1 className="text-center text-2xl font-bold">Team</h1>
      </div>

      <div className="p-5 space-y-6">
        {/* Invite Link Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Invite Link</h2>
          <div className="bg-white p-5 rounded-2xl shadow-md">
            <p className="text-emerald-600 text-sm mb-4 break-all font-medium">{inviteLink}</p>
            <Button
              onClick={handleCopy}
              className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-full h-12 text-base font-semibold shadow-md"
            >
              copy
            </Button>
          </div>
        </div>

        {/* More Ways to Invite */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">More ways to invite</h2>
          <div className="flex gap-5 justify-start">
            <button className="flex flex-col items-center transition-transform active:scale-95">
              <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
                <span className="text-white text-3xl">✈️</span>
              </div>
            </button>
            <button className="flex flex-col items-center transition-transform active:scale-95">
              <div className="h-16 w-16 rounded-full bg-blue-800 flex items-center justify-center shadow-md">
                <span className="text-white text-3xl font-bold">f</span>
              </div>
            </button>
            <button className="flex flex-col items-center transition-transform active:scale-95">
              <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center shadow-md">
                <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
            </button>
            <button className="flex flex-col items-center transition-transform active:scale-95">
              <div className="h-16 w-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </div>
            </button>
            <button className="flex flex-col items-center transition-transform active:scale-95">
              <div className="h-16 w-16 rounded-full bg-orange-200 flex items-center justify-center shadow-md">
                <span className="text-orange-600 text-3xl">📤</span>
              </div>
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Team detail</h2>
          <Card className="p-5 bg-white shadow-md">
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Build your network and earn commissions! When you invite Level A members and they invite Level B members,
              you earn rewards from both levels.
            </p>

            <div className="bg-gradient-to-br from-emerald-50 to-purple-50 p-4 rounded-xl mb-4">
              <p className="font-semibold text-gray-900 mb-2 text-base">Earning Structure:</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                  <span className="text-gray-700">
                    Level A (Direct referrals): <span className="font-bold text-emerald-600">0.3%</span> commission
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-purple-600"></span>
                  <span className="text-gray-700">
                    Level B (Sub-referrals): <span className="font-bold text-purple-600">0.1%</span> commission
                  </span>
                </div>
              </div>
            </div>

            {/* Referral Diagram */}
            <div className="my-6 bg-white p-4 rounded-xl border-2 border-gray-200">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg mb-4">
                  <span className="text-white font-bold text-sm">YOU</span>
                </div>

                <div className="flex items-center gap-8 mb-4">
                  <div className="h-1 w-16 bg-emerald-300"></div>
                  <div className="px-3 py-1 bg-amber-900 text-white rounded-lg text-xs font-semibold shadow-md">
                    invite
                  </div>
                  <div className="h-1 w-16 bg-emerald-300"></div>
                </div>

                <div className="flex gap-8 mb-6">
                  <div className="flex flex-col items-center">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md mb-2">
                      <span className="text-white font-bold text-xs">A1</span>
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="h-10 w-10 rounded-full bg-green-500 border-2 border-white shadow flex items-center justify-center">
                        <span className="text-white font-bold text-xs">B1</span>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-green-500 border-2 border-white shadow flex items-center justify-center">
                        <span className="text-white font-bold text-xs">B2</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md mb-2">
                      <span className="text-white font-bold text-xs">A2</span>
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="h-10 w-10 rounded-full bg-green-500 border-2 border-white shadow flex items-center justify-center">
                        <span className="text-white font-bold text-xs">B3</span>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-green-500 border-2 border-white shadow flex items-center justify-center">
                        <span className="text-white font-bold text-xs">B4</span>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-green-500 border-2 border-white shadow flex items-center justify-center">
                        <span className="text-white font-bold text-xs">B5</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-2"></div>
                <p className="text-xs text-center text-gray-600 font-medium">Earn from all sub-levels</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl">
              <p className="font-semibold text-gray-900 mb-2 text-sm">Example Calculation:</p>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">
                If A1 purchases ₹100,000 and B1 purchases ₹200,000:
              </p>
              <div className="bg-white p-3 rounded-lg border border-green-200">
                <p className="text-emerald-600 font-mono text-sm font-semibold">
                  (100,000 × 0.3%) + (200,000 × 0.1%) = ₹500
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <BottomNav active="team" />
    </div>
  )
}
