"use client";

import { format, parse } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Customer } from "@/lib/types";

interface CustomerProfileTabProps {
  customer: Customer;
}

export function CustomerProfileTab({ customer }: CustomerProfileTabProps) {
  const dateObj = parse(customer.meta.kyc.bvn.birthdate, "dd-MM-yyyy", new Date());

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-muted-foreground text-sm">Title</p>
              <p className="font-medium">{customer.meta.kyc.bvn.title}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">First name</p>
              <p className="font-medium">{customer.first_name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm capitalize!">Middle name</p>
              <p className="font-medium">{customer.meta.kyc.bvn.middlename.toLowerCase()}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Last name</p>
              <p className="font-medium">{customer.last_name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Username</p>
              <p className="font-medium">{customer.username}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Gender</p>
              <p className="font-medium">{customer.meta.kyc.bvn.gender}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Phone number</p>
              <p className="font-medium">{customer.phone}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Email Address</p>
              <p className="font-medium">{customer.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Date of birth</p>
              <p className="font-medium">{format(dateObj, "MMMM dd, yyyy")}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Marital status</p>
              <p className="font-medium">{customer.meta.kyc.bvn.marital_status}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">L.G.A of Origin</p>
              <p className="font-medium">{customer.meta.kyc.bvn.lga_of_origin}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">State of Origin</p>
              <p className="font-medium">{customer.meta.kyc.bvn.state_of_origin}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Nationality</p>
              <p className="font-medium">{customer.meta.kyc.bvn.nationality}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Date Joined</p>
              <p className="font-medium">{format(new Date(customer.createdAt), "MMMM dd, yyyy h:mm a")}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Last Updated At</p>
              <p className="font-medium">{format(new Date(customer.updatedAt), "MMMM dd, yyyy h:mm a")}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Level of Account</p>
              <p className="font-medium">{customer.meta.kyc.bvn.level_of_account}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-muted-foreground text-sm">Residential Address</p>
              <p className="font-medium">{customer.meta.kyc.bvn.residential_address}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">LGA of Residence</p>
              <p className="font-medium">{customer.meta.kyc.bvn.lga_of_residence}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">State of Residence</p>
              <p className="font-medium">{customer.meta.kyc.bvn.state_of_residence}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Country of Residence</p>
              <p className="font-medium">&quot;Not yet collecting&quot;</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
