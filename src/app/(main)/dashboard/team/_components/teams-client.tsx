"use client";

import { useCallback, useEffect, useState, useRef } from "react";

import { useRouter } from "next/navigation";

import { format } from "date-fns";
import { toast } from "sonner";

import { fetchTeams, exportTeams } from "@/app/actions/teams";
import type { TeamMemberData, TeamMemberRole } from "@/lib/types";

import { columns } from "./columns";
import { DataTable } from "./data-table";

interface TeamsClientProps {
  initialData: TeamMemberData[];
  initialPagination: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
  };
  roles: TeamMemberRole[];
}

export function TeamsClient({ initialData, initialPagination, roles }: TeamsClientProps) {
  const router = useRouter();
  const [data, setData] = useState<TeamMemberData[]>(initialData);
  const [totalItems, setTotalItems] = useState(initialPagination.totalItems);
  const [currentPage, setCurrentPage] = useState(initialPagination.currentPage);
  const [pageSize, setPageSize] = useState(initialPagination.pageSize);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isExportLoading, setIsExportLoading] = useState(false);

  const isFetchingRef = useRef(false);
  const prevFiltersRef = useRef({ searchValue, statusFilter, roleFilter, dateFrom, dateTo });

  const fetchData = useCallback(async () => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const result = await fetchTeams({
        page: currentPage,
        pageSize: pageSize,
        search: searchValue || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        role_id: roleFilter !== "all" ? Number.parseInt(roleFilter) : undefined,
        dateFrom: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
        dateTo: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
      });

      if ("success" in result) {
        if (result.unauthorized) {
          toast.error("Please log in to view teams.");
          router.push("/auth/login");
        } else {
          toast.error(result.message);
        }
        return;
      }

      const teams = result;

      setData(teams.data.data);
      setTotalItems(teams.data.paging.total_items);
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error("Error fetching teams");
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [currentPage, pageSize, searchValue, statusFilter, roleFilter, dateFrom, dateTo, router]);

  const handleReset = useCallback(() => {
    setSearchValue("");
    setStatusFilter("all");
    setRoleFilter("all");
    setDateFrom(undefined);
    setDateTo(undefined);
    setCurrentPage(1);
  }, []);

  const handleExport = useCallback(async () => {
    try {
      setIsExportLoading(true);
      const result = await exportTeams({
        search: searchValue || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        role_id: roleFilter !== "all" ? Number.parseInt(roleFilter) : undefined,
        dateFrom: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
        dateTo: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
      });

      if ("success" in result) {
        if (result.unauthorized) {
          toast.error("Please log in to export teams.");
          router.push("/login");
        } else {
          toast.error(result.message);
        }
        return;
      }

      const url = URL.createObjectURL(result);
      const link = document.createElement("a");
      link.href = url;
      link.download = `team-members-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Team members exported successfully");
    } catch (error) {
      console.error("Error exporting teams:", error);
      toast.error("Error exporting teams");
    } finally {
      setIsExportLoading(false);
    }
  }, [searchValue, statusFilter, roleFilter, dateFrom, dateTo, router]);

  useEffect(() => {
    const filtersChanged =
      prevFiltersRef.current.searchValue !== searchValue ||
      prevFiltersRef.current.statusFilter !== statusFilter ||
      prevFiltersRef.current.roleFilter !== roleFilter ||
      prevFiltersRef.current.dateFrom !== dateFrom ||
      prevFiltersRef.current.dateTo !== dateTo;

    // Reset to page 1 only when filters change, not when they're just active
    if (filtersChanged && currentPage !== 1) {
      prevFiltersRef.current = { searchValue, statusFilter, roleFilter, dateFrom, dateTo };
      setCurrentPage(1);
      return;
    }

    // Update the ref after checking
    prevFiltersRef.current = { searchValue, statusFilter, roleFilter, dateFrom, dateTo };

    // Debounce search/filter changes, immediate for pagination
    const shouldDebounce = filtersChanged;
    const timer = setTimeout(
      () => {
        fetchData();
      },
      shouldDebounce ? 500 : 0,
    );

    return () => clearTimeout(timer);
  }, [searchValue, statusFilter, roleFilter, dateFrom, dateTo, currentPage, pageSize, fetchData]);

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
      roleFilter={roleFilter}
      onRoleFilterChange={setRoleFilter}
      roles={roles}
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
