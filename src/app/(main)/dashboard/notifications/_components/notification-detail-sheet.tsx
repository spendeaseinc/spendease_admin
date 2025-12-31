/* eslint-disable complexity */
"use client";

import { format } from "date-fns";
import { Bell, Calendar, Clock, Edit, Hash, Mail, Megaphone, MessageSquare, User, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { Notification, NotificationStatus } from "@/lib/types";

interface NotificationDetailSheetProps {
  notification: Notification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (notification: Notification) => void;
}

const getStatusVariant = (status: NotificationStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "delivered":
    case "read":
      return "default";
    case "sent":
      return "secondary";
    case "pending":
      return "outline";
    case "failed":
      return "destructive";
    default:
      return "outline";
  }
};

const getStatusColor = (status: NotificationStatus): string => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "read":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "sent":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "pending":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function NotificationDetailSheet({ notification, open, onOpenChange, onEdit }: NotificationDetailSheetProps) {
  if (!notification) return null;

  const isUnique = notification.type === "unique";
  const isBroadcast = notification.type === "broadcast";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-lg">
              {isUnique ? <Zap className="h-5 w-5 text-amber-500" /> : <Megaphone className="h-5 w-5 text-blue-500" />}
              Notification Details
            </SheetTitle>
          </div>
          <SheetDescription className="sr-only">Details for notification #{notification.id}</SheetDescription>
        </SheetHeader>

        <div className="mt-2 space-y-6 px-4 pb-6">
          {/* Status and Type Header */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground text-sm">Status</span>
              <Badge className={getStatusColor(notification.status)}>
                {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground text-sm">Type</span>
              <Badge variant={isUnique ? "secondary" : "outline"} className="capitalize">
                {notification.type}
              </Badge>
            </div>
          </div>

          {/* Notification Content */}
          <div className="space-y-4">
            <h3 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
              <MessageSquare className="h-4 w-4" />
              Content
            </h3>
            <div className="space-y-3 rounded-lg border p-4">
              <div>
                <label className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Title</label>
                <p className="mt-1 font-medium">{notification.title}</p>
              </div>
              <Separator />
              <div>
                <label className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Body</label>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{notification.body}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Details based on type */}
          <div className="space-y-4">
            <h3 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
              <Bell className="h-4 w-4" />
              {isUnique ? "Transaction Details" : "Broadcast Details"}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Notification ID</span>
                </div>
                <span className="font-mono text-sm">#{notification.id}</span>
              </div>

              {isUnique && notification.user_id && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">User ID</span>
                  </div>
                  <span className="font-mono text-sm">#{notification.user_id}</span>
                </div>
              )}

              {isBroadcast && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">Recipients</span>
                  </div>
                  <span className="text-sm">All Users</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Created</span>
                </div>
                <span className="text-sm">{format(new Date(notification.created_at), "MMM dd, yyyy")}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Time</span>
                </div>
                <span className="text-sm">{format(new Date(notification.created_at), "hh:mm a")}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Type-specific information */}
          {isUnique && (
            <div className="space-y-4">
              <h3 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
                <Zap className="h-4 w-4" />
                Activity Information
              </h3>
              <div className="bg-muted/30 rounded-lg border p-4">
                <p className="text-muted-foreground text-sm">
                  This notification was automatically generated based on user activity on their account. It relates to a
                  transaction or account event.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Auto-generated
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    User-specific
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {isBroadcast && (
            <div className="space-y-4">
              <h3 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
                <Megaphone className="h-4 w-4" />
                Broadcast Information
              </h3>
              <div className="bg-muted/30 rounded-lg border p-4">
                <p className="text-muted-foreground text-sm">
                  This notification was created by an administrator and sent to all users. It may contain announcements,
                  updates, or promotional content.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Admin-created
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    All users
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Status Timeline */}
          <Separator />
          <div className="space-y-4">
            <h3 className="text-muted-foreground text-sm font-semibold">Delivery Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={`h-3 w-3 rounded-full ${notification.status !== "pending" ? "bg-green-500" : "bg-gray-300"}`}
                />
                <span className={`text-sm ${notification.status !== "pending" ? "" : "text-muted-foreground"}`}>
                  Created
                </span>
              </div>
              <div className="bg-border ml-1.5 h-4 w-px" />
              <div className="flex items-center gap-3">
                <div
                  className={`h-3 w-3 rounded-full ${["sent", "delivered", "read"].includes(notification.status) ? "bg-green-500" : notification.status === "failed" ? "bg-red-500" : "bg-gray-300"}`}
                />
                <span
                  className={`text-sm ${["sent", "delivered", "read", "failed"].includes(notification.status) ? "" : "text-muted-foreground"}`}
                >
                  {notification.status === "failed" ? "Failed to Send" : "Sent"}
                </span>
              </div>
              <div className="bg-border ml-1.5 h-4 w-px" />
              <div className="flex items-center gap-3">
                <div
                  className={`h-3 w-3 rounded-full ${["delivered", "read"].includes(notification.status) ? "bg-green-500" : "bg-gray-300"}`}
                />
                <span
                  className={`text-sm ${["delivered", "read"].includes(notification.status) ? "" : "text-muted-foreground"}`}
                >
                  Delivered
                </span>
              </div>
              <div className="bg-border ml-1.5 h-4 w-px" />
              <div className="flex items-center gap-3">
                <div
                  className={`h-3 w-3 rounded-full ${notification.status === "read" ? "bg-green-500" : "bg-gray-300"}`}
                />
                <span className={`text-sm ${notification.status === "read" ? "" : "text-muted-foreground"}`}>Read</span>
              </div>
            </div>
          </div>

          {/* Action Buttons - Only show Edit for broadcast notifications */}
          {isBroadcast && onEdit && (
            <>
              <Separator />
              <div className="space-y-3">
                <Button className="w-full" onClick={() => onEdit(notification)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Notification
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
