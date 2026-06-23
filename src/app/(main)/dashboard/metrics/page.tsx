import { fetchAnalyticsData } from "@/app/actions/analytics";
import { getMetricsDateRangeParams, normalizeMetricsDateRange } from "@/lib/analytics-date-range";

import MetricsCards from "./_components/metrics-cards";

export const metadata = {
  title: "Metrics - SpendEase Admin Dashboard",
  description: "Manage and view all metrics on the SpendEase Admin Dashboard",
};

interface MetricsPageProps {
  searchParams?: Promise<{
    range?: string | string[];
  }>;
}

export default async function MetricsPage({ searchParams }: MetricsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const selectedRange = normalizeMetricsDateRange(resolvedSearchParams.range);
  const dateRange = getMetricsDateRangeParams(selectedRange);
  const analyticsResult = await fetchAnalyticsData(dateRange);

  // Handle error case
  if ("success" in analyticsResult) {
    return (
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Metrics</h1>
          <p className="text-muted-foreground">Manage and view all metrics • {dateRange.label}</p>
        </div>
        <div className="text-center text-red-500">{analyticsResult.message}</div>
      </div>
    );
  }

  const { metricCards, charts } = analyticsResult.data;

  return (
    <div className="container mx-auto">
      <div className="mb-4 md:mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Metrics</h1>
        <p className="text-muted-foreground">Manage and view all metrics • {dateRange.label}</p>
      </div>
      <MetricsCards metricCards={metricCards} charts={charts} selectedRange={selectedRange} />
    </div>
  );
}
