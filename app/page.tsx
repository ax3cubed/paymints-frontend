"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ChevronDown, Play, DollarSign, Brain, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAtom } from "jotai"
import { isAuthenticatedAtom } from "@/lib/atoms"

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0)
  const [isAuthenticated] = useAtom(isAuthenticatedAtom)
  const { connectWallet } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLaunchApp = () => {
    if (isAuthenticated) {
      router.push("/dashboard")
    } else {
      // If not authenticated, the WalletConnectButton will handle showing the login modal
      connectWallet()
    }
  }

  const features = [
    {
      title: "Payroll Streaming",
      description: "Real-time compensation streams directly to your wallet. Get paid by the second, not by the month.",
      icon: <DollarSign className="h-10 w-10 text-primary" />,
      delay: 0.1,
    },
    {
      title: "AI Credit Scoring",
      description: "Unlock advances based on your on-chain reputation and work history.",
      icon: <Brain className="h-10 w-10 text-primary" />,
      delay: 0.2,
    },
    {
      title: "Treasury Management",
      description: "Optimize idle funds with automated yield strategies while ensuring payroll liquidity.",
      icon: <BarChart3 className="h-10 w-10 text-primary" />,
      delay: 0.3,
    },
  ]

  const testimonials = [
    {
      quote:
        "Paymint revolutionized how our DAO compensates contributors. Real-time streaming means our team is always motivated.",
      author: "CryptoDAO Collective",
      role: "Governance Lead",
    },
    {
      quote:
        "As a freelancer, getting paid instantly rather than waiting 30+ days has completely changed my financial stability.",
      author: "Alex Chen",
      role: "Web3 Developer",
    },
    {
      quote: "The treasury management features helped us earn yield while ensuring we always have funds for payroll.",
      author: "Solana Builders",
      role: "Treasury Manager",
    },
  ]

  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <Image src="/images/paymint-logo.png" alt="Paymint Logo" width={40} height={40} className="mr-2" />
              <span className="text-2xl font-bold gradient-text">Paymint</span>
            </motion.div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <motion.a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Features
            </motion.a>
            <motion.a
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              How It Works
            </motion.a>
            <motion.a
              href="#testimonials"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Testimonials
            </motion.a>
          </div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <WalletConnectButton id="connect-wallet-btn" className="mr-2 hidden sm:inline-flex" />
            <Button onClick={handleLaunchApp}>Launch App</Button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-background z-10"></div>
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge variant="outline" className="mb-4 py-1.5 px-4 text-sm bg-secondary/50 backdrop-blur-sm">
                Built on Solana
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6 gradient-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              The Future of Work Finance
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground mb-8 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              A Web3-native payroll, invoicing, and credit protocol built for crypto-native users, freelancers, and
              DAOs.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button size="lg" className="px-8" onClick={handleLaunchApp}>
                Launch App <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                <Play className="mr-2 h-4 w-4" /> View Demo
              </Button>
            </motion.div>

            {/* Animated USDC Stream Visualization */}
            <motion.div
              className="relative w-full max-w-3xl h-64 rounded-xl bg-secondary/30 backdrop-blur-sm gradient-border overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="absolute inset-0 stream-animation"></div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex items-center">
                  <motion.div
                    className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center"
                    animate={{
                      x: [-150, 150],
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 3,
                      ease: "linear",
                    }}
                  >
                    <span className="text-xl font-bold">$</span>
                  </motion.div>

                  <motion.div
                    className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center"
                    animate={{
                      x: [-120, 180],
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 4,
                      delay: 0.5,
                      ease: "linear",
                    }}
                  >
                    <span className="text-lg font-bold">$</span>
                  </motion.div>

                  <motion.div
                    className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center"
                    animate={{
                      x: [-100, 200],
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 3.5,
                      delay: 1,
                      ease: "linear",
                    }}
                  >
                    <span className="text-base font-bold">$</span>
                  </motion.div>
                </div>
              </div>

              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="px-4 py-2 rounded-lg bg-background/50 backdrop-blur-sm text-sm">
                  Live USDC streaming in action
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
          <motion.a
            href="#features"
            className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors pb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <span className="text-sm mb-2">Discover More</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </motion.a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 gradient-text"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Reimagine Work Finance
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Paymint combines the best of DeFi with traditional finance to create a seamless work finance experience.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: feature.delay }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-secondary/30 backdrop-blur-sm border-secondary hover:border-primary/50 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="mb-4 p-3 rounded-full bg-primary/10">{feature.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 gradient-text"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              How It Works
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              A seamless experience from onboarding to getting paid
            </motion.p>
          </div>

          <div className="max-w-4xl mx-auto">
            {[
              {
                step: 1,
                title: "Connect Your Wallet",
                description: "Link your Solana wallet to access the Paymint ecosystem.",
                delay: 0.1,
              },
              {
                step: 2,
                title: "Set Up Your Profile",
                description: "Create your WorkPass ID and customize your payment preferences.",
                delay: 0.2,
              },
              {
                step: 3,
                title: "Send or Receive Invoices",
                description: "Create detailed invoices or receive them from clients and DAOs.",
                delay: 0.3,
              },
              {
                step: 4,
                title: "Get Paid in Real-Time",
                description: "Watch your earnings stream into your wallet by the second.",
                delay: 0.4,
              },
              {
                step: 5,
                title: "Optimize Your Treasury",
                description: "Put idle funds to work with automated yield strategies.",
                delay: 0.5,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="flex items-start mb-12 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: step.delay }}
                viewport={{ once: true }}
              >
                {index < 4 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-primary/80 to-primary/0"></div>
                )}

                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center mr-6 z-10">
                  <span className="font-bold">{step.step}</span>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 gradient-text"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              What Our Users Say
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Join the growing community of Web3 professionals using Paymint
            </motion.p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative h-64">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className={cn(
                    "absolute inset-0 p-8 rounded-xl bg-secondary/30 backdrop-blur-sm gradient-border flex flex-col justify-center",
                    activeTestimonial === index ? "opacity-100" : "opacity-0 pointer-events-none",
                  )}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: activeTestimonial === index ? 1 : 0,
                    scale: activeTestimonial === index ? 1 : 0.95,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-bold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-3 h-3 rounded-full mx-1 transition-colors",
                    activeTestimonial === index ? "bg-primary" : "bg-secondary",
                  )}
                  onClick={() => setActiveTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">Ready to Transform Your Work Finance?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of Web3 professionals and organizations already using Paymint.
            </p>
            <Button size="lg" className="px-8" onClick={handleLaunchApp}>
              Launch App <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 flex items-center">
              <Image src="/images/paymint-logo.png" alt="Paymint Logo" width={40} height={40} className="mr-2" />
              <div>
                <div className="text-2xl font-bold gradient-text mb-2">Paymint</div>
                <p className="text-muted-foreground">The Future of Work Finance</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h3 className="font-bold mb-3">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Roadmap
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-3">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      API
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Guides
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-3">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Careers
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Paymint. All rights reserved.</p>
            <div className="mt-2 flex justify-center space-x-4">
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
