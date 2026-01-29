"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format, formatDistanceToNow } from "date-fns";
import { ArrowUpDown, Eye, ShieldAlert, ShieldCheck, Shield } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VerificationRequest, VerificationStatus, VerificationRiskLevel } from "@/lib/types/verification";

const getStatusVariant = (
  status: VerificationStatus,
): "destructive" | "secondary" | "default" | "outline" | "green" => {
  switch (status) {
    case "approved":
      return "green"; // Green
    case "declined":
      return "destructive"; // Red
    case "pending_review":
      return "default"; // For warning-like display
    case "pending_ocr":
    default:
      return "secondary"; // Grey
  }
};

const getStatusLabel = (status: VerificationStatus) => {
  switch (status) {
    case "approved":
      return "Approved";
    case "declined":
      return "Declined";
    case "pending_review":
      return "Needs Review";
    case "pending_ocr":
      return "Processing";
    default:
      return status;
  }
};

const getRiskIcon = (risk: VerificationRiskLevel | undefined) => {
  if (!risk) return null;
  switch (risk) {
    case "high":
      return <ShieldAlert className="h-4 w-4 text-red-600" />;
    case "medium":
      return <Shield className="h-4 w-4 text-amber-600" />;
    case "low":
      return <ShieldCheck className="h-4 w-4 text-emerald-600" />;
    default:
      return null;
  }
};

const getInitials = (firstName: string = "", lastName: string = "") => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const columns: ColumnDef<VerificationRequest>[] = [
  {
    accessorKey: "reference",
    header: "ID",
    cell: ({ row }) => <div className="text-muted-foreground font-mono text-xs">{row.getValue("reference")}</div>,
  },
  {
    accessorKey: "user",
    header: "Customer",
    cell: ({ row }) => {
      const user = row.original.user;
      if (!user) return <span className="text-muted-foreground">Unknown User</span>;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border">
            <AvatarFallback className="bg-primary/5 text-primary text-xs">
              {getInitials(user.first_name, user.last_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {user.first_name} {user.last_name}
            </span>
            <span className="text-muted-foreground text-xs">{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "document_type",
    header: "Document",
    cell: ({ row }) => {
      const type = row.getValue("document_type");
      return (
        <Badge variant="outline" className="text-xs font-normal capitalize">
          {type.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <Badge variant={getStatusVariant(status)} className="whitespace-nowrap capitalize">
          {getStatusLabel(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "risk_level",
    header: "Risk",
    cell: ({ row }) => {
      const risk = row.getValue("risk_level");
      if (!risk) return <span className="text-muted-foreground text-xs">-</span>;

      return (
        <div className="flex items-center gap-1.5" title={`${risk} risk`}>
          {getRiskIcon(risk)}
          <span className="text-muted-foreground text-xs capitalize">{risk}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Submitted
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateValue = row.getValue("created_at");
      // Safety check for valid date
      if (!dateValue) {
        return <span className="text-muted-foreground text-xs">-</span>;
      }

      const date = new Date(dateValue as string);
      if (isNaN(date.getTime())) {
        return <span className="text-muted-foreground text-xs">Invalid date</span>;
      }

      return (
        <div className="flex flex-col">
          <span className="text-sm">{format(date, "MMM dd, yyyy")}</span>
          <span className="text-muted-foreground text-xs">{formatDistanceToNow(date, { addSuffix: true })}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="flex h-8 items-center"
          onClick={() => {
            // This will be handled by the parent row click,
            // but we keep the button for visual affordance
          }}
        >
          <Eye className="mr-2 h-4 w-4" /> View
        </Button>
      );
    },
  },
];
