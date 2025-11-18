import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { fetchCustomerById } from "@/app/actions/users";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CustomerHeader } from "./_components/customer-header";
import { CustomerProfileTab } from "./_components/customer-profile-tab";
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

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = await params;
  const result = await fetchCustomerById(id);

  if ("success" in result) {
    if (result.unauthorized) {
      redirect("/auth/login");
    }
    return (
      <div className="container mx-auto py-10">
        <div className="text-center text-red-500">{result.message}</div>
      </div>
    );
  }

  const customer = result;

  return (
    <div className="container mx-auto">
      <CustomerHeader customer={customer} />

      <Tabs defaultValue="profile" className="mt-6">
        <TabsList>
          <TabsTrigger value="profile">Customer Profile</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <CustomerProfileTab customer={customer} />
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <TransactionsTab customer={customer} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
