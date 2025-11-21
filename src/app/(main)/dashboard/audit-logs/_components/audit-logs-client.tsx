"use client";

import { useCallback, useEffect, useState, useRef } from "react";

import { useRouter } from "next/navigation";

import { format } from "date-fns";
import { toast } from "sonner";

import { fetchAuditLogs, exportAuditLogs } from "@/app/actions/audit-logs";
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
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isExportLoading, setIsExportLoading] = useState(false);

  const isFetchingRef = useRef(false);
  const prevFiltersRef = useRef({ searchValue, eventFilter, actorFilter, dateFrom, dateTo });

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
        dateFrom: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
        dateTo: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
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
  }, [currentPage, pageSize, searchValue, eventFilter, actorFilter, dateFrom, dateTo, router]);

  const handleReset = useCallback(() => {
    setSearchValue("");
    setEventFilter("all");
    setActorFilter("all");
    setDateFrom(undefined);
    setDateTo(undefined);
    setCurrentPage(1);
  }, []);

  const handleExport = useCallback(async () => {
    try {
      setIsExportLoading(true);
      const result = await exportAuditLogs({
        search: searchValue || undefined,
        event: eventFilter !== "all" ? eventFilter : undefined,
        actor: actorFilter !== "all" ? actorFilter : undefined,
        dateFrom: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
        dateTo: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
      });

      if ("success" in result) {
        if (result.unauthorized) {
          toast.error("Please log in to export audit logs.");
          router.push("/auth/login");
        } else {
          toast.error(result.message);
        }
        return;
      }

      // Create download link for the blob
      const blob = result;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `audit-logs-${new Date().toISOString().split("T")[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Successfully exported audit log data");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Error exporting data");
    } finally {
      setIsExportLoading(false);
    }
  }, [searchValue, eventFilter, actorFilter, dateFrom, dateTo, router]);

  useEffect(() => {
    const filtersChanged =
      prevFiltersRef.current.searchValue !== searchValue ||
      prevFiltersRef.current.eventFilter !== eventFilter ||
      prevFiltersRef.current.actorFilter !== actorFilter ||
      prevFiltersRef.current.dateFrom !== dateFrom ||
      prevFiltersRef.current.dateTo !== dateTo;

    // Reset to page 1 only when filters change, not when they're just active
    if (filtersChanged && currentPage !== 1) {
      prevFiltersRef.current = { searchValue, eventFilter, actorFilter, dateFrom, dateTo };
      setCurrentPage(1);
      return;
    }

    // Update the ref after checking
    prevFiltersRef.current = { searchValue, eventFilter, actorFilter, dateFrom, dateTo };

    // Debounce search/filter changes, immediate for pagination
    const shouldDebounce = filtersChanged;
    const timer = setTimeout(
      () => {
        fetchData();
      },
      shouldDebounce ? 500 : 0,
    );

    return () => clearTimeout(timer);
  }, [searchValue, eventFilter, actorFilter, dateFrom, dateTo, currentPage, pageSize, fetchData]);

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
      dateFrom={dateFrom}
      onDateFromChange={setDateFrom}
      dateTo={dateTo}
      onDateToChange={setDateTo}
      isLoading={isLoading}
      isExportLoading={isExportLoading}
      onReset={handleReset}
      onExport={handleExport}
    />
  );
}
