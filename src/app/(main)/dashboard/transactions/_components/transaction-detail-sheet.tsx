"use client";

import { useEffect, useState, useCallback } from "react";

import { format } from "date-fns";
import { Copy } from "lucide-react";
import { toast } from "sonner";

import { fetchTransactionById } from "@/app/actions/transactions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import type { WalletTransactionDetail } from "@/lib/types";
import { getStatusVariant } from "@/lib/utils";

interface TransactionDetailSheetProps {
  transactionId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DetailRow({
  label,
  value,
  isFirst,
  isLast,
}: {
  label: string;
  value: string;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  return (
    <div
      className={`border-border flex items-center justify-between border-x px-4 py-3 ${isFirst ? "rounded-t-lg border-t" : ""} ${isLast ? "rounded-b-lg border-b" : "border-b"}`}
    >
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function CopyableField({ label, value, onCopy }: { label: string; value: string; onCopy: (text: string) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-muted-foreground text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm">{value}</span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onCopy(value)}>
          <Copy className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

function formatTransactionAmount(transaction: WalletTransactionDetail) {
  const amount = Number.parseFloat(transaction.amount);
  const isNegative = amount < 0 || transaction.type === "withdrawal" || transaction.type === "pay-out";
  const textColor = isNegative ? "text-red-600" : "text-green-600";
  const bgColor = isNegative ? "bg-red-50 dark:bg-red-950/30" : "bg-green-50 dark:bg-green-950/30";
  const prefix = isNegative ? "- " : "";
  const formatted = `${prefix}${transaction.currency} ${Math.abs(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return { textColor, bgColor, formatted };
}

function getUserName(transaction: WalletTransactionDetail): string {
  if (transaction.user) {
    return `${transaction.user.first_name} ${transaction.user.last_name}`;
  }
  return `User #${transaction.user_id}`;
}

function CustomerDetailsSection({ transaction }: { transaction: WalletTransactionDetail }) {
  const rows = [
    { label: "User Name:", value: getUserName(transaction) },
    { label: "Wallet:", value: `${transaction.currency} Wallet` },
    transaction.wallet_type && { label: "Wallet", value: transaction.wallet_type },
    transaction.account_number && { label: "Account number:", value: transaction.account_number },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Customer details</h3>
      <div>
        {rows.map((row, index) => (
          <DetailRow
            key={row.label}
            label={row.label}
            value={row.value}
            isFirst={index === 0}
            isLast={index === rows.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function BeneficiaryDetailsSection({ transaction }: { transaction: WalletTransactionDetail }) {
  const rows = [
    transaction.beneficiary_name && { label: "Beneficiary Name:", value: transaction.beneficiary_name },
    transaction.beneficiary_account && { label: "Account number:", value: transaction.beneficiary_account },
    transaction.beneficiary_bank && { label: "Bank:", value: transaction.beneficiary_bank },
    transaction.payment_reason && { label: "Reason for payment:", value: transaction.payment_reason },
  ].filter(Boolean) as { label: string; value: string }[];

  if (rows.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Beneficiary details</h3>
      <div>
        {rows.map((row, index) => (
          <DetailRow
            key={row.label}
            label={row.label}
            value={row.value}
            isFirst={index === 0}
            isLast={index === rows.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function TransactionIdsSection({
  transaction,
  onCopy,
}: {
  transaction: WalletTransactionDetail;
  onCopy: (text: string) => void;
}) {
  return (
    <div className="bg-muted/50 rounded-lg px-4 py-2">
      {transaction.session_id && <CopyableField label="Session ID:" value={transaction.session_id} onCopy={onCopy} />}
      {transaction.transaction_id && (
        <CopyableField label="Transaction ID:" value={transaction.transaction_id} onCopy={onCopy} />
      )}
      <CopyableField label="Reference:" value={transaction.reference} onCopy={onCopy} />
    </div>
  );
}

function TransactionHeader({ transaction }: { transaction: WalletTransactionDetail; onClose: () => void }) {
  const { textColor, bgColor, formatted } = formatTransactionAmount(transaction);

  return (
    <div className="space-y-4">
      {/* Title row with status badge and close button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Transactions details</h2>
          <Badge variant={getStatusVariant(transaction.status)} className="capitalize">
            {transaction.status}
          </Badge>
        </div>
      </div>

      {/* Colored amount section */}
      <div className={`${bgColor} space-y-1 rounded-lg py-6 text-center`}>
        <div className="text-muted-foreground text-sm font-medium capitalize">
          {transaction.type.replace(/-/g, " ")}
        </div>
        <div className={`text-3xl font-bold ${textColor}`}>{formatted}</div>
        <div className="text-muted-foreground text-sm">
          {format(new Date(transaction.created_at), "dd MMM, hh:mm a")}
        </div>
      </div>
    </div>
  );
}

export function TransactionDetailSheet({ transactionId, open, onOpenChange }: TransactionDetailSheetProps) {
  const [transaction, setTransaction] = useState<WalletTransactionDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!transactionId || !open) return;

    let cancelled = false;

    const loadTransaction = async () => {
      setLoading(true);
      const result = await fetchTransactionById(transactionId);

      if (cancelled) return;

      if ("success" in result) {
        toast(result.message);
        setLoading(false);
        return;
      }

      setTransaction(result);
      setLoading(false);
    };

    loadTransaction();

    return () => {
      cancelled = true;
    };
  }, [transactionId, open]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast("Text copied to clipboard");
  }, []);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-md">
        <SheetTitle className="sr-only">Transaction Details</SheetTitle>
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        ) : transaction ? (
          <div className="flex flex-col gap-6 p-6">
            <TransactionHeader transaction={transaction} onClose={() => onOpenChange(false)} />
            <CustomerDetailsSection transaction={transaction} />
            <BeneficiaryDetailsSection transaction={transaction} />
            <TransactionIdsSection transaction={transaction} onCopy={copyToClipboard} />
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
