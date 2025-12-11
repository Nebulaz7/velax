# CampusTrade - NFT Campus Marketplace

## 5-Day Implementation Plan (Strategy Guide)

> **A decentralized peer-to-peer marketplace where every product is an NFT. Built on Sui with zkLogin, sponsored transactions, and Walrus storage.**

---

## 🎯 Project Overview

### The Problem

- Students spend $500+ on new items each semester
- Facebook groups are unsafe, unorganized, prone to scams
- No verification, no payment protection, no reputation system
- Items lose their history when resold

### The Solution

**CampusTrade** - A blockchain marketplace where:

- ✅ **Products are NFTs** with full ownership and provenance
- ✅ **Zero friction** - Login with Google (zkLogin)
- ✅ **Zero fees** - All transactions sponsored
- ✅ **Decentralized storage** - Images on Walrus
- ✅ **Safe trading** - Built-in escrow system
- ✅ **Trust system** - On-chain reputation

### Why This Wins

1. **Real problem** - Students actually buy/sell constantly
2. **Network effects** - Each university is a community
3. **Defensible moat** - On-chain reputation and provenance
4. **Clear value prop** - Better than Facebook groups in every way
5. **Demonstrates Sui's power** - zkLogin + Sponsored Txns + Walrus + Move

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** (App Router) - Modern React framework
- **TypeScript** - Type safety
- **TailwindCSS** - Rapid styling
- **@mysten/dapp-kit** - Sui React hooks
- **@mysten/sui.js** - Sui SDK
- **@mysten/enoki** - Managed zkLogin + Sponsorship

### Backend

- **Supabase** - PostgreSQL database for caching & analytics
- **Enoki by Mysten Labs** - Handles zkLogin + Gas sponsorship
- **Walrus** - Decentralized blob storage for images

### Blockchain

- **Sui Testnet** → Mainnet
- **Move Language** - Smart contracts
- **Sui CLI** - Deployment

---

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                            │
│  Next.js App (User authenticates, creates/views NFTs)   │
└───────────────────┬─────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
┌─────────────┐ ┌──────────┐ ┌────────────┐
│   Enoki     │ │ Walrus   │ │ Supabase   │
│  zkLogin +  │ │  Image   │ │   Cache +  │
│ Sponsorship │ │ Storage  │ │ Analytics  │
└─────────────┘ └──────────┘ └────────────┘
        │           │
        │           │
        ▼           ▼
┌─────────────────────────────────────────┐
│          SUI BLOCKCHAIN                  │
│  • ProductNFT Contract (mint, transfer) │
│  • Escrow Contract (safe payments)      │
│  • Reputation Contract (trust scores)   │
└─────────────────────────────────────────┘
```

---

## 📅 5-DAY IMPLEMENTATION PLAN

---

## 📆 DAY 1: Foundation & Authentication

### Goal

✅ User can login with Google and see their Sui address

### Morning Session (4 hours)

#### 1. Project Setup

**Tasks:**

- [ ] Create Next.js 14 project with TypeScript and Tailwind
- [ ] Install Sui dependencies: `@mysten/dapp-kit`, `@mysten/sui.js`, `@mysten/enoki`
- [ ] Install Supabase client: `@supabase/supabase-js`
- [ ] Set up folder structure (see below)

**Folder Structure:**

```
campustrade/
├── src/
│   ├── app/                    # Next.js pages
│   ├── components/             # React components
│   │   ├── auth/              # Login components
│   │   ├── products/          # Product components
│   │   └── layout/            # Navbar, Footer
│   ├── lib/                   # Utilities
│   │   ├── sui/              # Sui client, queries
│   │   ├── walrus/           # Walrus upload/fetch
│   │   └── supabase/         # Database client
│   └── types/                 # TypeScript types
├── move/                      # Smart contracts
│   └── campustrade/
│       ├── sources/           # Move files
│       └── Move.toml
└── .env.local                 # Secrets
```

#### 2. Supabase Setup

**Tasks:**

- [ ] Create new Supabase project at supabase.com
- [ ] Create database tables:
  - **user_data** - OAuth data, Sui addresses
  - **products_cache** - Cache products from Sui for faster loading
  - **transactions_log** - Analytics on all transactions
  - **reputation_scores** - User trust scores
- [ ] Copy project URL and anon key
- [ ] Add to `.env.local`

**Why Supabase?**

- Fast queries (caching blockchain data)
- User analytics
- Real-time subscriptions (future feature)
- Free tier is generous

#### 3. Enoki Setup

**Tasks:**

- [ ] Sign up at enoki.mystenlabs.com
- [ ] Create new app called "CampusTrade"
- [ ] Select Testnet
- [ ] Get API key
- [ ] Add to `.env.local`

**Why Enoki?**

- Handles zkLogin complexity (salt management, proving service)
- Provides gas sponsorship out of the box
- Production-ready infrastructure
- Saves days of implementation time

#### 4. Google OAuth Setup

**Tasks:**

- [ ] Go to Google Cloud Console
- [ ] Create OAuth 2.0 Client ID
- [ ] Set authorized redirect URI: `http://localhost:3000/auth/callback`
- [ ] Get Client ID
- [ ] Add to `.env.local`

