"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Check,
  ChevronDown,
  Download,
  Filter,
  Search,
  SlidersHorizontal,
} from "lucide-react"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { addDays } from "date-fns"
import { DateRange } from "react-day-picker"

export default function TransactionsPage() {
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  
  // Wrapper function to handle DateRange | undefined
  const handleDateRangeChange = (date: DateRange | undefined) => {
    if (date) {
      setDateRange({
        from: date.from ?? addDays(new Date(), -30),
        to: date.to ?? new Date(),
      });
    }
  }

  // Mock transaction data
  const transactions = [
    {
      id: "tx_1234567890",
      type: "incoming",
      description: "Payment from CryptoDAO Collective",
      amount: 2500.0,
      currency: "USDC",
      date: "Apr 15, 2025 10:24 AM",
      status: "confirmed",
      sender: "CryptoDAO Collective",
      recipient: "Your Wallet",
      txHash: "5FbDB2315678afecb367f032d93F642f64180aa3",
      blockHeight: 123456789,
      fee: 0.000005,
    },
    {
      id: "tx_0987654321",
      type: "outgoing",
      description: "Withdrawal to External Wallet",
      amount: 500.0,
      currency: "USDC",
      date: "Apr 14, 2025 03:15 PM",
      status: "confirmed",
      sender: "Your Wallet",
      recipient: "External Wallet",
      txHash: "7FcdB2315678afecb367f032d93F642f64180bb4",
      blockHeight: 123456700,
      fee: 0.000005,
    },
    {
      id: "tx_5678901234",
      type: "incoming",
      description: "Invoice #0024 Payment",
      amount: 1250.0,
      currency: "USDC",
      date: "Apr 10, 2025 09:30 AM",
      status: "confirmed",
      sender: "Solana Builders",
      recipient: "Your Wallet",
      txHash: "3AbcB2315678afecb367f032d93F642f64180cc5",
      blockHeight: 123456650,
      fee: 0.000005,
    },
    {
      id: "tx_4321098765",
      type: "incoming",
      description: "Yield Earned",
      amount: 32.45,
      currency: "USDC",
      date: "Apr 08, 2025 11:59 PM",
      status: "confirmed",
      sender: "Treasury Management",
      recipient: "Your Wallet",
      txHash: "9DefB2315678afecb367f032d93F642f64180dd6",
      blockHeight: 123456600,
      fee: 0.000005,
    },
    {
      id: "tx_6789012345",
      type: "outgoing",
      description: "Treasury Allocation",
      amount: 1000.0,
      currency: "USDC",
      date: "Apr 05, 2025 02:45 PM",
      status: "confirmed",
      sender: "Your Wallet",
      recipient: "Treasury",
      txHash: "2GhiB2315678afecb367f032d93F642f64180ee7",
      blockHeight: 123456550,
      fee: 0.000005,
    },
    {
      id: "tx_3456789012",
      type: "incoming",
      description: "Invoice #0023 Payment",
      amount: 3750.0,
      currency: "USDC",
      date: "Apr 01, 2025 10:15 AM",
      status: "confirmed",
      sender: "Web3 Ventures",
      recipient: "Your Wallet",
      txHash: "8JklB2315678afecb367f032d93F642f64180ff8",
      blockHeight: 123456500,
      fee: 0.000005,
    },
  ]

  const downloadTransactions = (format: string) => {
    // In a real app, this would generate and download a file
    console.log(`Downloading transactions in ${format} format`)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">View and manage your transaction history</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => downloadTransactions("csv")}>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadTransactions("pdf")}>Export as PDF</DropdownMenuItem>
              <DropdownMenuItem onClick={() => downloadTransactions("json")}>Export as JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filters and Search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter and search your transaction history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                <DatePickerWithRange date={dateRange} setDate={handleDateRangeChange} />
                  <Input id="search" type="search" placeholder="Search transactions..." className="pl-8" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <DatePickerWithRange date={dateRange} setDate={handleDateRangeChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Transaction Type</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="incoming">Incoming</SelectItem>
                    <SelectItem value="outgoing">Outgoing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select defaultValue="usdc">
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Currencies</SelectItem>
                    <SelectItem value="usdc">USDC</SelectItem>
                    <SelectItem value="sol">SOL</SelectItem>
                    <SelectItem value="usdt">USDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="outline" className="mr-2">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Advanced Filters
              </Button>
              <Button>
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Transaction List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              Showing transactions from {dateRange.from?.toLocaleDateString()} to {dateRange.to?.toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="incoming">Incoming</TabsTrigger>
                <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 p-4 text-sm font-medium text-muted-foreground bg-secondary/20">
                    <div>Transaction</div>
                    <div>Description</div>
                    <div>Date</div>
                    <div>Amount</div>
                    <div>Status</div>
                  </div>
                  <div className="divide-y">
                    {transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="grid grid-cols-5 p-4 items-center hover:bg-secondary/10 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              tx.type === "incoming" ? "bg-success/20" : "bg-destructive/20"
                            }`}
                          >
                            {tx.type === "incoming" ? (
                              <ArrowUpRight className="h-4 w-4 text-success" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-destructive" />
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="font-medium">{tx.type === "incoming" ? "Received" : "Sent"}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[120px]">
                              {tx.txHash.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                        <div className="truncate max-w-[200px]">{tx.description}</div>
                        <div className="text-sm text-muted-foreground">{tx.date}</div>
                        <div className={`font-medium ${tx.type === "incoming" ? "text-success" : "text-destructive"}`}>
                          {tx.type === "incoming" ? "+" : "-"}
                          {tx.currency} {tx.amount.toFixed(2)}
                        </div>
                        <div>
                          <Badge variant="outline" className="bg-success/20 text-success">
                            <Check className="mr-1 h-3 w-3" />
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="incoming" className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 p-4 text-sm font-medium text-muted-foreground bg-secondary/20">
                    <div>Transaction</div>
                    <div>Description</div>
                    <div>Date</div>
                    <div>Amount</div>
                    <div>Status</div>
                  </div>
                  <div className="divide-y">
                    {transactions
                      .filter((tx) => tx.type === "incoming")
                      .map((tx) => (
                        <div
                          key={tx.id}
                          className="grid grid-cols-5 p-4 items-center hover:bg-secondary/10 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-success/20">
                              <ArrowUpRight className="h-4 w-4 text-success" />
                            </div>
                            <div className="ml-3">
                              <div className="font-medium">Received</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[120px]">
                                {tx.txHash.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                          <div className="truncate max-w-[200px]">{tx.description}</div>
                          <div className="text-sm text-muted-foreground">{tx.date}</div>
                          <div className="font-medium text-success">
                            +{tx.currency} {tx.amount.toFixed(2)}
                          </div>
                          <div>
                            <Badge variant="outline" className="bg-success/20 text-success">
                              <Check className="mr-1 h-3 w-3" />
                              {tx.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="outgoing" className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 p-4 text-sm font-medium text-muted-foreground bg-secondary/20">
                    <div>Transaction</div>
                    <div>Description</div>
                    <div>Date</div>
                    <div>Amount</div>
                    <div>Status</div>
                  </div>
                  <div className="divide-y">
                    {transactions
                      .filter((tx) => tx.type === "outgoing")
                      .map((tx) => (
                        <div
                          key={tx.id}
                          className="grid grid-cols-5 p-4 items-center hover:bg-secondary/10 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-destructive/20">
                              <ArrowDownRight className="h-4 w-4 text-destructive" />
                            </div>
                            <div className="ml-3">
                              <div className="font-medium">Sent</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[120px]">
                                {tx.txHash.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                          <div className="truncate max-w-[200px]">{tx.description}</div>
                          <div className="text-sm text-muted-foreground">{tx.date}</div>
                          <div className="font-medium text-destructive">
                            -{tx.currency} {tx.amount.toFixed(2)}
                          </div>
                          <div>
                            <Badge variant="outline" className="bg-success/20 text-success">
                              <Check className="mr-1 h-3 w-3" />
                              {tx.status}
                            </Badge>
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
              Showing <span className="font-medium">{transactions.length}</span> transactions
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

      {/* Transaction Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
            <CardDescription>Select a transaction to view details</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center p-8">
              <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Transaction Selected</h3>
              <p className="text-muted-foreground max-w-md">
                Click on any transaction from the list above to view its detailed information, including blockchain data
                and transaction status.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
