"use client";

import { useRouter } from "next/navigation";

import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { customerDetail } from "@/lib/dummy-data";

import { AccountInfoTab } from "../_components/account-info-tab";
import { CustomerHeader } from "../_components/customer-header";
import { CustomerProfileTab } from "../_components/customer-profile-tab";
import { TransactionsTab } from "../_components/transactions-tab";

export default function CustomerDetailPage() {
  const router = useRouter();
  const customer = customerDetail;

  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" size="sm" className="-ml-3 w-fit gap-2" onClick={() => router.back()}>
        <ChevronLeft className="size-4" />
      </Button>

      <CustomerHeader customer={customer} />

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Customer Profile</TabsTrigger>
          <TabsTrigger value="account">Account info</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <CustomerProfileTab customer={customer} />
        </TabsContent>

        <TabsContent value="account" className="mt-6">
          <AccountInfoTab accounts={customer.accounts ?? []} />
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <TransactionsTab transactions={customer.transactions ?? []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
