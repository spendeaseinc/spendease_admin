/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable security/detect-object-injection */
/* eslint-disable complexity */
import type {
  CurrencyPairStats,
  TransactionStatusBreakdown,
  TransactionSwap,
  TransactionTypeBreakdown,
  WalletTransaction,
} from "@/lib/types";

// Color mappings for status
export const STATUS_COLORS: Record<string, string> = {
  success: "#22c55e", // green
  completed: "#22c55e",
  pending: "#f59e0b", // amber
  processing: "#3b82f6", // blue
  failed: "#ef4444", // red
  underpaid: "#f97316", // orange
  overpaid: "#8b5cf6", // violet
  expired: "#6b7280", // gray
};

// Color mappings for transaction types
export const TYPE_COLORS: Record<string, string> = {
  "transaction-swap": "#8b5cf6", // violet
  "pay-in": "#22c55e", // green
  "pay-out": "#ef4444", // red
  "internal-transfer": "#3b82f6", // blue
  "currency-swap": "#f59e0b", // amber
  deposit: "#10b981", // emerald
  withdrawal: "#f43f5e", // rose
  fee: "#6b7280", // gray
  refund: "#06b6d4", // cyan
  adjustment: "#84cc16", // lime
};

// Currency pair colors
export const PAIR_COLORS = [
  "#8b5cf6", // violet
  "#3b82f6", // blue
  "#22c55e", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
];

export function calculateStatusBreakdown(transactions: WalletTransaction[]): TransactionStatusBreakdown[] {
  const statusCounts: Record<string, number> = {};
  transactions.forEach((tx) => {
    const status = tx.status.toLowerCase();
    const currentCount = statusCounts[status];
    statusCounts[status] = currentCount ? currentCount + 1 : 1;
  });
  const total = transactions.length;

  return Object.entries(statusCounts)
    .map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
      fill: STATUS_COLORS[status] || "#6b7280",
    }))
    .sort((a, b) => b.count - a.count);
}

export function calculateTypeBreakdown(transactions: WalletTransaction[]): TransactionTypeBreakdown[] {
  const typeCounts: Record<string, number> = {};

  transactions.forEach((tx) => {
    const type = tx.type.toLowerCase();
    const currentCount = typeCounts[type];
    typeCounts[type] = currentCount ? currentCount + 1 : 1;
  });

  const total = transactions.length;

  return Object.entries(typeCounts)
    .map(([type, count]) => ({
      type: type
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
      fill: TYPE_COLORS[type] || "#6b7280",
    }))
    .sort((a, b) => b.count - a.count);
}

export function calculateCurrencyPairs(swaps: TransactionSwap[]): CurrencyPairStats[] {
  const pairCounts: Record<string, { count: number; volume: number; from: string; to: string }> = {};

  swaps.forEach((swap) => {
    const fromCurrency = swap.meta?.from_currency ?? swap.meta?.source_currency ?? swap.currency;
    const toCurrency = swap.meta?.to_currency ?? swap.meta?.target_currency ?? "NGN";
    const pair = `${fromCurrency}/${toCurrency}`;

    const existing = pairCounts[pair];
    if (existing) {
      existing.count += 1;
      existing.volume += swap.deposit_amount || 0;
    } else {
      pairCounts[pair] = { count: 1, volume: swap.deposit_amount || 0, from: fromCurrency, to: toCurrency };
    }
  });

  const total = swaps.length;

  return Object.entries(pairCounts)
    .map(([pair, data]) => ({
      pair,
      fromCurrency: data.from,
      toCurrency: data.to,
      count: data.count,
      volume: data.volume,
      percentage: total > 0 ? (data.count / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6); // Top 6 pairs
}
