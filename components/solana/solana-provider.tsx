"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { type SolanaRpcApi, createDefaultRpcTransport, Rpc, Base64EncodedWireTransaction, Commitment, address, createSolanaRpcFromTransport } from "@solana/kit"
import { AnchorProvider, setProvider } from "@project-serum/anchor"
import { useWallet } from "@solana/wallet-adapter-react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import {
  PhantomWalletAdapter,
  CloverWalletAdapter,
  CoinbaseWalletAdapter,
  LedgerWalletAdapter,
  Coin98WalletAdapter,
  MathWalletAdapter,
  SafePalWalletAdapter,
  TokenPocketWalletAdapter,
  TrustWalletAdapter,
  ParticleAdapter,
  AlphaWalletAdapter,
  CoinhubWalletAdapter,
} from "@solana/wallet-adapter-wallets"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { useCluster } from "@/components/cluster-provider"
import {   PublicKey, Signer, Transaction } from "@solana/web3.js"

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css"

type SolanaContextType = {
  rpc: Rpc<SolanaRpcApi> | null
  anchorProvider: AnchorProvider | null
}

const SolanaContext = createContext<SolanaContextType>({
  rpc: null,
  anchorProvider: null,
})

export const useSolana = () => {
  const context = useContext(SolanaContext)
  if (!context) {
    throw new Error("useSolana must be used within a SolanaProvider")
  }
  return context
}

export function SolanaProviderInner({ children }: { children: React.ReactNode }) {
  const { wallet, publicKey, signAllTransactions, signTransaction } = useWallet()
  const { cluster } = useCluster()
  const [rpc, setRpc] = useState<Rpc<SolanaRpcApi> | null>(null)
  const [anchorProvider, setAnchorProvider] = useState<AnchorProvider | null>(null)
  const [mounted, setMounted] = useState(false)
   // Create a new AbortController.
   const abortController = new AbortController();

   // Abort the request when the user navigates away from the current page.
   function onUserNavigateAway() {
     abortController.abort();
   }
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (!mounted) return

    try {
      // Initialize SolanaRpc using the selected cluster
      const transport = createDefaultRpcTransport({ url: cluster.endpoint })
      const solanaRpc = createSolanaRpcFromTransport(transport)
   
      setRpc(solanaRpc)
    } catch (error) {
      console.error("Failed to initialize Solana RPC:", error)
    }
  }, [cluster.endpoint, mounted])

  useEffect(() => {
    if (!mounted || !rpc || !wallet || !publicKey || !signTransaction || !signAllTransactions) {
      setAnchorProvider(null)
      return
    }

    try {
      // Create a Connection-like adapter that wraps the RPC client
      const connectionAdapter = {
        rpcEndpoint: cluster.endpoint,

        // Minimal Connection implementation needed by AnchorProvider
        sendTransaction: async (
          transaction: Transaction,
          signers: Signer[],
          options?: { preflightCommitment?: string; skipPreflight?: boolean }
        ) => {
          transaction.recentBlockhash = (await rpc.getLatestBlockhash().send({ abortSignal: abortController.signal })).value.blockhash
          transaction.feePayer = publicKey

          if (signers.length > 0) {
            transaction.sign(...signers)
          }

          const signedTransaction = await signTransaction(transaction)
          const serializedTransaction = signedTransaction.serialize()
          const base64WireTransaction: Base64EncodedWireTransaction = btoa(String.fromCharCode(...new Uint8Array(serializedTransaction))) as Base64EncodedWireTransaction;
          const signature = await rpc.sendTransaction(
            base64WireTransaction,
            {
              preflightCommitment: (options?.preflightCommitment || "confirmed") as Commitment,
              skipPreflight: options?.skipPreflight,
            }
          ).send({ abortSignal: abortController.signal })

          return signature
        },

        getLatestBlockhash: async (commitment?: string) => {
          const response = await rpc.getLatestBlockhash({
            commitment: (commitment || "confirmed") as Commitment
          }).send({ abortSignal: abortController.signal })
          return response.value
        },

        getAccountInfo: async (publicKey: PublicKey, commitment?: string) => {
          const response = await rpc.getAccountInfo(address(publicKey.toString()), {
            commitment: (commitment || "confirmed") as Commitment,
            encoding: "base64"
          }).send({ abortSignal: abortController.signal })
          return response.value
        },

        getBalance: async (publicKey: PublicKey, commitment?: string) => {
          const response = await rpc.getBalance(address(publicKey.toString()), {
            commitment: (commitment || "confirmed") as Commitment
          }).send({ abortSignal: abortController.signal })
          return response.value
        },
      }

      const provider = new AnchorProvider(
        connectionAdapter as any, // We've implemented the minimal required methods
        {
          publicKey,
          signTransaction,
          signAllTransactions,
        },
        {
          commitment: "confirmed",
          skipPreflight: false
        }
      )

      setProvider(provider)
      setAnchorProvider(provider)
    } catch (error) {
      console.error("Failed to initialize Anchor provider:", error)
      setAnchorProvider(null)
    }
  }, [wallet, publicKey, signTransaction, signAllTransactions, cluster, mounted, rpc])

  return <SolanaContext.Provider value={{ rpc, anchorProvider }}>{children}</SolanaContext.Provider>
}

export function SolanaProvider({ children }: { children: React.ReactNode }) {
  const { cluster } = useCluster()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new CloverWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new LedgerWalletAdapter(),
      new Coin98WalletAdapter(),
      new MathWalletAdapter(),
      new SafePalWalletAdapter(),
      new TokenPocketWalletAdapter(),
      new TrustWalletAdapter(),
      new ParticleAdapter(),
      new AlphaWalletAdapter(),
      new CoinhubWalletAdapter(),
    ],
    []
  )

  if (!mounted) {
    return null // Better for SSR than hidden div
  }

  return (
    <ConnectionProvider endpoint={cluster.endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <SolanaProviderInner>{children}</SolanaProviderInner>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}