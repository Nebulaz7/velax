# Velax | Instant Refund NFT Auctions

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Sui](https://img.shields.io/badge/Sui-Blockchain-4DA2FF)
![Next.js](https://img.shields.io/badge/Next.js-15-black)

**Velax** is a next-generation decentralized NFT auction marketplace built on **Sui**. It revolutionizes the auction experience by introducing **Atomic Instant Refunds** and a completely frictionless **Web2-like UX**.

---

## 🚀 Key Features

### 1. ⚡ Instant "Atomic" Refunds

In traditional auctions, if you are outbid, your funds are locked until you manually claim them.
In **Velax**, refunds happen **atomically in the same transaction block**.

- User A bids 1 SUI.
- User B bids 2 SUI.
- **User A is instantly refunded 1 SUI** automatically. No waiting, no claiming.

### 2. 🪄 Invisible Web3 (Enoki)

We removed the barrier to entry.

- **zkLogin:** Sign in with **Google**. No seed phrases, no wallet extensions required.
- **Gasless Transactions:** Users don't need SUI for gas. We sponsor all transactions using **Enoki Gas Station**.

### 3. 📡 Real-Time Indexer

A custom-built off-chain indexer listens to Sui blockchain events in real-time, ensuring the UI is always in sync with on-chain data without heavy RPC querying on the client side.

### 4. 🛒 Full Marketplace

- **Browse & Bid** - Discover NFT auctions from other users
- **Create Auctions** - List your NFTs with custom starting prices and durations
- **Dashboard** - Track your active bids, listings, and transaction history

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    User  (Login)                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js Frontend                            │
│              (React, TypeScript, Tailwind CSS)                  │
├─────────────────────────────────────────────────────────────────┤
│  • Market Page      • Create Auction     • User Dashboard       │
│  • Real-time Bids   • Wallet Auth        • Transaction History  │
└─────────────────────────────────────────────────────────────────┘
                    │                           │
                    ▼                           ▼
┌───────────────────────────────┐   ┌─────────────────────────────┐
│      Enoki Gas Station        │   │     Supabase Database       │
│  • zkLogin (Google Auth)     │   │  • PostgreSQL               │
│  • Sponsored Transactions     │   │  • Real-time Subscriptions  │
│  • No wallet required         │   │  • Indexed Auction Data     │
└───────────────────────────────┘   └─────────────────────────────┘
                    │                           ▲
                    ▼                           │
┌─────────────────────────────────────────────────────────────────┐
│                      Sui Blockchain                             │
├─────────────────────────────────────────────────────────────────┤
│  • Move Smart Contracts       • Atomic Refund Logic             │
│  • NFT Auction Module         • Event Emissions                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Node.js Indexer (Railway)                     │
│         Polls blockchain events → Updates Supabase              │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Login (Google or connect wallet) → zkLogin via Enoki → Ephemeral Keypair Generated
         │
         ▼
User Bids on Auction → Frontend builds TX → Enoki sponsors gas
         │
         ▼
Transaction executes on Sui → Atomic refund to previous bidder
         │
         ▼
Blockchain emits event → Indexer catches event → Supabase updated
         │
         ▼
Frontend reads Supabase → UI updates in real-time
```

---

## 🛠️ Tech Stack

### Frontend

| Technology        | Purpose                         |
| ----------------- | ------------------------------- |
| **Next.js 15**    | React framework with App Router |
| **TypeScript**    | Type-safe development           |
| **Tailwind CSS**  | Utility-first styling           |
| **shadcn/ui**     | Accessible UI components        |
| **Framer Motion** | Animations and transitions      |
| **Lucide React**  | Icon library                    |

### Blockchain & Auth

| Technology            | Purpose                          |
| --------------------- | -------------------------------- |
| **Sui (Testnet)**     | Layer 1 blockchain               |
| **Move Language**     | Smart contract development       |
| **Enoki (zkLogin)**   | Google authentication, no wallet |
| **Enoki Gas Station** | Sponsored/gasless transactions   |
| **@mysten/sui**       | Sui TypeScript SDK               |
| **@mysten/enoki**     | Enoki integration                |

### Backend & Database

| Technology          | Purpose                                |
| ------------------- | -------------------------------------- |
| **Supabase**        | PostgreSQL database, real-time updates |
| **Node.js Indexer** | Blockchain event listener              |
| **Railway**         | Indexer hosting                        |

---

## 📁 Project Structure

```
CampusTrade/
├── velax-frontend/              # Next.js frontend application
│   ├── app/                     # App Router pages
│   │   ├── market/             # NFT auction marketplace
│   │   ├── create/             # Create new auction
│   │   ├── dashboard/          # User dashboard
│   │   ├── auction/[id]/       # Individual auction page
│   │   └── layout.tsx          # Root layout with providers
│   ├── components/
│   │   ├── layout/             # Navbar, Footer, AuthButton
│   │   └── ui/                 # shadcn/ui components
│   ├── lib/
│   │   ├── supabase/           # Supabase client config
│   │   ├── enoki/              # Enoki/zkLogin setup
│   │   └── utils.ts            # Helper functions
│   └── public/                 # Static assets
│
├── velax-contract/             # Sui Move smart contracts
│   ├── sources/
│   │   └── auction.move        # Atomic refund auction logic
│   └── Move.toml               # Move package config
│
├── velax-indexer/              # Blockchain event indexer
│   ├── src/
│   │   └── index.ts            # Event polling & DB sync
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17+
- npm or yarn
- Google account (for zkLogin)
- Sui CLI (for contract deployment)

### Frontend Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/CampusTrade.git
   cd CampusTrade/velax-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Sui
   NEXT_PUBLIC_SUI_NETWORK=testnet
   NEXT_PUBLIC_PACKAGE_ID=your_deployed_package_id

   # Enoki
   NEXT_PUBLIC_ENOKI_API_KEY=your_enoki_api_key
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

### Smart Contract Deployment

1. **Install Sui CLI**

   ```bash
   cargo install --locked --git https://github.com/MystenLabs/sui.git sui
   ```

2. **Build the contract**

   ```bash
   cd velax-contract
   sui move build
   ```

3. **Deploy to testnet**

   ```bash
   sui client publish --gas-budget 100000000
   ```

4. **Save the Package ID** to your `.env.local`

### Indexer Setup

1. **Navigate to indexer**

   ```bash
   cd velax-indexer
   npm install
   ```

2. **Configure environment**

   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_service_key
   SUI_RPC_URL=https://fullnode.testnet.sui.io
   PACKAGE_ID=your_package_id
   ```

3. **Run the indexer**

   ```bash
   npm start
   ```

---

## 🔧 Environment Variables

| Variable                        | Description                   |
| ------------------------------- | ----------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL          |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key        |
| `NEXT_PUBLIC_SUI_NETWORK`       | Sui network (testnet/mainnet) |
| `NEXT_PUBLIC_PACKAGE_ID`        | Deployed Move package ID      |
| `NEXT_PUBLIC_ENOKI_API_KEY`     | Enoki API key for zkLogin     |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID`  | Google OAuth client ID        |

---

## 💡 How Atomic Refunds Work

```move
// Simplified Move logic
public entry fun place_bid(auction: &mut Auction, payment: Coin<SUI>, ctx: &mut TxContext) {
    let bidder = tx_context::sender(ctx);
    let bid_amount = coin::value(&payment);

    // Refund previous bidder atomically
    if (option::is_some(&auction.highest_bidder)) {
        let prev_bidder = *option::borrow(&auction.highest_bidder);
        let refund = coin::take(&mut auction.escrow, auction.highest_bid, ctx);
        transfer::public_transfer(refund, prev_bidder);  // ⚡ Instant refund!
    }

    // Accept new bid
    coin::put(&mut auction.escrow, payment);
    auction.highest_bid = bid_amount;
    auction.highest_bidder = option::some(bidder);
}
```

---

## 📱 Screenshots

_Coming soon_

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Built with ❤️ for **Sui Hackathon 2025**

---

<p align="center">
  <strong>⚡ Velax — Bid Fast, Get Refunded Faster ⚡</strong>
</p>
