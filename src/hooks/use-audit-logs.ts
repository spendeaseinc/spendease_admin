import { useState, useEffect } from "react";

import { getAuditLogs } from "@/app/actions/audit";
import { AuditLog, PaginationData } from "@/lib/types";

export function useAuditLogs(page = 1) {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    total_items: 0,
    page_size: 10,
    current: 1,
    count: 0,
    next: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const fetchAuditLogs = async (page = 1) => {
    try {
      setLoading(true);
      const result = await getAuditLogs(page);

      if (result.success) {
        setAuditLogs(result.auditLogs);
        setPagination(result.pagination);
        setError(null);
      } else {
        setError(result.message);
        setAuditLogs([]);
      }
    } catch (err) {
      setError(`Failed to fetch audit logs: ${err}`);
      setAuditLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs(page);
  }, [page]);

  return {
    auditLogs,
    loading,
    pagination,
    fetchAuditLogs,
    error,
  };
}
