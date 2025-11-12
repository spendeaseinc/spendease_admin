import { DataTable } from "@/components/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Card, CardContent } from "@/components/ui/card";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import type { CustomerAccount } from "@/lib/types";

import { accountColumns } from "./customer-detail-columns";

interface AccountInfoTabProps {
  accounts: CustomerAccount[];
}

export function AccountInfoTab({ accounts }: AccountInfoTabProps) {
  const accountTable = useDataTableInstance({
    data: accounts,
    columns: accountColumns,
    getRowId: (row) => row.id,
  });

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="overflow-hidden rounded-md border">
          <DataTable table={accountTable} columns={accountColumns} />
        </div>
        <DataTablePagination table={accountTable} />
      </CardContent>
    </Card>
  );
}
