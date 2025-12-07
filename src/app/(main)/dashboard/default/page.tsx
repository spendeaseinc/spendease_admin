import { fetchDashboardStats } from "@/app/actions/dashboard";
import { fetchUsers } from "@/app/actions/users";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CustomersChart } from "./_components/customers-chart";
import { CustomersGraph } from "./_components/customers-graph";
import { DashboardCustomersTable } from "./_components/customers-table";
import { SectionCards } from "./_components/section-cards";
import { TransactionOverview } from "./_components/transaction-overview";
import { TransactionsChart } from "./_components/transactions-chart";
import DashboardTransactionsTable from "./_components/transactions-table";

export const metadata = {
  title: "Dashboard - SpendEase Admin",
  description: "SpendEase Admin Dashboard Overview",
};

export default async function DashboardPage() {
  const [statsResult, customersResult] = await Promise.all([
    fetchDashboardStats(),
    fetchUsers({ page: 1, pageSize: 10 }),
  ]);

  if ("success" in statsResult) {
    return (
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your platform</p>
        </div>
        <div className="text-center text-red-500">{statsResult.message}</div>
      </div>
    );
  }

  const { overview, transactionOverview, customersComparison, newCustomers } = statsResult.data;

  const initialCustomersData =
    "success" in customersResult
      ? { data: [], pagination: { totalItems: 0, currentPage: 1, pageSize: 10 } }
      : {
          data: customersResult.data.data,
          pagination: {
            totalItems: customersResult.data.paging.total_items,
            currentPage: customersResult.data.paging.current,
            pageSize: customersResult.data.paging.page_size,
          },
        };

  return (
    <div className="container mx-auto">
      <div className="mb-4 md:mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Manage and view the SpendEase Admin Dashboard</p>
      </div>
      <Tabs defaultValue="overview">
        <TabsList className="mb-6 md:mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent className="@container/main flex flex-col gap-4" value="overview">
          <SectionCards
            totalUsers={overview.totalUsers}
            activeUsers={overview.activeUsers}
            transactingUsers={overview.transactingUsers}
            totalTransactions={overview.totalTransactions}
            successfulTransactions={overview.successfulTransactions}
            successRate={overview.successRate}
          />
          <TransactionOverview
            title={transactionOverview.title}
            subtitle={transactionOverview.subtitle}
            data={transactionOverview.data}
          />
        </TabsContent>
        <TabsContent className="flex flex-col gap-4 md:gap-6" value="customers">
          <div className="grid gap-4 lg:grid-cols-2">
            <DashboardCustomersTable
              initialData={initialCustomersData.data}
              initialPagination={initialCustomersData.pagination}
            />

            <div className="space-y-4">
              <CustomersGraph title={customersComparison.title} data={customersComparison.data} />
              <CustomersChart
                title={newCustomers.title}
                currentMonth={newCustomers.currentMonth}
                previousMonth={newCustomers.previousMonth}
                percentageChange={newCustomers.percentageChange}
                data={newCustomers.data}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent className="flex flex-col gap-4 md:gap-6" value="transactions">
          <TransactionsChart data={transactionOverview.data} />
          <DashboardTransactionsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
