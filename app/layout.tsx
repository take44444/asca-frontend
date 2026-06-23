import type * as React from "react"
import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { AppHeader } from "@/components/layout/app-header"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { getCurrentUserSession } from "@/lib/auth-session"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getCurrentUserSession()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans antialiased", fontMono.variable, inter.variable)}
    >
      <body className="overflow-hidden">
        <ThemeProvider>
          <TooltipProvider>
            <AppHeader session={session} />
            <main id="main-content" className="app-main">
              {children}
            </main>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
