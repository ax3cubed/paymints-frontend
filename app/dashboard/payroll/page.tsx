"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight, DollarSign, CheckCircle2, ChevronRight, Award } from "lucide-react"

export default function PayrollStreamingPage() {
  const [balance, setBalance] = useState(2458.67)
  const [progress, setProgress] = useState(65)
  const [secondsElapsed, setSecondsElapsed] = useState(0)

  // Simulate balance increasing in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setBalance((prev) => {
        const newBalance = prev + 0.01
        return Number.parseFloat(newBalance.toFixed(2))
      })

      setProgress((prev) => {
        if (prev >= 100) return 0
        return prev + 0.1
      })

      setSecondsElapsed((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Format seconds to HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":")
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll Streaming</h1>
          <p className="text-muted-foreground">Watch your earnings flow in real-time.</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button>
            <DollarSign className="mr-2 h-4 w-4" />
            Withdraw Funds
          </Button>
        </div>
      </div>

      {/* Live Streaming Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary/10">
            <div className="flex items-center justify-between">
              <CardTitle>Live Earnings Stream</CardTitle>
              <Badge variant="outline" className="bg-success/20 text-success">
                Active
              </Badge>
            </div>
            <CardDescription>Watch your USDC flow into your wallet in real-time</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative h-64 bg-secondary/20 overflow-hidden">
              <div className="absolute inset-0 stream-animation"></div>

              {/* Animated USDC coins */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex items-center">
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center"
                      initial={{
                        x: -200,
                        y: Math.random() * 100 - 50,
                        opacity: 0,
                      }}
                      animate={{
                        x: 200,
                        opacity: [0, 1, 1, 0],
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 3 + Math.random() * 2,
                        delay: i * 0.5,
                        ease: "linear",
                      }}
                    >
                      <span className="text-lg font-bold">$</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Live counter */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold mb-2 glow-text">${balance.toLocaleString()}</div>
                <div className="text-muted-foreground">Earned so far this month</div>
                <div className="mt-4 flex items-center text-success">
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                  <span>+$0.01 per second</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Current Session</div>
                  <div className="text-2xl font-bold">{formatTime(secondsElapsed)}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Rate</div>
                  <div className="text-2xl font-bold">$36.00 / hour</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">This Session</div>
                  <div className="text-2xl font-bold">${(secondsElapsed * 0.01).toFixed(2)}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pay Period Progress</span>
                  <span>{progress.toFixed(1)}%</span>
                </div>
                <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="stream-animation absolute inset-0 h-full w-full"></div>
                  <div
                    className="relative h-full bg-primary transition-all duration-500 ease-in-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>April 1, 2025</span>
                  <span>April 30, 2025</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Streams */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Active Payment Streams</CardTitle>
            <CardDescription>Your current active payment streams</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {[
                {
                  client: "CryptoDAO Collective",
                  role: "Smart Contract Developer",
                  rate: "$5,000.00 / month",
                  earned: "$2,458.67",
                  status: "Active",
                },
                {
                  client: "Solana Builders",
                  role: "UI/UX Consultant",
                  rate: "$75.00 / hour",
                  earned: "$1,125.00",
                  status: "Active",
                },
              ].map((stream, i) => (
                <div key={i} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="font-medium">{stream.client}</div>
                    <div className="text-sm text-muted-foreground">{stream.role}</div>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground mr-2">Rate:</span>
                    {stream.rate}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground mr-2">Earned:</span>
                    {stream.earned}
                  </div>
                  <Badge variant="outline" className="bg-success/20 text-success w-fit">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    {stream.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your past payment streams and withdrawals</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {[
                {
                  client: "Web3 Ventures",
                  description: "Frontend Development",
                  amount: "$3,750.00",
                  date: "Mar 15 - Apr 15, 2025",
                  status: "Completed",
                },
                {
                  client: "DeFi Protocol",
                  description: "Smart Contract Audit",
                  amount: "$2,500.00",
                  date: "Feb 1 - Feb 28, 2025",
                  status: "Completed",
                },
                {
                  client: "NFT Marketplace",
                  description: "UI Design",
                  amount: "$4,200.00",
                  date: "Jan 10 - Feb 10, 2025",
                  status: "Completed",
                },
              ].map((payment, i) => (
                <div key={i} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="font-medium">{payment.client}</div>
                    <div className="text-sm text-muted-foreground">{payment.description}</div>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground mr-2">Period:</span>
                    {payment.date}
                  </div>
                  <div className="font-medium">{payment.amount}</div>
                  <Badge variant="outline" className="bg-secondary/20 text-muted-foreground w-fit">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    {payment.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    View Receipt
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t p-4">
            <Button variant="ghost" className="w-full" size="sm">
              View All History
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Your Achievements</CardTitle>
            <CardDescription>Gamified rewards for your work milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  title: "30 Days Streamed",
                  description: "Maintained active streams for 30 days",
                  icon: <Award className="h-8 w-8 text-primary" />,
                  unlocked: true,
                },
                {
                  title: "5 Clients Served",
                  description: "Completed work for 5 different clients",
                  icon: <Award className="h-8 w-8 text-primary" />,
                  unlocked: true,
                },
                {
                  title: "100 Days Streamed",
                  description: "Maintained active streams for 100 days",
                  icon: <Award className="h-8 w-8 text-muted-foreground" />,
                  unlocked: false,
                  progress: 65,
                },
                {
                  title: "$10K Earned",
                  description: "Earned $10,000 through Paymint",
                  icon: <Award className="h-8 w-8 text-muted-foreground" />,
                  unlocked: false,
                  progress: 78,
                },
              ].map((achievement, i) => (
                <Card key={i} className={`bg-secondary/20 ${achievement.unlocked ? "border-primary/50 glow" : ""}`}>
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="mb-4">{achievement.icon}</div>
                    <h3 className="text-sm font-bold mb-1">{achievement.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>

                    {achievement.unlocked ? (
                      <Badge variant="outline" className="bg-success/20 text-success">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Unlocked
                      </Badge>
                    ) : (
                      <div className="w-full space-y-1">
                        <Progress value={achievement.progress} className="h-1" />
                        <div className="text-xs text-muted-foreground">{achievement.progress}%</div>
                      </div>
                    )}
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
