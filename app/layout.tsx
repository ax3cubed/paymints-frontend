import type React from "react"
import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import GlobalProvider from "@/app/global-provider"
import AuthWrapper from "./auth-wrapper"
import { GoogleTagManager } from '@next/third-parties/google' 




const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})
export const metadata: Metadata = {
  title: "Paymint | Web3-Native Payroll & Finance",
  description: "The Future of Work Finance on Solana",
  openGraph: {
    title: "Paymint | Web3-Native Payroll & Finance",
    description: "The Future of Work Finance on Solana",
    url: "https://paymints-web3.netlify.app/",
    siteName: "Paymint",
    images: [
      {
        url: "https://paymints-web3.netlify.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Paymint - Web3-Native Payroll & Finance",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  abstract: "Web3-Native Payroll & Finance platform built on Solana blockchain",
  twitter: {
    card: "summary_large_image",
    title: "Paymint | Web3-Native Payroll & Finance",
    description: "The Future of Work Finance on Solana",
    images: ["https://paymints-web3.netlify.app/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
  themeColor: "#ffffff",
  keywords: [
    "paymint",
    "web3 payroll",
    "solana payroll",
    "web3 finance",
    "solana finance",
    "crypto payroll",
    "crypto finance",
    "decentralized payroll",
    "decentralized finance",
    "payroll management",
    "invoice management",
    "web3 invoicing",
    "solana invoicing",
    "payroll solutions",
    "web3 native payroll",
    "web3 native finance",
    "solana native payroll",
    "solana native finance",
    "payroll automation",
    "web3 payroll automation",
    "solana payroll automation",
    "payroll software",
  ],
  robots: {
    index: true,
    follow: true,
  },

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
  <GoogleTagManager gtmId="G-FMW2XXR29T" />
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <GlobalProvider>
          <AuthWrapper>{children}</AuthWrapper>
        </GlobalProvider>
      </body>
    </html>
  )
}
