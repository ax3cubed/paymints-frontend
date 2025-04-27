// Updating the SidebarMenu component to be dynamic


"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps, cva } from "class-variance-authority"
import { LucideIcon, PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  BarChart3,
  ShoppingCart,
  Receipt,
  Users,
  Landmark,
  CreditCard,
  UserCircle,
  Settings,
} from "lucide-react"
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, 
  SidebarMenuSubButton, SidebarMenuSubItem, SidebarSeparator } from "../ui/sidebar"
// First, let's define our navigation structure as a JSON object
export type NavigationItem = {
  title?: string;
  icon?: LucideIcon;
  path?: string;
  tooltip?: string;
  type?: string;
  submenu?: {
    title?: string;
    path?: string;
  }[];
};

const navigationItems:NavigationItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    tooltip: "Dashboard"
  },
  {
    title: "Wallet",
    icon: Wallet,
    path: "/dashboard/wallet",
    tooltip: "Wallet"
  },
  {
    title: "Transactions",
    icon: ArrowLeftRight,
    path: "/dashboard/transactions",
    tooltip: "Transactions"
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "/dashboard/analytics",
    tooltip: "Analytics"
  },
  {
    type: "separator"
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    path: "/dashboard/orders",
    tooltip: "Orders",
     
  },
  {
    title: "Invoicing",
    icon: Receipt,
    path: "/dashboard/invoicing",
    tooltip: "Invoicing",
     
  },
  {
    title: "Payroll",
    icon: Users,
    path: "/dashboard/payroll",
    tooltip: "Payroll"
  },
  {
    title: "Treasury",
    icon: Landmark,
    path: "/dashboard/treasury",
    tooltip: "Treasury"
  },
  {
    title: "Credit",
    icon: CreditCard,
    path: "/dashboard/credit",
    tooltip: "Credit"
  },
  {
    type: "separator"
  },
  {
    title: "Profile",
    icon: UserCircle,
    path: "/dashboard/profile",
    tooltip: "Profile",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/dashboard/settings",
    tooltip: "Settings"
  }
];

// Now update the SidebarMenu component
export const SidebarMenu = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => {
    // Get current pathname using Next.js
    const pathname = usePathname();

    return (
      <ul
        ref={ref}
        data-sidebar="menu"
        className={cn("flex w-full min-w-0 flex-col gap-1", className)}
        {...props}
      >
        {navigationItems.map((item, index) => {
          // If this is a separator
          if (item.type === "separator") {
            return <SidebarSeparator key={`separator-${index}`} />;
          }

          // Check if path is active (current path matches or starts with the item path)
          const isActive = item.path === pathname ||
            (item.submenu && pathname.startsWith( item.path || ''));

          // Create Icon component
          const IconComponent = item.icon;

          return (
            <SidebarMenuItem key={`menu-item-${index}`}>
              <SidebarMenuButton
                tooltip={item.tooltip}
                isActive={isActive}
                asChild={item.path !== undefined}
              >
                {item.path ? (
                  <Link href={item.path}>
                    {IconComponent && <IconComponent />}
                    <span>{item.title}</span>
                  </Link>
                ) : (
                  <>
                    {IconComponent && <IconComponent />}
                    <span>{item.title}</span>
                  </>
                )}
              </SidebarMenuButton>

              {/* Render submenu if it exists */}
              {item.submenu && (
                <SidebarMenuSub>
                  {item.submenu.map((subItem, subIndex) => {
                    const isSubItemActive = subItem.path === pathname;

                    return (
                      <SidebarMenuSubItem key={`submenu-item-${index}-${subIndex}`}>
                        <SidebarMenuSubButton
                          isActive={isSubItemActive}
                          asChild
                        >
                          <Link href={subItem.path || ''}>
                            {subItem.title}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          );
        })}
      </ul>
    );
  }
);
SidebarMenu.displayName = "SidebarMenu";