import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { TokenPrice, UserWallet, SwapReceipt } from '../types';

interface SwapState {
  // Theme State
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Socket & Price State
  socket: Socket | null;
  isConnected: boolean;
  tokensMap: Record<string, TokenPrice>;
  tokensList: TokenPrice[];
  setTokens: (tokens: TokenPrice[]) => void;
  initSocket: () => void;

  // User State
  userWallet: UserWallet;
  updateUserBalance: (currency: string, newAmount: number) => void;
  resetUserWallet: () => void;

  // Active Form State
  fromToken: string;
  toToken: string;
  fromAmount: string;
  slippage: number;
  setFromToken: (token: string) => void;
  setToToken: (token: string) => void;
  setFromAmount: (amount: string) => void;
  setSlippage: (slippage: number) => void;
  swapTokens: () => void;

  // Swap Status & Modal
  isSwapping: boolean;
  lastReceipt: SwapReceipt | null;
  clearLastReceipt: () => void;
  executeSwap: () => Promise<boolean>;
}

const STORAGE_WALLET_KEY = 'switcheo_user_wallet_v2';
const STORAGE_THEME_KEY = 'switcheo_theme_v2';

// Helper to generate random wallet address
function generateRandomAddress(): string {
  const chars = '0123456789abcdef';
  let addr = '0x';
  for (let i = 0; i < 40; i++) {
    addr += chars[Math.floor(Math.random() * chars.length)];
  }
  return addr;
}

// Initial Default User Wallet ($1,000,000 total USD allocation)
const defaultWallet: UserWallet = {
  address: generateRandomAddress(),
  avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=CalvinSwitcheo',
  balances: {
    USD: 950000,
    USDC: 45000,
    USDT: 5000,
    ETH: 2.5,
    BTC: 0.25,
    WBTC: 0.1,
    ATOM: 250,
    OSMO: 1000
  }
};

// Load initial wallet from localStorage
function getInitialWallet(): UserWallet {
  try {
    const saved = localStorage.getItem(STORAGE_WALLET_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.address && parsed.balances) return parsed;
    }
  } catch (e) {
    console.error('Error loading stored wallet:', e);
  }
  return defaultWallet;
}

