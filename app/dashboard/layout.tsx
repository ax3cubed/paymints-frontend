"use client"

import type React from "react"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  FileText,
  DollarSign,
  BarChart3,
  Brain,
  User,
  Settings,
  LogOut,
  Bell,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAtom } from "jotai"
import { isAuthenticatedAtom, isLoadingAtom, walletAddressAtom } from "@/lib/atoms"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { disconnectWallet } = useAuth()
  const router = useRouter()

  // Use jotai atoms for state
  const [isAuthenticated] = useAtom(isAuthenticatedAtom)
  const [isLoading] = useAtom(isLoadingAtom)
  const [walletAddress] = useAtom(walletAddressAtom)

  // Redirect to landing page if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router])

  // Format wallet address for display
  const formatAddress = (address: string | null) => {
    if (!address) return "Unknown"
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      title: "Invoicing",
      icon: FileText,
      href: "/dashboard/invoicing",
    },
    {
      title: "Payroll Streaming",
      icon: DollarSign,
      href: "/dashboard/payroll",
    },
    {
      title: "Treasury",
      icon: BarChart3,
      href: "/dashboard/treasury",
    },
    {
      title: "Credit Score",
      icon: Brain,
      href: "/dashboard/credit",
    },
    {
      title: "Profile",
      icon: User,
      href: "/dashboard/profile",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
  ]

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar collapsible="icon" variant="floating">
          <SidebarHeader className="p-4">
            <div className="flex items-center justify-center md:justify-start">
              <div className="flex items-center">
                <Image src="/images/paymint-logo.png" alt="Paymint Logo" width={32} height={32} className="mr-2" />
                <div className="text-xl font-bold gradient-text">Paymint</div>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                        <Link href={item.href}>
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>US</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium truncate">{formatAddress(walletAddress)}</p>
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-success/20 text-success text-xs px-1 py-0 h-4">
                      <span className="h-1.5 w-1.5 rounded-full bg-success mr-1"></span>
                      Connected
                    </Badge>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={disconnectWallet}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex-1"></div>

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
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
