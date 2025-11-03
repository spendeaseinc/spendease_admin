"use client";

import { useState } from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import type { CustomerTransaction } from "@/lib/types";

import { transactionColumns } from "./customer-detail-columns";

interface TransactionsTabProps {
  transactions: CustomerTransaction[];
}

export function TransactionsTab({ transactions }: TransactionsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const transactionTable = useDataTableInstance({
    data: transactions,
    columns: transactionColumns,
    getRowId: (row) => row.id,
  });

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filter tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-2">
              Status
              <span className="font-normal">Active, Pending</span>
            </Badge>
            <Badge variant="outline" className="gap-2">
              Transaction Type
              <span className="font-normal">3 Selected</span>
            </Badge>
            <Button variant="ghost" size="sm">
              Reset ✕
            </Button>
          </div>
          <Button variant="outline" size="sm" className="ml-auto gap-2 bg-transparent">
            View
          </Button>
        </div>

        <div className="overflow-hidden rounded-md border">
          <DataTable table={transactionTable} columns={transactionColumns} />
        </div>
        <DataTablePagination table={transactionTable} />
      </CardContent>
    </Card>
  );
}
