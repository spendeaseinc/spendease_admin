/* eslint-disable max-lines */
/**
 * Analytics Types for Metrics Dashboard
 * These types define the structure for analytics data used in the metrics page.
 */

// ============================================================================
// Metric Card Types
// ============================================================================

export type MetricCardTrend = "up" | "down" | "neutral";
export type MetricCardLayout = "default" | "detailed" | "simple" | "compact";
export type MetricCardSize = "default" | "large";

export interface MetricCardDetail {
  label: string;
  value: string;
}

export type DemoDataReason = "error" | "not_configured" | "no_data";

export interface MetricCardData {
  id: string;
  title: string;
  value: string;
  change?: string;
  trend?: MetricCardTrend;
  subtitle?: string;
  variant?: "default" | "accent" | "success" | "warning";
  size?: MetricCardSize;
  layout?: MetricCardLayout;
  details?: MetricCardDetail[];
  badge?: string;
  // Demo data tracking
  isDemoData?: boolean;
  demoDataReason?: DemoDataReason;
  demoDataMessage?: string;
  // Currency association for filtering
  currency?: SupportedCurrency | "all";
  // Calculation description for info tooltip
  calculationDescription?: string;
}

// ============================================================================
// Chart Types
// ============================================================================

export type ChartType = "bar" | "line" | "area" | "stacked-bar" | "status-bar" | "pair-bar" | "pair-status";

export interface ChartDataItem {
  name: string;
  [key: string]: number | string | undefined;
}

export interface ChartData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  type: ChartType;
  data: ChartDataItem[];
  currencies?: string[];
  pairs?: string[];
  showLegend?: boolean;
  hasStatusLegend?: boolean;
  hasPairLegend?: boolean;
  // Demo data tracking
  isDemoData?: boolean;
  demoDataReason?: DemoDataReason;
  demoDataMessage?: string;
  // Snapshot vs time-series - snapshot charts don't support time frame filtering
  isSnapshot?: boolean;
}

// ============================================================================
// Analytics Response Types (for API integration)
// ============================================================================

export interface AnalyticsOverview {
  grossRevenue: {
    value: number;
    currency: string;
    change: number;
    trend: MetricCardTrend;
  };
  netRevenue: {
    value: number;
    currency: string;
    change: number;
    trend: MetricCardTrend;
  };
  transactionFees: {
    value: number;
    currency: string;
    change: number;
    trend: MetricCardTrend;
  };
  fxSales: {
    value: number;
    currency: string;
    change: number;
    trend: MetricCardTrend;
  };
  netProfit: {
    value: number;
    change: number;
    trend: MetricCardTrend;
  };
}

export interface CustomerMetrics {
  lifetimeValue: {
    value: number;
    currency: string;
    change: number;
    trend: MetricCardTrend;
    totalCustomers: number;
    activeCustomers: number;
    averageLifespan: number; // in days
  };
  highestRatedCustomer: {
    username: string;
    totalValue: number;
    currency: string;
    transactionCount: number;
  };
}

export interface CurrencyPairMetrics {
  topProfitPair: {
    pair: string;
    profit: number;
    currency: string;
    change: number;
    trend: MetricCardTrend;
  };
  highestConversionRate: {
    pair: string;
    rate: number;
    change: number;
    trend: MetricCardTrend;
  };
  highestFailureRate: {
    pair: string;
    rate: number;
    change: number;
    trend: MetricCardTrend;
  };
}

export interface WalletMetrics {
  mostActiveWallets: {
    currency: string;
    count: number;
    change: number;
    trend: MetricCardTrend;
  };
  leastActiveWallets: {
    currency: string;
    count: number;
    change: number;
    trend: MetricCardTrend;
  };
  regionalLeader: {
    currency: string;
    region: string;
    percentage: number;
    change: number;
    trend: MetricCardTrend;
  };
}

export interface TransactionMetrics {
  highestVolume: {
    currency: string;
    count: number;
    change: number;
    trend: MetricCardTrend;
  };
  mostBeneficiaries: {
    currency: string;
    count: number;
    change: number;
    trend: MetricCardTrend;
  };
  mostSenders: {
    currency: string;
    count: number;
    change: number;
    trend: MetricCardTrend;
  };
}

// ============================================================================
// Full Analytics Data Response
// ============================================================================

export interface AnalyticsData {
  metricCards: MetricCardData[];
  charts: ChartData[];
}

export interface AnalyticsApiResponse {
  status: boolean;
  message: string;
  data: AnalyticsData;
}

// ============================================================================
// Time Frame Types
// ============================================================================

export type TimeFrame = "weekly" | "monthly" | "3months" | "6months" | "9months" | "12months" | "18months" | "24months";

export const TIME_FRAME_LABELS: Record<TimeFrame, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  "3months": "3 Months",
  "6months": "6 Months",
  "9months": "9 Months",
  "12months": "12 Months",
  "18months": "18 Months",
  "24months": "24 Months",
};

