import { TransactionInfo } from "@/types/invoice";
import { address, Rpc, SolanaRpcApi } from "@solana/kit";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { toast } from "sonner";



export function useFetchTransactions(publicKey: PublicKey | null, connection: Rpc<SolanaRpcApi> | null) {
  const [transactions, setTransactions] = useState<TransactionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!publicKey || !connection) return;

      setIsLoading(true);

      try {
        // Fetch recent transaction signatures
        const signatures = await connection
          .getSignaturesForAddress(address(publicKey.toString()))
          .send({ abortSignal: new AbortController().signal });

        if (!signatures.length) {
          console.warn("No recent transactions found for this address");
          setTransactions([]);
          return;
        }

        // Fetch full transaction details
        const transactionDetails = await Promise.all(
          signatures.map(async (sig) => {
            const transaction = await connection
              .getTransaction(sig.signature, { maxSupportedTransactionVersion: 0 })
              .send({ abortSignal: new AbortController().signal });

            if (!transaction) {
              console.warn(`Transaction not found for signature: ${sig.signature}`);
              return null;
            }

            return {
              signature: sig.signature,
              slot: transaction.slot,
              blockTime: transaction.blockTime ?? null,
              transaction: transaction.transaction,
              meta: transaction.meta,
            } as TransactionInfo;
          })
        );

        // Filter out failed fetches
        const validTransactions = transactionDetails.filter((tx): tx is TransactionInfo => tx !== null);

        setTransactions(validTransactions);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        toast.error("Failed to fetch transaction history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [publicKey, connection]);

  return { transactions, isLoading };
}
