"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  count: {
    label: "New Customers",
    color: "#FD6F01",
  },
} as ChartConfig;

interface CustomersChartProps {
  title: string;
  currentMonth: number;
  previousMonth: number;
  percentageChange: number;
  data: Array<{
    month: string;
    count: number;
  }>;
}

export function CustomersChart({ title, currentMonth, percentageChange, data }: CustomersChartProps) {
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardTitle className="text-2xl font-semibold tabular-nums @[200px]/card:text-3xl">
          +{currentMonth}{" "}
          <span className="text-muted-foreground text-sm font-normal">
            {percentageChange > 0 ? "+" : ""}
            {percentageChange.toFixed(1)}% from last month
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[250px] w-full" config={chartConfig}>
          <BarChart margin={{ left: 0, right: 0, top: 0, bottom: 0 }} accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis axisLine={false} tickLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="count" stackId="a" fill={chartConfig.count.color} radius={5} barSize={60} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
