export interface TokenPrice {
  currency: string;
  price: number;
  date: string;
  iconUrl: string;
  isAvailable: boolean;
}

export interface UserWallet {
  address: string;
  avatarUrl: string;
  balances: Record<string, number>; // Currency symbol -> amount
}

export interface SwapReceipt {
  transactionId: string;
  userWalletAddress: string;
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  feeRatePercentage: string;
  feeAmountInFromToken: number;
  totalUsdValue: string;
  timestamp: string;
}
