/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable max-lines */
/* eslint-disable complexity */
"use client";

import { useState, useTransition } from "react";

import { format } from "date-fns";
import {
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Hash,
  Mail,
  Megaphone,
  MessageSquare,
  User,
  XCircle,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { approveNotification, rejectNotification } from "@/app/actions/notifications";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { Notification, NotificationStatus } from "@/lib/types";

interface NotificationDetailSheetProps {
  notification: Notification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userRole?: string;
}

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

const getApprovalStatusColor = (status: string | null | undefined): string => {
  switch (status) {
    case "pending_approval":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
    case "approved":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function NotificationDetailSheet({
  notification,
  open,
  onOpenChange,
  userRole,
}: NotificationDetailSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedBody, setEditedBody] = useState("");
  const [declineReason, setDeclineReason] = useState("");

  if (!notification) return null;

  const isUnique = notification.type === "unique";
  const isBroadcast = notification.type === "broadcast" || notification.type === "general";
  const isPendingApproval = notification.approval_status === "pending_approval";
  const canApprove = userRole && ["owner", "admin"].includes(userRole.toLowerCase()) && isPendingApproval;

  const handleOpenApproveDialog = () => {
    setEditedTitle(notification.title);
    setEditedBody(notification.body);
    setShowApproveDialog(true);
  };

  const handleOpenDeclineDialog = () => {
    setDeclineReason("");
    setShowDeclineDialog(true);
  };

  const handleApprove = async () => {
    setIsSubmitting(true);

    startTransition(async () => {
      const result = await approveNotification(notification.id, {
        title: editedTitle !== notification.title ? editedTitle : undefined,
        body: editedBody !== notification.body ? editedBody : undefined,
      });

      setIsSubmitting(false);
      setShowApproveDialog(false);

      if ("success" in result && !result.success) {
        toast.error(result.message || "Failed to approve notification");
        return;
      }

      toast.success(result.message || "Notification approved and queued for broadcast!");
      onOpenChange(false);
    });
  };

  const handleDecline = async () => {
    setIsSubmitting(true);

    startTransition(async () => {
      const result = await rejectNotification(notification.id, {
        reason: declineReason || undefined,
      });

      setIsSubmitting(false);
      setShowDeclineDialog(false);

      if ("success" in result && !result.success) {
        toast.error(result.message || "Failed to decline notification");
        return;
      }

      toast.success(result.message || "Notification declined.");
      onOpenChange(false);
    });
  };

  return (
    <>
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
                  {notification.type === "general" ? "broadcast" : notification.type}
                </Badge>
              </div>
            </div>

            {/* Approval Status Banner - Show for broadcast notifications with approval status */}
            {isBroadcast && notification.approval_status && (
              <div
                className={`rounded-lg p-4 ${
                  notification.approval_status === "pending_approval"
                    ? "bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800"
                    : notification.approval_status === "approved"
                      ? "bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-800"
                      : "bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-800"
                }`}
              >
                <div className="flex items-start gap-3">
                  {notification.approval_status === "pending_approval" ? (
                    <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
                  ) : notification.approval_status === "approved" ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        notification.approval_status === "pending_approval"
                          ? "text-amber-800 dark:text-amber-200"
                          : notification.approval_status === "approved"
                            ? "text-green-800 dark:text-green-200"
                            : "text-red-800 dark:text-red-200"
                      }`}
                    >
                      {notification.approval_status === "pending_approval"
                        ? "Pending Review"
                        : notification.approval_status === "approved"
                          ? "Approved"
                          : "Declined"}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        notification.approval_status === "pending_approval"
                          ? "text-amber-700 dark:text-amber-300"
                          : notification.approval_status === "approved"
                            ? "text-green-700 dark:text-green-300"
                            : "text-red-700 dark:text-red-300"
                      }`}
                    >
                      {notification.approval_status === "pending_approval" ? (
                        <>
                          This notification was submitted by{" "}
                          <span className="font-medium">
                            {notification.creator
                              ? `${notification.creator.first_name} ${notification.creator.last_name}`
                              : "a team member"}
                          </span>
                          {notification.creator?.role_name && (
                            <> ({notification.creator.role_name.replace("_", " ")})</>
                          )}{" "}
                          and requires approval before being broadcast.
                        </>
                      ) : notification.approval_status === "approved" ? (
                        "This notification has been approved and sent to all users."
                      ) : (
                        <>
                          This notification was declined.
                          {notification.rejection_reason && (
                            <>
                              <br />
                              <span className="font-medium">Reason:</span> {notification.rejection_reason}
                            </>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

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

                {notification.approval_status && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm font-medium">Approval Status</span>
                    </div>
                    <Badge className={getApprovalStatusColor(notification.approval_status)}>
                      {notification.approval_status === "pending_approval"
                        ? "Pending"
                        : notification.approval_status.charAt(0).toUpperCase() + notification.approval_status.slice(1)}
                    </Badge>
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
                    This notification was automatically generated based on user activity on their account. It relates to
                    a transaction or account event.
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

            {isBroadcast && !isPendingApproval && (
              <div className="space-y-4">
                <h3 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
                  <Megaphone className="h-4 w-4" />
                  Broadcast Information
                </h3>
                <div className="bg-muted/30 rounded-lg border p-4">
                  <p className="text-muted-foreground text-sm">
                    This notification was created by an administrator and sent to all users. It may contain
                    announcements, updates, or promotional content.
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

            {/* Delivery Status Timeline - Only show for non-pending-approval notifications */}
            {!isPendingApproval && (
              <>
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
                      <span className={`text-sm ${notification.status === "read" ? "" : "text-muted-foreground"}`}>
                        Read
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Approval/Decline Buttons - Show for admin/owner viewing pending notifications */}
            {canApprove && (
              <>
                <Separator />
                <div className="space-y-3">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleOpenApproveDialog}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Notification
                  </Button>
                  <Button variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950" onClick={handleOpenDeclineDialog}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Decline
                  </Button>
                </div>
              </>
            )}

            {/* Edit button removed - backend doesn't allow editing approved/sent notifications */}
          </div>
        </SheetContent>
      </Sheet>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Approve Notification
            </DialogTitle>
            <DialogDescription>
              Review and optionally edit the notification before approving. Once approved, this notification will be
              broadcast to all users and cannot be edited.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <Label htmlFor="approve-title">Title</Label>
              <Input
                id="approve-title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Notification title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="approve-body">Body</Label>
              <Textarea
                id="approve-body"
                value={editedBody}
                onChange={(e) => setEditedBody(e.target.value)}
                placeholder="Notification body"
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 dark:bg-amber-950/30 dark:border-amber-800">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-300">
                This action cannot be undone. The notification will be immediately queued for broadcast to all users.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isSubmitting || !editedTitle.trim() || !editedBody.trim()}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting ? "Approving..." : "Confirm Approval"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decline Dialog */}
      <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Decline Notification
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for declining this notification. The submitter will be notified and can revise
              their request.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm font-medium">{notification.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{notification.body}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="decline-reason">Decline Reason (Optional)</Label>
              <Textarea
                id="decline-reason"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Explain why this notification is being declined..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeclineDialog(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleDecline} disabled={isSubmitting} className="bg-red-600 text-white hover:bg-red-700">
              {isSubmitting ? "Declining..." : "Confirm Decline"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
