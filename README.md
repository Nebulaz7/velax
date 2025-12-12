# Velax: The Campus Exchange (Sui Hackathon 2025)

**Concept:** A decentralized, gasless marketplace for university students.  
**Stack:** Next.js 15, Tailwind, Supabase, Sui Move, Walrus Storage, zkLogin.  
**Unique Selling Point:** Invisible Web3 (Google Login + Sponsored Transactions) + Decentralized Storage (Walrus).

---

## 📅 The 5-Day Sprint Plan

### **Day 0: Setup & Configuration**

**Goal:** Initialize all frameworks and connect the plumbing.

- [ ] **Sui Environment**
  - Install Sui CLI.
  - Create a new Move project: `sui move new velax_contract`.
  - Get a Sui Testnet address and fund it via Discord faucet.
- [ ] **Frontend (Next.js 15)**
  - Run: `npx create-next-app@latest velax --typescript --tailwind --eslint`.
  - _Note:_ Select `App Router`.
  - Install Core Deps: `npm install @mysten/sui @mysten/dapp-kit clsx tailwind-merge @supabase/supabase-js @tanstack/react-query`.
- [ ] **Backend (Supabase)**
  - Create new Project "Velax".
  - Create Table: `items`
    - `id` (int8, primary)
    - `sui_object_id` (text, unique)
    - `seller` (text)
    - `price` (int8)
    - `blob_id` (text) - _For Walrus image_
    - `status` (text) - _'listed' | 'sold'_
    - `created_at` (timestamptz)

---

### **Day 1: The Smart Contract (Move)**

**Goal:** Deploy the Escrow Logic to Testnet.

- [ ] **Write `sources/market.move`**
  - Define `struct Listing` (Shared Object).
  - Implement `list_item` (Creates object, emits Event).
  - Implement `buy_item` (Takes Coin, adds to balance, locks object).
  - Implement `confirm_item` (Transfers funds to seller).
- [ ] **Deploy**
  - Run `sui move build`.
  - Run `sui client publish --gas-budget 100000000`.
  - **SAVE** the `Package ID` and `Listing Module` name in a `.env.local` file in the frontend.

---

### **Day 2: Walrus Storage & Supabase Indexer**

**Goal:** Handle data storage without a heavy backend.

- [ ] **Walrus Integration (Next.js API Route)**
  - Create `app/api/upload/route.ts`.
  - Implement logic to receive `FormData` (image).
  - Perform `PUT` request to `https://publisher.walrus-testnet.walrus.space/v1/store`.
  - Return the `blobId`.
- [ ] **Supabase Sync Script (The Indexer)**
  - Create a script `scripts/indexer.ts`.
  - Use `SuiClient.queryEvents` to fetch `ItemListed` events.
  - Upsert new events into Supabase `items` table.
  - _Hack:_ Run this script manually periodically or use a simple `setInterval` in a background Node process.

---

### **Day 3: Frontend & zkLogin (Auth)**

**Goal:** Users can login with Google and see the marketplace.

- [ ] **zkLogin Implementation**
  - Setup Google Cloud Console (OAuth Client ID).
  - Wrap app in `<SuiClientProvider>` and `<WalletProvider>`.
  - Implement Login Button using `@mysten/dapp-kit`.
- [ ] **Marketplace Feed**
  - Create `app/page.tsx`.
  - Fetch data from **Supabase** using standard `useEffect` + `supabase.from('items').select('*')` (or Server Actions).
  - Display Grid of Items.
  - **Image Source:** Use `https://aggregator.walrus-testnet.walrus.space/v1/<blob_id>`.

---

### **Day 4: Sponsored Transactions (The Magic)**

**Goal:** Make the "List Item" action free.

- [ ] **Gas Station Setup**
  - Register for **Shinami** (easiest for hackathon) OR set up a local backend wallet.
- [ ] **Transaction Flow**
  - Create `app/actions/createListing.ts`.
  - Build the `TransactionBlock` (PTB).
  - Send PTB bytes to Shinami/Sponsor to sign.
  - Return signed transaction to frontend.
  - User executes the transaction.

---

### **Day 5: Polish & Demo**

**Goal:** Make it look good and record the winning video.

- [ ] **UI Polish**
  - Add "Loading..." skeletons using Tailwind `animate-pulse`.
  - Add "Success" toasts (e.g., "Item Listed on Sui!").
- [ ] **The Demo Video Checklist**
  - Show Google Login (Speed).
  - Show Listing an Item (Free/Sponsored).
  - Show the Image loading from Walrus (Decentralized).
  - Show the Buy interaction (Escrow safety).

---

## 🛠 Tech Stack Details

**Frontend:**

- Next.js 15 (App Router)
- Tailwind CSS (Styling)
- Lucide React (Icons)
- React Query

**Blockchain:**

- Sui Move (Smart Contracts)
- Walrus (Decentralized Storage)
- zkLogin (Identity)
- Shinami (Gas Station / Sponsored Tx)

**Backend:**

- Supabase (Database / Indexer)

---

## 📝 Key Commands

**Sui Build:**

```bash
sui move build
```

Sui Publish:

```bash
sui client publish --gas-budget 100000000 --skip-dependency-verification
```

Next.js Dev:

```bash

npm run dev
```
