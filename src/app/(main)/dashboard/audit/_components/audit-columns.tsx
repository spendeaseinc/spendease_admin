"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import type { AuditLog } from "@/lib/types";

export const auditColumns: ColumnDef<AuditLog>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const log = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium">
            {log.initials}
          </div>
          <span className="font-medium">{log.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "event",
    header: "Event",
    cell: ({ row }) => <div className="text-sm">{row.getValue("event")}</div>,
  },
  {
    accessorKey: "reference",
    header: "Reference",
    cell: ({ row }) => <div className="text-muted-foreground text-sm">{row.getValue("reference")}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <div className="text-sm">{row.getValue("description")}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <span className="bg-muted inline-flex rounded-md px-2 py-1 text-xs font-medium">{row.getValue("role")}</span>
    ),
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => <div className="text-sm">{row.getValue("timestamp")}</div>,
  },
];
