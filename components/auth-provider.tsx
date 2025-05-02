import React, { useCallback, useEffect, useState, createContext, useContext } from 'react';
import { useAtom } from 'jotai';
import {
  tokenAtom,
  userAtom,
  isAuthenticatedAtom,
  isLoadingAuthAtom,
  authErrorAtom,
  userDetailsAtom
} from '@/lib/store/auth';
import { authApi } from '@/lib/api/auth';
import type { User, UserDetails } from '@/lib/api/types';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { walletAddressAtom } from '@/lib/store/wallet';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api/client';

interface AuthContextType {
  token: string | null;
  user: User | null;
  beneficiaries?: UserDetails['beneficiaries'];
  tokens?: UserDetails['tokens'];


  userDetails: UserDetails | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  connectWalletModal: () => void;
  connectWallet: () => Promise<void>;
  login: () => Promise<void>;
  register: () => Promise<void>;
  fetchUserDetails: () => Promise<void>;
  logout: () => void;
  isAuthenticating: boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { publicKey, connected, connecting, disconnecting, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const router = useRouter();

  // Atoms
  const [token, setToken] = useAtom(tokenAtom);
  const [user, setUser] = useAtom(userAtom);
  const [userDetails, setUserDetails] = useAtom(userDetailsAtom);
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAuthAtom);
  const [error, setError] = useAtom(authErrorAtom);
  const [walletAddr, setWalletAddress] = useAtom(walletAddressAtom);

  // Local state
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [hasAttemptedAutoLogin, setHasAttemptedAutoLogin] = useState(false);

  // Update isAuthenticated state based on token and user
  useEffect(() => {
    setToken(token ? token : null);
  }, [token, user, setIsAuthenticated]);

  // Update API client auth header when token changes
  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  // Open wallet connection modal
  const connectWalletModal = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  // Fetch user details (safe to call multiple times)
  const fetchUserDetails = useCallback(async () => {
    if (!token || !isAuthenticated) return;

    setIsLoading(true);
    try {
      const response = await authApi.getUserDetails();
      setUserDetails(response.data);
    } catch (err) {
      console.error('Failed to fetch user details:', err);
      // Not setting error state here since this is secondary data
    } finally {
      setIsLoading(false);
    }
  }, [token, isAuthenticated, setIsLoading, setUserDetails]);

  // Connect wallet function
  const connectWallet = useCallback(async () => {
    if (!publicKey) {
      connectWalletModal();
      return;
    }

    const address = publicKey.toString();
    setWalletAddress(address);

    setIsLoading(true);
    setError(null);
    setIsAuthenticating(true);

    try {
      const response = await authApi.connectUser(address);
      setToken(response.data.token);
      setUser(response.data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      console.error('Connect wallet error:', err);
    } finally {
      setIsLoading(false);
      setIsAuthenticating(false);
    }
  }, [publicKey, setWalletAddress, setIsLoading, setError, setToken, setUser, connectWalletModal]);

  // Login function
  const login = useCallback(async () => {
    if (!publicKey) {
      setError('Wallet not connected');
      return;
    }

    const address = publicKey.toString();
    setWalletAddress(address);

    setIsLoading(true);
    setError(null);
    setIsAuthenticating(true);

    try {
      const response = await authApi.login(address);
      setToken(response.data.token);
      setUser(response.data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
      setIsAuthenticating(false);
    }
  }, [publicKey, setWalletAddress, setIsLoading, setError, setToken, setUser]);

  // Register function
  const register = useCallback(async () => {
    if (!publicKey) {
      setError('Wallet not connected');
      return;
    }

    const address = publicKey.toString();
    setWalletAddress(address);

    setIsLoading(true);
    setError(null);
    setIsAuthenticating(true);

    try {
      const response = await authApi.register(address);
      setToken(response.data.token);
      setUser(response.data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
      console.error('Register error:', err);
    } finally {
      setIsLoading(false);
      setIsAuthenticating(false);
    }
  }, [publicKey, setWalletAddress, setIsLoading, setError, setToken, setUser]);

  // Logout function
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      // Clear auth state
      setToken(null);
      setUser(null);
      setUserDetails(null);
      setWalletAddress(null);

      // Disconnect wallet
      if (connected) {
        await disconnect();
      }

      // Navigate to landing page
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [setToken, setUser, setUserDetails, setWalletAddress, connected, disconnect, router]);

  // Handle wallet connection changes
  useEffect(() => {
    // Update wallet address when publicKey changes
    if (connected && publicKey) {
      const address = publicKey.toString();
      setWalletAddress(address);
    } else if (!connected) {
      setWalletAddress(null);
    }
  }, [connected, publicKey, setWalletAddress]);

  // Auto-login if wallet is connected
  useEffect(() => {
    // Skip if we've already attempted auto-login or if auth is in progress
    if (hasAttemptedAutoLogin || isAuthenticating || isLoading) {
      return;
    }

    // If wallet is connected but we're not authenticated, try to connect
    if (connected && publicKey && !isAuthenticated && !token) {
      setHasAttemptedAutoLogin(true);
      connectWallet();
    }
  }, [connected, publicKey, isAuthenticated, token, isAuthenticating, isLoading, connectWallet, hasAttemptedAutoLogin]);

  // Auto-fetch user details when authentication state changes
  useEffect(() => {
    if (isAuthenticated && token && user) {
      fetchUserDetails();
    }
  }, [isAuthenticated, token, user, fetchUserDetails]);

  // Provide auth context
  const value = {
    token,
    user,
    beneficiaries: userDetails?.beneficiaries,
    tokens: userDetails?.tokens,
    userDetails,

    isAuthenticated,
    isLoading: isLoading || connecting || disconnecting,
    error,
    connectWalletModal,
    connectWallet,
    login,
    register,
    fetchUserDetails,
    logout,
    isAuthenticating,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};