#### 5. Environment Variables

**Create `.env.local` with:**

- Enoki API key
- Google Client ID
- Supabase URL and key
- Walrus endpoints
- Sui network (testnet)
- Package ID (will add after deployment)

### Afternoon Session (4 hours)

#### 6. Implement zkLogin with Enoki

**Tasks:**

- [ ] Create Enoki provider component (wraps app)
- [ ] Create login button component
- [ ] Handle OAuth redirect/callback
- [ ] Test login flow end-to-end
- [ ] Store user address in state

**Key Concepts:**

- Enoki manages all zkLogin complexity
- User clicks "Login with Google"
- Redirects to Google OAuth
- Returns to callback page
- Enoki validates and creates session
- User sees their Sui address

#### 7. Test User State Management

**Tasks:**

- [ ] Verify address persists on refresh
- [ ] Test logout flow
- [ ] Handle errors gracefully

### Evening Session (2 hours)

#### 8. Build Landing Page

**Tasks:**

- [ ] Create hero section with value proposition
- [ ] Add navigation bar with login button
- [ ] Create "Features" section (3 cards):
  - 🔐 Zero Friction (Google login)
  - 💸 Zero Fees (sponsored)
  - 🎨 True Ownership (NFTs)
- [ ] Make it mobile responsive
- [ ] Add simple animations

**Design Principles:**

- Clean, modern UI
- Clear call-to-action
- Trust indicators
- Student-friendly vibe

### ✅ Day 1 Success Criteria

- [ ] User can click "Login with Google"
- [ ] OAuth flow completes successfully
- [ ] User sees their Sui address after login
- [ ] Logout works correctly
- [ ] Landing page looks professional

**Test Plan:**

1. Start dev server: `npm run dev`
2. Click login button
3. Complete Google OAuth
4. Verify address displays
5. Refresh page - still logged in
6. Logout - address disappears

---

## 📆 DAY 2: Smart Contracts & Storage

### Goal

✅ ProductNFT contract deployed + Images uploadable to Walrus

### Morning Session (5 hours)

#### 9. Move Development Environment

**Tasks:**

- [ ] Install Sui CLI if not installed
- [ ] Configure Sui CLI for testnet
- [ ] Get testnet SUI from faucet
- [ ] Initialize Move project in `move/campustrade/`
- [ ] Understand Move.toml structure

**Important Commands:**

```bash
sui client active-env  # Check current network
sui client gas        # Check SUI balance
sui move new          # Initialize project
sui move build        # Compile
sui move test         # Run tests
sui client publish    # Deploy
```

#### 10. ProductNFT Smart Contract

**Tasks:**

- [ ] Design ProductNFT struct with all fields:
  - id, title, description, image_blob_id
  - price, seller, category, condition
  - created_at, status
- [ ] Implement `mint_product` function
- [ ] Implement `update_price` function
- [ ] Implement `update_status` function (for escrow)
- [ ] Add proper access control (only seller can update)
- [ ] Add error constants
- [ ] Add getter functions

**Key Concepts:**

- `has key, store` - Makes it an NFT (transferable)
- `public entry fun` - Can be called from transactions
- `public(package)` - Only other modules can call
- `TxContext` - Access sender, timestamp, etc.

