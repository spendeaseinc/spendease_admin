import { fetchVerifications } from "@/app/actions/verifications";
import { VerificationRequest } from "@/lib/types/verification";

import { VerificationsClient } from "./_components/verifications-client";

export default async function VerificationsPage() {
  const result = await fetchVerifications({ page: 1, pageSize: 10 });

  let initialData: VerificationRequest[] = [];
  let totalItems = 0;

  if ("success" in result === false) {
    // Success response doesn't have success: false
    // TypeScript narrowing for success response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = result as any;
    initialData = response.data.data;
    totalItems = response.data.paging.total_items;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Verifications</h1>
        <p className="text-muted-foreground">Manage and review customer address verification requests.</p>
      </div>

      <VerificationsClient
        initialData={initialData}
        initialPagination={{
          totalItems,
          currentPage: 1,
          pageSize: 10,
        }}
      />
    </div>
  );
}
