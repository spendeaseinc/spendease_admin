# Metrics Page Restructure - Change Log

## Overview
Restructuring the `/dashboard/metrics` page to align with existing project patterns (similar to `/dashboard/default`). This involves converting from a fully client-side v0-generated template to a server-component-based architecture with proper data fetching.

---

## Changes Made

### Files Created
| File | Description |
|------|-------------|
| `src/app/actions/analytics.ts` | Server action for fetching analytics/metrics data |
| `src/lib/analytics-types.ts` | Type definitions for analytics data structures |

### Files Modified
| File | Changes |
|------|---------|
| `src/app/(main)/dashboard/metrics/page.tsx` | Converted to server component, fetches data via server action |
| `src/app/(main)/dashboard/metrics/_components/metrics-cards.tsx` | Updated to use shadcn Tabs, receives data as props |
| `src/app/(main)/dashboard/metrics/_components/metric-cards-grid.tsx` | Receives `cards` data as props instead of importing from analytics-data |
| `src/app/(main)/dashboard/metrics/_components/charts-grid.tsx` | Receives `charts` data as props instead of importing from analytics-data |
| `src/lib/analytics-data.ts` | Retained as dummy data source (will be replaced by API data later) |

### Files Deleted
| File | Reason |
|------|--------|
| None | All existing files preserved |

---

## Architecture Changes

### Before (v0-generated)
```
page.tsx (client) 
  └── MetricsCards (client)
        ├── MetricCardsGrid (client) ── imports data from analytics-data.ts
        └── ChartsGrid (client) ── imports data from analytics-data.ts
```

### After (aligned with project patterns)
```
page.tsx (server) ── fetches data via server action
  └── MetricsCards (client) ── receives data as props
        ├── MetricCardsGrid (client) ── receives cards as props
        └── ChartsGrid (client) ── receives charts as props
```

---

## Key Features Preserved
- ✅ Drag-and-drop card reordering (via @dnd-kit)
- ✅ Tab switching between Overview and Metrics
- ✅ Time frame filtering on charts
- ✅ Currency/pair filtering on charts
- ✅ Edit mode toggle for dashboard customization
- ✅ All existing chart types (bar, line, area, status-bar, pair-bar, pair-status)

---

## Current Metrics Being Tracked

### Revenue Metrics
- Gross Revenue
- Net Revenue
- Transaction Fees Generated
- FX Sales
- Combined Net Profit

### Customer Metrics
- Customer Lifetime Value (CLV)
- Highest Rated Customer
- Total Customers / Active Customers

### Currency Pair Metrics
- Top Profit Currency Pair
- Highest Conversion Rate (success rate by pair)
- Highest Failure Rate (needs attention indicator)
- Currency Pair Transaction Volume
- Currency Pair Success vs Pending vs Failure rates ⭐

### Wallet Metrics
- Most Active Wallets (by currency)
- Least Active Wallets (by currency)
- Regional Wallet Leader

### Transaction Metrics
- Highest Transaction Volume (by currency)
- Most Beneficiaries (by currency)
- Most Transaction Initiators/Senders

---

## Suggested Additional Metrics (PENDING APPROVAL)

Based on fintech industry best practices and the SpendEase business model, here are additional metrics that could provide valuable insights:

### 1. Revenue & Financial Metrics
| Metric | Description | Why Track It |
|--------|-------------|--------------|
| **Average Revenue Per User (ARPU)** | Total revenue / Total users | Measures monetization efficiency |
| **Revenue Growth Rate** | Month-over-month or quarter-over-quarter growth | Tracks business trajectory |
| **Cost Per Transaction** | Operational cost / Total transactions | Identifies cost optimization opportunities |
| **Profit Margin by Currency Pair** | Profit / Revenue per corridor | Helps identify most profitable routes |
| **FX Spread Revenue** | Revenue from exchange rate margins | Key revenue source for FX platforms |

### 2. User Engagement Metrics
| Metric | Description | Why Track It |
|--------|-------------|--------------|
| **Daily/Weekly/Monthly Active Users (DAU/WAU/MAU)** | Unique users in time period | Core engagement indicator |
| **User Retention Rate** | % users returning after X days | Measures product stickiness |
| **Churn Rate** | % users who stop transacting | Early warning for problems |
| **Time to First Transaction** | Days from signup to first tx | Measures onboarding effectiveness |
| **Transactions Per User (TPU)** | Avg transactions per active user | Measures user engagement depth |

