/* eslint-disable security/detect-object-injection */
/* eslint-disable prettier/prettier */
import type { CustomerStats } from "@/lib/types";

interface CalculateStatsOptions {
  /** The transactions array from the current page (used for volume/success rate calculation) */
  transactions: Array<{ amount: string; status: string; currency?: string }>;
  /** Total number of transactions from pagination (paging.total_items) */
  totalTransactionsCount: number;
  /** Number of bank accounts/beneficiaries */
  beneficiariesCount: number;
  /** Customer's account created date */
  customerCreatedAt: string;
  /** Customer's base country */
  country?: string;
  /** Country code for flag display */
  countryCode?: string;
  /** Primary currency for display (e.g., most common currency in transactions) */
  primaryCurrency?: string;
}

// Helper function to calculate customer stats from transactions
// This can be used both server-side and client-side
export function calculateCustomerStats(options: CalculateStatsOptions): CustomerStats {
  const {
    transactions,
    totalTransactionsCount,
    beneficiariesCount,
    customerCreatedAt,
    country,
    countryCode,
    primaryCurrency,
  } = options;

  // Use total count from pagination, not array length
  const totalTransactions = totalTransactionsCount;
  const transactionsInPage = transactions.length;

  if (totalTransactions === 0 || transactionsInPage === 0) {
    return {
      totalTransactions: 0,
      totalTransactionVolume: 0,
      averageTransactionValue: 0,
      successRate: 0,
      transactionFrequency: "0 per month",
      totalBeneficiaries: beneficiariesCount,
      baseCountry: country ?? "Unknown",
      countryCode: countryCode ?? "",
      primaryCurrency: primaryCurrency ?? "NGN",
    };
  }

  // Calculate success rate from current page transactions
  const successfulTransactions = transactions.filter(
    (t) => t.status === "success" || t.status === "completed"
  );

  // Calculate volume from current page (this is a sample - ideally would be from all data)
  const totalVolumeInPage = transactions.reduce(
    (sum, t) => sum + parseFloat(t.amount || "0"),
    0
  );

  // Estimate total volume based on page sample and total count
  // This is an approximation since we only have the first page
  const avgTransactionInPage = totalVolumeInPage / transactionsInPage;
  const estimatedTotalVolume = avgTransactionInPage * totalTransactions;

  // Success rate from the sample we have
  const successRate = (successfulTransactions.length / transactionsInPage) * 100;

  // Calculate transaction frequency based on total transactions
  const createdDate = new Date(customerCreatedAt);
  const now = new Date();
  const monthsSinceJoined = Math.max(
    1,
    (now.getFullYear() - createdDate.getFullYear()) * 12 +
      (now.getMonth() - createdDate.getMonth())
  );
  const txPerMonth = totalTransactions / monthsSinceJoined;
  const transactionFrequency =
    txPerMonth >= 1
      ? `${txPerMonth.toFixed(1)} per month`
      : `${(txPerMonth * 30).toFixed(1)} per day`;

  // Detect primary currency from transactions if not provided
  const detectedCurrency = primaryCurrency ?? detectPrimaryCurrency(transactions);

  return {
    totalTransactions,
    totalTransactionVolume: estimatedTotalVolume,
    averageTransactionValue: avgTransactionInPage,
    successRate,
    transactionFrequency,
    totalBeneficiaries: beneficiariesCount,
    baseCountry: country ?? "Unknown",
    countryCode: countryCode ?? "",
    primaryCurrency: detectedCurrency,
  };
}

// Helper to detect the most common currency in transactions
function detectPrimaryCurrency(
  transactions: Array<{ currency?: string }>
): string {
  if (transactions.length === 0) return "NGN";

  const currencyCounts: Record<string, number> = {};
  for (const t of transactions) {
    const currency = t.currency ?? "NGN";
    currencyCounts[currency] = (currencyCounts[currency] || 0) + 1;
  }

  let maxCount = 0;
  let primaryCurrency = "NGN";
  for (const [currency, count] of Object.entries(currencyCounts)) {
    if (count > maxCount) {
      maxCount = count;
      primaryCurrency = currency;
    }
  }

  return primaryCurrency;
}
