import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CustomersChart } from "./_components/customers-chart";
import { CustomersGraph } from "./_components/customers-graph";
import { CustomersTable } from "./_components/customers-table";
import { SectionCards } from "./_components/section-cards";
import { TransactionOverview } from "./_components/transaction-overview";
import { TransactionsCards } from "./_components/transactions-cards";
import { TransactionsChart } from "./_components/transactions-chart";

export default function Page() {
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
            <CustomersTable />

            <div className="space-y-4">
              <CustomersGraph />
              <CustomersChart />
            </div>
          </div>
        </TabsContent>
        <TabsContent className="flex flex-col gap-4 md:gap-6" value="transactions">
          <TransactionsCards />
          <TransactionsChart />
        </TabsContent>
      </Tabs>
    </div>
  );
}
