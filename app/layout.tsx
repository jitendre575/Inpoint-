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
  title: "Inpoint Green Grow - Premium Investment Platform",
  description:
    "Grow your wealth with Inpoint Green Grow's trusted investment platform. Get guaranteed returns on your investments with our secure and transparent trading system. Start investing today!",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://tovexar-roj-grow.vercel.app"),
  generator: "Next.js",
  keywords: ["investment", "trading", "wealth growth", "financial planning", "secure investment", "Inpoint Green Grow"],
  authors: [{ name: "Inpoint Green Grow" }],
  openGraph: {
    title: "Inpoint Green Grow - Smart Investment Platform",
    description:
      "Grow your wealth with Inpoint Green Grow's trusted investment platform. Get guaranteed returns on your investments with our secure and transparent trading system.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://tovexar-roj-grow.vercel.app",
    siteName: "Inpoint Green Grow",
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
