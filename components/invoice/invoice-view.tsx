"use client"

import { useState, useRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowUpRight,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Mail,
  Printer,
  QrCode,
  Share2,
  User,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"
import { Invoice } from "@/types/invoice"
import { handleDownloadPDF } from "@/lib/pdf-template"

interface InvoiceViewProps {
  invoice: Invoice
  isActive: boolean
}

export function InvoiceView({ invoice, isActive }: InvoiceViewProps) {
  const { toast } = useToast()
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [isQrCodeDialogOpen, setIsQrCodeDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const qrRef = useRef<SVGSVGElement | null>(null)


  
  const isInvoiceActive = isActive || invoice.invoiceStatus === "1"

  // Generate a public link for the invoice
  const publicLink = `${window.location.origin}/invoices/public/view/${invoice.invoiceNo}`

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast({
      title: "Copied to clipboard",
      description: "The link has been copied to your clipboard.",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    handleDownloadPDF(invoice)
    toast({
      title: "PDF Downloaded",
      description: "Your invoice PDF has been generated and downloaded.",
    })
  }
  const handleSendEmail = () => {
    toast({
      title: "Email Sent",
      description: "The invoice has been sent to the client's email.",
    })
    // In a real implementation, this would send an email
  }

  const handleDownloadQrCode = () => {
    if (!qrRef.current) return
    const svg = qrRef.current.outerHTML
    const blob = new Blob([svg], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `invoice-qr-code-${invoice.id}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Status Banner */}
      {(isInvoiceActive) ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
            <div>
              <h3 className="font-medium text-green-800 dark:text-green-300">Invoice Active</h3>
              <p className="text-sm text-green-700 dark:text-green-400">
                This invoice is active and can be shared with your client.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-green-300 dark:border-green-700 text-green-700 dark:text-green-400"
              onClick={() => setIsShareDialogOpen(true)}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-green-300 dark:border-green-700 text-green-700 dark:text-green-400"
              onClick={() => setIsQrCodeDialogOpen(true)}
            >
              <QrCode className="mr-2 h-4 w-4" />
              QR Code
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4 flex items-center">
          <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-3" />
          <div>
            <h3 className="font-medium text-amber-800 dark:text-amber-300">Invoice Draft</h3>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              This invoice is in draft mode. Activate it to make it available to your client.
            </p>
          </div>
        </div>
      )}

      {/* Invoice Actions */}
      <div className="flex flex-wrap gap-3 print:hidden">
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        <Button variant="outline" size="sm" onClick={handleSendEmail}>
          <Mail className="mr-2 h-4 w-4" />
          Send Email
        </Button>
        {(isInvoiceActive) && (
          <>
            <Button variant="outline" size="sm" onClick={() => setIsShareDialogOpen(true)}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsQrCodeDialogOpen(true)}>
              <QrCode className="mr-2 h-4 w-4" />
              QR Code
            </Button>
          </>
        )}
      </div>

      {/* Invoice Document */}
      <div className="bg-white dark:bg-slate-900 border rounded-lg shadow-sm overflow-hidden print:shadow-none print:border-none">
        {/* Invoice Header */}
        <div className="p-8 border-b">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  S
                </div>
                <h2 className="text-2xl font-bold">SolPay</h2>
              </div>
              <p className="text-muted-foreground">123 Blockchain Street</p>
              <p className="text-muted-foreground">Crypto City, CC 12345</p>
              <p className="text-muted-foreground">contact@solpay.com</p>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-bold text-primary mb-2">INVOICE</h1>
              <p className="font-medium"># {invoice.id}</p>
              <p className="text-muted-foreground">Issue Date: {new Date().toLocaleDateString()}</p>
              {invoice.dueDate && (
                <p className="text-muted-foreground">Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
              )}
              <Badge
                variant="outline"
                className={
                  (isInvoiceActive)
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mt-2"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 mt-2"
                }
              >
                {(isInvoiceActive) ? "Active" : "Draft"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-8">
          {/* Client Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <User className="mr-2 h-4 w-4 text-primary" />
              Bill To
            </h3>
            <div className="bg-muted/20 p-4 rounded-lg">
              <p className="font-medium">{invoice.clientName}</p>
              <p className="text-muted-foreground">{invoice.clientAddress}</p>
              {invoice.clientEmail && <p className="text-muted-foreground">{invoice.clientEmail}</p>}
              <p className="text-xs font-mono mt-2 text-muted-foreground">{invoice.clientWallet}</p>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FileText className="mr-2 h-4 w-4 text-primary" />
              Invoice Details
            </h3>
            <div className="bg-muted/20 p-4 rounded-lg">
              <p>
                <span className="font-medium">Title:</span> {invoice.invoiceTitle}
              </p>
              {invoice.invoiceDescription && (
                <p className="mt-2">
                  <span className="font-medium">Description:</span> {invoice.invoiceDescription}
                </p>
              )}
              <p className="mt-2">
                <span className="font-medium">Payment Token:</span>{" "}
                {invoice.invoiceMintAddress === "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
                  ? "USDC"
                  : invoice.invoiceMintAddress === "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
                    ? "USDT"
                    : "SOL"}
              </p>
              <p className="mt-2">
                <span className="font-medium">Invoice Type:</span> {invoice.invoiceType}
              </p>
            </div>
          </div>

          {/* Services Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FileText className="mr-2 h-4 w-4 text-primary" />
              Services
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="border px-4 py-2 text-left">Item</th>
                    <th className="border px-4 py-2 text-right">Quantity</th>
                    <th className="border px-4 py-2 text-right">Price</th>
                    <th className="border px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.services.map((service: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="border px-4 py-3">
                        <div className="font-medium">{service.name}</div>
                        {service.description && (
                          <div className="text-xs text-muted-foreground mt-1">{service.description}</div>
                        )}
                      </td>
                      <td className="border px-4 py-3 text-right">{service.quantity}</td>
                      <td className="border px-4 py-3 text-right">{formatCurrency(service.unitPrice, invoice.currency ? invoice.currency : "$")}</td>
                      <td className="border px-4 py-3 text-right font-medium">
                        {formatCurrency((service.quantity * service.unitPrice), invoice.currency ? invoice.currency : "$")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-4 flex flex-col items-end">
              <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(invoice.subtotal, invoice.currency ? invoice.currency : "$")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax ({invoice.taxRate}%):</span>
                  <span>{formatCurrency(invoice.taxAmount, invoice.currency ? invoice.currency : "$")}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total:</span>

                  <span>{formatCurrency(invoice.totalAmount, invoice.currency ? invoice.currency : "$")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <ArrowUpRight className="mr-2 h-4 w-4 text-primary" />
              Payment Instructions
            </h3>
            <div className="bg-muted/20 p-4 rounded-lg">
              <p>
                Please make payment to the following wallet address using{" "}
                {invoice.currency}
                :
              </p>
              <div className="mt-2 p-3 bg-muted/40 rounded-md font-mono text-sm break-all">
                {invoice.createdBy?.address || "Unknown Wallet Address"}
              </div>
              {invoice.isExpirable && invoice.dueDate && (
                <div className="mt-4 flex items-center text-amber-600 dark:text-amber-400">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>
                    Payment due by <strong>{new Date(invoice.dueDate).toLocaleDateString()}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Notes & Terms */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Notes & Terms</h3>
            <div className="bg-muted/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Thank you for your business. Payment is expected within {invoice.dueDate ? "the due date" : "30 days"}{" "}
                of invoice receipt. Please make payment via the provided wallet address.
              </p>
            </div>
          </div>
        </div>

        {/* Invoice Footer */}
        <div className="p-8 border-t bg-muted/20 text-center">
          <p className="text-sm text-muted-foreground">
            This invoice was generated by SolPay. For questions, contact support@solpay.com
          </p>
          {isInvoiceActive && invoice.invoiceTxHash && (
            <div className="mt-4">
              <a
                href={`https://explorer.solana.com/tx/${invoice.invoiceTxHash}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-primary/80 text-sm"
              >
                View Transaction on Solana Explorer
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent
          className="sm:max-w-md w-full max-w-lg mx-auto p-6 bg-background rounded-lg shadow-lg flex flex-col gap-4"
        >
          <DialogHeader>
            <DialogTitle>Share Invoice</DialogTitle>
            <DialogDescription>Share this invoice with your client via link, email, or QR code.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Public Link</h4>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-md border bg-muted/50 px-3 py-2 text-sm font-mono overflow-auto">
                  {publicLink}
                </div>
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(publicLink)} className="shrink-0">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Tabs defaultValue="link" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="link">Link</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="qr">QR Code</TabsTrigger>
              </TabsList>
              <TabsContent value="link" className="space-y-4 pt-4">
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="justify-start" onClick={() => copyToClipboard(publicLink)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Link
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <a href={publicLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open in New Tab
                    </a>
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="email" className="space-y-4 pt-4">
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="justify-start" onClick={handleSendEmail}>
                    <Mail className="mr-2 h-4 w-4" />
                    Send to Client
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    asChild
                    onClick={() => {
                      const subject = `Invoice ${invoice.id} from SolPay`
                      const body = `You can view your invoice here: ${publicLink}`
                      window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
                    }}
                  >
                    <a href="#">
                      <Mail className="mr-2 h-4 w-4" />
                      Open in Email Client
                    </a>
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="qr" className="pt-4">
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <QRCodeSVG
                      value={publicLink}
                      size={200}
                      level="H"
                      marginSize={2}
                      imageSettings={{
                        src: "/placeholder.svg?key=vnm7p",
                        height: 24,
                        width: 20,
                        excavate: true,
                      }}
                    />
                  </div>
                  <Button variant="outline" onClick={() => setIsQrCodeDialogOpen(true)}>
                    <QrCode className="mr-2 h-4 w-4" />
                    View Full Size
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button variant="secondary" onClick={() => setIsShareDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={isQrCodeDialogOpen} onOpenChange={setIsQrCodeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invoice QR Code</DialogTitle>
            <DialogDescription>Scan this QR code to view the invoice and make payment.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="bg-white p-6 rounded-lg shadow-inner">
              <QRCodeSVG
                ref={qrRef}
                value={publicLink}
                size={250}
                level="H"
                includeMargin
                imageSettings={{
                  src: "/placeholder.svg?key=vnm7p",
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </div>

            <div className="mt-4 w-full">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Invoice #{invoice.id}</p>
                <p className="text-sm font-medium">  <span>{formatCurrency(invoice.totalAmount, invoice.currency ? invoice.currency : "$")}</span></p>
              </div>
              <div className="p-2 bg-muted rounded-md font-mono text-xs break-all">{publicLink}</div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="sm:flex-1" onClick={() => setIsQrCodeDialogOpen(false)}>
              Close
            </Button>
            <Button className="sm:flex-1" onClick={handleDownloadQrCode}>
              Download QR Code
              <Download className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
