/* eslint-disable react/no-array-index-key */
/* eslint-disable prettier/prettier */
"use client";

import * as React from "react";

import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { RefreshCw, SlidersHorizontal, XCircle } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VerificationRequest, VerificationStats } from "@/lib/types/verification";
import { formatToTitleCase } from "@/lib/utils";

import { DataTablePagination } from "../../customers/_components/data-table-pagination";

import { VerificationStatsCards } from "./stats-cards";
import { VerificationDetailSheet } from "./verification-detail-sheet";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    stats: VerificationStats | null;
    totalItems: number;
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    searchValue: string;
    onSearchChange: (value: string) => void;
    statusFilter: string;
    onStatusFilterChange: (value: string) => void;
    documentTypeFilter: string;
    onDocumentTypeFilterChange: (value: string) => void;
    isLoading: boolean;
    isStatsLoading: boolean;
    onReset: () => void;
    onRefresh: () => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    stats,
    totalItems,
    currentPage,
    pageSize,
    onPageChange,
    onPageSizeChange,
    searchValue,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    documentTypeFilter,
    onDocumentTypeFilterChange,
    isLoading,
    isStatsLoading,
    onReset,
    onRefresh,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [selectedRequest, setSelectedRequest] = React.useState<VerificationRequest | null>(null);
    const [isDetailOpen, setIsDetailOpen] = React.useState(false);

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
        },
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        pageCount: Math.ceil(totalItems / pageSize),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleRowClick = (row: any) => {
        setSelectedRequest(row.original as VerificationRequest);
        setIsDetailOpen(true);
    };

    const handleCloseDetail = () => {
        setIsDetailOpen(false);
        // Refresh data when closing in case status changed
        if (selectedRequest) {
            onRefresh();
        }
        setTimeout(() => setSelectedRequest(null), 300); // Clear after animation
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <VerificationStatsCards stats={stats} isLoading={isStatsLoading} />

            <div className="flex flex-col space-y-4">
                {/* Tabs for quick filtering */}
                <Tabs value={statusFilter} onValueChange={onStatusFilterChange} className="w-full">
                    <TabsList>
                        <TabsTrigger value="all">All Requests</TabsTrigger>
                        <TabsTrigger value="pending_ocr">Queue</TabsTrigger>
                        <TabsTrigger value="pending_review">Needs Review</TabsTrigger>
                        <TabsTrigger value="approved">Approved</TabsTrigger>
                        <TabsTrigger value="declined">Declined</TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Toolbar */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-1 items-center space-x-2">
                        <Input
                            placeholder="Search customers..."
                            value={searchValue}
                            onChange={(event) => onSearchChange(event.target.value)}
                            className="h-8 w-[150px] lg:w-[250px]"
                        />

                        <Select value={documentTypeFilter} onValueChange={onDocumentTypeFilterChange}>
                            <SelectTrigger className="h-8 w-[150px]">
                                <SelectValue placeholder="Document Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Documents</SelectItem>
                                <SelectItem value="utility_bill">Utility Bill</SelectItem>
                                <SelectItem value="bank_statement">Bank Statement</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Reset Button if filters active */}
                        {(searchValue || statusFilter !== "all" || documentTypeFilter !== "all") && (
                            <Button variant="ghost" onClick={onReset} className="h-8 px-2 lg:px-3">
                                Reset
                                <XCircle className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="h-8" onClick={onRefresh} disabled={isLoading}>
                            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
                                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                                    View
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[150px]">
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
                                                onCheckedChange={(value) => column.toggleVisibility(value)}
                                            >
                                                {formatToTitleCase(column.id)}
                                            </DropdownMenuCheckboxItem>
                                        );
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Table */}
                <Card className="rounded-lg border bg-transparent py-0">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/50">
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
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
                                    <TableRow key={`skeleton-row-${index}`}>
                                        {columns.map((column, colIndex) => (

                                            <TableCell key={`skeleton-cell-${index}-${colIndex}`}>
                                                <Skeleton className="h-6 w-full" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="hover:bg-muted/30 cursor-pointer"
                                        onClick={() => handleRowClick(row)}
                                    >
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

            {/* Detail Sheet */}
            {selectedRequest && (
                <VerificationDetailSheet
                    request={selectedRequest}
                    isOpen={isDetailOpen}
                    onClose={handleCloseDetail}
                    onStatusChange={() => {
                        // Status changed (approved/declined), close and refresh
                        setIsDetailOpen(false);
                        onRefresh();
                        setSelectedRequest(null);
                    }}
                />
            )}
        </div>
    );
}
