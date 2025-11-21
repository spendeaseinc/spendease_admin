import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { fetchAuditLogs } from "@/app/actions/audit-logs";

import { AuditLogsClient } from "./_components/audit-logs-client";

export const metadata: Metadata = {
  title: "Audit Logs - SpendEase Admin Dashboard",
  description: "Manage and view all audit logs on the SpendEase Admin Dashboard",
};

export default async function AuditLogsPage() {
  const result = await fetchAuditLogs({ page: 1, pageSize: 10 });

  if ("success" in result) {
    if (result.unauthorized) {
      redirect("/auth/login");
    }
    return (
      <div className="container mx-auto py-10">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <h2 className="text-destructive mb-2 text-2xl font-bold">Error</h2>
            <p className="text-muted-foreground">{result.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const apiResponse = result;

  return (
    <div className="container mx-auto">
      <div className="mb-4 md:mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">Manage and view all audit logs</p>
      </div>
      <AuditLogsClient
        initialData={apiResponse.data.data}
        initialPagination={{
          totalItems: apiResponse.data.paging.total_items,
          currentPage: apiResponse.data.paging.current,
          pageSize: apiResponse.data.paging.page_size,
        }}
      />
    </div>
  );
}
