"use client"

import React from "react"

import { useState } from "react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence } from "motion/react"
import {
  ArrowRight,
  Check,
  CreditCard,
  FileText,
  Loader2,
  User,
  Plus,
  Trash2,
  ClipboardList,
  Receipt,
  Eye,
  Calendar,
  Percent,
  Tag,
  CreditCardIcon,
  QrCode,
  Settings,
  Gift,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Stepper } from "@/components/ui/stepper"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useInvoices } from "@/hooks/use-invoices"
import { useFieldArray as useRHFFieldArray } from "react-hook-form"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import type { InvoiceType } from "@/types/invoice"
import { useAuth } from "../auth-provider"
import { formatCurrency } from "@/lib/utils"

// Define the schema for each step
const invoiceDetailsSchema = z.object({
  invoiceType: z.enum(["standard", "milestone", "subscription", "custom", "donation"]),
  invoiceTitle: z.string().min(1, "Title is required"),
  invoiceDescription: z.string().optional(),
  invoiceMintAddress: z.string().min(1, "Mint address is required"),
})

const clientDetailsSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  clientWallet: z.string().min(1, "Client wallet is required"),
  clientEmail: z.string().email().optional().or(z.literal("")),
  clientAddress: z.string().min(1, "Client address is required"),
  isClientInformation: z.boolean().default(true),
})

const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be at least 0"),
})

const servicesSchema = z.object({
  services: z.array(serviceSchema).min(1, "At least one service is required"),
})

const paymentOptionsSchema = z.object({
  isExpirable: z.boolean().default(false),
  dueDate: z.string().optional(),
  tipOptionEnabled: z.boolean().default(false),
  taxRate: z.number().min(0, "Tax rate must be at least 0").max(100, "Tax rate cannot exceed 100%"),
})

const visibilitySchema = z.object({
  invoiceVisibility: z.enum(["public", "private"]),
  autoEmailReceipt: z.boolean().default(false),
  QRcodeEnabled: z.boolean().default(true),
})

// Combine all schemas for the final validation
const createInvoiceSchema = z.object({
  ...invoiceDetailsSchema.shape,
  ...clientDetailsSchema.shape,
  ...servicesSchema.shape,
  ...paymentOptionsSchema.shape,
  ...visibilitySchema.shape,
  discountCodes: z.array(z.any()).optional(),
  subtotal: z.number(),
  discount: z.number(),
  taxAmount: z.number(),
  totalAmount: z.number(),
})

type CreateInvoiceData = z.infer<typeof createInvoiceSchema>

// Define the steps for our stepper
const steps = [
  { id: "invoice-details", label: "Invoice Details", description: "Basic invoice information" },
  { id: "client-details", label: "Client Details", description: "Who you're billing" },
  { id: "services", label: "Services", description: "What you're billing for" },
  { id: "payment-options", label: "Payment Options", description: "How you want to be paid" },
  { id: "visibility", label: "Visibility", description: "Who can see this invoice" },
  { id: "review", label: "Review", description: "Confirm and create" },
]

// Animation variants for page transitions
const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

// Define token type
interface Token {
  address: string
  symbol: string
  name: string
  icon: string
  bgColor: string
  iconText: string
}

// Create a list of payment tokens
const tokenBgColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-yellow-500",
  "bg-orange-500",
  "bg-red-500",
  "bg-teal-500",
  "bg-indigo-500",
]

