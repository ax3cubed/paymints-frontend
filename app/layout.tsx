import type React from "react"
import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import GlobalProvider from "@/app/global-provider"
import AuthWrapper from "./auth-wrapper"
  

 

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
      <GlobalProvider>
          <AuthWrapper>{children}</AuthWrapper>
        </GlobalProvider>
      </body>
    </html>
  )
}
