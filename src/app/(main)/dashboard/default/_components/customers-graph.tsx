"use client";

import * as React from "react";

import { Circle } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export const description = "An interactive area chart";

const chartData = [
  { date: "2024-04-01", transacting: 222, total: 150 },
  { date: "2024-04-02", transacting: 97, total: 180 },
  { date: "2024-04-03", transacting: 167, total: 120 },
  { date: "2024-04-04", transacting: 242, total: 260 },
  { date: "2024-04-05", transacting: 373, total: 290 },
  { date: "2024-04-06", transacting: 301, total: 340 },
  { date: "2024-04-07", transacting: 245, total: 180 },
  { date: "2024-04-08", transacting: 409, total: 320 },
  { date: "2024-04-09", transacting: 59, total: 110 },
  { date: "2024-04-10", transacting: 261, total: 190 },
  { date: "2024-04-11", transacting: 327, total: 350 },
  { date: "2024-04-12", transacting: 292, total: 210 },
  { date: "2024-04-13", transacting: 342, total: 380 },
  { date: "2024-04-14", transacting: 137, total: 220 },
  { date: "2024-04-15", transacting: 120, total: 170 },
  { date: "2024-04-16", transacting: 138, total: 190 },
  { date: "2024-04-17", transacting: 446, total: 360 },
  { date: "2024-04-18", transacting: 364, total: 410 },
  { date: "2024-04-19", transacting: 243, total: 180 },
  { date: "2024-04-20", transacting: 89, total: 150 },
  { date: "2024-04-21", transacting: 137, total: 200 },
  { date: "2024-04-22", transacting: 224, total: 170 },
  { date: "2024-04-23", transacting: 138, total: 230 },
  { date: "2024-04-24", transacting: 387, total: 290 },
  { date: "2024-04-25", transacting: 215, total: 250 },
  { date: "2024-04-26", transacting: 75, total: 130 },
  { date: "2024-04-27", transacting: 383, total: 420 },
  { date: "2024-04-28", transacting: 122, total: 180 },
  { date: "2024-04-29", transacting: 315, total: 240 },
  { date: "2024-04-30", transacting: 454, total: 380 },
  { date: "2024-05-01", transacting: 165, total: 220 },
  { date: "2024-05-02", transacting: 293, total: 310 },
  { date: "2024-05-03", transacting: 247, total: 190 },
  { date: "2024-05-04", transacting: 385, total: 420 },
  { date: "2024-05-05", transacting: 481, total: 390 },
  { date: "2024-05-06", transacting: 498, total: 520 },
  { date: "2024-05-07", transacting: 388, total: 300 },
  { date: "2024-05-08", transacting: 149, total: 210 },
  { date: "2024-05-09", transacting: 227, total: 180 },
  { date: "2024-05-10", transacting: 293, total: 330 },
  { date: "2024-05-11", transacting: 335, total: 270 },
  { date: "2024-05-12", transacting: 197, total: 240 },
  { date: "2024-05-13", transacting: 197, total: 160 },
  { date: "2024-05-14", transacting: 448, total: 490 },
  { date: "2024-05-15", transacting: 473, total: 380 },
  { date: "2024-05-16", transacting: 338, total: 400 },
  { date: "2024-05-17", transacting: 499, total: 420 },
  { date: "2024-05-18", transacting: 315, total: 350 },
  { date: "2024-05-19", transacting: 235, total: 180 },
  { date: "2024-05-20", transacting: 177, total: 230 },
  { date: "2024-05-21", transacting: 82, total: 140 },
  { date: "2024-05-22", transacting: 81, total: 120 },
  { date: "2024-05-23", transacting: 252, total: 290 },
  { date: "2024-05-24", transacting: 294, total: 220 },
  { date: "2024-05-25", transacting: 201, total: 250 },
  { date: "2024-05-26", transacting: 213, total: 170 },
  { date: "2024-05-27", transacting: 420, total: 460 },
  { date: "2024-05-28", transacting: 233, total: 190 },
  { date: "2024-05-29", transacting: 78, total: 130 },
  { date: "2024-05-30", transacting: 340, total: 280 },
  { date: "2024-05-31", transacting: 178, total: 230 },
  { date: "2024-06-01", transacting: 178, total: 200 },
  { date: "2024-06-02", transacting: 470, total: 410 },
  { date: "2024-06-03", transacting: 103, total: 160 },
  { date: "2024-06-04", transacting: 439, total: 380 },
  { date: "2024-06-05", transacting: 88, total: 140 },
  { date: "2024-06-06", transacting: 294, total: 250 },
  { date: "2024-06-07", transacting: 323, total: 370 },
  { date: "2024-06-08", transacting: 385, total: 320 },
  { date: "2024-06-09", transacting: 438, total: 480 },
  { date: "2024-06-10", transacting: 155, total: 200 },
  { date: "2024-06-11", transacting: 92, total: 150 },
  { date: "2024-06-12", transacting: 492, total: 420 },
  { date: "2024-06-13", transacting: 81, total: 130 },
  { date: "2024-06-14", transacting: 426, total: 380 },
  { date: "2024-06-15", transacting: 307, total: 350 },
  { date: "2024-06-16", transacting: 371, total: 310 },
  { date: "2024-06-17", transacting: 475, total: 520 },
  { date: "2024-06-18", transacting: 107, total: 170 },
  { date: "2024-06-19", transacting: 341, total: 290 },
  { date: "2024-06-20", transacting: 408, total: 450 },
  { date: "2024-06-21", transacting: 169, total: 210 },
  { date: "2024-06-22", transacting: 317, total: 270 },
  { date: "2024-06-23", transacting: 480, total: 530 },
  { date: "2024-06-24", transacting: 132, total: 180 },
  { date: "2024-06-25", transacting: 141, total: 190 },
  { date: "2024-06-26", transacting: 434, total: 380 },
  { date: "2024-06-27", transacting: 448, total: 490 },
  { date: "2024-06-28", transacting: 149, total: 200 },
  { date: "2024-06-29", transacting: 103, total: 160 },
  { date: "2024-06-30", transacting: 446, total: 400 },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  transacting: {
    label: "Transacting Customers",
    color: "#FD8C34",
  },
  total: {
    label: "Total Customers",
    color: "#FD6F01",
  },
} satisfies ChartConfig;

export function CustomersGraph() {
  const [timeRange] = React.useState("30d");

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
        <CardTitle>Total Customers vs Transacting Customers</CardTitle>
        <CardDescription>
          <span className="flex flex-row items-center gap-2">
            <Circle className="h-2 w-2 rounded-full bg-[#FD6F01] text-[#FD6F01]" />
            Total Customers
            <Circle className="h-2 w-2 rounded-full bg-[#FD8C34] text-[#FD8C34]" />
            Transacting Customers
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[200px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="filltransacting" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-transacting)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-transacting)" stopOpacity={0.1} />
              </linearGradient>
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
            <Area
              dataKey="transacting"
              type="natural"
              fill="url(#filltransacting)"
              stroke="var(--color-transacting)"
              stackId="a"
            />
            <Area dataKey="total" type="natural" fill="url(#filltotal)" stroke="var(--color-total)" stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
