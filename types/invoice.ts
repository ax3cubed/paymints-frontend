/**
 * Invoice types and interfaces
 */

/**
 * Invoice type enum
 */
export type InvoiceType = "standard" | "donation" | "subscription" | "custom"| "milestone"

/**
 * Invoice status enum
 * 0 = Draft, 1 = Active, 2 = Paid
 */
export type InvoiceStatus = "0" | "1" | "2"

/**
 * Invoice visibility enum
 */
export type InvoiceVisibility = "private" | "public"

/**
 * Invoice service interface
 */
export interface InvoiceService {
  name: string
  description?: string
  quantity: number
  price: number
}

/**
 * Invoice payment interface
 */
export interface InvoicePay {
  payer: string
  amount: string
  timestamp: string
}

/**
 * Invoice creator interface
 */
export interface InvoiceCreator {
  id: number
  address: string
}

/**
 * Base invoice data interface (for creating/updating)
 */
export interface InvoiceData {
  invoiceNo?: string
  invoiceType: InvoiceType
  invoiceTitle: string
  invoiceImage?: string
  invoiceDescription?: string
  invoiceStatus?: InvoiceStatus
  invoiceCategory?: string
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

/**
 * Create invoice data interface
 */
export type CreateInvoiceData = InvoiceData

/**
 * Update invoice data interface
 */
export type UpdateInvoiceData = Partial<InvoiceData>

/**
 * Invoice interface (as returned from API)
 */
export interface Invoice extends InvoiceData {
  id: string
  createdBy?: InvoiceCreator
  createdAt: string
  updatedAt: string
  invoicePays?: InvoicePay[]
  invoiceTxHash?: string
}

/**
 * API response interfaces
 */

export interface ApiResponseMeta {
  timestamp: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta: ApiResponseMeta
}

export interface GetInvoicesResponse {
  invoices: Invoice[]
}

export interface GetInvoiceResponse {
  invoice: Invoice
}

export interface CreateInvoiceResponse {
  invoice: {
    invoiceNo: string
    invoiceTxHash: string
    id: string
  }
}

export interface UpdateInvoiceResponse {
  invoice: Invoice
}

export type DeleteInvoiceResponse = {}

/**
 * Error response interface
 */
export interface ApiErrorResponse {
  success: boolean
  message: string
  errors?: any[]
  meta: ApiResponseMeta
}
