/* eslint-disable react/no-array-index-key */
/* eslint-disable prettier/prettier */
/* eslint-disable complexity */
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, TrendingUp, TrendingDown, Equal, Info } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { MetricCardData } from "@/lib/analytics-types";
import { cn } from "@/lib/utils";

import { DemoDataBadge } from "./demo-data-badge";

interface MetricCardProps {
  card: MetricCardData;
  isEditMode: boolean;
}

export function MetricCard({ card, isEditMode }: MetricCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    disabled: !isEditMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getTrendIcon = () => {
    if (card.trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (card.trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Equal className="h-4 w-4 text-yellow-500" />;
  };

  const getTrendColor = () => {
    if (card.trend === "up") return "text-green-500";
    if (card.trend === "down") return "text-red-500";
    return "text-yellow-500";
  };

  // Demo data badge component that's conditionally rendered
  const renderDemoDataBadge = () => {
    if (!card.isDemoData || !card.demoDataReason) return null;
    return (
      <DemoDataBadge reason={card.demoDataReason} message={card.demoDataMessage} />
    );
  };

  // Info tooltip explaining calculation method
  const renderInfoTooltip = () => {
    if (!card.calculationDescription) return null;
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground hover:text-foreground transition-colors" />
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p className="text-xs">{card.calculationDescription}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Combined top-right badges (info + demo)
  const renderTopRightBadges = () => {
    const hasInfo = card.calculationDescription;
    const hasDemo = card.isDemoData && card.demoDataReason;
    if (!hasInfo && !hasDemo) return null;
    return (
      <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5">
        {renderInfoTooltip()}
        {renderDemoDataBadge()}
      </div>
    );
  };

  if (card.layout === "detailed") {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "relative",
          card.size === "large" && "md:col-span-2",
          isDragging && "z-50 cursor-grabbing opacity-50",
          isEditMode && "animate-wiggle",
        )}
      >
        <Card className={cn("h-full transition-all", isEditMode && "cursor-grab border-dashed")}>
          {isEditMode && (
            <div
              {...attributes}
              {...listeners}
              className="absolute left-3 top-3 z-10 cursor-grab rounded-md bg-muted/50 p-1 hover:bg-muted"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          {renderTopRightBadges()}

          <CardHeader className={cn("pb-3", isEditMode && "pt-10")}>
            <div className="flex items-start justify-between">
              <CardDescription className="text-xs font-medium">{card.title}</CardDescription>
              {card.badge && !card.isDemoData && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">{card.badge}</span>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <CardTitle className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">{card.value}</CardTitle>
              {card.subtitle && <p className="mt-1 text-xs text-muted-foreground">{card.subtitle}</p>}
            </div>

            {card.details && card.details.length > 0 && (
              <div className="space-y-2 border-t pt-3">
                {card.details.map((detail, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{detail.label}</span>
                    <span className="font-medium">{detail.value}</span>
                  </div>
                ))}
              </div>
            )}

            {card.change && (
              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-xs text-muted-foreground">View all {card.title.toLowerCase()}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (card.layout === "simple") {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "relative",
          card.size === "large" && "md:col-span-2",
          isDragging && "z-50 cursor-grabbing opacity-50",
          isEditMode && "animate-wiggle",
        )}
      >
        <Card className={cn("h-full transition-all", isEditMode && "cursor-grab border-dashed")}>
          {isEditMode && (
            <div
              {...attributes}
              {...listeners}
              className="absolute left-3 top-3 z-10 cursor-grab rounded-md bg-muted/50 p-1 hover:bg-muted"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          {renderTopRightBadges()}

          <CardHeader className={cn("pb-2", isEditMode && "pt-10")}>
            <CardDescription className="text-xs font-medium">{card.title}</CardDescription>
            <CardTitle className="text-balance text-xl font-bold tracking-tight sm:text-2xl">{card.value}</CardTitle>
          </CardHeader>

          <CardContent>
            {card.subtitle && (
              <p className="line-clamp-2 text-xs text-muted-foreground">{card.subtitle}</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (card.layout === "compact") {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "relative",
          card.size === "large" && "md:col-span-2",
          isDragging && "z-50 cursor-grabbing opacity-50",
          isEditMode && "animate-wiggle",
        )}
      >
        <Card className={cn("h-full transition-all", isEditMode && "cursor-grab border-dashed")}>
          {isEditMode && (
            <div
              {...attributes}
              {...listeners}
              className="absolute left-3 top-3 z-10 cursor-grab rounded-md bg-muted/50 p-1 hover:bg-muted"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          {renderTopRightBadges()}

          <CardHeader className={cn("pb-2", isEditMode && "pt-10")}>
            <CardDescription className="text-xs font-medium">{card.title}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-1">
            <CardTitle className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">{card.value}</CardTitle>
            {card.change && card.trend && (
              <div className={cn("flex items-center gap-1.5 text-sm font-medium", getTrendColor())}>
                {getTrendIcon()}
                {card.change}
              </div>
            )}
            {card.subtitle && <p className="pt-1 text-xs text-muted-foreground">{card.subtitle}</p>}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default layout
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative",
        card.size === "large" && "md:col-span-2",
        isDragging && "z-50 cursor-grabbing opacity-50",
        isEditMode && "animate-wiggle",
      )}
    >
      <Card className={cn("h-full transition-all", isEditMode && "cursor-grab border-dashed")}>
        {isEditMode && (
          <div
            {...attributes}
            {...listeners}
            className="absolute left-3 top-3 z-10 cursor-grab rounded-md bg-muted/50 p-1 hover:bg-muted"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
        {renderTopRightBadges()}

        <CardHeader className={cn("pb-3", isEditMode && "pt-10")}>
          <CardDescription className="text-xs font-medium">{card.title}</CardDescription>
          <CardTitle className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">{card.value}</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between">
            {card.subtitle && <p className="flex-1 text-xs text-muted-foreground">{card.subtitle}</p>}
            {card.change && card.trend && (
              <div className={cn("flex shrink-0 items-center gap-1 text-sm font-medium", getTrendColor())}>
                {getTrendIcon()}
                {card.change}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
