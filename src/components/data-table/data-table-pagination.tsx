import { Table } from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
  onPaginationChange?: (page: number, limit: number) => void;
}

export function DataTablePagination<TData>({ table, pagination, onPaginationChange }: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-muted-foreground flex-1 text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {pagination?.page ?? table.getState().pagination.pageIndex + 1} of{" "}
          {pagination ? Math.ceil(pagination.total / pagination.limit) : table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              if (onPaginationChange) {
                onPaginationChange(1, pagination?.limit ?? 10);
              } else {
                table.setPageIndex(0);
              }
            }}
            disabled={pagination ? pagination.page === 1 : !table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              if (onPaginationChange) {
                onPaginationChange((pagination?.page ?? 1) - 1, pagination?.limit ?? 10);
              } else {
                table.previousPage();
              }
            }}
            disabled={pagination ? pagination.page === 1 : !table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              if (onPaginationChange) {
                onPaginationChange((pagination?.page ?? 1) + 1, pagination?.limit ?? 10);
              } else {
                table.nextPage();
              }
            }}
            disabled={
              pagination ? pagination.page >= Math.ceil(pagination.total / pagination.limit) : !table.getCanNextPage()
            }
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              if (onPaginationChange) {
                onPaginationChange(
                  Math.ceil((pagination?.total ?? 0) / (pagination?.limit ?? 10)),
                  pagination?.limit ?? 10,
                );
              } else {
                table.setPageIndex(table.getPageCount() - 1);
              }
            }}
            disabled={
              pagination ? pagination.page >= Math.ceil(pagination.total / pagination.limit) : !table.getCanNextPage()
            }
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
