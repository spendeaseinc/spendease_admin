/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable complexity */
import type { Metadata } from "next";

import { fetchCustomerById, fetchCustomerSwaps, fetchCustomerTransactions } from "@/app/actions/users";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateCustomerStats } from "@/lib/customer-utils";
import type { PaginationData, TransactionSwap, WalletTransaction } from "@/lib/types";

import { AnalyticsTab } from "./_components/analytics-tab";
import { BeneficiariesTable } from "./_components/beneficiaries-table";
import { CustomerHeader } from "./_components/customer-header";
import { CustomerProfileTab } from "./_components/customer-profile-tab";
import { CustomerStatsCards } from "./_components/customer-stats-cards";
import { TransactionsTab } from "./_components/transactions-tab";

export const metadata: Metadata = {
  title: "Customer Details - SpendEase Admin Dashboard",
  description: "View customer details and account information",
};

interface CustomerDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Default empty pagination
const emptyPaging: PaginationData = {
  total_items: 0,
  page_size: 10,
  current: 1,
  count: 0,
  next: 1,
};

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = await params;

  // Fetch customer data, transactions, and swaps in parallel
  const [customerResult, transactionsResult, swapsResult] = await Promise.all([
    fetchCustomerById(id),
    fetchCustomerTransactions({ userId: id, page: 1 }),
    fetchCustomerSwaps(id),
  ]);

  // Handle customer fetch error
  if ("success" in customerResult) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center text-red-500">{customerResult.message}</div>
      </div>
    );
  }

  const customer = customerResult;

  // Extract transactions data
  let transactions: WalletTransaction[] = [];
  let transactionsPaging: PaginationData = emptyPaging;

  if ("status" in transactionsResult && transactionsResult.status) {
    transactions = transactionsResult.data.data;
    transactionsPaging = transactionsResult.data.paging;
  }

  // Extract swaps data
  let swaps: TransactionSwap[] = [];
  if ("status" in swapsResult && swapsResult.status) {
    swaps = swapsResult.data.data;
  }

  // Get bank accounts (beneficiaries) from customer data
  const bankAccounts = customer.bank_accounts ?? [];

  // Get country info from KYC data
  const bvnData = customer.meta?.kyc?.bvn ?? customer.meta?.bvn;
  const baseCountry = bvnData?.nationality ?? "Nigeria";
  const countryCode = baseCountry === "Nigeria" ? "NG" : "";

  // Calculate customer stats from transactions
  const stats = calculateCustomerStats({
    transactions: transactions.map((t) => ({
      amount: t.amount,
      status: t.status,
      currency: t.currency,
    })),
    totalTransactionsCount: transactionsPaging.total_items,
    beneficiariesCount: bankAccounts.length,
    customerCreatedAt: customer.createdAt,
    country: baseCountry,
    countryCode: countryCode,
  });

  return (
    <div className="container mx-auto space-y-6">
      <CustomerHeader customer={customer} />

      {/* Stats Cards */}
      <CustomerStatsCards stats={stats} />

      {/* Tabbed Content */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:flex">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="transactions">
            Transactions
            {transactionsPaging.total_items > 0 && (
              <span className="bg-muted ml-2 rounded-full px-2 py-0.5 text-xs">
                {transactionsPaging.total_items}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="beneficiaries">
            Beneficiaries
            {bankAccounts.length > 0 && (
              <span className="bg-muted ml-2 rounded-full px-2 py-0.5 text-xs">
                {bankAccounts.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <CustomerProfileTab customer={customer} />
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <TransactionsTab
            customerId={id}
            initialTransactions={transactions}
            initialPaging={transactionsPaging}
          />
        </TabsContent>

        <TabsContent value="beneficiaries" className="mt-6">
          <BeneficiariesTable bankAccounts={bankAccounts} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <AnalyticsTab transactions={transactions} swaps={swaps} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
