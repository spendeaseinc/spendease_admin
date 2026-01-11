/* eslint-disable prettier/prettier */
"use client";

import {
  Calendar,
  CheckCircle2,
  Globe,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CustomerStats } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CustomerStatsCardsProps {
  stats: CustomerStats;
}

// Format currency with the actual currency code
const formatCurrencyValue = (val: number, currency: string) => {
  if (val >= 1000000) {
    return `${currency} ${(val / 1000000).toFixed(2)}M`;
  }
  if (val >= 1000) {
    return `${currency} ${(val / 1000).toFixed(1)}K`;
  }
  return `${currency} ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// Parse frequency value from string like "4.5 per month"
const parseFrequencyValue = (frequency: string): string => {
  const match = frequency.match(/^([\d.]+)/);
  return match ? match[1] : "0";
};

export function CustomerStatsCards({ stats }: CustomerStatsCardsProps) {
  const currency = stats.primaryCurrency || "NGN";
  const frequencyValue = parseFrequencyValue(stats.transactionFrequency);

  const statCards = [
    {
      key: "totalTransactionVolume",
      label: "Total Volume",
      icon: Wallet,
      value: formatCurrencyValue(stats.totalTransactionVolume, currency),
      subtitle: `From ${stats.totalTransactions} transactions`,
      colorClass: "text-green-600 dark:text-green-400",
      bgClass: "bg-green-500/10",
    },
    {
      key: "averageTransactionValue",
      label: "Avg. Transaction",
      icon: TrendingUp,
      value: formatCurrencyValue(stats.averageTransactionValue, currency),
      subtitle: "Per transaction",
      colorClass: "text-purple-600 dark:text-purple-400",
      bgClass: "bg-purple-500/10",
    },
    {
      key: "successRate",
      label: "Success Rate",
      icon: CheckCircle2,
      value: `${stats.successRate.toFixed(1)}%`,
      subtitle: `${stats.totalTransactions} total transactions`,
      colorClass: "text-emerald-600 dark:text-emerald-400",
      bgClass: "bg-emerald-500/10",
    },
    {
      key: "transactionFrequency",
      label: "Activity Rate",
      icon: Calendar,
      value: frequencyValue,
      subtitle: "transactions/month",
      colorClass: "text-amber-600 dark:text-amber-400",
      bgClass: "bg-amber-500/10",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {statCards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
              <div className={cn("rounded-full p-2", card.bgClass)}>
                <Icon className={cn("h-4 w-4", card.colorClass)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              {card.subtitle && (
                <p className="text-muted-foreground text-xs">{card.subtitle}</p>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Base Country Card */}
      {stats.baseCountry && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Base Country</CardTitle>
            <div className={cn("rounded-full p-2", "bg-rose-500/10")}>
              <Globe className={cn("h-4 w-4", "text-rose-600 dark:text-rose-400")} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {stats.countryCode && (
                <span className="text-lg">{getFlagEmoji(stats.countryCode)}</span>
              )}
              <span className="text-2xl font-bold">{stats.baseCountry}</span>
            </div>
            <p className="text-muted-foreground text-xs">
              Primary: {currency}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper to convert country code to flag emoji
function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

