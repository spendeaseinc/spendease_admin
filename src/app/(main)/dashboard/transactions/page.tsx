/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client";

import { useState } from "react";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { transactions as dummyTransactions } from "@/lib/dummy-data";
import type { Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";

import { DataTable } from "./_components/data-table";
import { TransactionDetailsPanel } from "./_components/transaction-details-panel";

export default function Page() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "deposits" | "withdrawals">("all");

  const totalBalance = 400234;
  const totalDeposits = 22400234;
  const totalWithdrawals = 20000234;

  const filteredTransactions = dummyTransactions.filter((transaction) => {
    if (activeTab === "all") return true;
    if (activeTab === "deposits") return transaction.type === "Deposit";
    if (activeTab === "withdrawals") return transaction.type === "Withdrawal";
    return true;
  });

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "userId",
      header: "User ID",
      cell: ({ row }) => <div className="text-sm">{row.original.userId}</div>,
    },
    {
      accessorKey: "accountName",
      header: "Account name",
      cell: ({ row }) => <div className="text-sm">{row.original.accountName}</div>,
    },
    {
      accessorKey: "sessionId",
      header: "Session ID",
      cell: ({ row }) => <div className="text-sm">{row.original.sessionId}</div>,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => <div className="text-sm">{row.original.date}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span
            className={cn(
              "inline-flex rounded-full px-2 py-1 text-xs font-medium",
              status === "Successful" && "bg-green-100 text-green-700",
              status === "Pending" && "bg-orange-100 text-orange-700",
              status === "Failed" && "bg-red-100 text-red-700",
            )}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Account Balance</div>,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div
            className={cn(
              "text-right text-sm font-medium",
              transaction.type === "Withdrawal" ? "text-red-600" : "text-green-600",
            )}
          >
            {transaction.type === "Withdrawal" ? "- " : ""}
            {transaction.currency} {transaction.amount}
          </div>
        );
      },
    },
  ];

  const table = useDataTableInstance({
    data: filteredTransactions,
    columns,
    enableRowSelection: false,
    defaultPageSize: 10,
  });

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedTransaction(null), 300);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Transaction</h1>
          {/*
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Calendar className="h-4 w-4" />
              13 June 2023 - 14 July 2023
            </Button>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
          */}
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Deposits</p>
                  <p className="mt-2 text-2xl font-bold">Naira: ₦{totalDeposits.toLocaleString()}</p>
                  <p className="text-muted-foreground mt-1 text-xs">+180.1% from last month</p>
                </div>
                <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Withdrawals</p>
                  <p className="mt-2 text-2xl font-bold">₦{totalWithdrawals.toLocaleString()}</p>
                  <p className="text-muted-foreground mt-1 text-xs">+19% from last month</p>
                </div>
                <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Table */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="deposits">Deposits</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-6">
          <div className="rounded-md border">
            <div
              className="hover:[&_tbody_tr]:bg-muted/50 [&_tbody_tr]:cursor-pointer [&_tbody_tr]:transition-colors"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                const row = target.closest("tr");
                if (row && row.dataset.index) {
                  const index = Number.parseInt(row.dataset.index);
                  // eslint-disable-next-line security/detect-object-injection
                  const transaction = filteredTransactions[index];

                  if (transaction) {
                    handleRowClick(transaction);
                  }
                }
              }}
            >
              <DataTable table={table} columns={columns} />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <DataTablePagination table={table} />
        </div>
      </div>

      {/* Transaction Details Panel */}
      <TransactionDetailsPanel transaction={selectedTransaction} isOpen={isPanelOpen} onClose={handleClosePanel} />
    </>
  );
}
