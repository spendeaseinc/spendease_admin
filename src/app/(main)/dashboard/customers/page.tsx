import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { fetchUsers, fetchUserStats } from "@/app/actions/users";

import { CustomersClient } from "./_components/customers-client";
import { StatsCards } from "./_components/stats-cards";

export const metadata: Metadata = {
  title: "Customers - SpendEase Admin Dashboard",
  description: "Manage and view all customers on the SpendEase Admin Dashboard",
};

export default async function CustomersPage() {
  const [result, statsResult] = await Promise.all([fetchUsers({ page: 1, pageSize: 10 }), fetchUserStats()]);

  if ("success" in result) {
    if (result.unauthorized) {
      redirect("/auth/login");
    }
    return (
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage and view all customer accounts</p>
        </div>
        <div className="text-center text-red-500">{result.message}</div>
      </div>
    );
  }

  const customers = result;

  const stats =
    "success" in statsResult
      ? { total: 0, active: 0, verified: 0 }
      : { total: statsResult.total, active: statsResult.active, verified: statsResult.verified };

  return (
    <div className="container mx-auto">
      <div className="mb-4 md:mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">Manage and view all customer accounts</p>
      </div>
      <StatsCards total={stats.total} active={stats.active} verified={stats.verified} />
      <CustomersClient
        initialData={customers.data.data}
        initialPagination={{
          totalItems: customers.data.paging.total_items,
          currentPage: customers.data.paging.current,
          pageSize: customers.data.paging.page_size,
        }}
      />
    </div>
  );
}
