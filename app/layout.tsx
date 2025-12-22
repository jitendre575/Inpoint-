import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { SupportFloatingButton } from "@/components/support-floating-button"

const geist = Geist({
  subsets: ["latin"],
  display: 'swap',
  preload: true
})

export const metadata: Metadata = {
  title: "Tovexar-roj-grow - Secure Investment Platform",
  description:
    "Grow your wealth with Tovexar's trusted investment platform. Get guaranteed returns on your investments with our secure and transparent trading system.",
  metadataBase: new URL("https://tovexar-roj-grow.vercel.app"),
  generator: "v0.app",
  openGraph: {
    title: "Tovexar-roj-grow",
    description:
      "Grow your wealth with Tovexar's trusted investment platform. Get guaranteed returns on your investments with our secure and transparent trading system.",
    url: "https://tovexar-roj-grow.vercel.app",
    siteName: "Tovexar",
    images: [
      {
        url: "/images/tovexar-logo.png",
        width: 1200,
        height: 630,
        alt: "Tovexar Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tovexar-roj-grow",
    description:
      "Grow your wealth with Tovexar's trusted investment platform. Get guaranteed returns on your investments.",
    images: ["/images/tovexar-logo.png"],
  },
  icons: {
    icon: [
      {
        url: "/images/tovexar-logo.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/images/tovexar-logo.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/images/tovexar-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} antialiased`}>
        {children}
        <Toaster />
        <Analytics />
        <SupportFloatingButton />
      </body>
    </html>
  )
}
