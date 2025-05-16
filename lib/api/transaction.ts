import apiClient from "@/lib/api/client";
import { TransactionsResponse } from "@/types";

export const transactionApi = {
	getTransactions: async (address: string) =>
		await apiClient.post<TransactionsResponse>("/api/txn/transactions", {address}),
};
