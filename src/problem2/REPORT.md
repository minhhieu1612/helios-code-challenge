# Development Progress & Change Log Report

This document details all progress entries, architectural decisions, error patches, enhancements, and implemented code locations for the **Fancy Currency Swap Application** (Problem 2).

---

## 📌 Progress Entry Index

| Entry ID | Tag | Title | Target Component |
| :--- | :--- | :--- | :--- |
| **PRG-01** | `[development]` | Express & Socket.IO Real-Time Price Server | Backend Server (`server/`) |
| **PRG-02** | `[development]` | Zustand State Store & LocalStorage Persistence | Frontend Store (`client/src/store`) |
| **PRG-03** | `[development]` | Header Navigation & User Balance Component | Frontend Header (`client/src/components`) |
| **PRG-04** | `[development]` | Swap Form & Tiered Fee Calculation Engine | Frontend SwapForm (`client/src/components`) |
| **PRG-05** | `[development]` | Searchable Currency Modal & Receipt Confirmation | Frontend Modals (`client/src/components`) |
| **PRG-06** | `[fix]` | Currency Feed Alignment (USDT -> USDC Default) | Frontend Store (`client/src/store`) |
| **PRG-07** | `[enhancement]` | Full-Stack Workspace Scripts & Vite Proxy Build | Monorepo Root (`package.json`) |
| **PRG-08** | `[update]` | WebSocket Heartbeat Interval & Icon Layout Fix | Full-Stack (`server/` & `client/`) |

---

## 📝 Granular Progress Details

### PRG-01: Express & Socket.IO Real-Time Price Server
- **Tag**: `[development]`
- **Business Logic & Solution Direction**:
  - Developed a Node.js + Express + TypeScript backend server.
  - Fetches token pricing data from Switcheo's official URL (`https://interview.switcheo.com/prices.json`), filtering duplicate assets by selecting the latest date entry.
  - Broadcasts live price updates every **1s** (1000ms) over Socket.IO with simulated micro market price variations (±0.05%).
  - Provides REST endpoints: `GET /api/prices` (returns normalized token prices) and `POST /api/swap` (executes transaction with simulated 1s network latency and fee calculations).
