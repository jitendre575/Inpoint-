"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BottomNav } from "@/components/bottom-nav"
import { useToast } from "@/hooks/use-toast"

export default function TeamPage() {
  const router = useRouter()
  const { toast } = useToast()

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-purple-600 text-white p-6">
        <h1 className="text-center text-2xl font-bold">Team</h1>
      </div>

      <div className="p-5 space-y-6">


        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Network detail</h2>
          <Card className="p-5 bg-white shadow-md">
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Monitor your network and group performance. Stay updated with your teammates' activities and contributions.
            </p>

            <div className="bg-gradient-to-br from-emerald-50 to-purple-50 p-4 rounded-xl mb-4">
              <p className="font-semibold text-gray-900 mb-2 text-base">Network Structure:</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                  <span className="text-gray-700">
                    Level A (Direct members)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-purple-600"></span>
                  <span className="text-gray-700">
                    Level B (Sub-members)
                  </span>
                </div>
              </div>
            </div>

            {/* Network Diagram */}
            <div className="my-6 bg-white p-4 rounded-xl border-2 border-gray-200">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg mb-4">
                  <span className="text-white font-bold text-sm">YOU</span>
                </div>

                <div className="flex items-center gap-8 mb-4">
                  <div className="h-1 w-16 bg-emerald-300"></div>
                  <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold shadow-sm">
                    connect
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
                    </div>
                  </div>
                </div>

                <div className="w-full h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-2"></div>
                <p className="text-xs text-center text-gray-600 font-medium">Network performance view</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <BottomNav active="team" />
    </div>
  )
}
