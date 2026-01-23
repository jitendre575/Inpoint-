import type React from "react"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { SupportFloatingButton } from "@/components/support-floating-button"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: 'swap',
  preload: true
})

export const metadata: Metadata = {
  title: "Inpoint Rose Grow - Smart Investment Platform",
  description:
    "Grow your wealth with Inpoint Rose Grow's trusted investment platform. Get guaranteed returns on your investments with our secure and transparent trading system. Start investing today!",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://tovexar-roj-grow.vercel.app"),
  generator: "Next.js",
  keywords: ["investment", "trading", "wealth growth", "financial planning", "secure investment", "Inpoint Rose Grow"],
  authors: [{ name: "Inpoint Rose Grow" }],
  openGraph: {
    title: "Inpoint Rose Grow - Smart Investment Platform",
    description:
      "Grow your wealth with Inpoint Rose Grow's trusted investment platform. Get guaranteed returns on your investments with our secure and transparent trading system.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://tovexar-roj-grow.vercel.app",
    siteName: "Inpoint Rose Grow",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL || "https://tovexar-roj-grow.vercel.app"}/images/inpoint-rose-grow-og.png`,
        width: 1200,
        height: 630,
        alt: "Inpoint Rose Grow - Smart Investment Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inpoint Rose Grow - Smart Investment Platform",
    description:
      "Grow your wealth with Inpoint Rose Grow's trusted investment platform. Get guaranteed returns on your investments.",
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
      <body className={`${jakarta.className} antialiased`} suppressHydrationWarning>
        {children}
        <Toaster />
        <Analytics />
        <SupportFloatingButton />
      </body>
    </html>
  )
}
