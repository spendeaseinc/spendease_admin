"use client";

import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Customer, CustomerTransaction } from "@/lib/types";

interface TransactionsTabProps {
  customer: Customer;
}

export function TransactionsTab({ customer }: TransactionsTabProps) {
  const transactions = customer.transactions ?? [];

  const getStatusVariant = (status: string) => {
    if (status === "Active") return "default";
    if (status === "Pending") return "secondary";
    return "outline";
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "MMM d, yyyy, h:mm a");
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-accent hover:bg-accent">
            <TableHead className="rounded-tl-lg">Transaction ID</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Beneficiary account</TableHead>
            <TableHead>Bank/Mobile money</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Time stamp</TableHead>
            <TableHead className="rounded-tr-lg text-right">Account Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-muted-foreground text-center">
                No transactions found
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction: CustomerTransaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.transactionId}</TableCell>
                <TableCell>{transaction.currency}</TableCell>
                <TableCell>{transaction.beneficiaryAccount}</TableCell>
                <TableCell>{transaction.bankMobileMoney}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(transaction.status)}>{transaction.status}</Badge>
                </TableCell>
                <TableCell>{formatTimestamp(transaction.timestamp)}</TableCell>
                <TableCell className="text-right font-medium">{transaction.balance}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