### 3. Transaction Performance Metrics
| Metric | Description | Why Track It |
|--------|-------------|--------------|
| **Average Transaction Value (ATV)** | Total value / Transaction count | Tracks transaction size trends |
| **Transaction Processing Time** | Avg time from initiation to completion | Measures operational efficiency |
| **Peak Transaction Hours** | Time-based transaction distribution | Helps with capacity planning |
| **Failed Transaction Recovery Rate** | % of failed txs that are retried successfully | Measures retry mechanism effectiveness |
| **Transaction Velocity** | Transactions per minute/hour | Real-time load monitoring |

### 4. Compliance & Risk Metrics
| Metric | Description | Why Track It |
|--------|-------------|--------------|
| **KYC Completion Rate** | % users with completed KYC | Regulatory compliance |
| **Flagged Transactions Rate** | % transactions flagged for review | Fraud/AML monitoring |
| **Average Transaction Limit Usage** | Avg % of limit used per tx | Risk capacity monitoring |
| **Dispute Rate** | % transactions with disputes | Customer satisfaction indicator |

### 5. Geographic & Market Metrics
| Metric | Description | Why Track It |
|--------|-------------|--------------|
| **Transaction Volume by Country** | Geographic distribution | Market penetration insights |
| **User Growth by Region** | New signups by location | Expansion opportunity identification |
| **Cross-Border vs Domestic Ratio** | % international transactions | Business model insights |
| **Corridor Growth Rate** | Growth rate per currency pair | Identifies emerging opportunities |

### 6. Operational Metrics
| Metric | Description | Why Track It |
|--------|-------------|--------------|
| **API Success Rate** | % successful API calls | Technical reliability |
| **System Uptime** | Platform availability | SLA tracking |
| **Partner/Provider Performance** | Success rates by payment provider | Vendor management |
| **Settlement Time** | Time to settle with partners | Liquidity management |

---

## Notes for API Integration

When the backend API is integrated, we need to:
1. Map API response fields to our type definitions
2. Handle cases where API doesn't provide certain metrics (use "Demo Data" badge)
3. Implement proper error handling and loading states
4. Consider caching strategy for frequently accessed metrics
5. The currency pair success/failure/pending rates should be derivable from transaction data filtered by currency pair and status

---

## Status: COMPLETE ✅

- [x] Documentation created
- [x] Types added to `src/lib/analytics-types.ts`
- [x] Server action created at `src/app/actions/analytics.ts`
- [x] Page converted to server component
- [x] Components updated to accept props
- [ ] Testing - requires manual verification

### Pre-existing Lint Warnings (from v0 template)
The following files have pre-existing style warnings from the v0 template that were not introduced by this restructure:
- `metric-card.tsx` - semicolons, class name ordering (34 warnings)
- `chart-card.tsx` - array index keys warning (1 warning)

These are cosmetic warnings only and don't affect functionality. They can be addressed in a separate cleanup pass if desired.

---

## 🔍 BACKEND API ANALYSIS

**Backend Project Location:** `/Users/Ebuka/Projects/spendease_backend`

### ⚠️ CRITICAL FINDING: Profit Analytics Endpoint Does NOT Exist Yet

The `/api/admin/profit-analytics` endpoint **is not currently exposed** in the API routes. 

A `ProfitAnalyticsService` class exists in `src/services/profit-analytics-service.ts` but it's **not connected to any route/controller**.

---

### What the `ProfitAnalyticsService` ALREADY Provides (when integrated)

| Metric | Field | Description | Status |
|--------|-------|-------------|--------|
| Gross Revenue | `grossRevenue` | Total fees collected | ✅ Ready |
| Net Revenue | `netRevenue` | Gross revenue minus costs | ✅ Ready |
| Transaction Fees | `totalTransactionFees` | Sum of all transaction fees | ✅ Ready |
| FX Sales | `fxSales` | Revenue from FX markup (rate markup profit) | ✅ Ready |
| Combined Net Profit | `combinedNetProfit` | Net revenue + FX sales | ✅ Ready |
| Transaction Count | `transactionCount` | Number of successful transactions | ✅ Ready |
| Total Volume | `totalVolume` | Total transaction volume | ✅ Ready |
| By Currency Breakdown | `byCurrency[]` | Above metrics per currency | ✅ Ready |
| Monthly Breakdown | `getProfitMetricsByMonth()` | Above metrics per month | ✅ Ready |

