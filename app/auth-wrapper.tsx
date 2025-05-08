"use client"

import React from "react"
import { useAuth } from "@/components/auth-provider"
import { useAtom } from "jotai"
import { walletAddressAtom } from "@/lib/store/wallet"
import { useSidebar } from "@/components/ui/sidebar"
import { SidebarWrapper } from "@/components/sidebar/sidebar-wrapper"
import { DashboardHeader } from "@/components/header/dashboard-header"
import { AuthGuard } from "./auth-guard"

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, logout: disconnectWallet } = useAuth()
    const [walletAddress] = useAtom(walletAddressAtom)
    const { open } = useSidebar()

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center w-full">
                <div className="flex flex-col items-center space-y-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    // If not authenticated, just render the children without the dashboard layout
    if (!isAuthenticated) {
        return <>{children}</>
    }

    // If authenticated, render with dashboard layout
    return (
        <AuthGuard requiredAuth={true} redirectTo="/">
            <div className="flex h-screen overflow-hidden w-full">
                <SidebarWrapper open={open} disconnectWallet={disconnectWallet} walletAddress={walletAddress} />
                <div className="flex-1 overflow-auto">
                    <DashboardHeader walletAddress={walletAddress} disconnectWallet={disconnectWallet} />
                    <main className="flex-1 p-6">{children}</main>
                </div>
            </div>
        </AuthGuard>
    )
}