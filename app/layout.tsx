import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Playfair_Display } from "next/font/google"
import "./globals.css"
import { ReduxProvider } from "@/components/providers/redux-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: 'Ryleigh Leon',
  description: 'Web site created using Next.js',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${playfair.variable}`}>
      <body className={montserrat.className}>
        <ReduxProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 transition-all duration-300 ease-in-out">{children}</main>
            <Footer />
          </div>
        </ReduxProvider>
      </body>
    </html>
  )
}