**AI Assistant Prompts:**

- "Explain Sui Move struct capabilities (key, store, drop, copy)"
- "How do I ensure only the NFT owner can update price?"
- "What's the best way to store a vector of transaction history?"
- "Review my Move contract for security vulnerabilities"

#### 11. Build, Test, Deploy

**Tasks:**

- [ ] Run `sui move build` - fix any errors
- [ ] Write basic unit tests (optional if time-constrained)
- [ ] Deploy to testnet: `sui client publish --gas-budget 100000000`
- [ ] **CRITICAL:** Save the output:
  - Transaction Digest
  - Package ID (0x...)
  - Object IDs
- [ ] Update `.env.local` with Package ID
- [ ] Test by minting a sample NFT via CLI

**Deployment Checklist:**

- [ ] Contract compiles without errors
- [ ] All functions have proper access control
- [ ] Error handling in place
- [ ] Package ID saved
- [ ] Test mint successful

### Afternoon Session (3 hours)

#### 12. Walrus Setup

**Tasks:**

- [ ] Read Walrus documentation
- [ ] Choose between Walrus CLI or HTTP API
- [ ] For hackathon: Use HTTP API (faster setup)
- [ ] Test upload with curl/Postman
- [ ] Test retrieval with blob ID

**Walrus Endpoints:**

- **Publisher:** `https://publisher.walrus-testnet.walrus.space/v1/store`
- **Aggregator:** `https://aggregator.walrus-testnet.walrus.space/v1/{blobId}`

**Test Commands:**

```bash
# Upload
curl -X PUT [publisher-url] --upload-file image.jpg

# Should return JSON with blobId
# Try accessing: [aggregator-url]/[blobId]
```

#### 13. Walrus Client Implementation

**Tasks:**

- [ ] Create `walrus/client.ts`
- [ ] Implement `uploadToWalrus(file: File): Promise<string>`
- [ ] Implement `getWalrusUrl(blobId: string): string`
- [ ] Implement `fetchFromWalrus(blobId: string): Promise<Blob>`
- [ ] Add error handling
- [ ] Add retry logic for failed uploads

**Key Considerations:**

- Handle both `newlyCreated` and `alreadyCertified` responses
- Image files typically 500KB - 5MB
- Walrus is decentralized - no single point of failure
- Blob IDs are permanent

#### 14. Test Walrus Integration

**Tasks:**

- [ ] Create `/test-walrus` page
- [ ] Add file input
- [ ] Upload image, get blob ID
- [ ] Display image using Walrus URL
- [ ] Test with different file types (jpg, png, webp)
- [ ] Verify images load correctly

### ✅ Day 2 Success Criteria

- [ ] ProductNFT contract deployed successfully
- [ ] Package ID saved in environment
- [ ] Can mint NFT via Sui CLI
- [ ] Images upload to Walrus successfully
- [ ] Images display from Walrus URLs
- [ ] Test page confirms full cycle works

**Test Plan:**

1. Upload test image to Walrus
2. Get blob ID
3. Display image in browser
4. Mint test NFT via CLI with blob ID
5. Query NFT and verify data

---

## 📆 DAY 3: Product Creation & Marketplace

### Goal

✅ Users can create product listings (mint NFTs) and view all listings

### Morning Session (4 hours)

#### 15. TypeScript Types

**Tasks:**

- [ ] Define `Product` interface
- [ ] Define category constants (Textbooks, Electronics, etc.)
- [ ] Define condition constants (New, Like New, Good, Fair)
- [ ] Define status constants (Listed, In Escrow, Sold)
- [ ] Export all types

**Why Types Matter:**

- Prevents bugs
- Better autocomplete
- Clearer code
- Easier refactoring

#### 16. Create Listing Page

**Tasks:**

- [ ] Create `/create` route
- [ ] Build form with all fields:
  - Title (text input)
  - Description (textarea)
  - Price (number input with SUI symbol)
  - Category (select dropdown)
  - Condition (select dropdown)
  - Image (file upload with preview)
- [ ] Add form validation
- [ ] Add loading states
- [ ] Add error messages

**UX Considerations:**

