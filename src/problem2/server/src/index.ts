import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import axios from 'axios';

interface RawPriceData {
  currency: string;
  date: string;
  price: number;
}

interface ProcessedPrice {
  currency: string;
  price: number;
  date: string;
  iconUrl: string;
  isAvailable: boolean;
}

const PORT = process.env.PORT || 3001;
const PRICES_URL = 'https://interview.switcheo.com/prices.json';
const TOKEN_ICON_BASE = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Memory cache for prices
let pricesCache: Map<string, ProcessedPrice> = new Map();
let rawPricesList: ProcessedPrice[] = [];

// Helper to calculate fee percentage based on USD value
function getFeePercentage(usdValue: number): number {
  if (usdValue < 100) return 0.001; // 0.1%
  if (usdValue < 1000) return 0.0005; // 0.05%
  return 0.0002; // 0.02%
}

// Fetch and normalize price data
async function fetchPrices(): Promise<void> {
  try {
    const response = await axios.get<RawPriceData[]>(PRICES_URL, { timeout: 5000 });
    const rawData = response.data;

    // Deduplicate: keep newest price for each currency
    const latestPricesMap = new Map<string, RawPriceData>();

    for (const item of rawData) {
      if (!item.currency || typeof item.price !== 'number' || item.price <= 0) continue;
      const existing = latestPricesMap.get(item.currency);
      if (!existing || new Date(item.date).getTime() > new Date(existing.date).getTime()) {
        latestPricesMap.set(item.currency, item);
      }
    }

    const processedMap = new Map<string, ProcessedPrice>();
    const list: ProcessedPrice[] = [];

    latestPricesMap.forEach((val, currency) => {
      const processed: ProcessedPrice = {
        currency,
        price: val.price,
        date: val.date,
        iconUrl: `${TOKEN_ICON_BASE}/${currency}.svg`,
        isAvailable: true
      };
      processedMap.set(currency, processed);
      list.push(processed);
    });

    pricesCache = processedMap;
    rawPricesList = list;
    console.log(`[PriceServer] Successfully cached ${pricesCache.size} token prices.`);
  } catch (error) {
    console.error('[PriceServer] Error fetching external prices:', error instanceof Error ? error.message : error);
  }
}

// REST API Endpoints
app.get('/api/prices', (req, res) => {
  res.json({
    success: true,
    data: Array.from(pricesCache.values())
  });
});

app.post('/api/swap', async (req, res) => {
  const { fromToken, toToken, fromAmount, userWalletAddress } = req.body;

  if (!fromToken || !toToken || !fromAmount || typeof fromAmount !== 'number' || fromAmount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid swap request parameters.'
    });
  }

  const fromAsset = pricesCache.get(fromToken);
  const toAsset = pricesCache.get(toToken);

  if (!fromAsset || !fromAsset.isAvailable) {
    return res.status(400).json({
      success: false,
      message: `Swap service for token ${fromToken} is currently unavailable.`
    });
  }

  if (!toAsset || !toAsset.isAvailable) {
    return res.status(400).json({
      success: false,
      message: `Swap service for token ${toToken} is currently unavailable.`
    });
  }

  // Simulate network processing delay (1000ms)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const totalUsdValue = fromAmount * fromAsset.price;
  const feeRate = getFeePercentage(totalUsdValue);
  const feeInFromToken = fromAmount * feeRate;
  const netFromAmount = fromAmount - feeInFromToken;
  const toAmount = (netFromAmount * fromAsset.price) / toAsset.price;

  const transactionId = 'TX-' + Math.random().toString(36).substring(2, 11).toUpperCase();

  return res.json({
    success: true,
    message: 'Swap transaction executed successfully!',
    data: {
      transactionId,
      userWalletAddress,
      fromToken,
      toToken,
      fromAmount,
      toAmount,
      feeRatePercentage: (feeRate * 100).toFixed(2) + '%',
      feeAmountInFromToken: feeInFromToken,
      totalUsdValue: totalUsdValue.toFixed(2),
      timestamp: new Date().toISOString()
    }
  });
});

// Socket.IO real-time price streaming
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);
  
  // Send immediate initial prices
  socket.emit('price_update', Array.from(pricesCache.values()));

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// Simulate real-time price updates (every 1000ms / 1s heartbeat)
setInterval(() => {
  if (pricesCache.size === 0) return;

  // Apply micro random price variations (±0.05%) to emulate live market feed
  pricesCache.forEach((item, currency) => {
    // Keep USD stable at 1.0
    if (currency === 'USD') return;
    
    const variation = 1 + (Math.random() * 0.001 - 0.0005);
    item.price = Number((item.price * variation).toFixed(8));
    item.date = new Date().toISOString();
  });

  io.emit('price_update', Array.from(pricesCache.values()));
}, 1000);

// Initialize server
fetchPrices().then(() => {
  server.listen(PORT, () => {
    console.log(`[PriceServer] Full-stack Server listening on http://localhost:${PORT}`);
  });
});
