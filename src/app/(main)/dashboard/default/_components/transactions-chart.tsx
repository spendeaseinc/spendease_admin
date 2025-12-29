"use client";

import { Circle } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  count: {
    label: "Transaction Count",
    color: "#FD6F01",
  },
} satisfies ChartConfig;

interface TransactionsChartProps {
  data: Array<{
    month: string;
    count: number;
  }>;
}

export function TransactionsChart({ data }: TransactionsChartProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Transaction Trend</CardTitle>
        <CardDescription>
          <span className="flex flex-row items-center gap-2">
            <Circle className="h-2 w-2 rounded-full bg-[#FD6F01] text-[#FD6F01]" />
            Total Transactions
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[200px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillcount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area dataKey="count" type="natural" fill="url(#fillcount)" stroke="var(--color-count)" stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