**Supported Currencies in Backend:** USD, EUR, NGN, GBP, CAD, KES, GHS, ZAR

---

### What the Current Dashboard API Provides (`/api/admin/dashboard/stats`)

| Data | Description | Usable For |
|------|-------------|------------|
| `overview.totalUsers` | Total registered users | Customer metrics |
| `overview.activeUsers` | Users with active/verified status | Customer metrics |
| `overview.transactingUsers` | Users with at least one transaction | Customer metrics |
| `overview.totalTransactions` | Total transaction count | Transaction metrics |
| `overview.successfulTransactions` | Successful transaction count | Transaction metrics |
| `overview.successRate` | Success rate percentage | Transaction metrics |
| `transactionOverview.data[]` | Monthly transaction counts | Charts |
| `customersComparison.data[]` | Daily total vs transacting customers | Charts |
| `newCustomers.data[]` | Monthly new customer counts | Charts |

---

### Database Models Available for Analytics Queries

#### 1. **WalletTransaction** (`wallet_transactions` table)
- `currency` - NGN, KES, GHS, ZAR, USD, etc.
- `type` - CurrencySwap, PayIn, PayOut, Deposit, Withdrawal, etc.
- `status` - pending, processing, success, failed
- `amount`, `fee`, `previous_balance`, `current_balance`
- `meta` - JSON with conversion details (fromCurrency, toCurrency, rates, etc.)
- `user_id`, `created_at`

#### 2. **Wallet** (`wallets` table)
- `currency`, `status` (enabled, disabled, inactive)
- `available_balance`, `ledger_balance`, `pending_balance`
- `user_id`

#### 3. **User** (`users` table)
- `country_id`, `status`, `tier`, `created_at`
- `meta` - JSON with KYC info, address verification, etc.

#### 4. **BankAccount** (`bank_accounts` table)
- `user_id`, `bank_name`, `account_number`, `account_name`

---

### GAP ANALYSIS: Frontend Metrics vs Backend Availability

#### ✅ AVAILABLE (can be derived from existing data/services)

| Frontend Metric | Backend Source | Notes |
|-----------------|----------------|-------|
| Gross Revenue | `ProfitAnalyticsService.grossRevenue` | Needs route setup |
| Net Revenue | `ProfitAnalyticsService.netRevenue` | Needs route setup |
| Transaction Fees | `ProfitAnalyticsService.totalTransactionFees` | Needs route setup |
| FX Sales | `ProfitAnalyticsService.fxSales` | Needs route setup |
| Combined Net Profit | `ProfitAnalyticsService.combinedNetProfit` | Needs route setup |
| Transaction Status (Success/Fail/Pending) | Query `wallet_transactions` by status | Can filter by currency |
| Active Wallets by Currency | Query `wallets` with status='enabled' | Group by currency |
| Transaction Volume by Currency | Query `wallet_transactions` | Group by currency |

#### ⚠️ NEEDS BACKEND WORK (queries need to be written)

| Frontend Metric | Required Query | Complexity |
|-----------------|----------------|------------|
| **Currency Pair Profit** | Filter `wallet_transactions` by `meta.fromCurrency`/`meta.toCurrency` for CurrencySwap type | Medium |
| **Currency Pair Success/Failure Rates** | Same as above, group by status | Medium |
| **Regional Wallet Distribution** | Join `wallets` with `users` → `countries` | Medium |
| **Most Beneficiaries by Currency** | Query `bank_accounts` joined with transactions | Medium |
| **Most Senders/Initiators** | Count distinct `user_id` in `wallet_transactions` per currency | Low |
| **Customer Lifetime Value** | Calculate: SUM(fees) per user × avg lifespan | High |
| **Highest Rated Customer** | Query user with MAX transaction value | Low |

#### ❌ NOT AVAILABLE (no data source)

| Frontend Metric | Issue |
|-----------------|-------|
| Live USD Exchange Rate | No rate API integration (use static for now) |
| Transaction Processing Time | `created_at` exists but no completion timestamp |
| KYC Completion Rate | KYC data in `user.meta` but needs parsing |
| Dispute Rate | No disputes table |

---

### 🛠️ RECOMMENDED BACKEND CHANGES

#### Priority 1: Create Profit Analytics Endpoint
**File to create/modify:** `src/api/admin-routes/dashboard.ts`

Add route that uses `ProfitAnalyticsService`:
```typescript
// Add to dashboard.ts routes
dashboardRouter.get(
  '/profit-analytics',
  permissionsMiddleware(PermissionName.Misc, PermissionType.Read),
  dashboardRequestHandler.getProfitAnalytics
);
```

