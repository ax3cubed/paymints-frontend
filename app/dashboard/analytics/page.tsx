"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { addDays } from "date-fns"
import { ArrowUpRight, Download, BarChartIcon, LineChartIcon, Calendar } from "lucide-react"
import { Bar, BarChart, Cell, Line, LineChart,PieChart, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { type ChartConfig, ChartContainer } from "@/components/ui/chart"
import { DateRange } from "react-day-picker"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const handleDateRangeChange = (date: DateRange | undefined) => {
    if (date) {
      setDateRange({
        from: date.from ?? addDays(new Date(), -30),
        to: date.to ?? new Date(),
      });
    }
  }
  // Mock data for charts
  const spendingData = [
    { name: "Jan", value: 1200 },
    { name: "Feb", value: 1900 },
    { name: "Mar", value: 1500 },
    { name: "Apr", value: 2100 },
    { name: "May", value: 1800 },
    { name: "Jun", value: 2400 },
  ]

  const spendingChartConfig = {
    value: {
      label: "Amount (USD)",
      color: "#8b5cf6",
    },
  } satisfies ChartConfig

  const categoryData = [
    { name: "Development", value: 45 },
    { name: "Design", value: 25 },
    { name: "Marketing", value: 15 },
    { name: "Operations", value: 10 },
    { name: "Other", value: 5 },
  ]

  const categoryChartConfig = {
    Development: {
      label: "Development",
      color: "#8b5cf6",
    },
    Design: {
      label: "Design",
      color: "#6366f1",
    },
    Marketing: {
      label: "Marketing",
      color: "#14b8a6",
    },
    Operations: {
      label: "Operations",
      color: "#f59e0b",
    },
    Other: {
      label: "Other",
      color: "#ef4444",
    },
  } satisfies ChartConfig

  const invoiceData = [
    { name: "Total", value: 25 },
    { name: "Paid", value: 18 },
    { name: "Pending", value: 5 },
    { name: "Overdue", value: 2 },
  ]

  const invoiceChartConfig = {
    Total: {
      label: "Total",
      color: "#8b5cf6",
    },
    Paid: {
      label: "Paid",
      color: "#10b981",
    },
    Pending: {
      label: "Pending",
      color: "#f59e0b",
    },
    Overdue: {
      label: "Overdue",
      color: "#ef4444",
    },
  } satisfies ChartConfig

  const categoryProgress = [
    { name: "Development", current: 4500, target: 5000, percentage: 90 },
    { name: "Design", current: 2500, target: 3000, percentage: 83 },
    { name: "Marketing", current: 1500, target: 2000, percentage: 75 },
    { name: "Operations", current: 1000, target: 1500, percentage: 67 },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Track your financial performance and spending patterns</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <DatePickerWithRange date={dateRange} setDate={handleDateRangeChange} />
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,500.00</div>
              <div className="flex items-center text-xs text-success">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                <span>+15% from last month</span>
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
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$4,320.00</div>
              <div className="flex items-center text-xs text-success">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                <span>-5% from last month</span>
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
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$8,180.00</div>
              <div className="flex items-center text-xs text-success">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                <span>+25% from last month</span>
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
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                <span>5 due this week</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Spending Patterns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Spending Patterns</CardTitle>
            <CardDescription>Your spending trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="line">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="line">
                    <LineChartIcon className="h-4 w-4 mr-2" />
                    Line
                  </TabsTrigger>
                  <TabsTrigger value="bar">
                    <BarChartIcon className="h-4 w-4 mr-2" />
                    Bar
                  </TabsTrigger>
                </TabsList>
                <div>
                  <Badge variant="outline" className="mr-2">
                    Monthly
                  </Badge>
                  <Badge variant="outline" className="bg-primary/20">
                    6 Month Trend
                  </Badge>
                </div>
              </div>

              <TabsContent value="line" className="h-80">
                <ChartContainer config={spendingChartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={spendingData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="var(--color-value)"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "var(--color-value)", strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: "var(--color-value)", strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>

              <TabsContent value="bar" className="h-80">
                <ChartContainer config={spendingChartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={spendingData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Breakdown and Invoice Statistics */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Expense Categories</CardTitle>
              <CardDescription>Breakdown of your expenses by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-6">
                <ChartContainer config={categoryChartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        nameKey="name"
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={Object.values(categoryChartConfig)[index].color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div className="space-y-4">
                {categoryProgress.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{category.name}</span>
                      <span>
                        ${category.current.toLocaleString()} / ${category.target.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Invoice Statistics</CardTitle>
              <CardDescription>Overview of your invoice status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-6">
                <ChartContainer config={invoiceChartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={invoiceData} layout="vertical">
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {invoiceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={Object.values(invoiceChartConfig)[index].color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-secondary/20">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium mb-1">Average Payment Time</div>
                    <div className="text-2xl font-bold">3.2 days</div>
                    <div className="text-xs text-success">-1.5 days from last month</div>
                  </CardContent>
                </Card>

                <Card className="bg-secondary/20">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium mb-1">Payment Success Rate</div>
                    <div className="text-2xl font-bold">98.5%</div>
                    <div className="text-xs text-success">+2.1% from last month</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Payment Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Payment Overview</CardTitle>
            <CardDescription>Polar view of your payment methods and currencies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4 text-center">Payment Methods</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Direct USDC", value: 65 },
                          { name: "Streaming", value: 25 },
                          { name: "Escrow", value: 10 },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#8b5cf6" />
                        <Cell fill="#6366f1" />
                        <Cell fill="#14b8a6" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4 text-center">Currencies</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "USDC", value: 80 },
                          { name: "SOL", value: 15 },
                          { name: "USDT", value: 5 },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#2775ca" />
                        <Cell fill="#14f195" />
                        <Cell fill="#26a17b" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
