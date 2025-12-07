"use client";

import { Circle } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  totalCustomers: {
    label: "Total Customers",
    color: "#FD6F01",
  },
  transactingCustomers: {
    label: "Transacting Customers",
    color: "#efd8c6",
  },
} satisfies ChartConfig;

interface CustomersGraphProps {
  title: string;
  data: Array<{
    date: string;
    totalCustomers: number;
    transactingCustomers: number;
  }>;
}

export function CustomersGraph({ title, data }: CustomersGraphProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <span className="flex flex-row items-center gap-2">
            <Circle className="h-2 w-2 rounded-full bg-[#FD6F01] text-[#FD6F01]" />
            Total Customers
            <Circle className="h-2 w-2 rounded-full bg-[#efd8c6] text-[#efd8c6]" />
            Transacting Customers
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[200px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="filltotalCustomers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-totalCustomers)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-totalCustomers)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="filltransactingCustomers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-transactingCustomers)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-transactingCustomers)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                return value;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent labelFormatter={(value) => value} indicator="dot" />}
            />
            <Area
              dataKey="transactingCustomers"
              type="natural"
              fill="url(#filltransactingCustomers)"
              stroke="var(--color-transactingCustomers)"
              stackId="a"
            />
            <Area
              dataKey="totalCustomers"
              type="natural"
              fill="url(#filltotalCustomers)"
              stroke="var(--color-totalCustomers)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