**File to create/modify:** `src/api/request-handlers/admin/dashboard.ts`

Add handler:
```typescript
export const getProfitAnalytics: RequestHandler = async (req, res, next) => {
  try {
    const { dateFrom, dateTo } = req.query;
    const analytics = await ProfitAnalyticsService.calculateProfitMetrics(
      dateFrom as string,
      dateTo as string
    );
    return res.json(utilities.itemResponse(analytics, 'Profit analytics retrieved successfully.'));
  } catch (error) {
    next(error);
  }
};
```

#### Priority 2: Add Currency Pair Analytics
New service method needed in `ProfitAnalyticsService`:
- `getCurrencyPairMetrics()` - Returns profit, volume, success/failure rates per currency pair
- Filter `wallet_transactions` where `type = 'currency-swap'`
- Extract `meta.fromCurrency` and `meta.toCurrency`

#### Priority 3: Add Wallet Analytics
New service/controller needed:
- Active wallets by currency
- Wallet distribution by user region

---

### 📊 MAPPING: API Response → Frontend Dummy Data

| Dummy Data Field | API Field (when ready) | Demo Data Used |
|------------------|------------------------|----------------|
| `metricCardsData[0].value` (Gross Revenue) | `summary.totalGrossRevenue` | "NGN 45.2M" |
| `metricCardsData[1].value` (Net Revenue) | `summary.totalNetRevenue` | "NGN 38,495,320" |
| `metricCardsData[2].value` (Transaction Fees) | `summary.totalTransactionFees` | "NGN 2.14M" |
| `metricCardsData[3].value` (FX Sales) | `summary.totalFxSales` | "NGN 12.4M" |
| `metricCardsData[4].value` (Net Profit) | `summary.totalCombinedNetProfit` | "-82.1%" |
| `chartsData[0].data` (Currency Profit) | `byCurrency[].grossRevenue` per month | Generated |
| `chartsData[1].data` (Transaction Status) | Query tx status per month | Generated |

---

## Next Steps

### For Backend Engineer:
1. **[CRITICAL]** Expose `ProfitAnalyticsService` via `/api/admin/profit-analytics` route
2. **[HIGH]** Add currency pair breakdown to `ProfitAnalyticsService`
3. **[MEDIUM]** Add active wallets query endpoint
4. **[LOW]** Add customer analytics (CLV, top customers)

### For Frontend:
1. Wait for profit-analytics endpoint to be exposed
2. Update `src/app/actions/analytics.ts` to call real API
3. Add "Demo Data" badge to metrics that aren't yet available from API
4. Map API response structure to our type definitions

---

## 🚀 API INTEGRATION UPDATE (January 2, 2026)

### Frontend API Integration - COMPLETE ✅

The frontend has been updated to fetch data from the backend API endpoints. The following changes were made:

### Files Created

| File | Description |
|------|-------------|
| `src/app/(main)/dashboard/metrics/_components/demo-data-badge.tsx` | Demo Data badge component with tooltip showing reason (error/not_configured/no_data) |

### Files Modified

| File | Changes |
|------|---------|
| `src/lib/analytics-types.ts` | Added API response types for all 5 endpoints, added `isDemoData`, `demoDataReason`, `demoDataMessage` fields to MetricCardData and ChartData |
| `src/app/actions/analytics.ts` | Replaced dummy data with real API calls to 4 endpoints in parallel, added fallback to dummy data on API errors |
| `src/app/(main)/dashboard/metrics/_components/metric-card.tsx` | Added DemoDataBadge display when `card.isDemoData` is true |
| `src/app/(main)/dashboard/metrics/_components/chart-card.tsx` | Added DemoDataBadge display when `chart.isDemoData` is true |

### API Endpoints Being Called

| Endpoint | Purpose | Fallback |
|----------|---------|----------|
| `GET /api/admin/dashboard/profit-analytics` | Revenue metrics (gross, net, fees, FX sales, profit) | Dummy data with "Demo" badge |
| `GET /api/admin/dashboard/currency-pair-analytics` | Currency pair metrics (success/failure rates, volume) | Dummy data with "Demo" badge |
| `GET /api/admin/dashboard/wallet-analytics` | Wallet stats (active/inactive by currency, regional) | Dummy data with "Demo" badge |
| `GET /api/admin/dashboard/customer-analytics` | Customer metrics (CLV, top customers, senders) | Dummy data with "Demo" badge |

