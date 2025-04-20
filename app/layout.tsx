import type React from "react"
import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"

import AuthGuard from "@/app/auth-guard"
import dynamic from "next/dynamic"

const AuthProvider = dynamic(
  () => import('@/components/auth-provider').then(mod => mod.AuthProvider),
  {
    ssr: false,
  }
)
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Paymint | Web3-Native Payroll & Finance",
  description: "The Future of Work Finance on Solana",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <AuthGuard>{children}</AuthGuard>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
