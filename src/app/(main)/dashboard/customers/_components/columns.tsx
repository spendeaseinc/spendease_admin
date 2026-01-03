/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
"use client";

import Link from "next/link";

import type { ColumnDef } from "@tanstack/react-table";
import { format, formatDistanceToNow } from "date-fns";
import { ArrowUpDown, Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/types";
import { getStatusVariant } from "@/lib/utils";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-mono text-sm">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "first_name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const firstName = row.getValue("first_name") as string;
      const lastName = row.original.last_name;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{`${firstName} ${lastName}`}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return <div className="text-sm">{row.getValue("email")}</div>;
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      return <div className="font-mono text-sm">{row.getValue("phone")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={getStatusVariant(status)} className="font-medium capitalize">
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Joined
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
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
    cell: ({ row }) => {
      const customerId = row.original.id;

      return (
        <Link href={`/dashboard/customers/${customerId}`}>
          <Button variant="ghost" size="sm" className="flex items-center">
            <Eye className="h-4 w-4" /> View
          </Button>
        </Link>
      );
    },
  },
];
