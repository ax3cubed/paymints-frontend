import React, { useCallback, useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { 
  tokenAtom, 
  userAtom, 
  isAuthenticatedAtom, 
  isLoadingAuthAtom, 
  authErrorAtom,
  userDetailsAtom
} from '@/lib/store/auth'
import { authApi } from '@/lib/api/auth'
import { createContext, useContext } from 'react'
import type { User, UserDetails } from '@/lib/api/types'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { walletAddressAtom } from '@/lib/store/wallet'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  token: string | null
  user: User | null
  userDetails: UserDetails | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  connectWalletModal: () => void
  connectWallet: () => Promise<void>
  login: () => Promise<void>
  register: () => Promise<void>
  fetchUserDetails: () => Promise<void>
  logout: () => void
  isAuthenticating: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { publicKey, connected, connecting, disconnecting, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAuthAtom);
  const [walletAddr, setWalletAddress] = useAtom(walletAddressAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const [user, setUser] = useAtom(userAtom);
  const [error, setError] = useAtom(authErrorAtom);
  const [userDetails, setUserDetails] = useAtom(userDetailsAtom);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const router = useRouter();

  // Open wallet connection modal
  const connectWalletModal = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  // Connect wallet function - calls API after wallet address is available
  const connectWallet = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setIsAuthenticating(true)
    try {
      const walletAddress =  walletAddr
      if (!walletAddress) {
        throw new Error('Wallet address is required')
      }
      const response = await authApi.connectUser(walletAddress)
      setToken(response.data.token)
      setUser(response.data.user)
      // After connecting, fetch user details
      await fetchUserDetails()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet')
      console.error('Connect wallet error:', err)
    } finally {
      setIsLoading(false)
      setIsAuthenticating(false)
    }
  }, [setIsLoading, setError, setToken, setUser, walletAddr])

  // Login function
  const login = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authApi.login(walletAddr || '')
      setToken(response.data.token)
      setUser(response.data.user)
      // After login, fetch user details
      await fetchUserDetails()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [setIsLoading, setError, setToken, setUser])

  // Register function
  const register = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authApi.register(walletAddr || '')
      setToken(response.data.token)
      setUser(response.data.user)
      // After registration, fetch user details
      await fetchUserDetails()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register')
      console.error('Register error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [setIsLoading, setError, setToken, setUser])

  // Fetch user details
  const fetchUserDetails = useCallback(async () => {
    if (!token) return
    
    setIsLoading(true)
    try {
      const response = await authApi.getUserDetails()
      setUserDetails(response.data)
    } catch (err) {
      console.error('Failed to fetch user details:', err)
      // Not setting error state here since this is secondary data
    } finally {
      setIsLoading(false)
    }
  }, [token, setIsLoading, setUserDetails])

  // Enhanced logout function that disconnects wallet and navigates to landing
  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      // Clear auth state
      setToken(null)
      setUser(null)
      setUserDetails(null)
      
      // Disconnect wallet
      if (connected) {
        await disconnect()
      }
      
      // Navigate to landing page
      router.push('/')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [setToken, setUser, setUserDetails, connected, disconnect, router])

  // Monitor wallet connection and trigger API authentication
  useEffect(() => {
    // Update loading state based on wallet adapter
    setIsLoading(connecting || disconnecting)
    
    // When wallet gets connected and we have publicKey
    if (connected && publicKey) {
      const address = publicKey.toString()
      setWalletAddress(address)
      
      // If we're not already authenticated, trigger API connection
      if (!token && !isAuthenticating) {
        connectWallet()
      }
    } else if (!connected) {
      // When wallet disconnects, clear wallet address
      setWalletAddress(null)
    }
  }, [connected, connecting, disconnecting, publicKey, token, isAuthenticating, connectWallet, setWalletAddress])

  // Auto-fetch user details when token changes
  useEffect(() => {
    if (token && user) {
      fetchUserDetails()
    }
  }, [token, user, fetchUserDetails])

  const value = {
    token,
    user,
    userDetails,
    isAuthenticated,
    isLoading,
    error,
    connectWalletModal,
    connectWallet,
    login,
    register,
    fetchUserDetails,
    logout,
    isAuthenticating
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}