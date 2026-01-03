/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client";

import { format, parse } from "date-fns";
import { AlertCircle, Clock } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Customer } from "@/lib/types";

interface CustomerProfileTabProps {
  customer: Customer;
}

// Helper function to safely get BVN data (handles both possible API response structures)
function getBvnData(customer: Customer) {
  // Try both possible paths: customer.meta.kyc.bvn or customer.meta.bvn
  return customer.meta?.kyc?.bvn ?? customer.meta?.bvn ?? null;
}

// Helper function to check if KYC data is available
function hasKycData(customer: Customer): boolean {
  const bvnData = getBvnData(customer);
  return !!(bvnData?.birthdate ?? bvnData?.firstname ?? bvnData?.lastname);
}

// Helper function to parse birthdate safely
function parseBirthdate(birthdate: string | undefined): Date | null {
  if (!birthdate) return null;
  try {
    const parsed = parse(birthdate, "dd-MM-yyyy", new Date());
    return isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
}

// Component for displaying basic customer info when KYC is incomplete
function BasicCustomerInfo({ customer }: { customer: Customer }) {
  // Determine alert variant and message based on status
  const getKycAlert = () => {
    switch (customer.status) {
      case "pending":
        return {
          variant: "default" as const,
          icon: Clock,
          title: "KYC Verification In Progress",
          description:
            "This customer's KYC verification is currently pending. The verification process is underway with our KYC partner. KYC details will be available once the verification is completed.",
        };
      case "verified":
        return {
          variant: "destructive" as const,
          icon: AlertCircle,
          title: "KYC Information Incomplete",
          description:
            "This customer has a verified status but KYC details are not yet available. This may indicate the verification process is still being processed or there was an issue retrieving the data from our KYC partner.",
        };
      case "active":
        return {
          variant: "destructive" as const,
          icon: AlertCircle,
          title: "KYC Information Incomplete",
          description:
            "This customer has an active status but KYC details are not available. Please contact support if this is unexpected.",
        };
      default:
        return {
          variant: "destructive" as const,
          icon: AlertCircle,
          title: "KYC Information Incomplete",
          description:
            "This customer has not completed their KYC verification. KYC details are only available for customers who have completed the verification process with our KYC partner.",
        };
    }
  };

  const alertConfig = getKycAlert();
  const IconComponent = alertConfig.icon;

  return (
    <div className="space-y-6">
      <Alert variant={alertConfig.variant}>
        <IconComponent className="h-4 w-4" />
        <AlertTitle>{alertConfig.title}</AlertTitle>
        <AlertDescription>{alertConfig.description}</AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Basic Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-muted-foreground text-sm">First name</p>
              <p className="font-medium">{customer.first_name ?? "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Last name</p>
              <p className="font-medium">{customer.last_name ?? "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Username</p>
              <p className="font-medium">{customer.username ?? "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Phone number</p>
              <p className="font-medium">{customer.phone ?? "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Email Address</p>
              <p className="font-medium">{customer.email ?? "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Status</p>
              <p className="font-medium capitalize">{customer.status ?? "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Date Joined</p>
              <p className="font-medium">
                {customer.createdAt ? format(new Date(customer.createdAt), "MMMM dd, yyyy h:mm a") : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Last Updated At</p>
              <p className="font-medium">
                {customer.updatedAt ? format(new Date(customer.updatedAt), "MMMM dd, yyyy h:mm a") : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for info field
function InfoField({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

// Component for customer information card
// eslint-disable-next-line complexity
function CustomerInfoCard({
  customer,
  bvnData,
  dateObj,
}: {
  customer: Customer;
  bvnData: NonNullable<ReturnType<typeof getBvnData>>;
  dateObj: Date | null;
}) {
  const birthdateDisplay = dateObj ? format(dateObj, "MMMM dd, yyyy") : (bvnData.birthdate ?? "N/A");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <InfoField label="Title" value={bvnData.title ?? "N/A"} />
          <InfoField label="First name" value={customer.first_name ?? "N/A"} />
          <InfoField label="Middle name" value={bvnData.middlename ?? "N/A"} className="capitalize!" />
          <InfoField label="Last name" value={customer.last_name ?? "N/A"} />
          <InfoField label="Username" value={customer.username ?? "N/A"} />
          <InfoField label="Gender" value={bvnData.gender ?? "N/A"} />
          <InfoField label="Phone number" value={customer.phone ?? "N/A"} />
          <InfoField label="Email Address" value={customer.email ?? "N/A"} />
          <InfoField label="Date of birth" value={birthdateDisplay} />
          <InfoField label="Marital status" value={bvnData.marital_status ?? "N/A"} />
          <InfoField label="L.G.A of Origin" value={bvnData.lga_of_origin ?? "N/A"} />
          <InfoField label="State of Origin" value={bvnData.state_of_origin ?? "N/A"} />
          <InfoField label="Nationality" value={bvnData.nationality ?? "N/A"} />
          <InfoField label="Date Joined" value={format(new Date(customer.createdAt), "MMMM dd, yyyy h:mm a")} />
          <InfoField label="Last Updated At" value={format(new Date(customer.updatedAt), "MMMM dd, yyyy h:mm a")} />
          <InfoField label="Level of Account" value={bvnData.level_of_account ?? "Level 1"} />
        </div>
      </CardContent>
    </Card>
  );
}

// Component for address information card
function AddressInfoCard({ bvnData }: { bvnData: NonNullable<ReturnType<typeof getBvnData>> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Address Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-muted-foreground text-sm">Residential Address</p>
            <p className="font-medium">{bvnData.residential_address ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">LGA of Residence</p>
            <p className="font-medium">{bvnData.lga_of_residence ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">State of Residence</p>
            <p className="font-medium">{bvnData.state_of_residence ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Country of Residence</p>
            <p className="font-medium">&quot;Not yet collecting&quot;</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Component for displaying full KYC information
function FullKycInfo({
  customer,
  bvnData,
  dateObj,
}: {
  customer: Customer;
  bvnData: NonNullable<ReturnType<typeof getBvnData>>;
  dateObj: Date | null;
}) {
  return (
    <div className="space-y-6">
      <CustomerInfoCard customer={customer} bvnData={bvnData} dateObj={dateObj} />
      <AddressInfoCard bvnData={bvnData} />
    </div>
  );
}

export function CustomerProfileTab({ customer }: CustomerProfileTabProps) {
  const bvnData = getBvnData(customer);
  const hasKyc = hasKycData(customer);
  const dateObj = parseBirthdate(bvnData?.birthdate);

  // Show basic info if KYC is incomplete
  if (!hasKyc || !bvnData) {
    return <BasicCustomerInfo customer={customer} />;
  }

  // Show full KYC information
  return <FullKycInfo customer={customer} bvnData={bvnData} dateObj={dateObj} />;
}
