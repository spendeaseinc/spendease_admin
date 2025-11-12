import { Table } from "@tanstack/react-table";
import { CrossIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center">
        <Input
          placeholder="Search by description..."
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("description")?.setFilterValue(event.target.value)}
          className="h-10 w-full md:w-[350px] lg:w-[500px]"
        />
        {table.getColumn("event") && (
          <DataTableFacetedFilter
            column={table.getColumn("event")}
            title="Event"
            options={[
              {
                label: "Login",
                value: "login",
              },
              {
                label: "Transaction Update",
                value: "transaction_update",
              },
            ]}
          />
        )}
        {table.getColumn("actor") && (
          <DataTableFacetedFilter
            column={table.getColumn("actor")}
            title="Actors"
            options={[
              {
                label: "Admin",
                value: "admin",
              },
              {
                label: "User",
                value: "user",
              },
            ]}
          />
        )}
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <CrossIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