- Image preview before upload
- Clear validation errors
- Price in SUI (convert to MIST internally)
- Disable submit while uploading
- Success message on completion

#### 17. Product Minting Logic

**Tasks:**

- [ ] On form submit:
  1. Validate all fields
  2. Upload image to Walrus
  3. Get blob ID
  4. Create Sui transaction
  5. Call `mint_product` with all data
  6. Execute transaction (Enoki sponsors it!)
  7. Show success message
  8. Redirect to homepage
- [ ] Handle errors at each step
- [ ] Show progress indicator

**Transaction Building:**

- Use `Transaction` from Sui SDK
- Convert price: SUI to MIST (× 1,000,000,000)
- Pass blob ID as string
- Enoki handles signing and sponsorship

### Afternoon Session (4 hours)

#### 18. Sui Queries Module

**Tasks:**

- [ ] Create `sui/queries.ts`
- [ ] Implement `getAllProducts()`:
  - Query all ProductNFT objects
  - Parse fields from blockchain
  - Convert MIST back to SUI
  - Return typed array
- [ ] Implement `getProductById(id: string)`
- [ ] Implement `getProductsBySeller(address: string)`
- [ ] Add error handling

**Querying Strategy:**

- Use `getOwnedObjects` for user-specific queries
- Use `getDynamicFields` for marketplace-wide queries
- Cache results in Supabase for faster loading
- Implement pagination for scalability

#### 19. Product Feed Page

**Tasks:**

- [ ] Update homepage to fetch products
- [ ] Display products in grid layout (3 columns desktop, 1 mobile)
- [ ] Create ProductCard component:
  - Product image from Walrus
  - Title
  - Price in SUI
  - Seller address (truncated)
  - Category badge
  - Condition badge
  - "View Details" button
- [ ] Add loading skeletons
- [ ] Handle empty state

**Design Principles:**

- Card hover effects
- Clear pricing
- Trust indicators (seller info)
- Mobile-first responsive

#### 20. Product Detail Page

**Tasks:**

- [ ] Create `/product/[id]` route
- [ ] Fetch single product by ID
- [ ] Display full details:
  - Large image
  - Full description
  - Seller information
  - Created date
  - Status
- [ ] Add "Buy Now" button (implement tomorrow)
- [ ] Add breadcrumbs for navigation

### ✅ Day 3 Success Criteria

- [ ] Users can create new product listings
- [ ] Images upload to Walrus during creation
- [ ] Product NFTs mint successfully (gasless!)
- [ ] Homepage displays all products
- [ ] Product detail page shows full info
- [ ] UI is responsive and polished

**Test Plan:**

1. Login with Google
2. Click "Create Listing"
3. Fill form, upload image
4. Submit (should be free)
5. Verify product appears on homepage
6. Click product, see detail page
7. Create 2-3 more listings
8. Verify all appear correctly

---

## 📆 DAY 4: Escrow & Trading

### Goal

✅ Complete buy/sell flow with escrow protection

### Morning Session (4 hours)

#### 21. Escrow Smart Contract

**Tasks:**

- [ ] Create `escrow.move` module
- [ ] Design `TradeEscrow` struct:
  - id, nft (locked), payment (locked)
  - buyer, seller, status
- [ ] Implement `create_escrow`:
  - Lock NFT and payment
  - Create escrow object
- [ ] Implement `confirm_delivery`:
  - Buyer confirms receipt
  - Transfer NFT to buyer
  - Transfer payment to seller
  - Update reputations
- [ ] Implement `dispute_trade` (basic version)
- [ ] Add access controls

**Security Considerations:**

- Only buyer can confirm delivery
- Only after confirmation can funds release
- NFT and payment locked together atomically
- Prevent reentrancy issues

**AI Assistant Prompts:**

- "How do I lock an NFT in an escrow contract in Sui Move?"
- "Explain coin splitting and merging in Sui"
- "What's the safest way to transfer objects conditionally?"
- "Review this escrow contract for vulnerabilities"

#### 22. Deploy Escrow Contract

**Tasks:**

- [ ] Build updated package with escrow
- [ ] Deploy to testnet
- [ ] Update Package ID (or note new module)
- [ ] Test escrow creation via CLI
- [ ] Test completion flow

