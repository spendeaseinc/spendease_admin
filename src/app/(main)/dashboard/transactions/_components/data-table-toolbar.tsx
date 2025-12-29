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
  currencyFilter: string;
  onCurrencyFilterChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
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
  currencyFilter,
  onCurrencyFilterChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onReset,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    searchValue !== "" ||
    currencyFilter !== "all" ||
    typeFilter !== "all" ||
    statusFilter !== "all" ||
    dateFrom !== undefined ||
    dateTo !== undefined;

  return (
    <div className="flex flex-1 flex-col items-center gap-2 md:flex-row">
      <Input
        placeholder="Filter transactions..."
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        className="h-8 w-full md:w-[150px] lg:w-[250px]"
      />
      <Select value={currencyFilter} onValueChange={onCurrencyFilterChange}>
        <SelectTrigger className="h-8 w-full md:w-fit">
          <SelectValue placeholder="Currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Currencies</SelectItem>
          <SelectItem value="NGN">NGN</SelectItem>
          <SelectItem value="KES">KES</SelectItem>
          <SelectItem value="GHS">GHS</SelectItem>
          <SelectItem value="ZAR">ZAR</SelectItem>
        </SelectContent>
      </Select>
      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="h-8 w-full md:w-fit">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="transaction-swap">Transaction Swap</SelectItem>
          <SelectItem value="pay-in">Pay In</SelectItem>
          <SelectItem value="pay-out">Pay Out</SelectItem>
          <SelectItem value="internal-transfer">Internal Transfer</SelectItem>
          <SelectItem value="currency-swap">Currency Swap</SelectItem>
          <SelectItem value="deposit">Deposit</SelectItem>
          <SelectItem value="withdrawal">Withdrawal</SelectItem>
          <SelectItem value="fee">Fee</SelectItem>
          <SelectItem value="refund">Refund</SelectItem>
          <SelectItem value="adjustment">Adjustment</SelectItem>
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="h-8 w-full md:w-fit">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="processing">Processing</SelectItem>
          <SelectItem value="success">Success</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
          <SelectItem value="underpaid">Underpaid</SelectItem>
          <SelectItem value="overpaid">Overpaid</SelectItem>
          <SelectItem value="expired">Expired</SelectItem>
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
