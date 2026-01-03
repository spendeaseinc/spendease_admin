"use client";

import { AlertCircle, Database } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { DemoDataReason } from "@/lib/analytics-types";

interface DemoDataBadgeProps {
  reason: DemoDataReason;
  message?: string;
}

const REASON_MESSAGES: Record<DemoDataReason, string> = {
  error: "API returned an error",
  not_configured: "API endpoint not configured yet",
  no_data: "No data available for this metric",
};

export function DemoDataBadge({ reason, message }: DemoDataBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" className="gap-1 text-[10px]">
            <Database className="h-3 w-3" />
            Demo
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <div>
              <p className="font-medium">{REASON_MESSAGES[reason]}</p>
              {message && <p className="text-muted-foreground text-xs">{message}</p>}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