### Afternoon Session (4 hours)

#### 23. Buy Button Implementation

**Tasks:**

- [ ] Create `BuyButton` component
- [ ] On click:
  1. Get user's SUI balance
  2. Verify sufficient funds
  3. Create transaction:
     - Split coin for payment amount
     - Get NFT object reference
     - Call `create_escrow`
  4. Execute (Enoki sponsors gas!)
  5. Show success message
- [ ] Disable button if:
  - User is the seller
  - Insufficient balance
  - Product not available
- [ ] Add confirmation modal

**Transaction Structure:**

```
1. tx.splitCoins(tx.gas, [amount])
2. tx.moveCall({
     target: escrow::create_escrow,
     arguments: [nftId, payment]
   })
3. Execute with Enoki
```

#### 24. Escrow Status Page

**Tasks:**

- [ ] Create `/escrow/[id]` page
- [ ] Show escrow details:
  - Product info
  - Buyer and seller
  - Payment amount
  - Current status
- [ ] For buyers: "Confirm Delivery" button
- [ ] For sellers: "Track Status" view
- [ ] Add status timeline

#### 25. Complete Trade Flow

**Tasks:**

- [ ] Implement "Confirm Delivery" button
- [ ] Create transaction to call `confirm_delivery`
- [ ] Execute (gasless)
- [ ] Show success message
- [ ] Update UI to show NFT in buyer's wallet
- [ ] Test full flow multiple times

### Evening Session (2 hours)

#### 26. Profile Page

**Tasks:**

- [ ] Create `/profile` page
- [ ] Show user's products:
  - Listed items
  - Items in escrow (as buyer or seller)
  - Sold items
- [ ] Show reputation score (if implemented)
- [ ] Add "Create Listing" shortcut

### ✅ Day 4 Success Criteria

- [ ] Escrow contract deployed and working
- [ ] Users can purchase products
- [ ] Payment and NFT lock in escrow
- [ ] Buyers can confirm delivery
- [ ] NFTs transfer to buyers on confirmation
- [ ] Payments release to sellers
- [ ] All transactions are gasless
- [ ] Full buy/sell cycle tested successfully

**Test Plan:**

1. User A lists product
2. User B buys product
3. Verify escrow created
4. Verify User B's balance decreased
5. User B confirms delivery
6. Verify NFT in User B's wallet
7. Verify User A received payment
8. Test with multiple products

---

## 📆 DAY 5: Polish, Reputation & Launch

### Goal

✅ Production-ready demo with reputation system

### Morning Session (3 hours)

#### 27. Reputation System

**Tasks:**

- [ ] Create `reputation.move` module (simplified)
- [ ] Track per user:
  - Total sales
  - Total purchases
  - Average rating
- [ ] Update reputation on trade completion
- [ ] Display reputation on:
  - Product cards (seller rating)
  - Profile pages
  - Product detail pages

**Simplified Version:**

- Just track successful trades
- Calculate reputation as: (successful_trades / total_trades) × 5
- Skip complex rating system for MVP
- Can expand post-hackathon

#### 28. Reputation UI

**Tasks:**

- [ ] Add star rating display component
- [ ] Show on product cards: "⭐ 4.8 (23 sales)"
- [ ] Show on profile pages
- [ ] Add trust badges for high-reputation users

### Afternoon Session (3 hours)

#### 29. UI Polish Pass

**Tasks:**

- [ ] Add loading spinners everywhere
- [ ] Add error toasts (use library like sonner or react-hot-toast)
- [ ] Add success confirmations
- [ ] Improve mobile responsiveness
- [ ] Add empty states:
  - No products listed yet
  - No items in your profile
- [ ] Add image optimization
- [ ] Test all flows on mobile

**Polish Checklist:**

- [ ] All buttons have hover states
- [ ] Forms have proper validation
- [ ] Images load with placeholders
- [ ] Errors are user-friendly
- [ ] Success messages are clear
- [ ] Loading states prevent double-clicks
- [ ] Navigation is intuitive

#### 30. Add Nice-to-Have Features (if time)

**Quick Wins:**

- [ ] Search/filter products
- [ ] Sort by price
- [ ] Product categories page
- [ ] Share product links
- [ ] Copy address button
- [ ] Transaction history

