import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

// Wallet connection state
export const walletAddressAtom = atomWithStorage<string | null>("walletAddress", null)
export const isWalletConnectedAtom = atom((get) => !!get(walletAddressAtom))
export const isConnectingWalletAtom = atom<boolean>(false)
export const walletErrorAtom = atom<string | null>(null)
