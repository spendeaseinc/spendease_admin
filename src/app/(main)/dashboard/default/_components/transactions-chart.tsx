"use client";

import * as React from "react";

import { Circle } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export const description = "An interactive area chart";

const chartData = [
  { date: "2024-04-01", total: 150 },
  { date: "2024-04-02", total: 180 },
  { date: "2024-04-03", total: 120 },
  { date: "2024-04-04", total: 260 },
  { date: "2024-04-05", total: 290 },
  { date: "2024-04-06", total: 340 },
  { date: "2024-04-07", total: 180 },
  { date: "2024-04-08", total: 320 },
  { date: "2024-04-09", total: 110 },
  { date: "2024-04-10", total: 190 },
  { date: "2024-04-11", total: 350 },
  { date: "2024-04-12", total: 210 },
  { date: "2024-04-13", total: 380 },
  { date: "2024-04-14", total: 220 },
  { date: "2024-04-15", total: 170 },
  { date: "2024-04-16", total: 190 },
  { date: "2024-04-17", total: 360 },
  { date: "2024-04-18", total: 410 },
  { date: "2024-04-19", total: 180 },
  { date: "2024-04-20", total: 150 },
  { date: "2024-04-21", total: 200 },
  { date: "2024-04-22", total: 170 },
  { date: "2024-04-23", total: 230 },
  { date: "2024-04-24", total: 290 },
  { date: "2024-04-25", total: 250 },
  { date: "2024-04-26", total: 130 },
  { date: "2024-04-27", total: 420 },
  { date: "2024-04-28", total: 180 },
  { date: "2024-04-29", total: 240 },
  { date: "2024-04-30", total: 380 },
  { date: "2024-05-01", total: 220 },
  { date: "2024-05-02", total: 310 },
  { date: "2024-05-03", total: 190 },
  { date: "2024-05-04", total: 420 },
  { date: "2024-05-05", total: 390 },
  { date: "2024-05-06", total: 520 },
  { date: "2024-05-07", total: 300 },
  { date: "2024-05-08", total: 210 },
  { date: "2024-05-09", total: 180 },
  { date: "2024-05-10", total: 330 },
  { date: "2024-05-11", total: 270 },
  { date: "2024-05-12", total: 240 },
  { date: "2024-05-13", total: 160 },
  { date: "2024-05-14", total: 490 },
  { date: "2024-05-15", total: 380 },
  { date: "2024-05-16", total: 400 },
  { date: "2024-05-17", total: 420 },
  { date: "2024-05-18", total: 350 },
  { date: "2024-05-19", total: 180 },
  { date: "2024-05-20", total: 230 },
  { date: "2024-05-21", total: 140 },
  { date: "2024-05-22", total: 120 },
  { date: "2024-05-23", total: 290 },
  { date: "2024-05-24", total: 220 },
  { date: "2024-05-25", total: 250 },
  { date: "2024-05-26", total: 170 },
  { date: "2024-05-27", total: 460 },
  { date: "2024-05-28", total: 190 },
  { date: "2024-05-29", total: 130 },
  { date: "2024-05-30", total: 280 },
  { date: "2024-05-31", total: 230 },
  { date: "2024-06-01", total: 200 },
  { date: "2024-06-02", total: 410 },
  { date: "2024-06-03", total: 160 },
  { date: "2024-06-04", total: 380 },
  { date: "2024-06-05", total: 140 },
  { date: "2024-06-06", total: 250 },
  { date: "2024-06-07", total: 370 },
  { date: "2024-06-08", total: 320 },
  { date: "2024-06-09", total: 480 },
  { date: "2024-06-10", total: 200 },
  { date: "2024-06-11", total: 150 },
  { date: "2024-06-12", total: 420 },
  { date: "2024-06-13", total: 130 },
  { date: "2024-06-14", total: 380 },
  { date: "2024-06-15", total: 350 },
  { date: "2024-06-16", total: 310 },
  { date: "2024-06-17", total: 520 },
  { date: "2024-06-18", total: 170 },
  { date: "2024-06-19", total: 290 },
  { date: "2024-06-20", total: 450 },
  { date: "2024-06-21", total: 210 },
  { date: "2024-06-22", total: 270 },
  { date: "2024-06-23", total: 530 },
  { date: "2024-06-24", total: 180 },
  { date: "2024-06-25", total: 190 },
  { date: "2024-06-26", total: 380 },
  { date: "2024-06-27", total: 490 },
  { date: "2024-06-28", total: 200 },
  { date: "2024-06-29", total: 160 },
  { date: "2024-06-30", total: 400 },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  total: {
    label: "Total Customers",
    color: "#FD6F01",
  },
} satisfies ChartConfig;

export function TransactionsChart() {
  const [timeRange, setTimeRange] = React.useState("30d");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Transaction Trend </CardTitle>
        <CardDescription>
          <span className="flex flex-row items-center gap-2">
            <Circle className="h-2 w-2 rounded-full bg-[#FD6F01] text-[#FD6F01]" />
            Total Customers
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[200px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="filltotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.1} />
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
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area dataKey="total" type="natural" fill="url(#filltotal)" stroke="var(--color-total)" stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
