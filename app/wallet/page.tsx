"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import {
  ArrowUpRight,
  ArrowDownRight,
  Copy,
  QrCode,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  ChevronRight,
  Clock,
  BarChart3,
  Info,
  ArrowDownUp,
  Loader2,
  Sun,
  Moon,
} from "lucide-react"
import { toast } from "sonner"
import { useWallet } from "@solana/wallet-adapter-react"
import { useAuth } from "@/components/auth-provider"
import { QRCodeSVG } from "qrcode.react"
import { useTheme } from "next-themes"
import { useSwap } from "@/hooks/use-swap"
import { PublicKey, Transaction } from "@solana/web3.js"
import { useTransactions } from "@/hooks/use-transactions"


export default function WalletPage() {
  const [isDepositOpen, setIsDepositOpen] = useState(false)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [isSwapOpen, setIsSwapOpen] = useState(false)
  const [isQrCodeOpen, setIsQrCodeOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [depositCurrency, setDepositCurrency] = useState("USDC")
  const [withdrawCurrency, setWithdrawCurrency] = useState("USDC")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [swapFromCurrency, setSwapFromCurrency] = useState("USDC")
  const [swapToCurrency, setSwapToCurrency] = useState("SOL")
  const [swapFromIndex, setSwapFromIndex] = useState(0)
  const [swapToIndex, setSwapToIndex] = useState(1)
  const [swapAmount, setSwapAmount] = useState("")
  const [swapEstimate, setSwapEstimate] = useState("")
  const [isSwapLoading, setIsSwapLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const { publicKey, signTransaction } = useWallet?.() || { publicKey: null, sendTransaction: null, signTransaction: null }
  const { theme, setTheme } = useTheme()
  const swapHook = useSwap()
  const [swapStep, setSwapStep] = useState<'idle' | 'preparing' | 'signing' | 'submitting' | 'success' | 'error'>('idle')
  const [swapResultDetails, setSwapResultDetails] = useState<any>(null)
  const swapModalContentRef = useRef<HTMLDivElement>(null)
  const { transactions, refetch } = useTransactions()
  const getTokenIndex = (currency: string) => walletBalances.findIndex((token) => token.currency === currency)
  const solanaPool = process.env.NEXT_PUBLIC_SOLANA_POOL_ADDRESS || "YourPoolAddressHere"

  useEffect(() => {
    setSwapFromIndex(getTokenIndex(swapToCurrency))
  }, [swapFromCurrency])

  useEffect(() => {
    
  }, [transactions,])
  useEffect(() => {
    setSwapToIndex(getTokenIndex(swapFromCurrency))
  }, [swapToCurrency])

  // Safely use auth context or fallback to mock data
  const auth = useAuth()
  const tokens = auth?.tokens || []
  const walletBalances =
    tokens?.map((token) => ({
      currency: token.symbol,
      balance: token.balance,
      value: token.balance * 1, // Assuming 1:1 for simplicity
      icon: token.imageUrl,
      mintAddress: token.mintAddress,
      change: Math.random() > 0.5 ? `+${(Math.random() * 5).toFixed(2)}%` : `-${(Math.random() * 5).toFixed(2)}%`,
      changePositive: Math.random() > 0.5,
    })) || []

  // Mock wallet address if not available from wallet adapter
  const walletAddress = publicKey?.toString() || "8xrt6LGom3xRwNKgdAXakJQ9Bvmw4hEQFo7ne7Q9RyPd"
  const totalBalance = walletBalances.reduce((sum, currency) => sum + currency.value, 0)

  // Calculate swap estimate when amount or currencies change
  useEffect(() => {
    if (swapAmount) {
      // Simulate exchange rate calculation
      const rate = swapFromCurrency === "USDC" && swapToCurrency === "SOL" ? 0.01 : 100
      setSwapEstimate((Number(swapAmount) * rate).toFixed(swapToCurrency === "SOL" ? 4 : 2))
    } else {
      setSwapEstimate("")
    }
  }, [swapAmount, swapFromCurrency, swapToCurrency])

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
      icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
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
      icon: <ArrowUpRight className="h-4 w-4 text-primary" />,
    })
    setIsWithdrawOpen(false)
    setWithdrawAmount("")
  }

  // Replace executeSwap with real swap logic
  const executeSwap = async () => {
    if (!swapAmount || !swapFromCurrency || !swapToCurrency || !publicKey) return
    setIsSwapLoading(true)
    setSwapStep('preparing')
    setSwapResultDetails(null)
    try {
      // Prepare swap request
      const swapRequest = {
        poolAddress: solanaPool,
        inTokenIndex: swapFromIndex,
        outTokenIndex: swapToIndex,
        amountIn: Number(swapAmount),
        minAmountOut: Number(swapEstimate),
        userPublicKey: publicKey.toString(),
      }
      // Step 1: Prepare swap transaction
      const swapResult = await swapHook.swapAsync(swapRequest)
      setSwapStep('signing')
      // Step 2: Sign transaction
      const serializedTransaction = Buffer.from(swapResult.serializedTransaction, 'base64');
      const transaction = Transaction.from(serializedTransaction);
      const signedTransaction = signTransaction ? await signTransaction(transaction) : null;
      if (!signedTransaction) throw new Error("Wallet not connected or unable to sign transaction.");
      setSwapStep('submitting')
      // Step 3: Submit signed transaction
      const submitResult = await swapHook.submitAsync({ transaction: signedTransaction });
      setSwapStep('success')
      setSwapResultDetails({
        signature: submitResult.signature,
        amountIn: swapAmount,
        from: swapFromCurrency,
        to: swapToCurrency,
        amountOut: swapEstimate,
      })
      setSwapAmount("")
    } catch (e: any) {
      setSwapStep('error')
      setSwapResultDetails({ error: e?.message || "An error occurred." })
    } finally {
      setIsSwapLoading(false)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Utility to get Solana explorer URL for a given address or signature
  function getSolanaExplorerUrl(type: 'address' | 'tx', value: string) {
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
    const base = "https://explorer.solana.com";
    let path = type === 'address' ? `/address/${value}` : `/tx/${value}`;
    let cluster = network !== "mainnet-beta" ? `?cluster=${network}` : "";
    return `${base}${path}${cluster}`;
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header with gradient background */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 to-purple-700 p-8 mb-8">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Wallet</h1>
              <p className="text-violet-100">Manage your crypto assets and transactions</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="bg-white/10 text-white hover:bg-white/20"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button variant="secondary" onClick={() => setIsDepositOpen(true)}>
                <ArrowDownRight className="mr-2 h-4 w-4" />
                Deposit
              </Button>
              <Button variant="secondary" onClick={() => setIsWithdrawOpen(true)}>
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Withdraw
              </Button>
              <Button variant="default" onClick={() => setIsSwapOpen(true)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Swap
              </Button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white/10 border-0 backdrop-blur-sm text-white">
              <CardContent className="p-4 flex flex-col">
                <div className="text-violet-200 text-sm font-medium mb-1">Total Balance</div>
                <div className="text-2xl font-bold">${totalBalance.toLocaleString()}</div>
                <div className="text-xs text-violet-200 mt-1">Across {walletBalances.length} currencies</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-0 backdrop-blur-sm text-white">
              <CardContent className="p-4 flex flex-col">
                <div className="text-violet-200 text-sm font-medium mb-1">Wallet Address</div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-mono truncate">{formatAddress(walletAddress)}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-2   rounded-sm bg-white/20 hover:bg-white/30 text-white"
                    onClick={() => copyToClipboard(walletAddress)}
                  >
                    {copied ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-2 rounded-sm bg-white/20 hover:bg-white/30 text-white"
                    onClick={() => setIsQrCodeOpen(true)}
                  >
                    <QrCode className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-0 backdrop-blur-sm text-white">
              <CardContent className="p-4 flex flex-col">
                <div className="text-violet-200 text-sm font-medium mb-1">24h Change</div>
                <div className="text-2xl font-bold text-green-400">+$127.45</div>
                <div className="text-xs text-green-300 mt-1">+2.3% from yesterday</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-0 backdrop-blur-sm text-white">
              <CardContent className="p-4 flex flex-col">
                <div className="text-violet-200 text-sm font-medium mb-1">Portfolio Health</div>
                <div className="text-2xl font-bold">Excellent</div>
                <div className="text-xs text-violet-200 mt-1">Well-diversified assets</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Currency Balances */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="overflow-hidden border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-primary" />
              Currency Balances
            </CardTitle>
            <CardDescription>Your balances across different cryptocurrencies</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 w-full justify-start">
                <TabsTrigger value="all" className="relative">
                  All
                  <Badge className="ml-2 bg-primary/10 text-primary hover:bg-primary/20">{walletBalances.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="stablecoins" className="relative">
                  Stablecoins
                  <Badge className="ml-2 bg-primary/10 text-primary hover:bg-primary/20">
                    {walletBalances.filter((c) => ["USDC", "USDT"].includes(c.currency)).length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="tokens" className="relative">
                  Tokens
                  <Badge className="ml-2 bg-primary/10 text-primary hover:bg-primary/20">
                    {walletBalances.filter((c) => !["USDC", "USDT"].includes(c.currency)).length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="all" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {walletBalances.map((currency, index) => (
                        <CurrencyCard
                          key={index}
                          currency={currency}
                          onDeposit={handleDeposit}
                          onWithdraw={handleWithdraw}
                        />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="stablecoins" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {walletBalances
                        .filter((c) => ["USDC", "USDT"].includes(c.currency))
                        .map((currency, index) => (
                          <CurrencyCard
                            key={index}
                            currency={currency}
                            onDeposit={handleDeposit}
                            onWithdraw={handleWithdraw}
                          />
                        ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="tokens" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {walletBalances
                        .filter((c) => !["USDC", "USDT"].includes(c.currency))
                        .map((currency, index) => (
                          <CurrencyCard
                            key={index}
                            currency={currency}
                            onDeposit={handleDeposit}
                            onWithdraw={handleWithdraw}
                          />
                        ))}
                    </div>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
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
        <Card className="overflow-hidden border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                <CardTitle>Recent Transactions</CardTitle>
              </div>
              <Button variant="outline" size="sm" asChild className="gap-1">
                <a href="/transactions">
                  View All
                  <ChevronRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
            <CardDescription>Your latest wallet activity</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {(transactions || []).map((tx: any, index: number) => {
                const isOutgoing = tx.sender === walletAddress;
                const isIncoming = tx.recipient === walletAddress;
                const status = tx.error ? 'failed' : 'completed';
                const description = isOutgoing
                  ? `Sent ${tx.amount?.toLocaleString()} ${tx.tokenMint || 'SOL'} to ${tx.recipient?.slice(0, 8)}...${tx.recipient?.slice(-8)}`
                  : isIncoming
                    ? `Received ${tx.amount?.toLocaleString()} ${tx.tokenMint || 'SOL'} from ${tx.sender?.slice(0, 8)}...${tx.sender?.slice(-8)}`
                    : 'Transaction';
                const date = tx.blockTime ? new Date(tx.blockTime * 1000).toLocaleString() : 'Unknown';
                return (
                  <div key={tx.signature} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center 
                          ${isIncoming
                            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            : isOutgoing
                              ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}
                      >
                        {isIncoming ? (
                          <ArrowDownRight className="h-5 w-5" />
                        ) : isOutgoing ? (
                          <ArrowUpRight className="h-5 w-5" />
                        ) : (
                          <ArrowDownUp className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{description}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          {date}
                          <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground mx-1"></span>
                          <Badge variant="outline" className="text-[10px] py-0 h-4">
                            {status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground font-mono break-all">{tx.signature}</div>
                      </div>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => openExplorer(tx.signature)}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View on Explorer</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* QR Code Dialog */}
      <Dialog open={isQrCodeOpen} onOpenChange={setIsQrCodeOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              Wallet QR Code
            </DialogTitle>
            <DialogDescription>Scan this code to send funds to your wallet</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-64 h-64 p-2 bg-white rounded-lg shadow-inner">
              <QRCodeSVG
                value={walletAddress}
                size={240}
                level="H"
                imageSettings={{
                  src: "/placeholder.svg?key=vnm7p",
                  height: 48,
                  width: 48,
                  excavate: true,
                }}
                className="w-full h-full"
              />
            </div>

            <div className="mt-4 w-full">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Wallet Address</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={() => copyToClipboard(walletAddress)}
                >
                  {copied ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="h-3 w-3" /> Copy
                    </span>
                  )}
                </Button>
              </div>
              <div className="p-2 bg-muted rounded-md font-mono text-xs break-all">{walletAddress}</div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="sm:flex-1" onClick={() => setIsQrCodeOpen(false)}>
              Close
            </Button>
            <Button className="sm:flex-1" asChild>
              <a
                href={getSolanaExplorerUrl('address', walletAddress)}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Explorer
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deposit Dialog */}
      <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowDownRight className="h-5 w-5 text-primary" />
              Deposit {depositCurrency}
            </DialogTitle>
            <DialogDescription>Send {depositCurrency} to your wallet address</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 p-2 bg-white rounded-lg shadow-inner mb-4">
                <QRCodeSVG
                  value={walletAddress}
                  size={180}
                  level="H"
                  imageSettings={{
                    src: "/placeholder.svg?key=qbiwe",
                    height: 36,
                    width: 36,
                    excavate: true,
                  }}
                  className="w-full h-full"
                />
              </div>

              <div className="w-full space-y-2">
                <Label>Your {depositCurrency} Address</Label>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-muted rounded-md font-mono text-xs break-all w-full">{walletAddress}</div>
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(walletAddress)}>
                    {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <h4 className="font-medium">Important Information</h4>
              </div>
              <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-5">
                <li>Minimum deposit: 1.00 {depositCurrency}</li>
                <li>Deposits typically confirm within 5-30 minutes</li>
                <li>Always verify the address before sending</li>
                <li>Only send {depositCurrency} to this address</li>
              </ul>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="sm:flex-1" onClick={() => setIsDepositOpen(false)}>
              Close
            </Button>
            <Button className="sm:flex-1" asChild>
              <a
                href={`https://explorer.solana.com/address/${walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
              >
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
            <DialogTitle className="flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5 text-primary" />
              Withdraw {withdrawCurrency}
            </DialogTitle>
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

            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
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
              <Separator className="my-2" />
              <div className="flex justify-between text-sm font-medium">
                <span>You will receive</span>
                <span>
                  {withdrawAmount || "0.00"} {withdrawCurrency}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="sm:flex-1" onClick={() => setIsWithdrawOpen(false)}>
              Cancel
            </Button>
            <Button className="sm:flex-1" onClick={executeWithdraw} disabled={!withdrawAmount}>
              Withdraw
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Swap Dialog */}
      <Dialog open={isSwapOpen} onOpenChange={(open) => {
        setIsSwapOpen(open)
        if (!open) {
          setSwapStep('idle')
          setSwapResultDetails(null)
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary animate-spin-swap" />
              Swap Currencies
            </DialogTitle>
            <DialogDescription>Exchange one cryptocurrency for another</DialogDescription>
          </DialogHeader>
          <div ref={swapModalContentRef} className="space-y-6 py-4 min-h-[220px] flex flex-col justify-center">
            {swapStep !== 'idle' && isSwapLoading && (swapStep === 'preparing' || swapStep === 'signing' || swapStep === 'submitting') ? (
              <AnimatedSwapLoader step={swapStep as 'preparing' | 'signing' | 'submitting'} />
            ) : swapStep === 'success' && swapResultDetails ? (
              <SwapSuccessDetails details={swapResultDetails} onViewExplorer={() => openExplorer(swapResultDetails.signature)} />
            ) : swapStep === 'error' && swapResultDetails ? (
              <SwapErrorDetails error={swapResultDetails.error} />
            ) : (
              // ...existing swap form code here...
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
                            <div className="flex items-center gap-2">
                              {currency.icon && (
                                <div className="w-4 h-4 rounded-full overflow-hidden">
                                  <img
                                    src={currency.icon || "/placeholder.svg"}
                                    alt={currency.currency}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              {currency.currency}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={swapAmount}
                      onChange={(e) => setSwapAmount(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="text-xs text-right text-muted-foreground">
                    Available: {walletBalances.find((b) => b.currency === swapFromCurrency)?.balance.toLocaleString()}{" "}
                    {swapFromCurrency}
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10 border-dashed"
                    onClick={() => {
                      const temp = swapFromCurrency
                      setSwapFromCurrency(swapToCurrency)
                      setSwapToCurrency(temp)
                    }}
                  >
                    <ArrowDownUp className="h-4 w-4" />
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
                            <div className="flex items-center gap-2">
                              {currency.icon && (
                                <div className="w-4 h-4 rounded-full overflow-hidden">
                                  <img
                                    src={currency.icon || "/placeholder.svg"}
                                    alt={currency.currency}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              {currency.currency}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input type="number" placeholder="0.00" value={swapEstimate} readOnly className="flex-1 bg-muted/50" />
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1">
                      Exchange Rate
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Current market rate with 0.1% spread</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>
                    <span>
                      {swapFromCurrency === "USDC" && swapToCurrency === "SOL"
                        ? "1 USDC ≈ 0.01 SOL"
                        : swapFromCurrency === "SOL" && swapToCurrency === "USDC"
                          ? "1 SOL ≈ 100 USDC"
                          : "1 " + swapFromCurrency + " ≈ 1 " + swapToCurrency}
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
                  <Separator className="my-2" />
                  <div className="flex justify-between text-sm font-medium">
                    <span>Estimated Receive</span>
                    <span>
                      {swapEstimate || "0.00"} {swapToCurrency}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            {swapStep === 'idle' && (
              <>
                <Button variant="outline" className="sm:flex-1" onClick={() => setIsSwapOpen(false)}>
                  Cancel
                </Button>
                <Button className="sm:flex-1" onClick={executeSwap} disabled={!swapAmount || isSwapLoading}>
                  {isSwapLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    "Swap"
                  )}
                </Button>
              </>
            )}
            {(swapStep === 'success' || swapStep === 'error') && (
              <Button className="sm:flex-1" onClick={() => {
                setSwapStep('idle')
                setSwapResultDetails(null)
              }}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Currency Card Component
interface CurrencyCardProps {
  currency: {
    currency: string
    balance: number
    value: number
    icon?: string
    mintAddress?: string
    change: string
    changePositive: boolean
  }
  onDeposit: (currency: string) => void
  onWithdraw: (currency: string) => void
}

function CurrencyCard({ currency, onDeposit, onWithdraw }: CurrencyCardProps) {
  return (
    <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {currency.icon ? (
                  <img
                    src={currency.icon || "/placeholder.svg"}
                    alt={currency.currency}
                    className="w-6 h-6 object-cover"
                  />
                ) : (
                  <span className="text-xs font-bold">{currency.currency}</span>
                )}
              </div>
              <span className="font-medium">{currency.currency}</span>
            </div>
            <Badge
              variant="outline"
              className={
                currency.changePositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }
            >
              {currency.change}
            </Badge>
          </div>
          <div className="text-2xl font-bold mb-1">
            {currency.balance.toLocaleString()} {currency.currency}
          </div>
          <div className="text-sm text-muted-foreground">${currency.value.toLocaleString()}</div>
        </div>

        <div className="flex border-t">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 rounded-none py-3 h-auto text-xs font-medium"
            onClick={() => onDeposit(currency.currency)}
          >
            <ArrowDownRight className="mr-1 h-3 w-3" />
            Deposit
          </Button>
          <div className="w-px bg-border h-10"></div>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 rounded-none py-3 h-auto text-xs font-medium"
            onClick={() => onWithdraw(currency.currency)}
          >
            <ArrowUpRight className="mr-1 h-3 w-3" />
            Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Animated loader component for swap steps
function AnimatedSwapLoader({ step }: { step: 'preparing' | 'signing' | 'submitting' }) {
  const stepMap = {
    preparing: { label: 'Preparing swap transaction...', icon: <Loader2 className="h-8 w-8 animate-spin text-primary" /> },
    signing: { label: 'Requesting wallet signature...', icon: <Loader2 className="h-8 w-8 animate-spin text-primary" /> },
    submitting: { label: 'Submitting transaction to network...', icon: <Loader2 className="h-8 w-8 animate-spin text-primary" /> },
  } as const;
  const current = stepMap[step];
  return (
    <div className="flex flex-col items-center justify-center gap-4 animate-fade-in">
      {current.icon}
      <div className="text-lg font-semibold text-primary animate-pulse">{current.label}</div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-2 bg-primary transition-all duration-700 ${step === 'preparing' ? 'w-1/3' : step === 'signing' ? 'w-2/3' : 'w-full'}`}></div>
      </div>
    </div>
  )
}

// Swap success details component
function SwapSuccessDetails({ details, onViewExplorer }: { details: any, onViewExplorer: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 animate-fade-in">
      <CheckCircle2 className="h-10 w-10 text-green-500 animate-bounce" />
      <div className="text-lg font-semibold text-green-600">Swap Successful!</div>
      <div className="text-sm text-muted-foreground text-center">
        Swapped <span className="font-bold">{details.amountIn} {details.from}</span> for <span className="font-bold">{details.amountOut} {details.to}</span>.<br />
        <span className="text-xs">Signature:</span> <span className="font-mono text-xs break-all">{details.signature}</span>
      </div>
      <Button variant="outline" onClick={onViewExplorer}>
        View on Explorer <ExternalLink className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}

// Swap error details component
function SwapErrorDetails({ error }: { error: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 animate-fade-in">
      <AlertCircle className="h-10 w-10 text-red-500 animate-shake" />
      <div className="text-lg font-semibold text-red-600">Swap Failed</div>
      <div className="text-sm text-muted-foreground text-center">{error}</div>
    </div>
  )
}
