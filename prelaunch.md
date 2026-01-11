# Customer Detail Page - v0 Integration Plan

## Overview
This document outlines how to integrate the v0-generated customer detail page components into the existing SpendEase Admin dashboard, mapping the mock data to real backend API data.

---

## Current State

### Existing Files to Update/Replace
- `src/app/(main)/dashboard/customers/[id]/page.tsx` - Main page (update)
- `src/app/(main)/dashboard/customers/[id]/_components/customer-header.tsx` - Header (update)
- `src/app/(main)/dashboard/customers/[id]/_components/customer-profile-tab.tsx` - Profile tab (update)
- `src/app/(main)/dashboard/customers/[id]/_components/transactions-tab.tsx` - Transactions tab (replace)

### New Components to Create
- `src/app/(main)/dashboard/customers/[id]/_components/customer-stats-cards.tsx`
- `src/app/(main)/dashboard/customers/[id]/_components/beneficiaries-table.tsx`
- `src/app/(main)/dashboard/customers/[id]/_components/analytics-tab.tsx`
- `src/app/(main)/dashboard/customers/[id]/_components/transaction-status-chart.tsx`
- `src/app/(main)/dashboard/customers/[id]/_components/currency-pairs-chart.tsx`
- `src/app/(main)/dashboard/customers/[id]/_components/transaction-detail-sheet.tsx`

---

## Backend API Data Available

### 1. Customer Data (`GET /api/admin/users/:id`)
**Currently Available Fields:**
```typescript
{
  id: string;
  email: string;
  phone: string;
  last_name: string;
  first_name: string;
  status: "verified" | "pending" | "active";
  createdAt: string;
  updatedAt: string;
  username?: string;
  profile_image?: string;
  tier: number; // Account level (0, 1, 2)
  meta: {
    kyc?: { bvn?: BvnDetails; nin?: NinDetails };
    address_collection?: { country?: string; country_code?: string; ... };
  };
  bank_accounts?: BankAccount[]; // Included via join
}
```

### 2. Transactions Data (`GET /api/admin/transactions/wallet-transactions?user_id=X`)
**Currently Available Fields:**
```typescript
{
  id: number;
  reference: string;
  user_id: number;
  currency: string;
  amount: string;
  type: string; // "deposit", "withdrawal", "transfer", etc.
  status: string; // "pending", "success", "failed", "processing"
  description: string;
  balance_before: string;
  balance_after: string;
  created_at: string;
  updatedAt: string;
}
```

### 3. Transaction Swaps (`GET /api/admin/transactions/swaps?user_id=X`)
**For corridor/exchange rate data:**
```typescript
{
  id: number;
  type: string;
  status: string;
  reference: string;
  currency: string;
  network: string;
  deposit_amount: number;
  withdrawal_amount: number;
  deposit_fee: number;
  withdrawal_fee: number;
  exchange_rate: number;
  meta: {
    beneficiary?: { account_number, bank_name, account_name };
    source_currency?: string;
    target_currency?: string;
    from_currency?: string;
    to_currency?: string;
  };
  created_at: string;
}
```

---

## Data Mapping: v0 → Backend

### Customer Header Component
| v0 Field | Backend Source | Notes |
|----------|----------------|-------|
| `firstName` | `customer.first_name` | Direct map |
| `lastName` | `customer.last_name` | Direct map |
| `email` | `customer.email` | Direct map |
| `status` | `customer.status` | Map: active/verified → "Verified", pending → "Pending" |
| `accountLevel` | `customer.tier` | Map: 0→"Level 0", 1→"Level 1", 2→"Level 2" or use `meta.kyc.bvn.level_of_account` |

