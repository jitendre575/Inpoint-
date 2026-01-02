"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { ShieldCheck, Download, Smartphone, AlertCircle, HelpCircle, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DownloadAppButtonProps {
    variant?: "default" | "outline" | "ghost"
    size?: "sm" | "md" | "lg"
    className?: string
    showIcon?: boolean
}

export function DownloadAppButton({
    variant = "default",
    size = "md",
    className = "",
    showIcon = true,
}: DownloadAppButtonProps) {
    const { toast } = useToast()
    const [isAndroid, setIsAndroid] = useState<boolean | null>(null)
    const [isDownloading, setIsDownloading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [downloadComplete, setDownloadComplete] = useState(false)

    useEffect(() => {
        const userAgent = navigator.userAgent.toLowerCase()
        setIsAndroid(/android/.test(userAgent))
    }, [])

    const handleDownload = async () => {
        if (isAndroid === false) {
            toast({
                title: "Unsupported Device",
                description: "App available for Android only.",
                variant: "destructive",
            })
            return
        }

        if (isDownloading) return

        setShowModal(true)
        setIsDownloading(true)
        setProgress(0)
        setDownloadComplete(false)

        try {
            const response = await fetch("/api/download/apk")
            if (!response.ok) throw new Error("Download failed")

            const reader = response.body?.getReader()
            const contentLength = Number(response.headers.get("Content-Length")) || 1024 * 1024 * 5 // Fallback to 5MB if no header

            let receivedLength = 0
            const chunks = []

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break
                    chunks.push(value)
                    receivedLength += value.length
                    setProgress(Math.round((receivedLength / contentLength) * 100))
                }
            }

            const blob = new Blob(chunks, { type: "application/vnd.android.package-archive" })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "app-release.apk"
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

            setDownloadComplete(true)
        } catch (error) {
            toast({
                title: "Download Error",
                description: "Failed to download the APK. Please try again.",
                variant: "destructive",
            })
            setShowModal(false)
        } finally {
            setIsDownloading(false)
        }
    }

    // Size classes
    const sizeClasses = {
        sm: "h-8 px-3 text-sm gap-1.5",
        md: "h-10 px-4 text-base gap-2",
        lg: "h-12 px-6 text-lg gap-3",
    }

    // Variant classes
    const variantClasses = {
        default: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20",
        outline: "bg-transparent border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50",
        ghost: "bg-white/20 hover:bg-white/30 border border-white/30 text-white backdrop-blur-md",
    }

    return (
        <>
            <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className={`font-bold rounded-full transition-all duration-300 group ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
            >
                {isDownloading ? (
                    <span className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {progress}%
                    </span>
                ) : (
                    <>
                        {showIcon && <Download className="h-5 w-5 group-hover:scale-110 transition-transform" />}
                        <span>Download App</span>
                    </>
                )}
            </Button>

            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="max-w-[340px] rounded-3xl p-0 overflow-hidden border-0 shadow-2xl">
                    {/* Header Banner */}
                    <div className="bg-emerald-600 p-6 text-center text-white">
                        <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
                            <Smartphone className="h-8 w-8" />
                        </div>
                        <DialogTitle className="text-xl font-bold mb-1">Android Installation</DialogTitle>
                        <div className="flex items-center justify-center gap-1.5 text-emerald-100 text-sm font-medium">
                            <ShieldCheck className="h-4 w-4" />
                            <span>Safe and Verified</span>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Progress Section */}
                        {!downloadComplete ? (
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm font-bold text-gray-700">
                                    <span>Downloading APK...</span>
                                    <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2 bg-emerald-100" />
                                <p className="text-xs text-gray-500 text-center italic">
                                    Keep this window open until download completes
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                                    <div>
                                        <p className="text-sm font-bold text-emerald-900">Download Complete!</p>
                                        <p className="text-xs text-emerald-600 font-medium">Tap the file to install</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                        <HelpCircle className="h-4 w-4 text-emerald-600" />
                                        Installation Guide:
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex gap-3">
                                            <div className="h-6 w-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">1</div>
                                            <p className="text-sm text-gray-600 leading-tight">Open the downloaded <span className="font-bold">app-release.apk</span> file.</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="h-6 w-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">2</div>
                                            <p className="text-sm text-gray-600 leading-tight">If prompted, click <span className="font-bold">Settings</span> and enable <span className="text-emerald-600 underline">"Allow from this source"</span>.</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="h-6 w-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0">3</div>
                                            <p className="text-sm text-gray-600 leading-tight">Return and click <span className="font-bold">Install</span> to finish.</p>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => setShowModal(false)}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 rounded-xl font-bold"
                                >
                                    Got it
                                </Button>
                            </div>
                        )}

                        {/* Warning Message */}
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-amber-800 leading-normal font-medium">
                                Note: Android may warn about "Unknown Sources". This is normal for apps installed outside the Play Store.
                                Our APK is 100% secure.
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
