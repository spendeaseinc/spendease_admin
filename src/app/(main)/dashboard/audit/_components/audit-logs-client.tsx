"use client";

import { useState } from "react";

import { AlertCircle } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import SkeletonTable from "@/components/skeleton-table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuditLogs } from "@/hooks/use-audit-logs";

import { columns } from "./columns";

export function AuditLogsClient() {
  const [page, setPage] = useState(1);
  const { auditLogs, loading, pagination, fetchAuditLogs, error } = useAuditLogs(page);

  const renderTable = () => {
    if (loading) {
      return <SkeletonTable />;
    }

    return (
      <DataTable
        columns={columns}
        data={auditLogs}
        pagination={{
          total: pagination.total_items,
          page: pagination.current,
          limit: pagination.page_size,
        }}
        onPaginationChange={(page) => {
          setPage(page);
          fetchAuditLogs(page);
        }}
        className="[&_th]:bg-accent [&_td]:py-2 [&_th]:py-2"
      />
    );
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <CardHeader>
        <CardTitle className="text-3xl font-semibold">Audit</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {renderTable()}
      </CardContent>
    </div>
  );
}
