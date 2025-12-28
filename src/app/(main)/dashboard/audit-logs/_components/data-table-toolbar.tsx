"use client";

import type { Table } from "@tanstack/react-table";
import { formatDate } from "date-fns";
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
  eventFilter: string;
  onEventFilterChange: (value: string) => void;
  actorFilter: string;
  onActorFilterChange: (value: string) => void;
  dateFrom: Date | undefined;
  onDateFromChange: (date: Date | undefined) => void;
  dateTo: Date | undefined;
  onDateToChange: (date: Date | undefined) => void;
  onReset: () => void;
}

export function DataTableToolbar<TData>({
  searchValue,
  onSearchChange,
  eventFilter,
  onEventFilterChange,
  actorFilter,
  onActorFilterChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  onReset,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    searchValue !== "" ||
    eventFilter !== "all" ||
    actorFilter !== "all" ||
    dateFrom !== undefined ||
    dateTo !== undefined;

  return (
    <div className="flex flex-1 flex-col items-center gap-2 md:flex-row">
      <Input
        placeholder="Search audit logs..."
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        className="h-9 w-full md:w-[200px] lg:w-[300px]"
      />
      <Select value={eventFilter} onValueChange={onEventFilterChange}>
        <SelectTrigger className="h-9 w-full md:w-fit">
          <SelectValue placeholder="Filter by event" />
        </SelectTrigger>
        <SelectContent className="bg-background">
          <SelectItem value="all">All Events</SelectItem>
          <SelectItem value="login">Login</SelectItem>
          <SelectItem value="transaction_update">Transactions Update</SelectItem>
          <SelectItem value="settings_update">Settings Update</SelectItem>
        </SelectContent>
      </Select>
      <Select value={actorFilter} onValueChange={onActorFilterChange}>
        <SelectTrigger className="h-9 w-full md:w-fit">
          <SelectValue placeholder="Filter by actor" />
        </SelectTrigger>
        <SelectContent className="bg-background">
          <SelectItem value="all">All Actors</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="user">User</SelectItem>
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-9 w-full justify-start bg-transparent text-left font-normal md:w-fit">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateFrom ? formatDate(dateFrom, "MMM d, yyyy") : "Date from"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-background w-auto p-0" align="start">
          <Calendar mode="single" selected={dateFrom} onSelect={onDateFromChange} initialFocus />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-9 w-full justify-start bg-transparent text-left font-normal md:w-fit">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateTo ? formatDate(dateTo, "MMM d, yyyy") : "Date to"}
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
