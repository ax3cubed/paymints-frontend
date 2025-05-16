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
import { useWallet } from "@solana/wallet-adapter-react"
import { Transaction } from "@solana/web3.js"
import { useSolana } from "@/components/solana/solana-provider"
import { Base64EncodedWireTransaction } from "@solana/kit"

export default function InvoiceViewPage() {
  const params = useParams()
  const router = useRouter()
  const { signTransaction } = useWallet()
  const { toast } = useToast()
  const id = params?.id as string
  const { activateInvoice, isActivating, isActive, invoice, isLoading, refetch } = useInvoice(id);
  const { rpc } = useSolana()
  useEffect(() => {
    if (id) {
      refetch()
    }
  }, [id, refetch, activateInvoice])

  const handleActivate = async () => {
    if (!id) return

    try {
      const activitatedInvoice = await activateInvoice();

      const invoiceHash = activitatedInvoice?.invoiceTxHash;

      if (invoiceHash && signTransaction) {
        const invoiceBuffer: Transaction = Transaction.from(Buffer.from(invoiceHash, "base64"))
        await signTransaction(invoiceBuffer).then(async (signedTransaction) => {
          const signedTxHash = signedTransaction.serialize();
          const base64WireTransaction: Base64EncodedWireTransaction = btoa(String.fromCharCode(...new Uint8Array(signedTxHash))) as Base64EncodedWireTransaction;
          console.log("Base64 Wire Transaction:", base64WireTransaction);

          const signature = await rpc?.sendTransaction(
            base64WireTransaction,
            { preflightCommitment: "confirmed" }
          ).send({ abortSignal: new AbortController().signal });
          console.log("Transaction Signature:", signature);

          if (signature) {
            toast({
              title: "Invoice Activated",
              description: (
                <span>
                  Your invoice has been successfully activated.<br />
                  <a
                    href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#6366f1", textDecoration: "underline" }}
                  >
                    View on Solana Explorer
                  </a>
                </span>
              ),
              variant: "default",
            });
            // Optionally: update invoice with signature here
          } else {
            toast({
              title: "Activation Failed",
              description: "No transaction signature returned.",
              variant: "destructive",
            });
          }
        }).catch((error) => {
          toast({
            title: "Activation Failed",
            description: `Failed to activate invoice: ${error.message}`,
            variant: "destructive",
          });
        });
      }

    } catch (error) {
      toast({
        title: "Activation Error",
        description: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
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
  const isInvoiceActive = isActivating || invoice.invoiceStatus === "1"
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
        <div className="space-y-1 w-full">
          <Breadcrumb segments={[{ name: "Invoices", href: "/invoices" }, { name: `Invoice ${id}` }]} />
          <div className="flex items-center justify-between w-full">
            <h1 className="text-3xl font-bold tracking-tight">Invoice {id}</h1>
            {!isActive && (
              <Button onClick={handleActivate} disabled={false} className="bg-green-600 hover:bg-green-700">
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