### New Metric Cards Added From API

When API data is available, the following NEW cards are displayed:

| Card ID | Title | Source |
|---------|-------|--------|
| `total-transaction-count` | Total Transactions | profit-analytics |
| `total-volume` | Total Volume | profit-analytics |
| `total-wallets` | Total Wallets | wallet-analytics |
| `avg-transactions-per-customer` | Avg Transactions/Customer | customer-analytics |
| `avg-revenue-per-customer` | Avg Revenue/Customer (ARPU) | customer-analytics |

### Demo Data Badge

A "Demo" badge is now displayed on cards/charts when:
1. **API Error**: The endpoint returned an error (hover to see error message)
2. **Not Configured**: The endpoint is not yet available
3. **No Data**: The API returned empty data

The badge includes a tooltip that shows:
- The specific reason for showing demo data
- The actual error message (if applicable)

### Error Tracking

API errors are logged to the console and can be accessed via the `apiErrors` field in the response:

```typescript
interface AnalyticsResponse {
  status: boolean;
  message: string;
  data: AnalyticsData;
  apiErrors?: Array<{ endpoint: string; error: string }>;
}
```

### Live API Error Log

When the frontend encounters API errors, they are logged here:

| Timestamp | Endpoint | Error Message | Status |
|-----------|----------|---------------|--------|
| *(errors will be logged during runtime)* | | | |

**To test:** Visit `/dashboard/metrics` and check browser console for `Analytics API Errors:` logs.

---

## Testing Checklist

- [ ] Navigate to `/dashboard/metrics` page
- [ ] Verify cards display with "Demo" badge if API returns errors
- [ ] Hover over "Demo" badge to see error tooltip
- [ ] Check browser console for API error logs
- [ ] Verify charts display with "Demo" badge next to title if API returns errors
- [ ] Test with backend running to see live data
- [ ] Verify all card content fits within card boundaries

---

## 🔄 Currency Filtering Update (January 2, 2026)

### Overview

Added currency filtering tabs to the Overview section, allowing users to filter metric cards by currency (NGN, KES, GHS, ZAR) with an "All" tab that shows USD-converted values.

### Files Modified

| File | Changes |
|------|---------|
| `src/lib/analytics-types.ts` | Added `SUPPORTED_CURRENCIES` array, `USD_EXCHANGE_RATES` constant, updated `CURRENCY_INFO` with flags and country names |
| `src/app/(main)/dashboard/metrics/_components/metrics-cards.tsx` | Added currency filter tabs with exchange rate display badge |
| `src/app/(main)/dashboard/metrics/_components/metric-cards-grid.tsx` | Added `useEffect` to sync cards when filter changes |
| `src/app/actions/analytics.ts` | Rewrote transformation functions to generate per-currency cards |

### Files Created

| File | Description |
|------|-------------|
| `src/app/(main)/dashboard/metrics/_components/demo-data-badge.tsx` | Badge component showing demo data status with tooltip |

### New Features

#### 1. Currency Filter Tabs
- **All (USD)**: Shows all metrics converted to USD using fixed exchange rates
- **🇳🇬 NGN**: Shows Nigerian Naira metrics only
- **🇰🇪 KES**: Shows Kenyan Shilling metrics only
- **🇬🇭 GHS**: Shows Ghanaian Cedi metrics only
- **🇿🇦 ZAR**: Shows South African Rand metrics only

#### 2. Exchange Rate Display
- Badge showing current exchange rate info
- Tooltip with all fixed USD exchange rates
- Rates: NGN=1550, KES=153, GHS=15.2, ZAR=18.5

#### 3. Per-Currency Cards

Each currency tab now shows dedicated cards for:
- **Profit Analytics**: Gross Revenue, Net Revenue, Transaction Fees, FX Sales, Combined Net Profit, Transaction Count, Volume
- **Currency Pair Analytics**: Top Profit Pair, Best Success Rate, Highest Failure Rate, Outbound Volume, Outbound Transactions
- **Wallet Analytics**: Total Wallets, Active Wallets, Inactive Wallets, Total Balance, Average Balance, Top Region
- **Customer Analytics**: Transaction Initiators, Total Transactions, Beneficiaries

#### 4. "All" Tab (USD Converted)
- Aggregates values from all supported currencies
- Converts each currency to USD before summing
- Shows unified view for cross-currency comparison

