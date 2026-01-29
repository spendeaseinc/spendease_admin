import { format } from "date-fns";
import { CheckCircle2, FileText, History, Loader2, XCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function safeFormatDate(dateValue: string | Date | null | undefined, formatStr: string): string {
  if (!dateValue) return "-";
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return "-";
  return format(date, formatStr);
}

interface HistoryTimelineProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timeline: any[];
  isLoading: boolean;
}

export function HistoryTimeline({ timeline, isLoading }: HistoryTimelineProps) {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="bg-muted/30 pb-3">
        <CardTitle className="text-sm font-medium">Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="relative space-y-8 pl-2">
            {/* Vertical Line */}
            <div className="bg-muted absolute top-2 bottom-2 left-[19px] w-[2px]" />

            {timeline.map((event, index) => (
              <div key={event.id ?? index} className="relative flex gap-4">
                <div
                  className={`border-background z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 ${getEventIconColor(event.event_type)} `}
                >
                  {getEventIcon(event.event_type)}
                </div>
                <div className="flex-1 pt-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold capitalize">{event.event_type.replace(/_/g, " ")}</h4>
                    <span className="text-muted-foreground text-xs">
                      {safeFormatDate(event.created_at, "MMM d, yyyy HH:mm")}
                    </span>
                  </div>
                  <div className="text-muted-foreground mt-1 text-sm">
                    {event.actor_type === "system" ? "System Automated" : `By ${event.actor_type}`}
                  </div>
                  {event.details?.notes && (
                    <div className="bg-muted/50 mt-2 rounded p-2 text-sm">&quot;{event.details.notes}&quot;</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getEventIcon(type: string) {
  switch (type) {
    case "approved":
      return <CheckCircle2 className="h-5 w-5 text-white" />;
    case "declined":
      return <XCircle className="h-5 w-5 text-white" />;
    case "submitted":
      return <FileText className="h-5 w-5 text-white" />;
    default:
      return <History className="h-5 w-5 text-white" />;
  }
}

function getEventIconColor(type: string) {
  switch (type) {
    case "approved":
      return "bg-emerald-500";
    case "declined":
      return "bg-red-500";
    case "submitted":
      return "bg-blue-500";
    default:
      return "bg-gray-400";
  }
}
