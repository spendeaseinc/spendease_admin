/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client";

import { useRouter } from "next/navigation";

import { format } from "date-fns";
import { ArrowLeft, Calendar, Mail, Phone, Shield, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Customer } from "@/lib/types";
import { cn, getInitials } from "@/lib/utils";

interface CustomerHeaderProps {
  customer: Customer;
}

// Helper to get account level from tier or BVN data
function getAccountLevel(customer: Customer): string {
  // Try tier first
  if (customer.tier !== undefined) {
    return `Level ${customer.tier}`;
  }
  // Fallback to BVN level_of_account
  const bvnData = customer.meta?.kyc?.bvn ?? customer.meta?.bvn;
  if (bvnData?.level_of_account) {
    return bvnData.level_of_account;
  }
  return "Level 1";
}

// Get status badge variant and label
function getStatusConfig(status: string): { variant: "default" | "secondary" | "destructive" | "outline"; label: string } {
  switch (status) {
    case "verified":
    case "active":
      return { variant: "default", label: "Verified" };
    case "pending":
    case "unverified":
      return { variant: "secondary", label: "Pending" };
    case "locked":
    case "suspended":
      return { variant: "destructive", label: status.charAt(0).toUpperCase() + status.slice(1) };
    default:
      return { variant: "outline", label: "Inactive" };
  }
}

export function CustomerHeader({ customer }: CustomerHeaderProps) {
  const router = useRouter();
  const statusConfig = getStatusConfig(customer.status);
  const accountLevel = getAccountLevel(customer);
  const fullName = `${customer.first_name} ${customer.last_name}`;
  const joinedDate = customer.createdAt ? format(new Date(customer.createdAt), "MMMM dd, yyyy") : "N/A";

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/customers")} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Customers
      </Button>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Left: Avatar and main info */}
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20 border-2 border-border">
                <AvatarImage src={customer.profile_image ?? undefined} alt={fullName} />
                <AvatarFallback className="text-xl font-semibold">{getInitials(fullName)}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight">{fullName}</h1>
                  <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                </div>
                {customer.username && (
                  <p className="text-muted-foreground flex items-center gap-2 text-sm">
                    <User className="h-3.5 w-3.5" />@{customer.username}
                  </p>
                )}
                <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {customer.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {customer.phone || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Stats cards */}
            <div className="flex flex-wrap gap-4 lg:gap-6">
              <div className="bg-muted/50 flex items-center gap-3 rounded-lg px-4 py-3">
                <div className={cn("rounded-full p-2", "bg-primary/10 text-primary")}>
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium">Account Level</p>
                  <p className="text-sm font-semibold">{accountLevel}</p>
                </div>
              </div>

              <Separator orientation="vertical" className="hidden h-auto lg:block" />

              <div className="bg-muted/50 flex items-center gap-3 rounded-lg px-4 py-3">
                <div className={cn("rounded-full p-2", "bg-blue-500/10 text-blue-600 dark:text-blue-400")}>
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium">Member Since</p>
                  <p className="text-sm font-semibold">{joinedDate}</p>
                </div>
              </div>

              <Separator orientation="vertical" className="hidden h-auto lg:block" />

              <div className="bg-muted/50 flex items-center gap-3 rounded-lg px-4 py-3">
                <div>
                  <p className="text-muted-foreground text-xs font-medium">Customer ID</p>
                  <p className="font-mono text-sm font-semibold">#{customer.id}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
