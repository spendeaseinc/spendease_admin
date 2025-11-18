import { redirect } from "next/navigation";

import { fetchPartnerBalance } from "@/app/actions/partner-balance";

import { PartnerBalanceClient } from "./components/partner-balance-client";

export default async function PartnerBalancePage() {
  const result = await fetchPartnerBalance();

  if ("success" in result) {
    if (result.unauthorized) {
      redirect("/auth/login");
    }
    return (
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Partner Balance</h1>
          <p className="text-muted-foreground">View all partner balances</p>
        </div>
        <div className="text-center text-red-500">{result.message}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <PartnerBalanceClient data={result.data} />
    </div>
  );
}
