import apiClient from "@/lib/api/client"
import type { TransactionsResponse } from "@/lib/api/types"

export const transactionApi = {
  getTransactions: async (address: string) => {
    const response = await apiClient.get<TransactionsResponse>("/api/txn/transactions", {
      params: { address },
    })
    return response.data
  },
}