- **Error Patch**: Handled network timeouts and missing token prices by setting `isAvailable` flags and returning clean HTTP 400 error payloads for invalid currency requests.
- **Enhancement**: Implemented in-memory caching to ensure instant response times without requiring external databases or Redis.
- **Implemented Code**:
  - [`server/src/index.ts`](server/src/index.ts#L1-L185) (Lines 1–185): Express server setup, price fetch worker, REST API routes, and Socket.IO real-time price emitter.
  - [`server/package.json`](server/package.json#L1-L25) (Lines 1–25): Dependencies (`express`, `socket.io`, `axios`, `cors`, `ts-node-dev`).

---

### PRG-02: Zustand State Store & LocalStorage Persistence
- **Tag**: `[development]`
- **Business Logic & Solution Direction**:
  - Built a centralized Zustand state store to manage active swap inputs, live price lists, dark/light theme, user wallet balances, and transaction execution state.
  - Generates a random wallet address (`0x...`) and random Bottts avatar URL on first launch.
  - Initializes user balance with $1,000,000 USD portfolio split across USD, USDC, USDT, ETH, BTC, ATOM, and OSMO.
  - Synchronizes wallet state and theme choices to browser `localStorage`.
- **Error Patch**: Added fallback client-side swap calculation logic inside the Zustand store to ensure seamless functionality if the backend server is unreachable.
- **Enhancement**: Listens directly to Socket.IO `price_update` events and updates UI states reactively without manual polling.
- **Implemented Code**:
  - [`client/src/store/useSwapStore.ts`](client/src/store/useSwapStore.ts#L1-L270) (Lines 1–270): Zustand state store implementation with `localStorage` helpers.
  - [`client/src/types/index.ts`](client/src/types/index.ts#L1-L26) (Lines 1–26): TypeScript interfaces for `TokenPrice`, `UserWallet`, and `SwapReceipt`.

---

### PRG-03: Header Navigation & User Balance Component
- **Tag**: `[development]`
- **Business Logic & Solution Direction**:
  - Built the top navigation bar featuring a fixed SVG Switcheo branding logo, live socket connection indicator (`Live WebSocket 1s` / `Polling Sync`), theme toggle button, base currency badge (`$ USD Base`), user section with random avatar, copyable wallet address, and total portfolio USD balance calculation.
- **Error Patch**: Cleaned up unused import lint warnings (`Wallet`, `Zap`) to enforce strict TypeScript build standards.
- **Enhancement**: Implemented one-click clipboard copy for wallet address with temporary checkmark feedback icon.
- **Implemented Code**:
  - [`client/src/components/Header.tsx`](client/src/components/Header.tsx#L1-L98) (Lines 1–98): Header layout, dynamic portfolio valuation, and copy action.

---

### PRG-04: Swap Form & Tiered Fee Calculation Engine
- **Tag**: `[development]`
- **Business Logic & Solution Direction**:
  - Implemented the central swap form card:
    - **Top Section (Pay)**: Currency selector, user token balance display, MAX (100% balance) button, numeric input.
    - **Bottom Section (Receive)**: Calculated output amount based on streaming market exchange rate (`fromPrice / toPrice`) minus fee.
    - **Direction Switch**: Animated button to swap `fromToken` and `toToken`.
    - **Tiered Fee Policy**:
      - Trade Value `< $100 USD`: **0.10% fee**
      - Trade Value `$100 - $1,000 USD`: **0.05% fee**
      - Trade Value `>= $1,000 USD`: **0.02% fee**
- **Error Patch**: Fixed TypeScript prop assignment error on Lucide icon by wrapping `<Info />` inside a `<span>` element with the `title` attribute.
- **Enhancement**: Added real-time input validation (non-numeric, negative values, exceeding balance, unavailable pairs) with custom alert banner and loading spinner during submission.
- **Implemented Code**:
  - [`client/src/components/SwapForm.tsx`](client/src/components/SwapForm.tsx#L1-L280) (Lines 1–280): Swap form calculations, validation logic, fee tier evaluation, and submission handler.

---

### PRG-05: Searchable Currency Modal & Receipt Confirmation
- **Tag**: `[development]`
- **Business Logic & Solution Direction**:
  - Created `TokenSelectModal` allowing users to search tokens by name or symbol, click popular token tags (`ETH`, `USDC`, `BTC`, `ATOM`, `OSMO`), and view available balances per token.
  - Created `SuccessModal` transaction receipt pop-up displaying Tx Hash, swapped amount, received amount, fee rate, fee paid, and updated balance.
- **Error Patch**: Added image error handlers (`onError`) for token icons to hide missing SVG requests gracefully and show token symbol initials.
- **Enhancement**: Added animated checkmark bounce effect and dark backdrop blur overlay.
- **Implemented Code**:
  - [`client/src/components/TokenSelectModal.tsx`](client/src/components/TokenSelectModal.tsx#L1-L140) (Lines 1–140): Searchable currency picker modal.
  - [`client/src/components/SuccessModal.tsx`](client/src/components/SuccessModal.tsx#L1-L105) (Lines 1–105): Pop-up receipt confirmation modal.

---

### PRG-06: Currency Feed Alignment (USDT -> USDC Default)
- **Tag**: `[fix]`
- **Business Logic & Solution Direction**:
  - Discovered that Switcheo's `prices.json` feed contains `USDC`, `BUSD`, `axlUSDC`, but does not contain `USDT`. This caused initial app loading to flag `USDT` as an unavailable token pair.
- **Error Patch**: Replaced default `toToken` from `USDT` to `USDC` in `useSwapStore.ts` and added `USDC` to default user wallet balances.
- **Enhancement**: Ensures all default tokens have valid live market prices upon initial page load.
- **Implemented Code**:
  - [`client/src/store/useSwapStore.ts`](client/src/store/useSwapStore.ts#L60-L185) (Lines 60–185): Updated default token state and initial wallet allocation.

---

### PRG-07: Full-Stack Workspace Scripts & Vite Proxy Build
- **Tag**: `[enhancement]`
- **Business Logic & Solution Direction**:
  - Created workspace root `package.json` scripts allowing single-command startup (`npm run dev`) using `concurrently` to run backend server and frontend Vite app simultaneously.
- **Error Patch**: Updated TypeScript build scripts from `tsc` to `npx -p typescript tsc` across packages to prevent binary resolution failures on Windows environments.
- **Enhancement**: Configured Vite proxy rules (`/api` -> `http://localhost:3001`) for seamless cross-origin HTTP API calls in development.
- **Implemented Code**:
  - [`package.json`](package.json#L1-L18) (Lines 1–18): Workspace scripts.
  - [`client/vite.config.ts`](client/vite.config.ts#L1-L17) (Lines 1–17): Vite proxy configuration.

---

### PRG-08: WebSocket Heartbeat Interval & Icon Layout Fix
- **Tag**: `[update]`
- **Business Logic & Solution Direction**:
  - Updated WebSocket price streaming heartbeat interval from 0.5s (500ms) to **1s (1000ms)** in backend server.
  - Fixed token icon layout crashing in currency dropdown modal by enforcing `shrink-0` flexbox constraints and clean image load error handling.
- **Error Patch**: Fixed flexbox shrinking bug where long currency names compressed the token icon avatar container in `TokenSelectModal.tsx`.
- **Enhancement**: Improved UI stability and reduced WebSocket bandwidth consumption.
- **Implemented Code**:
  - [`server/src/index.ts`](server/src/index.ts#L165-L180) (Lines 165–180): Interval updated to 1000ms.
  - [`client/src/components/TokenSelectModal.tsx`](client/src/components/TokenSelectModal.tsx#L70-L110) (Lines 70–110): Fixed icon layout flexbox bounds with `shrink-0`.
  - [`client/src/components/Header.tsx`](client/src/components/Header.tsx#L40-L50) (Lines 40–50): Updated live socket indicator text to `Live WebSocket 1s`.
