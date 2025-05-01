"use client"

import type React from "react"
import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthGuard } from "@/app/auth-guard"
import dynamic from "next/dynamic"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ReactQueryProvider } from "@/components/react-query-provider"
import { ClusterProvider } from "@/components/cluster-provider"
import { Toaster } from "sonner"
import { LoadingProvider } from "@/providers/loading-provider"
import { Provider as JotaiProvider } from "jotai"
import { ApiInterceptorProvider } from "@/providers/api-interceptor-provider"

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
        <JotaiProvider>
            <ApiInterceptorProvider>
                <ClusterProvider>
                    <SolanaProvider>
                        <ThemeProvider>
                            <AuthProvider>
                                <LoadingProvider>
                                    {/* <AuthGuard requiredAuth={false} redirectTo="/dashboard"> */}
                                        <SidebarProvider>
                                            <ReactQueryProvider>
                                                {children}
                                                <Toaster position="bottom-right" />
                                            </ReactQueryProvider>
                                        </SidebarProvider>
                                    {/* </AuthGuard> */}
                                </LoadingProvider>
                            </AuthProvider>
                        </ThemeProvider>
                    </SolanaProvider>
                </ClusterProvider>
            </ApiInterceptorProvider>
        </JotaiProvider>
    )

}

export default GlobalProvider