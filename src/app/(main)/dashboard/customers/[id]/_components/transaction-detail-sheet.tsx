/* eslint-disable prettier/prettier */
/* eslint-disable complexity */
"use client";

import { format } from "date-fns";
import {
  ArrowDownUp,
  Banknote,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  Hash,
  User,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { WalletTransaction, WalletTransactionExtended } from "@/lib/types";

interface TransactionDetailSheetProps {
  transaction: WalletTransaction | WalletTransactionExtended | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "success":
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "processing":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "failed":
    case "expired":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  }
};

export function TransactionDetailSheet({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailSheetProps) {
  if (!transaction) return null;

  const formatCurrency = (amount: string | number | undefined | null, currency: string) => {
    if (amount === undefined || amount === null) return `${currency || "—"} 0.00`;
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(num)) return `${currency || "—"} 0.00`;
    return `${currency || "—"} ${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateStr: string | undefined | null) => {
    if (!dateStr) return "—";
    try {
      return format(new Date(dateStr), "MMM dd, yyyy");
    } catch {
      return dateStr;
    }
  };

  const formatTime = (dateStr: string | undefined | null) => {
    if (!dateStr) return "—";
    try {
      return format(new Date(dateStr), "hh:mm a");
    } catch {
      return "—";
    }
  };

  const formatType = (type: string | undefined | null) => {
    if (!type) return "—";
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Extended transaction type guard
  const isExtended = (
    tx: WalletTransaction | WalletTransactionExtended
  ): tx is WalletTransactionExtended => {
    return "meta" in tx || "fee" in tx || "processor" in tx;
  };

  const extendedTx = isExtended(transaction) ? transaction : null;

  const netChange = parseFloat(transaction.balance_after) - parseFloat(transaction.balance_before);
  const isPositiveChange = netChange >= 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-lg">
              <ArrowDownUp className="h-5 w-5 text-blue-500" />
              Transaction Details
            </SheetTitle>
          </div>
          <SheetDescription className="sr-only">
            Details for transaction {transaction.reference}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-2 space-y-6 px-4 pb-6">
          {/* Status and Type Header */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground text-sm">Status</span>
              <Badge className={getStatusColor(transaction.status)}>
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground text-sm">Type</span>
              <Badge variant="outline" className="capitalize">
                {formatType(transaction.type)}
              </Badge>
            </div>
          </div>

          {/* Amount Section */}
          <div className="space-y-4">
            <h3 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
              <Wallet className="h-4 w-4" />
              Amount
            </h3>
            <div className="space-y-3 rounded-lg border p-4">
              <div className="text-3xl font-bold">
                {formatCurrency(transaction.amount, transaction.currency)}
              </div>
              {extendedTx?.fee && parseFloat(extendedTx.fee) > 0 && (
                <p className="text-muted-foreground text-sm">
                  Fee: {formatCurrency(extendedTx.fee, transaction.currency)}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Transaction Information */}
          <div className="space-y-4">
            <h3 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
              <FileText className="h-4 w-4" />
              Transaction Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Reference</span>
                </div>
                <span className="max-w-[180px] truncate font-mono text-xs">{transaction.reference}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Currency</span>
                </div>
                <span className="text-sm">{transaction.currency}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Date</span>
                </div>
                <span className="text-sm">{formatDate(transaction.created_at)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Time</span>
                </div>
                <span className="text-sm">{formatTime(transaction.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {transaction.description && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
                  <FileText className="h-4 w-4" />
                  Description
                </h3>
                <div className="bg-muted/30 rounded-lg border p-4">
                  <p className="text-sm">{transaction.description}</p>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Balance Changes */}
          <div className="space-y-4">
            <h3 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
              <Banknote className="h-4 w-4" />
              Balance Changes
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Balance Before</span>
                <span className="text-sm">
                  {formatCurrency(transaction.balance_before, transaction.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Balance After</span>
                <span className="text-sm">
                  {formatCurrency(transaction.balance_after, transaction.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Net Change</span>
                <span
                  className={`text-sm font-semibold ${
                    isPositiveChange ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositiveChange ? "+" : ""}
                  {formatCurrency(netChange, transaction.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Beneficiary Details (if available) */}
          {extendedTx?.meta?.beneficiary && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
                  <User className="h-4 w-4" />
                  Beneficiary Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Account Name</span>
                    <span className="text-sm">{extendedTx.meta.beneficiary.account_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Account Number</span>
                    <span className="font-mono text-sm">
                      {extendedTx.meta.beneficiary.account_number}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Bank</span>
                    <span className="text-sm">{extendedTx.meta.beneficiary.bank_name}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Processing Information (if available) */}
          {extendedTx?.processor && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
                  <CreditCard className="h-4 w-4" />
                  Processing Information
                </h3>
                <div className="bg-muted/30 rounded-lg border p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Processor</span>
                      <span className="text-sm">{extendedTx.processor}</span>
                    </div>
                    {extendedTx.payment_method && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Payment Method</span>
                        <span className="text-sm">{formatType(extendedTx.payment_method)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
