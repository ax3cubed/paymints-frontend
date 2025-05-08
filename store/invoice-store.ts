import { atom } from "jotai"
import type { Invoice } from "@/types/invoice"

/**
 * Atom for storing the currently selected invoice
 */
export const selectedInvoiceAtom = atom<Invoice | null>(null)

/**
 * Atom for storing the invoice activation state
 */
export const isInvoiceActiveAtom = atom<boolean>(false)

/**
 * Atom for storing the invoice filter criteria
 */
export const invoiceFilterAtom = atom<{
  status?: string
  type?: string
  search?: string
}>({})

/**
 * Atom for storing the invoice sort criteria
 */
export const invoiceSortAtom = atom<{
  field: string
  direction: "asc" | "desc"
}>({
  field: "createdAt",
  direction: "desc",
})
