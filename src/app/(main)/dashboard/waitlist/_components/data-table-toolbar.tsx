"use client";

import { XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DataTableToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onReset: () => void;
}

export function DataTableToolbar({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onReset,
}: DataTableToolbarProps) {
  const isFiltered = searchValue !== "" || statusFilter !== "all";

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          placeholder="Search by email..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 w-full sm:w-[300px]"
        />
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="h-10 w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        {isFiltered && (
          <Button onClick={onReset} className="h-10 px-3">
            Reset
            <XCircle className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
