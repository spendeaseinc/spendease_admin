/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-lines */
/* eslint-disable complexity */
"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Hash,
  Mail,
  Send,
  Smartphone,
  User,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { createBroadcastNotification } from "@/app/actions/notifications";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface CreateNotificationClientProps {
  userRole: string;
  userName: string;
}

export function CreateNotificationClient({ userRole, userName }: CreateNotificationClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user can push directly (owner or admin)
  const canDirectPush = ["owner", "admin"].includes(userRole.toLowerCase());

  const handlePushNotification = () => {
    setShowConfirmDialog(true);
  };

  const handleSubmitForApproval = () => {
    setShowSubmitDialog(true);
  };

  const handleCreateNotification = async () => {
    setIsSubmitting(true);

    startTransition(async () => {
      const result = await createBroadcastNotification({ title, body });

      setIsSubmitting(false);
      setShowConfirmDialog(false);
      setShowSubmitDialog(false);

      if ("success" in result && !result.success) {
        toast.error(result.message || "Failed to create notification");
        return;
      }
      if ("requiresApproval" in result && result.requiresApproval) {
        toast.success(result.message || "Notification submitted for approval!");
      } else {
        toast.success(result.message || "Notification pushed successfully to all users!");
      }
      setTitle("");
      setBody("");
      router.push("/dashboard/notifications");
    });
  };

  const confirmPush = async () => {
    await handleCreateNotification();
  };

  const confirmSubmit = async () => {
    await handleCreateNotification();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="bg-background min-h-[600px] rounded-lg border border-border">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={handleCancel}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Create Broadcast</h1>
              <p className="text-sm text-muted-foreground">Compose and send broadcast notifications to users</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Logged in as:</span>
            <Badge
              className={
                canDirectPush
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }
            >
              {userRole.charAt(0).toUpperCase() + userRole.slice(1).replace("_", " ")}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left Side - Form */}
        <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-border">
          <Tabs defaultValue="compose" className="space-y-6">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="compose">Compose</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="compose" className="space-y-6">
              {/* Status Banner */}
              <div
                className={`rounded-lg px-4 py-3 flex items-center gap-3 ${
                  canDirectPush
                    ? "bg-orange-50 border border-orange-200 dark:bg-orange-950/30 dark:border-orange-800"
                    : "bg-blue-50 border border-blue-200 dark:bg-blue-950/30 dark:border-blue-800"
                }`}
              >
                {canDirectPush ? (
                  <CheckCircle className="h-4 w-4 text-orange-500" />
                ) : (
                  <Clock className="h-4 w-4 text-blue-500" />
                )}
                <span className={`text-sm ${canDirectPush ? "text-orange-700 dark:text-orange-300" : "text-blue-700 dark:text-blue-300"}`}>
                  {canDirectPush
                    ? "You have permission to push notifications directly"
                    : "Notifications require admin approval before sending"}
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Notification Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., System Maintenance Notice"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                />
                <div className="flex justify-between">
                  <p className="text-xs text-muted-foreground">Keep it short and descriptive</p>
                  <p className="text-xs text-muted-foreground">{title.length}/100</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Message Body *</Label>
                <Textarea
                  id="body"
                  placeholder="Enter the full notification message..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="min-h-[200px] resize-none"
                  maxLength={500}
                />
                <div className="flex justify-between">
                  <p className="text-xs text-muted-foreground">Include all relevant details for users</p>
                  <p className="text-xs text-muted-foreground">{body.length}/500</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Target Audience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">All Users</p>
                        <p className="text-xs text-muted-foreground">Send to all active platform users</p>
                      </div>
                    </div>
                    <Badge variant="outline">Selected</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Delivery Channels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-orange-500" />
                      <span className="text-sm font-medium">Push Notification</span>
                    </div>
                    <Badge className="bg-emerald-500 text-white">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Email</span>
                    </div>
                    <Badge variant="outline">Disabled</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-border">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            {canDirectPush ? (
              <Button
                onClick={handlePushNotification}
                disabled={!title.trim() || !body.trim()}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                Push Now
              </Button>
            ) : (
              <Button
                onClick={handleSubmitForApproval}
                disabled={!title.trim() || !body.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Clock className="h-4 w-4 mr-2" />
                Submit for Approval
              </Button>
            )}
          </div>
        </div>

        {/* Right Side - Preview Panel */}
        <div className="w-full lg:w-[400px] bg-muted/20 p-6">
          <h3 className="font-semibold text-foreground mb-4">Preview</h3>

          {/* Phone Preview */}
          <div className="bg-foreground rounded-4xl p-2 shadow-xl">
            <div className="bg-background rounded-3xl overflow-hidden">
              {/* Phone Status Bar */}
              <div className="bg-muted/50 px-6 py-2 flex justify-between items-center text-xs">
                <span>9:41</span>
                <div className="flex gap-1">
                  <div className="w-4 h-2 bg-foreground/50 rounded-sm" />
                  <div className="w-4 h-2 bg-foreground/50 rounded-sm" />
                  <div className="w-6 h-3 bg-foreground/50 rounded-sm" />
                </div>
              </div>

              {/* Notification Preview */}
              <div className="p-4">
                <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center shrink-0">
                      <Bell className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-orange-500 uppercase tracking-wide">SpendEase</span>
                        <span className="text-xs text-muted-foreground">now</span>
                      </div>
                      <p className="font-semibold text-sm mt-1 truncate text-foreground">
                        {title || "Notification Title"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {body || "Your notification message will appear here..."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone Home Indicator */}
              <div className="flex justify-center pb-2">
                <div className="w-32 h-1 bg-foreground/20 rounded-full" />
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="mt-6 space-y-4">
            <Separator />
            <h4 className="font-medium text-sm text-foreground">Notification Details</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Hash className="h-4 w-4" />
                  <span>Type</span>
                </div>
                <Badge variant="outline">Broadcast</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Recipients</span>
                </div>
                <span className="text-foreground">All Users</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Created by</span>
                </div>
                <span className="text-foreground">{userName}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Status</span>
                </div>
                <Badge
                  className={
                    canDirectPush
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  }
                >
                  {canDirectPush ? "Ready to Push" : "Pending Approval"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Push Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Confirm Push Notification
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. Once pushed, the notification will be immediately sent to all users.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/50 rounded-lg p-4 my-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">Broadcast</Badge>
            </div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-sm text-muted-foreground mt-1">{body}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={confirmPush}
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isSubmitting ? "Sending..." : "Yes, Push Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit for Approval Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Submit for Approval
            </DialogTitle>
            <DialogDescription>
              Your notification will be reviewed by an admin or owner before being sent to users.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/50 rounded-lg p-4 my-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">Broadcast</Badge>
            </div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-sm text-muted-foreground mt-1">{body}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={confirmSubmit}
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isSubmitting ? "Submitting..." : "Submit for Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
