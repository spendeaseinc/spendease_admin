"use client";

import type { Table } from "@tanstack/react-table";
import { XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataTableToolbarProps<TData> {
  table?: Table<TData>;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onReset: () => void;
}

export function DataTableToolbar<TData>({ searchValue, onSearchChange, onReset }: DataTableToolbarProps<TData>) {
  const isFiltered = searchValue !== "";

  return (
    <div className="flex flex-1 flex-col items-center gap-2 md:flex-row">
      <Input
        placeholder="Search customers..."
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        className="h-9 w-full md:w-[200px] lg:w-[300px]"
      />
      {isFiltered && (
        <Button onClick={onReset} className="h-9 w-full px-2 md:w-fit lg:px-3">
          Reset
          <XCircle className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
