import apiClient from "./client"
import type { PaymentResponse, PaymentsResponse, SinglePaymentResponse } from "@/lib/api/types"

export const paymentApi = {
  createPayment: async (paymentData: {
    paymentHash: string
    paymentDescription?: string
    receiver: string
    sender: string
    totalAmount: string
    serviceType: "invoice" | "payroll" | "DAO" | "credit"
    paymentDate?: string
    paymentStatus?: "pending" | "completed" | "failed" | "cancelled"
    paymentSignature?: string
    mintAddress: string
  }) => {
    const response = await apiClient.post<PaymentResponse>("/api/payments/", paymentData)
    return response.data
  },

  getPaymentsByAddress: async (walletAddress: string) => {
    const response = await apiClient.get<PaymentsResponse>("/api/payments/paymentsForAddress", {
      params: { walletAddress },
    })
    return response.data
  },

  getPaymentByHash: async (paymentHash: string) => {
    const response = await apiClient.get<SinglePaymentResponse>("/api/payments/paymentFromPaymentHash", {
      params: { paymentHash },
    })
    return response.data
  },

  updatePayment: async (paymentHash: string, paymentStatus: "pending" | "completed" | "failed" | "cancelled") => {
    const response = await apiClient.put("/api/payments/updatePaymentData", {
      paymentHash,
      paymentStatus,
    })
    return response.data
  },
}