// Load initial theme from localStorage
function getInitialTheme(): 'dark' | 'light' {
  try {
    const saved = localStorage.getItem(STORAGE_THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (e) {}
  return 'dark';
}

export const useSwapStore = create<SwapState>((set, get) => ({
  // Theme
  theme: getInitialTheme(),
  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_THEME_KEY, nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    set({ theme: nextTheme });
  },

  // Socket & Prices
  socket: null,
  isConnected: false,
  tokensMap: {},
  tokensList: [],
  setTokens: (tokens: TokenPrice[]) => {
    const map: Record<string, TokenPrice> = {};
    tokens.forEach((t) => {
      map[t.currency] = t;
    });
    set({ tokensMap: map, tokensList: tokens });
  },

  initSocket: () => {
    if (get().socket) return;

    // Connect to server socket on port 3001
    const socket = io('http://localhost:3001', {
      reconnectionAttempts: 5,
      timeout: 5000
    });

    socket.on('connect', () => {
      set({ isConnected: true });
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
    });

    socket.on('price_update', (data: TokenPrice[]) => {
      get().setTokens(data);
    });

    // Fallback REST fetch if socket fails or takes long
    fetch('http://localhost:3001/api/prices')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          get().setTokens(data.data);
        }
      })
      .catch((err) => console.log('REST prices fetch fallback error:', err));

    set({ socket });
  },

  // User Wallet
  userWallet: getInitialWallet(),
  updateUserBalance: (currency: string, newAmount: number) => {
    const current = get().userWallet;
    const updated = {
      ...current,
      balances: {
        ...current.balances,
        [currency]: Math.max(0, newAmount)
      }
    };
    localStorage.setItem(STORAGE_WALLET_KEY, JSON.stringify(updated));
    set({ userWallet: updated });
  },
  resetUserWallet: () => {
    const newW = {
      ...defaultWallet,
      address: generateRandomAddress()
    };
    localStorage.setItem(STORAGE_WALLET_KEY, JSON.stringify(newW));
    set({ userWallet: newW });
  },

  // Active Form State
  fromToken: 'ETH',
  toToken: 'USDC',
  fromAmount: '',
  slippage: 0.5,
  setFromToken: (token: string) => set({ fromToken: token }),
  setToToken: (token: string) => set({ toToken: token }),
  setFromAmount: (amount: string) => set({ fromAmount: amount }),
  setSlippage: (slippage: number) => set({ slippage }),

  swapTokens: () => {
    const { fromToken, toToken } = get();
    set({ fromToken: toToken, toToken: fromToken });
  },

  // Swap Action
  isSwapping: false,
  lastReceipt: null,
  clearLastReceipt: () => set({ lastReceipt: null }),

  executeSwap: async (): Promise<boolean> => {
    const { fromToken, toToken, fromAmount, userWallet, tokensMap } = get();
    const numericAmount = parseFloat(fromAmount);

    if (isNaN(numericAmount) || numericAmount <= 0) return false;

    set({ isSwapping: true });

    try {
      // Call backend POST /api/swap
      const res = await fetch('http://localhost:3001/api/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromToken,
          toToken,
          fromAmount: numericAmount,
          userWalletAddress: userWallet.address
        })
      });

      const result = await res.json();

      if (result.success && result.data) {
        const receipt: SwapReceipt = result.data;
        
        // Update user balances in store and localStorage
        const currentFromBal = userWallet.balances[fromToken] || 0;
        const currentToBal = userWallet.balances[toToken] || 0;

        const newFromBal = currentFromBal - numericAmount;
        const newToBal = currentToBal + receipt.toAmount;

        const updatedWallet = {
          ...userWallet,
          balances: {
            ...userWallet.balances,
            [fromToken]: Math.max(0, newFromBal),
            [toToken]: newToBal
          }
        };

        localStorage.setItem(STORAGE_WALLET_KEY, JSON.stringify(updatedWallet));
        set({
          userWallet: updatedWallet,
          lastReceipt: receipt,
          fromAmount: '',
          isSwapping: false
        });
        return true;
      } else {
        throw new Error(result.message || 'Swap failed on server.');
      }
    } catch (err: any) {
      console.warn('Backend API swap call error, running client fallback:', err?.message);

      // Client-side execution fallback if backend service is unreachable
      const fromPrice = tokensMap[fromToken]?.price || 0;
      const toPrice = tokensMap[toToken]?.price || 0;

      if (fromPrice <= 0 || toPrice <= 0) {
        set({ isSwapping: false });
        return false;
      }

      await new Promise((r) => setTimeout(r, 1000)); // Simulate delay

      const usdValue = numericAmount * fromPrice;
      const feeRate = usdValue < 100 ? 0.001 : usdValue < 1000 ? 0.0005 : 0.0002;
      const feeAmount = numericAmount * feeRate;
      const netFrom = numericAmount - feeAmount;
      const toAmount = (netFrom * fromPrice) / toPrice;

      const fallbackReceipt: SwapReceipt = {
        transactionId: 'TX-' + Math.random().toString(36).substring(2, 11).toUpperCase(),
        userWalletAddress: userWallet.address,
        fromToken,
        toToken,
        fromAmount: numericAmount,
        toAmount,
        feeRatePercentage: (feeRate * 100).toFixed(2) + '%',
        feeAmountInFromToken: feeAmount,
        totalUsdValue: usdValue.toFixed(2),
        timestamp: new Date().toISOString()
      };

      const currentFromBal = userWallet.balances[fromToken] || 0;
      const currentToBal = userWallet.balances[toToken] || 0;

      const updatedWallet = {
        ...userWallet,
        balances: {
          ...userWallet.balances,
          [fromToken]: Math.max(0, currentFromBal - numericAmount),
          [toToken]: currentToBal + toAmount
        }
      };

      localStorage.setItem(STORAGE_WALLET_KEY, JSON.stringify(updatedWallet));
      set({
        userWallet: updatedWallet,
        lastReceipt: fallbackReceipt,
        fromAmount: '',
        isSwapping: false
      });
      return true;
    }
  }
}));
