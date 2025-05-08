"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ArrowUpRight, CheckCircle2, Shield, Award, TrendingUp, FileText, Users, Calendar } from "lucide-react"

export default function CreditScorePage() {
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [advanceAmount, setAdvanceAmount] = useState([1000])
  const [maxAdvance, setMaxAdvance] = useState(2500)

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Credit Score</h1>
          <p className="text-muted-foreground">Your on-chain reputation and credit worthiness.</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
            <DialogTrigger asChild>
              <Button>Request Advance</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Request Payment Advance</DialogTitle>
                <DialogDescription>
                  Based on your credit score, you can request an advance on future payments.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <Label>Advance Amount (USDC)</Label>
                    <span className="font-medium">${advanceAmount[0]}</span>
                  </div>
                  <Slider
                    value={advanceAmount}
                    onValueChange={setAdvanceAmount}
                    max={maxAdvance}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$0</span>
                    <span>Max: ${maxAdvance}</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="repayment" className="text-right">
                    Repayment Term
                  </Label>
                  <div className="col-span-3">
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="30days">30 Days</option>
                      <option value="60days">60 Days</option>
                      <option value="90days">90 Days</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fee" className="text-right">
                    Service Fee
                  </Label>
                  <div className="col-span-3">
                    <Input id="fee" value={`${(advanceAmount[0] * 0.02).toFixed(2)} USDC (2%)`} disabled />
                  </div>
                </div>

                <div className="rounded-lg bg-secondary/20 p-4 text-sm">
                  <p className="font-medium mb-2">Repayment Details</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Advance Amount: ${advanceAmount[0]} USDC</li>
                    <li>• Service Fee: ${(advanceAmount[0] * 0.02).toFixed(2)} USDC</li>
                    <li>• Total to Repay: ${(advanceAmount[0] * 1.02).toFixed(2)} USDC</li>
                    <li>• Repayment: Automatic deduction from future invoices</li>
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRequestOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsRequestOpen(false)}>Confirm Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Credit Score Meter */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary/10">
            <CardTitle>Your Credit Score</CardTitle>
            <CardDescription>Based on your on-chain activity, payment history, and work reputation</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-5xl font-bold glow-text">780</div>
                  <div className="absolute bottom-12 text-sm text-muted-foreground">out of 850</div>
                </div>
                <svg className="w-full h-full rotate-slow" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(139, 92, 246, 0.1)" strokeWidth="10" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(139, 92, 246, 0.8)"
                    strokeWidth="10"
                    strokeDasharray="282.7"
                    strokeDashoffset="62.2" // 282.7 * (1 - 780/850)
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Score Breakdown</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Payment History</span>
                        <span>Excellent</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Work Reputation</span>
                        <span>Very Good</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>DAO Endorsements</span>
                        <span>Good</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>On-Chain Activity</span>
                        <span>Excellent</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-success">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-sm">Your score increased by 15 points in the last 30 days</span>
                </div>

                <div className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Advance Eligibility</h3>
                    <Badge variant="outline" className="bg-success/20 text-success">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Eligible
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Based on your current score, you can request an advance of up to{" "}
                    <span className="font-medium text-foreground">${maxAdvance} USDC</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Score Factors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Score Factors</CardTitle>
            <CardDescription>Key factors that influence your credit score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-success flex items-center">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Positive Factors
                </h3>
                <ul className="space-y-3">
                  {[
                    {
                      title: "Perfect Payment History",
                      description: "All invoices paid on time in the last 6 months",
                      icon: <FileText className="h-5 w-5 text-success" />,
                    },
                    {
                      title: "Strong Client Relationships",
                      description: "Repeat work with 3+ clients",
                      icon: <Users className="h-5 w-5 text-success" />,
                    },
                    {
                      title: "Consistent Work History",
                      description: "Regular income streams for 4+ months",
                      icon: <Calendar className="h-5 w-5 text-success" />,
                    },
                    {
                      title: "DAO Endorsements",
                      description: "Endorsed by 2 reputable DAOs",
                      icon: <Shield className="h-5 w-5 text-success" />,
                    },
                  ].map((factor, i) => (
                    <li key={i} className="flex items-start">
                      <div className="mr-3 mt-0.5">{factor.icon}</div>
                      <div>
                        <div className="font-medium">{factor.title}</div>
                        <div className="text-sm text-muted-foreground">{factor.description}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-muted-foreground flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-3">
                  {[
                    {
                      title: "Diversify Client Base",
                      description: "Work with more clients to improve stability",
                      icon: <Users className="h-5 w-5 text-muted-foreground" />,
                    },
                    {
                      title: "Increase Work Volume",
                      description: "Take on more projects to build stronger history",
                      icon: <FileText className="h-5 w-5 text-muted-foreground" />,
                    },
                  ].map((factor, i) => (
                    <li key={i} className="flex items-start">
                      <div className="mr-3 mt-0.5">{factor.icon}</div>
                      <div>
                        <div className="font-medium">{factor.title}</div>
                        <div className="text-sm text-muted-foreground">{factor.description}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Advance History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Advance History</CardTitle>
            <CardDescription>Your payment advance history and repayments</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {[
                {
                  amount: "$1,500.00",
                  date: "Mar 15, 2025",
                  repaymentDate: "Apr 15, 2025",
                  status: "Repaid",
                },
                {
                  amount: "$1,000.00",
                  date: "Feb 1, 2025",
                  repaymentDate: "Mar 1, 2025",
                  status: "Repaid",
                },
                {
                  amount: "$750.00",
                  date: "Dec 15, 2024",
                  repaymentDate: "Jan 15, 2025",
                  status: "Repaid",
                },
              ].map((advance, i) => (
                <div key={i} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="font-medium">{advance.amount}</div>
                    <div className="text-sm text-muted-foreground">Requested on {advance.date}</div>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground mr-2">Repayment:</span>
                    {advance.repaymentDate}
                  </div>
                  <Badge variant="outline" className="bg-success/20 text-success w-fit">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    {advance.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Credit Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Credit Achievements</CardTitle>
            <CardDescription>Milestones that boost your credit score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  title: "Perfect Payer",
                  description: "All invoices paid on time for 6 months",
                  icon: <Award className="h-8 w-8 text-primary" />,
                  unlocked: true,
                },
                {
                  title: "Trusted Contributor",
                  description: "Received 5+ endorsements from DAOs",
                  icon: <Award className="h-8 w-8 text-primary" />,
                  unlocked: true,
                },
                {
                  title: "Credit Elite",
                  description: "Maintained 750+ score for 3 months",
                  icon: <Award className="h-8 w-8 text-primary" />,
                  unlocked: true,
                },
                {
                  title: "Financial Stability",
                  description: "Consistent income for 12+ months",
                  icon: <Award className="h-8 w-8 text-muted-foreground" />,
                  unlocked: false,
                  progress: 75,
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

      {/* Credit Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Improve Your Score</CardTitle>
            <CardDescription>Tips to boost your credit score and increase advance eligibility</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-secondary/20 p-4">
                <h3 className="font-medium mb-2">Complete Your Profile</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Add more details to your WorkPass ID to improve your score by up to 20 points.
                </p>
                <Button size="sm" variant="outline">
                  Update Profile
                </Button>
              </div>

              <div className="rounded-lg bg-secondary/20 p-4">
                <h3 className="font-medium mb-2">Request DAO Endorsements</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Each endorsement from a verified DAO can boost your score by 10-15 points.
                </p>
                <Button size="sm" variant="outline">
                  Request Endorsement
                </Button>
              </div>

              <div className="rounded-lg bg-secondary/20 p-4">
                <h3 className="font-medium mb-2">Maintain Payment Consistency</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Continue to pay all invoices on time to maintain your excellent payment history.
                </p>
                <Button size="sm" variant="outline">
                  View Payment Schedule
                </Button>
              </div>

              <div className="rounded-lg bg-secondary/20 p-4">
                <h3 className="font-medium mb-2">Increase Work Volume</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Taking on more projects demonstrates stability and can improve your score.
                </p>
                <Button size="sm" variant="outline">
                  Find Opportunities
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
