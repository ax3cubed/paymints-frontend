"use client"

import type React from "react"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  FileText,
  DollarSign,
  Brain,
  User,
  Settings,
  LogOut,
  Bell,
  AlertCircle,
 
} from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCluster } from "../cluster-provider"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select"
import { Badge } from "../ui/badge"


export const DashboardHeader = ({ walletAddress, disconnectWallet }: { walletAddress: string | null, disconnectWallet: () => void }) => {

  const { cluster, clusters, setCluster } = useCluster()

  const formatAddress = (address: string | null) => {
    if (!address) return "Unknown"
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const handleClusterChange = (value: string) => {
    const selectedCluster = clusters.find((c) => c.name === value)
    if (selectedCluster) {
      setCluster(selectedCluster)
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <SidebarTrigger />
      <div className="flex-1"></div>
      <div className="flex items-center gap-4">


        <div className="ml-4">
          <Select value={cluster.name} onValueChange={handleClusterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select network" />
            </SelectTrigger>
            <SelectContent>
              {clusters.map((c) => (
                <SelectItem key={c.name} value={c.name}>
                  <div className="flex items-center gap-2">
                    <span>{c.name}</span>
                    {c.network && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        {c.network}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-80 overflow-auto">
            {[
              {
                title: "Payment Received",
                description: "You received 250 USDC from CryptoDAO Collective",
                time: "Just now",
                icon: <DollarSign className="h-4 w-4 text-success" />,
              },
              {
                title: "New Invoice",
                description: "Invoice #0026 has been created",
                time: "2 hours ago",
                icon: <FileText className="h-4 w-4 text-primary" />,
              },
              {
                title: "Credit Score Update",
                description: "Your credit score increased by 15 points",
                time: "Yesterday",
                icon: <Brain className="h-4 w-4 text-primary" />,
              },
              {
                title: "Treasury Alert",
                description: "Your treasury balance is below the threshold",
                time: "2 days ago",
                icon: <AlertCircle className="h-4 w-4 text-destructive" />,
              },
            ].map((notification, i) => (
              <div key={i} className="flex items-start gap-3 p-3 hover:bg-secondary/20 cursor-pointer">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/30">
                  {notification.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{notification.title}</div>
                  <div className="text-xs text-muted-foreground">{notification.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">{notification.time}</div>
                </div>
              </div>
            ))}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="justify-center text-center cursor-pointer">
            View all notifications
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span>My Account</span>
              <span className="text-xs text-muted-foreground">{formatAddress(walletAddress)}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={disconnectWallet}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}