"use client";

import type { Table } from "@tanstack/react-table";
import { format } from "date-fns";
import { CalendarIcon, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  onDateFromChange: (date: Date | undefined) => void;
  onDateToChange: (date: Date | undefined) => void;
  onReset: () => void;
}

export function DataTableToolbar<TData>({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onReset,
}: DataTableToolbarProps<TData>) {
  const isFiltered = searchValue !== "" || statusFilter !== "all" || dateFrom !== undefined || dateTo !== undefined;

  return (
    <div className="flex flex-1 flex-col items-center gap-2 md:flex-row">
      <Input
        placeholder="Search notifications..."
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        className="h-8 w-full md:w-[150px] lg:w-[250px]"
      />
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="h-8 w-full md:w-fit">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="sent">Sent</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
          <SelectItem value="read">Read</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-9 w-full justify-start text-left font-normal md:w-fit">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateFrom ? format(dateFrom, "MMM dd, yyyy") : "Date from"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-background w-auto p-0" align="start">
          <Calendar mode="single" selected={dateFrom} onSelect={onDateFromChange} initialFocus />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-9 w-full justify-start text-left font-normal md:w-fit">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateTo ? format(dateTo, "MMM dd, yyyy") : "Date to"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-background w-auto p-0" align="start">
          <Calendar mode="single" selected={dateTo} onSelect={onDateToChange} initialFocus />
        </PopoverContent>
      </Popover>
      {isFiltered && (
        <Button onClick={onReset} className="h-9 w-full px-2 md:w-fit lg:px-3">
          Reset
          <XCircle className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