### Currency Filtering Logic

- Unsupported currencies (like CAD, USD, EUR, GBP) are filtered out from display
- Only shows: NGN, KES, GHS, ZAR
- Backend data with other currencies is excluded from totals

### Fixed Exchange Rates (Static)

```typescript
export const USD_EXCHANGE_RATES = {
  NGN: 1550,  // 1 USD = 1550 NGN
  KES: 153,   // 1 USD = 153 KES
  GHS: 15.2,  // 1 USD = 15.2 GHS
  ZAR: 18.5,  // 1 USD = 18.5 ZAR
};
```

### Updated Testing Checklist

- [ ] Navigate to `/dashboard/metrics` page
- [ ] Verify currency filter tabs display (All, NGN, KES, GHS, ZAR)
- [ ] Click each currency tab and verify cards filter correctly
- [ ] Verify "All (USD)" tab shows USD-converted values
- [ ] Check exchange rate badge displays correct info
- [ ] Hover over exchange rate badge to see all rates
- [ ] Verify no CAD or other unsupported currencies appear
- [ ] Test with backend running to see live data per currency

---

## 📊 11pm Update - Info Tooltips & Real Chart Data (January 2, 2026)

### Overview

This update adds Info tooltips to all metric cards explaining how each metric is calculated, and updates the charts section to fetch real data from API endpoints where available.

### Files Modified

| File | Changes |
|------|---------|
| `src/lib/analytics-types.ts` | Added `calculationDescription?: string` to `MetricCardData` interface |
| `src/app/(main)/dashboard/metrics/_components/metric-card.tsx` | Added Info tooltip icon with calculation description, combined top-right badges (info + demo) |
| `src/app/actions/analytics.ts` | Added `CALC_DESCRIPTIONS` constants, added `calculationDescription` to all cards, rewrote `transformToCharts` to use real API data |

### New Features

#### 1. Info Tooltip on Metric Cards

Every metric card now has an ℹ️ Info icon in the top-right corner (next to the Demo badge if present). Hovering shows a tooltip explaining:

- **How the metric is calculated**
- **Data source** (which API endpoint)
- **Formula used** (for calculated fields)

Example calculation descriptions:
- **Gross Revenue (All)**: "Sum of all transaction fees collected across NGN, KES, GHS, ZAR, converted to USD using fixed exchange rates (NGN=1550, KES=153, GHS=15.2, ZAR=18.5)"
- **FX Sales (NGN)**: "Profit from rate markup when users convert to NGN. Calculated as: original Fincra rate amount - marked up rate amount"
- **Customer Lifetime Value**: "Average Customer Lifetime Value: (Total fees paid ÷ Total customers) × Average customer lifespan in months"

#### 2. Calculation Descriptions Constant

Added centralized `CALC_DESCRIPTIONS` object with descriptions for:

| Category | Metrics |
|----------|---------|
| Revenue | grossRevenue, netRevenue, transactionFees, fxSales, netProfit, volume |
| Transactions | transactionCount, outboundVolume, outboundTxCount |
| Currency Pairs | topProfitPair, successRate, failureRate |
| Wallets | totalWallets, activeWallets, inactiveWallets, totalBalance, avgBalance, topRegion |
| Customers | clv, topCustomer, senders, beneficiaries, avgTxPerCustomer, arpu |

Each metric has both an "all" description (for USD-converted view) and a currency-specific description.

#### 3. Real Chart Data from API

Charts now fetch real data from API endpoints where available:

| Chart | Data Source | Demo Data? |
|-------|-------------|------------|
| Revenue by Currency | `/profit-analytics` byCurrency | No (live data) |
| Transaction Status Distribution | `/currency-pair-analytics` pairs | No (live data) |
| Currency Pair Success Rates | `/currency-pair-analytics` pairs | No (live data) |
| Currency Pair Transaction Volume | `/currency-pair-analytics` pairs | No (live data) |
| Wallet Distribution | `/wallet-analytics` byCurrency | No (live data) |
| Balance Distribution | `/wallet-analytics` byCurrency | No (live data) |
| Transaction Volume by Currency | `/profit-analytics` byCurrency | No (live data) |
| Transaction Volume Trend | N/A | Yes - Historical data not available |
| Revenue Trend | N/A | Yes - Historical data not available |

#### 4. Demo Data Badge on Charts

