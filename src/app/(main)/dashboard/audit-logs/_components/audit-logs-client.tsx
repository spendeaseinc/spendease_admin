"use client";

import { useCallback, useEffect, useState, useRef } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { fetchAuditLogs } from "@/app/actions/audit-logs";
import type { AuditLog } from "@/lib/types";

import { columns } from "./columns";
import { DataTable } from "./data-table";

interface AuditLogsClientProps {
  initialData: AuditLog[];
  initialPagination: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
  };
}

export function AuditLogsClient({ initialData, initialPagination }: AuditLogsClientProps) {
  const router = useRouter();
  const [data, setData] = useState<AuditLog[]>(initialData);
  const [totalItems, setTotalItems] = useState(initialPagination.totalItems);
  const [currentPage, setCurrentPage] = useState(initialPagination.currentPage);
  const [pageSize, setPageSize] = useState(initialPagination.pageSize);
  const [searchValue, setSearchValue] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [actorFilter, setActorFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const isFetchingRef = useRef(false);

  const fetchData = useCallback(async () => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const result = await fetchAuditLogs({
        page: currentPage,
        pageSize: pageSize,
        search: searchValue || undefined,
        event: eventFilter !== "all" ? eventFilter : undefined,
        actor: actorFilter !== "all" ? actorFilter : undefined,
      });

      if ("success" in result) {
        if (result.unauthorized) {
          toast.error("Please log in to view audit logs.");
          router.push("/login");
        } else {
          toast.error(result.message);
        }
        return;
      }

      const audits = result;

      setData(audits.data.data);
      setTotalItems(audits.data.paging.total_items);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      toast.error("Error fetching audit logs");
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentPage, pageSize, searchValue, eventFilter, actorFilter, router]);

  const handleReset = useCallback(() => {
    setSearchValue("");
    setEventFilter("all");
    setActorFilter("all");
    setCurrentPage(1);
  }, []);

  const handleExport = useCallback(() => {
    try {
      const headers = ["Reference", "Event", "Description", "Actor", "Actor ID", "Created At"];
      const csvRows = [
        headers.join(","),
        ...data.map((log) => {
          const row = [
            `"${log.reference}"`,
            `"${log.event}"`,
            `"${log.description.replace(/"/g, '""')}"`,
            `"${log.actor}"`,
            `"${log.actor_id}"`,
            `"${new Date(log.createdAt).toLocaleString()}"`,
          ];
          return row.join(",");
        }),
      ];

      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", `audit-logs-${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${data.length} audit log entries to CSV`);
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Error exporting data");
    }
  }, [data]);

  useEffect(() => {
    // Reset to page 1 when filters change
    const isFilterChange = searchValue || eventFilter !== "all" || actorFilter !== "all";

    if (isFilterChange && currentPage !== 1) {
      setCurrentPage(1);
      return;
    }

    // Debounce search/filter changes, immediate for pagination
    const shouldDebounce = isFilterChange;
    const timer = setTimeout(
      () => {
        fetchData();
      },
      shouldDebounce ? 500 : 0,
    );

    return () => clearTimeout(timer);
  }, [searchValue, eventFilter, actorFilter, currentPage, pageSize, fetchData]);

  return (
    <DataTable
      columns={columns}
      data={data}
      totalItems={totalItems}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      eventFilter={eventFilter}
      onEventFilterChange={setEventFilter}
      actorFilter={actorFilter}
      onActorFilterChange={setActorFilter}
      isLoading={isLoading}
      onReset={handleReset}
      onExport={handleExport}
    />
  );
}
