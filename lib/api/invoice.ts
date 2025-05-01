import apiClient from "./client"
import type { InvoiceResponse, InvoicesResponse } from "@/lib/api/types"

export const invoiceApi = {
  createInvoice: async (invoiceData: any) => {
    const response = await apiClient.post<InvoiceResponse>("/api/invoice/", invoiceData)
    return response.data
  },

  getAllInvoices: async () => {
    const response = await apiClient.get<InvoicesResponse>("/api/invoice/")
    return response.data
  },

  getInvoiceById: async (id: string) => {
    const response = await apiClient.get<InvoiceResponse>(`/api/invoice/${id}`)
    return response.data
  },

  updateInvoice: async (id: string, invoiceData: any) => {
    const response = await apiClient.put<InvoiceResponse>(`/api/invoice/${id}`, invoiceData)
    return response.data
  },

  deleteInvoice: async (id: string) => {
    const response = await apiClient.delete(`/api/invoice/${id}`)
    return response.data
  },
}
