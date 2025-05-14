export interface SwapRequest {
  poolAddress: string;
  inTokenIndex: number;
  outTokenIndex: number;
  amountIn: number;
  minAmountOut: number;
  userPublicKey: string;
}

export interface SwapResponse {
  success: boolean;
  serializedTransaction: string;
  meta: {
    timestamp: string;
  };
}

export interface SwapSubmitRequest {
  transaction: any; // Use 'any' for now, or type with Solana web3.js Transaction if available
}

export interface SwapSubmitResponse {
  success: boolean;
  signature: string;
  meta: {
    timestamp: string;
  };
}
