"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, CreditCard, Repeat, Gift, ArrowRight, Plus, Calendar, DollarSign, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

export default function OrderTemplatesPage() {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    amount: "",
    currency: "USDC",
    recipient: "",
    dueDate: "",
    recurring: false,
    frequency: "monthly",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template)
    setIsCreateOpen(true)

    // Pre-fill form based on template
    switch (template) {
      case "invoice":
        setFormData({
          name: "Standard Invoice",
          description: "One-time invoice for services or products",
          type: "invoice",
          amount: "",
          currency: "USDC",
          recipient: "",
          dueDate: "",
          recurring: false,
          frequency: "monthly",
        })
        break
      case "subscription":
        setFormData({
          name: "Subscription Payment",
          description: "Recurring payment on a schedule",
          type: "subscription",
          amount: "",
          currency: "USDC",
          recipient: "",
          dueDate: "",
          recurring: true,
          frequency: "monthly",
        })
        break
      case "donation":
        setFormData({
          name: "Donation",
          description: "One-time or recurring donation",
          type: "donation",
          amount: "",
          currency: "USDC",
          recipient: "",
          dueDate: "",
          recurring: false,
          frequency: "monthly",
        })
        break
      default:
        break
    }
  }

  const nextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    // In a real app, this would create the order and redirect to it
    console.log("Form submitted:", formData)
    setIsCreateOpen(false)
    setCurrentStep(1)
    router.push("/orders")
  }

  const templates = [
    {
      id: "invoice",
      title: "Standard Invoice",
      description: "Create a one-time invoice for services or products",
      icon: <FileText className="h-10 w-10 text-primary" />,
      features: ["Customizable line items", "Payment terms", "Due date", "Notes and attachments"],
    },
    {
      id: "subscription",
      title: "Subscription",
      description: "Set up recurring payments on a schedule",
      icon: <Repeat className="h-10 w-10 text-primary" />,
      features: [
        "Weekly, monthly, or custom frequency",
        "Automatic billing",
        "Payment history tracking",
        "Cancellation options",
      ],
    },
    {
      id: "donation",
      title: "Donation",
      description: "Accept one-time or recurring donations",
      icon: <Gift className="h-10 w-10 text-primary" />,
      features: ["Optional donation amounts", "Donor information", "Thank you messages", "Impact reporting"],
    },
    {
      id: "payment-link",
      title: "Payment Link",
      description: "Create a simple payment link to share",
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      features: ["Shareable URL", "QR code generation", "Payment tracking", "Expiration settings"],
    },
  ]

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invoice">Invoice</SelectItem>
                    <SelectItem value="subscription">Subscription</SelectItem>
                    <SelectItem value="donation">Donation</SelectItem>
                    <SelectItem value="payment-link">Payment Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={nextStep}>Next Step</Button>
            </DialogFooter>
          </>
        )
      case 2:
        return (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currency" className="text-right">
                  Currency
                </Label>
                <Select value={formData.currency} onValueChange={(value) => handleSelectChange("currency", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="SOL">SOL</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="recipient" className="text-right">
                  Recipient
                </Label>
                <Input
                  id="recipient"
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleInputChange}
                  placeholder="Wallet address or username"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={nextStep}>Next Step</Button>
            </DialogFooter>
          </>
        )
      case 3:
        return (
          <>
            <div className="grid gap-4 py-4">
              {formData.type === "subscription" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="frequency" className="text-right">
                    Frequency
                  </Label>
                  <Select value={formData.frequency} onValueChange={(value) => handleSelectChange("frequency", value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-4">
                <div className="rounded-lg bg-secondary/20 p-4">
                  <h3 className="font-medium mb-2">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium capitalize">{formData.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium">
                        {formData.amount} {formData.currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Recipient:</span>
                      <span className="font-medium">{formData.recipient || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Due Date:</span>
                      <span className="font-medium">{formData.dueDate || "Not specified"}</span>
                    </div>
                    {formData.type === "subscription" && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Frequency:</span>
                        <span className="font-medium capitalize">{formData.frequency}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={handleSubmit}>Create Order</Button>
            </DialogFooter>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Templates</h1>
          <p className="text-muted-foreground">Choose a template to create a new order</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button asChild>
            <a href="/orders">View All Orders</a>
          </Button>
        </div>
      </div>

      {/* Template Selection */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="invoice">Invoices</TabsTrigger>
            <TabsTrigger value="subscription">Subscriptions</TabsTrigger>
            <TabsTrigger value="donation">Donations</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    className="h-full hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="mb-4 p-3 rounded-full bg-primary/10">{template.icon}</div>
                      <h3 className="text-xl font-bold mb-2">{template.title}</h3>
                      <p className="text-muted-foreground mb-4">{template.description}</p>
                      <ul className="text-sm text-left space-y-2 w-full mb-6">
                        {template.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="mt-auto w-full">
                        Use Template
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: templates.length * 0.1 }}
              >
                <Card className="h-full border-dashed hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                    <div className="mb-4 p-3 rounded-full bg-secondary/20">
                      <Plus className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Custom Template</h3>
                    <p className="text-muted-foreground mb-6">Create a completely custom order from scratch</p>
                    <Button variant="outline" className="mt-auto w-full">
                      Create Custom
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="invoice">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates
                .filter((t) => t.id === "invoice")
                .map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card
                      className="h-full hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="mb-4 p-3 rounded-full bg-primary/10">{template.icon}</div>
                        <h3 className="text-xl font-bold mb-2">{template.title}</h3>
                        <p className="text-muted-foreground mb-4">{template.description}</p>
                        <ul className="text-sm text-left space-y-2 w-full mb-6">
                          {template.features.map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button className="mt-auto w-full">
                          Use Template
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="subscription">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates
                .filter((t) => t.id === "subscription")
                .map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card
                      className="h-full hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="mb-4 p-3 rounded-full bg-primary/10">{template.icon}</div>
                        <h3 className="text-xl font-bold mb-2">{template.title}</h3>
                        <p className="text-muted-foreground mb-4">{template.description}</p>
                        <ul className="text-sm text-left space-y-2 w-full mb-6">
                          {template.features.map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button className="mt-auto w-full">
                          Use Template
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="donation">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates
                .filter((t) => t.id === "donation")
                .map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card
                      className="h-full hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="mb-4 p-3 rounded-full bg-primary/10">{template.icon}</div>
                        <h3 className="text-xl font-bold mb-2">{template.title}</h3>
                        <p className="text-muted-foreground mb-4">{template.description}</p>
                        <ul className="text-sm text-left space-y-2 w-full mb-6">
                          {template.features.map((feature, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button className="mt-auto w-full">
                          Use Template
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Recently Used Templates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recently Used Templates</CardTitle>
            <CardDescription>Quick access to your frequently used templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-secondary/20 hover:bg-secondary/30 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center">
                  <div className="mr-4 p-2 rounded-full bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Monthly Invoice</h3>
                    <p className="text-xs text-muted-foreground">Last used: 3 days ago</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-secondary/20 hover:bg-secondary/30 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center">
                  <div className="mr-4 p-2 rounded-full bg-primary/10">
                    <Repeat className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Weekly Subscription</h3>
                    <p className="text-xs text-muted-foreground">Last used: 1 week ago</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-secondary/20 hover:bg-secondary/30 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center">
                  <div className="mr-4 p-2 rounded-full bg-primary/10">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Donation Link</h3>
                    <p className="text-xs text-muted-foreground">Last used: 2 weeks ago</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Template Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Template Features</CardTitle>
            <CardDescription>Learn about the different template types and their capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-4 p-2 rounded-full bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold">Invoices</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <DollarSign className="h-4 w-4 text-primary mr-2 mt-0.5" />
                    <span>Fixed or variable amounts</span>
                  </li>
                  <li className="flex items-start">
                    <Calendar className="h-4 w-4 text-primary mr-2 mt-0.5" />
                    <span>Customizable due dates</span>
                  </li>
                  <li className="flex items-start">
                    <Clock className="h-4 w-4 text-primary mr-2 mt-0.5" />
                    <span>Payment reminders</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-4 p-2 rounded-full bg-primary/10">
                    <Repeat className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold">Subscriptions</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Calendar className="h-4 w-4 text-primary mr-2 mt-0.5" />
                    <span>Flexible billing cycles</span>
                  </li>
                  <li className="flex items-start">
                    <Clock className="h-4 w-4 text-primary mr-2 mt-0.5" />
                    <span>Automatic payments</span>
                  </li>
                  <li className="flex items-start">
                    <DollarSign className="h-4 w-4 text-primary mr-2 mt-0.5" />
                    <span>Usage-based billing options</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-4 p-2 rounded-full bg-primary/10">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold">Donations</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <DollarSign className="h-4 w-4 text-primary mr-2 mt-0.5" />
                    <span>Suggested donation amounts</span>
                  </li>
                  <li className="flex items-start">
                    <Repeat className="h-4 w-4 text-primary mr-2 mt-0.5" />
                    <span>One-time or recurring options</span>
                  </li>
                  <li className="flex items-start">
                    <CreditCard className="h-4 w-4 text-primary mr-2 mt-0.5" />
                    <span>Anonymous donation support</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Template Creation Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentStep === 1 && "Create New Order"}
              {currentStep === 2 && "Order Details"}
              {currentStep === 3 && "Review & Confirm"}
            </DialogTitle>
            <DialogDescription>
              {currentStep === 1 && "Set up the basic information for your order"}
              {currentStep === 2 && "Enter payment details and recipient information"}
              {currentStep === 3 && "Review your order details before creating"}
            </DialogDescription>
          </DialogHeader>

          <div className="relative mb-6">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-secondary"></div>
            <div className="relative flex justify-between">
              <div
                className={`flex flex-col items-center ${currentStep >= 1 ? "text-primary" : "text-muted-foreground"}`}
              >
                <div
                  className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ${currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
                >
                  1
                </div>
                <span className="mt-2 text-xs">Basics</span>
              </div>
              <div
                className={`flex flex-col items-center ${currentStep >= 2 ? "text-primary" : "text-muted-foreground"}`}
              >
                <div
                  className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ${currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
                >
                  2
                </div>
                <span className="mt-2 text-xs">Details</span>
              </div>
              <div
                className={`flex flex-col items-center ${currentStep >= 3 ? "text-primary" : "text-muted-foreground"}`}
              >
                <div
                  className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ${currentStep >= 3 ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
                >
                  3
                </div>
                <span className="mt-2 text-xs">Review</span>
              </div>
            </div>
          </div>

          {renderStepContent()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
