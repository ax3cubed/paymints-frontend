"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, Clock, ChevronRight } from "lucide-react"

export default function Dashboard() {
  const [balance, setBalance] = useState(2458.67)
  const [progress, setProgress] = useState(65)

  // Simulate balance increasing in real-time
  useState(() => {
    const interval = setInterval(() => {
      setBalance((prev) => {
        const newBalance = prev + 0.01
        return Number.parseFloat(newBalance.toFixed(2))
      })

      setProgress((prev) => {
        if (prev >= 100) return 0
        return prev + 0.1
      })
    }, 1000)

    return () => clearInterval(interval)
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your Paymint dashboard.</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button>
            <DollarSign className="mr-2 h-4 w-4" />
            Request Payment
          </Button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary/10 pb-2">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold tracking-tight">${balance.toLocaleString()}</span>
                <span className="ml-2 text-xs text-muted-foreground">USDC</span>
              </div>
              <div className="mt-2 flex items-center text-xs text-success">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                <span>+$0.01 per second</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="bg-secondary/10 pb-2">
              <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold tracking-tight">$3,250.00</span>
                <span className="ml-2 text-xs text-muted-foreground">USDC</span>
              </div>
              <div className="mt-2 flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                <span>3 invoices pending</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="bg-success/10 pb-2">
              <CardTitle className="text-sm font-medium">Treasury Yield</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold tracking-tight">5.8%</span>
                <span className="ml-2 text-xs text-muted-foreground">APY</span>
              </div>
              <div className="mt-2 flex items-center text-xs text-success">
                <TrendingUp className="mr-1 h-3 w-3" />
                <span>+0.3% from last week</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="bg-primary/10 pb-2">
              <CardTitle className="text-sm font-medium">Credit Score</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold tracking-tight">780</span>
                <span className="ml-2 text-xs text-muted-foreground">/ 850</span>
              </div>
              <div className="mt-2 flex items-center text-xs text-success">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                <span>+15 points this month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Payroll Stream */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="overflow-hidden">
          <CardHeader className="bg-secondary/10">
            <div className="flex items-center justify-between">
              <CardTitle>Active Payroll Stream</CardTitle>
              <Badge variant="outline" className="bg-success/20 text-success">
                Active
              </Badge>
            </div>
            <CardDescription>Real-time payment streaming from CryptoDAO Collective</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Current Period</div>
                  <div className="font-medium">April 1 - April 30, 2025</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Rate</div>
                  <div className="font-medium">$5,000.00 / month</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Earned So Far</div>
                  <div className="font-medium">${balance.toLocaleString()} USDC</div>
                </div>
                <Button>Withdraw Funds</Button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Period Progress</span>
                  <span>{progress.toFixed(1)}%</span>
                </div>
                <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="stream-animation absolute inset-0 h-full w-full"></div>
                  <div
                    className="relative h-full bg-primary transition-all duration-500 ease-in-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity & Invoices */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest transactions and updates</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {[
                  {
                    title: "Payment Received",
                    description: "From Solana Builders DAO",
                    amount: "+$1,250.00",
                    timestamp: "Today, 10:24 AM",
                    positive: true,
                  },
                  {
                    title: "Yield Earned",
                    description: "Treasury Management",
                    amount: "+$32.45",
                    timestamp: "Yesterday, 11:30 PM",
                    positive: true,
                  },
                  {
                    title: "Withdrawal",
                    description: "To External Wallet",
                    amount: "-$500.00",
                    timestamp: "Apr 17, 2025",
                    positive: false,
                  },
                  {
                    title: "Invoice Paid",
                    description: "Invoice #0023",
                    amount: "+$3,750.00",
                    timestamp: "Apr 15, 2025",
                    positive: true,
                  },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border-b last:border-0">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.positive ? "bg-success/20" : "bg-destructive/20"}`}
                      >
                        {activity.positive ? (
                          <ArrowUpRight className="h-5 w-5 text-success" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-sm text-muted-foreground">{activity.description}</div>
                        <div className="text-xs text-muted-foreground">{activity.timestamp}</div>
                      </div>
                    </div>
                    <div className={`font-medium ${activity.positive ? "text-success" : "text-destructive"}`}>
                      {activity.amount}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t p-4">
              <Button variant="ghost" className="w-full" size="sm">
                View All Activity
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>Track your invoice status</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {[
                  {
                    id: "INV-0025",
                    client: "CryptoDAO Collective",
                    amount: "$2,500.00",
                    status: "Pending",
                    dueDate: "Apr 30, 2025",
                  },
                  {
                    id: "INV-0024",
                    client: "Solana Builders",
                    amount: "$1,250.00",
                    status: "Paid",
                    dueDate: "Apr 15, 2025",
                  },
                  {
                    id: "INV-0023",
                    client: "Web3 Ventures",
                    amount: "$3,750.00",
                    status: "Paid",
                    dueDate: "Apr 10, 2025",
                  },
                  {
                    id: "INV-0022",
                    client: "DeFi Protocol",
                    amount: "$750.00",
                    status: "Overdue",
                    dueDate: "Mar 31, 2025",
                  },
                ].map((invoice, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border-b last:border-0">
                    <div>
                      <div className="font-medium">{invoice.id}</div>
                      <div className="text-sm text-muted-foreground">{invoice.client}</div>
                      <div className="text-xs text-muted-foreground">Due: {invoice.dueDate}</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="font-medium">{invoice.amount}</div>
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
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t p-4">
              <Button variant="ghost" className="w-full" size="sm">
                View All Invoices
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
