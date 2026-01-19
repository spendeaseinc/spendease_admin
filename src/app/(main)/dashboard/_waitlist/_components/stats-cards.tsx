import { Users, Clock, CheckCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  total: number;
  pending: number;
  approved: number;
}

export function StatsCards({ total, pending, approved }: StatsCardsProps) {
  return (
    <div className="mb-6 grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Waitlist</CardTitle>
          <Users className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total.toLocaleString()}</div>
          <p className="text-muted-foreground text-xs">All waitlist entries</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pending.toLocaleString()}</div>
          <p className="text-muted-foreground text-xs">Awaiting approval</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approved</CardTitle>
          <CheckCircle className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{approved.toLocaleString()}</div>
          <p className="text-muted-foreground text-xs">Approved entries</p>
        </CardContent>
      </Card>
    </div>
  );
}
