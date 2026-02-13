import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { SupportFloatingButton } from "@/components/support-floating-button"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: 'swap',
  preload: true
})

export const metadata: Metadata = {
  title: "Inpoint Purple Elite - Premium High-Yield Platform",
  description:
    "Master your digital wealth with Inpoint Purple Cluster. Deploy institutional-grade capital nodes and secure automated daily yields on our distributed cluster.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://inpoint-purple.vercel.app"),
  generator: "Next.js",
  keywords: ["investment", "trading", "alpha yield", "capital nodes", "secure investment", "Inpoint Purple Elite"],
  authors: [{ name: "Inpoint Purple Cluster" }],
  openGraph: {
    title: "Inpoint Purple Elite - Precision Wealth Mastery",
    description:
      "Master your digital wealth with Inpoint Purple Cluster. Deploy institutional-grade capital nodes and secure automated daily yields.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://inpoint-purple.vercel.app",
    siteName: "Inpoint Purple Elite",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL || "https://tovexar-roj-grow.vercel.app"}/images/inpoint-rose-grow-og.png`,
        width: 1200,
        height: 630,
        alt: "Inpoint Green Grow - Smart Investment Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inpoint Green Grow - Smart Investment Platform",
    description:
      "Grow your wealth with Inpoint Green Grow's trusted investment platform. Get guaranteed returns on your investments.",
    images: [`${process.env.NEXT_PUBLIC_APP_URL || "https://tovexar-roj-grow.vercel.app"}/images/inpoint-rose-grow-og.png`],
  },
  icons: {
    icon: "/images/inpoint-rose-grow-icon.png",
    apple: "/images/inpoint-rose-grow-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`} suppressHydrationWarning>
        {children}
        <Toaster />
        <Analytics />
        <SupportFloatingButton />
      </body>
    </html>
  )
}
