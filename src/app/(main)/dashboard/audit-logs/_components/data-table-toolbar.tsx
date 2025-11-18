"use client";

import type { Table } from "@tanstack/react-table";
import { XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchValue: string;
  onSearchChange: (value: string) => void;
  eventFilter: string;
  onEventFilterChange: (value: string) => void;
  actorFilter: string;
  onActorFilterChange: (value: string) => void;
  onReset: () => void;
}

export function DataTableToolbar<TData>({
  searchValue,
  onSearchChange,
  eventFilter,
  onEventFilterChange,
  actorFilter,
  onActorFilterChange,
  onReset,
}: DataTableToolbarProps<TData>) {
  const isFiltered = searchValue !== "" || eventFilter !== "all" || actorFilter !== "all";

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
      {isFiltered && (
        <Button onClick={onReset} className="h-9 w-full px-2 md:w-fit lg:px-3">
          Reset
          <XCircle className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
