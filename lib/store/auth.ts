import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import type { User, UserDetails } from "@/lib/api/types"

// Persistent atoms (stored in localStorage)
export const tokenAtom = atomWithStorage<string | null>("token", null)
export const userAtom = atomWithStorage<User | null>("user", null)

// Derived and ephemeral atoms
export const isAuthenticatedAtom = atom((get) => (!!get(tokenAtom) && !!get(userAtom)) || false) 
export const isLoadingAuthAtom = atom<boolean>(false)
export const authErrorAtom = atom<string | null>(null)

// User details atoms
export const userDetailsAtom = atom<UserDetails | null>(null)
export const beneficiariesAtom = atom((get) => get(userDetailsAtom)?.beneficiaries || [])
export const tokensAtom = atom((get) => get(userDetailsAtom)?.tokens || [])
