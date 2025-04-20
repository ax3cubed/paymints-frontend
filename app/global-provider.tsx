"use client"

import type React from "react"
import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import AuthGuard from "@/app/auth-guard"
import dynamic from "next/dynamic"

const AuthProvider = dynamic(() => import("@/components/auth-provider").then((mod) => mod.AuthProvider), {
  ssr: false,
})

interface GlobalProviderProps {
  children: ReactNode
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <AuthGuard>{children}</AuthGuard>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default GlobalProvider
