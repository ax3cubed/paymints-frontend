"use client"

import { Connection } from "@solana/web3.js"
import { atom, useAtomValue, useSetAtom } from "jotai"
import { atomWithStorage, createJSONStorage } from "jotai/utils"
import { createContext, type ReactNode, useContext, useEffect, useState } from "react"

// Custom storage that checks for window/localStorage availability
const safeStorage = createJSONStorage<any>(() => {
  if (typeof window === "undefined") {
    // Return a dummy storage during SSR
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    }
  }
  return localStorage
})

export interface SolanaCluster {
  name: string
  endpoint: string
  network?: ClusterNetwork
  active?: boolean
  description?: string
}

export enum ClusterNetwork {
  Mainnet = "mainnet-beta",
  Testnet = "testnet",
  Devnet = "devnet",
  Custom = "custom",
}

// Updated cluster definitions with descriptions
export const defaultClusters: SolanaCluster[] = [
  {
    name: "Mainnet Beta",
    endpoint: "https://api.mainnet-beta.solana.com",
    network: ClusterNetwork.Mainnet,
    description: "Live production environment. Requires SOL for transactions.",
  },
  {
    name: "Devnet",
    endpoint: "https://api.devnet.solana.com",
    network: ClusterNetwork.Devnet,
    description: "Public testing and development. Free SOL airdrop for testing.",
  },
  {
    name: "Testnet",
    endpoint: "https://api.testnet.solana.com",
    network: ClusterNetwork.Testnet,
    description: "Validator and stress testing. May have intermittent downtime.",
  },
  {
    name: "Local",
    endpoint: "http://localhost:8899",
    network: ClusterNetwork.Custom,
    description: "Local development environment.",
  },
]

// Use the safe storage implementation
const clusterAtom = atomWithStorage<SolanaCluster>("solana-cluster", defaultClusters[1], safeStorage)
const clustersAtom = atomWithStorage<SolanaCluster[]>("solana-clusters", defaultClusters, safeStorage)

const activeClustersAtom = atom<SolanaCluster[]>((get) => {
  const clusters = get(clustersAtom)
  const cluster = get(clusterAtom)
  return clusters.map((item) => ({
    ...item,
    active: item.name === cluster.name,
  }))
})

const activeClusterAtom = atom<SolanaCluster>((get) => {
  const clusters = get(activeClustersAtom)

  return clusters.find((item) => item.active) || clusters[0]
})

export interface ClusterProviderContext {
  cluster: SolanaCluster
  clusters: SolanaCluster[]
  addCluster: (cluster: SolanaCluster) => void
  deleteCluster: (cluster: SolanaCluster) => void
  setCluster: (cluster: SolanaCluster) => void
  getExplorerUrl(path: string): string
}

const Context = createContext<ClusterProviderContext>({} as ClusterProviderContext)

export function ClusterProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const cluster = useAtomValue(activeClusterAtom)
  const clusters = useAtomValue(activeClustersAtom)
  const setCluster = useSetAtom(clusterAtom)
  const setClusters = useSetAtom(clustersAtom)

  // Handle client-side only code
  useEffect(() => {
    setMounted(true)
  }, [])

  const value: ClusterProviderContext = {
    cluster,
    clusters: clusters.sort((a, b) => (a.name > b.name ? 1 : -1)),
    addCluster: (cluster: SolanaCluster) => {
      if (!mounted) return // Don't run during SSR

      try {
        new Connection(cluster.endpoint)
        setClusters([...clusters, cluster])
      } catch (err) {
        
      }
    },
    deleteCluster: (cluster: SolanaCluster) => {
      if (!mounted) return // Don't run during SSR

      setClusters(clusters.filter((item) => item.name !== cluster.name))
    },
    setCluster: (cluster: SolanaCluster) => {
      if (!mounted) return // Don't run during SSR

      setCluster(cluster)
    },
    getExplorerUrl: (path: string) => `https://explorer.solana.com/${path}${getClusterUrlParam(cluster)}`,
  }

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useCluster() {
  return useContext(Context)
}

function getClusterUrlParam(cluster: SolanaCluster): string {
  let suffix = ""
  switch (cluster.network) {
    case ClusterNetwork.Devnet:
      suffix = "devnet"
      break
    case ClusterNetwork.Mainnet:
      suffix = ""
      break
    case ClusterNetwork.Testnet:
      suffix = "testnet"
      break
    default:
      suffix = `custom&customUrl=${encodeURIComponent(cluster.endpoint)}`
      break
  }

  return suffix.length ? `?cluster=${suffix}` : ""
}
