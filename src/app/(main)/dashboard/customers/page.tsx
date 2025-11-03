"use client";

import { useState } from "react";

import { Download, Search, Users, UserCheck, UserX } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { customers } from "@/lib/dummy-data";

import { customersColumns } from "./_components/customers-columns";

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState<"all" | "verified" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter customers based on active tab and search
  const filteredCustomers = customers.filter((customer) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "verified" && customer.status === "verified") ||
      (activeTab === "pending" && customer.status === "pending");

    const matchesSearch =
      searchQuery === "" ||
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phoneNumber.includes(searchQuery);

    return matchesTab && matchesSearch;
  });

  const table = useDataTableInstance({
    data: filteredCustomers,
    columns: customersColumns,
    getRowId: (row) => row.id,
  });

  // Calculate stats
  const totalCustomers = 400000;
  const activeCustomers = 2350;
  const inactiveUsers = 12234;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Customers</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <span className="text-muted-foreground">13 June 2023 - 14 July 2023</span>
          </Button>
          <Button size="sm" className="gap-2">
            <Download className="size-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <div className="rounded-full bg-orange-500/10 p-2">
              <Users className="size-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers.toLocaleString()}</div>
            <p className="text-xs text-green-600">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <div className="rounded-full bg-blue-500/10 p-2">
              <UserCheck className="size-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCustomers.toLocaleString()}</div>
            <p className="text-xs text-green-600">+180.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
            <div className="rounded-full bg-gray-500/10 p-2">
              <UserX className="size-4 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveUsers.toLocaleString()}</div>
            <p className="text-xs text-green-600">+19% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <CardContent className="space-y-4">
          {/* Tabs */}
          <div className="flex justify-between">
            <div className="flex items-center gap-6 border-b">
              <button
                onClick={() => setActiveTab("all")}
                className={`pb-3 text-sm font-medium transition-colors ${
                  activeTab === "all"
                    ? "border-foreground text-foreground border-b-2"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("verified")}
                className={`pb-3 text-sm font-medium transition-colors ${
                  activeTab === "verified"
                    ? "border-foreground text-foreground border-b-2"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Verified
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`pb-3 text-sm font-medium transition-colors ${
                  activeTab === "pending"
                    ? "border-foreground text-foreground border-b-2"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Pending
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  placeholder="Filter transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-md border">
            <DataTable table={table} columns={customersColumns} />
          </div>

          {/* Pagination */}
          <DataTablePagination table={table} />
        </CardContent>
      </Card>
    </div>
  );
}
