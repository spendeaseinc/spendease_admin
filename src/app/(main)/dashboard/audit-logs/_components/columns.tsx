/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format, formatDistanceToNow } from "date-fns";
import { ArrowUpDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AuditLog } from "@/lib/types";

export const columns: ColumnDef<AuditLog>[] = [
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
    cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("reference")}</div>,
  },
  {
    accessorKey: "event",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Event
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const event = row.getValue("event") as string;
      return (
        <Badge variant="outline" className="font-medium">
          {event}
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
      return <div className="truncate text-sm">{row.getValue("description")}</div>;
    },
  },
  {
    accessorKey: "actor",
    header: "Actor",
    cell: ({ row }) => {
      const actor = row.getValue("actor") as string;
      const actorId = row.original.actor_id;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{actor}</span>
          <span className="text-muted-foreground text-xs">ID: {actorId}</span>
        </div>
      );
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
          <span className="text-sm">{format(date, "MMM dd, yyyy")}</span>
          <span className="text-muted-foreground text-xs">{formatDistanceToNow(date, { addSuffix: true })}</span>
        </div>
      );
    },
  },
];
