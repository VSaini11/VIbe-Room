import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vibe Room - Listen Together",
  description: "Share music and vibes with friends in real-time",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black min-h-screen`}>
        <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-300/10 via-orange-200/10 to-purple-400/10"></div>
          <div className="relative z-10">{children}</div>
        </div>
      </body>
    </html>
  )
}
