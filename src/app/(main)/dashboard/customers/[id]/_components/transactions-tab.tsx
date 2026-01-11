/* eslint-disable prettier/prettier */
"use client";

import { useCallback, useState, useTransition } from "react";

import { format } from "date-fns";

import { fetchCustomerTransactions } from "@/app/actions/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PaginationData, WalletTransaction } from "@/lib/types";
import { getStatusVariant } from "@/lib/utils";

import { TransactionDetailSheet } from "./transaction-detail-sheet";
import { TransactionsTablePagination } from "./transactions-table-pagination";
import { TransactionsTableToolbar } from "./transactions-table-toolbar";

interface TransactionsTabProps {
  customerId: string;
  initialTransactions: WalletTransaction[];
  initialPaging: PaginationData;
}

// Transaction type options matching backend enum
const TRANSACTION_TYPES = [
  { value: "all", label: "All Types" },
  { value: "transaction-swap", label: "Transaction Swap" },
  { value: "pay-in", label: "Pay In" },
  { value: "pay-out", label: "Pay Out" },
  { value: "internal-transfer", label: "Internal Transfer" },
  { value: "currency-swap", label: "Currency Swap" },
  { value: "deposit", label: "Deposit" },
  { value: "withdrawal", label: "Withdrawal" },
  { value: "fee", label: "Fee" },
  { value: "refund", label: "Refund" },
  { value: "adjustment", label: "Adjustment" },
];

// Status options matching backend enum
const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
  { value: "underpaid", label: "Underpaid" },
  { value: "overpaid", label: "Overpaid" },
  { value: "expired", label: "Expired" },
];

// Currency options
const CURRENCY_OPTIONS = [
  { value: "all", label: "All Currencies" },
  { value: "NGN", label: "NGN" },
  { value: "USD", label: "USD" },
  { value: "KES", label: "KES" },
  { value: "GHS", label: "GHS" },
  { value: "ZAR", label: "ZAR" },
];

export function TransactionsTab({
  customerId,
  initialTransactions,
  initialPaging,
}: TransactionsTabProps) {
  const [isPending, startTransition] = useTransition();
  const [transactions, setTransactions] = useState<WalletTransaction[]>(initialTransactions);
  const [paging, setPaging] = useState<PaginationData>(initialPaging);
  const [selectedTransaction, setSelectedTransaction] = useState<WalletTransaction | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Filter states
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currencyFilter, setCurrencyFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTransactions = useCallback(
    (page: number = 1) => {
      startTransition(async () => {
        const result = await fetchCustomerTransactions({
          userId: customerId,
          page,
          status: statusFilter !== "all" ? statusFilter : undefined,
          type: typeFilter !== "all" ? typeFilter : undefined,
          currency: currencyFilter !== "all" ? currencyFilter : undefined,
          search: searchValue || undefined,
          dateFrom: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
          dateTo: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
        });

        if ("status" in result && result.status) {
          setTransactions(result.data.data);
          setPaging(result.data.paging);
          setCurrentPage(page);
        }
      });
    },
    [customerId, statusFilter, typeFilter, currencyFilter, searchValue, dateFrom, dateTo]
  );

  const handleReset = () => {
    setSearchValue("");
    setStatusFilter("all");
    setTypeFilter("all");
    setCurrencyFilter("all");
    setDateFrom(undefined);
    setDateTo(undefined);
    setCurrentPage(1);

    startTransition(async () => {
      const result = await fetchCustomerTransactions({ userId: customerId, page: 1 });
      if ("status" in result && result.status) {
        setTransactions(result.data.data);
        setPaging(result.data.paging);
      }
    });
  };

  const handleViewDetails = (transaction: WalletTransaction) => {
    setSelectedTransaction(transaction);
    setIsSheetOpen(true);
  };

  const handlePageChange = (page: number) => {
    fetchTransactions(page);
  };

  // Apply filters
  const handleApplyFilters = () => {
    fetchTransactions(1);
  };

  const formatCurrency = (amount: string | number | undefined | null, currency: string) => {
    if (amount === undefined || amount === null) {
      return `${currency || "—"} 0.00`;
    }
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(num)) {
      return `${currency || "—"} 0.00`;
    }
    return `${currency || "—"} ${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateStr: string | undefined | null) => {
    if (!dateStr) return "—";
    try {
      return format(new Date(dateStr), "MMM dd, yyyy HH:mm");
    } catch {
      return dateStr;
    }
  };

  const formatType = (type: string | undefined | null) => {
    if (!type) return "—";
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Filters</CardTitle>
          <CardDescription>Filter transactions by status, type, currency, and date range</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionsTableToolbar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            currencyFilter={currencyFilter}
            onCurrencyFilterChange={setCurrencyFilter}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            onApply={handleApplyFilters}
            onReset={handleReset}
            isLoading={isPending}
            statusOptions={STATUS_OPTIONS}
            typeOptions={TRANSACTION_TYPES}
            currencyOptions={CURRENCY_OPTIONS}
          />
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Transaction History</CardTitle>
              <CardDescription>
                {paging.total_items > 0
                  ? `Showing ${transactions.length} of ${paging.total_items} transactions`
                  : "No transactions found"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Reference</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Balance Before</TableHead>
                  <TableHead>Balance After</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
                        <span className="ml-2">Loading...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-muted-foreground h-24 text-center">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      className="group cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewDetails(transaction)}
                    >
                      <TableCell className="font-mono text-xs">{transaction.reference}</TableCell>
                      <TableCell>
                        <span className="text-sm capitalize">{formatType(transaction.type)}</span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(transaction.status)} className="capitalize">
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm">
                        {transaction.description}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatCurrency(transaction.balance_before, transaction.currency)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatCurrency(transaction.balance_after, transaction.currency)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(transaction.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(transaction);
                          }}
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {paging.total_items > 0 && (
            <div className="mt-4">
              <TransactionsTablePagination
                currentPage={currentPage}
                totalPages={Math.ceil(paging.total_items / (paging.page_size || 10))}
                totalItems={paging.total_items}
                pageSize={paging.page_size || 10}
                onPageChange={handlePageChange}
                isLoading={isPending}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Detail Sheet */}
      <TransactionDetailSheet
        transaction={selectedTransaction}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </div>
  );
}
