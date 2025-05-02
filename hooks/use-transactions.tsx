"use client"

import { useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { transactionApi } from "@/lib/api/transaction"
import { useAtom } from "jotai"
import { walletAddressAtom } from "@/lib/store/wallet"

export function useTransactions() {
  const [walletAddress] = useAtom(walletAddressAtom)

  const {
    data: transactionsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["transactions", walletAddress],
    queryFn: () =>
      walletAddress ? transactionApi.getTransactions(walletAddress) : Promise.reject("No wallet address"),
    enabled: !!walletAddress,
  })

  const fetchTransactions = useCallback((address: string) => {
    return transactionApi.getTransactions(address)
  }, [])

  return {
    transactions: transactionsData?.data.txn || [],
    isLoading,
    error,
    refetch,
    fetchTransactions,
  }
}
