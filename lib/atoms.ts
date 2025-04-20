import type React from "react"
import { atom } from "jotai"
import type { User } from "@privy-io/react-auth"

// Auth atoms
export const userAtom = atom<User | null>(null)
export const isAuthenticatedAtom = atom<boolean>(false)
export const isLoadingAtom = atom<boolean>(true)
export const walletAddressAtom = atom<string | null>(null)

// UI state atoms
export const sidebarCollapsedAtom = atom<boolean>(false)
export const currentThemeAtom = atom<"light" | "dark" | "system">("dark")

// Application state atoms
export const balanceAtom = atom<number>(0)
export const notificationsAtom = atom<
  Array<{
    id: string
    title: string
    description: string
    time: string
    read: boolean
    icon?: React.ReactNode
  }>
>([])