### Basic Customer Info Component
| v0 Field | Backend Source | Notes |
|----------|----------------|-------|
| `firstName` | `customer.first_name` | Direct map |
| `lastName` | `customer.last_name` | Direct map |
| `username` | `customer.username` | Direct map |
| `phone` | `customer.phone` | Direct map |
| `email` | `customer.email` | Direct map |
| `status` | `customer.status` | Direct map |
| `dateJoined` | `customer.createdAt` | Format with date-fns |
| `lastUpdatedAt` | `customer.updatedAt` | Format with date-fns |
| `kycStatus` | Derived | Check if `meta.kyc.bvn` exists |

### Customer Stats Cards (NEW - needs backend aggregation)
| v0 Field | Backend Source | Notes |
|----------|----------------|-------|
| `averageTransactionValue` | **CALCULATE** | Sum of amounts / count from transactions |
| `totalTransactionVolume` | **CALCULATE** | Sum of all transaction amounts |
| `totalFeesGenerated` | **CALCULATE** | Sum of fees from transaction_swaps |
| `customerLifetimeValue` | **CALCULATE** | Total volume + fees (or custom formula) |
| `baseCountry` | `meta.address_collection.country` OR `meta.kyc.bvn.nationality` | Fallback chain |
| `countryCode` | `meta.address_collection.country_code` | May need mapping |
| `averageSuccessRate` | **CALCULATE** | successful / total transactions * 100 |
| `transactionFrequency` | **CALCULATE** | Total transactions / months since joined |
| `totalBeneficiaries` | `bank_accounts.length` | Count of saved bank accounts |

### Transactions Table Component
| v0 Field | Backend Source | Notes |
|----------|----------------|-------|
| `id` | `transaction.id` | Direct map |
| `reference` | `transaction.reference` | Direct map |
| `currency` | `transaction.currency` | Direct map |
| `amount` | `transaction.amount` | Parse to number |
| `type` | `transaction.type` | Map: "deposit"→"pay_in", "withdrawal"→"pay_out" |
| `status` | `transaction.status` | Map: "success"→"successful" |
| `description` | `transaction.description` | Direct map |
| `previousBalance` | `transaction.balance_before` | Parse to number |
| `currentBalance` | `transaction.balance_after` | Parse to number |
| `createdAt` | `transaction.created_at` | Direct map |
| `completedAt` | `transaction.updatedAt` | Use if status is successful |
| `fee` | **FROM SWAP** | Need to join with transaction_swaps |
| `exchangeRate` | **FROM SWAP** | Need to join with transaction_swaps |
| `fromCurrency` | **FROM SWAP** | `meta.from_currency` |
| `toCurrency` | **FROM SWAP** | `meta.to_currency` |
| `beneficiaryName` | **FROM SWAP** | `meta.beneficiary.account_name` |
| `beneficiaryAccount` | **FROM SWAP** | `meta.beneficiary.account_number` |
| `beneficiaryBank` | **FROM SWAP** | `meta.beneficiary.bank_name` |

### Beneficiaries Table (NEW - maps to bank_accounts)
| v0 Field | Backend Source | Notes |
|----------|----------------|-------|
| `id` | `bank_account.id` | Direct map |
| `name` | `bank_account.account_name` | Direct map |
| `accountNumber` | `bank_account.account_number` | Mask: show last 4 digits |
| `bankName` | `bank_account.bank_name` | Direct map |
| `currency` | **INFER** | NGN default, or derive from bank |
| `country` | **INFER** | Nigeria default for NGN banks |
| `createdAt` | `bank_account.created_at` | If available |
| `lastUsed` | **NOT AVAILABLE** | Would need transaction join |
| `transactionCount` | **NOT AVAILABLE** | Would need transaction aggregation |

### Currency Pairs Chart (Analytics)
| v0 Field | Backend Source | Notes |
|----------|----------------|-------|
| `pair` | **CALCULATE** | Group transaction_swaps by from_currency → to_currency |
| `fromCurrency` | `swap.meta.from_currency` | Direct map |
| `toCurrency` | `swap.meta.to_currency` | Direct map |
| `count` | **CALCULATE** | Count of swaps for each pair |
| `volume` | **CALCULATE** | Sum of deposit_amount for each pair |
| `percentage` | **CALCULATE** | (pair count / total count) * 100 |

