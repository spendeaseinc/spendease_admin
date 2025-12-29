import type { Metadata } from "next";

import { fetchWaitlist, fetchWaitlistStats } from "@/app/actions/waitlist";

import { StatsCards } from "./_components/stats-cards";
import { WaitlistClient } from "./_components/waitlist-client";

export const metadata: Metadata = {
  title: "Waitlist - SpendEase Admin Dashboard",
  description: "Manage and view waitlist entries on the SpendEase Admin Dashboard",
};

export default async function WaitlistPage() {
  const [result, statsResult] = await Promise.all([fetchWaitlist({ page: 1, pageSize: 10 }), fetchWaitlistStats()]);

  if ("success" in result) {
    return (
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Waitlist</h1>
          <p className="text-muted-foreground">Manage and view all waitlist entries</p>
        </div>
        <div className="text-center text-red-500">{result.message}</div>
      </div>
    );
  }

  const waitlist = result;

  const stats =
    "success" in statsResult
      ? { total: 0, pending: 0, approved: 0 }
      : { total: statsResult.total, pending: statsResult.pending, approved: statsResult.approved };

  return (
    <div className="container mx-auto">
      <div className="mb-4 md:mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Waitlist</h1>
        <p className="text-muted-foreground">Manage and view all waitlist entries</p>
      </div>
      <StatsCards total={stats.total} pending={stats.pending} approved={stats.approved} />
      <WaitlistClient
        initialData={waitlist.data.data}
        initialPagination={{
          totalItems: waitlist.data.paging.total_items,
          currentPage: waitlist.data.paging.current,
          pageSize: waitlist.data.paging.page_size,
        }}
      />
    </div>
  );
}
