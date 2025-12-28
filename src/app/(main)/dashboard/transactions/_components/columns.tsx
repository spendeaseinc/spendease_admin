/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { WalletTransaction } from "@/lib/types";
import { getStatusVariant } from "@/lib/utils";

export const createColumns = (onViewDetails: (id: number) => void): ColumnDef<WalletTransaction>[] => [
  {
    accessorKey: "reference",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Reference
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("reference")}</div>,
  },
  {
    accessorKey: "user_id",
    header: "User",
    cell: ({ row }) => {
      const user = row.original.user;
      if (user && user.first_name && user.last_name) {
        return <div>{`${user.first_name} ${user.last_name}`}</div>;
      }
      return <div>User #{row.getValue("user_id")}</div>;
    },
  },
  {
    accessorKey: "currency",
    header: "Currency",
    cell: ({ row }) => <div className="font-medium">{row.getValue("currency")}</div>,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("amount"));
      const currency = row.original.currency;
      return (
        <div className="font-medium">
          {currency} {amount.toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return <div className="capitalize">{type.replace(/-/g, " ")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={getStatusVariant(status)} className="capitalize">
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return <div className="max-w-[200px] truncate">{description}</div>;
    },
  },
  {
    accessorKey: "previous_balance",
    header: "Previous Balance",
    cell: ({ row }) => {
      const balance = Number.parseFloat(row.getValue("previous_balance"));
      const currency = row.original.currency;
      return (
        <div>
          {currency} {balance.toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: "current_balance",
    header: "Current Balance",
    cell: ({ row }) => {
      const balance = Number.parseFloat(row.getValue("current_balance"));
      const currency = row.original.currency;
      return (
        <div>
          {currency} {balance.toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return <div>{format(date, "MMM dd, yyyy HH:mm")}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <Button variant="ghost" size="icon" onClick={() => onViewDetails(row.original.id)} className="h-8 w-8">
          <Eye className="h-4 w-4" />
        </Button>
      );
    },
  },
];
