"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  transactions: {
    label: "Transactions",
    color: "#FD6F01",
  },
} as ChartConfig;

interface TransactionOverviewProps {
  title: string;
  subtitle: string;
  data: Array<{
    month: string;
    count: number;
  }>;
}

export function TransactionOverview({ title, subtitle, data }: TransactionOverviewProps) {
  const chartData = data.map((item) => ({
    month: item.month,
    transactions: item.count,
  }));

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="max-h-96 w-full" config={chartConfig}>
          <BarChart margin={{ left: 0, right: 20, top: 25, bottom: 25 }} accessibilityLayer data={chartData}>
            <CartesianGrid vertical />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value >= 1000 ? value / 1000 + "k" : value}`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="transactions" stackId="a" fill={chartConfig.transactions.color} radius={5} barSize={60} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
