"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import type { CustomerAccount, CustomerTransaction } from "@/lib/types";

export const accountColumns: ColumnDef<CustomerAccount>[] = [
  {
    accessorKey: "currency",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Currency" />,
    cell: ({ row }) => <span className="font-medium">{row.original.currency}</span>,
  },
  {
    accessorKey: "accountNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Account Number" />,
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.accountNumber}</span>,
  },
  {
    accessorKey: "bankMobileMoney",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Bank/Mobile money" />,
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.bankMobileMoney}</span>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={status === "Active" ? "default" : "secondary"}
          className={
            status === "Active"
              ? "bg-green-500/10 text-green-700 hover:bg-green-500/20"
              : "bg-orange-500/10 text-orange-700 hover:bg-orange-500/20"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "balance",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Account Balance" />,
    cell: ({ row }) => <span className="font-medium">{row.original.balance}</span>,
  },
];

export const transactionColumns: ColumnDef<CustomerTransaction>[] = [
  {
    accessorKey: "transactionId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Transaction ID" />,
    cell: ({ row }) => <span className="font-medium">{row.original.transactionId}</span>,
  },
  {
    accessorKey: "currency",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Currency" />,
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.currency}</span>,
  },
  {
    accessorKey: "beneficiaryAccount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Beneficiary account" />,
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.beneficiaryAccount}</span>,
  },
  {
    accessorKey: "bankMobileMoney",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Bank/Mobile money" />,
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.bankMobileMoney}</span>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={status === "Active" ? "default" : "secondary"}
          className={
            status === "Active"
              ? "bg-green-500/10 text-green-700 hover:bg-green-500/20"
              : "bg-orange-500/10 text-orange-700 hover:bg-orange-500/20"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Time stamp" />,
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.timestamp}</span>,
  },
  {
    accessorKey: "balance",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Account Balance" />,
    cell: ({ row }) => {
      const balance = row.original.balance;
      const isNegative = balance.startsWith("-");
      return <span className={`font-medium ${isNegative ? "text-red-600" : "text-green-600"}`}>{balance}</span>;
    },
  },
];
