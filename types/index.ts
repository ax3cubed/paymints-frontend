export interface TokenBalance {
    mint: string
    amount: number
    decimals: number
    symbol?: string
    name?: string
    logo?: string
  }
export interface TransactionInfo {
  signature: string;
  slot: bigint;
  blockTime: number | null;
  transaction: any; 
  meta: any;
}