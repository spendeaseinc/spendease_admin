/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable prettier/prettier */
/* eslint-disable security/detect-object-injection */
/* eslint-disable max-lines */
/* eslint-disable complexity */
"use server";

import { chartsData as dummyChartsData, metricCardsData as dummyMetricCardsData } from "@/lib/analytics-data";
import {
  SUPPORTED_CURRENCIES,
  USD_EXCHANGE_RATES,
  CURRENCY_INFO,
  type AnalyticsData,
  type MetricCardData,
  type ChartData,
  type ProfitAnalyticsApiResponse,
  type CurrencyPairAnalyticsApiResponse,
  type WalletAnalyticsApiResponse,
  type CustomerAnalyticsApiResponse,
  type MonthlyProfitAnalyticsApiResponse,
  type CountryAnalyticsApiResponse,
  type DemoDataReason,
  type SupportedCurrency,
  ChartDataItem,
} from "@/lib/analytics-types";
import type { ApiError } from "@/lib/types";
import { getValueFromCookie } from "@/server/server-actions";

const API_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT;

// Helper to check if a currency is supported
function isSupportedCurrency(currency: string): currency is SupportedCurrency {
  return SUPPORTED_CURRENCIES.includes(currency as SupportedCurrency);
}

// Helper to convert currency value to USD
function convertToUSD(value: number, currency: SupportedCurrency): number {
  return value / USD_EXCHANGE_RATES[currency];
}

export interface AnalyticsResponse {
  status: boolean;
  message: string;
  data: AnalyticsData;
  apiErrors?: Array<{ endpoint: string; error: string }>;
}

interface EndpointResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  endpoint: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatCurrency(value: number, currency: string): string {
  if (value >= 1000000) return `${currency} ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${currency} ${(value / 1000).toFixed(0)}K`;
  return `${currency} ${value.toLocaleString()}`;
}

function formatNumber(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toLocaleString();
}

// ============================================================================
// API Fetch Functions
// ============================================================================

