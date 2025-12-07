import { Metadata } from "next";
import { redirect } from "next/navigation";

import { fetchUsers } from "@/app/actions/users";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CustomersChart } from "./_components/customers-chart";
import { CustomersGraph } from "./_components/customers-graph";
import { CustomersTable } from "./_components/customers-table";
import { SectionCards } from "./_components/section-cards";
import { TransactionOverview } from "./_components/transaction-overview";
import { TransactionsCards } from "./_components/transactions-cards";
import { TransactionsChart } from "./_components/transactions-chart";
import DashboardTransactionsTable from "./_components/transactions-table";

export const metadata: Metadata = {
  title: "Home - SpendEase Admin Dashboard",
  description: "Home page on the SpendEase Admin Dashboard",
};

export default async function Page() {
  const [result] = await Promise.all([fetchUsers({ page: 1, pageSize: 10 })]);

  if ("success" in result) {
    if (result.unauthorized) {
      redirect("/auth/login");
    }
    return (
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage and view all customer accounts</p>
        </div>
        <div className="text-center text-red-500">{result.message}</div>
      </div>
    );
  }

  const customers = result;

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Tabs defaultValue="overview">
        <TabsList className="mb-6 md:mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent className="flex flex-col gap-4 md:gap-6" value="overview">
          <SectionCards />
          <TransactionOverview />
        </TabsContent>
        <TabsContent className="flex flex-col gap-4 md:gap-6" value="customers">
          {/* <CustomersCards />*/}
          <div className="grid gap-4 lg:grid-cols-2">
            <CustomersTable
              initialData={customers.data.data}
              initialPagination={{
                totalItems: customers.data.paging.total_items,
                currentPage: customers.data.paging.current,
                pageSize: customers.data.paging.page_size,
              }}
            />

            <div className="space-y-4">
              <CustomersGraph />
              <CustomersChart />
            </div>
          </div>
        </TabsContent>
        <TabsContent className="flex flex-col gap-4 md:gap-6" value="transactions">
          <TransactionsCards />
          <TransactionsChart />
          <DashboardTransactionsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
