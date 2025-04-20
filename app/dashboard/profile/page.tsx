"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Clock, Award, FileText, Star, Wallet, Copy } from "lucide-react"

export default function ProfilePage() {
  const [xp, setXp] = useState(1250)
  const [level, setLevel] = useState(5)
  const [nextLevelXp, setNextLevelXp] = useState(1500)
  const [progress, setProgress] = useState((1250 / 1500) * 100)

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // You would typically show a toast notification here
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
          <p className="text-muted-foreground">Manage your WorkPass ID and reputation.</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button>Export zkPaystub</Button>
        </div>
      </div>

      {/* Profile Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src="/placeholder.svg?height=128&width=128" />
                  <AvatarFallback className="text-3xl">US</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  Change Avatar
                </Button>
              </div>

              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Alex Chen</h2>
                    <Badge variant="outline" className="bg-primary/20">
                      Level {level} Contributor
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">Web3 Developer & Smart Contract Specialist</p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">alex.sol</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard("alex.sol")}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">WorkPass ID: WP-78945</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard("WP-78945")}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      Experience ({xp}/{nextLevelXp} XP)
                    </span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Solana</Badge>
                  <Badge variant="secondary">Smart Contracts</Badge>
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">DeFi</Badge>
                  <Badge variant="secondary">NFTs</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Profile Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Tabs defaultValue="achievements">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="contributions">Contributions</TabsTrigger>
            <TabsTrigger value="endorsements">Endorsements</TabsTrigger>
            <TabsTrigger value="edit">Edit Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
                <CardDescription>Badges and rewards earned through your work</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      title: "30 Days Streamed",
                      description: "Maintained active streams for 30 days",
                      icon: <Award className="h-8 w-8 text-primary" />,
                      date: "Apr 1, 2025",
                      unlocked: true,
                    },
                    {
                      title: "5 Clients Served",
                      description: "Completed work for 5 different clients",
                      icon: <Award className="h-8 w-8 text-primary" />,
                      date: "Mar 15, 2025",
                      unlocked: true,
                    },
                    {
                      title: "Perfect Payer",
                      description: "All invoices paid on time for 6 months",
                      icon: <Award className="h-8 w-8 text-primary" />,
                      date: "Feb 28, 2025",
                      unlocked: true,
                    },
                    {
                      title: "Trusted Contributor",
                      description: "Received 5+ endorsements from DAOs",
                      icon: <Award className="h-8 w-8 text-primary" />,
                      date: "Feb 10, 2025",
                      unlocked: true,
                    },
                    {
                      title: "Credit Elite",
                      description: "Maintained 750+ score for 3 months",
                      icon: <Award className="h-8 w-8 text-primary" />,
                      date: "Jan 30, 2025",
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
                    {
                      title: "Financial Stability",
                      description: "Consistent income for 12+ months",
                      icon: <Award className="h-8 w-8 text-muted-foreground" />,
                      unlocked: false,
                      progress: 75,
                    },
                  ].map((achievement, i) => (
                    <Card key={i} className={`bg-secondary/20 ${achievement.unlocked ? "border-primary/50" : ""}`}>
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="mb-4">{achievement.icon}</div>
                        <h3 className="text-sm font-bold mb-1">{achievement.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>

                        {achievement.unlocked ? (
                          <div className="text-xs text-muted-foreground">Earned on {achievement.date}</div>
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
          </TabsContent>

          <TabsContent value="contributions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contribution Timeline</CardTitle>
                <CardDescription>Your work history and contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {[
                    {
                      client: "CryptoDAO Collective",
                      role: "Smart Contract Developer",
                      period: "Mar 1, 2025 - Present",
                      description: "Developing and auditing smart contracts for the DAO's treasury management system.",
                      skills: ["Solana", "Rust", "Smart Contracts"],
                      ongoing: true,
                    },
                    {
                      client: "Solana Builders",
                      role: "UI/UX Consultant",
                      period: "Feb 1, 2025 - Mar 15, 2025",
                      description:
                        "Redesigned the frontend interface for the Solana Builders marketplace, improving user experience and transaction flow.",
                      skills: ["React", "TypeScript", "UI/UX"],
                      ongoing: false,
                    },
                    {
                      client: "Web3 Ventures",
                      role: "Frontend Developer",
                      period: "Dec 15, 2024 - Feb 10, 2025",
                      description:
                        "Built a responsive dashboard for tracking DeFi investments and yield farming strategies.",
                      skills: ["React", "Web3.js", "DeFi"],
                      ongoing: false,
                    },
                    {
                      client: "DeFi Protocol",
                      role: "Smart Contract Auditor",
                      period: "Nov 1, 2024 - Dec 15, 2024",
                      description:
                        "Conducted security audits for the protocol's lending and borrowing smart contracts.",
                      skills: ["Security", "Solana", "Smart Contracts"],
                      ongoing: false,
                    },
                  ].map((contribution, i) => (
                    <div key={i} className="relative pl-8 pb-8 border-l border-border last:border-0 last:pb-0">
                      <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                      <div className="space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <h3 className="font-bold">{contribution.client}</h3>
                          <Badge
                            variant="outline"
                            className={contribution.ongoing ? "bg-success/20 text-success" : "bg-secondary/20"}
                          >
                            {contribution.ongoing ? "Active" : "Completed"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {contribution.role} • {contribution.period}
                        </div>
                        <p className="text-sm">{contribution.description}</p>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {contribution.skills.map((skill, j) => (
                            <Badge key={j} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Auto-Generated Payslips</CardTitle>
                <CardDescription>Download your payment records</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {[
                    {
                      id: "PS-0025",
                      client: "CryptoDAO Collective",
                      amount: "$2,458.67",
                      period: "Apr 1 - Apr 19, 2025",
                      status: "Current",
                    },
                    {
                      id: "PS-0024",
                      client: "CryptoDAO Collective",
                      amount: "$5,000.00",
                      period: "Mar 1 - Mar 31, 2025",
                      status: "Complete",
                    },
                    {
                      id: "PS-0023",
                      client: "Solana Builders",
                      amount: "$3,750.00",
                      period: "Feb 1 - Mar 15, 2025",
                      status: "Complete",
                    },
                    {
                      id: "PS-0022",
                      client: "Web3 Ventures",
                      amount: "$4,500.00",
                      period: "Dec 15, 2024 - Feb 10, 2025",
                      status: "Complete",
                    },
                  ].map((payslip, i) => (
                    <div key={i} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="font-medium">{payslip.id}</div>
                        <div className="text-sm text-muted-foreground">{payslip.client}</div>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground mr-2">Period:</span>
                        {payslip.period}
                      </div>
                      <div className="font-medium">{payslip.amount}</div>
                      <Badge
                        variant="outline"
                        className={
                          payslip.status === "Complete"
                            ? "bg-success/20 text-success"
                            : "bg-secondary/20 text-muted-foreground"
                        }
                      >
                        {payslip.status === "Complete" ? (
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                        ) : (
                          <Clock className="mr-1 h-3 w-3" />
                        )}
                        {payslip.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="endorsements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>DAO Endorsements</CardTitle>
                <CardDescription>Endorsements from organizations you've worked with</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      name: "CryptoDAO Collective",
                      logo: "/placeholder.svg?height=48&width=48",
                      date: "Apr 10, 2025",
                      rating: 5,
                      comment:
                        "Alex has been an exceptional contributor to our smart contract development. Their work is thorough, secure, and delivered on time. We highly recommend them for any Solana development work.",
                      endorser: "Maria Chen, Tech Lead",
                    },
                    {
                      name: "Solana Builders",
                      logo: "/placeholder.svg?height=48&width=48",
                      date: "Mar 20, 2025",
                      rating: 5,
                      comment:
                        "Outstanding UI/UX work that significantly improved our user experience. Alex has a keen eye for design and strong technical implementation skills.",
                      endorser: "David Kim, Product Manager",
                    },
                    {
                      name: "Web3 Ventures",
                      logo: "/placeholder.svg?height=48&width=48",
                      date: "Feb 15, 2025",
                      rating: 4,
                      comment:
                        "Alex delivered a high-quality dashboard that exceeded our expectations. Their knowledge of DeFi and frontend development made them the perfect fit for our project.",
                      endorser: "Sarah Johnson, CEO",
                    },
                    {
                      name: "DeFi Protocol",
                      logo: "/placeholder.svg?height=48&width=48",
                      date: "Dec 20, 2024",
                      rating: 5,
                      comment:
                        "Thorough and meticulous in their security audit work. Alex identified several critical vulnerabilities that could have resulted in significant losses. Highly recommended for smart contract audits.",
                      endorser: "Michael Wong, CTO",
                    },
                  ].map((endorsement, i) => (
                    <div key={i} className="p-4 bg-secondary/20 rounded-lg">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={endorsement.logo || "/placeholder.svg"} />
                          <AvatarFallback>{endorsement.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                            <h3 className="font-bold">{endorsement.name}</h3>
                            <div className="text-sm text-muted-foreground">{endorsement.date}</div>
                          </div>
                          <div className="flex mb-2">
                            {[...Array(5)].map((_, j) => (
                              <Star
                                key={j}
                                className={`h-4 w-4 ${j < endorsement.rating ? "text-primary fill-primary" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                          <p className="text-sm mb-2">"{endorsement.comment}"</p>
                          <div className="text-sm text-muted-foreground">— {endorsement.endorser}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Request New Endorsement
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="edit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue="Alex Chen" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" defaultValue="alex.sol" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      defaultValue="Web3 Developer & Smart Contract Specialist with 5+ years of experience building on Solana and other blockchains. Specialized in secure smart contract development, auditing, and frontend integration."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills (comma separated)</Label>
                    <Input id="skills" defaultValue="Solana, Smart Contracts, React, TypeScript, DeFi, NFTs" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="wallet">Primary Wallet</Label>
                      <Input id="wallet" defaultValue="8xj7dkQcD9zw6rEcR7uVX3pWfxJ7Vd5U8QJMpzKUH2Zq" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Hourly Rate (USDC)</Label>
                      <Input id="hourlyRate" type="number" defaultValue="75" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio Links (one per line)</Label>
                    <Textarea
                      id="portfolio"
                      defaultValue="https://github.com/alexchen
https://alexchen.dev"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Payment Notifications",
                      description: "Receive alerts when you receive payments",
                      defaultChecked: true,
                    },
                    {
                      title: "Invoice Updates",
                      description: "Get notified about invoice status changes",
                      defaultChecked: true,
                    },
                    {
                      title: "New Endorsements",
                      description: "Be alerted when you receive a new endorsement",
                      defaultChecked: true,
                    },
                    {
                      title: "Credit Score Changes",
                      description: "Notifications about changes to your credit score",
                      defaultChecked: true,
                    },
                    {
                      title: "Treasury Alerts",
                      description: "Updates about your treasury performance",
                      defaultChecked: false,
                    },
                    {
                      title: "Marketing Updates",
                      description: "News and updates about Paymint features",
                      defaultChecked: false,
                    },
                  ].map((pref, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{pref.title}</h3>
                        <p className="text-sm text-muted-foreground">{pref.description}</p>
                      </div>
                      <div className="flex h-6 items-center">
                        <input
                          id={`notification-${i}`}
                          type="checkbox"
                          className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                          defaultChecked={pref.defaultChecked}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