Charts that use dummy data now show a "Demo" badge with tooltip explaining:
- **Error**: API endpoint returned an error
- **Not Configured**: API endpoint doesn't provide this data yet
- **Message**: Specific reason (e.g., "Historical time-series data not available from API")

### Charts Generated from Real Data

When API data is available, these charts are generated:

```
1. currency-revenue-snapshot
   - Bar chart showing Gross Revenue, Transaction Fees, FX Sales, Net Profit per currency
   
2. transaction-status-snapshot
   - Status bar showing Success/Failure/Pending percentages across all pairs
   
3. pair-status-snapshot
   - Per-pair success/failure/pending rates
   
4. pair-volume-snapshot
   - Transaction count per currency pair corridor
   
5. wallet-distribution-snapshot
   - Active vs Inactive wallets per currency
   
6. balance-distribution-snapshot
   - Total and average balance per currency
   
7. volume-by-currency-snapshot
   - Transaction volume and count per currency
```

### Demo Data for Time-Series Charts

Historical/trend charts use demo data because the backend API provides snapshot data only:
- **Transaction Volume Trend** - Shows sample 24-month trend
- **Revenue Trend** - Shows sample revenue over time

These are marked with "Demo" badge and tooltip explaining "Historical time-series data not available from API - showing sample trend data".

### Updated Testing Checklist

- [ ] Navigate to `/dashboard/metrics` page
- [ ] Hover over Info icon (ℹ️) on any card to see calculation description
- [ ] Verify calculation descriptions are specific to the metric
- [ ] For "All" tab, verify description mentions USD conversion
- [ ] For currency tabs, verify description is currency-specific
- [ ] Switch to Charts tab
- [ ] Verify new charts display real data (Revenue by Currency, Wallet Distribution, etc.)
- [ ] Check that time-series charts show "Demo" badge
- [ ] Hover over Demo badge on charts to see reason
- [ ] Verify charts show meaningful data from API (not random)

---

## Late Night Update (Jan 2, 2026)

### Summary of Changes

This update addresses several key issues with the charts section:

1. **Disabled Time Frame Filtering for Snapshot Charts**
2. **All Currency Pairs Now Shown (Including Zero-Transaction Pairs)**
3. **Fixed Fallback Logic for Empty API Arrays**
4. **Historical Charts Use Demo Data with Proper Badges**
5. **Snapshot vs Time-Series Chart Distinction**

### Technical Implementation Details

#### 1. New `isSnapshot` Flag on ChartData Type

Added `isSnapshot?: boolean` field to the `ChartData` interface in `analytics-types.ts`:

```typescript
export interface ChartData {
  // ... existing fields ...
  // Snapshot vs time-series - snapshot charts don't support time frame filtering
  isSnapshot?: boolean;
}
```

**Purpose**: Distinguishes between:
- **Snapshot charts** (`isSnapshot: true`): Current period data from API - no time filtering
- **Time-series charts** (`isSnapshot: false`): Historical trend data with time frame filtering

#### 2. Time Frame Filtering Logic in chart-card.tsx

Updated `getFilteredData` to respect the `isSnapshot` flag:

```typescript
const getFilteredData = useMemo(() => {
  // Snapshot charts show current period data - no time filtering
  if (chart.isSnapshot) {
    return chart.data;
  }
  // Time-series charts support time frame filtering
  const count = TIME_FRAME_POINTS[timeFrame];
  return chart.data.slice(-count);
}, [chart.data, timeFrame, chart.isSnapshot])
```

**Dropdown Menu Change**: For snapshot charts, the time frame dropdown now shows:
- "Current Period Snapshot" as header
- Disabled message: "Time filtering not available for snapshot data"

#### 3. All 12 Currency Pairs Displayed

Created constant for all possible currency pair combinations:

```typescript
const ALL_CURRENCY_PAIRS = [
  "NGN→KES", "NGN→GHS", "NGN→ZAR",
  "KES→NGN", "KES→GHS", "KES→ZAR",
  "GHS→NGN", "GHS→KES", "GHS→ZAR",
  "ZAR→NGN", "ZAR→KES", "ZAR→GHS",
];
```

**Logic**: 
- Creates a map of existing pair data from API
- Generates data for ALL pairs, using zeros for missing pairs
- Charts always show all 12 corridors

```typescript
const allPairsData = ALL_CURRENCY_PAIRS.map((pair) => {
  const existingData = pairDataMap.get(pair);
  return existingData ?? {
    pair,
    sourceCurrency: pair.split("→")[0],
    targetCurrency: pair.split("→")[1],
    totalTransactions: 0,
    // ... other fields set to 0
  };
});
```

