import Link from "next/link";

import { format } from "date-fns";
import { ArrowRight } from "lucide-react";

import { fetchTransactions } from "@/app/actions/transactions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ApiResponse, WalletTransaction } from "@/lib/types";
import { getStatusVariant } from "@/lib/utils";

export default async function DashboardTransactionsTable() {
  const result = await fetchTransactions({ page: 1, pageSize: 10 });

  if ("success" in result && !result.success) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <p className="text-muted-foreground">{result.message}</p>
      </div>
    );
  }

  const { data } = result as ApiResponse;
  const transactions = data.data as WalletTransaction[];

  if (transactions.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <p className="text-muted-foreground">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.reference}</TableCell>
                <TableCell>
                  {transaction.user && transaction.user.first_name && transaction.user.last_name
                    ? `${transaction.user.first_name} ${transaction.user.last_name}`
                    : `User #${transaction.user_id}`}
                </TableCell>
                <TableCell>
                  {transaction.currency} {Number.parseFloat(transaction.amount).toLocaleString()}
                </TableCell>
                <TableCell className="capitalize">{transaction.type.replace(/-/g, " ")}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(transaction.status)} className="capitalize">
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(transaction.created_at), "MMM dd, yyyy HH:mm")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" asChild>
          <Link href="/dashboard/transactions">
            View all transactions
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
