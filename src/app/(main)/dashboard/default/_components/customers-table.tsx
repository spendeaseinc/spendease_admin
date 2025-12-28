"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { fetchUsers } from "@/app/actions/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/lib/types";

import { columns } from "./columns";
import { DataTable } from "./data-table";

interface DashboardCustomersTableProps {
  initialData: User[];
  initialPagination: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
  };
}

export function DashboardCustomersTable({ initialData, initialPagination }: DashboardCustomersTableProps) {
  const router = useRouter();
  const [data, setData] = useState<User[]>(initialData);
  const [totalItems, setTotalItems] = useState(initialPagination.totalItems);
  const [currentPage, setCurrentPage] = useState(initialPagination.currentPage);
  const [pageSize, setPageSize] = useState(initialPagination.pageSize);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isFetchingRef = useRef(false);
  const prevFiltersRef = useRef({ searchValue });

  const fetchData = useCallback(async () => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const result = await fetchUsers({
        page: currentPage,
        pageSize: pageSize,
        search: searchValue || undefined,
      });

      if ("success" in result) {
        if (result.unauthorized) {
          toast.error("Please log in to view customers.");
          router.push("/");
        } else {
          toast.error(result.message);
        }
        return;
      }

      setData(result.data.data);
      setTotalItems(result.data.paging.total_items);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Error fetching customers");
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentPage, pageSize, searchValue, router]);

  const handleReset = useCallback(() => {
    setSearchValue("");
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    const filtersChanged = prevFiltersRef.current.searchValue !== searchValue;

    if (filtersChanged && currentPage !== 1) {
      prevFiltersRef.current = { searchValue };
      setCurrentPage(1);
      return;
    }

    prevFiltersRef.current = { searchValue };

    const shouldDebounce = filtersChanged;
    const timer = setTimeout(
      () => {
        fetchData();
      },
      shouldDebounce ? 500 : 0,
    );

    return () => clearTimeout(timer);
  }, [searchValue, currentPage, pageSize, fetchData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Customers</CardTitle>
      </CardHeader>
      <CardContent>
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
          isLoading={isLoading}
          onReset={handleReset}
        />
      </CardContent>
    </Card>
  );
}
