
import { fetchMint } from "@solana-program/token"
import { address, Rpc, SolanaRpcApi } from "@solana/kit"
import { PublicKey } from "@solana/web3.js"
import { useEffect, useState } from "react"
import { toast } from "sonner"
// Import token list
import tokenList from "@/utils/token-list.json" // We'll create this file locally!
import { TokenBalance } from "@/types"

export function useFetchTokens(publicKey: PublicKey | null, connection: Rpc<SolanaRpcApi> | null) {
  const [tokens, setTokens] = useState<TokenBalance[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchTokens = async () => {
      if (!publicKey || !connection) return

      setIsLoading(true)

      try {
        const { value: tokenAccounts } = await connection
          .getTokenAccountsByOwner(address(publicKey.toString()), {
            programId: address("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
          })
          .send({ abortSignal: new AbortController().signal })

        if (!tokenAccounts.length) {
          
          setTokens([])
          return
        }

        const tokensFetched: TokenBalance[] = []

        for (const tokenAccount of tokenAccounts) {
          const tokenPubkey = tokenAccount.pubkey

          const { value: accountInfo } = await connection
            .getTokenAccountBalance(tokenPubkey)
            .send({ abortSignal: new AbortController().signal })

          // This needs to decode tokenAccount.account.data properly
          const mintAddress = new PublicKey(tokenAccount.account.data).toString()

          const mintInfo = await fetchMint(connection, address(mintAddress), {
            commitment: "confirmed",
          })

          // Lookup token metadata
          const metadata = tokenList.find(t => t.address === mintAddress)

          tokensFetched.push({
            mintAddress: mintAddress,
            balance: parseFloat(accountInfo.uiAmountString || "0"),
            symbol: metadata?.symbol || "",
            imageUrl: metadata?.logoURI || "",
            associatedTokenAddress: tokenPubkey.toString(),

          })
        }

        setTokens(tokensFetched)
      }
      catch (error) {
        
        toast.error("Failed to fetch token balances")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTokens()
  }, [publicKey, connection])

  return { tokens, isLoading }
}
