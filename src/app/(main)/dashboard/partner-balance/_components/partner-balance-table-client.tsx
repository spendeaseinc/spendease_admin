"use client";

import { useState, useMemo, useEffect } from "react";

import { Briefcase, LayoutGrid, List, Download } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import type { PartnerDisplay } from "@/lib/types";

import { partnerBalanceColumns } from "./partner-balance-columns";

interface PartnerBalanceTableClientProps {
  partners: PartnerDisplay[];
}

export function PartnerBalanceTableClient({ partners }: PartnerBalanceTableClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Filter partners based on search and status
  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || partner.statusDisplay === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [partners, searchQuery, statusFilter]);

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
      ["Partner Name", "Status", "Account Balance"],
      ...filteredPartners.map((partner) => [partner.name, partner.statusDisplay, `NGN ${partner.balance}`]),
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
          placeholder="Search partners..."
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
                  variant={partner.statusDisplay === "Active" ? "default" : "secondary"}
                  className={
                    partner.statusDisplay === "Active"
                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                  }
                >
                  {partner.statusDisplay}
                </Badge>
              </div>
              <div>
                <h3 className="text-muted-foreground mb-1 text-sm font-semibold">{partner.name}</h3>
                <p className="text-2xl font-bold">NGN {partner.balance.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable table={table} columns={partnerBalanceColumns} />
      )}
    </div>
  );
}
