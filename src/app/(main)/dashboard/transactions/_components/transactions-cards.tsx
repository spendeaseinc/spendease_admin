import { CircleDollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";

import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function TransactionsCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Transactions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">$400,000</CardTitle>
          <CardAction>
            <CircleDollarSign className="h-4 w-4" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">+20.1% from last month</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Deposits</CardDescription>
          <CardTitle className="text-2xl font-semibold text-green-500 tabular-nums @[250px]/card:text-3xl">
            $45,231.89
          </CardTitle>
          <CardAction>
            <ArrowDownRight className="h-4 w-4 text-green-500" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">+180.1% from last month</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Suspended Users</CardDescription>
          <CardTitle className="text-2xl font-semibold text-red-500 tabular-nums @[250px]/card:text-3xl">573</CardTitle>
          <CardAction>
            <ArrowUpRight className="h-4 w-4 text-red-500" />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">-12.5% from last month</div>
        </CardFooter>
      </Card>
    </div>
  );
}
