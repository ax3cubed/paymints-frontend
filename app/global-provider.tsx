"use client"

import type React from "react"
import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import AuthGuard from "@/app/auth-guard"
import dynamic from "next/dynamic"
import { SidebarProvider } from "@/components/ui/sidebar"

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
                <AuthGuard>
                    <SidebarProvider >
                        {children}
                    </SidebarProvider>
                </AuthGuard>
            </ThemeProvider>
        </AuthProvider>
    )
}

export default GlobalProvider
