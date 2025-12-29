"use client";

import { useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Customer } from "@/lib/types";
import { getInitials } from "@/lib/utils";

interface CustomerHeaderProps {
  customer: Customer;
}

export function CustomerHeader({ customer }: CustomerHeaderProps) {
  const router = useRouter();

  const getStatusVariant = (status: string) => {
    if (status === "verified" || status === "active") return "default";
    if (status === "pending") return "secondary";
    return "outline";
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/customers")} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={customer.profile_image ?? "/placeholder.svg"} alt={customer.first_name} />
              <AvatarFallback>{getInitials(`${customer.first_name + " " + customer.last_name}`)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{customer.first_name}</h1>
              <p className="text-muted-foreground text-sm">{customer.email}</p>
            </div>
            <Badge variant={getStatusVariant(customer.status)}>{formatStatus(customer.status)}</Badge>
          </div>

          <div className="text-right">
            <p className="text-muted-foreground text-sm">BVN Account Level</p>
            <p className="text-lg font-semibold">{"Level 1"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
