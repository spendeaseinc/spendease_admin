import { Users, CreditCard, CircleDollarSign, UserMinus, UserRoundX, ArrowLeftRight } from "lucide-react";

import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface SectionCardsProps {
  totalUsers: number;
  activeUsers: number;
  transactingUsers: number;
  totalTransactions: number;
  successfulTransactions: number;
  successRate: number;
}

export function SectionCards({
  totalUsers,
  activeUsers,
  transactingUsers,
  totalTransactions,
  successfulTransactions,
  successRate,
}: SectionCardsProps) {
  const inactiveUsers = totalUsers - activeUsers;

  return (
    <>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs @xl/main:grid-cols-3">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalUsers.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Users className="h-4 w-4" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">{transactingUsers} transacting users</div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Transactions</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalTransactions.toLocaleString()}
            </CardTitle>
            <CardAction>
              <CreditCard className="h-4 w-4" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">{successfulTransactions} successful transactions</div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Success Rate</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {successRate.toFixed(1)}%
            </CardTitle>
            <CardAction>
              <CircleDollarSign className="h-4 w-4" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">
              {successfulTransactions} of {totalTransactions} transactions
            </div>
          </CardFooter>
        </Card>
      </div>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Successful Transactions</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {successfulTransactions.toLocaleString()}
            </CardTitle>
            <CardAction>
              <ArrowLeftRight className="h-4 w-4" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">{successRate.toFixed(1)}% success rate</div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Active Users</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {activeUsers.toLocaleString()}
            </CardTitle>
            <CardAction>
              <Users className="h-4 w-4" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">{((activeUsers / totalUsers) * 100).toFixed(1)}% of total users</div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Inactive Users</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {inactiveUsers.toLocaleString()}
            </CardTitle>
            <CardAction>
              <UserMinus className="h-4 w-4" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">
              {((inactiveUsers / totalUsers) * 100).toFixed(1)}% of total users
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Transacting Users</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {transactingUsers.toLocaleString()}
            </CardTitle>
            <CardAction>
              <UserRoundX className="h-4 w-4" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">{((transactingUsers / totalUsers) * 100).toFixed(1)}% of total</div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
