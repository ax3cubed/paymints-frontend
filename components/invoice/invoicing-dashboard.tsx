"use client"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, Download, CheckCircle2, Clock, AlertCircle, FileText, GlassWater } from "lucide-react"
import { useInvoices } from "@/hooks/use-invoices"
import { getInvoiceStatusLabel, InvoiceStatusLabel } from "@/types/invoice"
import { formatCurrency } from "@/lib/utils"
import { format, parseISO } from "date-fns"

// Type for invoice items
export type DashboardInvoice = {
  id: string;
  client: string;
  amount: string;
  status: InvoiceStatusLabel;
  dueDate: string;
  created: string;
  currency: string;
  formattedAmount: string;
  formattedDueDate: string;
};

// Utility to format due date
function formatDueDate(date: string) {
  if (!date) return "-";
  try {
    return format(parseISO(date), "MMM d, yyyy")
  } catch {
    return date;
  }
}

export default function InvoicingDashboard() {
  const router = useRouter()
  const { invoices: invoiceData, isLoading } = useInvoices()

  const invoices: DashboardInvoice[] = invoiceData.map((invoice) => ({
    id: invoice.invoiceNo || "",
    client: invoice.clientName,
    amount: `${invoice.totalAmount}`,
    status: getInvoiceStatusLabel(invoice.invoiceStatus || "0"),
    dueDate: invoice.dueDate || "",
    created: invoice.createdAt,
    currency: invoice.currency || "USD",
    formattedAmount: formatCurrency(invoice.totalAmount, invoice.currency || "USD"),
    formattedDueDate: formatDueDate(invoice.dueDate || ""),
  }))

  // --- Invoice Stats Calculations ---
  // Outstanding (pending) invoices
  const pendingInvoices = invoices.filter(inv => inv.status === "Processing")
  const totalOutstanding = pendingInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount.replace(/[^\d.]/g, "")), 0)

  // Paid invoices this month
  const now = new Date()
  // Helper to get latest payment timestamp for an invoice
  function getLatestPaymentTimestamp(invoice: typeof invoiceData[number]) {
    if (!invoice.invoicePays || invoice.invoicePays.length === 0) return undefined
    return invoice.invoicePays
      .map(pay => new Date(pay.timestamp))
      .sort((a, b) => b.getTime() - a.getTime())[0]
  }
  const paidInvoices = invoiceData.filter(inv => getInvoiceStatusLabel(inv.invoiceStatus || "0") === "Completed" && inv.invoicePays && inv.invoicePays.length > 0)
  const paidInvoicesThisMonth = paidInvoices.filter(inv => {
    const paidDate = getLatestPaymentTimestamp(inv)
    if (!paidDate) return false
    return paidDate.getMonth() === now.getMonth() && paidDate.getFullYear() === now.getFullYear()
  })
  const totalPaidThisMonth = paidInvoicesThisMonth.reduce((sum, inv) => sum + inv.totalAmount, 0)

  // Average payment time (for paid invoices)
  const avgPaymentTime = paidInvoices.length > 0
    ? (paidInvoices.reduce((sum, inv) => {
      const paidDate = getLatestPaymentTimestamp(inv)
      if (!paidDate) return sum
      const createdDate = new Date(inv.createdAt)
      return sum + ((paidDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
    }, 0) / paidInvoices.length)
    : 0

  // Last month's average payment time for delta
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const paidInvoicesLastMonth = paidInvoices.filter(inv => {
    const paidDate = getLatestPaymentTimestamp(inv)
    if (!paidDate) return false
    return paidDate.getMonth() === lastMonth.getMonth() && paidDate.getFullYear() === lastMonth.getFullYear()
  })
  const avgPaymentTimeLastMonth = paidInvoicesLastMonth.length > 0
    ? (paidInvoicesLastMonth.reduce((sum, inv) => {
      const paidDate = getLatestPaymentTimestamp(inv)
      if (!paidDate) return sum
      const createdDate = new Date(inv.createdAt)
      return sum + ((paidDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
    }, 0) / paidInvoicesLastMonth.length)
    : 0
  const avgPaymentTimeDelta = avgPaymentTimeLastMonth ? (avgPaymentTime - avgPaymentTimeLastMonth) : 0

  return (
    <div className="container py-10 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoicing</h1>
          <p className="text-muted-foreground">Manage your invoices and get paid in USDC.</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button onClick={() => router.push("/invoices/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Invoice Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalOutstanding, "USD")}</div>
              <p className="text-xs text-muted-foreground">From {pendingInvoices.length} pending invoice{pendingInvoices.length !== 1 ? "s" : ""}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Paid This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalPaidThisMonth, "USD")}</div>
              <p className="text-xs text-muted-foreground">From {paidInvoicesThisMonth.length} paid invoice{paidInvoicesThisMonth.length !== 1 ? "s" : ""}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Payment Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgPaymentTime ? `${avgPaymentTime.toFixed(1)} days` : "-"}</div>
              <p className="text-xs text-muted-foreground">{avgPaymentTimeLastMonth ? `${avgPaymentTimeDelta > 0 ? "+" : ""}${avgPaymentTimeDelta.toFixed(1)} days from last month` : "No data for last month"}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Invoice List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Your Invoices</CardTitle>
                <CardDescription>Manage and track all your invoices</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search invoices..." className="pl-8 w-full sm:w-[200px]" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 p-4 text-sm font-medium text-muted-foreground bg-secondary/20">
                    <div>Invoice</div>
                    <div className="col-span-2">Client</div>
                    <div>Amount</div>
                    <div>Status</div>
                    <div>Due Date</div>
                  </div>
                  <div className="divide-y">
                    {invoices.map((invoice, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-6 p-4 items-center hover:bg-secondary/10 transition-colors cursor-pointer"
                        onClick={() => router.push(`/invoices/view/${invoice.id}`)}
                      >
                        <div className="font-medium">{invoice.id}</div>
                        <div className="col-span-2">{invoice.client}</div>
                        <div>{invoice.formattedAmount}</div>
                        <div>
                          <Badge
                            variant="outline"
                            className={
                              invoice.status === "Completed"
                                ? "bg-success/20 text-success"
                                : invoice.status === "Processing"
                                  ? "bg-secondary/20 text-muted-foreground"
                                  : "bg-destructive/20 text-destructive"
                            }
                          >
                            {invoice.status === "Draft" && <FileText className="mr-1 h-3 w-3" />}
                            {invoice.status === "Completed" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                            {invoice.status === "Processing" && <Clock className="mr-1 h-3 w-3" />}
                            {invoice.status === "Overdue" && <AlertCircle className="mr-1 h-3 w-3" />}
                            {invoice.status === "Unknown" && <GlassWater className="mr-1 h-3 w-3" />}
                            {invoice.status}
                          </Badge>
                        </div>
                        <div>{invoice.formattedDueDate}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="pending" className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 p-4 text-sm font-medium text-muted-foreground bg-secondary/20">
                    <div>Invoice</div>
                    <div className="col-span-2">Client</div>
                    <div>Amount</div>
                    <div>Status</div>
                    <div>Due Date</div>
                  </div>
                  <div className="divide-y">
                    {invoices
                      .filter((invoice) => invoice.status === "Processing")
                      .map((invoice, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-6 p-4 items-center hover:bg-secondary/10 transition-colors cursor-pointer"
                          onClick={() => router.push(`/invoices/view/${invoice.id}`)}
                        >
                          <div className="font-medium">{invoice.id}</div>
                          <div className="col-span-2">{invoice.client}</div>
                          <div>{invoice.formattedAmount}</div>
                          <div>
                            <Badge variant="outline" className="bg-secondary/20 text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              {invoice.status}
                            </Badge>
                          </div>
                          <div>{invoice.formattedDueDate}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="paid" className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 p-4 text-sm font-medium text-muted-foreground bg-secondary/20">
                    <div>Invoice</div>
                    <div className="col-span-2">Client</div>
                    <div>Amount</div>
                    <div>Status</div>
                    <div>Due Date</div>
                  </div>
                  <div className="divide-y">
                    {invoices
                      .filter((invoice) => invoice.status === "Completed")
                      .map((invoice, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-6 p-4 items-center hover:bg-secondary/10 transition-colors cursor-pointer"
                          onClick={() => router.push(`/invoices/view/${invoice.id}`)}
                        >
                          <div className="font-medium">{invoice.id}</div>
                          <div className="col-span-2">{invoice.client}</div>
                          <div>{invoice.formattedAmount}</div>
                          <div>
                            <Badge variant="outline" className="bg-success/20 text-success">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              {invoice.status}
                            </Badge>
                          </div>
                          <div>{invoice.formattedDueDate}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="overdue" className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 p-4 text-sm font-medium text-muted-foreground bg-secondary/20">
                    <div>Invoice</div>
                    <div className="col-span-2">Client</div>
                    <div>Amount</div>
                    <div>Status</div>
                    <div>Due Date</div>
                  </div>
                  <div className="divide-y">
                    {invoices
                      .filter((invoice) => invoice.status === "Overdue")
                      .map((invoice, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-6 p-4 items-center hover:bg-secondary/10 transition-colors cursor-pointer"
                          onClick={() => router.push(`/invoices/view/${invoice.id}`)}
                        >
                          <div className="font-medium">{invoice.id}</div>
                          <div className="col-span-2">{invoice.client}</div>
                          <div>{invoice.formattedAmount}</div>
                          <div>
                            <Badge variant="outline" className="bg-destructive/20 text-destructive">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              {invoice.status}
                            </Badge>
                          </div>
                          <div>{invoice.formattedDueDate}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="border-t p-4 flex justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{invoices.length}</span> invoices
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Invoice Templates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Invoice Templates</CardTitle>
            <CardDescription>Save time by using pre-configured templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "Standard Invoice",
                  description: "Basic invoice with standard payment terms",
                  icon: <FileText className="h-8 w-8 text-primary" />,
                },
                {
                  title: "Milestone Payment",
                  description: "Invoice with multiple payment milestones",
                  icon: <FileText className="h-8 w-8 text-primary" />,
                },
                {
                  title: "Streaming Payment",
                  description: "Real-time payment streaming over a period",
                  icon: <FileText className="h-8 w-8 text-primary" />,
                },
              ].map((template, i) => (
                <Card key={i} className="bg-secondary/20 hover:bg-secondary/30 transition-colors cursor-pointer">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="mb-4">{template.icon}</div>
                    <h3 className="text-lg font-bold mb-2">{template.title}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
