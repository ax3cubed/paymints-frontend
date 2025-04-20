"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  FileText,
  Repeat,
  Gift,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Ban,
  Eye,
  Edit,
  Copy,
  Trash2,
} from "lucide-react"
import Link from "next/link"

export default function OrdersPage() {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  // Mock orders data
  const orders = [
    {
      id: "ORD-0025",
      type: "invoice",
      title: "Smart Contract Development",
      client: "CryptoDAO Collective",
      amount: "$2,500.00",
      currency: "USDC",
      status: "paid",
      dueDate: "Apr 30, 2025",
      created: "Apr 15, 2025",
      recurring: false,
    },
    {
      id: "ORD-0024",
      type: "subscription",
      title: "Monthly Consulting Retainer",
      client: "Solana Builders",
      amount: "$1,250.00",
      currency: "USDC",
      status: "active",
      dueDate: "Monthly",
      created: "Apr 1, 2025",
      recurring: true,
    },
    {
      id: "ORD-0023",
      type: "invoice",
      title: "UI/UX Design",
      client: "Web3 Ventures",
      amount: "$3,750.00",
      currency: "USDC",
      status: "pending",
      dueDate: "May 10, 2025",
      created: "Apr 25, 2025",
      recurring: false,
    },
    {
      id: "ORD-0022",
      type: "donation",
      title: "Open Source Contribution",
      client: "DeFi Protocol",
      amount: "$750.00",
      currency: "USDC",
      status: "paid",
      dueDate: "N/A",
      created: "Mar 15, 2025",
      recurring: false,
    },
    {
      id: "ORD-0021",
      type: "invoice",
      title: "Security Audit",
      client: "NFT Marketplace",
      amount: "$4,200.00",
      currency: "USDC",
      status: "overdue",
      dueDate: "Apr 15, 2025",
      created: "Mar 1, 2025",
      recurring: false,
    },
    {
      id: "ORD-0020",
      type: "subscription",
      title: "Weekly Support Hours",
      client: "Metaverse Studios",
      amount: "$450.00/week",
      currency: "USDC",
      status: "active",
      dueDate: "Weekly",
      created: "Feb 15, 2025",
      recurring: true,
    },
  ]

  const handleEditOrder = (order: any) => {
    setSelectedOrder(order)
    setIsEditOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="outline" className="bg-success/20 text-success">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Paid
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-secondary/20 text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "overdue":
        return (
          <Badge variant="outline" className="bg-destructive/20 text-destructive">
            <AlertCircle className="mr-1 h-3 w-3" />
            Overdue
          </Badge>
        )
      case "active":
        return (
          <Badge variant="outline" className="bg-primary/20 text-primary">
            <Repeat className="mr-1 h-3 w-3" />
            Active
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            <Ban className="mr-1 h-3 w-3" />
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "invoice":
        return <FileText className="h-4 w-4 text-primary" />
      case "subscription":
        return <Repeat className="h-4 w-4 text-primary" />
      case "donation":
        return <Gift className="h-4 w-4 text-primary" />
      case "payment-link":
        return <CreditCard className="h-4 w-4 text-primary" />
      default:
        return <FileText className="h-4 w-4 text-primary" />
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage your invoices, subscriptions, and payment links</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button asChild>
            <Link href="/dashboard/orders/templates">
              <Plus className="mr-2 h-4 w-4" />
              Create Order
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Your Orders</CardTitle>
                <CardDescription>Manage and track all your orders</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search orders..." className="pl-8 w-full sm:w-[200px]" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="invoice">Invoices</TabsTrigger>
                <TabsTrigger value="subscription">Subscriptions</TabsTrigger>
                <TabsTrigger value="donation">Donations</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-7 p-4 text-sm font-medium text-muted-foreground bg-secondary/20">
                    <div>Order</div>
                    <div className="col-span-2">Title</div>
                    <div>Client</div>
                    <div>Amount</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                  </div>
                  <div className="divide-y">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="grid grid-cols-7 p-4 items-center hover:bg-secondary/10 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary/30 mr-2">
                            {getTypeIcon(order.type)}
                          </div>
                          <div>
                            <div className="font-medium">{order.id}</div>
                            <div className="text-xs text-muted-foreground capitalize">{order.type}</div>
                          </div>
                        </div>
                        <div className="col-span-2 truncate max-w-[200px]">{order.title}</div>
                        <div>{order.client}</div>
                        <div>{order.amount}</div>
                        <div>{getStatusBadge(order.status)}</div>
                        <div className="flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/invoices/preview/${order.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditOrder(order)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="invoice" className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-7 p-4 text-sm font-medium text-muted-foreground bg-secondary/20">
                    <div>Order</div>
                    <div className="col-span-2">Title</div>
                    <div>Client</div>
                    <div>Amount</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                  </div>
                  <div className="divide-y">
                    {orders
                      .filter((order) => order.type === "invoice")
                      .map((order) => (
                        <div
                          key={order.id}
                          className="grid grid-cols-7 p-4 items-center hover:bg-secondary/10 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary/30 mr-2">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{order.id}</div>
                              <div className="text-xs text-muted-foreground capitalize">{order.type}</div>
                            </div>
                          </div>
                          <div className="col-span-2 truncate max-w-[200px]">{order.title}</div>
                          <div>{order.client}</div>
                          <div>{order.amount}</div>
                          <div>{getStatusBadge(order.status)}</div>
                          <div className="flex justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/invoices/preview/${order.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditOrder(order)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="mr-2 h-4 w-4" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="subscription" className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-7 p-4 text-sm font-medium text-muted-foreground bg-secondary/20">
                    <div>Order</div>
                    <div className="col-span-2">Title</div>
                    <div>Client</div>
                    <div>Amount</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                  </div>
                  <div className="divide-y">
                    {orders
                      .filter((order) => order.type === "subscription")
                      .map((order) => (
                        <div
                          key={order.id}
                          className="grid grid-cols-7 p-4 items-center hover:bg-secondary/10 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary/30 mr-2">
                              <Repeat className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{order.id}</div>
                              <div className="text-xs text-muted-foreground capitalize">{order.type}</div>
                            </div>
                          </div>
                          <div className="col-span-2 truncate max-w-[200px]">{order.title}</div>
                          <div>{order.client}</div>
                          <div>{order.amount}</div>
                          <div>{getStatusBadge(order.status)}</div>
                          <div className="flex justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/invoices/preview/${order.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditOrder(order)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="mr-2 h-4 w-4" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="donation" className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-7 p-4 text-sm font-medium text-muted-foreground bg-secondary/20">
                    <div>Order</div>
                    <div className="col-span-2">Title</div>
                    <div>Client</div>
                    <div>Amount</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                  </div>
                  <div className="divide-y">
                    {orders
                      .filter((order) => order.type === "donation")
                      .map((order) => (
                        <div
                          key={order.id}
                          className="grid grid-cols-7 p-4 items-center hover:bg-secondary/10 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary/30 mr-2">
                              <Gift className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{order.id}</div>
                              <div className="text-xs text-muted-foreground capitalize">{order.type}</div>
                            </div>
                          </div>
                          <div className="col-span-2 truncate max-w-[200px]">{order.title}</div>
                          <div>{order.client}</div>
                          <div>{order.amount}</div>
                          <div>{getStatusBadge(order.status)}</div>
                          <div className="flex justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/invoices/preview/${order.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditOrder(order)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="mr-2 h-4 w-4" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="border-t p-4 flex justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{orders.length}</span> orders
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

      {/* Edit Order Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>Make changes to your order details</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input id="title" defaultValue={selectedOrder.title} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="client" className="text-right">
                  Client
                </Label>
                <Input id="client" defaultValue={selectedOrder.client} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input id="amount" defaultValue={selectedOrder.amount.replace("$", "")} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select defaultValue={selectedOrder.status}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">
                  Due Date
                </Label>
                <Input id="dueDate" defaultValue={selectedOrder.dueDate} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea id="notes" placeholder="Add any additional notes" className="col-span-3" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsEditOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
