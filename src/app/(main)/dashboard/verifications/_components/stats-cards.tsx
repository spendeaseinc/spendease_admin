import { Clock, AlertTriangle, CheckCircle2, XCircle, LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { VerificationStats } from "@/lib/types/verification";

interface StatCardProps {
  title: string;
  icon: LucideIcon;
  iconColorClass: string;
  loading: boolean;
  value: number;
  description?: string;
}

function StatCard({ title, icon: Icon, iconColorClass, loading, value, description }: StatCardProps) {
  return (
    <Card className="border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColorClass}`} />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {description && <p className="text-muted-foreground text-xs">{description}</p>}
          </>
        )}
      </CardContent>
    </Card>
  );
}

interface VerificationStatsCardsProps {
  stats: VerificationStats | null;
  isLoading: boolean;
}

export function VerificationStatsCards({ stats, isLoading }: VerificationStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="In Queue"
        icon={Clock}
        iconColorClass="text-amber-500"
        loading={isLoading}
        value={stats?.totals.pending_ocr ?? 0}
        description="Awaiting processing"
      />
      <StatCard
        title="Needs Review"
        icon={AlertTriangle}
        iconColorClass="text-orange-500"
        loading={isLoading}
        value={stats?.totals.pending_review ?? 0}
        description="Manual review required"
      />
      <StatCard
        title="Approved"
        icon={CheckCircle2}
        iconColorClass="text-emerald-500"
        loading={isLoading}
        value={stats?.totals.approved ?? 0}
      />
      <StatCard
        title="Declined"
        icon={XCircle}
        iconColorClass="text-red-500"
        loading={isLoading}
        value={stats?.totals.declined ?? 0}
      />
    </div>
  );
}
