"use client";

import { useState, useMemo, useEffect } from "react";

import { Briefcase, LayoutGrid, List, Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { partners } from "@/lib/dummy-data";

import { partnerBalanceColumns } from "./_components/partner-balance-columns";

export default function PartnerBalancePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Filter partners based on search and status
  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      const matchesSearch =
        partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || partner.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const table = useDataTableInstance({
    data: filteredPartners,
    columns: partnerBalanceColumns,
  });

  // Reset to first page when filters change
  useEffect(() => {
    table.setPageIndex(0);
  }, [searchQuery, statusFilter, table]);

  const handleExport = () => {
    const csvContent = [
      ["Partner Name", "Email", "Last Login", "Status", "Account Balance"],
      ...filteredPartners.map((partner) => [
        partner.name,
        partner.email,
        partner.lastLogin,
        partner.status,
        `${partner.currency} ${partner.balance}`,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "partner-balance.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Partner Balance</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <div className="flex items-center gap-1 rounded-lg border p-1">
            <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Filter transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Partners" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Partners</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPartners.map((partner) => (
            <div key={partner.id} className="space-y-4 rounded-lg border p-6 transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                  <Briefcase className="text-muted-foreground h-5 w-5" />
                </div>
                <Badge
                  variant={
                    partner.status === "Active" ? "default" : partner.status === "Pending" ? "secondary" : "outline"
                  }
                  className={
                    partner.status === "Active"
                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                      : partner.status === "Pending"
                        ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                        : ""
                  }
                >
                  {partner.status}
                </Badge>
              </div>
              <div>
                <h3 className="text-muted-foreground mb-1 text-sm font-semibold">{partner.name}</h3>
                <p className="text-2xl font-bold">
                  {partner.currency}
                  {partner.balance}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div>Coming soon</div>
          {/* <DataTable table={table} columns={partnerBalanceColumns} /> */}
        </>
      )}
    </div>
  );
}
