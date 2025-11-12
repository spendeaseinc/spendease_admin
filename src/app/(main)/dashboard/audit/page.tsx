import { Metadata } from "next";

import { AuditLogsClient } from "./_components/audit-logs-client";

export const metadata: Metadata = {
  title: "Audit Logs - SpendEase Admin",
  description:
    "Audit Logs Page - SpendEase Admin: Your reliable ally in cross-border payments, helping individuals, small businesses, and partners navigate international transactions to reach their financial aspirations.",
};

export default function AuditLogsPage() {
  return <AuditLogsClient />;
}
