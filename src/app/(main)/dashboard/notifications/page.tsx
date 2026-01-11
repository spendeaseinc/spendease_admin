/* eslint-disable prettier/prettier */
import Link from "next/link";

import { PlusCircle } from "lucide-react";

import { getSession } from "@/app/actions/auth";
import { fetchNotificationStats, type NotificationStats } from "@/app/actions/notifications";
import { Button } from "@/components/ui/button";
import { HorizontalTabsList, HorizontalTabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs";

import NotificationCards from "./_components/notification-cards";
import { NotificationsClient } from "./_components/notifications-client";

export const metadata = {
  title: "Notifications - SpendEase Admin Dashboard",
  description: "Manage and view all notifications on the SpendEase Admin Dashboard",
};

export default async function NotificationsPage() {
  const session = await getSession();

  // Get user role - handle both possible structures from session
  const userRole = session?.user?.role_name?.name ?? session?.user?.admin_role?.name ?? "admin";

  // Fetch notification stats from backend
  let stats: NotificationStats | null = null;
  const statsResult = await fetchNotificationStats();

  if (!("success" in statsResult)) {
    stats = statsResult;
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="space-y-2 flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Manage and view all notifications</p>
        </div>
        <div>
          <Button>
            <Link href="/dashboard/notifications/create" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Notification
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <NotificationCards stats={stats} />

      {/* Notifications Table */}
      <Tabs defaultValue="unique">
        <HorizontalTabsList>
          <HorizontalTabsTrigger value="unique">Unique</HorizontalTabsTrigger>
          <HorizontalTabsTrigger value="broadcast">Broadcast</HorizontalTabsTrigger>
        </HorizontalTabsList>
        <TabsContent className="flex flex-col gap-4 md:gap-6" value="unique">
          <NotificationsClient type="unique" userRole={userRole} />
        </TabsContent>
        <TabsContent className="flex flex-col gap-4 md:gap-6" value="broadcast">
          <NotificationsClient type="broadcast" userRole={userRole} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
