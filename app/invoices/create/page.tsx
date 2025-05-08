"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { CreateInvoiceForm } from "@/components/invoice/create-invoice-form"
import { motion } from "motion/react"

export default function CreateInvoicePage() {
  const router = useRouter()

  const handleClose = () => {
    router.push("/invoices")
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
          <Breadcrumb segments={[{ name: "Invoices", href: "/invoices" }, { name: "Create Invoice" }]} />
          <h1 className="text-3xl font-bold tracking-tight">Create Invoice</h1>
          <p className="text-muted-foreground">Create a new invoice to send to your client</p>
        </div>
      </motion.div>

      <motion.div
        className="max-w-5xl mx-auto bg-card rounded-xl border shadow-sm p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <CreateInvoiceForm onClose={handleClose} />
      </motion.div>
    </div>
  )
}
