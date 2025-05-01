"use client"

import type React from "react"
import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import AuthGuard from "@/app/auth-guard"
import dynamic from "next/dynamic"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ReactQueryProvider } from "@/components/react-query-provider"
import { ClusterProvider } from "@/components/cluster-provider"
import { Toaster } from "sonner"

const AuthProvider = dynamic(() => import("@/components/auth-provider").then((mod) => mod.AuthProvider), {
    ssr: false,
})

const SolanaProvider = dynamic(() => import("@/components/solana/solana-provider").then((mod) => mod.SolanaProvider), {
    ssr: false,
})

interface GlobalProviderProps {
    children: ReactNode
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
    return (
        <ThemeProvider>
            <AuthGuard>
                <SidebarProvider>
                    <ReactQueryProvider>
                        <ClusterProvider>
                            <SolanaProvider>
                                <AuthProvider>
                                    {children}
                                    <Toaster position="bottom-right" />
                                </AuthProvider>
                            </SolanaProvider>
                        </ClusterProvider>
                    </ReactQueryProvider>
                </SidebarProvider>
            </AuthGuard>
        </ThemeProvider>
    )
}

export default GlobalProvider