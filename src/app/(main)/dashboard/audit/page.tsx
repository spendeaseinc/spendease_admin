"use client";

import { useState, useMemo } from "react";

import { Download, Filter, SlidersHorizontal } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { auditLogs as initialAuditLogs } from "@/lib/dummy-data";

import { auditColumns } from "./_components/audit-columns";

export default function AuditPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filteredLogs = useMemo(() => {
    return initialAuditLogs.filter((log) => {
      const matchesSearch =
        log.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesEvent = eventFilter === "all" || log.event === eventFilter;
      const matchesRole = roleFilter === "all" || log.role === roleFilter;
      return matchesSearch && matchesEvent && matchesRole;
    });
  }, [searchQuery, eventFilter, roleFilter]);

  const table = useDataTableInstance({
    data: filteredLogs,
    columns: auditColumns,
    enableRowSelection: true,
    defaultPageSize: 10,
  });

  const handleExport = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const logsToExport = selectedRows.length > 0 ? selectedRows.map((row) => row.original) : filteredLogs;

    const csvContent = [
      ["Name", "Event", "Reference", "Description", "Role", "Timestamp"],
      ...logsToExport.map((log) => [log.name, log.event, log.reference, log.description, log.role, log.timestamp]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="bg-card border-b px-6 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Audit</h1>
          <Button onClick={handleExport} variant="default" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Search audit logs..."
              className="max-w-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Event {eventFilter !== "all" && `(${eventFilter})`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setEventFilter("all")}>All Events</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEventFilter("Login")}>Login</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEventFilter("User authentication")}>
                User authentication
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Role {roleFilter !== "all" && `(${roleFilter})`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setRoleFilter("all")}>All Roles</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter("Viewer")}>Viewer</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter("Admin")}>Admin</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter("Analyst")}>Analyst</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter("Product Manager")}>Product Manager</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter("Super Admin")}>Super Admin</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" className="gap-2 bg-transparent">
            <SlidersHorizontal className="h-4 w-4" />
            View
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <DataTable table={table} columns={auditColumns} />
      </div>

      <div className="bg-card border-t px-6 py-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
