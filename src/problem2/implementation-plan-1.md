# Implementation Plan - Problem 2: Fancy Currency Swap Form & Server

Implement a full-stack currency swap application featuring a React + Vite + Tailwind CSS + Zustand frontend paired with a Node.js + Express + TypeScript + Socket.IO backend service, adhering strictly to the prompt guidelines in [`solution.md`](solution.md) and [`task.md`](task.md).

---

## User Review Required

> [!IMPORTANT]
> **Architecture Overview**: The project will be organized inside `src/problem2` with separate frontend (`client`) and backend (`server`) subfolders, unified by a root package manager script for single-command launching (`npm run dev`).
>
> **Data Persistence**: As requested, user balances, wallet address, avatar, and settings are stored locally in the browser's `localStorage` (ditching DB/Redis).

---

## Proposed Changes

### Project & Backend Setup (`src/problem2/server`)

#### [NEW] [`package.json`](package.json)

- Workspace root configuration with scripts to install dependencies and run both `client` and `server` concurrently.

#### [NEW] [`server/package.json`](server/package.json)

- Express, Socket.IO, TypeScript, `tsx`/`ts-node-dev`, `axios`, `cors`, `dotenv`.

#### [NEW] [`server/src/index.ts`](server/src/index.ts)

- Express server initialization with HTTP & Socket.IO server on port 3001.
- Fetch token prices from `https://interview.switcheo.com/prices.json` and cache them in memory.
- Periodic background worker emitting live price updates via Socket.IO every 1000ms (with slight realistic price fluctuations).
- REST API endpoints:
  - `GET /api/prices`: Fetch latest token prices.
  - `POST /api/swap`: Process swap transactions with simulated delay (1s), validation, and error responses for unsupported assets.

---

### Frontend Setup (`src/problem2/client`)

#### [NEW] [`client/package.json`](client/package.json)

- Vite + React + TypeScript + Tailwind CSS (v3) + Zustand + Socket.IO-client + Lucide-react + Framer Motion.

#### [NEW] [`client/src/types/index.ts`](client/src/types/index.ts)

- TypeScript interfaces for `Token`, `PriceData`, `UserWallet`, `SwapQuote`, `TransactionHistory`.

#### [NEW] [`client/src/store/useSwapStore.ts`](client/src/store/useSwapStore.ts)

- Zustand store managing:
  - User wallet state (Avatar, Random Wallet Address, Token Balances loaded/saved to `localStorage`, initialized with 1,000,000 USD balance split across USD/ETH/USDT/BTC).
  - Dark / Light Theme state.
  - Live Token Prices & Socket.IO connection status.
  - Active Swap Form state (`fromToken`, `toToken`, `fromAmount`, `toAmount`, `feePercentage`, `slippage`).
  - Swap execution action (calls backend `POST /api/swap` and updates balances on success).

#### [NEW] Header Component [`client/src/components/Header.tsx`](client/src/components/Header.tsx)

- Left: Fixed SVG Logo ("Switcheo Swap / Helios").
- Right: Dark/Light theme toggle switch, Base currency indicator, User section with random avatar, copyable wallet address (`0x...`), and total portfolio USD balance.

#### [NEW] Swap Form Component [`client/src/components/SwapForm.tsx`](client/src/components/SwapForm.tsx)

- **Top Section (Pay / From Asset)**:
  - Currency dropdown with search/filter, token icons fetched from `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${symbol}.svg` (with fallback icon).
  - Displays user's available balance for selected token.
  - Quick 'MAX' button to auto-fill 100% of balance.
- **Swap Direction Switch Button**:
  - Interactive button with rotation animation to swap `fromToken` and `toToken`.
- **Bottom Section (Receive / To Asset)**:
  - Output amount dynamically calculated using live exchange rate (`fromPrice / toPrice`) minus fee.
  - Fee Policy Tier indicator:
    - `< $100`: **0.1% fee**
    - `$100 - $1,000`: **0.05% fee**
    - `>= $1,000`: **0.02% fee**
- **Validation & Submit Button**:
  - Validates numeric inputs, decimal formats, balance bounds, and price availability.
  - Shows warning banner with exclamation icon if selected asset lacks price data or service is unavailable.
  - Disabled state when invalid/over-balance/unavailable.
  - Loading spinner & disabled state during backend processing.
- **Success Modal / Toast**:
  - Displays transaction receipt with execution summary, gas/fee breakdown, and updated balance confirmation.

#### [NEW] Footer Component [`client/src/components/Footer.tsx`](client/src/components/Footer.tsx)

- `@Copyright 2026, Minh Hieu Nguyen aka Calvin`
- Social media links (Facebook, Instagram, X, Gmail) with `#` href.

---

## Verification Plan

### Automated Tests

1. **Build Verification**:
   - Run `npm run build` in client and server packages to verify TypeScript type-checking and bundling.
2. **Backend Service Health**:
   - Verify `GET /api/prices` returns valid token JSON data.
   - Test `POST /api/swap` endpoint validation logic.

### Manual Verification

1. **Interactive Swap Flow**:
   - Test swapping valid assets (e.g. ETH -> USDC, USD -> BTC) and confirm balances update correctly in LocalStorage.
   - Verify MAX button functionality and fee calculations (< $100, $100-$1000, >= $1000).
   - Test error cases: entering negative numbers, non-numeric strings, amounts > balance, or selecting tokens without price data (exclamation icon & disabled button).
   - Toggle Light/Dark mode and confirm UI responsiveness across screen sizes.
