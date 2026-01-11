/* eslint-disable prettier/prettier */
"use client";

import { useMemo } from "react";

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type {
  CurrencyPairStats,
  TransactionSwap,
  WalletTransaction,
} from "@/lib/types";

import {
  calculateCurrencyPairs,
  calculateStatusBreakdown,
  calculateTypeBreakdown,
  PAIR_COLORS,
} from "./analytics-utils";
import { CurrencyVolumeChart } from "./currency-volume-chart";

interface AnalyticsTabProps {
  transactions: WalletTransaction[];
  swaps: TransactionSwap[];
}

export function AnalyticsTab({ transactions, swaps }: AnalyticsTabProps) {
  const statusBreakdown = useMemo(
    () => calculateStatusBreakdown(transactions),
    [transactions]
  );

  const typeBreakdown = useMemo(
    () => calculateTypeBreakdown(transactions),
    [transactions]
  );

  const currencyPairs = useMemo(
    () => calculateCurrencyPairs(swaps),
    [swaps]
  );

  const hasTransactionData = transactions.length > 0;
  const hasSwapData = swaps.length > 0;

  if (!hasTransactionData && !hasSwapData) {
    return (
      <Card>
        <CardContent className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">No analytics data available for this customer</p>
        </CardContent>
      </Card>
    );
  }

  // Chart configs
  const statusChartConfig = statusBreakdown.reduce(
    (acc, item) => {
      acc[item.status.toLowerCase()] = {
        label: item.status,
        color: item.fill,
      };
      return acc;
    },
    {} as Record<string, { label: string; color: string }>
  );

  const typeChartConfig = typeBreakdown.reduce(
    (acc, item) => {
      acc[item.type.toLowerCase().replace(/\s+/g, "-")] = {
        label: item.type,
        color: item.fill,
      };
      return acc;
    },
    {} as Record<string, { label: string; color: string }>
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Transaction Status Breakdown */}
      {hasTransactionData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Transaction Status</CardTitle>
            <CardDescription>
              Distribution of transaction statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={statusChartConfig} className="mx-auto aspect-square max-h-[300px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={statusBreakdown as unknown as Array<Record<string, unknown>>}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {statusBreakdown.map((entry) => (
                    <Cell key={`status-${entry.status}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            {/* Legend */}
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {statusBreakdown.map((item) => (
                <div key={item.status} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-sm">
                    {item.status}: {item.count} ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction Type Breakdown */}
      {hasTransactionData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Transaction Types</CardTitle>
            <CardDescription>
              Breakdown by transaction type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={typeChartConfig} className="mx-auto aspect-square max-h-[300px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={typeBreakdown as unknown as Array<Record<string, unknown>>}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {typeBreakdown.map((entry) => (
                    <Cell key={`type-${entry.type}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            {/* Legend */}
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {typeBreakdown.slice(0, 5).map((item) => (
                <div key={item.type} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-sm">
                    {item.type}: {item.count}
                  </span>
                </div>
              ))}
              {typeBreakdown.length > 5 && (
                <span className="text-muted-foreground text-sm">
                  +{typeBreakdown.length - 5} more
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Currency Pairs Chart */}
      {hasSwapData && currencyPairs.length > 0 && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Currency Corridors</CardTitle>
            <CardDescription>
              Most used currency pairs for transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "Transactions", color: "#8b5cf6" },
              }}
              className="h-[300px]"
            >
              <BarChart
                data={currencyPairs}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
              >
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="pair"
                  tick={{ fontSize: 12 }}
                  width={80}
                />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (!active || payload.length === 0) {
                      return null;
                    }
                    const data = payload[0]?.payload as CurrencyPairStats | undefined;
                    if (!data) {
                      return null;
                    }
                    return (
                      <div className="bg-background border-border rounded-lg border p-3 shadow-lg">
                        <p className="font-semibold">{data.pair}</p>
                        <p className="text-muted-foreground text-sm">
                          {data.count} transactions ({data.percentage.toFixed(1)}%)
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Volume: {data.fromCurrency} {data.volume.toLocaleString()}
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {currencyPairs.map((pair, index) => (
                    <Cell
                      key={`pair-${pair.pair}`}
                      fill={PAIR_COLORS[index % PAIR_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Volume by Currency */}
      {hasTransactionData && (
        <Card className={hasSwapData ? "" : "md:col-span-2"}>
          <CardHeader>
            <CardTitle className="text-base">Volume by Currency</CardTitle>
            <CardDescription>
              Transaction volume breakdown by currency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyVolumeChart transactions={transactions} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
