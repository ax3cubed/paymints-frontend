import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { LogOut } from "lucide-react"
import {
  SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarFooter,
  SidebarRail,
  Sidebar
} from "../ui/sidebar"
import { SidebarMenu } from "./sidebar-menu"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { formatAddress } from "@/lib/utils"
import { AnimatePresence, motion } from "motion/react"
import { usePathname } from "next/navigation"
import { publicRoute } from "@/utils/public-routes"



export const SidebarWrapper = ({ open, disconnectWallet, walletAddress }: { open: boolean, disconnectWallet: () => void, walletAddress: string | null }) => {
  const pathname = usePathname()
  if (pathname?.startsWith(publicRoute[0])) {
    return null
  }
  return (
    <Sidebar collapsible="icon" variant="floating" >
      <SidebarHeader className="p-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={open ? 'open' : 'closed'}
            initial={{ opacity: 0, x: open ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: open ? 20 : -20 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center md:justify-start"
          >
            {open && (
              <div className="flex items-center">
                <Avatar className="cursor-pointer flex justify-center items-center align-middle">
                  <AvatarImage width={32} height={32} src="/placeholder.svg?height=32&width=32" alt="User avatar" />
                  <div className="text-xl font-bold bg-clip-text gradient-textt ml-2">aymint</div>
                  <AvatarFallback>PM</AvatarFallback>
                </Avatar>
              </div>
            )}
            {!open && (
              <div className="flex items-center">
                <Avatar className="cursor-pointer flex justify-center items-center align-middle">
                  <AvatarImage width={32} height={32} src="/placeholder.svg?height=32&width=32" alt="User avatar" />
                  <AvatarFallback>PM</AvatarFallback>
                </Avatar>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu />
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
  )
}