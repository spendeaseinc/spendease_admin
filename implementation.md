# Frontend-Only Admin Dashboard Analytics Implementation Plan

## Goal
Implement the **Metrics Page** in the SpendEase Admin Dashboard (`spendease-admin`) by consuming **existing** backend endpoints.
**Constraint**: Do **NOT** modify the backend code. Filter unwanted data and handle missing metrics strictly on the Frontend.

## Context for New Session
- **Backend**: `spendease_backend` (Branch: `feature-ebuka`).
- **Endpoints Exist**: The following routes are live and return data:
    - `/api/admin/analytics/profit`
    - `/api/admin/analytics/currency-pairs`
    - `/api/admin/analytics/wallets`
    - `/api/admin/analytics/customers`
- **Data State**: The backend returns *more* data than we want (e.g., "Net Revenue" which is deprecated) and might miss some new requests ("Time to First Tx").
- **Strategy**: **Fetch everything, display only what is approved.**

## User Requirements (from Images)
1.  **Yellow Highlighted** (Dashboard Metrics): **IMPLEMENT**.
2.  **Red Highlighted** (Net Revenue): **FETCH BUT HIDE**. Do not display.
3.  **Green Highlighted** (User Profile Data): **IGNORE** for this page. These belong on the User Profile view, not the Main Dashboard.

---

## implementation Strategy

### 1. Data Fetching Layer (`src/app/actions/analytics.ts`)

**Action**: Modify/Create `fetchAnalyticsData` to call the verified endpoints.

- **Endpoints to Call**:
    1.  **Profit**: `/api/admin/analytics/profit`
    2.  **Pairs**: `/api/admin/analytics/currency-pairs`
    3.  **Wallets**: `/api/admin/analytics/wallets`
    4.  **Customers**: `/api/admin/analytics/customers`
- **Client-Side Filtering (Crucial)**:
    - The API *will* return `netRevenue` and `combinedNetProfit`.
    - **Instruction**: In the transformation logic, explicitly **discard** these fields. Do not map them to any UI card.
    - **Mapping**:
        - Map `grossRevenue` -> UI "Gross Revenue" Card.
        - Map `transactionFees` -> UI "Transaction Fees" Card.
        - Map `fxSales` -> UI "FX Sales" Card.

### 2. UI Implementation (`src/app/(dashboard)/dashboard/metrics/page.tsx`)

**Action**: Replace hardcoded/demo data with the real, filtered data.

- **Remove**: All "Demo" cards and placeholders.
- **Implement Cards (Yellow Items Only)**:
    - **Gross Revenue**: `data.profit.summary.totalGrossRevenue`
    - **Transaction Fees**: `data.profit.summary.totalTransactionFees`
    - **FX Sales**: `data.profit.summary.totalFxSales`
    - **Total Transactions**: `data.profit.summary.totalTransactionCount`
    - **Total Volume**: `data.profit.summary.totalVolume`
- **Implement Charts**:
    - **Currency Pairs**: Use `data.pairs` to populate the "Top Profit Currency Pair" and "Highest Failure Rate" charts.
    - **Wallets**: Use `data.wallets` to show "Total Wallets" and "Active vs Inactive".
- **Handling Missing Data**:
    - If the backend doesn't provide "Time to First Transaction" (since we aren't changing the backend), display a placeholder or hide that specific card for now. **Do not crash.**
- **Country Filter**:
    - The API returns data broken down by currency/region.
    - Implement the frontend "Per Country" dropdown to filter the *displayed* data (e.g., if User selects "NGN", only show NGN-related profit/volume).

---

## 3. Verification Steps

1.  **Load Dashboard**: Navigate to `/dashboard/metrics`.
2.  **Check "Forbidden" Data**: Confirm that "Net Revenue" and "Combined Net Profit" are **NOT VISIBLE** anywhere on the screen.
3.  **Check "Required" Data**: Confirm "Gross Revenue" and "FX Sales" are showing real numbers (not "$0.00" or placeholders).
4.  **Check Filtering**: Toggle the "Country/Currency" dropdown (e.g., NGN vs USD) and verify the numbers update.
