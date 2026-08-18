## Prompt

_Look at `task.md` file to define clear requirements and permitted tools/libraries. Then create an implementation plan and I will review and tweak based on my direction. Initial thinking: we will have backend architecture, with API (REST + WebSocket), and frontend architecture, with React + TypeScript + Vite + Tailwind CSS_ and My direction as described as below.

## Implementation Plan Direction

Backend side:

- we will use NodeJs + ExpressJS, Typescript for type-safety and Socket IO for websocket.
- we don't use database here because it's considered overkilled so we would like to ditch data storage or caching (Redis for an instance) solutions. Instead, we would like to rely on local memory on client's browser to store user balances only (for example 0.001BTC and 950,000 USDT).
- We will use npm as our package manager
- You need to fetch available currencies from this source (https://interview.switcheo.com/prices.json - mentioned in task file)
- We can use API Polling (3s interval) or Websocket (0.5s interval) to get latest price of each asset.
- We will mock external APIs for price data (mentioned in the task above). For unavailable asset price, we can show the exclaimation mark for unavailable swap service and return error messages.

Frontend side:

- We use React + TypeScript + Vite + Tailwind CSS + Zustand for state management + Native websocket client to receive price update.
- User data (a random avatar, a randomly generated wallet address) and default balances (1,000,000 USD) is stored on client's browser - local storage.
- You need to fetch icon from the SVG source (mentioned in task file) - can consider using serwist or any caching tool to reduce page loading latency.
- Your layout should contain:
  - A header has a fixed svg logo on left side, dark/light theme, currency switch and user section on right side (avatar, wallet address and balance)
  - A main content with a swap form to swap user asset to target asset.
  - Main content - Top section is user asset (have a dropdown list of all currencies, but user just have some assets which leave other currencies 0 max amount display)
  - Main content - Bottom section is received amount follow exchange rate and fee policy (for example < 100usd -> 0.1% fee, >= 100usd -> 0.05% fee, >= 1000usd -> 0.02% fee)
  - Main content - Submit button should be disabled when the form is having error (contain invalid characters, exceed permitted amount or unavailable service), enable when user is performing correct process and loading (should be disabled) while waiting for server responses
  - Main content - After submit form: should display a success message and update user balance (decrease input asset amount, increase output asset amount)
  - Footer should contain @Copy Right 2026, Minh Hieu Nguyen aka Calvin and a social media list (fb, instagram, x, gmail) with empty href link.
