"use client";

import { useCallback, useEffect, useState, useRef } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { fetchVerifications, fetchVerificationStats } from "@/app/actions/verifications";
import { VerificationRequest, VerificationStats } from "@/lib/types/verification";

import { columns } from "./columns";
import { DataTable } from "./data-table";

interface VerificationsClientProps {
  initialData: VerificationRequest[];
  initialPagination: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
  };
}

export function VerificationsClient({ initialData, initialPagination }: VerificationsClientProps) {
  const router = useRouter();

  const [data, setData] = useState<VerificationRequest[]>(initialData);
  const [stats, setStats] = useState<VerificationStats | null>(null);

  const [totalItems, setTotalItems] = useState(initialPagination.totalItems);
  const [currentPage, setCurrentPage] = useState(initialPagination.currentPage);
  const [pageSize, setPageSize] = useState(initialPagination.pageSize);

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [documentTypeFilter, setDocumentTypeFilter] = useState("all");

  const [isLoading, setIsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  // Stats fetching
  useEffect(() => {
    const loadStats = async () => {
      setIsStatsLoading(true);
      const result = await fetchVerificationStats();
      if ("success" in result && result.success === false) {
        console.error("Failed to load stats:", result.message);
      } else if (!("success" in result)) {
        // According to our ApiResponse type, successful responses don't always have success: true property explicitly
        // If it's not an ApiError (which has success: boolean), it's a success response
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setStats(result.data as any);
      }
      setIsStatsLoading(false);
    };
    loadStats();
  }, []);

  const isFetchingRef = useRef(false);
  const prevFiltersRef = useRef({ searchValue, statusFilter, documentTypeFilter });

  const fetchData = useCallback(async () => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const result = await fetchVerifications({
        page: currentPage,
        pageSize: pageSize,
        search: searchValue || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        document_type: documentTypeFilter !== "all" ? documentTypeFilter : undefined,
      });

      if ("success" in result && result.success === false) {
        if (result.unauthorized) {
          toast.error("Please log in to view verifications.");
          router.push("/auth/login");
        } else {
          toast.error(result.message);
        }
        return;
      }

      // Type assertion as we know the structure of success response
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = result as any;

      setData(response.data.data);
      setTotalItems(response.data.paging.total_items);
    } catch (error) {
      console.error("Error fetching verifications:", error);
      toast.error("Error fetching verifications");
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentPage, pageSize, searchValue, statusFilter, documentTypeFilter, router]);

  const handleReset = useCallback(() => {
    setSearchValue("");
    setStatusFilter("all");
    setDocumentTypeFilter("all");
    setCurrentPage(1);
  }, []);

  // Effect to handle filter changes and debouncing
  useEffect(() => {
    const filtersChanged =
      prevFiltersRef.current.searchValue !== searchValue ||
      prevFiltersRef.current.statusFilter !== statusFilter ||
      prevFiltersRef.current.documentTypeFilter !== documentTypeFilter;

    if (filtersChanged && currentPage !== 1) {
      prevFiltersRef.current = { searchValue, statusFilter, documentTypeFilter };
      setCurrentPage(1);
      return;
    }

    prevFiltersRef.current = { searchValue, statusFilter, documentTypeFilter };

    const shouldDebounce = filtersChanged;
    const timer = setTimeout(
      () => {
        fetchData();
      },
      shouldDebounce ? 500 : 0,
    );

    return () => clearTimeout(timer);
  }, [searchValue, statusFilter, documentTypeFilter, currentPage, pageSize, fetchData]);

  return (
    <DataTable
      columns={columns}
      data={data}
      stats={stats}
      totalItems={totalItems}
      currentPage={currentPage}
      pageSize={pageSize}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      documentTypeFilter={documentTypeFilter}
      onDocumentTypeFilterChange={setDocumentTypeFilter}
      isLoading={isLoading}
      isStatsLoading={isStatsLoading}
      onReset={handleReset}
      onRefresh={fetchData}
    />
  );
}
