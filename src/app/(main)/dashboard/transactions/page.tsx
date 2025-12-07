import type { Metadata } from "next";

import { fetchTransactions, fetchTransactionStats } from "@/app/actions/transactions";

import { StatsCards } from "./_components/stats-cards";
import { TransactionsClient } from "./_components/transactions-client";

export const metadata: Metadata = {
  title: "Transactions - SpendEase Admin Dashboard",
  description: "View and manage all wallet transactions on the SpendEase Admin Dashboard",
};

export default async function TransactionsPage() {
  const [result, statsResult] = await Promise.all([
    fetchTransactions({ page: 1, pageSize: 10 }),
    fetchTransactionStats(),
  ]);

  if ("success" in result) {
    return (
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">View and manage all wallet transactions</p>
        </div>
        <div className="text-center text-red-500">{result.message}</div>
      </div>
    );
  }

  const transactions = result;

  const stats = "success" in statsResult ? { total: 0, pending: 0, successful: 0, failed: 0 } : statsResult;

  return (
    <div className="container mx-auto">
      <div className="mb-4 md:mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">View and manage all wallet transactions</p>
      </div>
      <StatsCards total={stats.total} pending={stats.pending} successful={stats.successful} failed={stats.failed} />
      <TransactionsClient
        initialData={transactions.data.data}
        initialPagination={{
          totalItems: transactions.data.paging.total_items,
          currentPage: transactions.data.paging.current,
          pageSize: transactions.data.paging.page_size,
        }}
      />
    </div>
  );
}
