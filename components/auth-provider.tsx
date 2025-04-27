"use client";

import { createContext, useContext, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useAtom } from "jotai";
import { isAuthenticatedAtom, isLoadingAtom, walletAddressAtom } from "@/lib/atoms";
import { useRouter } from "next/navigation";

import type { ReactNode } from "react";
import { address } from "@solana/kit";

interface AuthContextType {
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { publicKey, connected, connecting, disconnecting, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [_, setIsAuthenticated] = useAtom(isAuthenticatedAtom);
  const [__, setIsLoading] = useAtom(isLoadingAtom);
  const [___, setWalletAddress] = useAtom(walletAddressAtom);
  const router = useRouter();

  useEffect(() => {
    const loading = connecting || disconnecting;
    setIsLoading(loading);

    if (connected && publicKey) {
      setIsAuthenticated(true);
      setWalletAddress(address(publicKey.toString()));
    } else {
      setIsAuthenticated(false);
      setWalletAddress(null);
    }
  }, [connected, connecting, disconnecting, publicKey, setIsAuthenticated, setIsLoading, setWalletAddress]);

  const connectWallet = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const disconnectWallet = useCallback(async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Error during wallet disconnect:", error);
    } finally {
      setIsAuthenticated(false);
      setWalletAddress(null);
      setTimeout(() => {
        router.push("/"); // Redirect to landing or login
      }, 500); // faster redirect
    }
  }, [disconnect, setIsAuthenticated, setWalletAddress, router]);

  return (
    <AuthContext.Provider value={{ connectWallet, disconnectWallet }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
