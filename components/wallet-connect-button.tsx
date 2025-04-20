"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { Loader2, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAtom } from "jotai"
import { isAuthenticatedAtom, isLoadingAtom, walletAddressAtom } from "@/lib/atoms"

interface WalletConnectButtonProps extends ButtonProps {
  showAddress?: boolean
}

export function WalletConnectButton({ showAddress = false, className, ...props }: WalletConnectButtonProps) {
  const { connectWallet, disconnectWallet } = useAuth()
  const [isAuthenticated] = useAtom(isAuthenticatedAtom)
  const [isLoading] = useAtom(isLoadingAtom)
  const [walletAddress] = useAtom(walletAddressAtom)

  // Format wallet address for display
  const formatAddress = (address: string | null) => {
    if (!address) return ""
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  if (isLoading) {
    return (
      <Button variant="outline" className={cn("gap-2", className)} disabled {...props}>
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </Button>
    )
  }

  if (isAuthenticated && walletAddress) {
    return (
      <Button variant="outline" className={cn("gap-2", className)} onClick={disconnectWallet} {...props}>
        <Wallet className="h-4 w-4" />
        {showAddress ? formatAddress(walletAddress) : "Disconnect"}
      </Button>
    )
  }

  return (
    <Button className={cn("gap-2", className)} onClick={connectWallet} {...props}>
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  )
}
