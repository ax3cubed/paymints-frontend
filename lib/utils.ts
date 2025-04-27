import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format wallet address for display
export const formatAddress = (address: string | null) => {
  if (!address) return "Unknown"
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}