### Transaction Status Chart (Analytics)
| v0 Field | Backend Source | Notes |
|----------|----------------|-------|
| `status` | Transaction status | Group by status |
| `count` | **CALCULATE** | Count per status |
| `percentage` | **CALCULATE** | (status count / total) * 100 |

---

## What to STRIP from v0 Code

### 1. Role-Based Access (REMOVE FOR NOW)
Remove all role-based visibility logic:
```typescript
// REMOVE these imports and usage:
import type { Role } from "@/lib/role-permissions"
import { hasAccess, getAccessLevel } from "@/lib/role-permissions"
import { RestrictedSection, RestrictedContent } from "@/components/restricted-content"

// REMOVE role prop from all components
// REMOVE all role-based conditional rendering
// REMOVE RoleSelector component entirely
```

### 2. Mock Data (REPLACE)
Replace all mock data with real API calls:
```typescript
// REMOVE:
import { mockCustomerData, transactionStatusData, mockTransactions } from "@/lib/customer-data"

// REPLACE WITH:
// Real data fetched from API in page.tsx and passed as props
```

### 3. Components to NOT include initially
- `RoleSelector` component - Not needed without role preview
- `RestrictedContent` / `RestrictedSection` wrappers - Remove for now

---

## New Server Actions Needed

### 1. Fetch Customer Transactions
```typescript
// src/app/actions/users.ts (add)
export async function fetchCustomerTransactions(userId: string, params?: {
  page?: number;
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<TransactionsApiResponse | ApiError>
```

### 2. Fetch Customer Transaction Swaps (for analytics)
```typescript
// src/app/actions/users.ts (add)
export async function fetchCustomerSwaps(userId: string): Promise<SwapsApiResponse | ApiError>
```

### 3. Fetch Customer Stats (aggregated)
```typescript
// src/app/actions/users.ts (add)
export async function fetchCustomerStats(userId: string): Promise<CustomerStatsResponse | ApiError>
// Returns: totalVolume, avgTransaction, successRate, etc.
```

---

## Type Definitions Needed

Add to `src/lib/types.ts`:

```typescript
// Customer Stats (calculated on frontend or backend)
export interface CustomerStats {
  averageTransactionValue: number;
  totalTransactionVolume: number;
  totalFeesGenerated: number;
  customerLifetimeValue: number;
  baseCountry: string;
  countryCode: string;
  averageSuccessRate: number;
  transactionFrequency: string; // e.g., "8.2 per month"
  totalBeneficiaries: number;
  totalTransactions: number;
}

// Transaction for display (merged wallet_transaction + swap data)
export interface CustomerTransactionDisplay {
  id: number;
  reference: string;
  currency: string;
  amount: number;
  type: "pay_in" | "pay_out" | "transfer" | "exchange";
  status: "successful" | "pending" | "processing" | "failed";
  description: string;
  previousBalance: number;
  currentBalance: number;
  createdAt: string;
  completedAt?: string;
  // From swap (if available)
  fee?: number;
  exchangeRate?: number;
  fromCurrency?: string;
  toCurrency?: string;
  beneficiaryName?: string;
  beneficiaryAccount?: string;
  beneficiaryBank?: string;
}

// Beneficiary (from bank_accounts)
export interface CustomerBeneficiary {
  id: number;
  name: string;
  accountNumber: string; // Masked
  bankName: string;
  currency: string;
  country: string;
  createdAt?: string;
  lastUsed?: string;
  transactionCount?: number;
}

// Currency pair stats
export interface CurrencyPairStats {
  pair: string;
  fromCurrency: string;
  toCurrency: string;
  count: number;
  volume: number;
  percentage: number;
}

// Transaction status breakdown
export interface TransactionStatusBreakdown {
  status: string;
  count: number;
  percentage: number;
  fill: string; // Chart color
}
```

---

## Implementation Steps

