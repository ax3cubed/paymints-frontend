"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Search, Filter, Download, CheckCircle2, Clock, AlertCircle, FileText } from "lucide-react"

export default function InvoicingDashboard() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [streamEnabled, setStreamEnabled] = useState(false)

  const invoices = [
    {
      id: "INV-0025",
      client: "CryptoDAO Collective",
      amount: "$2,500.00",
      status: "Pending",
      dueDate: "Apr 30, 2025",
      created: "Apr 15, 2025",
    },
    {
      id: "INV-0024",
      client: "Solana Builders",
      amount: "$1,250.00",
      status: "Paid",
      dueDate: "Apr 15, 2025",
      created: "Apr 1, 2025",
    },
    {
      id: "INV-0023",
      client: "Web3 Ventures",
      amount: "$3,750.00",
      status: "Paid",
      dueDate: "Apr 10, 2025",
      created: "Mar 25, 2025",
    },
    {
      id: "INV-0022",
      client: "DeFi Protocol",
      amount: "$750.00",
      status: "Overdue",
      dueDate: "Mar 31, 2025",
      created: "Mar 15, 2025",
    },
    {
      id: "INV-0021",
      client: "NFT Marketplace",
      amount: "$4,200.00",
      status: "Paid",
      dueDate: "Mar 15, 2025",
      created: "Mar 1, 2025",
    },
    {
      id: "INV-0020",
      client: "Metaverse Studios",
      amount: "$1,800.00",
      status: "Paid",
      dueDate: "Feb 28, 2025",
      created: "Feb 15, 2025",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoicing</h1>
          <p className="text-muted-foreground">Manage your invoices and get paid in USDC.</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
                <DialogDescription>
                  Create an invoice to send to your client. They'll receive a notification to pay in USDC.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="client" className="text-right">
                    Client
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cryptodao">CryptoDAO Collective</SelectItem>
                      <SelectItem value="solana">Solana Builders</SelectItem>
                      <SelectItem value="web3">Web3 Ventures</SelectItem>
                      <SelectItem value="defi">DeFi Protocol</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="wallet" className="text-right">
                    Wallet Address
                  </Label>
                  <Input id="wallet" placeholder="Client's Solana wallet address" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount (USDC)
                  </Label>
                  <Input id="amount" placeholder="0.00" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea id="description" placeholder="Describe the services provided" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dueDate" className="text-right">
                    Due Date
                  </Label>
                  <Input id="dueDate" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stream" className="text-right">
                    Enable Streaming
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Switch id="stream" checked={streamEnabled} onCheckedChange={setStreamEnabled} />
                    <Label htmlFor="stream">Payment will stream over time instead of lump sum</Label>
                  </div>
                </div>
                {streamEnabled && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="streamPeriod" className="text-right">
                      Stream Period
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateOpen(false)}>Create Invoice</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
              <div className="text-2xl font-bold">$3,250.00</div>
              <p className="text-xs text-muted-foreground">From 2 pending invoices</p>
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
              <div className="text-2xl font-bold">$5,000.00</div>
              <p className="text-xs text-muted-foreground">From 3 paid invoices</p>
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
              <div className="text-2xl font-bold">3.2 days</div>
              <p className="text-xs text-muted-foreground">-1.5 days from last month</p>
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
                      >
                        <div className="font-medium">{invoice.id}</div>
                        <div className="col-span-2">{invoice.client}</div>
                        <div>{invoice.amount}</div>
                        <div>
                          <Badge
                            variant="outline"
                            className={
                              invoice.status === "Paid"
                                ? "bg-success/20 text-success"
                                : invoice.status === "Pending"
                                  ? "bg-secondary/20 text-muted-foreground"
                                  : "bg-destructive/20 text-destructive"
                            }
                          >
                            {invoice.status === "Paid" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                            {invoice.status === "Pending" && <Clock className="mr-1 h-3 w-3" />}
                            {invoice.status === "Overdue" && <AlertCircle className="mr-1 h-3 w-3" />}
                            {invoice.status}
                          </Badge>
                        </div>
                        <div>{invoice.dueDate}</div>
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
                      .filter((invoice) => invoice.status === "Pending")
                      .map((invoice, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-6 p-4 items-center hover:bg-secondary/10 transition-colors cursor-pointer"
                        >
                          <div className="font-medium">{invoice.id}</div>
                          <div className="col-span-2">{invoice.client}</div>
                          <div>{invoice.amount}</div>
                          <div>
                            <Badge variant="outline" className="bg-secondary/20 text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              {invoice.status}
                            </Badge>
                          </div>
                          <div>{invoice.dueDate}</div>
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
                      .filter((invoice) => invoice.status === "Paid")
                      .map((invoice, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-6 p-4 items-center hover:bg-secondary/10 transition-colors cursor-pointer"
                        >
                          <div className="font-medium">{invoice.id}</div>
                          <div className="col-span-2">{invoice.client}</div>
                          <div>{invoice.amount}</div>
                          <div>
                            <Badge variant="outline" className="bg-success/20 text-success">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              {invoice.status}
                            </Badge>
                          </div>
                          <div>{invoice.dueDate}</div>
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
                        >
                          <div className="font-medium">{invoice.id}</div>
                          <div className="col-span-2">{invoice.client}</div>
                          <div>{invoice.amount}</div>
                          <div>
                            <Badge variant="outline" className="bg-destructive/20 text-destructive">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              {invoice.status}
                            </Badge>
                          </div>
                          <div>{invoice.dueDate}</div>
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
