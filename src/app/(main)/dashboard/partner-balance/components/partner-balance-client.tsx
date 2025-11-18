"use client";

import { useState } from "react";

import { Building2, LayoutGrid, List, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { PartnerBalanceData } from "@/lib/types";

interface PartnerBalanceClientProps {
  data: PartnerBalanceData;
}

export function PartnerBalanceClient({ data }: PartnerBalanceClientProps) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const partners = Object.entries(data);

  const filteredPartners = partners.filter(([name]) => name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleExport = () => {
    const csvContent = [
      ["Partner", "Account Name", "Account Number", "Bank Name", "Balance"].join(","),
      ...filteredPartners.map(([name, details]) =>
        [name, details.account_name, details.account_number, details.bank_name, details.balance].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `partner-balance-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const formatPartnerName = (name: string) => {
    return name
      .replace(/([A-Z])/g, " $1")
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">Partner Balance</h1>
          <p className="text-muted-foreground">View and manage all partner balances</p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search Partners..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        <div className="ml-auto flex gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("table")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPartners.map(([name, details]) => (
            <Card key={name} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{formatPartnerName(name)}</CardTitle>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-3xl font-bold">{details.balance}</p>
                  <p className="text-muted-foreground text-sm">Current Balance</p>
                </div>
                <div className="space-y-2 border-t pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Account Name:</span>
                    <span className="font-medium">{details.account_name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Account Number:</span>
                    <span className="font-medium">{details.account_number}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bank:</span>
                    <span className="font-medium">{details.bank_name}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-accent hover:bg-accent">
                <TableHead className="rounded-tl-lg">Partner</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead>Account Number</TableHead>
                <TableHead>Bank Name</TableHead>
                <TableHead className="rounded-tr-lg text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map(([name, details]) => (
                <TableRow key={name}>
                  <TableCell className="font-medium">{formatPartnerName(name)}</TableCell>
                  <TableCell>{details.account_name}</TableCell>
                  <TableCell>{details.account_number}</TableCell>
                  <TableCell>{details.bank_name}</TableCell>
                  <TableCell className="text-right font-semibold">{details.balance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {filteredPartners.length === 0 && (
        <div className="text-muted-foreground flex h-40 items-center justify-center">
          No partners found matching your search.
        </div>
      )}
    </div>
  );
}
