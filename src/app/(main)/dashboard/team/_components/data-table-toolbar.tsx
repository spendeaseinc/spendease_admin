"use client";

import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TeamMemberRole } from "@/lib/types";
import { formatToTitleCase } from "@/lib/utils";

interface DataTableToolbarProps<TData> {
  table?: Table<TData>;
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
  roles: TeamMemberRole[];
  onReset: () => void;
}

export function DataTableToolbar<TData>({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  roleFilter,
  onRoleFilterChange,
  roles,
  onReset,
}: DataTableToolbarProps<TData>) {
  const isFiltered = searchValue !== "" || statusFilter !== "all" || roleFilter !== "all";

  return (
    <div className="flex flex-1 flex-col items-center gap-2 md:flex-row">
      <Input
        placeholder="Search by name or email..."
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        className="h-8 w-full md:w-[150px] lg:w-[250px]"
      />
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="h-8 w-full md:w-fit">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
      <Select value={roleFilter} onValueChange={onRoleFilterChange}>
        <SelectTrigger className="h-8 w-full md:w-fit">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          {roles.map((role) => (
            <SelectItem className="capitalize" key={role.id} value={role.id.toString()}>
              {formatToTitleCase(role.name)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isFiltered && (
        <Button onClick={onReset} className="h-8 px-2 lg:px-3">
          Reset
          <X className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