### Evening Session (4 hours)

#### 31. Testing & Bug Fixes

**Tasks:**

- [ ] Test every user flow:
  - Login/logout
  - Create listing
  - Browse products
  - Purchase product
  - Confirm delivery
  - View profile
- [ ] Test on different browsers
- [ ] Test on mobile
- [ ] Fix all bugs found
- [ ] Performance optimization

**Bug Hunting:**

- Try to break your app
- Test with multiple accounts
- Test edge cases (0 products, expired sessions, etc.)
- Check console for errors
- Fix transaction failures

#### 32. Demo Preparation

**Tasks:**

- [ ] Record 2-3 minute demo video showing:
  1. Login with Google (5 seconds)
  2. Create listing with image (20 seconds)
  3. Show product in feed (10 seconds)
  4. Purchase flow (30 seconds)
  5. Confirm delivery (20 seconds)
  6. Show NFT transferred (15 seconds)
  7. Highlight: "All free - no gas fees!" (10 seconds)
- [ ] Take screenshots of key features
- [ ] Write project README with:
  - Problem statement
  - Solution overview
  - Tech stack
  - Key features
  - Live demo link
  - Setup instructions
  - Architecture diagram

#### 33. Deployment

**Tasks:**

- [ ] Deploy frontend to Vercel:
  - Connect GitHub repo
  - Add environment variables
  - Deploy to production
  - Test live site
- [ ] Consider mainnet deployment (if confident)
- [ ] Update all URLs in documentation
- [ ] Share demo link

### ✅ Day 5 Success Criteria

- [ ] Reputation system working
- [ ] All UI polished and responsive
- [ ] No critical bugs
- [ ] Demo video recorded
- [ ] Project deployed to Vercel
- [ ] README complete
- [ ] Ready to present!

**Final Test:**

1. Fresh user (friend/family)
2. Can they figure it out?
3. Create, buy, sell without help
4. Feels smooth and professional

---

## 🎯 Success Metrics

### Technical Excellence (40%)

- [ ] zkLogin implemented correctly
- [ ] Sponsored transactions working (completely gasless)
- [ ] Walrus integration solid
- [ ] Move contracts well-designed and secure
- [ ] NFTs with proper ownership and transfer

### Innovation (25%)

- [ ] Novel use of NFTs for marketplace items
- [ ] Seamless Web2-like UX on Web3
- [ ] On-chain provenance tracking
- [ ] Solves real problem in new way

### Practical Value (20%)

- [ ] Addresses real student pain point
- [ ] Clear advantage over alternatives
- [ ] Actually usable (not just demo)
- [ ] Potential for real adoption

### Presentation (15%)

- [ ] Clear problem/solution articulation
- [ ] Working demo (judges can test)
- [ ] Professional UI/UX
- [ ] Good documentation

---

## 🚨 Risk Mitigation

### If You're Behind Schedule

**Cut These First:**

- Reputation system (just show trade count)
- Product categories/filters
- Profile page complexity
- Advanced UI animations

**Keep These Core Features:**

- zkLogin authentication
- Create listing (mint NFT)
- Buy product (escrow)
- Confirm delivery
- Sponsored transactions

**Absolute Minimum MVP:**

- Login
- List product
- View products
- Buy product
- All gasless

### If You're Ahead of Schedule

**Add These:**

- Advanced search/filtering
- User profiles with stats
- Product collections
- Wishlist feature
- Share functionality
- Email notifications
- Mobile app (React Native)

---

## 💡 Pro Tips

### Development

1. **Commit often** - Every feature, push to GitHub
2. **Test immediately** - Don't accumulate untested code
3. **Use AI assistant liberally** - Especially for Move contracts
4. **Keep it simple** - Working > fancy
5. **Mobile-first** - Design for phones

### Move Contracts

1. **Start small** - Basic contract, then iterate
2. **Test thoroughly** - Move bugs are expensive
3. **Use constants** - For categories, status, etc.
4. **Access control** - Always verify sender
5. **Error handling** - Clear error messages

### UI/UX

