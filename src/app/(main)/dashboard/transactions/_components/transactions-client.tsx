"use client";

import { useCallback, useEffect, useState, useRef } from "react";

import { useRouter } from "next/navigation";

import { format } from "date-fns";
import { toast } from "sonner";

import { fetchTransactions, exportTransactions } from "@/app/actions/transactions";
import type { WalletTransaction } from "@/lib/types";

import { createColumns } from "./columns";
import { DataTable } from "./data-table";
import { TransactionDetailSheet } from "./transaction-detail-sheet";

interface TransactionsClientProps {
  initialData: WalletTransaction[];
  initialPagination: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
  };
}

const buildFetchParams = (
  currentPage: number,
  pageSize: number,
  searchValue: string,
  currencyFilter: string,
  typeFilter: string,
  statusFilter: string,
  dateFrom: Date | undefined,
  dateTo: Date | undefined,
) => ({
  page: currentPage,
  pageSize: pageSize,
  search: searchValue || undefined,
  currency: currencyFilter !== "all" ? currencyFilter : undefined,
  type: typeFilter !== "all" ? typeFilter : undefined,
  status: statusFilter !== "all" ? statusFilter : undefined,
  dateFrom: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
  dateTo: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
});

export function TransactionsClient({ initialData, initialPagination }: TransactionsClientProps) {
  const router = useRouter();
  const [data, setData] = useState<WalletTransaction[]>(initialData);
  const [totalItems, setTotalItems] = useState(initialPagination.totalItems);
  const [currentPage, setCurrentPage] = useState(initialPagination.currentPage);
  const [pageSize, setPageSize] = useState(initialPagination.pageSize);
  const [searchValue, setSearchValue] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isExportLoading, setIsExportLoading] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const isFetchingRef = useRef(false);
  const prevFiltersRef = useRef({ searchValue, currencyFilter, typeFilter, statusFilter, dateFrom, dateTo });

  const handleViewDetails = useCallback((id: number) => {
    setSelectedTransactionId(id);
    setIsSheetOpen(true);
  }, []);

  const columns = createColumns(handleViewDetails);

  const fetchData = useCallback(async () => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const params = buildFetchParams(
        currentPage,
        pageSize,
        searchValue,
        currencyFilter,
        typeFilter,
        statusFilter,
        dateFrom,
        dateTo,
      );

      const result = await fetchTransactions(params);

      if ("success" in result) {
        if (result.unauthorized) {
          toast.error("Please log in to view audit logs.");
          router.push("/auth/login");
        } else {
          toast.error(result.message);
        }
        return;
      }

      setData(result.data.data);
      setTotalItems(result.data.paging.total_items);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Error fetching transactions");
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentPage, pageSize, searchValue, currencyFilter, typeFilter, statusFilter, dateFrom, dateTo, router]);

  const handleReset = useCallback(() => {
    setSearchValue("");
    setCurrencyFilter("all");
    setTypeFilter("all");
    setStatusFilter("all");
    setDateFrom(undefined);
    setDateTo(undefined);
    setCurrentPage(1);
  }, []);

  const handleExport = useCallback(async () => {
    try {
      setIsExportLoading(true);
      const result = await exportTransactions({
        search: searchValue || undefined,
        currency: currencyFilter !== "all" ? currencyFilter : undefined,
        type: typeFilter !== "all" ? typeFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        dateFrom: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
        dateTo: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
      });

      if ("success" in result) {
        if (result.unauthorized) {
          toast.error("Please log in to export transactions.");
          router.push("/auth/login");
        } else {
          toast.error(result.message);
        }
        return;
      }

      const blob = result;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `transactions-${new Date().toISOString().split("T")[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Successfully exported transaction data");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Error exporting data");
    } finally {
      setIsExportLoading(false);
    }
  }, [searchValue, currencyFilter, typeFilter, statusFilter, dateFrom, dateTo, router]);

  useEffect(() => {
    const filtersChanged =
      prevFiltersRef.current.searchValue !== searchValue ||
      prevFiltersRef.current.currencyFilter !== currencyFilter ||
      prevFiltersRef.current.typeFilter !== typeFilter ||
      prevFiltersRef.current.statusFilter !== statusFilter ||
      prevFiltersRef.current.dateFrom !== dateFrom ||
      prevFiltersRef.current.dateTo !== dateTo;

    if (filtersChanged && currentPage !== 1) {
      prevFiltersRef.current = { searchValue, currencyFilter, typeFilter, statusFilter, dateFrom, dateTo };
      setCurrentPage(1);
      return;
    }

    prevFiltersRef.current = { searchValue, currencyFilter, typeFilter, statusFilter, dateFrom, dateTo };

    const shouldDebounce = filtersChanged;
    const timer = setTimeout(
      () => {
        fetchData();
      },
      shouldDebounce ? 500 : 0,
    );

    return () => clearTimeout(timer);
  }, [searchValue, currencyFilter, typeFilter, statusFilter, dateFrom, dateTo, currentPage, pageSize, fetchData]);

  return (
    <>
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
        currencyFilter={currencyFilter}
        onCurrencyFilterChange={setCurrencyFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
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
      <TransactionDetailSheet transactionId={selectedTransactionId} open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </>
  );
}
