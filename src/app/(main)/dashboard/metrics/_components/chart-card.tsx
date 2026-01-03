/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-trailing-spaces */
/* eslint-disable max-lines */
/* eslint-disable security/detect-object-injection */
/* eslint-disable prettier/prettier */
/* eslint-disable complexity */
"use client";

import { useState, useMemo } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, EllipsisVertical, Info } from "lucide-react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PAIR_COLORS, CURRENCY_PAIRS } from "@/lib/analytics-data";
import { SUPPORTED_CURRENCIES, USD_EXCHANGE_RATES, type ChartData, type TimeFrame, type CurrencyFilter, type PairFilter, type SupportedCurrency } from "@/lib/analytics-types";
import { cn } from "@/lib/utils";

import { DemoDataBadge } from "./demo-data-badge";

// Time frames with actual historical data points
const TIME_FRAME_POINTS: Record<TimeFrame, number> = {
  weekly: 1,
  monthly: 1,
  "3months": 3,
  "6months": 6,
  "9months": 9,
  "12months": 12,
  "18months": 18,
  "24months": 24,
};

const CURRENCY_COLORS: Record<string, string> = {
  NGN: "#FD6F01",
  KES: "#22C55E",
  GHS: "#3B82F6",
  ZAR: "#A855F7",
}

const CURRENCY_NAMES: Record<string, string> = {
  NGN: "Nigerian Naira",
  KES: "Kenyan Shilling",
  GHS: "Ghanaian Cedi",
  ZAR: "South African Rand",
}

const STATUS_COLORS: Record<string, string> = {
  Success: "#22C55E",
  Pending: "#F59E0B",
  Failure: "#EF4444",
}

const timeFrameLabels: Record<TimeFrame, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  "3months": "3 Months",
  "6months": "6 Months",
  "9months": "9 Months",
  "12months": "12 Months",
  "18months": "18 Months",
  "24months": "24 Months",
};

interface ChartCardProps {
  chart: ChartData;
  isEditMode: boolean;
  currencyFilter: CurrencyFilter;
}

function CustomTooltip({
  active,
  payload,
  label,
  currencyFilter,
}: {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string; color: string; name: string }>
  label?: string
  currencyFilter?: CurrencyFilter
}) {
  if (!active || !payload || payload.length === 0) return null

  const formatValue = (value: number, dataKey: string) => {
    if (
      dataKey.includes("success") ||
      dataKey.includes("failure") ||
      dataKey.includes("pending") ||
      dataKey === "Success" ||
      dataKey === "Failure" ||
      dataKey === "Pending"
    ) {
      return `${value.toFixed(1)}%`
    }
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
    return value.toLocaleString()
  }

  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="mb-2 text-sm font-semibold text-foreground">
        {label} {currencyFilter === "all" && "(USD)"}
      </p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium text-foreground">
            {formatValue(entry.value, entry.dataKey)}
            {currencyFilter === "all" && !entry.dataKey.includes("success") && !entry.dataKey.includes("failure") && !entry.dataKey.includes("pending") && entry.dataKey !== "Success" && entry.dataKey !== "Failure" && entry.dataKey !== "Pending" && " USD"}
          </span>
        </div>
      ))}
    </div>
  )
}

function ColorLegend({
  currencies,
  filter,
  onFilterChange,
}: {
  currencies: string[]
  filter: CurrencyFilter
  onFilterChange: (currency: CurrencyFilter) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 text-xs sm:gap-2">
      <button
        onClick={() => onFilterChange("all")}
        className={cn(
          "rounded-md px-2 py-1 transition-colors",
          filter === "all" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        All
      </button>
      {currencies.map((currency) => (
        <button
          key={currency}
          onClick={() => onFilterChange(currency as CurrencyFilter)}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors",
            filter === currency ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: CURRENCY_COLORS[currency] }} />
          <span>{currency}</span>
        </button>
      ))}
    </div>
  )
}

function StatusLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs">
      {Object.entries(STATUS_COLORS).map(([status, color]) => (
        <div key={status} className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
          <span className="text-muted-foreground">{status}</span>
        </div>
      ))}
    </div>
  )
}

function PairLegend({
  pairs,
  filter,
  onFilterChange,
}: {
  pairs: string[]
  filter: PairFilter
  onFilterChange: (pair: PairFilter) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 text-xs">
      <button
        onClick={() => onFilterChange("all")}
        className={cn(
          "rounded-md px-2 py-1 transition-colors",
          filter === "all" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        All
      </button>
      {pairs.map((pair) => (
        <button
          key={pair}
          onClick={() => onFilterChange(pair)}
          className={cn(
            "flex items-center gap-1 rounded-md px-1.5 py-1 transition-colors",
            filter === pair ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <div className="h-2 w-2 rounded-sm" style={{ backgroundColor: PAIR_COLORS[pair] || "#FD6F01" }} />
          <span className="text-[10px]">{pair}</span>
        </button>
      ))}
    </div>
  )
}

export function ChartCard({ chart, isEditMode, currencyFilter }: ChartCardProps) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("6months")
  const [internalCurrencyFilter, setInternalCurrencyFilter] = useState<CurrencyFilter>("all")
  const [pairFilter, setPairFilter] = useState<PairFilter>("all")

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: chart.id,
    disabled: !isEditMode,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const currencies = chart.currencies ?? [];
  const pairs = chart.pairs ?? CURRENCY_PAIRS;

  // Helper to convert currency value to USD
  const convertToUSD = (value: number, currency: SupportedCurrency): number => {
    return value / USD_EXCHANGE_RATES[currency];
  };

  // Filter and transform chart data based on currency filter
  const getFilteredChartData = useMemo(() => {
    let data = chart.isSnapshot ? chart.data : chart.data.slice(-TIME_FRAME_POINTS[timeFrame]);

    // For metric-based charts (Revenue, Volume, etc.), filter by currency
    const firstItem = data[0];
    if (!firstItem) return data;

    const dataKeys = Object.keys(firstItem).filter(key => key !== "name");
    const isMetricBasedChart = dataKeys.some(key => 
      !SUPPORTED_CURRENCIES.includes(key as SupportedCurrency) &&
      (key.includes("Revenue") || key.includes("Volume") || key.includes("Fees") || 
       key.includes("Profit") || key.includes("Count") || key.includes("Balance") ||
       key.includes("Wallets"))
    );

    if (isMetricBasedChart && currencyFilter !== "all") {
      // Filter to show only selected currency
      data = data.filter((item) => item.name === currencyFilter);
    } else if (isMetricBasedChart && currencyFilter === "all") {
      // Convert all currency values to USD
      data = data.map((item) => {
        const currency = item.name as SupportedCurrency;
        if (!SUPPORTED_CURRENCIES.includes(currency)) return item;

        const convertedItem: typeof item = { ...item };
        dataKeys.forEach((key) => {
          const value = convertedItem[key];
          if (typeof value === "number") {
            convertedItem[key] = convertToUSD(value, currency);
          }
        });
        // Update name to show it's USD converted
        convertedItem.name = `${currency} (USD)`;
        return convertedItem;
      });
    }

    return data;
  }, [chart.data, chart.isSnapshot, timeFrame, currencyFilter]);

  // For snapshot charts, return all data (no time filtering)
  // For time-series charts, filter by selected time frame
  const getFilteredData = useMemo(() => {
    // Snapshot charts show current period data - no time filtering
    if (chart.isSnapshot) {
      return getFilteredChartData;
    }
    // Time-series charts support time frame filtering
    const count = TIME_FRAME_POINTS[timeFrame];
    return getFilteredChartData.slice(-count);
  }, [getFilteredChartData, timeFrame, chart.isSnapshot])

  const visibleCurrencies = internalCurrencyFilter === "all" ? currencies : [internalCurrencyFilter]
  const visiblePairs = pairFilter === "all" ? pairs : [pairFilter]

  const renderChart = () => {
    // Status bar chart (Success/Failure/Pending)
    if (chart.type === "status-bar") {
      return (
        <BarChart data={getFilteredData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
          <XAxis
            dataKey="name"
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            width={45}
          />
          <RechartsTooltip content={<CustomTooltip currencyFilter={currencyFilter} />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
          <Bar dataKey="Success" name="Success" fill={STATUS_COLORS.Success} radius={[4, 4, 0, 0]} maxBarSize={40} />
          <Bar dataKey="Pending" name="Pending" fill={STATUS_COLORS.Pending} radius={[4, 4, 0, 0]} maxBarSize={40} />
          <Bar dataKey="Failure" name="Failure" fill={STATUS_COLORS.Failure} radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      )
    }

    // Pair transaction volume bar chart
    if (chart.type === "pair-bar") {
      return (
        <BarChart data={getFilteredData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
          <XAxis
            dataKey="name"
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(value) => {
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
              if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
              return value
            }}
            width={45}
          />
          <RechartsTooltip content={<CustomTooltip currencyFilter={currencyFilter} />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
          {visiblePairs.map((pair) => (
            <Bar
              key={pair}
              dataKey={pair}
              name={pair}
              fill={PAIR_COLORS[pair] || "#FD6F01"}
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          ))}
        </BarChart>
      )
    }
    
    if (chart.type === "pair-status") {
      const selectedPair = pairFilter === "all" ? pairs[0] : pairFilter
      return (
        <BarChart data={getFilteredData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
          <XAxis
            dataKey="name"
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            width={45}
          />
          <RechartsTooltip content={<CustomTooltip currencyFilter={currencyFilter} />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
          <Bar
            dataKey={`${selectedPair}_success`}
            name={`${selectedPair} Success`}
            fill={STATUS_COLORS.Success}
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
          <Bar
            dataKey={`${selectedPair}_pending`}
            name={`${selectedPair} Pending`}
            fill={STATUS_COLORS.Pending}
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
          <Bar
            dataKey={`${selectedPair}_failure`}
            name={`${selectedPair} Failure`}
            fill={STATUS_COLORS.Failure}
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      )
    }

    // Regular bar chart with currencies
    if (chart.type === "bar") {
      // Check if this is a metric-based chart
      const firstDataItem = getFilteredData[0];
      const dataKeys = firstDataItem ? Object.keys(firstDataItem).filter(key => key !== "name") : [];
      
      const isMetricBasedChart = dataKeys.some(key => 
        !SUPPORTED_CURRENCIES.includes(key as SupportedCurrency) &&
        (key.includes("Revenue") || key.includes("Volume") || key.includes("Fees") || 
         key.includes("Profit") || key.includes("Count") || key.includes("Balance") ||
         key.includes("Wallets"))
      );

      // Define colors for metric keys
      const METRIC_COLORS: Record<string, string> = {
        "Gross Revenue": "#10B981",
        "Transaction Fees": "#3B82F6",
        "FX Sales": "#F59E0B",
        "Net Profit": "#8B5CF6",
        "Transaction Volume": "#06B6D4",
        "Transaction Count": "#6366F1",
        "Active Wallets": "#22C55E",
        "Inactive Wallets": "#EF4444",
        "Total Wallets": "#64748B",
        "Total Balance": "#14B8A6",
        "Avg Balance": "#0EA5E9",
      };

      return (
        <BarChart data={getFilteredData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
          <XAxis
            dataKey="name"
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(value) => {
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
              if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
              return value
            }}
            width={45}
          />
          <RechartsTooltip content={<CustomTooltip currencyFilter={currencyFilter} />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
          {isMetricBasedChart ? (
            // Render bars for each metric key (grouped by currency on X-axis)
            dataKeys.map((metricKey) => (
              <Bar
                key={metricKey}
                dataKey={metricKey}
                name={metricKey}
                fill={METRIC_COLORS[metricKey] || CURRENCY_COLORS[metricKey] || "#64748B"}
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            ))
          ) : (
            // Render bars for each currency (original behavior for time-series charts)
            visibleCurrencies.map((currency) => (
              <Bar
                key={currency}
                dataKey={currency}
                name={CURRENCY_NAMES[currency] || currency}
                fill={CURRENCY_COLORS[currency]}
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            ))
          )}
        </BarChart>
      )
    }

    // Area chart
    if (chart.type === "area") {
      return (
        <AreaChart data={getFilteredData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            {currencies.map((currency) => (
              <linearGradient key={currency} id={`gradient-${currency}-${chart.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CURRENCY_COLORS[currency]} stopOpacity={0.4} />
                <stop offset="95%" stopColor={CURRENCY_COLORS[currency]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
          <XAxis
            dataKey="name"
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(value) => {
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
              if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
              return value
            }}
            width={45}
          />
          <RechartsTooltip content={<CustomTooltip />} />
          {visibleCurrencies.map((currency) => (
            <Area
              key={currency}
              type="monotone"
              dataKey={currency}
              name={CURRENCY_NAMES[currency] || currency}
              stroke={CURRENCY_COLORS[currency]}
              strokeWidth={2}
              fill={`url(#gradient-${currency}-${chart.id})`}
            />
          ))}
        </AreaChart>
      )
    }

    // Line chart (default)
    return (
      <LineChart data={getFilteredData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
        <XAxis
          dataKey="name"
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))" }}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))" }}
          tickFormatter={(value) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
            if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
            return value
          }}
          width={45}
        />
        <RechartsTooltip content={<CustomTooltip />} />
        {visibleCurrencies.map((currency) => (
          <Line
            key={currency}
            type="monotone"
            dataKey={currency}
            name={CURRENCY_NAMES[currency] || currency}
            stroke={CURRENCY_COLORS[currency]}
            strokeWidth={2.5}
            dot={{ fill: CURRENCY_COLORS[currency], r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        ))}
      </LineChart>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("relative", isDragging && "z-50 cursor-grabbing opacity-50", isEditMode && "animate-wiggle")}
    >
      <Card className={cn("h-full transition-all", isEditMode && "cursor-grab border-dashed")}>
        {isEditMode && (
          <div
            {...attributes}
            {...listeners}
            className="absolute left-4 top-4 z-10 cursor-grab rounded-md bg-muted/50 p-1 hover:bg-muted"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        )}

        <CardHeader className={cn("relative pb-2", isEditMode && "pt-12")}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-balance text-base sm:text-lg">{chart.title}</CardTitle>
                {chart.isDemoData && chart.demoDataReason && (
                  <DemoDataBadge reason={chart.demoDataReason} message={chart.demoDataMessage} />
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 cursor-help text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>{chart.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CardDescription className="text-xs sm:text-sm">{chart.subtitle}</CardDescription>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                  {chart.isSnapshot ? "Current Period Snapshot" : "Time Frame"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {chart.isSnapshot ? (
                  <DropdownMenuItem disabled className="text-muted-foreground text-xs">
                    Time filtering not available for snapshot data
                  </DropdownMenuItem>
                ) : (
                  (Object.keys(timeFrameLabels) as TimeFrame[]).map((tf) => (
                    <DropdownMenuItem
                      key={tf}
                      onClick={() => setTimeFrame(tf)}
                      className={cn(timeFrame === tf && "bg-muted")}
                    >
                      {timeFrameLabels[tf]}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Currency/Pair Legends */}
          <div className="mt-3 space-y-2">
            {chart.hasStatusLegend && <StatusLegend />}
            {chart.showLegend && currencies.length > 0 && (
              <ColorLegend currencies={currencies} filter={internalCurrencyFilter} onFilterChange={setInternalCurrencyFilter} />
            )}
            {chart.hasPairLegend && pairs.length > 0 && (
              <PairLegend pairs={pairs} filter={pairFilter} onFilterChange={setPairFilter} />
            )}
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="h-[280px] w-full sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
