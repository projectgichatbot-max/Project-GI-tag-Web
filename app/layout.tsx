import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AIChatbot } from "@/components/ai-chatbot-fixed"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Uttarakhand Heritage - Authentic GI-Tagged Products",
  description:
    "Discover authentic GI-tagged products from Uttarakhand. Support local artisans and preserve cultural heritage through traditional handicrafts, organic foods, and textiles.",
  keywords:
    "Uttarakhand, GI tagged products, handicrafts, artisans, cultural heritage, organic food, traditional textiles",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} antialiased`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Navigation />
        <main>{children}</main>
        <Footer />
        <AIChatbot />
      </body>
    </html>
  )
}
