"use client"

import { useCallback } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { paymentApi } from "@/lib/api/payment"
import { useAtom } from "jotai"
import { walletAddressAtom } from "@/lib/store/wallet"

export function usePayments() {
  const queryClient = useQueryClient()
  const [walletAddress] = useAtom(walletAddressAtom)

  // Get payments by address
  const {
    data: paymentsData,
    isLoading: isLoadingPayments,
    error: paymentsError,
    refetch: refetchPayments,
  } = useQuery({
    queryKey: ["payments", walletAddress],
    queryFn: () =>
      walletAddress ? paymentApi.getPaymentsByAddress(walletAddress) : Promise.reject("No wallet address"),
    enabled: !!walletAddress,
  })

  // Create payment mutation
  const createPaymentMutation = useMutation({
    mutationFn: paymentApi.createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", walletAddress] })
    },
  })

  // Update payment mutation
  const updatePaymentMutation = useMutation({
    mutationFn: ({
      paymentHash,
      paymentStatus,
    }: { paymentHash: string; paymentStatus: "pending" | "completed" | "failed" | "cancelled" }) =>
      paymentApi.updatePayment(paymentHash, paymentStatus),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments", walletAddress] })
      queryClient.invalidateQueries({ queryKey: ["payment", variables.paymentHash] })
    },
  })

  // Create payment
  const createPayment = useCallback(
    (paymentData: Parameters<typeof paymentApi.createPayment>[0]) => {
      return createPaymentMutation.mutateAsync(paymentData)
    },
    [createPaymentMutation],
  )

  // Update payment
  const updatePayment = useCallback(
    (paymentHash: string, paymentStatus: "pending" | "completed" | "failed" | "cancelled") => {
      return updatePaymentMutation.mutateAsync({ paymentHash, paymentStatus })
    },
    [updatePaymentMutation],
  )

  return {
    payments: paymentsData?.data.txn || [],
    isLoading: isLoadingPayments,
    error: paymentsError,
    refetch: refetchPayments,
    createPayment,
    updatePayment,
    isCreating: createPaymentMutation.isPending,
    isUpdating: updatePaymentMutation.isPending,
    createError: createPaymentMutation.error,
    updateError: updatePaymentMutation.error,
  }
}

export function usePayment(paymentHash: string | undefined) {
  // Get payment by hash
  const {
    data: paymentData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["payment", paymentHash],
    queryFn: () =>
      paymentHash ? paymentApi.getPaymentByHash(paymentHash) : Promise.reject("No payment hash provided"),
    enabled: !!paymentHash,
  })

  return {
    payment: paymentData?.data.txn,
    isLoading,
    error,
    refetch,
  }
}
