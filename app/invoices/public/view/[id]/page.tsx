"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "motion/react"
import { useInvoice } from "@/hooks/use-invoices"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowUpRight, Download, Printer } from "lucide-react"
import { PublicInvoiceView } from "@/components/invoice/public-invoice-view"
import { useToast } from "@/components/ui/use-toast"

export default function PublicInvoicePage() {
  const params = useParams()
  const { toast } = useToast()
  const id = params?.id as string
  const { invoice, isLoading, refetch } = useInvoice(id)
  const [isPaying, setIsPaying] = useState(false)

  useEffect(() => {
    if (id) {
      refetch()
    }
  }, [id, refetch])

  const handlePay = async () => {
    setIsPaying(true)
    try {
      // Simulate payment process
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "Payment Initiated",
        description: "You will be redirected to complete the payment.",
      })
      // In a real app, this would redirect to a payment gateway or wallet connection
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPaying(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    toast({
      title: "Downloading PDF",
      description: "Your invoice PDF is being generated and downloaded.",
    })
    // In a real implementation, this would generate and download a PDF
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
          <p className="text-muted-foreground">The requested invoice could not be found or has expired.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10 mt-10">
      <motion.div
        className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoice {id}</h1>
          <p className="text-muted-foreground">
            From <span className="font-medium">SolPay</span> to{" "}
            <span className="font-medium">{invoice.clientName}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={handlePrint} className="print:hidden">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} className="print:hidden">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handlePay}
            disabled={isPaying}
            className="print:hidden bg-green-600 hover:bg-green-700"
          >
            {isPaying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Pay Now
              </>
            )}
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <PublicInvoiceView invoice={invoice} />
      </motion.div>
    </div>
  )
}
