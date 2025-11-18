/* eslint-disable react/no-array-index-key */
"use client";

import * as React from "react";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DownloadIcon, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatToTitleCase } from "@/lib/utils";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  eventFilter: string;
  onEventFilterChange: (value: string) => void;
  actorFilter: string;
  onActorFilterChange: (value: string) => void;
  isLoading: boolean;
  onReset: () => void;
  onExport: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  searchValue,
  onSearchChange,
  eventFilter,
  onEventFilterChange,
  actorFilter,
  onActorFilterChange,
  isLoading,
  onReset,
  onExport,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalItems / pageSize),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <DataTableToolbar
          table={table}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          eventFilter={eventFilter}
          onEventFilterChange={onEventFilterChange}
          actorFilter={actorFilter}
          onActorFilterChange={onActorFilterChange}
          onReset={onReset}
        />
        <div className="hidden items-center space-x-2 md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background w-[180px]">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => {
                        column.toggleVisibility(value);
                      }}
                      onSelect={(event) => {
                        event.preventDefault();
                      }}
                    >
                      {formatToTitleCase(column.id)}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="h-9" onClick={onExport}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      <Card className="rounded-lg bg-transparent py-0">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-accent hover:bg-accent">
                {headerGroup.headers.map((header, index) => {
                  const isFirst = index === 0;
                  const isLast = index === headerGroup.headers.length - 1;
                  return (
                    <TableHead
                      key={header.id}
                      className={`${isFirst ? "rounded-tl-lg" : ""} ${isLast ? "rounded-tr-lg" : ""}`}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {table.getVisibleLeafColumns().map((column) => (
                    <TableCell key={`${column.id}-${index}`}>
                      <Skeleton className="h-10 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      <DataTablePagination
        table={table}
        totalItems={totalItems}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
