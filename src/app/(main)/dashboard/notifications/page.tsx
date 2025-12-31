/* eslint-disable prettier/prettier */
import Link from "next/link";

import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HorizontalTabsList, HorizontalTabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs";

import NotificationCards from "./_components/notification-cards";
import { NotificationsClient } from "./_components/notifications-client";

export const metadata = {
  title: "Notifications - SpendEase Admin Dashboard",
  description: "Manage and view all notifications on the SpendEase Admin Dashboard",
};

export default function NotificationsPage() {
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
      <NotificationCards
        data={{
          unique: { count: 124, percentage: 62.3 },
          broadcast: { count: 75, percentage: 37.7 },
        }}
      />
      <Tabs defaultValue="unique">
        <HorizontalTabsList>
          <HorizontalTabsTrigger value="unique">Unique</HorizontalTabsTrigger>
          <HorizontalTabsTrigger value="broadcast">Broadcast</HorizontalTabsTrigger>
        </HorizontalTabsList>
        <TabsContent className="flex flex-col gap-4 md:gap-6" value="unique">
          <NotificationsClient type="unique" />
        </TabsContent>
        <TabsContent className="flex flex-col gap-4 md:gap-6" value="broadcast">
          <NotificationsClient type="broadcast" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