export function CreateInvoiceForm({ onClose }: { onClose: () => void }) {
  const [activeStep, setActiveStep] = useState(0)
  const { createInvoice, isCreating } = useInvoices()
  const router = useRouter()

  const methods = useForm<CreateInvoiceData>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      invoiceType: "standard",
      invoiceTitle: "",
      invoiceDescription: "",
      invoiceMintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      clientName: "",
      clientWallet: "",
      clientEmail: "",
      clientAddress: "",
      isClientInformation: true,
      isExpirable: false,
      dueDate: "",
      tipOptionEnabled: false,
      invoiceVisibility: "private",
      autoEmailReceipt: false,
      QRcodeEnabled: true,
      services: [{ name: "", description: "", quantity: 1, price: 0 }],
      discountCodes: [],
      subtotal: 0,
      discount: 0,
      taxRate: 0,
      taxAmount: 0,
      totalAmount: 0,
    },
    mode: "onChange",
  })

  const { handleSubmit, trigger, watch, setValue } = methods
  const formValues = watch()

  // Calculate totals whenever services or tax rate changes
  const services = watch("services")
  const taxRate = watch("taxRate")

  React.useEffect(() => {
    const subtotal = services.reduce((sum, service) => sum + service.quantity * service.price, 0)
    const taxAmount = subtotal * (taxRate / 100)
    const totalAmount = subtotal + taxAmount

    setValue("subtotal", subtotal)
    setValue("taxAmount", taxAmount)
    setValue("totalAmount", totalAmount)
  }, [services, taxRate, setValue])

  const validateCurrentStep = async () => {
    let isValid = false

    switch (activeStep) {
      case 0:
        isValid = await trigger(["invoiceType", "invoiceTitle", "invoiceMintAddress"])
        break
      case 1:
        isValid = await trigger(["clientName", "clientWallet", "clientAddress"])
        break
      case 2:
        isValid = await trigger("services")
        break
      case 3:
        isValid = await trigger(["taxRate"])
        if (formValues.isExpirable) {
          isValid = isValid && (await trigger(["dueDate"]))
        }
        break
      case 4:
        isValid = await trigger(["invoiceVisibility"])
        break
      default:
        isValid = true
    }

    return isValid
  }

  const handleNext = async () => {
    const isValid = await validateCurrentStep()
    if (isValid) {
      setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))
    } else {
      toast.error("Validation Error", {
        description: "Please fill in all required fields correctly.",
      })
    }
  }

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0))
  }

  const handleCreateInvoice = async () => {
    try {
      const data = methods.getValues()
      const invoice = await createInvoice(data)
      toast("Invoice Created", {
        description: "Your invoice has been created successfully.",
      })
      // Redirect to the invoice view page
      router.push(`/invoices/view/${invoice.invoiceNo}`)
    } catch (error) {
      toast.error("Error", {
        description: "Failed to create invoice. Please try again.",
      })
    }
  }

  return (
    <FormProvider {...methods}>
      <div className="space-y-8">
        <Stepper steps={steps} activeStep={activeStep} className="px-1 mb-8" />

        <div className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {activeStep === 0 && <InvoiceDetailsStep />}
              {activeStep === 1 && <ClientDetailsStep />}
              {activeStep === 2 && <ServicesStep />}
              {activeStep === 3 && <PaymentOptionsStep />}
              {activeStep === 4 && <VisibilityStep />}
              {activeStep === 5 && <ReviewStep />}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between pt-6 border-t mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={activeStep === 0 ? onClose : handleBack}
              disabled={isCreating}
              className="px-6"
            >
              {activeStep === 0 ? "Cancel" : "Back"}
            </Button>

            <div className="flex gap-2">
              {activeStep < steps.length - 1 ? (
                <Button type="button" onClick={handleNext} className="px-6">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleCreateInvoice}
                  disabled={isCreating}
                  className="px-6 bg-green-600 hover:bg-green-700"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Invoice
                      <Check className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  )
}

