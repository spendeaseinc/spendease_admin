"use client";

import { useCallback, useEffect, useState, useRef } from "react";

import { useRouter } from "next/navigation";

import { format } from "date-fns";
import { toast } from "sonner";

import { fetchUsers, exportUsers } from "@/app/actions/users";
import type { User } from "@/lib/types";

import { columns } from "./columns";
import { DataTable } from "./data-table";

interface CustomersClientProps {
  initialData: User[];
  initialPagination: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
  };
}

export function CustomersClient({ initialData, initialPagination }: CustomersClientProps) {
  const router = useRouter();
  const [data, setData] = useState<User[]>(initialData);
  const [totalItems, setTotalItems] = useState(initialPagination.totalItems);
  const [currentPage, setCurrentPage] = useState(initialPagination.currentPage);
  const [pageSize, setPageSize] = useState(initialPagination.pageSize);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isExportLoading, setIsExportLoading] = useState(false);

  const isFetchingRef = useRef(false);
  const prevFiltersRef = useRef({ searchValue, statusFilter, dateFrom, dateTo });

  const fetchData = useCallback(async () => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const result = await fetchUsers({
        page: currentPage,
        pageSize: pageSize,
        search: searchValue || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        dateFrom: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
        dateTo: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
      });

      if ("success" in result) {
        if (result.unauthorized) {
          toast.error("Please log in to view customers.");
          router.push("/login");
        } else {
          toast.error(result.message);
        }
        return;
      }

      const customers = result;

      setData(customers.data.data);
      setTotalItems(customers.data.paging.total_items);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Error fetching customers");
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentPage, pageSize, searchValue, statusFilter, dateFrom, dateTo, router]);

  const handleReset = useCallback(() => {
    setSearchValue("");
    setStatusFilter("all");
    setDateFrom(undefined);
    setDateTo(undefined);
    setCurrentPage(1);
  }, []);

  const handleExport = useCallback(async () => {
    try {
      setIsExportLoading(true);
      const result = await exportUsers({
        search: searchValue || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        dateFrom: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
        dateTo: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
      });

      if ("success" in result) {
        if (result.unauthorized) {
          toast.error("Please log in to export customers.");
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
      link.setAttribute("download", `customers-${new Date().toISOString().split("T")[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Successfully exported customer data");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Error exporting data");
    } finally {
      setIsExportLoading(false);
    }
  }, [searchValue, statusFilter, dateFrom, dateTo, router]);

  useEffect(() => {
    const filtersChanged =
      prevFiltersRef.current.searchValue !== searchValue ||
      prevFiltersRef.current.statusFilter !== statusFilter ||
      prevFiltersRef.current.dateFrom !== dateFrom ||
      prevFiltersRef.current.dateTo !== dateTo;

    if (filtersChanged && currentPage !== 1) {
      prevFiltersRef.current = { searchValue, statusFilter, dateFrom, dateTo };
      setCurrentPage(1);
      return;
    }

    prevFiltersRef.current = { searchValue, statusFilter, dateFrom, dateTo };

    const shouldDebounce = filtersChanged;
    const timer = setTimeout(
      () => {
        fetchData();
      },
      shouldDebounce ? 500 : 0,
    );

    return () => clearTimeout(timer);
  }, [searchValue, statusFilter, dateFrom, dateTo, currentPage, pageSize, fetchData]);

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
      dateFrom={dateFrom}
      dateTo={dateTo}
      onDateFromChange={setDateFrom}
      onDateToChange={setDateTo}
      isLoading={isLoading}
      isExportLoading={isExportLoading}
      onReset={handleReset}
      onExport={handleExport}
    />
  );
}
