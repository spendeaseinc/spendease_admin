"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { month: "Jan", transactions: 4300 },
  { month: "Feb", transactions: 5700 },
  { month: "Mar", transactions: 12500 },
  { month: "Apr", transactions: 9500 },
  { month: "May", transactions: 9500 },
  { month: "Jun", transactions: 3400 },
  { month: "Jul", transactions: 900 },
  { month: "Aug", transactions: 6700 },
  { month: "Sep", transactions: 5000 },
  { month: "Oct", transactions: 9500 },
  { month: "Nov", transactions: 7500 },
  { month: "Dec", transactions: 200 },
];

const chartConfig = {
  transactions: {
    label: "Transactions",
    color: "#FD6F01",
  },
} as ChartConfig;

export function TransactionOverview() {
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Transaction Overview</CardTitle>
        <CardDescription>Track your user&apos;s transactions at a glance.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="max-h-96 w-full" config={chartConfig}>
          <BarChart margin={{ left: 0, right: 20, top: 25, bottom: 25 }} accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value >= 1000 ? value / 1000 + "k" : value}`}
              domain={[0, 15000]}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="transactions" stackId="a" fill={chartConfig.transactions.color} radius={5} barSize={60} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
