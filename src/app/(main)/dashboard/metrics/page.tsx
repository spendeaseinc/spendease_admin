import { fetchAnalyticsData } from "@/app/actions/analytics";

import MetricsCards from "./_components/metrics-cards";

export const metadata = {
  title: "Metrics - SpendEase Admin Dashboard",
  description: "Manage and view all metrics on the SpendEase Admin Dashboard",
};

export default async function MetricsPage() {
  const analyticsResult = await fetchAnalyticsData();

  // Handle error case
  if ("success" in analyticsResult) {
    return (
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Metrics</h1>
          <p className="text-muted-foreground">Manage and view all metrics</p>
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
        <p className="text-muted-foreground">Manage and view all metrics</p>
      </div>
      <MetricsCards metricCards={metricCards} charts={charts} />
    </div>
  );
}
