"use client";

import { useCallback, useEffect, useState, useRef } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { fetchTeams } from "@/app/actions/teams";
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
  const [isLoading, setIsLoading] = useState(false);

  const isFetchingRef = useRef(false);

  const fetchData = useCallback(async () => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const result = await fetchTeams({
        page: currentPage,
        limit: pageSize,
        search: searchValue || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        role_id: roleFilter !== "all" ? parseInt(roleFilter) : undefined,
      });

      if ("success" in result) {
        if (result.unauthorized) {
          toast.error("Please log in to view teams.");
          router.push("/login");
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
  }, [currentPage, pageSize, searchValue, statusFilter, roleFilter, router]);

  const handleReset = useCallback(() => {
    setSearchValue("");
    setStatusFilter("all");
    setRoleFilter("all");
    setCurrentPage(1);
  }, []);

  const handleExport = useCallback(() => {
    try {
      const headers = ["ID", "Name", "Email", "Phone", "Role", "Status", "Created At"];
      const csvRows = [
        headers.join(","),
        ...data.map((member) => {
          const row = [
            `"${member.id}"`,
            `"${member.first_name} ${member.last_name}"`,
            `"${member.email}"`,
            `"${member.phone}"`,
            `"${member.admin_role.name}"`,
            `"${member.status}"`,
            `"${new Date(member.created_at).toLocaleString()}"`,
          ];
          return row.join(",");
        }),
      ];

      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", `team-members-${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${data.length} team member records to CSV`);
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Error exporting data");
    }
  }, [data]);

  useEffect(() => {
    // Reset to page 1 when filters change
    const isFilterChange = searchValue || statusFilter !== "all" || roleFilter !== "all";

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
  }, [searchValue, statusFilter, roleFilter, currentPage, pageSize, fetchData]);

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
      isLoading={isLoading}
      onReset={handleReset}
      onExport={handleExport}
    />
  );
}
