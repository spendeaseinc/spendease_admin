import { Users, UserCheck, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  total: number;
  active: number;
  verified: number;
}

export function StatsCards({ total, active, verified }: StatsCardsProps) {
  const stats = [
    {
      title: "Total Customers",
      value: total,
      icon: Users,
      description: "All registered customers",
    },
    {
      title: "Active Customers",
      value: active,
      icon: UserCheck,
      description: "Customers with active status",
    },
    {
      title: "Verified Customers",
      value: verified,
      icon: ShieldCheck,
      description: "Customers with verified status",
    },
  ];

  return (
    <div className="mb-6 grid gap-4 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
              <p className="text-muted-foreground mt-1 text-xs">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
