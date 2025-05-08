"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "motion/react"
import { useInvoice } from "@/hooks/use-invoices"
import { InvoiceView } from "@/components/invoice/invoice-view"
import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function InvoiceViewPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const id = params?.id as string
  const { invoice, isLoading, refetch } = useInvoice(id)
  const [isActivating, setIsActivating] = useState(false)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (id) {
      refetch()
    }
  }, [id, refetch])

  const handleActivate = async () => {
    setIsActivating(true)
    try {
      // Simulate API call to activate invoice
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsActive(true)
      toast({
        title: "Invoice Activated",
        description: "Your invoice is now active and ready to be shared.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to activate invoice. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsActivating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading invoice details...</p>
        </div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center gap-4 py-12">
          <h2 className="text-2xl font-bold">Invoice Not Found</h2>
          <p className="text-muted-foreground">The requested invoice could not be found.</p>
          <Button onClick={() => router.push("/invoices")}>Return to Invoices</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <motion.div
        className="flex items-center gap-2 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="space-y-1">
          <Breadcrumb segments={[{ name: "Invoices", href: "/invoices" }, { name: `Invoice ${id}` }]} />
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Invoice {id}</h1>
            {!isActive && (
              <Button onClick={handleActivate} disabled={isActivating} className="bg-green-600 hover:bg-green-700">
                {isActivating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Activating...
                  </>
                ) : (
                  "Activate Invoice"
                )}
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <InvoiceView invoice={invoice} isActive={isActive} />
      </motion.div>
    </div>
  )
}
