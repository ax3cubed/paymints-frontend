import { useAtom } from "jotai"
import { useAuth } from "../auth-provider"
import { isAuthenticatedAtom } from "@/lib/store/auth"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import Image from "next/image"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { Button } from "../ui/button"

export const UnauthenticatedHeader = () => {
    const { connectWallet } = useAuth()
    const [isAuthenticated] = useAtom(isAuthenticatedAtom)

    const router = useRouter()
    const handleLaunchApp = () => {
        console.log(isAuthenticated);
        if (isAuthenticated) {


            router.push("/dashboard")
        } else {
            // If not authenticated, the WalletConnectButton will handle showing the login modal
            connectWallet()
        }
    }
    return (

        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border" >
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
        </nav >
    )
}