#### 4. Fixed Fallback Logic for Empty Arrays

Previous issue: Fallback only triggered if `data === null`, not for empty arrays.

New helper function:
```typescript
const hasValidData = <T>(arr: T[] | undefined | null): arr is T[] => {
  return Array.isArray(arr) && arr.length > 0;
};
```

Now properly handles:
- `null` data → Shows demo data with "not_configured" reason
- Empty array `[]` → Shows demo data with "no_data" reason
- API error → Shows demo data with "error" reason

#### 5. Chart Categories

**Snapshot Charts (Real API Data)**:
| Chart ID | Title | Data Source |
|----------|-------|-------------|
| currency-revenue-snapshot | Revenue by Currency | profit-analytics |
| volume-by-currency-snapshot | Transaction Volume by Currency | profit-analytics |
| transaction-status-snapshot | Transaction Status Distribution | currency-pair-analytics |
| pair-status-snapshot | Currency Pair Success Rates | currency-pair-analytics |
| pair-volume-snapshot | Currency Pair Transaction Volume | currency-pair-analytics |
| wallet-distribution-snapshot | Wallet Distribution by Currency | wallet-analytics |
| balance-distribution-snapshot | Balance Distribution by Currency | wallet-analytics |

**Historical/Time-Series Charts (Demo Data)**:
| Chart ID | Title | Time Filtering |
|----------|-------|----------------|
| transaction-volume-trend-historical | Transaction Volume Trend (Historical) | ✅ Enabled |
| revenue-trend-historical | Revenue Trend (Historical) | ✅ Enabled |
| wallet-activity-trend-historical | Wallet Activity Trend (Historical) | ✅ Enabled |
| pair-success-trend-historical | Currency Pair Success Trend (Historical) | ✅ Enabled |
| pair-volume-trend-historical | Currency Pair Volume Trend (Historical) | ✅ Enabled |

### Files Modified

1. **`src/lib/analytics-types.ts`**
   - Added `isSnapshot?: boolean` to `ChartData` interface

2. **`src/app/(main)/dashboard/metrics/_components/chart-card.tsx`**
   - Added `TIME_FRAME_POINTS` constant
   - Updated `getFilteredData` to handle snapshot charts
   - Modified dropdown menu to show different UI for snapshot vs time-series charts

3. **`src/app/actions/analytics.ts`**
   - Added `ALL_CURRENCY_PAIRS` constant
   - Added `hasValidData` helper function
   - Refactored `transformToCharts` to:
     - Generate all 12 currency pairs (zeros for missing)
     - Mark snapshot charts with `isSnapshot: true`
     - Mark time-series charts with `isSnapshot: false`
     - Properly handle empty array fallbacks
     - Add 5 new historical trend charts with demo data

### Testing Checklist for This Update

- [ ] Navigate to `/dashboard/metrics` and select Charts tab
- [ ] **Snapshot Charts**:
  - [ ] Verify charts like "Revenue by Currency" show "Current Period Snapshot" in dropdown
  - [ ] Verify time frame selection is disabled for snapshot charts
  - [ ] Verify "Currency Pair Transaction Volume" shows all 12 pairs
  - [ ] Pairs with no transactions should show 0
- [ ] **Historical Charts**:
  - [ ] Verify charts with "(Historical)" in title have time frame dropdown enabled
  - [ ] Select different time frames (Weekly, 3 Months, 12 Months) and verify data changes
  - [ ] All historical charts should show "Demo" badge
  - [ ] Hover over Demo badge to see: "Historical time-series data not available from API"
- [ ] **Fallback Behavior**:
  - [ ] If wallet-analytics returns empty array, verify demo chart appears with "no_data" badge
  - [ ] If any API fails, verify demo chart appears with "error" badge and error message

### Notes for Backend Team

To enable real historical data for time-series charts, the following API enhancements would be needed:

1. **profit-analytics**: Add optional `groupBy=month` parameter to return monthly breakdown
2. **currency-pair-analytics**: Add time-series data with monthly aggregations
3. **wallet-analytics**: Add historical snapshot data (monthly wallet counts)

Response format suggestion for historical data:
```json
{
  "historicalData": [
    { "month": "2025-01", "ngn": 1234, "kes": 567, ... },
    { "month": "2025-02", "ngn": 1345, "kes": 678, ... },
    // ... up to 24 months
  ]
}
```

