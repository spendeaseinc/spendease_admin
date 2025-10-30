"use client";

import { useState } from "react";

import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const customers = [
  { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "+$1,999.00", initials: "ON" },
  { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "+$39.00", initials: "CN" },
  { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "+$299.00", initials: "CN" },
  { name: "William Kim", email: "will@email.com", amount: "+$99.00", initials: "CN" },
  { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "+$39.00", initials: "CN" },
];

export function CustomersTable() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex gap-2">
          <Input placeholder="Filter emails..." className="flex-1" />
          <Button variant="outline">
            Columns <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {customers.map((customer, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium">
                  {customer.initials}
                </div>
                <div>
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-muted-foreground text-sm">{customer.email}</div>
                </div>
              </div>
              <div className="font-medium">{customer.amount}</div>
            </div>
          ))}
        </div>

        <div className="border-border mt-6 flex items-center justify-between border-t pt-6">
          <div className="text-muted-foreground text-sm">
            {selectedRows.length} of {customers.length} row(s) selected.
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
