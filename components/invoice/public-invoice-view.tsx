"use client"

import { QRCodeSVG } from "qrcode.react"
import { Separator } from "@/components/ui/separator"
import { Calendar, FileText, User, ArrowUpRight } from "lucide-react"

interface PublicInvoiceViewProps {
  invoice: any
}

export function PublicInvoiceView({ invoice }: PublicInvoiceViewProps) {
  return (
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
                    <td className="border px-4 py-3 text-right">${service.price.toFixed(2)}</td>
                    <td className="border px-4 py-3 text-right font-medium">
                      ${(service.quantity * service.price).toFixed(2)}
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
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax ({invoice.taxRate}%):</span>
                <span>${invoice.taxAmount.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium text-lg">
                <span>Total:</span>
                <span>${invoice.totalAmount.toFixed(2)}</span>
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
              {invoice.invoiceMintAddress === "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
                ? "USDC"
                : invoice.invoiceMintAddress === "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
                  ? "USDT"
                  : "SOL"}
              :
            </p>
            <div className="mt-2 p-3 bg-muted/40 rounded-md font-mono text-sm break-all">
              {invoice.invoiceMintAddress}
            </div>

            {invoice.QRcodeEnabled && (
              <div className="mt-4 flex flex-col items-center">
                <div className="bg-white p-4 rounded-lg">
                  <QRCodeSVG value={invoice.invoiceMintAddress} size={150} level="H" includeMargin />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Scan to pay</p>
              </div>
            )}

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
              Thank you for your business. Payment is expected within {invoice.dueDate ? "the due date" : "30 days"} of
              invoice receipt. Please make payment via the provided wallet address.
            </p>
          </div>
        </div>
      </div>

      {/* Invoice Footer */}
      <div className="p-8 border-t bg-muted/20 text-center">
        <p className="text-sm text-muted-foreground">
          This invoice was generated by SolPay. For questions, contact support@solpay.com
        </p>
      </div>
    </div>
  )
}
