/* eslint-disable security/detect-object-injection */
"use client";

import { useMemo } from "react";

import type { WalletTransaction } from "@/lib/types";

// Currency pair colors
const PAIR_COLORS = [
  "#8b5cf6", // violet
  "#3b82f6", // blue
  "#22c55e", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
];

interface CurrencyVolumeChartProps {
  transactions: WalletTransaction[];
}

export function CurrencyVolumeChart({ transactions }: CurrencyVolumeChartProps) {
  const volumeByCurrency = useMemo(() => {
    const volumes: Record<string, number> = {};

    transactions.forEach((tx) => {
      const currency = tx.currency;
      const amount = parseFloat(tx.amount || "0");
      volumes[currency] = (volumes[currency] || 0) + amount;
    });

    return Object.entries(volumes)
      .map(([currency, volume], index) => ({
        currency,
        volume,
        fill: PAIR_COLORS[index % PAIR_COLORS.length],
      }))
      .sort((a, b) => b.volume - a.volume);
  }, [transactions]);

  if (volumeByCurrency.length === 0) {
    return (
      <div className="text-muted-foreground flex h-[200px] items-center justify-center text-sm">
        No volume data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {volumeByCurrency.map((item) => {
        const maxVolume = Math.max(...volumeByCurrency.map((v) => v.volume));
        const percentage = (item.volume / maxVolume) * 100;

        return (
          <div key={item.currency} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{item.currency}</span>
              <span className="text-muted-foreground">
                {item.volume.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="bg-muted h-2 overflow-hidden rounded-full">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: item.fill,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
