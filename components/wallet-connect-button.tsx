"use client"

import { Button, ButtonProps } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { Loader2, LogOut, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAtom } from "jotai"
import { walletAddressAtom } from "@/lib/store/wallet"
import { isAuthenticatedAtom, isLoadingAuthAtom } from "@/lib/store/auth"
import { useWallet } from "@solana/wallet-adapter-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface WalletConnectButtonProps {
  id?: string
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function WalletConnectButton({ id, className, variant = "outline", ...props }: WalletConnectButtonProps) {
  const { connectWallet, logout:disconnectWallet } = useAuth()
  const { publicKey } = useWallet()
  const [isAuthenticated] = useAtom(isAuthenticatedAtom)
  const [isLoading] = useAtom(isLoadingAuthAtom)
  const [walletAddress] = useAtom(walletAddressAtom)
  const [isHovering, setIsHovering] = useState(false)

  const formatWalletAddress = (address: string | null) => {
    if (!address) return ""
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }
 console.log("WalletConnectButton", { isAuthenticated, walletAddress, isLoading, publicKey });
 
  if (isLoading) {
    return (
      <Button id={id} variant="outline" className={cn("gap-2", className)} disabled {...props}>
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </Button>
    )
  }

  if (  walletAddress) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            id={id}
            variant={variant}
            className={cn("gap-2", className)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Wallet className="h-4 w-4" />
            {formatWalletAddress(walletAddress)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Wallet</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(walletAddress)
            }}
          >
            Copy address
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={disconnectWallet} className="text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button id={id} className={cn("gap-2", className)} onClick={connectWallet} {...props}>
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  )
}
