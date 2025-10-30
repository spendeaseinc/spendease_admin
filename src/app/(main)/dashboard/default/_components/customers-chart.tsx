"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function CustomersChart() {
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>New Customers</CardTitle>
        <CardTitle className="text-2xl font-semibold tabular-nums @[200px]/card:text-3xl">
          +2350 <span className="text-muted-foreground text-sm font-normal">+180.1% from last month</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[250px] w-full" config={chartConfig}>
          <BarChart margin={{ left: 0, right: 0, top: 0, bottom: 0 }} accessibilityLayer data={chartData}>
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
