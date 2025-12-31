/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Notification, NotificationStatus } from "@/lib/types";

const getStatusVariant = (status: NotificationStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "delivered":
    case "read":
      return "default";
    case "sent":
      return "secondary";
    case "pending":
      return "outline";
    case "failed":
      return "destructive";
    default:
      return "outline";
  }
};

export const columns: ColumnDef<Notification>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "user_id",
    header: "User ID",
    cell: ({ row }) => {
      const userId = row.getValue("user_id");
      return <div className="text-sm">{userId ? `#${userId}` : "—"}</div>;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <Badge variant={type === "unique" ? "secondary" : "outline"} className="capitalize">
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return <div className="max-w-[200px] truncate font-medium">{row.getValue("title")}</div>;
    },
  },
  {
    accessorKey: "body",
    header: "Body",
    cell: ({ row }) => {
      return <div className="text-muted-foreground max-w-[250px] truncate text-sm">{row.getValue("body")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as NotificationStatus;
      return (
        <Badge variant={getStatusVariant(status)} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return <div className="text-sm">{format(date, "MMM dd, yyyy HH:mm")}</div>;
    },
  },
];
