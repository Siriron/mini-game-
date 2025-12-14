import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Providers } from "@/components/providers"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Reaction Click Challenge – Base Mini App",
  description:
    "Test your reaction speed and compete on-chain! Click targets as fast as you can and submit your high score to the Base blockchain.",
  openGraph: {
    title: "Reaction Click Challenge",
    description: "Experience interactive mini apps on Farcaster",
    images: [
      {
        url: "/api/og", // You can replace this with a full URL if needed
        width: 1200,
        height: 630,
      },
    ],
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  other: {
    "base:app_id": "693e229dd77c069a945bdea7", // ✅ Base meta tag
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:miniapp" content="v1" />
        <script src="https://cdn.farcaster.xyz/actions.js" async />
      </head>
      <body className={`font-sans antialiased`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
