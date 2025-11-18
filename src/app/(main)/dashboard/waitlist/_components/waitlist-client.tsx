"use client";

import { useCallback, useEffect, useState, useRef } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { fetchWaitlist } from "@/app/actions/waitlist";
import type { WaitlistEntry } from "@/lib/types";

import { columns } from "./columns";
import { DataTable } from "./data-table";

interface WaitlistClientProps {
  initialData: WaitlistEntry[];
  initialPagination: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
  };
}

export function WaitlistClient({ initialData, initialPagination }: WaitlistClientProps) {
  const router = useRouter();
  const [data, setData] = useState<WaitlistEntry[]>(initialData);
  const [totalItems, setTotalItems] = useState(initialPagination.totalItems);
  const [currentPage, setCurrentPage] = useState(initialPagination.currentPage);
  const [pageSize, setPageSize] = useState(initialPagination.pageSize);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const isFetchingRef = useRef(false);

  const fetchData = useCallback(async () => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const result = await fetchWaitlist({
        page: currentPage,
        limit: pageSize,
        email: searchValue || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });

      if ("success" in result) {
        if (result.unauthorized) {
          toast.error("Please log in to view waitlist.");
          router.push("/login");
        } else {
          toast.error(result.message);
        }
        return;
      }

      setData(result.data.data);
      setTotalItems(result.data.paging.total_items);
    } catch (error) {
      console.error("Error fetching waitlist:", error);
      toast.error("Error fetching waitlist");
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentPage, pageSize, searchValue, statusFilter, router]);

  const handleReset = useCallback(() => {
    setSearchValue("");
    setStatusFilter("all");
    setCurrentPage(1);
  }, []);

  const handleExport = useCallback(() => {
    try {
      const headers = ["ID", "Email", "Status", "Created At", "Updated At"];
      const csvRows = [
        headers.join(","),
        ...data.map((entry) => {
          const row = [
            `"${entry.id}"`,
            `"${entry.email}"`,
            `"${entry.status}"`,
            `"${new Date(entry.createdAt).toLocaleString()}"`,
            `"${new Date(entry.updatedAt).toLocaleString()}"`,
          ];
          return row.join(",");
        }),
      ];

      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", `waitlist-${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${data.length} waitlist entries to CSV`);
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Error exporting data");
    }
  }, [data]);

  useEffect(() => {
    const isFilterChange = searchValue || statusFilter !== "all";

    if (isFilterChange && currentPage !== 1) {
      setCurrentPage(1);
      return;
    }

    const shouldDebounce = isFilterChange;
    const timer = setTimeout(
      () => {
        fetchData();
      },
      shouldDebounce ? 500 : 0,
    );

    return () => clearTimeout(timer);
  }, [searchValue, statusFilter, currentPage, pageSize, fetchData]);

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
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      isLoading={isLoading}
      onReset={handleReset}
      onExport={handleExport}
    />
  );
}
