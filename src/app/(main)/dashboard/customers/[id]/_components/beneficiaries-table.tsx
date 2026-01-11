/* eslint-disable security/detect-object-injection */
/* eslint-disable prettier/prettier */
/* eslint-disable complexity */
"use client";

import { format } from "date-fns";
import { Building2, CheckCircle, CreditCard, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CustomerBankAccount, CustomerBeneficiary } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BeneficiariesTableProps {
  bankAccounts: CustomerBankAccount[];
}

// Helper to mask account number (show last 4 digits)
function maskAccountNumber(accountNumber: string): string {
  if (!accountNumber || accountNumber.length <= 4) return accountNumber;
  return `****${accountNumber.slice(-4)}`;
}

// Helper to infer currency from bank (default to NGN for Nigerian banks)
function inferCurrency(bankName: string): string {
  const bankNameLower = bankName.toLowerCase();
  // Common Nigerian banks
  if (
    bankNameLower.includes("gtb") ||
    bankNameLower.includes("guaranty") ||
    bankNameLower.includes("zenith") ||
    bankNameLower.includes("first bank") ||
    bankNameLower.includes("access") ||
    bankNameLower.includes("uba") ||
    bankNameLower.includes("union") ||
    bankNameLower.includes("sterling") ||
    bankNameLower.includes("fidelity") ||
    bankNameLower.includes("polaris") ||
    bankNameLower.includes("wema") ||
    bankNameLower.includes("opay") ||
    bankNameLower.includes("kuda") ||
    bankNameLower.includes("palmpay")
  ) {
    return "NGN";
  }
  // Kenyan banks
  if (
    bankNameLower.includes("mpesa") ||
    bankNameLower.includes("safaricom") ||
    bankNameLower.includes("equity") ||
    bankNameLower.includes("kcb")
  ) {
    return "KES";
  }
  // Ghanaian banks
  if (
    bankNameLower.includes("mtn") ||
    bankNameLower.includes("vodafone") ||
    bankNameLower.includes("airtel") ||
    bankNameLower.includes("ghana")
  ) {
    return "GHS";
  }
  return "NGN"; // Default
}

// Helper to infer country from currency
function inferCountry(currency: string): string {
  switch (currency) {
    case "NGN":
      return "Nigeria";
    case "KES":
      return "Kenya";
    case "GHS":
      return "Ghana";
    case "ZAR":
      return "South Africa";
    case "USD":
      return "United States";
    default:
      return "Nigeria";
  }
}

// Transform bank accounts to beneficiaries
function transformToBeneficiaries(bankAccounts: CustomerBankAccount[]): CustomerBeneficiary[] {
  return bankAccounts.map((account) => {
    const currency = account.currency ?? inferCurrency(account.bank_name);
    return {
      id: account.id,
      name: account.account_name,
      accountNumber: maskAccountNumber(account.account_number),
      accountNumberFull: account.account_number,
      bankName: account.bank_name,
      bankCode: account.bank_code,
      currency,
      country: inferCountry(currency),
      isDefault: account.default ?? false,
      createdAt: account.created_at,
    };
  });
}

export function BeneficiariesTable({ bankAccounts }: BeneficiariesTableProps) {
  const beneficiaries = transformToBeneficiaries(bankAccounts);

  if (beneficiaries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Beneficiaries</CardTitle>
          <CardDescription>Saved bank accounts for this customer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
            No beneficiaries found
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Beneficiaries</CardTitle>
        <CardDescription>
          {beneficiaries.length} saved bank account{beneficiaries.length !== 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Account Name</TableHead>
                <TableHead>Account Number</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
                {beneficiaries.some((b) => b.createdAt) && <TableHead>Added</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {beneficiaries.map((beneficiary) => (
                <TableRow key={beneficiary.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "rounded-full p-1.5",
                          beneficiary.isDefault
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <User className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-medium">{beneficiary.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CreditCard className="text-muted-foreground h-4 w-4" />
                      <span className="font-mono text-sm">{beneficiary.accountNumber}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm">{beneficiary.bankName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {beneficiary.currency}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{getFlagEmoji(beneficiary.country)}</span>
                      <span className="text-muted-foreground text-sm">{beneficiary.country}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {beneficiary.isDefault ? (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Default
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Active</Badge>
                    )}
                  </TableCell>
                  {beneficiaries.some((b) => b.createdAt) && (
                    <TableCell className="text-muted-foreground text-sm">
                      {beneficiary.createdAt
                        ? format(new Date(beneficiary.createdAt), "MMM dd, yyyy")
                        : "—"}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper to get flag emoji from country name
function getFlagEmoji(country: string): string {
  const countryToCode: Record<string, string> = {
    Nigeria: "NG",
    Kenya: "KE",
    Ghana: "GH",
    "South Africa": "ZA",
    "United States": "US",
  };

  const code = countryToCode[country] ?? "NG";
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
