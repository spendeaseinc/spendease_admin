/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TeamMemberData } from "@/lib/types";

type StatusType = "active" | "inactive";

const statusVariants: Record<StatusType, "default" | "destructive"> = {
  active: "default",
  inactive: "destructive",
};

const getStatusVariant = (status: string): "default" | "destructive" => {
  if (status in statusVariants) {
    return statusVariants[status as StatusType];
  }
  return "default";
};

export const columns: ColumnDef<TeamMemberData>[] = [
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
    accessorKey: "admin_role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.admin_role;
      return (
        <Badge variant="outline" className="font-medium capitalize">
          {role.name}
        </Badge>
      );
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
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="flex flex-col">
          <span className="text-sm">{date.toLocaleDateString()}</span>
          <span className="text-muted-foreground text-xs">{formatDistanceToNow(date, { addSuffix: true })}</span>
        </div>
      );
    },
  },
];