// Step 1: Invoice Details
function InvoiceDetailsStep() {
  const {
    register,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useFormContext<CreateInvoiceData>()
  // Create a list of invoice types with name and value
  const invoiceTypes = [
    { value: "standard" as InvoiceType, name: "Standard Invoice", icon: Receipt },
    { value: "milestone" as InvoiceType, name: "Milestone Payment", icon: ClipboardList },
    { value: "subscription" as InvoiceType, name: "Subscription", icon: Calendar },
    { value: "donation" as InvoiceType, name: "Donation", icon: Gift },
    { value: "custom" as InvoiceType, name: "Custom", icon: Settings },
  ] as const
  // Create a list of payment tokens with random color and icon text
  const { tokens } = useAuth()
  const paymentTokens =
    tokens?.map((token) => {
      // Pick a random color for each token
      const bgColor = tokenBgColors[Math.floor(Math.random() * tokenBgColors.length)]
      // Use the first letter of the symbol as icon text, fallback to "?"
      const iconText = token.symbol?.[0]?.toUpperCase() || "?"
      return {
        currency: token.symbol,
        balance: token.balance,
        value: token.balance * 1, // Assuming 1:1 for simplicity
        icon: token.imageUrl,
        mintAddress: token.mintAddress,
        change: Math.random() > 0.5 ? `+${(Math.random() * 5).toFixed(2)}%` : `-${(Math.random() * 5).toFixed(2)}%`,
        changePositive: Math.random() > 0.5,
        address: token.mintAddress,
        symbol: token.symbol,
        bgColor,
        iconText,
      }
    }) || []

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Invoice Details</h2>
        <p className="text-muted-foreground">Enter the basic information for your invoice</p>
      </div>

      <Card className="border-muted/40 shadow-sm">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="invoiceType" className="text-sm font-medium">
                  Invoice Type
                </Label>
                <Select
                  value={watch("invoiceType")}
                  onValueChange={(value: "standard" | "milestone" | "subscription" | "custom") =>
                    setValue("invoiceType", value)
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select invoice type" />
                  </SelectTrigger>
                  <SelectContent>
                    {invoiceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center">
                          <type.icon className="mr-2 h-4 w-4 text-primary" />
                          <span>{type.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.invoiceType && <p className="text-sm text-destructive mt-1">{errors.invoiceType.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceMintAddress" className="text-sm font-medium">
                  Payment Token
                </Label>
                <Select
                  value={watch("invoiceMintAddress")}
                  onValueChange={(value) => setValue("invoiceMintAddress", value)}
                  defaultValue="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select payment token" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentTokens.map((token) => (
                      <SelectItem key={token.mintAddress} value={token.mintAddress}>
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded-full ${token} flex items-center justify-center mr-2 text-white text-xs font-bold`}
                          >
                            {token.iconText}
                          </div>
                          <span>{token.currency}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.invoiceMintAddress && (
                  <p className="text-sm text-destructive mt-1">{errors.invoiceMintAddress.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {/* Add the selected token address display */}
              {watch("invoiceMintAddress") && (
                <div className="mt-2 p-3 bg-primary/5 border border-primary/20 rounded-lg animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {(() => {
                        const selectedToken = paymentTokens.find(
                          (token) => token.address === watch("invoiceMintAddress"),
                        )
                        return (
                          <>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-white text-xs font-bold ${selectedToken?.bgColor}`}>
                              {selectedToken?.iconText}
                            </div>
                            <div>
                              <p className="font-medium">{selectedToken?.symbol}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">Selected Payment Token</p>
                            </div>
                          </>
                        )
                      })()}
                    </div>
                    <div className="flex items-center">
                      <div className="bg-muted/70 px-3 py-1.5 rounded font-mono text-xs overflow-hidden text-ellipsis max-w-[180px] text-green-400">
                        {watch("invoiceMintAddress").slice(0, 8)}...{watch("invoiceMintAddress").slice(-8)}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(watch("invoiceMintAddress"))
                          toast.success("Address copied", {
                            richColors: true,
                            description: "Token address copied to clipboard",
                          })
                        }}
                        className="ml-2 p-1.5 hover:bg-muted rounded-md"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-copy"
                        >
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceTitle" className="text-sm font-medium">
                Invoice Title
              </Label>
              <Input
                id="invoiceTitle"
                placeholder="e.g. Web Development Services"
                {...register("invoiceTitle")}
                className="h-11"
              />
              {errors.invoiceTitle && <p className="text-sm text-destructive mt-1">{errors.invoiceTitle.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceDescription" className="text-sm font-medium">
                Description (Optional)
              </Label>
              <Textarea
                id="invoiceDescription"
                placeholder="Provide additional details about this invoice"
                {...register("invoiceDescription")}
                className="min-h-[100px] resize-none"
              />
              {errors.invoiceDescription && (
                <p className="text-sm text-destructive mt-1">{errors.invoiceDescription.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Step 2: Client Details
function ClientDetailsStep() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<CreateInvoiceData>()
  const isClientInformation = watch("isClientInformation")

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Client Details</h2>
        <p className="text-muted-foreground">Enter information about the client you're billing</p>
      </div>

      <Card className="border-muted/40 shadow-sm">
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-lg">
            <Switch
              id="isClientInformation"
              checked={isClientInformation}
              onCheckedChange={(checked) => setValue("isClientInformation", checked)}
            />
            <Label htmlFor="isClientInformation" className="text-sm">
              Include client information on invoice
            </Label>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-sm font-medium">
                  Client Name
                </Label>
                <Input
                  id="clientName"
                  placeholder="e.g. Acme Corporation"
                  {...register("clientName")}
                  className="h-11"
                />
                {errors.clientName && <p className="text-sm text-destructive mt-1">{errors.clientName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientEmail" className="text-sm font-medium">
                  Client Email (Optional)
                </Label>
                <Input
                  id="clientEmail"
                  type="email"
                  placeholder="e.g. client@example.com"
                  {...register("clientEmail")}
                  className="h-11"
                />
                {errors.clientEmail && <p className="text-sm text-destructive mt-1">{errors.clientEmail.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientWallet" className="text-sm font-medium">
                Client Wallet Address
              </Label>
              <Input
                id="clientWallet"
                placeholder="e.g. 8xrt6LGom3xRwNKgdAXakJQ9Bvmw4hEQFo7ne7Q9RyPd"
                {...register("clientWallet")}
                className="h-11 font-mono"
              />
              {errors.clientWallet && <p className="text-sm text-destructive mt-1">{errors.clientWallet.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientAddress" className="text-sm font-medium">
                Client Address
              </Label>
              <Textarea
                id="clientAddress"
                placeholder="Enter client's physical or business address"
                {...register("clientAddress")}
                className="min-h-[100px] resize-none"
              />
              {errors.clientAddress && <p className="text-sm text-destructive mt-1">{errors.clientAddress.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Step 3: Services
function ServicesStep() {
  const {
    control,
    formState: { errors },
    watch,
    register,
  } = useFormContext<CreateInvoiceData>()
  const { fields, append, remove } = useRHFFieldArray({
    control,
    name: "services",
  })

  const services = watch("services")
  const subtotal = services.reduce((sum, service) => sum + service.quantity * service.price, 0)

  // Get selected mint address and tokens
  const invoiceMintAddress = watch("invoiceMintAddress")
  const { tokens } = useAuth()
  const selectedToken = tokens?.find(token => token.mintAddress === invoiceMintAddress)
  const currencySymbol = selectedToken?.symbol || "$"

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Services</h2>
        <p className="text-muted-foreground">Add the services or items you're billing for</p>
      </div>

      <div className="space-y-6">
        <div className="bg-muted/30 rounded-lg p-4 border border-muted">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium flex items-center">
              <ClipboardList className="mr-2 h-4 w-4 text-primary" />
              Services List
            </h3>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {fields.length} {fields.length === 1 ? "item" : "items"}
            </Badge>
          </div>

          <div className="space-y-2 mb-4">
            {fields.length > 0 ? (
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium">Service</th>
                      <th className="text-right p-3 font-medium w-20">Qty</th>
                      <th className="text-right p-3 font-medium w-28">Price</th>
                      <th className="text-right p-3 font-medium w-28">Total</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {fields.map((field, index) => {
                      const service = services[index]
                      const total = service?.quantity * service?.price || 0

                      return (
                        <motion.tr
                          key={field.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-card"
                        >
                          <td className="p-3">
                            <div className="font-medium">{service?.name || "Unnamed Service"}</div>
                            {service?.description && (
                              <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                {service.description}
                              </div>
                            )}
                          </td>
                          <td className="p-3 text-right">{service?.quantity || 0}</td>
                          <td className="p-3 text-right">{formatCurrency(service?.price, currencySymbol) || "0.00"}</td>
                          <td className="p-3 text-right font-medium">{formatCurrency(total, currencySymbol)}</td>
                          <td className="p-3">
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                className="h-7 w-7 rounded-full hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </td>
                        </motion.tr>
                      )
                    })}
                  </tbody>
                  <tfoot className="bg-muted/30">
                    <tr>
                      <td colSpan={3} className="p-3 text-right font-medium">
                        Subtotal:
                      </td>
                      <td className="p-3 text-right font-medium">{formatCurrency(subtotal, currencySymbol)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No services added yet. Add your first service below.
              </div>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => append({ name: "", description: "", quantity: 1, price: 0 })}
          >
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        </div>

        {/* Service Edit Form */}
        <AnimatePresence>
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-muted/40 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/20 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center">
                      <Tag className="mr-2 h-4 w-4 text-primary" />
                      Service {index + 1}
                    </CardTitle>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor={`services.${index}.name`} className="text-sm font-medium">
                      Service Name
                    </Label>
                    <Input
                      id={`services.${index}.name`}
                      placeholder="e.g. Web Design"
                      {...register(`services.${index}.name` as const)}
                      className="h-11"
                    />
                    {errors.services?.[index]?.name && (
                      <p className="text-sm text-destructive mt-1">{errors.services[index]?.name?.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`services.${index}.description`} className="text-sm font-medium">
                      Description (Optional)
                    </Label>
                    <Textarea
                      id={`services.${index}.description`}
                      placeholder="Describe the service"
                      {...register(`services.${index}.description` as const)}
                      className="min-h-[80px] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`services.${index}.quantity`} className="text-sm font-medium">
                        Quantity
                      </Label>
                      <div className="relative">
                        <Input
                          id={`services.${index}.quantity`}
                          type="number"
                          min="1"
                          className="h-11 pl-8"
                          {...register(`services.${index}.quantity` as const, {
                            valueAsNumber: true,
                          })}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">#</span>
                      </div>
                      {errors.services?.[index]?.quantity && (
                        <p className="text-sm text-destructive mt-1">{errors.services[index]?.quantity?.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`services.${index}.price`} className="text-sm font-medium">
                        Price
                      </Label>
                      <div className="relative">
                        <Input
                          id={`services.${index}.price`}
                          type="number"
                          min="0"
                          step="0.01"
                          className="h-11 pl-8"
                          {...register(`services.${index}.price` as const, {
                            valueAsNumber: true,
                          })}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      </div>
                      {errors.services?.[index]?.price && (
                        <p className="text-sm text-destructive mt-1">{errors.services[index]?.price?.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/10 border-t px-6 py-3">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-sm text-muted-foreground">Service Total:</span>
                    <span className="font-medium">
                      {formatCurrency(services[index]?.quantity * services[index]?.price, currencySymbol)}

                    </span>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Step 4: Payment Options
function PaymentOptionsStep() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<CreateInvoiceData>()
  const isExpirable = watch("isExpirable")
  const tipOptionEnabled = watch("tipOptionEnabled")
  const subtotal = watch("subtotal")
  const taxRate = watch("taxRate")
  const taxAmount = subtotal * (taxRate / 100)
  const totalAmount = subtotal + taxAmount

  const invoiceMintAddress = watch("invoiceMintAddress")
  const { tokens } = useAuth()
  const selectedToken = tokens?.find(token => token.mintAddress === invoiceMintAddress)
  const currencySymbol = selectedToken?.symbol || "$"

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Payment Options</h2>
        <p className="text-muted-foreground">Configure how and when you want to be paid</p>
      </div>

      <Card className="border-muted/40 shadow-sm">
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-lg">
                <Switch
                  id="isExpirable"
                  checked={isExpirable}
                  onCheckedChange={(checked) => setValue("isExpirable", checked)}
                />
                <Label htmlFor="isExpirable" className="text-sm">
                  Set expiration date
                </Label>
              </div>

              {isExpirable && (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Label htmlFor="dueDate" className="text-sm font-medium">
                    Due Date
                  </Label>
                  <div className="relative">
                    <Input id="dueDate" type="date" {...register("dueDate")} className="h-11 pl-10" />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  {errors.dueDate && <p className="text-sm text-destructive mt-1">{errors.dueDate.message}</p>}
                </motion.div>
              )}

              <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-lg">
                <Switch
                  id="tipOptionEnabled"
                  checked={tipOptionEnabled}
                  onCheckedChange={(checked) => setValue("tipOptionEnabled", checked)}
                />
                <Label htmlFor="tipOptionEnabled" className="text-sm">
                  Enable tip option
                </Label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taxRate" className="text-sm font-medium">
                  Tax Rate (%)
                </Label>
                <div className="relative">
                  <Input
                    id="taxRate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    className="h-11 pl-10"
                    {...register("taxRate", { valueAsNumber: true })}
                  />
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                {errors.taxRate && <p className="text-sm text-destructive mt-1">{errors.taxRate.message}</p>}
              </div>

              <Card className="border-muted bg-muted/20">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal, currencySymbol)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax ({taxRate}%):</span>
                    <span>{formatCurrency(taxAmount, currencySymbol)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>{formatCurrency(totalAmount, currencySymbol)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Step 5: Visibility
function VisibilityStep() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<CreateInvoiceData>()
  const invoiceVisibility = watch("invoiceVisibility")
  const autoEmailReceipt = watch("autoEmailReceipt")
  const QRcodeEnabled = watch("QRcodeEnabled")

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Visibility & Sharing</h2>
        <p className="text-muted-foreground">Configure who can see this invoice and how it's shared</p>
      </div>

      <Card className="border-muted/40 shadow-sm">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceVisibility" className="text-sm font-medium">
                Invoice Visibility
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${invoiceVisibility === "private"
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-muted-foreground/30"
                    }`}
                  onClick={() => setValue("invoiceVisibility", "private")}
                >
                  <div className="flex items-start">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 mt-0.5 ${invoiceVisibility === "private" ? "border-primary" : "border-muted-foreground/50"
                        }`}
                    >
                      {invoiceVisibility === "private" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 rounded-full bg-primary"
                        />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">Private</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Only you and the client can view this invoice
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${invoiceVisibility === "public"
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-muted-foreground/30"
                    }`}
                  onClick={() => setValue("invoiceVisibility", "public")}
                >
                  <div className="flex items-start">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 mt-0.5 ${invoiceVisibility === "public" ? "border-primary" : "border-muted-foreground/50"
                        }`}
                    >
                      {invoiceVisibility === "public" && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 rounded-full bg-primary"
                        />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">Public</h4>
                      <p className="text-sm text-muted-foreground mt-1">Anyone with the link can view this invoice</p>
                    </div>
                  </div>
                </div>
              </div>
              {errors.invoiceVisibility && (
                <p className="text-sm text-destructive mt-1">{errors.invoiceVisibility.message}</p>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Additional Options</h3>

              <div className="flex items-center justify-between p-3 rounded-lg border border-muted hover:border-muted-foreground/30 transition-all">
                <div className="flex items-center">
                  <CreditCardIcon className="h-4 w-4 text-primary mr-3" />
                  <div>
                    <Label htmlFor="autoEmailReceipt" className="font-medium cursor-pointer">
                      Automatic Email Receipt
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Send a receipt via email after payment is received
                    </p>
                  </div>
                </div>
                <Switch
                  id="autoEmailReceipt"
                  checked={autoEmailReceipt}
                  onCheckedChange={(checked) => setValue("autoEmailReceipt", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-muted hover:border-muted-foreground/30 transition-all">
                <div className="flex items-center">
                  <QrCode className="h-4 w-4 text-primary mr-3" />
                  <div>
                    <Label htmlFor="QRcodeEnabled" className="font-medium cursor-pointer">
                      QR Code for Payment
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">Generate a QR code for easy payment scanning</p>
                  </div>
                </div>
                <Switch
                  id="QRcodeEnabled"
                  checked={QRcodeEnabled}
                  onCheckedChange={(checked) => setValue("QRcodeEnabled", checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Step 6: Review
function ReviewStep() {
  const { watch } = useFormContext<CreateInvoiceData>()
  const formValues = watch()
  // Create a list of payment tokens with random color and icon text
  const { tokens } = useAuth()
  const paymentTokens =
    tokens?.map((token) => {
      // Pick a random color for each token
      const bgColor = tokenBgColors[Math.floor(Math.random() * tokenBgColors.length)]
      // Use the first letter of the symbol as icon text, fallback to "?"
      const iconText = token.symbol?.[0]?.toUpperCase() || "?"
      return {
      currency: token.symbol,
        balance: token.balance,
        value: token.balance * 1, // Assuming 1:1 for simplicity
        icon: token.imageUrl,
        mintAddress: token.mintAddress,
        change: Math.random() > 0.5 ? `+${(Math.random() * 5).toFixed(2)}%` : `-${(Math.random() * 5).toFixed(2)}%`,
        changePositive: Math.random() > 0.5,
        address: token.mintAddress,
        symbol: token.symbol,
        bgColor,
        iconText,
      }
    }) || []
  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Review Invoice</h2>
        <p className="text-muted-foreground">Review your invoice details before creating</p>
      </div>

      <div className="space-y-6">
        <Card className="border-muted/40 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/20 pb-3">
            <CardTitle className="text-base flex items-center">
              <FileText className="mr-2 h-4 w-4 text-primary" />
              Invoice Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="text-muted-foreground">Invoice Type</div>
                <div className="font-medium">{formValues.invoiceType}</div>
              </div>

              <div className="space-y-1">
                <div className="text-muted-foreground">Payment Token</div>
                <div className="font-medium flex items-center">
                  {(() => {
                    const selectedToken = paymentTokens.find((token) => token.address === formValues.invoiceMintAddress)
                    return (
                      <>
                        <div
                          className={`w-4 h-4 rounded-full ${selectedToken?.bgColor} flex items-center justify-center mr-2 text-white text-xs font-bold`}
                        >
                          {selectedToken?.iconText}
                        </div>
                        {selectedToken?.symbol}
                      </>
                    )
                  })()}
                </div>
              </div>

              <div className="col-span-2 space-y-1">
                <div className="text-muted-foreground">Title</div>
                <div className="font-medium">{formValues.invoiceTitle}</div>
              </div>

              {formValues.invoiceDescription && (
                <div className="col-span-2 space-y-1">
                  <div className="text-muted-foreground">Description</div>
                  <div>{formValues.invoiceDescription}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-muted/40 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/20 pb-3">
            <CardTitle className="text-base flex items-center">
              <User className="mr-2 h-4 w-4 text-primary" />
              Client Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="text-muted-foreground">Client Name</div>
                <div className="font-medium">{formValues.clientName}</div>
              </div>

              {formValues.clientEmail && (
                <div className="space-y-1">
                  <div className="text-muted-foreground">Email</div>
                  <div className="font-medium">{formValues.clientEmail}</div>
                </div>
              )}

              <div className="col-span-2 space-y-1">
                <div className="text-muted-foreground">Wallet Address</div>
                <div className="font-mono bg-muted/30 p-2 rounded-md text-xs overflow-auto">
                  {formValues.clientWallet}
                </div>
              </div>

              <div className="col-span-2 space-y-1">
                <div className="text-muted-foreground">Address</div>
                <div>{formValues.clientAddress}</div>
              </div>

              <div className="col-span-2 space-y-1">
                <div className="text-muted-foreground">Show on Invoice</div>
                <div>{formValues.isClientInformation ? "Yes" : "No"}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-muted/40 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/20 pb-3">
            <CardTitle className="text-base flex items-center">
              <ClipboardList className="mr-2 h-4 w-4 text-primary" />
              Services
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left p-4 font-medium">Service</th>
                  <th className="text-right p-4 font-medium">Quantity</th>
                  <th className="text-right p-4 font-medium">Price</th>
                  <th className="text-right p-4 font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {formValues.services.map((service, index) => (
                  <tr key={index}>
                    <td className="p-4">
                      <div className="font-medium">{service.name}</div>
                      {service.description && (
                        <div className="text-xs text-muted-foreground mt-1">{service.description}</div>
                      )}
                    </td>
                    <td className="p-4 text-right">{service.quantity}</td>
                    <td className="p-4 text-right">${service.price.toFixed(2)}</td>
                    <td className="p-4 text-right font-medium">${(service.quantity * service.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/20">
                <tr>
                  <td colSpan={3} className="p-4 text-right font-medium">
                    Subtotal:
                  </td>
                  <td className="p-4 text-right font-medium">${formValues.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="p-4 text-right font-medium">
                    Tax ({formValues.taxRate}%):
                  </td>
                  <td className="p-4 text-right font-medium">${formValues.taxAmount.toFixed(2)}</td>
                </tr>
                <tr className="bg-muted/40">
                  <td colSpan={3} className="p-4 text-right font-medium">
                    Total:
                  </td>
                  <td className="p-4 text-right font-medium text-lg">${formValues.totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-muted/40 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/20 pb-3">
              <CardTitle className="text-base flex items-center">
                <CreditCard className="mr-2 h-4 w-4 text-primary" />
                Payment Options
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expiration:</span>
                  <span>{formValues.isExpirable ? "Yes" : "No"}</span>
                </div>

                {formValues.isExpirable && formValues.dueDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Due Date:</span>
                    <span>{formValues.dueDate}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tip Option:</span>
                  <span>{formValues.tipOptionEnabled ? "Enabled" : "Disabled"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax Rate:</span>
                  <span>{formValues.taxRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-muted/40 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/20 pb-3">
              <CardTitle className="text-base flex items-center">
                <Eye className="mr-2 h-4 w-4 text-primary" />
                Visibility & Sharing
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Visibility:</span>
                  <Badge variant={formValues.invoiceVisibility === "public" ? "outline" : "secondary"}>
                    {formValues.invoiceVisibility === "public" ? "Public" : "Private"}
                  </Badge>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Auto Email Receipt:</span>
                  <span>{formValues.autoEmailReceipt ? "Yes" : "No"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">QR Code:</span>
                  <span>{formValues.QRcodeEnabled ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