### Phase 1: Data Layer
1. Add new server actions for fetching user transactions with `user_id` filter
2. Add server action for fetching user's transaction swaps
3. Add helper functions to calculate stats on the frontend
4. Update type definitions

### Phase 2: Core Components
1. Update `customer-header.tsx` with new design (avatar, status badge, account level)
2. Update `customer-profile-tab.tsx` to match v0 layout
3. Create `customer-stats-cards.tsx` component
4. Create new `transactions-tab.tsx` with filters, sorting, summary cards

### Phase 3: New Features
1. Create `transaction-detail-sheet.tsx` for slide-out details
2. Create `beneficiaries-table.tsx` component
3. Create `analytics-tab.tsx` with charts

### Phase 4: Analytics Components
1. Create `transaction-status-chart.tsx` (pie chart)
2. Create `currency-pairs-chart.tsx` (bar chart with progress)

### Phase 5: Polish
1. Add loading states
2. Add error handling
3. Add empty states
4. Test responsive design

---

## Backend API Enhancements (Optional/Future)

If the backend could be enhanced, these endpoints would be helpful:

1. **Customer Analytics Endpoint**: `GET /api/admin/users/:id/analytics`
   - Returns pre-calculated stats (total volume, avg transaction, success rate, etc.)
   - Reduces frontend calculation burden

2. **Customer Beneficiaries**: `GET /api/admin/users/:id/beneficiaries`
   - Returns bank_accounts with transaction counts and last used dates

3. **Customer Transaction Summary**: `GET /api/admin/users/:id/transactions/summary`
   - Returns counts by status, currency pairs breakdown, total volume

---

## Files Structure After Implementation

```
src/app/(main)/dashboard/customers/[id]/
├── page.tsx                          # Main page - fetches all data
├── _components/
│   ├── customer-header.tsx           # Updated header
│   ├── customer-profile-tab.tsx      # Updated profile with stats
│   ├── customer-stats-cards.tsx      # NEW: Stats grid
│   ├── transactions-tab.tsx          # Replaced: Full transaction table
│   ├── transaction-detail-sheet.tsx  # NEW: Slide-out details
│   ├── beneficiaries-table.tsx       # NEW: Bank accounts table
│   ├── analytics-tab.tsx             # NEW: Container for charts
│   ├── transaction-status-chart.tsx  # NEW: Pie chart
│   └── currency-pairs-chart.tsx      # NEW: Corridor stats
```

---

## Key Differences from v0

| v0 Feature | Implementation |
|------------|----------------|
| Role-based visibility | SKIP - show all data to all users for now |
| Mock data | Replace with real API data |
| Client-side data | Server-fetch in page.tsx, pass as props |
| Beneficiary transaction counts | Skip or show "N/A" (needs backend join) |
| Device info in transaction detail | Skip (not available in current API) |
| IP address tracking | Skip (not available in current API) |

---

## Quick Reference: Status Mappings

### Transaction Status
| Backend | Frontend Display |
|---------|------------------|
| `success` | `successful` |
| `pending` | `pending` |
| `processing` | `processing` |
| `failed` | `failed` |

### Transaction Type
| Backend | Frontend Display |
|---------|------------------|
| `deposit` | `pay_in` |
| `withdrawal` | `pay_out` |
| `transfer` | `transfer` |
| `swap` / `exchange` | `exchange` |

### User Status
| Backend | Frontend Display |
|---------|------------------|
| `active` | `Verified` (green badge) |
| `verified` | `Verified` (green badge) |
| `pending` | `Pending` (yellow badge) |
| Other | `Inactive` (gray badge) |

---

## Notes for New Chat Context

When starting a new chat for implementation, provide:
1. This prelaunch.md file
2. The current `Customer` type from `src/lib/types.ts`
3. The `fetchCustomerById` action from `src/app/actions/users.ts`
4. The transaction types: `WalletTransaction`, `WalletTransactionDetail`
5. State that role-based access is being skipped for now
6. Reference the v0 component code snippets from this conversation
