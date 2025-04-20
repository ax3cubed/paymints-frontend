"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { type ChartConfig, ChartContainer } from "@/components/ui/chart"
import { ArrowUpRight, CheckCircle2, Plus } from "lucide-react"

export default function TreasuryDashboard() {
  const [isAllocateOpen, setIsAllocateOpen] = useState(false)
  const [riskLevel, setRiskLevel] = useState([50])
  const [autoYield, setAutoYield] = useState(true)

  // Chart data
  const pieChartData = [
    { name: "USDC", value: 65, fill: "#8b5cf6" },
    { name: "Yield Strategies", value: 25, fill: "#6366f1" },
    { name: "Liquidity Pool", value: 10, fill: "#14b8a6" },
  ]

  const pieChartConfig = {
    USDC: {
      label: "USDC",
      color: "#8b5cf6",
    },
    "Yield Strategies": {
      label: "Yield Strategies",
      color: "#6366f1",
    },
    "Liquidity Pool": {
      label: "Liquidity Pool",
      color: "#14b8a6",
    },
  } satisfies ChartConfig
  const lineChartData = [
    { name: "Jan", value: 4.2 },
    { name: "Feb", value: 4.5 },
    { name: "Mar", value: 5.1 },
    { name: "Apr", value: 5.8 },
    { name: "May", value: 5.9 },
    { name: "Jun", value: 6.2 },
  ]
  const lineChartConfig = {
    value: {
      label: "APY %",
      color: "#8b5cf6",
    },
  } satisfies ChartConfig

  const barChartData = [
    { name: "USDC", value: 6500 },
    { name: "Yield", value: 2500 },
    { name: "Liquidity", value: 1000 },
  ]

  const barChartConfig = {
    value: {
      label: "Amount (USD)",
      color: "#8b5cf6",
    },
  } satisfies ChartConfig
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Treasury Management</h1>
          <p className="text-muted-foreground">Optimize your idle funds with automated yield strategies.</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Dialog open={isAllocateOpen} onOpenChange={setIsAllocateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Allocate Funds
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Allocate Treasury Funds</DialogTitle>
                <DialogDescription>
                  Optimize your idle funds by allocating them to different yield strategies.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount (USDC)
                  </Label>
                  <Input id="amount" placeholder="0.00" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="strategy" className="text-right">
                    Yield Strategy
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conservative">Conservative (3-5% APY)</SelectItem>
                      <SelectItem value="balanced">Balanced (5-8% APY)</SelectItem>
                      <SelectItem value="aggressive">Aggressive (8-12% APY)</SelectItem>
                      <SelectItem value="custom">Custom Strategy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="risk" className="text-right">
                    Risk Level
                  </Label>
                  <div className="col-span-3 space-y-2">
                    <Slider value={riskLevel} onValueChange={setRiskLevel} max={100} step={1} className="w-full" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Conservative</span>
                      <span>Balanced</span>
                      <span>Aggressive</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="duration" className="text-right">
                    Lock Duration
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flexible">Flexible (No lock)</SelectItem>
                      <SelectItem value="30days">30 Days</SelectItem>
                      <SelectItem value="90days">90 Days</SelectItem>
                      <SelectItem value="180days">180 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="autoYield" className="text-right">
                    Auto-Compound
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Switch id="autoYield" checked={autoYield} onCheckedChange={setAutoYield} />
                    <Label htmlFor="autoYield">Automatically reinvest earned yield</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAllocateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAllocateOpen(false)}>Allocate Funds</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Treasury Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Treasury Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$10,000.00</div>
              <p className="text-xs text-muted-foreground">+$250.00 (2.5%) from last month</p>
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
              <CardTitle className="text-sm font-medium">Current Yield</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5.8% APY</div>
              <p className="text-xs text-success flex items-center">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                +0.3% from last week
              </p>
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
              <CardTitle className="text-sm font-medium">Yield Earned (YTD)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$145.32</div>
              <p className="text-xs text-muted-foreground">Since January 1, 2025</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Asset Allocation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>Current distribution of your treasury funds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-64 flex items-center justify-center">
                <ChartContainer config={pieChartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        nameKey="name"
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#8b5cf6] mr-2"></div>
                      <span>USDC</span>
                    </div>
                    <div className="font-medium">$6,500.00 (65%)</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#6366f1] mr-2"></div>
                      <span>Yield Strategies</span>
                    </div>
                    <div className="font-medium">$2,500.00 (25%)</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#14b8a6] mr-2"></div>
                      <span>Liquidity Pool</span>
                    </div>
                    <div className="font-medium">$1,000.00 (10%)</div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Recommended Actions</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-success mr-2 mt-0.5" />
                      <span>Consider allocating more funds to yield strategies to increase returns</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-success mr-2 mt-0.5" />
                      <span>Maintain at least 50% in USDC for payroll liquidity</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Yield Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Yield Performance</CardTitle>
            <CardDescription>Historical performance of your yield strategies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={lineChartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineChartData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="var(--color-value)"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "var(--color-value)", strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: "var(--color-value)", strokeWidth: 0 }}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      {/* Asset Distribution Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.45 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Asset Distribution</CardTitle>
            <CardDescription>Breakdown of treasury allocation in USD</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={barChartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Strategies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Active Yield Strategies</CardTitle>
            <CardDescription>Your current active yield-generating strategies</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {[
                {
                  name: "Solana Staking",
                  description: "Staking USDC in Solana DeFi protocol",
                  amount: "$1,500.00",
                  apy: "6.2%",
                  duration: "Flexible",
                  risk: "Low",
                },
                {
                  name: "Liquidity Provision",
                  description: "Providing liquidity to USDC/SOL pair",
                  amount: "$1,000.00",
                  apy: "8.5%",
                  duration: "30 days",
                  risk: "Medium",
                },
                {
                  name: "Yield Aggregator",
                  description: "Auto-compounding yield strategy",
                  amount: "$500.00",
                  apy: "4.8%",
                  duration: "Flexible",
                  risk: "Low",
                },
              ].map((strategy, i) => (
                <div key={i} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="font-medium">{strategy.name}</div>
                    <div className="text-sm text-muted-foreground">{strategy.description}</div>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground mr-2">Amount:</span>
                    {strategy.amount}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground mr-2">APY:</span>
                    <span className="text-success">{strategy.apy}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground mr-2">Lock:</span>
                    {strategy.duration}
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      strategy.risk === "Low"
                        ? "bg-success/20 text-success"
                        : strategy.risk === "Medium"
                          ? "bg-secondary/20 text-muted-foreground"
                          : "bg-destructive/20 text-destructive"
                    }
                  >
                    {strategy.risk} Risk
                  </Badge>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Treasury Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Treasury Settings</CardTitle>
            <CardDescription>Configure your treasury management preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Auto-Yield</h3>
                <p className="text-sm text-muted-foreground">Automatically allocate idle funds to yield strategies</p>
              </div>
              <Switch checked={autoYield} onCheckedChange={setAutoYield} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Payroll Sync</h3>
                <p className="text-sm text-muted-foreground">Ensure sufficient liquidity for upcoming payroll</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Risk Preference</h3>
                <p className="text-sm text-muted-foreground">Set your default risk level for new allocations</p>
              </div>
              <Select defaultValue="balanced">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Notification Threshold</h3>
                <p className="text-sm text-muted-foreground">Get notified when treasury balance falls below</p>
              </div>
              <Input type="number" placeholder="1000" className="w-[180px]" defaultValue="1000" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
