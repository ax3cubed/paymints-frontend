"use client"

import type React from "react"
import {
  useSidebar,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAtom } from "jotai"
import { isAuthenticatedAtom, isLoadingAtom, walletAddressAtom } from "@/lib/atoms"
import { SidebarWrapper } from "@/components/sidebar/sidebar-wrapper"
import { DashboardHeader } from "@/components/header/dashboard-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { disconnectWallet } = useAuth()

  const [walletAddress] = useAtom(walletAddressAtom)

 

 
  const { open } = useSidebar()
  return (

    <div className="flex h-screen overflow-hidden w-full">
      <SidebarWrapper open={open} disconnectWallet={disconnectWallet} walletAddress={walletAddress} />

      <div className="flex-1 overflow-auto">
        <DashboardHeader walletAddress={walletAddress} disconnectWallet={disconnectWallet} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>

  )
}
