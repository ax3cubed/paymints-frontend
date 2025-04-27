"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Wallet,
  Copy,
  QrCode,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"
import { useWallet } from "@solana/wallet-adapter-react"
import { useSolana } from "@/components/solana/solana-provider"
import { useFetchTokens } from "@/hooks/use-fetch-tokens"
import { useFetchTransactions } from "@/hooks/use-fetch-transactions"


export default function WalletPage() {

  const [isDepositOpen, setIsDepositOpen] = useState(false)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [isSwapOpen, setIsSwapOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [depositCurrency, setDepositCurrency] = useState("USDC")
  const [withdrawCurrency, setWithdrawCurrency] = useState("USDC")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [swapFromCurrency, setSwapFromCurrency] = useState("USDC")
  const [swapToCurrency, setSwapToCurrency] = useState("SOL")
  const [swapAmount, setSwapAmount] = useState("")
  const { publicKey, sendTransaction } = useWallet()
  const { rpc: connection } = useSolana()
  const [isLoading, setIsLoading] = useState(false)
  // Mock wallet data
  const walletAddress = publicKey?.toString() || "";
  const { tokens, isLoading: isfetTokenLoading } = useFetchTokens(publicKey, connection)
const { transactions,isLoading:isFetchTransactionsLoading } = useFetchTransactions(publicKey, connection)

  const walletBalances = tokens.map((token) => ({
    currency: token.symbol || token.name || "Unknown",
    balance: token.amount,
    value: token.amount * 1, // Assuming 1:1 for simplicity
    icon: token.logo,
  }))

  const totalBalance = walletBalances.reduce((sum, currency) => sum + currency.value, 0)


  const openExplorer = (signature: string) => {
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet"
    const url = `https://explorer.solana.com/tx/${signature}${network !== "mainnet-beta" ? `?cluster=${network}` : ""}`
    window.open(url, "_blank")
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast("Copied to clipboard", {

      description: "Wallet address has been copied to your clipboard.",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`
  }

  const handleDeposit = (currency: string) => {
    setDepositCurrency(currency)
    setIsDepositOpen(true)
  }

  const handleWithdraw = (currency: string) => {
    setWithdrawCurrency(currency)
    setIsWithdrawOpen(true)
  }

  const executeWithdraw = () => {
    toast("Withdrawal initiated", {
      description: `${withdrawAmount} ${withdrawCurrency} withdrawal has been initiated.`,
    })
    setIsWithdrawOpen(false)
    setWithdrawAmount("")
  }

  const executeSwap = () => {
    toast("Swap executed", {
      description: `Successfully swapped ${swapAmount} ${swapFromCurrency} to ${swapToCurrency}.`,
    })
    setIsSwapOpen(false)
    setSwapAmount("")
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
          <p className="text-muted-foreground">Manage your crypto assets and transactions</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button variant="outline" onClick={() => setIsDepositOpen(true)}>
            <ArrowDownRight className="mr-2 h-4 w-4" />
            Deposit
          </Button>
          <Button variant="outline" onClick={() => setIsWithdrawOpen(true)}>
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Withdraw
          </Button>
          <Button onClick={() => setIsSwapOpen(true)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Swap
          </Button>
        </div>
      </div>

      {/* Wallet Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle>Wallet Overview</CardTitle>
            <CardDescription>Your wallet address and total balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Wallet Address</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-3 bg-secondary/20 rounded-lg break-all text-sm">{formatAddress(walletAddress)}</div>
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(walletAddress)}>
                    {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="icon">
                    <QrCode className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">Total Balance</h3>
                  <Badge variant="outline" className="ml-auto">
                    Multi-currency
                  </Badge>
                </div>
                <div className="text-3xl font-bold">${totalBalance.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Across {walletBalances.length} currencies</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Currency Balances */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Currency Balances</CardTitle>
            <CardDescription>Your balances across different cryptocurrencies</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="stablecoins">Stablecoins</TabsTrigger>
                <TabsTrigger value="tokens">Tokens</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {walletBalances.map((currency, index) => (
                    <Card key={index} className="bg-secondary/10">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                              {currency.icon ? (
                                <img
                                  src={currency.icon || "/placeholder.svg"}
                                  alt={currency.currency}
                                  className="w-6 h-6"
                                />
                              ) : (
                                <span className="text-xs font-bold">{currency.currency}</span>
                              )}
                            </div>
                            <span className="font-medium">{currency.currency}</span>
                          </div>
                          <Badge variant="outline">{((currency.value / totalBalance) * 100).toFixed(1)}%</Badge>
                        </div>
                        <div className="text-2xl font-bold mb-1">
                          {currency.balance.toLocaleString()} {currency.currency}
                        </div>
                        <div className="text-sm text-muted-foreground">${currency.value.toLocaleString()}</div>

                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleDeposit(currency.currency)}
                          >
                            Deposit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleWithdraw(currency.currency)}
                          >
                            Withdraw
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Card className="bg-secondary/10 border-dashed">
                    <CardContent className="p-4 flex flex-col items-center justify-center h-full text-center">
                      <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                      <h3 className="font-medium mb-1">Add Currency</h3>
                      <p className="text-sm text-muted-foreground mb-4">Support for 50+ cryptocurrencies</p>
                      <Button variant="outline" size="sm">
                        Add New
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="stablecoins">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {walletBalances
                    .filter((c) => ["USDC", "USDT"].includes(c.currency))
                    .map((currency, index) => (
                      <Card key={index} className="bg-secondary/10">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                {currency.icon ? (
                                  <img
                                    src={currency.icon || "/placeholder.svg"}
                                    alt={currency.currency}
                                    className="w-6 h-6"
                                  />
                                ) : (
                                  <span className="text-xs font-bold">{currency.currency}</span>
                                )}
                              </div>
                              <span className="font-medium">{currency.currency}</span>
                            </div>
                            <Badge variant="outline">{((currency.value / totalBalance) * 100).toFixed(1)}%</Badge>
                          </div>
                          <div className="text-2xl font-bold mb-1">
                            {currency.balance.toLocaleString()} {currency.currency}
                          </div>
                          <div className="text-sm text-muted-foreground">${currency.value.toLocaleString()}</div>

                          <div className="flex gap-2 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleDeposit(currency.currency)}
                            >
                              Deposit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleWithdraw(currency.currency)}
                            >
                              Withdraw
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="tokens">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {walletBalances
                    .filter((c) => !["USDC", "USDT"].includes(c.currency))
                    .map((currency, index) => (
                      <Card key={index} className="bg-secondary/10">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                {currency.icon ? (
                                  <img
                                    src={currency.icon || "/placeholder.svg"}
                                    alt={currency.currency}
                                    className="w-6 h-6"
                                  />
                                ) : (
                                  <span className="text-xs font-bold">{currency.currency}</span>
                                )}
                              </div>
                              <span className="font-medium">{currency.currency}</span>
                            </div>
                            <Badge variant="outline">{((currency.value / totalBalance) * 100).toFixed(1)}%</Badge>
                          </div>
                          <div className="text-2xl font-bold mb-1">
                            {currency.balance.toLocaleString()} {currency.currency}
                          </div>
                          <div className="text-sm text-muted-foreground">${currency.value.toLocaleString()}</div>

                          <div className="flex gap-2 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleDeposit(currency.currency)}
                            >
                              Deposit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleWithdraw(currency.currency)}
                            >
                              Withdraw
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest wallet activity</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/dashboard/transactions">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  type: "incoming",
                  description: "Payment from CryptoDAO Collective",
                  amount: "+2,500.00 USDC",
                  date: "Today, 10:24 AM",
                },
                {
                  type: "outgoing",
                  description: "Withdrawal to External Wallet",
                  amount: "-500.00 USDC",
                  date: "Yesterday, 3:15 PM",
                },
                {
                  type: "incoming",
                  description: "Invoice #0024 Payment",
                  amount: "+1,250.00 USDC",
                  date: "Apr 10, 2025",
                },
                {
                  type: "incoming",
                  description: "Yield Earned",
                  amount: "+32.45 USDC",
                  date: "Apr 8, 2025",
                },
              ].map((tx, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-secondary/10">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === "incoming" ? "bg-success/20" : "bg-destructive/20"
                        }`}
                    >
                      {tx.type === "incoming" ? (
                        <ArrowDownRight className="h-5 w-5 text-success" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{tx.description}</div>
                      <div className="text-xs text-muted-foreground">{tx.date}</div>
                    </div>
                  </div>
                  <div className={`font-medium ${tx.type === "incoming" ? "text-success" : "text-destructive"}`}>
                    {tx.amount}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Deposit Dialog */}
      <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Deposit {depositCurrency}</DialogTitle>
            <DialogDescription>Send {depositCurrency} to your wallet address</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Your {depositCurrency} Address</Label>
              <div className="flex items-center gap-2">
                <div className="p-3 bg-secondary/20 rounded-lg break-all text-sm w-full">{walletAddress}</div>
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(walletAddress)}>
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Only send {depositCurrency} to this address. Sending any other asset may result in permanent loss.
              </p>
            </div>

            <div className="mx-auto w-48 h-48 bg-secondary/20 rounded-lg flex items-center justify-center">
              <QrCode className="h-24 w-24 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-destructive mr-2" />
                <Label className="text-destructive">Important</Label>
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-5">
                <li>Minimum deposit: 1.00 {depositCurrency}</li>
                <li>Deposits typically confirm within 5-30 minutes</li>
                <li>Always verify the address before sending</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDepositOpen(false)}>
              Close
            </Button>
            <Button asChild>
              <a href="https://explorer.solana.com" target="_blank" rel="noopener noreferrer">
                View on Explorer
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Withdraw {withdrawCurrency}</DialogTitle>
            <DialogDescription>Send {withdrawCurrency} to an external wallet</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input id="recipient" placeholder="Enter wallet address" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="amount">Amount</Label>
                <span className="text-xs text-muted-foreground">
                  Available: {walletBalances.find((b) => b.currency === withdrawCurrency)?.balance.toLocaleString()}{" "}
                  {withdrawCurrency}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const max = walletBalances.find((b) => b.currency === withdrawCurrency)?.balance.toString() || "0"
                    setWithdrawAmount(max)
                  }}
                >
                  Max
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Network</Label>
              <Select defaultValue="solana">
                <SelectTrigger>
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solana">Solana</SelectItem>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-secondary/20 p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Amount</span>
                <span>
                  {withdrawAmount || "0.00"} {withdrawCurrency}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Network Fee</span>
                <span>~0.000005 SOL</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>You will receive</span>
                <span>
                  {withdrawAmount || "0.00"} {withdrawCurrency}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWithdrawOpen(false)}>
              Cancel
            </Button>
            <Button onClick={executeWithdraw} disabled={!withdrawAmount}>
              Withdraw
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Swap Dialog */}
      <Dialog open={isSwapOpen} onOpenChange={setIsSwapOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Swap Currencies</DialogTitle>
            <DialogDescription>Exchange one cryptocurrency for another</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>From</Label>
              <div className="flex items-center gap-2">
                <Select value={swapFromCurrency} onValueChange={setSwapFromCurrency}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {walletBalances.map((currency) => (
                      <SelectItem key={currency.currency} value={currency.currency}>
                        {currency.currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={swapAmount}
                  onChange={(e) => setSwapAmount(e.target.value)}
                />
              </div>
              <div className="text-xs text-right text-muted-foreground">
                Available: {walletBalances.find((b) => b.currency === swapFromCurrency)?.balance.toLocaleString()}{" "}
                {swapFromCurrency}
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => {
                  const temp = swapFromCurrency
                  setSwapFromCurrency(swapToCurrency)
                  setSwapToCurrency(temp)
                }}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label>To</Label>
              <div className="flex items-center gap-2">
                <Select value={swapToCurrency} onValueChange={setSwapToCurrency}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {walletBalances.map((currency) => (
                      <SelectItem key={currency.currency} value={currency.currency}>
                        {currency.currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={
                    swapAmount
                      ? swapFromCurrency === "USDC" && swapToCurrency === "SOL"
                        ? (Number.parseFloat(swapAmount) / 100).toFixed(2)
                        : (Number.parseFloat(swapAmount) * 100).toFixed(2)
                      : ""
                  }
                  readOnly
                />
              </div>
            </div>

            <div className="rounded-lg bg-secondary/20 p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Exchange Rate</span>
                <span>
                  {swapFromCurrency === "USDC" && swapToCurrency === "SOL" ? "1 USDC ≈ 0.01 SOL" : "1 SOL ≈ 100 USDC"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Fee</span>
                <span>0.1%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Slippage Tolerance</span>
                <span>0.5%</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSwapOpen(false)}>
              Cancel
            </Button>
            <Button onClick={executeSwap} disabled={!swapAmount}>
              Swap
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
