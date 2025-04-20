"use client"

import type * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CurrencyBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  currency: string
  amount: number | string
  showIcon?: boolean
  variant?: "default" | "outline" | "secondary" | "destructive"
}

const currencyIcons: Record<string, string> = {
  USDC: "/placeholder.svg?height=16&width=16",
  SOL: "/placeholder.svg?height=16&width=16",
  USDT: "/placeholder.svg?height=16&width=16",
  ETH: "/placeholder.svg?height=16&width=16",
  BTC: "/placeholder.svg?height=16&width=16",
}

export function CurrencyBadge({
  currency,
  amount,
  showIcon = true,
  variant = "secondary",
  className,
  ...props
}: CurrencyBadgeProps) {
  const formattedAmount =
    typeof amount === "number"
      ? amount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        })
      : amount

  return (
    <Badge variant={variant} className={cn("font-mono", className)} {...props}>
      {showIcon && currencyIcons[currency] && (
        <img src={currencyIcons[currency] || "/placeholder.svg"} alt={currency} className="mr-1 h-4 w-4" />
      )}
      {formattedAmount} {currency}
    </Badge>
  )
}
