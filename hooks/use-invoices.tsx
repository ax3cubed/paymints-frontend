"use client"

import { useCallback, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { invoiceApi } from "@/lib/api/invoice"
import type { 
  Invoice, 
  InvoiceService, 
  InvoiceType, 
  InvoiceVisibility,
  InvoiceResponse,
  InvoicesResponse 
} from "@/types"
import { useLoadingContext } from "@/providers/loading-provider"

// Define type-safe interfaces for our invoice data
interface CreateInvoiceData {
  invoiceType: InvoiceType
  invoiceTitle: string
  invoiceImage?: string
  invoiceDescription?: string
  invoiceMintAddress: string
  clientName: string
  clientWallet: string
  clientEmail?: string
  clientAddress: string
  isClientInformation: boolean
  isExpirable: boolean
  dueDate?: string
  discountCodes?: any[]
  tipOptionEnabled: boolean
  invoiceVisibility: InvoiceVisibility
  autoEmailReceipt: boolean
  QRcodeEnabled: boolean
  services: InvoiceService[]
  subtotal: number
  discount: number
  taxRate: number
  taxAmount: number
  totalAmount: number
}

type UpdateInvoiceData = Partial<CreateInvoiceData>

// Define loading messages for different operations
const LOADING_MESSAGES = {
  FETCH_INVOICES: "Loading invoices...",
  CREATE_INVOICE: "Creating invoice...",
  UPDATE_INVOICE: "Updating invoice...",
  DELETE_INVOICE: "Deleting invoice...",
  FETCH_INVOICE_BY_ID: "Loading invoice details...",
}

export function useInvoices() {
  const queryClient = useQueryClient()
  const { startLoading, stopLoading } = useLoadingContext()
  
  // Local loading states for more granular control
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false)

  // Get all invoices
  const {
    data: invoicesData,
    error: invoicesError,
    refetch: refetchInvoices,
    isFetching: isQueryFetching,
  } = useQuery<InvoicesResponse>({
    queryKey: ["invoices"],
    queryFn: async () => {
      setIsLoadingInvoices(true)
      startLoading("default", LOADING_MESSAGES.FETCH_INVOICES)
      try {
        return await invoiceApi.getAllInvoices()
      } finally {
        stopLoading()
        setIsLoadingInvoices(false)
      }
    },
  })

  // Create invoice mutation
  const createInvoiceMutation = useMutation<InvoiceResponse, Error, CreateInvoiceData>({
    mutationFn: async (data) => {
      setIsCreating(true)
      startLoading("electric", LOADING_MESSAGES.CREATE_INVOICE)
      try {
        return await invoiceApi.createInvoice(data)
      } finally {
        stopLoading()
        setIsCreating(false)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
    },
  })

  // Update invoice mutation
  const updateInvoiceMutation = useMutation<
    InvoiceResponse, 
    Error, 
    { id: string; data: UpdateInvoiceData }
  >({
    mutationFn: async ({ id, data }) => {
      setIsUpdating(true)
      startLoading("default", LOADING_MESSAGES.UPDATE_INVOICE)
      try {
        return await invoiceApi.updateInvoice(id, data)
      } finally {
        stopLoading()
        setIsUpdating(false)
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
      queryClient.invalidateQueries({ queryKey: ["invoice", variables.id] })
    },
  })

  // Delete invoice mutation
  const deleteInvoiceMutation = useMutation<unknown, Error, string>({
    mutationFn: async (id) => {
      setIsDeleting(true)
      startLoading("bolt", LOADING_MESSAGES.DELETE_INVOICE)
      try {
        return await invoiceApi.deleteInvoice(id)
      } finally {
        stopLoading()
        setIsDeleting(false)
      }
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
      queryClient.removeQueries({ queryKey: ["invoice", id] })
    },
  })

  // Create invoice
  const createInvoice = useCallback(
    (invoiceData: CreateInvoiceData) => {
      return createInvoiceMutation.mutateAsync(invoiceData)
    },
    [createInvoiceMutation],
  )

  // Update invoice
  const updateInvoice = useCallback(
    (id: string, invoiceData: UpdateInvoiceData) => {
      return updateInvoiceMutation.mutateAsync({ id, data: invoiceData })
    },
    [updateInvoiceMutation],
  )

  // Delete invoice
  const deleteInvoice = useCallback(
    (id: string) => {
      return deleteInvoiceMutation.mutateAsync(id)
    },
    [deleteInvoiceMutation],
  )

  return {
    invoices: invoicesData?.data.invoices || [],
    isLoading: isLoadingInvoices || isQueryFetching,
    error: invoicesError,
    refetch: refetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    isCreating,
    isUpdating,
    isDeleting,
    createError: createInvoiceMutation.error,
    updateError: updateInvoiceMutation.error,
    deleteError: deleteInvoiceMutation.error,
  }
}

export function useInvoice(id: string | undefined) {
  const { startLoading, stopLoading } = useLoadingContext()
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false)
  
  // Get invoice by ID
  const {
    data: invoiceData,
    error,
    refetch,
    isFetching,
  } = useQuery<InvoiceResponse>({
    queryKey: ["invoice", id],
    queryFn: async () => {
      if (!id) {
        throw new Error("No invoice ID provided")
      }
      
      setIsLoadingInvoice(true)
      startLoading("default", LOADING_MESSAGES.FETCH_INVOICE_BY_ID)
      try {
        return await invoiceApi.getInvoiceById(id)
      } finally {
        stopLoading()
        setIsLoadingInvoice(false)
      }
    },
    enabled: !!id,
  })

  return {
    invoice: invoiceData?.data.invoice,
    isLoading: isLoadingInvoice || isFetching,
    error,
    refetch,
  }
}