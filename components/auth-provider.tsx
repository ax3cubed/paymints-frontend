"use client"

import type React from "react"
import { createContext, useContext, useEffect } from "react"
import { PrivyProvider, usePrivy } from "@privy-io/react-auth"
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana"
import { useRouter } from "next/navigation"
import { useAtom } from "jotai"
import { userAtom, isAuthenticatedAtom, isLoadingAtom, walletAddressAtom } from "@/lib/atoms"

// Create Solana connectors with auto-connect enabled
const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: true,
})

// Create a context to share wallet state across the app
type AuthContextType = {
  connectWallet: () => void
  disconnectWallet: () => void
  connectOrCreateWallet: () => void
}

const AuthContext = createContext<AuthContextType>({
  connectWallet: () => {},
  disconnectWallet: () => {},
  connectOrCreateWallet: () => {},
})

export const useAuth = () => useContext(AuthContext)

// Wrapper component that provides Privy authentication
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        appearance: {
          accentColor: "#8b5cf6", // Using our purple theme color
          theme: "#FFFFFF",
          showWalletLoginFirst: false,
          logo: "/images/paymint-logo.png",
          walletChainType: "solana-only",
          walletList: ["detected_solana_wallets", "rabby_wallet", "phantom", "wallet_connect", "okx_wallet"],
        },
        loginMethods: ["wallet"],
        fundingMethodConfig: {
          moonpay: {
            useSandbox: true,
          },
        },
        embeddedWallets: {
          requireUserPasswordOnCreate: false,
          showWalletUIs: true,

          createOnLogin: "users-without-wallets",
        },
        mfa: {
          noPromptOnMfaRequired: false,
        },
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
      }}
    >
      <AuthProviderInner>{children}</AuthProviderInner>
    </PrivyProvider>
  )
}

// Inner provider that handles authentication state
function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, user, login, logout, connectOrCreateWallet } = usePrivy()
  const router = useRouter()

  // Use jotai atoms for state management
  const [, setUser] = useAtom(userAtom)
  const [, setIsAuthenticated] = useAtom(isAuthenticatedAtom)
  const [, setIsLoading] = useAtom(isLoadingAtom)
  const [, setWalletAddress] = useAtom(walletAddressAtom)

  useEffect(() => {
    // Update loading state
    setIsLoading(!ready)

    if (ready) {
      // Update authentication state
      setIsAuthenticated(authenticated)

      if (authenticated && user) {
        // Set user data
        setUser(user)

        // Get the Solana wallet address if available
        const solanaWallet = user.wallet

        setWalletAddress(solanaWallet?.address || null)
      } else {
        // Clear user data if not authenticated
        setUser(null)
        setWalletAddress(null)
      }
    }
  }, [ready, authenticated, user, setUser, setIsAuthenticated, setIsLoading, setWalletAddress])

  const handleConnectWallet = () => {
    login()
  }

  const handleDisconnectWallet = () => {
    logout()
    router.push("/")
  }

  const handleConnectOrCreateWallet = () => {
    connectOrCreateWallet()
  }

  const value = {
    connectWallet: handleConnectWallet,
    disconnectWallet: handleDisconnectWallet,
    connectOrCreateWallet: handleConnectOrCreateWallet,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
