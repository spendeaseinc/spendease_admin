"use client";

import { X, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TransactionDetailsPanelProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

function getStatusBadgeClasses(status: string) {
  if (status === "Successful") return "bg-green-100 text-green-700";
  if (status === "Pending") return "bg-orange-100 text-orange-700";
  if (status === "Failed") return "bg-red-100 text-red-700";
  return "";
}

function getAmountDisplay(transaction: Transaction) {
  const isWithdrawal = transaction.type === "Withdrawal";
  const prefix = isWithdrawal ? "- " : "";
  const colorClass = isWithdrawal ? "text-red-600" : "text-green-600";

  return {
    text: `${prefix}${transaction.currency} ${transaction.amount}`,
    className: cn("mt-2 text-4xl font-bold", colorClass),
  };
}

export function TransactionDetailsPanel({ transaction, isOpen, onClose }: TransactionDetailsPanelProps) {
  if (!transaction) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const amountDisplay = getAmountDisplay(transaction);

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "bg-card fixed top-0 right-0 z-50 h-full w-full max-w-md transform shadow-xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">Transactions details</h2>
              <span
                className={cn(
                  "inline-flex rounded-full px-2 py-1 text-xs font-medium",
                  getStatusBadgeClasses(transaction.status),
                )}
              >
                {transaction.status}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">{transaction.type}</p>
              <p className={amountDisplay.className}>{amountDisplay.text}</p>
              <p className="text-muted-foreground mt-2 text-sm">28 May, 11:47 PM</p>
            </div>

            <div className="mt-8">
              <h3 className="mb-4 font-semibold">Customer details</h3>
              <div className="bg-muted/30 space-y-3 rounded-lg border p-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">User Name:</span>
                  <span className="text-sm font-medium">Jane Cooper</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Wallet</span>
                  <span className="text-sm font-medium">{transaction.wallet}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Account number:</span>
                  <span className="text-sm font-medium">{transaction.accountNumber}</span>
                </div>
              </div>
            </div>

            {transaction.beneficiaryName && (
              <div className="mt-6">
                <h3 className="mb-4 font-semibold">Beneficiary details</h3>
                <div className="bg-muted/30 space-y-3 rounded-lg border p-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Beneficiary Name:</span>
                    <span className="text-sm font-medium">{transaction.beneficiaryName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Account number:</span>
                    <span className="text-sm font-medium">{transaction.beneficiaryAccount}</span>
                  </div>
                  {transaction.bank && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">Bank:</span>
                      <span className="text-sm font-medium">{transaction.bank}</span>
                    </div>
                  )}
                  {transaction.reason && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">Reason for payment:</span>
                      <span className="text-sm font-medium">{transaction.reason}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-muted/30 mt-6 space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Session ID:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{transaction.sessionId.slice(-9)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleCopy(transaction.sessionId)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Transaction ID:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{transaction.transactionId.slice(0, 14)}...</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleCopy(transaction.transactionId)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