async function fetchWithAuth<T>(endpoint: string, accessToken: string): Promise<EndpointResult<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText}`,
        endpoint,
      };
    }

    const json = await response.json();

    if (json.status === false) {
      return {
        success: false,
        error: json.message ?? "API returned error status",
        endpoint,
      };
    }

    return {
      success: true,
      data: json.data,
      endpoint,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      endpoint,
    };
  }
}

// ============================================================================
// Calculation Descriptions for Info Tooltips
// ============================================================================

const CALC_DESCRIPTIONS = {
  // Revenue metrics
  grossRevenue: {
    all: "Sum of all transaction fees collected across NGN, KES, GHS, ZAR, converted to USD using fixed exchange rates (NGN=1550, KES=153, GHS=15.2, ZAR=18.5)",
    currency: (c: string) => `Total transaction fees collected from all successful ${c} transactions in the selected period`,
  },
  netRevenue: {
    all: "Gross revenue minus operational costs, converted to USD from all supported currencies",
    currency: (c: string) => `Gross revenue from ${c} transactions minus any deducted costs (currently equal to gross as no cost data tracked)`,
  },
  transactionFees: {
    all: "Platform fees from all transactions across all currencies, converted to USD",
    currency: (c: string) => `Sum of 'fee' field from all successful ${c} wallet transactions`,
  },
  fxSales: {
    all: "Revenue from FX rate markup on currency conversions, converted to USD",
    currency: (c: string) => `Profit from rate markup when users convert to ${c}. Calculated as: original Fincra rate amount - marked up rate amount`,
  },
  netProfit: {
    all: "Net Revenue + FX Sales across all currencies, converted to USD",
    currency: (c: string) => `Combined profit from ${c}: transaction fees + FX markup profit`,
  },
  transactionCount: {
    all: "Total count of successful transactions across all supported currencies",
    currency: (c: string) => `Number of successful transactions where currency = ${c}`,
  },
  volume: {
    all: "Total transaction amount across all currencies, converted to USD",
    currency: (c: string) => `Sum of all transaction amounts in ${c}`,
  },
  // Currency pair metrics
  topProfitPair: {
    all: "Currency pair with highest FX markup profit",
    currency: (c: string) => `Most profitable conversion corridor starting from ${c}`,
  },
  successRate: {
    all: "Percentage of successful transactions across all currency pairs",
    currency: (c: string) => `Success rate for conversions from ${c}: (successful ÷ total) × 100`,
  },
  failureRate: {
    all: "Percentage of failed transactions - pairs above 5% need attention",
    currency: (c: string) => `Failure rate for ${c} conversions: (failed ÷ total) × 100`,
  },
  outboundVolume: (c: string) => `Total value of transfers sent from ${c} wallets to other currencies`,
  outboundTxCount: (c: string) => `Number of currency conversions initiated from ${c} wallets`,
  // Wallet metrics
  totalWallets: {
    all: "Sum of all wallets across NGN, KES, GHS, ZAR",
    currency: (c: string) => `Count of all ${c} wallets (enabled + disabled)`,
  },
  activeWallets: {
    all: "Wallets with status='enabled' across all currencies",
    currency: (c: string) => `${c} wallets with status='enabled'`,
  },
  inactiveWallets: (c: string) => `${c} wallets with status='disabled' or 'inactive'`,
  totalBalance: (c: string) => `Sum of available_balance for all ${c} wallets`,
  avgBalance: (c: string) => `Total ${c} balance ÷ number of ${c} wallets`,
  topRegion: {
    all: "Country with highest percentage of total wallets",
    currency: (c: string) => `Leading country for ${c} wallets by percentage`,
  },
  // Customer metrics
  clv: "Average Customer Lifetime Value: (Total fees paid ÷ Total customers) × Average customer lifespan in months",
  topCustomer: "Customer with highest total transaction value in the period",
  senders: {
    all: "Count of unique users who initiated transactions across all currencies",
    currency: (c: string) => `Unique users who initiated PayOut, CurrencySwap, Withdrawal or Transfer from ${c} wallets`,
  },
  beneficiaries: {
    all: "Count of unique recipient accounts across all currencies",
    currency: (c: string) => `Unique bank accounts that received ${c} payouts`,
  },
  avgTxPerCustomer: "Total transactions ÷ Total customers with at least one transaction",
  arpu: "Average Revenue Per User: Total fees collected ÷ Total transacting customers",
};

// ============================================================================
// Data Transformation Functions
// ============================================================================

function transformProfitAnalyticsToCards(
  data: ProfitAnalyticsApiResponse["data"] | null,
  error?: string,
): MetricCardData[] {
  const demoDataReason: DemoDataReason = error ? "error" : "not_configured";
  const demoDataMessage = error;

  if (!data) {
    // Return dummy data for profit-related cards with "all" currency
    return (dummyMetricCardsData as MetricCardData[])
      .filter((card) =>
        ["gross-revenue", "net-revenue", "transaction-fees", "fx-sales", "net-profit"].includes(card.id),
      )
      .map((card) => ({
        ...card,
        isDemoData: true,
        demoDataReason,
        demoDataMessage,
        currency: "all" as const,
      }));
  }

  const { byCurrency } = data;
  const cards: MetricCardData[] = [];

  // Filter to only supported currencies
  const supportedCurrencyData = byCurrency.filter((c) => isSupportedCurrency(c.currency));

  // Calculate USD totals for "all" tab
  const usdTotals = supportedCurrencyData.reduce(
    (acc, curr) => {
      const currency = curr.currency as SupportedCurrency;
      return {
        grossRevenue: acc.grossRevenue + convertToUSD(curr.grossRevenue, currency),
        netRevenue: acc.netRevenue + convertToUSD(curr.netRevenue, currency),
        transactionFees: acc.transactionFees + convertToUSD(curr.totalTransactionFees, currency),
        fxSales: acc.fxSales + convertToUSD(curr.fxSales, currency),
        combinedNetProfit: acc.combinedNetProfit + convertToUSD(curr.combinedNetProfit, currency),
        transactionCount: acc.transactionCount + curr.transactionCount,
        totalVolume: acc.totalVolume + convertToUSD(curr.totalVolume, currency),
      };
    },
    {
      grossRevenue: 0,
      netRevenue: 0,
      transactionFees: 0,
      fxSales: 0,
      combinedNetProfit: 0,
      transactionCount: 0,
      totalVolume: 0,
    },
  );

  // "ALL" tab cards (USD converted)
  cards.push(
    {
      id: "gross-revenue-all",
      title: "Gross Revenue",
      value: formatCurrency(usdTotals.grossRevenue, "USD"),
      change: "+12.5%",
      trend: "up" as const,
      subtitle: "All currencies • Last 30 days",
      layout: "compact" as const,
      isDemoData: false,
      currency: "all",
      calculationDescription: CALC_DESCRIPTIONS.grossRevenue.all,
    },
    {
      id: "net-revenue-all",
      title: "Net Revenue",
      value: formatCurrency(usdTotals.netRevenue, "USD"),
      subtitle: "After all fees • Last 30 days",
      trend: "up" as const,
      change: "+8.3%",
      layout: "simple" as const,
      isDemoData: false,
      currency: "all",
      calculationDescription: CALC_DESCRIPTIONS.netRevenue.all,
    },
    {
      id: "transaction-fees-all",
      title: "Transaction Fees Generated",
      value: formatCurrency(usdTotals.transactionFees, "USD"),
      change: "+15.2%",
      trend: "up" as const,
      subtitle: "All platform fees",
      layout: "compact" as const,
      isDemoData: false,
      currency: "all",
      calculationDescription: CALC_DESCRIPTIONS.transactionFees.all,
    },
    {
      id: "fx-sales-all",
      title: "FX Sales",
      value: formatCurrency(usdTotals.fxSales, "USD"),
      change: "+22.1%",
      trend: "up" as const,
      subtitle: "All currency exchanges",
      layout: "default" as const,
      isDemoData: false,
      currency: "all",
      calculationDescription: CALC_DESCRIPTIONS.fxSales.all,
    },
    {
      id: "net-profit-all",
      title: "Combined Net Profit",
      value: formatCurrency(usdTotals.combinedNetProfit, "USD"),
      change: usdTotals.combinedNetProfit >= 0 ? "+5.2%" : "-5.2%",
      trend: usdTotals.combinedNetProfit >= 0 ? ("up" as const) : ("down" as const),
      subtitle: "Net profit margin • All currencies",
      layout: "default" as const,
      size: "large" as const,
      isDemoData: false,
      currency: "all",
      calculationDescription: CALC_DESCRIPTIONS.netProfit.all,
    },
    {
      id: "total-transaction-count-all",
      title: "Total Transactions",
      value: formatNumber(usdTotals.transactionCount),
      change: "+10.5%",
      trend: "up" as const,
      subtitle: "All currencies • Last 30 days",
      layout: "compact" as const,
      isDemoData: false,
      currency: "all",
      calculationDescription: CALC_DESCRIPTIONS.transactionCount.all,
    },
    {
      id: "total-volume-all",
      title: "Total Volume",
      value: formatCurrency(usdTotals.totalVolume, "USD"),
      change: "+8.7%",
      trend: "up" as const,
      subtitle: "All currencies • Last 30 days",
      layout: "default" as const,
      isDemoData: false,
      currency: "all",
      calculationDescription: CALC_DESCRIPTIONS.volume.all,
    },
  );

  // Per-currency cards
  for (const currencyData of supportedCurrencyData) {
    const currency = currencyData.currency as SupportedCurrency;
    const currencyName = CURRENCY_INFO[currency].name;

    cards.push(
      {
        id: `gross-revenue-${currency.toLowerCase()}`,
        title: "Gross Revenue",
        value: formatCurrency(currencyData.grossRevenue, currency),
        change: "+12.5%",
        trend: "up" as const,
        subtitle: `${currencyName} • Last 30 days`,
        layout: "compact" as const,
        isDemoData: false,
        currency,
        calculationDescription: CALC_DESCRIPTIONS.grossRevenue.currency(currency),
      },
      {
        id: `net-revenue-${currency.toLowerCase()}`,
        title: "Net Revenue",
        value: formatCurrency(currencyData.netRevenue, currency),
        subtitle: `After fees • ${currencyName}`,
        trend: "up" as const,
        change: "+8.3%",
        layout: "simple" as const,
        isDemoData: false,
        currency,
        calculationDescription: CALC_DESCRIPTIONS.netRevenue.currency(currency),
      },
      {
        id: `transaction-fees-${currency.toLowerCase()}`,
        title: "Transaction Fees",
        value: formatCurrency(currencyData.totalTransactionFees, currency),
        change: "+15.2%",
        trend: "up" as const,
        subtitle: `Platform fees • ${currency}`,
        layout: "compact" as const,
        isDemoData: false,
        currency,
        calculationDescription: CALC_DESCRIPTIONS.transactionFees.currency(currency),
      },
      {
        id: `fx-sales-${currency.toLowerCase()}`,
        title: "FX Sales",
        value: formatCurrency(currencyData.fxSales, currency),
        change: "+22.1%",
        trend: "up" as const,
        subtitle: `Currency exchanges • ${currency}`,
        layout: "default" as const,
        isDemoData: false,
        currency,
        calculationDescription: CALC_DESCRIPTIONS.fxSales.currency(currency),
      },
      {
        id: `net-profit-${currency.toLowerCase()}`,
        title: "Combined Net Profit",
        value: formatCurrency(currencyData.combinedNetProfit, currency),
        change: currencyData.combinedNetProfit >= 0 ? "+5.2%" : "-5.2%",
        trend: currencyData.combinedNetProfit >= 0 ? ("up" as const) : ("down" as const),
        subtitle: `Net profit • ${currencyName}`,
        layout: "default" as const,
        size: "large" as const,
        isDemoData: false,
        currency,
        calculationDescription: CALC_DESCRIPTIONS.netProfit.currency(currency),
      },
      {
        id: `transaction-count-${currency.toLowerCase()}`,
        title: "Transactions",
        value: formatNumber(currencyData.transactionCount),
        change: "+10.5%",
        trend: "up" as const,
        subtitle: `${currency} transactions • Last 30 days`,
        layout: "compact" as const,
        isDemoData: false,
        currency,
        calculationDescription: CALC_DESCRIPTIONS.transactionCount.currency(currency),
      },
      {
        id: `volume-${currency.toLowerCase()}`,
        title: "Transaction Volume",
        value: formatCurrency(currencyData.totalVolume, currency),
        change: "+8.7%",
        trend: "up" as const,
        subtitle: `${currency} volume • Last 30 days`,
        layout: "default" as const,
        isDemoData: false,
        currency,
        calculationDescription: CALC_DESCRIPTIONS.volume.currency(currency),
      },
    );
  }

  return cards;
}

function transformCurrencyPairAnalyticsToCards(
  data: CurrencyPairAnalyticsApiResponse["data"] | null,
  error?: string,
): MetricCardData[] {
  const demoDataReason: DemoDataReason = error ? "error" : "not_configured";
  const demoDataMessage = error;

  if (!data) {
    return (dummyMetricCardsData as MetricCardData[])
      .filter((card) =>
        ["top-currency-pair-profit", "highest-conversion-rate", "highest-failure-rate"].includes(card.id),
      )
      .map((card) => ({
        ...card,
        isDemoData: true,
        demoDataReason,
        demoDataMessage,
        currency: "all" as const,
      }));
  }

  const { summary, pairs } = data;
  const cards: MetricCardData[] = [];

  // Filter pairs to only include supported currencies
  const supportedPairs = pairs.filter(
    (p) => isSupportedCurrency(p.sourceCurrency) && isSupportedCurrency(p.targetCurrency),
  );

  // Find pair details for each summary metric
  const mostProfitablePairData = supportedPairs.find((p) => p.pair === summary.mostProfitablePair);
  const highestSuccessPairData = supportedPairs.find((p) => p.pair === summary.highestSuccessRatePair);
  const highestFailurePairData = supportedPairs.find((p) => p.pair === summary.highestFailureRatePair);

  // "ALL" tab cards - overall pair analytics
  cards.push(
    {
      id: "top-currency-pair-profit",
      title: "Top Profit Currency Pair",
      value: summary.mostProfitablePair || "N/A",
      change: "+18.5%",
      trend: "up" as const,
      subtitle: mostProfitablePairData
        ? `Most profitable pair • ${formatCurrency(mostProfitablePairData.totalProfit, mostProfitablePairData.sourceCurrency)} profit`
        : "Most profitable pair",
      layout: "default" as const,
      isDemoData: false,
      currency: "all",
      calculationDescription: CALC_DESCRIPTIONS.topProfitPair.all,
    },
    {
      id: "highest-conversion-rate",
      title: "Highest Conversion Rate",
      value: highestSuccessPairData ? `${highestSuccessPairData.successRate.toFixed(1)}%` : "N/A",
      change: "+2.3%",
      trend: "up" as const,
      subtitle: `${summary.highestSuccessRatePair || "N/A"} • Success rate`,
      layout: "compact" as const,
      isDemoData: false,
      currency: "all",
      calculationDescription: CALC_DESCRIPTIONS.successRate.all,
    },
    {
      id: "highest-failure-rate",
      title: "Highest Failure Rate",
      value: highestFailurePairData ? `${highestFailurePairData.failureRate.toFixed(1)}%` : "N/A",
      change: "+4.1%",
      trend: "down" as const,
      subtitle: `${summary.highestFailureRatePair || "N/A"} • Needs attention`,
      layout: "compact" as const,
      isDemoData: false,
      currency: "all",
      calculationDescription: CALC_DESCRIPTIONS.failureRate.all,
    },
  );

  // Per-currency cards - find best pairs for each source currency
  for (const sourceCurrency of SUPPORTED_CURRENCIES) {
    const currencyPairs = supportedPairs.filter((p) => p.sourceCurrency === sourceCurrency);
    if (currencyPairs.length === 0) continue;

    const bestProfitPair = currencyPairs.reduce((best, curr) => (curr.totalProfit > best.totalProfit ? curr : best));
    const bestSuccessPair = currencyPairs.reduce((best, curr) => (curr.successRate > best.successRate ? curr : best));
    const worstFailurePair = currencyPairs.reduce((best, curr) =>
      curr.failureRate > best.failureRate ? curr : best,
    );
    const totalVolume = currencyPairs.reduce((sum, p) => sum + p.totalVolume, 0);
    const totalTxCount = currencyPairs.reduce((sum, p) => sum + p.totalTransactions, 0);

    cards.push(
      {
        id: `top-pair-profit-${sourceCurrency.toLowerCase()}`,
        title: "Top Profit Pair",
        value: bestProfitPair.pair,
        change: "+18.5%",
        trend: "up" as const,
        subtitle: `${formatCurrency(bestProfitPair.totalProfit, sourceCurrency)} profit`,
        layout: "default" as const,
        isDemoData: false,
        currency: sourceCurrency,
        calculationDescription: CALC_DESCRIPTIONS.topProfitPair.currency(sourceCurrency),
      },
      {
        id: `best-success-rate-${sourceCurrency.toLowerCase()}`,
        title: "Best Success Rate",
        value: `${bestSuccessPair.successRate.toFixed(1)}%`,
        change: "+2.3%",
        trend: "up" as const,
        subtitle: `${bestSuccessPair.pair} corridor`,
        layout: "compact" as const,
        isDemoData: false,
        currency: sourceCurrency,
        calculationDescription: CALC_DESCRIPTIONS.successRate.currency(sourceCurrency),
      },
      {
        id: `worst-failure-rate-${sourceCurrency.toLowerCase()}`,
        title: "Highest Failure Rate",
        value: `${worstFailurePair.failureRate.toFixed(1)}%`,
        change: worstFailurePair.failureRate > 5 ? "+4.1%" : "-1.2%",
        trend: worstFailurePair.failureRate > 5 ? ("down" as const) : ("up" as const),
        subtitle: `${worstFailurePair.pair} • ${worstFailurePair.failureRate > 5 ? "Needs attention" : "Acceptable"}`,
        layout: "compact" as const,
        isDemoData: false,
        currency: sourceCurrency,
        calculationDescription: CALC_DESCRIPTIONS.failureRate.currency(sourceCurrency),
      },
      {
        id: `outbound-volume-${sourceCurrency.toLowerCase()}`,
        title: "Outbound Volume",
        value: formatCurrency(totalVolume, sourceCurrency),
        change: "+8.7%",
        trend: "up" as const,
        subtitle: `${sourceCurrency} outbound transfers`,
        layout: "default" as const,
        isDemoData: false,
        currency: sourceCurrency,
        calculationDescription: CALC_DESCRIPTIONS.outboundVolume(sourceCurrency),
      },
      {
        id: `outbound-tx-count-${sourceCurrency.toLowerCase()}`,
        title: "Outbound Transactions",
        value: formatNumber(totalTxCount),
        change: "+5.2%",
        trend: "up" as const,
        subtitle: `From ${sourceCurrency} wallets`,
        layout: "compact" as const,
        isDemoData: false,
        currency: sourceCurrency,
        calculationDescription: CALC_DESCRIPTIONS.outboundTxCount(sourceCurrency),
      },
    );
  }

  return cards;
}

function transformWalletAnalyticsToCards(
  data: WalletAnalyticsApiResponse["data"] | null,
  error?: string,
): MetricCardData[] {
  const demoDataReason: DemoDataReason = error ? "error" : "not_configured";
  const demoDataMessage = error;

  if (!data) {
    return (dummyMetricCardsData as MetricCardData[])
      .filter((card) => ["most-active-wallets", "least-active-wallets", "regional-wallet-leader"].includes(card.id))
      .map((card) => ({
        ...card,
        isDemoData: true,
        demoDataReason,
        demoDataMessage,
        currency: "all" as const,
      }));
  }

  const { byCurrency, byRegion } = data;
  const cards: MetricCardData[] = [];

  // Filter to only supported currencies
  const supportedWalletData = byCurrency.filter((w) => isSupportedCurrency(w.currency));
  const supportedRegions = byRegion.filter((r) => isSupportedCurrency(r.currency));

  // Find most/least active from supported currencies only
  const sortedByActive = [...supportedWalletData].sort((a, b) => b.activeWallets - a.activeWallets);
  const mostActiveData = sortedByActive[0];
  const leastActiveData = sortedByActive[sortedByActive.length - 1];
  const topRegion = supportedRegions[0];

  // Calculate totals from supported currencies only
  const totalWallets = supportedWalletData.reduce((sum, w) => sum + w.totalWallets, 0);
  const totalActiveWallets = supportedWalletData.reduce((sum, w) => sum + w.activeWallets, 0);

  // "ALL" tab cards
  cards.push(
    {
      id: "most-active-wallets-all",
      title: "Most Active Wallets",
      value: mostActiveData ? formatNumber(mostActiveData.activeWallets) : formatNumber(totalActiveWallets),
      change: "0%",
      trend: "neutral" as const,
      subtitle: mostActiveData ? `${mostActiveData.currency} wallets` : "All wallets",
      layout: "default" as const,
      isDemoData: false,
      currency: "all",
      calculationDescription: CALC_DESCRIPTIONS.activeWallets.all,
    },
    {
      id: "least-active-wallets-all",
      title: "Least Active Wallets",
      value: leastActiveData ? formatNumber(leastActiveData.activeWallets) : "N/A",
      change: "-2.1%",
      trend: "down" as const,
      subtitle: leastActiveData ? `${leastActiveData.currency} wallets` : "N/A",
      layout: "default" as const,
      isDemoData: false,
      currency: "all",
      calculationDescription: "Currency with lowest count of enabled wallets",
    },
    {
      id: "regional-wallet-leader-all",
      title: "Regional Wallet Leader",
      value: topRegion ? `${topRegion.percentageOfTotal.toFixed(1)}%` : "N/A",
      change: "+5.4%",
      trend: "up" as const,
      subtitle: topRegion ? `${topRegion.currency} (${topRegion.country})` : "N/A",
      layout: "compact" as const,
      isDemoData: false,
      currency: "all",
      calculationDescription: CALC_DESCRIPTIONS.topRegion.all,
    },
    {
      id: "total-wallets-all",
      title: "Total Wallets",
      value: formatNumber(totalWallets),
      change: "+3.2%",
      trend: "up" as const,
      subtitle: "All currencies combined",
      layout: "default" as const,
      isDemoData: false,
      currency: "all",
      calculationDescription: CALC_DESCRIPTIONS.totalWallets.all,
    },
  );

  // Per-currency wallet cards
  for (const walletData of supportedWalletData) {
    const currency = walletData.currency as SupportedCurrency;
    const currencyName = CURRENCY_INFO[currency].name;
    const currencyRegions = supportedRegions.filter((r) => r.currency === currency);
    const topCurrencyRegion = currencyRegions[0];

    cards.push(
      {
        id: `total-wallets-${currency.toLowerCase()}`,
        title: "Total Wallets",
        value: formatNumber(walletData.totalWallets),
        change: "+3.2%",
        trend: "up" as const,
        subtitle: `${currencyName} wallets`,
        layout: "default" as const,
        isDemoData: false,
        currency,
        calculationDescription: CALC_DESCRIPTIONS.totalWallets.currency(currency),
      },
      {
        id: `active-wallets-${currency.toLowerCase()}`,
        title: "Active Wallets",
        value: formatNumber(walletData.activeWallets),
        change: "+1.5%",
        trend: "up" as const,
        subtitle: `${currency} • Active status`,
        layout: "compact" as const,
        isDemoData: false,
        currency,
        calculationDescription: CALC_DESCRIPTIONS.activeWallets.currency(currency),
      },
      {
        id: `inactive-wallets-${currency.toLowerCase()}`,
        title: "Inactive Wallets",
        value: formatNumber(walletData.inactiveWallets),
        change: "-0.8%",
        trend: "down" as const,
        subtitle: `${currency} • Needs re-engagement`,
        layout: "compact" as const,
        isDemoData: false,
        currency,
        calculationDescription: CALC_DESCRIPTIONS.inactiveWallets(currency),
      },
      {
        id: `total-balance-${currency.toLowerCase()}`,
        title: "Total Balance",
        value: formatCurrency(walletData.totalBalance, currency),
        change: "+4.5%",
        trend: "up" as const,
        subtitle: `All ${currency} wallets`,
        layout: "default" as const,
        isDemoData: false,
        currency,
        calculationDescription: CALC_DESCRIPTIONS.totalBalance(currency),
      },
      {
        id: `avg-balance-${currency.toLowerCase()}`,
        title: "Average Balance",
        value: formatCurrency(walletData.averageBalance, currency),
        change: "+2.1%",
        trend: "up" as const,
        subtitle: `Per ${currency} wallet`,
        layout: "compact" as const,
        isDemoData: false,
        currency,
        calculationDescription: CALC_DESCRIPTIONS.avgBalance(currency),
      },
    );

    if (topCurrencyRegion) {
      cards.push({
        id: `top-region-${currency.toLowerCase()}`,
        title: "Top Region",
        value: `${topCurrencyRegion.percentageOfTotal.toFixed(1)}%`,
        change: "+5.4%",
        trend: "up" as const,
        subtitle: `${topCurrencyRegion.country} • ${currency}`,
        layout: "compact" as const,
        isDemoData: false,
        currency,
        calculationDescription: CALC_DESCRIPTIONS.topRegion.currency(currency),
      });
    }
  }

  return cards;
}

function transformCustomerAnalyticsToCards(
  data: CustomerAnalyticsApiResponse["data"] | null,
  error?: string,
): MetricCardData[] {
  const demoDataReason: DemoDataReason = error ? "error" : "not_configured";
  const demoDataMessage = error;

  if (!data) {
    return (dummyMetricCardsData as MetricCardData[])
      .filter((card) =>
        [
          "customer-lifetime-value",
          "highest-rated-customer",
          "most-beneficiaries",
          "most-senders",
          "highest-transaction-volume",
        ].includes(card.id),
      )
      .map((card) => ({
        ...card,
        isDemoData: true,
        demoDataReason,
        demoDataMessage,
        currency: "all" as const,
      }));
  }

  const { lifetimeValue, topCustomers, sendersByCurrency, beneficiariesByCurrency } = data;
  const cards: MetricCardData[] = [];
  const topCustomer = topCustomers[0];

  // Filter to only supported currencies
  const supportedSenders = sendersByCurrency.filter((s) => isSupportedCurrency(s.currency));
  const supportedBeneficiaries = beneficiariesByCurrency.filter((b) => isSupportedCurrency(b.currency));

  // Find highest senders and beneficiaries from supported currencies
  const topSenders =
    supportedSenders.length > 0
      ? supportedSenders.reduce((max, curr) => (curr.uniqueSenders > max.uniqueSenders ? curr : max))
      : null;

  const topBeneficiaries =
    supportedBeneficiaries.length > 0
      ? supportedBeneficiaries.reduce((max, curr) =>
          curr.uniqueBeneficiaries > max.uniqueBeneficiaries ? curr : max,
        )
      : null;

  // Calculate totals for "all" view
  const totalSenders = supportedSenders.reduce((sum, s) => sum + s.uniqueSenders, 0);
  const totalBeneficiaries = supportedBeneficiaries.reduce((sum, b) => sum + b.uniqueBeneficiaries, 0);

  // "ALL" tab cards
  cards.push(
    {
      id: "customer-lifetime-value-all",
      title: "Customer Lifetime Value",
      value: formatCurrency(lifetimeValue.averageCLV, "NGN"),
      badge: "avg. CLV",
      subtitle: "Last 30 days",
      layout: "detailed" as const,
      size: "large" as const,
      trend: "up" as const,
      change: "+4.2%",
      details: [
        { label: "Total customers", value: formatNumber(lifetimeValue.totalCustomers) },
        {
          label: "Active (30d)",
          value: `${formatNumber(lifetimeValue.activeCustomers)} (${lifetimeValue.totalCustomers > 0 ? Math.round((lifetimeValue.activeCustomers / lifetimeValue.totalCustomers) * 100) : 0}%)`,
        },
        { label: "Avg. lifespan", value: `${lifetimeValue.averageLifespanDays} days` },
      ],
      isDemoData: false,
      currency: "all",
      calculationDescription: CALC_DESCRIPTIONS.clv,
    },
    {
      id: "highest-rated-customer-all",
      title: "Highest Rated Customer",
      value: topCustomer ? topCustomer.username : "N/A",
      subtitle: topCustomer
        ? `NGN ${formatNumber(topCustomer.totalTransactionValue)} from ${topCustomer.transactionCount} transactions`
        : "No data available",
      layout: "simple" as const,
      size: "large" as const,
      trend: "neutral" as const,
      change: "0%",
      isDemoData: false,
      currency: "all",
      calculationDescription: CALC_DESCRIPTIONS.topCustomer,
    },
    {
      id: "total-senders-all",
      title: "Total Transaction Initiators",
      value: formatNumber(totalSenders),
      change: "+3.7%",
      trend: "up" as const,
      subtitle: topSenders ? `${topSenders.currency} leads with ${formatNumber(topSenders.uniqueSenders)}` : "All currencies",
      layout: "default" as const,
      isDemoData: false,
      currency: "all",
      calculationDescription: CALC_DESCRIPTIONS.senders.all,
    },
    {
      id: "total-beneficiaries-all",
      title: "Total Beneficiaries",
      value: formatNumber(totalBeneficiaries),
      change: "0%",
      trend: "neutral" as const,
      subtitle: topBeneficiaries ? `${topBeneficiaries.currency} leads with ${formatNumber(topBeneficiaries.uniqueBeneficiaries)}` : "All currencies",
      layout: "default" as const,
      isDemoData: false,
      currency: "all",
      calculationDescription: CALC_DESCRIPTIONS.beneficiaries.all,
    },
    {
      id: "avg-transactions-per-customer-all",
      title: "Avg Transactions/Customer",
      value: lifetimeValue.averageTransactionsPerCustomer.toFixed(1),
      change: "+2.1%",
      trend: "up" as const,
      subtitle: "Transaction frequency",
      layout: "compact" as const,
      isDemoData: false,
      currency: "all",
      calculationDescription: CALC_DESCRIPTIONS.avgTxPerCustomer,
    },
    {
      id: "avg-revenue-per-customer-all",
      title: "Avg Revenue/Customer",
      value: formatCurrency(lifetimeValue.averageRevenuePerCustomer, "NGN"),
      change: "+5.8%",
      trend: "up" as const,
      subtitle: "ARPU • Last 30 days",
      layout: "compact" as const,
      isDemoData: false,
      currency: "all",
      calculationDescription: CALC_DESCRIPTIONS.arpu,
    },
  );

  // Per-currency cards for senders and beneficiaries
  for (const currency of SUPPORTED_CURRENCIES) {
    const senderData = supportedSenders.find((s) => s.currency === currency);
    const beneficiaryData = supportedBeneficiaries.find((b) => b.currency === currency);
    const currencyName = CURRENCY_INFO[currency].name;

    if (senderData) {
      cards.push({
        id: `senders-${currency.toLowerCase()}`,
        title: "Transaction Initiators",
        value: formatNumber(senderData.uniqueSenders),
        change: "+3.7%",
        trend: "up" as const,
        subtitle: `${currencyName} senders`,
        layout: "default" as const,
        isDemoData: false,
        currency,
        calculationDescription: CALC_DESCRIPTIONS.senders.currency(currency),
      });
      cards.push({
        id: `sender-transactions-${currency.toLowerCase()}`,
        title: "Total Transactions",
        value: formatNumber(senderData.totalTransactions),
        change: "+5.2%",
        trend: "up" as const,
        subtitle: `From ${currency} wallets`,
        layout: "compact" as const,
        isDemoData: false,
        currency,
        calculationDescription: `Total number of outbound transactions from ${currency} wallets`,
      });
    }

    if (beneficiaryData) {
      cards.push({
        id: `beneficiaries-${currency.toLowerCase()}`,
        title: "Beneficiaries",
        value: formatNumber(beneficiaryData.uniqueBeneficiaries),
        change: "0%",
        trend: "neutral" as const,
        subtitle: `${currencyName} accounts`,
        layout: "default" as const,
        isDemoData: false,
        currency,
        calculationDescription: CALC_DESCRIPTIONS.beneficiaries.currency(currency),
      });
    }
  }

  return cards;
}

// ============================================================================
// Country Analytics Transformation
// ============================================================================

function transformCountryAnalyticsToCards(
  data: CountryAnalyticsApiResponse["data"] | null,
  error?: string,
): MetricCardData[] {
  const demoDataReason: DemoDataReason = error ? "error" : "not_configured";
  const demoDataMessage = error;

  if (!data) {
    // Return placeholder cards when no data
    return [
      {
        id: "top-sending-country-all",
        title: "Top Sending Country",
        value: "N/A",
        change: "0%",
        trend: "neutral" as const,
        subtitle: "No country data available",
        layout: "default" as const,
        isDemoData: true,
        demoDataReason,
        demoDataMessage,
        currency: "all",
        calculationDescription: "Country with highest outbound transaction volume",
      },
      {
        id: "top-receiving-country-all",
        title: "Top Receiving Country",
        value: "N/A",
        change: "0%",
        trend: "neutral" as const,
        subtitle: "No country data available",
        layout: "default" as const,
        isDemoData: true,
        demoDataReason,
        demoDataMessage,
        currency: "all",
        calculationDescription: "Country with highest inbound transaction volume",
      },
    ];
  }

  const { summary, sendingCountries, receivingCountries } = data;
  const cards: MetricCardData[] = [];

  // Calculate total sending amount in local currencies grouped by currency
  const sendingByCurrency = sendingCountries.reduce((acc, c) => {
    if (!acc[c.currency]) {
      acc[c.currency] = { count: 0, amountLocal: 0, amountUSD: 0 };
    }
    acc[c.currency].count += c.transactionCount;
    acc[c.currency].amountLocal += c.totalAmountLocal;
    acc[c.currency].amountUSD += c.totalAmountUSD;
    return acc;
  }, {} as Record<string, { count: number; amountLocal: number; amountUSD: number }>);

  // Total sending amount in local currencies (formatted as breakdown)
  const sendingBreakdown = Object.entries(sendingByCurrency)
    .map(([currency, data]) => `${currency} ${formatNumber(data.amountLocal)}`)
    .join(" • ");

  // "ALL" tab cards - Country summary stats
  cards.push(
    {
      id: "top-sending-country-all",
      title: "Top Sending Country",
      value: summary.topSendingCountry,
      change: "+5.2%",
      trend: "up" as const,
      subtitle: `${formatNumber(summary.topSendingCountryVolume)} transactions sent`,
      layout: "default" as const,
      isDemoData: false,
      currency: "all",
      calculationDescription: "Country with highest outbound transaction count in the selected period",
    },
    {
      id: "top-receiving-country-all",
      title: "Top Receiving Country",
      value: summary.topReceivingCountry,
      change: "+3.8%",
      trend: "up" as const,
      subtitle: `${formatNumber(summary.topReceivingCountryVolume)} transactions received`,
      layout: "default" as const,
      isDemoData: false,
      currency: "all",
      calculationDescription: "Country with highest inbound transaction count in the selected period",
    },
    {
      id: "total-sending-volume-all",
      title: "Total Sending Volume",
      value: formatNumber(summary.totalSendingVolume),
      change: "+8.1%",
      trend: "up" as const,
      subtitle: "Outbound transactions across all countries",
      layout: "compact" as const,
      isDemoData: false,
      currency: "all",
      calculationDescription: "Total count of outbound transactions grouped by sending country",
    },
    {
      id: "total-sending-amount-all",
      title: "Total Sending Amount",
      value: `$${formatNumber(Math.round(summary.totalSendingAmountUSD))}`,
      change: "+12.4%",
      trend: "up" as const,
      subtitle: sendingBreakdown || "USD equivalent",
      layout: "default" as const,
      isDemoData: false,
      currency: "all",
      calculationDescription: "Total amount sent across all countries, converted to USD using fixed rates",
    },
  );

  return cards;
}

function transformCountryAnalyticsToCharts(
  data: CountryAnalyticsApiResponse["data"] | null,
  error?: string,
): ChartData[] {
  const charts: ChartData[] = [];

  if (!data || data.sendingCountries.length === 0) {
    // Return demo charts if no data
    charts.push(
      {
        id: "sending-volume-by-country",
        title: "Sending Volume by Country",
        subtitle: "Transaction count by sending country",
        description: "Number of transactions initiated from each country",
        type: "bar" as const,
        currencies: [],
        showLegend: false,
        isSnapshot: true,
        showOnlyOnAll: true, // Only show in "All" filter
        data: [
          { name: "Nigeria", Volume: 0 },
          { name: "Ghana", Volume: 0 },
          { name: "Kenya", Volume: 0 },
          { name: "South Africa", Volume: 0 },
        ],
        isDemoData: true,
        demoDataReason: error ? "error" : "no_data",
        demoDataMessage: error ?? "No country analytics data available",
      },
      {
        id: "sending-amount-by-country",
        title: "Sending Amount by Country (USD)",
        subtitle: "Total amount sent by country",
        description: "Sum of transaction amounts by sending country, converted to USD",
        type: "bar" as const,
        currencies: [],
        showLegend: false,
        isSnapshot: true,
        showOnlyOnAll: true, // Only show in "All" filter
        data: [
          { name: "Nigeria", "Amount (USD)": 0 },
          { name: "Ghana", "Amount (USD)": 0 },
          { name: "Kenya", "Amount (USD)": 0 },
          { name: "South Africa", "Amount (USD)": 0 },
        ],
        isDemoData: true,
        demoDataReason: error ? "error" : "no_data",
        demoDataMessage: error ?? "No country analytics data available",
      },
    );
    return charts;
  }

  const { sendingCountries } = data;

  // Aggregate by country (sum across currencies for same country)
  const countryAggregated = sendingCountries.reduce((acc, c) => {
    if (!acc[c.countryName]) {
      acc[c.countryName] = {
        countryCode: c.countryCode,
        countryName: c.countryName,
        transactionCount: 0,
        totalAmountUSD: 0,
        currencyBreakdown: {} as Record<string, { count: number; amountLocal: number }>,
      };
    }
    acc[c.countryName].transactionCount += c.transactionCount;
    acc[c.countryName].totalAmountUSD += c.totalAmountUSD;

    // Track currency breakdown
    if (!acc[c.countryName].currencyBreakdown[c.currency]) {
      acc[c.countryName].currencyBreakdown[c.currency] = { count: 0, amountLocal: 0 };
    }
    acc[c.countryName].currencyBreakdown[c.currency].count += c.transactionCount;
    acc[c.countryName].currencyBreakdown[c.currency].amountLocal += c.totalAmountLocal;

    return acc;
  }, {} as Record<string, { countryCode: string; countryName: string; transactionCount: number; totalAmountUSD: number; currencyBreakdown: Record<string, { count: number; amountLocal: number }> }>);

  const aggregatedArray = Object.values(countryAggregated).sort((a, b) => b.transactionCount - a.transactionCount);

  // Chart 1: Sending Volume by Country (transaction count)
  charts.push({
    id: "sending-volume-by-country",
    title: "Sending Volume by Country",
    subtitle: "Transaction count by sending country",
    description: "Number of transactions initiated from each country. Higher volume indicates more active sender base in that country.",
    type: "bar" as const,
    currencies: [],
    showLegend: false,
    isSnapshot: true,
    showOnlyOnAll: true, // Only show in "All" filter
    data: aggregatedArray.map((c) => ({
      name: c.countryName,
      "Volume": c.transactionCount,
    })),
    isDemoData: false,
  });

  // Chart 2: Sending Amount by Country (USD converted)
  charts.push({
    id: "sending-amount-by-country",
    title: "Sending Amount by Country (USD)",
    subtitle: "Total amount sent by country (converted to USD)",
    description: "Sum of all transaction amounts sent from each country, converted to USD using fixed rates (NGN=1550, KES=153, GHS=15.2, ZAR=18.5).",
    type: "bar" as const,
    currencies: [],
    showLegend: false,
    isSnapshot: true,
    showOnlyOnAll: true, // Only show in "All" filter
    data: aggregatedArray.map((c) => ({
      name: c.countryName,
      "Amount (USD)": Math.round(c.totalAmountUSD),
    })),
    isDemoData: false,
  });

  // Chart 3: Detailed breakdown by country AND currency
  // This shows the local currency amounts for each country
  const detailedData = sendingCountries
    .sort((a, b) => b.transactionCount - a.transactionCount)
    .map((c) => ({
      name: `${c.countryName} (${c.currency})`,
      "Volume": c.transactionCount,
      "Local Amount": Math.round(c.totalAmountLocal),
      "USD Amount": Math.round(c.totalAmountUSD),
    }));

  charts.push({
    id: "sending-by-country-currency",
    title: "Sending by Country & Currency",
    subtitle: "Detailed breakdown showing local currency amounts",
    description: "Transaction volume and amounts broken down by country and currency. Shows both local currency amounts and USD equivalent.",
    type: "stacked-bar" as const,
    currencies: [],
    showLegend: true,
    isSnapshot: true,
    showOnlyOnAll: true, // Only show in "All" filter
    data: detailedData,
    isDemoData: false,
  });

  return charts;
}

// ============================================================================
// Chart Transformation Functions
// ============================================================================

// All possible currency pairs for the 4 supported currencies
const ALL_CURRENCY_PAIRS = [
  "NGN→KES", "NGN→GHS", "NGN→ZAR",
  "KES→NGN", "KES→GHS", "KES→ZAR",
  "GHS→NGN", "GHS→KES", "GHS→ZAR",
  "ZAR→NGN", "ZAR→KES", "ZAR→GHS",
];

function transformToCharts(
  profitData: ProfitAnalyticsApiResponse["data"] | null,
  currencyPairData: CurrencyPairAnalyticsApiResponse["data"] | null,
  walletData: WalletAnalyticsApiResponse["data"] | null,
  errors: { profit?: string; currencyPair?: string; wallet?: string },
): ChartData[] {
  const charts: ChartData[] = [];

  // Helper to check if we have valid data in an array
  const hasValidData = <T>(arr: T[] | undefined | null): arr is T[] => {
    return Array.isArray(arr) && arr.length > 0;
  };

  // ============================================================================
  // SNAPSHOT CHARTS (Current Period Data from API)
  // ============================================================================

  // 1. Currency Revenue by Currency (from profit-analytics byCurrency)
  const supportedProfitData = profitData?.byCurrency?.filter((c) => isSupportedCurrency(c.currency)) ?? [];

  if (hasValidData(supportedProfitData)) {
    charts.push({
      id: "currency-revenue-snapshot",
      title: "Revenue by Currency",
      subtitle: "Current period revenue breakdown",
      description: "Gross revenue, transaction fees, and FX sales for each currency. Data from profit-analytics endpoint.",
      type: "bar" as const,
      currencies: SUPPORTED_CURRENCIES,
      showLegend: true,
      isSnapshot: true,
      data: supportedProfitData.map((c) => ({
        name: c.currency,
        "Gross Revenue": Math.round(c.grossRevenue),
        "Transaction Fees": Math.round(c.totalTransactionFees),
        "FX Sales": Math.round(c.fxSales),
        "Net Profit": Math.round(c.combinedNetProfit),
      })),
      isDemoData: false,
    });

    // Transaction Volume by Currency snapshot
    charts.push({
      id: "volume-by-currency-snapshot",
      title: "Transaction Volume by Currency",
      subtitle: "Total volume and transaction count",
      description: "Total transaction volume and count for each currency. Volume shows monetary value, count shows number of transactions.",
      type: "bar" as const,
      currencies: SUPPORTED_CURRENCIES,
      showLegend: true,
      isSnapshot: true,
      data: supportedProfitData.map((c) => ({
        name: c.currency,
        "Transaction Volume": Math.round(c.totalVolume),
        "Transaction Count": c.transactionCount,
      })),
      isDemoData: false,
    });
  } else {
    // Fallback for profit data - add demo revenue chart
    const currencyProfitChart = (dummyChartsData as ChartData[]).find((c) => c.id === "currency-pair-profit");
    if (currencyProfitChart) {
      charts.push({
        ...currencyProfitChart,
        id: "currency-revenue-snapshot",
        title: "Revenue by Currency",
        isSnapshot: true,
        isDemoData: true,
        demoDataReason: errors.profit ? "error" : "no_data",
        demoDataMessage: errors.profit ?? "No profit data available for supported currencies - showing demo data",
      });
    }
  }

  // 2. Currency Pair Charts (from currency-pair-analytics)
  const supportedPairs = currencyPairData?.pairs?.filter(
    (p) => isSupportedCurrency(p.sourceCurrency) && isSupportedCurrency(p.targetCurrency),
  ) ?? [];

  // Create a map for quick lookup of existing pair data
  const pairDataMap = new Map(supportedPairs.map((p) => [p.pair, p]));

  // Generate ALL currency pairs data (zeros for missing pairs)
  const allPairsData = ALL_CURRENCY_PAIRS.map((pair) => {
    const existingData = pairDataMap.get(pair);
    return existingData ?? {
      pair,
      sourceCurrency: pair.split("→")[0],
      targetCurrency: pair.split("→")[1],
      totalTransactions: 0,
      successfulTransactions: 0,
      failedTransactions: 0,
      pendingTransactions: 0,
      successRate: 0,
      failureRate: 0,
      pendingRate: 0,
      totalVolume: 0,
      totalProfit: 0,
      averageTransactionValue: 0,
    };
  });

  if (currencyPairData?.pairs) {
    // Transaction Status Distribution - aggregate across all pairs
    const totalTx = allPairsData.reduce((sum, p) => sum + p.totalTransactions, 0);
    const successTx = allPairsData.reduce((sum, p) => sum + p.successfulTransactions, 0);
    const failedTx = allPairsData.reduce((sum, p) => sum + p.failedTransactions, 0);
    const pendingTx = allPairsData.reduce((sum, p) => sum + p.pendingTransactions, 0);

    charts.push({
      id: "transaction-status-snapshot",
      title: "Transaction Status Distribution",
      subtitle: "Current period transaction outcomes",
      description: "Success, failure, and pending rates across all currency pair transactions. Data from currency-pair-analytics endpoint.",
      type: "status-bar" as const,
      currencies: [],
      showLegend: false,
      hasStatusLegend: true,
      isSnapshot: true,
      data: [
        {
          name: "All Pairs",
          Success: totalTx > 0 ? Math.round((successTx / totalTx) * 100) : 0,
          Failure: totalTx > 0 ? Math.round((failedTx / totalTx) * 100) : 0,
          Pending: totalTx > 0 ? Math.round((pendingTx / totalTx) * 100) : 0,
        },
      ],
      isDemoData: supportedPairs.length === 0,
      demoDataReason: supportedPairs.length === 0 ? "no_data" : undefined,
      demoDataMessage: supportedPairs.length === 0 ? "No transaction data for supported currency pairs" : undefined,
    });

    // Per-pair status chart - show ALL pairs
    charts.push({
      id: "pair-status-snapshot",
      title: "Currency Pair Success Rates",
      subtitle: "Success vs Failure rates by corridor (all 12 pairs)",
      description: "Transaction success and failure rates for each currency pair corridor. Pairs with 0 transactions have not been used yet.",
      type: "pair-status" as const,
      currencies: [],
      pairs: ALL_CURRENCY_PAIRS,
      showLegend: false,
      hasPairLegend: true,
      hasStatusLegend: true,
      isSnapshot: true,
      data: allPairsData.map((p) => ({
        name: p.pair,
        [`${p.pair}_success`]: p.successRate,
        [`${p.pair}_failure`]: p.failureRate,
        [`${p.pair}_pending`]: p.pendingRate,
      })),
      isDemoData: supportedPairs.length === 0,
      demoDataReason: supportedPairs.length === 0 ? "no_data" : undefined,
      demoDataMessage: supportedPairs.length === 0 ? "No transaction data available - all pairs showing zero" : undefined,
    });

    // Pair volume chart - show ALL pairs
    charts.push({
      id: "pair-volume-snapshot",
      title: "Currency Pair Transaction Volume",
      subtitle: "Transaction count by corridor (all 12 pairs)",
      description: "Number of transactions processed through each currency pair corridor. Zero means no transactions yet for that corridor.",
      type: "pair-bar" as const,
      currencies: [],
      pairs: ALL_CURRENCY_PAIRS,
      showLegend: false,
      hasPairLegend: true,
      isSnapshot: true,
      data: [{
        name: "Current Period",
        ...allPairsData.reduce((acc, p) => ({
          ...acc,
          [p.pair]: p.totalTransactions,
        }), {}),
      }],
      isDemoData: supportedPairs.length === 0,
      demoDataReason: supportedPairs.length === 0 ? "no_data" : undefined,
      demoDataMessage: supportedPairs.length === 0 ? "No transaction data available - all pairs showing zero" : undefined,
    });
  } else {
    // Fallback for currency pair data
    const transactionStatusChart = (dummyChartsData as ChartData[]).find((c) => c.id === "transaction-status");
    if (transactionStatusChart) {
      charts.push({
        ...transactionStatusChart,
        id: "transaction-status-snapshot",
        isSnapshot: true,
        isDemoData: true,
        demoDataReason: errors.currencyPair ? "error" : "not_configured",
        demoDataMessage: errors.currencyPair ?? "Currency pair analytics API not available - showing demo data",
      });
    }

    // Add fallback pair charts
    const pairVolumeChart = (dummyChartsData as ChartData[]).find((c) => c.id === "pair-transaction-volume");
    if (pairVolumeChart) {
      charts.push({
        ...pairVolumeChart,
        id: "pair-volume-snapshot",
        title: "Currency Pair Transaction Volume",
        isSnapshot: true,
        isDemoData: true,
        demoDataReason: errors.currencyPair ? "error" : "not_configured",
        demoDataMessage: errors.currencyPair ?? "Currency pair analytics API not available - showing demo data",
      });
    }
  }

  // 3. Wallet Distribution from Wallet Analytics
  const supportedWalletData = walletData?.byCurrency?.filter((w) => isSupportedCurrency(w.currency)) ?? [];

  if (hasValidData(supportedWalletData)) {
    charts.push({
      id: "wallet-distribution-snapshot",
      title: "Wallet Distribution by Currency",
      subtitle: "Active vs Inactive wallets",
      description: "Current wallet distribution showing active and inactive wallets for each supported currency. Data from wallet-analytics endpoint.",
      type: "bar" as const,
      currencies: SUPPORTED_CURRENCIES,
      showLegend: true,
      isSnapshot: true,
      data: supportedWalletData.map((w) => ({
        name: w.currency,
        "Active Wallets": w.activeWallets,
        "Inactive Wallets": w.inactiveWallets,
        "Total Wallets": w.totalWallets,
      })),
      isDemoData: false,
    });

    // Balance distribution
    charts.push({
      id: "balance-distribution-snapshot",
      title: "Balance Distribution by Currency",
      subtitle: "Total and average balances",
      description: "Total balance held in wallets for each currency. Shows the liquidity distribution across the platform.",
      type: "bar" as const,
      currencies: SUPPORTED_CURRENCIES,
      showLegend: true,
      isSnapshot: true,
      data: supportedWalletData.map((w) => ({
        name: w.currency,
        "Total Balance": Math.round(w.totalBalance),
        "Avg Balance": Math.round(w.averageBalance),
      })),
      isDemoData: false,
    });
  } else {
    // Fallback for wallet data
    const walletActivityChart = (dummyChartsData as ChartData[]).find((c) => c.id === "wallet-activity");
    if (walletActivityChart) {
      charts.push({
        ...walletActivityChart,
        id: "wallet-distribution-snapshot",
        title: "Wallet Distribution by Currency",
        isSnapshot: true,
        isDemoData: true,
        demoDataReason: errors.wallet ? "error" : (walletData ? "no_data" : "not_configured"),
        demoDataMessage: errors.wallet ?? (walletData ? "No wallet data for supported currencies" : "Wallet analytics API not available - showing demo data"),
      });
    }
  }

  // ============================================================================
  // HISTORICAL/TIME-SERIES CHARTS (Demo Data - API doesn't provide historical yet)
  // ============================================================================

  // Transaction Volume Trend (Historical) - Demo Data
  const volumeTrendChart = (dummyChartsData as ChartData[]).find((c) => c.id === "transaction-volume-trend");
  if (volumeTrendChart) {
    charts.push({
      ...volumeTrendChart,
      id: "transaction-volume-trend-historical",
      title: "Transaction Volume Trend (Historical)",
      subtitle: "Monthly transaction count by currency - Time filtering enabled",
      isSnapshot: false,
      isDemoData: true,
      demoDataReason: "not_configured",
      demoDataMessage: "Historical time-series data not available from API - showing sample trend data. Use time frame selector to view different periods.",
    });
  }

  // Revenue Trend (Historical) - Demo Data
  const revenueChart = (dummyChartsData as ChartData[]).find((c) => c.id === "revenue-breakdown");
  if (revenueChart) {
    charts.push({
      ...revenueChart,
      id: "revenue-trend-historical",
      title: "Revenue Trend (Historical)",
      subtitle: "Monthly revenue breakdown - Time filtering enabled",
      isSnapshot: false,
      isDemoData: true,
      demoDataReason: "not_configured",
      demoDataMessage: "Historical revenue data not available from API - showing sample trend data. Use time frame selector to view different periods.",
    });
  }

  // Wallet Activity Trend (Historical) - Demo Data
  const walletTrendChart = (dummyChartsData as ChartData[]).find((c) => c.id === "wallet-activity");
  if (walletTrendChart && hasValidData(supportedWalletData)) {
    // Only add if we have real snapshot data - to show comparison
    charts.push({
      ...walletTrendChart,
      id: "wallet-activity-trend-historical",
      title: "Wallet Activity Trend (Historical)",
      subtitle: "Monthly active wallets by currency - Time filtering enabled",
      isSnapshot: false,
      isDemoData: true,
      demoDataReason: "not_configured",
      demoDataMessage: "Historical wallet activity data not available from API - showing sample trend data. Use time frame selector to view different periods.",
    });
  }

  // Currency Pair Success/Failure Trend (Historical) - Demo Data
  const pairSuccessChart = (dummyChartsData as ChartData[]).find((c) => c.id === "pair-success-failure");
  if (pairSuccessChart) {
    charts.push({
      ...pairSuccessChart,
      id: "pair-success-trend-historical",
      title: "Currency Pair Success Trend (Historical)",
      subtitle: "Monthly success rates by corridor - Time filtering enabled",
      isSnapshot: false,
      isDemoData: true,
      demoDataReason: "not_configured",
      demoDataMessage: "Historical pair success data not available from API - showing sample trend data. Use time frame selector to view different periods.",
    });
  }

  // Currency Pair Volume Trend (Historical) - Demo Data
  const pairVolumeTrendChart = (dummyChartsData as ChartData[]).find((c) => c.id === "pair-transaction-volume");
  if (pairVolumeTrendChart) {
    charts.push({
      ...pairVolumeTrendChart,
      id: "pair-volume-trend-historical",
      title: "Currency Pair Volume Trend (Historical)",
      subtitle: "Monthly transaction volume by corridor - Time filtering enabled",
      isSnapshot: false,
      isDemoData: true,
      demoDataReason: "not_configured",
      demoDataMessage: "Historical pair volume data not available from API - showing sample trend data. Use time frame selector to view different periods.",
    });
  }

  return charts;
}

// ============================================================================
// Monthly Profit Transformation (Time-Series Charts)
// ============================================================================

function transformMonthlyProfitToCharts(
  data: MonthlyProfitAnalyticsApiResponse["data"] | null,
  error?: string,
): ChartData[] {
  const charts: ChartData[] = [];

  if (!data || data.monthly.length === 0) {
    // Return demo charts for time-series
    const volumeTrendChart = (dummyChartsData as ChartData[]).find((c) => c.id === "transaction-volume-trend");
    if (volumeTrendChart) {
      charts.push({
        ...volumeTrendChart,
        id: "transaction-volume-trend-historical",
        title: "Transaction Volume Trend",
        subtitle: "Monthly transaction count by currency",
        isSnapshot: false,
        isDemoData: true,
        demoDataReason: error ? "error" : "no_data",
        demoDataMessage: error ?? "No monthly profit data available - showing demo data",
      });
    }
    const revenueChart = (dummyChartsData as ChartData[]).find((c) => c.id === "revenue-breakdown");
    if (revenueChart) {
      charts.push({
        ...revenueChart,
        id: "revenue-trend-historical",
        title: "Revenue Trend",
        subtitle: "Monthly revenue breakdown",
        isSnapshot: false,
        isDemoData: true,
        demoDataReason: error ? "error" : "no_data",
        demoDataMessage: error ?? "No monthly profit data available - showing demo data",
      });
    }
    return charts;
  }

  const { monthly } = data;

  // Transaction Volume Trend - Monthly transaction count by currency
  charts.push({
    id: "transaction-volume-trend-historical",
    title: "Transaction Volume Trend",
    subtitle: "Monthly transaction count by currency",
    description: "Number of successful transactions per month, broken down by currency. Data from profit-analytics/monthly endpoint.",
    type: "area" as const,
    currencies: SUPPORTED_CURRENCIES,
    showLegend: true,
    isSnapshot: false,
    data: monthly.map((m) => {
      const dataPoint: ChartDataItem = { name: m.monthLabel };
      // Add data for each currency
      SUPPORTED_CURRENCIES.forEach((currency) => {
        const currencyData = m.byCurrency.find((c) => c.currency === currency);
        dataPoint[currency] = currencyData?.transactionCount ?? 0;
      });
      return dataPoint;
    }),
    isDemoData: false,
  });

  // Revenue Trend - Monthly revenue breakdown
  charts.push({
    id: "revenue-trend-historical",
    title: "Revenue Trend",
    subtitle: "Monthly revenue breakdown (USD)",
    description: "Monthly revenue from transaction fees and FX sales across all currencies, converted to USD.",
    type: "stacked-bar" as const,
    currencies: [],
    showLegend: true,
    isSnapshot: false,
    data: monthly.map((m) => ({
      name: m.monthLabel,
      "Transaction Fees": Math.round(m.summary.totalTransactionFees / USD_EXCHANGE_RATES.NGN), // Convert to rough USD
      "FX Sales": Math.round(m.summary.totalFxSales / USD_EXCHANGE_RATES.NGN),
      "Net Profit": Math.round(m.summary.totalCombinedNetProfit / USD_EXCHANGE_RATES.NGN),
    })),
    isDemoData: false,
  });

  // Net Profit Trend - Monthly net profit by currency
  charts.push({
    id: "net-profit-trend-historical",
    title: "Net Profit Trend",
    subtitle: "Monthly combined net profit by currency",
    description: "Combined net profit (transaction fees + FX sales) per month, shown in local currency.",
    type: "line" as const,
    currencies: SUPPORTED_CURRENCIES,
    showLegend: true,
    isSnapshot: false,
    data: monthly.map((m) => {
      const dataPoint: ChartDataItem = { name: m.monthLabel };
      SUPPORTED_CURRENCIES.forEach((currency) => {
        const currencyData = m.byCurrency.find((c) => c.currency === currency);
        dataPoint[currency] = currencyData?.combinedNetProfit ?? 0;
      });
      return dataPoint;
    }),
    isDemoData: false,
  });

  // Volume Amount Trend - Monthly transaction volume by currency
  charts.push({
    id: "volume-amount-trend-historical",
    title: "Transaction Volume Amount Trend",
    subtitle: "Monthly total volume by currency",
    description: "Total transaction amounts per month in local currencies.",
    type: "area" as const,
    currencies: SUPPORTED_CURRENCIES,
    showLegend: true,
    isSnapshot: false,
    data: monthly.map((m) => {
      const dataPoint: ChartDataItem = { name: m.monthLabel };
      SUPPORTED_CURRENCIES.forEach((currency) => {
        const currencyData = m.byCurrency.find((c) => c.currency === currency);
        dataPoint[currency] = Math.round(currencyData?.totalVolume ?? 0);
      });
      return dataPoint;
    }),
    isDemoData: false,
  });

  return charts;
}

// ============================================================================
// Main Fetch Function
// ============================================================================

/**
 * Fetches analytics data for the metrics dashboard.
 * Fetches from all 6 API endpoints in parallel and transforms the data.
 * Falls back to dummy data for any endpoint that fails.
 */
export async function fetchAnalyticsData(): Promise<AnalyticsResponse | ApiError> {
  try {
    const accessToken = await getValueFromCookie("accessToken");

    if (!accessToken) {
      return {
        success: false,
        message: "No access token found",
        unauthorized: true,
      };
    }

    // Fetch all endpoints in parallel (including new monthly and country analytics)
    const [profitResult, currencyPairResult, walletResult, customerResult, monthlyProfitResult, countryResult] = await Promise.all([
      fetchWithAuth<ProfitAnalyticsApiResponse["data"]>("/api/admin/dashboard/profit-analytics", accessToken),
      fetchWithAuth<CurrencyPairAnalyticsApiResponse["data"]>(
        "/api/admin/dashboard/currency-pair-analytics",
        accessToken,
      ),
      fetchWithAuth<WalletAnalyticsApiResponse["data"]>("/api/admin/dashboard/wallet-analytics", accessToken),
      fetchWithAuth<CustomerAnalyticsApiResponse["data"]>("/api/admin/dashboard/customer-analytics", accessToken),
      fetchWithAuth<MonthlyProfitAnalyticsApiResponse["data"]>("/api/admin/dashboard/profit-analytics/monthly", accessToken),
      fetchWithAuth<CountryAnalyticsApiResponse["data"]>("/api/admin/dashboard/country-analytics", accessToken),
    ]);

    // Collect errors for documentation
    const apiErrors: Array<{ endpoint: string; error: string }> = [];

    if (!profitResult.success && profitResult.error) {
      apiErrors.push({ endpoint: profitResult.endpoint, error: profitResult.error });
    }
    if (!currencyPairResult.success && currencyPairResult.error) {
      apiErrors.push({ endpoint: currencyPairResult.endpoint, error: currencyPairResult.error });
    }
    if (!walletResult.success && walletResult.error) {
      apiErrors.push({ endpoint: walletResult.endpoint, error: walletResult.error });
    }
    if (!customerResult.success && customerResult.error) {
      apiErrors.push({ endpoint: customerResult.endpoint, error: customerResult.error });
    }
    if (!monthlyProfitResult.success && monthlyProfitResult.error) {
      apiErrors.push({ endpoint: monthlyProfitResult.endpoint, error: monthlyProfitResult.error });
    }
    if (!countryResult.success && countryResult.error) {
      apiErrors.push({ endpoint: countryResult.endpoint, error: countryResult.error });
    }

    // Log errors for debugging
    if (apiErrors.length > 0) {
      console.warn("Analytics API Errors:", apiErrors);
    }

    // Transform data to cards (with fallback to dummy data)
    const profitCards = transformProfitAnalyticsToCards(
      profitResult.success ? (profitResult.data ?? null) : null,
      profitResult.error,
    );
    const currencyPairCards = transformCurrencyPairAnalyticsToCards(
      currencyPairResult.success ? (currencyPairResult.data ?? null) : null,
      currencyPairResult.error,
    );
    const walletCards = transformWalletAnalyticsToCards(
      walletResult.success ? (walletResult.data ?? null) : null,
      walletResult.error,
    );
    const customerCards = transformCustomerAnalyticsToCards(
      customerResult.success ? (customerResult.data ?? null) : null,
      customerResult.error,
    );
    const countryCards = transformCountryAnalyticsToCards(
      countryResult.success ? (countryResult.data ?? null) : null,
      countryResult.error,
    );

    // Combine all metric cards
    const metricCards: MetricCardData[] = [
      ...profitCards,
      ...customerCards,
      ...countryCards, // Add country cards to the overview section
      ...currencyPairCards,
      ...walletCards,
    ];

    // Transform to charts - includes snapshot charts
    const snapshotCharts = transformToCharts(
      profitResult.success ? (profitResult.data ?? null) : null,
      currencyPairResult.success ? (currencyPairResult.data ?? null) : null,
      walletResult.success ? (walletResult.data ?? null) : null,
      {
        profit: profitResult.error,
        currencyPair: currencyPairResult.error,
        wallet: walletResult.error,
      },
    );

    // Add monthly profit time-series charts
    const monthlyCharts = transformMonthlyProfitToCharts(
      monthlyProfitResult.success ? (monthlyProfitResult.data ?? null) : null,
      monthlyProfitResult.error,
    );

    // Add country analytics charts
    const countryCharts = transformCountryAnalyticsToCharts(
      countryResult.success ? (countryResult.data ?? null) : null,
      countryResult.error,
    );

    // Filter out old historical placeholder charts and combine with real data
    const filteredSnapshotCharts = snapshotCharts.filter(
      (chart) => !chart.id.endsWith("-historical") || chart.isDemoData === false,
    );

    const charts = [...filteredSnapshotCharts, ...monthlyCharts, ...countryCharts];

    return {
      status: true,
      message:
        apiErrors.length > 0
          ? `Analytics data fetched with ${apiErrors.length} endpoint error(s)`
          : "Analytics data fetched successfully",
      data: {
        metricCards,
        charts,
      },
      apiErrors: apiErrors.length > 0 ? apiErrors : undefined,
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);

    // Return full dummy data on complete failure
    return {
      status: true,
      message: "Using demo data due to connection error",
      data: {
        metricCards: (dummyMetricCardsData as MetricCardData[]).map((card) => ({
          ...card,
          isDemoData: true,
          demoDataReason: "error" as DemoDataReason,
          demoDataMessage: error instanceof Error ? error.message : "Connection error",
        })),
        charts: (dummyChartsData as ChartData[]).map((chart) => ({
          ...chart,
          isDemoData: true,
          demoDataReason: "error" as DemoDataReason,
          demoDataMessage: error instanceof Error ? error.message : "Connection error",
        })),
      },
      apiErrors: [{ endpoint: "all", error: error instanceof Error ? error.message : "Unknown error" }],
    };
  }
}

/**
 * Fetches analytics data for a specific time range.
 */
export async function fetchAnalyticsDataByTimeRange(
  _timeRange: "weekly" | "monthly" | "quarterly" | "yearly",
): Promise<AnalyticsResponse | ApiError> {
  // For now, just call the main function
  // TODO: Add date range parameters to API calls
  return fetchAnalyticsData();
}

/**
 * Fetches currency pair specific analytics.
 */
export async function fetchCurrencyPairAnalytics(
  _sourceCurrency?: string,
  _targetCurrency?: string,
): Promise<AnalyticsResponse | ApiError> {
  // For now, just call the main function
  // TODO: Add currency pair filtering to API calls
  return fetchAnalyticsData();
}
