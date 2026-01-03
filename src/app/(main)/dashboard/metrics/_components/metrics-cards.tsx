/* eslint-disable prettier/prettier */
/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
"use client";

import { useMemo, useState } from "react";

import { Info, LayoutGrid } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  CURRENCY_INFO,
  SUPPORTED_CURRENCIES,
  USD_EXCHANGE_RATES,
  type ChartData,
  type CurrencyFilter,
  type MetricCardData,
  type SupportedCurrency,
} from "@/lib/analytics-types";

import { ChartsGrid } from "./charts-grid";
import { MetricCardsGrid } from "./metric-cards-grid";

interface MetricsCardsProps {
  metricCards: MetricCardData[];
  charts: ChartData[];
}

export default function MetricsCards({ metricCards, charts }: MetricsCardsProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [currencyFilter, setCurrencyFilter] = useState<CurrencyFilter>("all");

  // Filter cards based on selected currency
  const filteredCards = useMemo(() => {
    if (currencyFilter === "all") {
      // For "all", show cards that are either:
      // 1. Not currency-specific (currency is undefined or "all")
      // 2. Has currency set to "all"
      return metricCards.filter((card) => !card.currency || card.currency === "all");
    }
    // For specific currency, show cards that match that currency
    return metricCards.filter((card) => card.currency === currencyFilter);
  }, [metricCards, currencyFilter]);

  // Get exchange rate info for display
  const exchangeRateInfo = useMemo(() => {
    if (currencyFilter === "all") {
      return "All values converted to USD using fixed exchange rates";
    }
    const rate = USD_EXCHANGE_RATES[currencyFilter as SupportedCurrency];
    return `1 USD = ${rate.toLocaleString()} ${currencyFilter}`;
  }, [currencyFilter]);

  return (
    <Tabs defaultValue="overview">
      <div className="mb-6 flex items-center justify-between md:mb-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>

        {/* Edit Mode Toggle */}
        <Button
          variant={isEditMode ? "default" : "outline"}
          size="icon"
          onClick={() => setIsEditMode(!isEditMode)}
          className="transition-all"
          title={isEditMode ? "Exit edit mode" : "Enable drag to reorder"}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </div>

      <TabsContent className="@container/main flex flex-col gap-4" value="overview">
        {/* Currency Filter Tabs */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={currencyFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrencyFilter("all")}
              className="h-8"
            >
              All (USD)
            </Button>
            {SUPPORTED_CURRENCIES.map((currency) => (
              <Button
                key={currency}
                variant={currencyFilter === currency ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrencyFilter(currency)}
                className="h-8 gap-1.5"
              >
                <span>{CURRENCY_INFO[currency].flag}</span>
                <span>{currency}</span>
              </Button>
            ))}
          </div>

          {/* Exchange Rate Badge */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="w-fit gap-1.5 whitespace-nowrap">
                  <Info className="h-3 w-3" />
                  {exchangeRateInfo}
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="space-y-1">
                  <p className="font-medium">Fixed USD Exchange Rates</p>
                  <div className="text-xs text-muted-foreground">
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <div key={c}>
                        {CURRENCY_INFO[c].flag} {c}: 1 USD = {USD_EXCHANGE_RATES[c].toLocaleString()} {c}
                      </div>
                    ))}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <MetricCardsGrid cards={filteredCards} isEditMode={isEditMode} />
      </TabsContent>

      <TabsContent className="flex flex-col gap-4 md:gap-6" value="charts">
        {/* Currency Filter Tabs for Charts */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={currencyFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrencyFilter("all")}
              className="h-8"
            >
              All (USD)
            </Button>
            {SUPPORTED_CURRENCIES.map((currency) => (
              <Button
                key={currency}
                variant={currencyFilter === currency ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrencyFilter(currency)}
                className="h-8 gap-1.5"
              >
                <span>{CURRENCY_INFO[currency].flag}</span>
                <span>{currency}</span>
              </Button>
            ))}
          </div>

          {/* Exchange Rate Badge */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="w-fit gap-1.5 whitespace-nowrap">
                  <Info className="h-3 w-3" />
                  {exchangeRateInfo}
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="space-y-1">
                  <p className="font-medium">Fixed USD Exchange Rates</p>
                  <div className="text-xs text-muted-foreground">
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <div key={c}>
                        {CURRENCY_INFO[c].flag} {c}: 1 USD = {USD_EXCHANGE_RATES[c].toLocaleString()} {c}
                      </div>
                    ))}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <ChartsGrid charts={charts} isEditMode={isEditMode} currencyFilter={currencyFilter} />
      </TabsContent>
    </Tabs>
  );
}
