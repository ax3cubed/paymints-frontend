"use client"

import { useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import { invoiceApi } from "@/lib/api/invoice"
import type { CreateInvoiceData, UpdateInvoiceData } from "@/types/invoice"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { isInvoiceActiveAtom, selectedInvoiceAtom } from "@/store/invoice-store"

/**
 * Custom hook for managing invoices
 */
export function useInvoices() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Query for fetching all invoices
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const response = await invoiceApi.getAllInvoices()
      return response.data.invoices
    },
  })

  // Mutation for creating an invoice
  const createInvoiceMutation = useMutation({
    mutationFn: (data: CreateInvoiceData) => invoiceApi.createInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
      toast({
        title: "Success",
        description: "Invoice created successfully",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create invoice: ${error.message}`,
        variant: "destructive",
      })
    },
  })

  // Mutation for updating an invoice
  const updateInvoiceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInvoiceData }) => invoiceApi.updateInvoice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
      toast({
        title: "Success",
        description: "Invoice updated successfully",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update invoice: ${error.message}`,
        variant: "destructive",
      })
    },
  })

  // Mutation for activating an invoice
  const activateInvoiceMutation = useMutation({
    mutationFn: (id: string) => invoiceApi.activateInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
      toast({
        title: "Success",
        description: "Invoice activated successfully",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to activate invoice: ${error.message}`,
        variant: "destructive",
      })
    },
  })

  // Mutation for deleting an invoice
  const deleteInvoiceMutation = useMutation({
    mutationFn: (id: string) => invoiceApi.deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] })
      toast({
        title: "Success",
        description: "Invoice deleted successfully",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete invoice: ${error.message}`,
        variant: "destructive",
      })
    },
  })

  // Function to create an invoice
  const createInvoice = useCallback(
    async (data: CreateInvoiceData) => {
      const response = await createInvoiceMutation.mutateAsync(data)
      return response.data.invoice
    },
    [createInvoiceMutation],
  )

  // Function to update an invoice
  const updateInvoice = useCallback(
    async (id: string, data: UpdateInvoiceData) => {
      const response = await updateInvoiceMutation.mutateAsync({ id, data })
      return response.data.invoice
    },
    [updateInvoiceMutation],
  )

  // Function to activate an invoice
  const activateInvoice = useCallback(
    async (id: string) => {
      const response = await activateInvoiceMutation.mutateAsync(id)
      return response.data.invoice
    },
    [activateInvoiceMutation],
  )

  // Function to delete an invoice
  const deleteInvoice = useCallback(
    async (id: string) => {
      await deleteInvoiceMutation.mutateAsync(id)
    },
    [deleteInvoiceMutation],
  )

  return {
    invoices: data || [],
    isLoading,
    error: error as Error | null,
    refetch,
    createInvoice,
    updateInvoice,
    activateInvoice,
    deleteInvoice,
    isCreating: createInvoiceMutation.isPending,
    isUpdating: updateInvoiceMutation.isPending,
    isActivating: activateInvoiceMutation.isPending,
    isDeleting: deleteInvoiceMutation.isPending,
  }
}

/**
 * Custom hook for managing a single invoice
 */
export function useInvoice(id: string | undefined) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [selectedInvoice, setSelectedInvoice] = useAtom(selectedInvoiceAtom)
  const [isActive, setIsActive] = useAtom(isInvoiceActiveAtom)

  // Query for fetching a single invoice
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["invoice", id],
    queryFn: async () => {
      if (!id) return null
      const response = await invoiceApi.getInvoiceById(id)
      return response.data.invoice
    },
    enabled: !!id,
  })

  // Use useEffect to handle the onSuccess logic
  useCallback(() => {
    if (data) {
      setSelectedInvoice(data)

    }
  }, [data, setSelectedInvoice, setIsActive])

  // Mutation for activating an invoice
  const activateInvoiceMutation = useMutation({
    mutationFn: (id: string) => invoiceApi.activateInvoice(id),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["invoice", id] })
      queryClient.invalidateQueries({ queryKey: ["invoices"] })

      toast({
        title: "Success",
        description: "Invoice activated successfully",
      })
      return result.data.invoice
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to activate invoice: ${error.message}`,
        variant: "destructive",
      })
    },
  })

  // Function to activate an invoice
  const activateInvoice = useCallback(async () => {
    if (!id) return
    return (await activateInvoiceMutation.mutateAsync(id)).data.invoice
  }, [id, activateInvoiceMutation])

  return {
    invoice: data || null,
    isLoading,
    error: error as Error | null,
    refetch,
    activateInvoice,
    isActivating: activateInvoiceMutation.isPending,
    isActive,
  }
}
