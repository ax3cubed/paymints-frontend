"use client"

import { useState, useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { motion } from "motion/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, Printer, Share2, Copy, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"

export default function InvoicePreviewPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const invoiceRef = useRef<HTMLDivElement>(null)

  // Mock invoice data - in a real app, this would be fetched from an API
  const invoice = {
    id: params.id,
    number: "INV-0025",
    date: "April 15, 2025",
    dueDate: "April 30, 2025",
    status: "Draft",
    sender: {
      name: "Alex Chen",
      company: "Alex Chen Consulting",
      address: "123 Blockchain Street, San Francisco, CA 94107",
      email: "alex@example.com",
      phone: "+1 (555) 123-4567",
      walletAddress: "8xj7dkQcD9zw6rEcR7uVX3pWfxJ7Vd5U8QJMpzKUH2Zq",
    },
    recipient: {
      name: "CryptoDAO Collective",
      address: "456 Web3 Avenue, New York, NY 10001",
      email: "treasury@cryptodao.org",
      walletAddress: "5FHg8c7QUKpL9LWM1JZbVxPPBEXPxBxXXXXXXXXXXXXXXXX",
    },
    items: [
      {
        description: "Smart Contract Development",
        quantity: 40,
        unit: "hours",
        rate: 125,
        amount: 5000,
      },
      {
        description: "UI/UX Design for DAO Dashboard",
        quantity: 25,
        unit: "hours",
        rate: 100,
        amount: 2500,
      },
      {
        description: "Security Audit",
        quantity: 1,
        unit: "project",
        rate: 1500,
        amount: 1500,
      },
    ],
    subtotal: 9000,
    discount: 500,
    tax: 0,
    total: 8500,
    notes: "Payment due within 15 days. Please make payment in USDC to the wallet address listed above.",
    paymentTerms: "Net 15",
    currency: "USDC",
  }

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  })

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast({
      title: "Copied to clipboard",
      description: "The invoice link has been copied to your clipboard.",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const shareInvoice = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Invoice ${invoice.number}`,
          text: `Invoice from ${invoice.sender.name} for ${invoice.currency} ${invoice.total}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error))
    } else {
      copyToClipboard(window.location.href)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/dashboard/invoicing">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoice Preview</h1>
            <p className="text-muted-foreground">Review your invoice before sending</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={() => copyToClipboard(window.location.href)}>
            {copied ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            Copy Link
          </Button>
          <Button variant="outline" onClick={shareInvoice}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto"
      >
        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            <div ref={invoiceRef} className="p-8 bg-white text-black">
              {/* Invoice Header */}
              <div className="flex flex-col md:flex-row justify-between items-start mb-8">
                <div>
                  <div className="flex items-center mb-4">
                    <Image src="/images/paymint-logo.png" alt="Paymint Logo" width={40} height={40} className="mr-2" />
                    <span className="text-2xl font-bold text-purple-600">Paymint</span>
                  </div>
                  <div className="text-sm">
                    <p className="font-bold">{invoice.sender.company}</p>
                    <p>{invoice.sender.address}</p>
                    <p>{invoice.sender.email}</p>
                    <p>{invoice.sender.phone}</p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <h1 className="text-2xl font-bold mb-2">INVOICE</h1>
                  <div className="text-sm">
                    <p>
                      <span className="font-semibold">Invoice Number:</span> {invoice.number}
                    </p>
                    <p>
                      <span className="font-semibold">Date:</span> {invoice.date}
                    </p>
                    <p>
                      <span className="font-semibold">Due Date:</span> {invoice.dueDate}
                    </p>
                    <div className="mt-2">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bill To / Ship To */}
              <div className="flex flex-col md:flex-row justify-between mb-8">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-sm font-bold uppercase text-gray-500 mb-2">Bill To</h2>
                  <div className="text-sm">
                    <p className="font-bold">{invoice.recipient.name}</p>
                    <p>{invoice.recipient.address}</p>
                    <p>{invoice.recipient.email}</p>
                  </div>
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase text-gray-500 mb-2">Payment Details</h2>
                  <div className="text-sm">
                    <p>
                      <span className="font-semibold">Currency:</span> {invoice.currency}
                    </p>
                    <p>
                      <span className="font-semibold">Terms:</span> {invoice.paymentTerms}
                    </p>
                    <p className="font-semibold mt-1">Wallet Address:</p>
                    <p className="text-xs break-all">{invoice.sender.walletAddress}</p>
                  </div>
                </div>
              </div>

              {/* Invoice Items */}
              <div className="mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 text-left">Description</th>
                      <th className="py-2 px-4 text-right">Quantity</th>
                      <th className="py-2 px-4 text-right">Rate</th>
                      <th className="py-2 px-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="py-3 px-4">{item.description}</td>
                        <td className="py-3 px-4 text-right">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {invoice.currency} {item.rate.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {invoice.currency} {item.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Invoice Summary */}
              <div className="flex justify-end mb-8">
                <div className="w-full md:w-64">
                  <div className="flex justify-between py-2">
                    <span className="font-semibold">Subtotal:</span>
                    <span>
                      {invoice.currency} {invoice.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-semibold">Discount:</span>
                    <span>
                      {invoice.currency} {invoice.discount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-semibold">Tax:</span>
                    <span>
                      {invoice.currency} {invoice.tax.toFixed(2)}
                    </span>
                  </div>
                  <Separator className="my-2 bg-gray-300" />
                  <div className="flex justify-between py-2 font-bold">
                    <span>Total:</span>
                    <span>
                      {invoice.currency} {invoice.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-8">
                <h2 className="text-sm font-bold uppercase text-gray-500 mb-2">Notes</h2>
                <p className="text-sm text-gray-600">{invoice.notes}</p>
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-gray-500 mt-12">
                <p>This invoice was generated by Paymint - The Future of Work Finance</p>
                <p className="mt-1">Secured by Solana blockchain - Transaction ID will be provided upon payment</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex justify-center gap-4 mt-8">
        <Button variant="outline">Edit Invoice</Button>
        <Button>Finalize & Send</Button>
      </div>
    </div>
  )
}