1. **Loading states** - Never leave users wondering
2. **Error messages** - Make them helpful
3. **Success feedback** - Celebrate completions
4. **Mobile responsive** - Most students use phones
5. **Trust indicators** - Ratings, verified badges

### Demo

1. **Practice** - Run through 3-4 times
2. **Backup plan** - Screen recording if live demo fails
3. **Tell a story** - Problem → Solution → Impact
4. **Show, don't tell** - Live demo > slides
5. **Enthusiasm** - Your excitement is contagious

---

## 📚 Essential Resources

### Sui Documentation

- **Main docs:** https://docs.sui.io/
- **Move examples:** https://examples.sui.io/
- **dApp Kit:** https://sdk.mystenlabs.com/dapp-kit
- **Enoki:** https://enoki.mystenlabs.com/

### Walrus

- **Docs:** https://docs.walrus.site/
- **Testnet:** https://testnet.walrus.site/
- **API reference:** https://docs.walrus.site/usage/web-api.html

### Community

- **Sui Discord:** https://discord.gg/sui
- **Sui Forum:** https://forums.sui.io/
- **GitHub:** https://github.com/MystenLabs/sui

### AI Assistant Prompts

Use these with your AI:

- "Explain [Sui concept] in simple terms"
- "Review this Move code for security issues"
- "How do I [specific task] in Sui/Move?"
- "Optimize this code for gas efficiency"
- "Debug this error: [error message]"
- "Create a [component] with [features] in React"

---

## 🎓 Learning Objectives

By completing this project, you'll learn:

### Blockchain Development

- ✅ Smart contract design (Move)
- ✅ On-chain/off-chain architecture
- ✅ Transaction building and execution
- ✅ Object ownership models
- ✅ Escrow patterns

### Sui-Specific

- ✅ zkLogin authentication
- ✅ Sponsored transactions
- ✅ Object-centric model
- ✅ Move language fundamentals
- ✅ Sui SDK usage

### Full-Stack Web3

- ✅ React + TypeScript
- ✅ Wallet integration
- ✅ Decentralized storage (Walrus)
- ✅ Database caching strategies
- ✅ Web3 UX patterns

---

## 🏆 Winning Strategy

### What Judges Look For

1. **Working demo** - Can they test it themselves?
2. **Clear value prop** - Why does this matter?
3. **Technical execution** - Does it actually work?
4. **Innovation** - What's new/different?
5. **Presentation** - Can you explain it well?

### Your Competitive Advantages

1. **Real problem** - Every student relates to buying/selling
2. **Network effects** - Viral potential within universities
3. **Full Sui stack** - zkLogin + Sponsored + Walrus + Move
4. **NFT innovation** - Provenance for physical items is novel
5. **Execution quality** - Working beats theoretical

### Presentation Script (3 minutes)

**Minute 1 - Problem:**
"Students waste $500+ per semester on new items. We all use Facebook groups to buy/sell used stuff, but it's unsafe - no verification, no protection, constant scams. I've personally been scammed twice."

**Minute 2 - Solution:**
"CampusTrade solves this. Every product is an NFT with full ownership history. Login with Google - no wallet needed. Buy, sell, trade - completely free because we sponsor all gas fees. Images stored on Walrus, decentralized forever."

[Live Demo - 1 minute showing full flow]

**Minute 3 - Impact:**
"This is the first blockchain marketplace that feels like Web2 but with Web3 benefits. Students get safety, sellers get reputation, and items have provenance. Built entirely on Sui's unique tech stack. Ready for 10,000+ students across 5 universities."

---

## ✅ Final Checklist

### Pre-Submission

- [ ] All core features working
- [ ] No critical bugs
- [ ] Deployed to Vercel
- [ ] Demo video recorded
- [ ] README complete
- [ ] GitHub repo clean
- [ ] Screenshots taken

### Submission Materials

- [ ] Project description (250 words)
- [ ] Demo video (2-3 min)
- [ ] Live demo URL
- [ ] GitHub repository
- [ ] Architecture diagram
- [ ] Smart contract addresses
- [ ] Team information

### Demo Day Prep

- [ ] Practice presentation 3x
- [ ] Test live demo
- [ ] Backup screen recording
- [ ] Answers to common questions ready
- [ ] Business model prepared (if asked)

---
