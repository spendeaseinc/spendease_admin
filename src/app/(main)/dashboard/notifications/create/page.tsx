import { redirect } from "next/navigation";

import { getSession } from "@/app/actions/auth";

import { CreateNotificationClient } from "./_components/create-notification-client";

export const metadata = {
  title: "Create Notification - SpendEase Admin Dashboard",
  description: "Create and send broadcast notifications to users",
};

export default async function NotificationCreatePage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Get user role - handle both possible structures
  const userRole = session.user.role_name?.name ?? session.user.admin_role?.name ?? "admin";
  const userName = `${session.user.first_name} ${session.user.last_name}`;

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <CreateNotificationClient userRole={userRole} userName={userName} />
    </div>
  );
}