// ============================================================================
// Currency Types
// ============================================================================

export type SupportedCurrency = "NGN" | "KES" | "GHS" | "ZAR";

export const SUPPORTED_CURRENCIES: SupportedCurrency[] = ["NGN", "KES", "GHS", "ZAR"];

export const CURRENCY_INFO: Record<SupportedCurrency, { name: string; color: string; flag: string; country: string }> =
  {
    NGN: { name: "Nigerian Naira", color: "#FD6F01", flag: "🇳🇬", country: "Nigeria" },
    KES: { name: "Kenyan Shilling", color: "#22C55E", flag: "🇰🇪", country: "Kenya" },
    GHS: { name: "Ghanaian Cedi", color: "#3B82F6", flag: "🇬🇭", country: "Ghana" },
    ZAR: { name: "South African Rand", color: "#A855F7", flag: "🇿🇦", country: "South Africa" },
  };

// Fixed USD exchange rates (1 USD = X currency)
export const USD_EXCHANGE_RATES: Record<SupportedCurrency, number> = {
  NGN: 1550,
  KES: 153,
  GHS: 15.2,
  ZAR: 18.5,
};

export type CurrencyFilter = "all" | SupportedCurrency;
export type PairFilter = "all" | string;

// ============================================================================
// Backend API Response Types
// ============================================================================

// GET /api/admin/dashboard/profit-analytics
export interface ProfitAnalyticsApiResponse {
  status: boolean;
  message: string;
  data: {
    summary: {
      totalGrossRevenue: number;
      totalNetRevenue: number;
      totalTransactionFees: number;
      totalFxSales: number;
      totalCombinedNetProfit: number;
      totalTransactionCount: number;
      totalVolume: number;
    };
    byCurrency: Array<{
      currency: string;
      grossRevenue: number;
      netRevenue: number;
      totalTransactionFees: number;
      fxSales: number;
      combinedNetProfit: number;
      transactionCount: number;
      totalVolume: number;
    }>;
    dateRange: { from: string; to: string };
  };
}

// GET /api/admin/dashboard/currency-pair-analytics
export interface CurrencyPairAnalyticsApiResponse {
  status: boolean;
  message: string;
  data: {
    pairs: Array<{
      pair: string;
      sourceCurrency: string;
      targetCurrency: string;
      totalTransactions: number;
      successfulTransactions: number;
      failedTransactions: number;
      pendingTransactions: number;
      successRate: number;
      failureRate: number;
      pendingRate: number;
      totalVolume: number;
      totalProfit: number;
      averageTransactionValue: number;
    }>;
    summary: {
      totalPairs: number;
      mostProfitablePair: string;
      highestSuccessRatePair: string;
      highestFailureRatePair: string;
    };
    dateRange: { from: string; to: string };
  };
}

// GET /api/admin/dashboard/wallet-analytics
export interface WalletAnalyticsApiResponse {
  status: boolean;
  message: string;
  data: {
    byCurrency: Array<{
      currency: string;
      totalWallets: number;
      activeWallets: number;
      inactiveWallets: number;
      totalBalance: number;
      averageBalance: number;
    }>;
    byRegion: Array<{
      country: string;
      countryCode: string;
      currency: string;
      walletCount: number;
      percentageOfTotal: number;
    }>;
    summary: {
      totalWallets: number;
      totalActiveWallets: number;
      mostActiveWalletCurrency: string;
      leastActiveWalletCurrency: string;
    };
  };
}

// GET /api/admin/dashboard/customer-analytics
export interface CustomerAnalyticsApiResponse {
  status: boolean;
  message: string;
  data: {
    lifetimeValue: {
      averageCLV: number;
      medianCLV: number;
      totalCustomers: number;
      activeCustomers: number;
      averageLifespanDays: number;
      averageTransactionsPerCustomer: number;
      averageRevenuePerCustomer: number;
    };
    topCustomers: Array<{
      userId: number;
      username: string;
      firstName: string;
      lastName: string;
      totalTransactionValue: number;
      transactionCount: number;
      totalFeesPaid: number;
      lifetimeValue: number;
      firstTransactionDate?: string;
      lastTransactionDate?: string;
    }>;
    sendersByCurrency: Array<{
      currency: string;
      uniqueSenders: number;
      totalTransactions: number;
    }>;
    beneficiariesByCurrency: Array<{
      currency: string;
      uniqueBeneficiaries: number;
    }>;
  };
}

// Combined API fetch result with error tracking
export interface ApiEndpointResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  endpoint: string;
}

export interface AnalyticsApiResults {
  profitAnalytics: ApiEndpointResult<ProfitAnalyticsApiResponse["data"]>;
  currencyPairAnalytics: ApiEndpointResult<CurrencyPairAnalyticsApiResponse["data"]>;
  walletAnalytics: ApiEndpointResult<WalletAnalyticsApiResponse["data"]>;
  customerAnalytics: ApiEndpointResult<CustomerAnalyticsApiResponse["data"]>;
}
