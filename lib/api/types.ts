// User Types
export interface User {
    id: number
    name: string | null
    email: string | null
    username: string | null
    image: string | null
    address: string
    status: "active" | "inactive" | "pending"
    isAdmin: boolean
    twitterId: string | null
    website: string | null
  }
  
  export interface Beneficiary {
    id: number
    name: string
    email: string
    walletAddress: string
  }
  
  export interface TokenBalance {
    symbol: string
    mintAddress: string
    balance: number
    imageUrl?: string
    associatedTokenAddress: string | null
  }
  
  export interface UserDetails {
    beneficiaries: Beneficiary[]
    tokens: TokenBalance[]
    user: User
  }
  
  // Auth Types
  export interface AuthResponse {
    success: boolean
    message: string
    data: {
      user: User
      token: string
    }
    meta: {
      timestamp: string
    }
  }
  
  export interface UserDetailsResponse {
    success: boolean
    message: string
    data: UserDetails
    meta: {
      timestamp: string
    }
  }
  
  // Invoice Types
  export type InvoiceStatus = "0" | "1" | "2" // 0: Draft, 1: Sent, 2: Paid
  export type InvoiceType = "standard" | "donation" | "subscription" | "custom"
  export type InvoiceVisibility = "private" | "public"
  
  export interface InvoiceService {
    name: string
    description?: string
    quantity: number
    price: number
    total: number
  }
  
  export interface Invoice {
    id: string
    invoiceNo: string
    invoiceType: InvoiceType
    invoiceTitle: string
    invoiceImage?: string
    invoiceDescription?: string
    createdBy: {
      id: number
      address: string
    }
    invoiceStatus: InvoiceStatus
    invoiceCategory?: string
    invoiceMintAddress: string
    clientName: string
    clientWallet: string
    clientEmail?: string
    clientAddress: string
    isClientInformation: boolean
    isExpirable: boolean
    dueDate?: string
    discountCodes: any[]
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
    createdAt: string
    updatedAt: string
  }
  
  export interface InvoiceResponse {
    success: boolean
    message: string
    data: {
      invoice: Invoice
    }
    meta: {
      timestamp: string
    }
  }
  
  export interface InvoicesResponse {
    success: boolean
    message: string
    data: {
      invoices: Invoice[]
    }
    meta: {
      timestamp: string
    }
  }
  
  // Transaction Types
  export interface Transaction {
    signature: string
    slot: number
    blockTime: number | null
    sender: string | null
    recipient: string | null
    amount: number | null
    tokenMint: string | null
    error: string | null
  }
  
  export interface TransactionsResponse {
    success: boolean
    message: string
    data: {
      txn: Transaction[]
    }
    meta: {
      timestamp: string
    }
  }
  
  // Payment Types
  export type PaymentStatus = "pending" | "completed" | "failed" | "cancelled"
  export type ServiceType = "invoice" | "payroll" | "DAO" | "credit"
  
  export interface Payment {
    id: number
    paymentHash: string
    paymentDescription: string
    receiver: string
    sender: string
    paymentStatus: PaymentStatus
    totalAmount: string
    serviceType: ServiceType
    paymentDate: string
    paymentSignature: string
    mintAddress: string
    createdAt: string
    updatedAt: string
  }
  
  export interface PaymentResponse {
    success: boolean
    message: string
    data: {
      data: {
        id: string
        paymentHash: string
      }
    }
    meta: {
      timestamp: string
    }
  }
  
  export interface PaymentsResponse {
    success: boolean
    message: string
    data: {
      txn: Payment[]
    }
    meta: {
      timestamp: string
    }
  }
  
  export interface SinglePaymentResponse {
    success: boolean
    message: string
    data: {
      txn: Payment
    }
    meta: {
      timestamp: string
    }
  }
  
  // API Error Types
  export interface ApiError {
    success: boolean
    message: string
    errors?: string[]
    meta: {
      timestamp: string
    }
  }
  