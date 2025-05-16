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
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { walletAddressAtom } from '@/lib/store/wallet';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api/client';
import { User, UserDetails } from '@/types';

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
  connectWallet: () => Promise<{ success: boolean; error?: string }>;
  login: () => Promise<{ success: boolean; error?: string }>;
  register: () => Promise<{ success: boolean; error?: string }>;
  fetchUserDetails: () => Promise<{ success: boolean; error?: any; data?: any }>;
  logout: () => Promise<{ success: boolean; error?: any }>;
  isAuthenticating: boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { publicKey, connected, connecting, disconnecting, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  
  // Atoms
  const [token, setToken] = useAtom(tokenAtom);
  const [user, setUser] = useAtom(userAtom);
  const [userDetails, setUserDetails] = useAtom(userDetailsAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom); // Read-only derived atom
  const [isLoading, setIsLoading] = useAtom(isLoadingAuthAtom);
  const [error, setError] = useAtom(authErrorAtom);
  const [walletAddr, setWalletAddress] = useAtom(walletAddressAtom);

  // Local state
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [initialSetupComplete, setInitialSetupComplete] = useState(false);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  // Open wallet connection modal
  const connectWalletModal = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  // No need to manually synchronize isAuthenticated state as it's derived from tokenAtom and userAtom

  // Update API client auth header when token changes
  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Synchronize wallet address with state
  useEffect(() => {
    if (connected && publicKey) {
      setWalletAddress(publicKey.toString());
    } else if (!connected) {
      setWalletAddress(null);
    }
  }, [connected, publicKey, setWalletAddress]);

  // Core authentication function - reused by other auth methods
  const authenticateWithWallet = useCallback(async (authMethod: 'connect' | 'login' | 'register') => {
    if (!publicKey) {
      connectWalletModal();
      return { success: false };
    }

    const address = publicKey.toString();
    setWalletAddress(address);
    
    setIsLoading(true);
    setError(null);
    setIsAuthenticating(true);
    
    try {
      let response;
      
      switch (authMethod) {
        case 'connect':
          response = await authApi.connectUser(address);
          break;
        case 'login':
          response = await authApi.login(address);
          break;
        case 'register':
          response = await authApi.register(address);
          break;
      }
      
      setToken(response.data.data.token);
      setUser(response.data.data.user);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : `Failed to ${authMethod} with wallet`;
      setError(errorMessage);
      console.error(`${authMethod} error:`, err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
      setIsAuthenticating(false);
    }
  }, [publicKey, setWalletAddress, setIsLoading, setError, setToken, setUser, connectWalletModal]);

  // Public authentication methods
  const connectWallet = useCallback(async () => {
    return authenticateWithWallet('connect');
  }, [authenticateWithWallet]);

  const login = useCallback(async () => {
    return authenticateWithWallet('login');
  }, [authenticateWithWallet]);
  
  const register = useCallback(async () => {
    return authenticateWithWallet('register');
  }, [authenticateWithWallet]);

  // Fetch user details
  const fetchUserDetails = useCallback(async () => {
    if (!token || !isAuthenticated) return { success: false };

    setIsLoading(true);
    try {
      const response = await authApi.getUserDetails();
      setUserDetails(response.data.data);
      return { success: true, data: response.data.data };
    } catch (err) {
      console.error('Failed to fetch user details:', err);
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  }, [token, isAuthenticated, setIsLoading, setUserDetails]);

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
      return { success: true };
    } catch (err) {
      console.error('Logout error:', err);
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  }, [setToken, setUser, setUserDetails, setWalletAddress, connected, disconnect, router]);

  // Initial app setup & auto-login
  useEffect(() => {
    // Skip if initial setup is complete or authentication is in progress
    if (initialSetupComplete || isAuthenticating || isLoading) {
      return;
    }

    const attemptAutoLogin = async () => {
      // If wallet is connected but we're not authenticated, try to connect
      if (connected && publicKey && !isAuthenticated && !token) {
        await connectWallet();
      }
      
      setInitialSetupComplete(true);
    };

    attemptAutoLogin();
  }, [connected, publicKey, isAuthenticated, token, isAuthenticating, isLoading, connectWallet, initialSetupComplete]);

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