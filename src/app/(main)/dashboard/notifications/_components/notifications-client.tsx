/* eslint-disable prettier/prettier */
/* eslint-disable complexity */
"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";

import { isAfter, isBefore, parseISO, startOfDay, endOfDay } from "date-fns";
import { toast } from "sonner";

import type { Notification, NotificationType } from "@/lib/types";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { NotificationDetailSheet } from "./notification-detail-sheet";

// Static dummy data for notifications - deterministic to avoid hydration mismatch
const ALL_NOTIFICATIONS: Notification[] = [
  // Unique notifications (transaction-based) - IDs 1-50
  { id: 1, user_id: 101, type: "unique", title: "Transaction Successful", body: "Your transaction of NGN 50,000 was successful.", status: "delivered", created_at: "2025-12-29T14:30:00.000Z" },
  { id: 2, user_id: 203, type: "unique", title: "Payment Received", body: "You received a payment of NGN 100,000 from John Doe.", status: "read", created_at: "2025-12-29T10:15:00.000Z" },
  { id: 3, user_id: 156, type: "unique", title: "Withdrawal Completed", body: "Your withdrawal of NGN 25,000 has been processed.", status: "delivered", created_at: "2025-12-28T16:45:00.000Z" },
  { id: 4, user_id: 89, type: "unique", title: "Transaction Failed", body: "Your transaction could not be completed. Please try again.", status: "failed", created_at: "2025-12-28T09:20:00.000Z" },
  { id: 5, user_id: 342, type: "unique", title: "Deposit Confirmed", body: "Your deposit of NGN 75,000 has been confirmed.", status: "read", created_at: "2025-12-27T18:00:00.000Z" },
  { id: 6, user_id: 67, type: "unique", title: "Transfer Initiated", body: "Transfer of NGN 30,000 to savings account completed.", status: "sent", created_at: "2025-12-27T11:30:00.000Z" },
  { id: 7, user_id: 445, type: "unique", title: "Account Debited", body: "Your account was debited NGN 15,000 for bill payment.", status: "delivered", created_at: "2025-12-26T20:45:00.000Z" },
  { id: 8, user_id: 128, type: "unique", title: "Account Credited", body: "Your account was credited NGN 200,000.", status: "read", created_at: "2025-12-26T08:15:00.000Z" },
  { id: 9, user_id: 299, type: "unique", title: "Funds Transferred", body: "Funds transfer of NGN 45,000 to Jane Smith was successful.", status: "delivered", created_at: "2025-12-25T15:00:00.000Z" },
  { id: 10, user_id: 512, type: "unique", title: "Payment Processed", body: "Payment of NGN 10,000 for airtime purchase processed.", status: "sent", created_at: "2025-12-25T12:30:00.000Z" },
  { id: 11, user_id: 77, type: "unique", title: "Transaction Successful", body: "Your transaction of NGN 85,000 was successful.", status: "read", created_at: "2025-12-24T19:20:00.000Z" },
  { id: 12, user_id: 634, type: "unique", title: "Payment Received", body: "You received a payment of NGN 150,000 from Mary Johnson.", status: "delivered", created_at: "2025-12-24T14:10:00.000Z" },
  { id: 13, user_id: 198, type: "unique", title: "Withdrawal Completed", body: "Your withdrawal of NGN 40,000 has been processed.", status: "pending", created_at: "2025-12-23T17:45:00.000Z" },
  { id: 14, user_id: 421, type: "unique", title: "Transaction Failed", body: "Insufficient funds. Transaction declined.", status: "failed", created_at: "2025-12-23T10:00:00.000Z" },
  { id: 15, user_id: 55, type: "unique", title: "Deposit Confirmed", body: "Your deposit of NGN 120,000 has been confirmed.", status: "read", created_at: "2025-12-22T21:30:00.000Z" },
  { id: 16, user_id: 876, type: "unique", title: "Transfer Initiated", body: "Transfer of NGN 65,000 to investment account completed.", status: "delivered", created_at: "2025-12-22T13:15:00.000Z" },
  { id: 17, user_id: 234, type: "unique", title: "Account Debited", body: "Your account was debited NGN 8,500 for subscription.", status: "sent", created_at: "2025-12-21T16:00:00.000Z" },
  { id: 18, user_id: 567, type: "unique", title: "Account Credited", body: "Your account was credited NGN 55,000.", status: "delivered", created_at: "2025-12-21T09:45:00.000Z" },
  { id: 19, user_id: 143, type: "unique", title: "Funds Transferred", body: "Funds transfer of NGN 22,000 to Peter Obi was successful.", status: "read", created_at: "2025-12-20T22:00:00.000Z" },
  { id: 20, user_id: 789, type: "unique", title: "Payment Processed", body: "Payment of NGN 5,000 for data bundle processed.", status: "delivered", created_at: "2025-12-20T11:30:00.000Z" },
  { id: 21, user_id: 312, type: "unique", title: "Transaction Successful", body: "Your transaction of NGN 35,000 was successful.", status: "sent", created_at: "2025-12-19T18:20:00.000Z" },
  { id: 22, user_id: 456, type: "unique", title: "Payment Received", body: "You received a payment of NGN 80,000 from Tech Corp.", status: "read", created_at: "2025-12-19T07:45:00.000Z" },
  { id: 23, user_id: 98, type: "unique", title: "Withdrawal Completed", body: "Your withdrawal of NGN 60,000 has been processed.", status: "delivered", created_at: "2025-12-18T14:30:00.000Z" },
  { id: 24, user_id: 654, type: "unique", title: "Transaction Failed", body: "Network error. Please try again later.", status: "failed", created_at: "2025-12-18T10:15:00.000Z" },
  { id: 25, user_id: 221, type: "unique", title: "Deposit Confirmed", body: "Your deposit of NGN 95,000 has been confirmed.", status: "pending", created_at: "2025-12-17T20:00:00.000Z" },
  { id: 26, user_id: 388, type: "unique", title: "Transfer Initiated", body: "Transfer of NGN 18,000 to utility account completed.", status: "delivered", created_at: "2025-12-17T15:30:00.000Z" },
  { id: 27, user_id: 502, type: "unique", title: "Account Debited", body: "Your account was debited NGN 12,000 for insurance.", status: "read", created_at: "2025-12-16T12:45:00.000Z" },
  { id: 28, user_id: 167, type: "unique", title: "Account Credited", body: "Your account was credited NGN 180,000.", status: "sent", created_at: "2025-12-16T08:00:00.000Z" },
  { id: 29, user_id: 733, type: "unique", title: "Funds Transferred", body: "Funds transfer of NGN 70,000 to Sarah Adams was successful.", status: "delivered", created_at: "2025-12-15T19:15:00.000Z" },
  { id: 30, user_id: 45, type: "unique", title: "Payment Processed", body: "Payment of NGN 3,500 for electricity bill processed.", status: "read", created_at: "2025-12-15T11:00:00.000Z" },
  { id: 31, user_id: 891, type: "unique", title: "Transaction Successful", body: "Your transaction of NGN 28,000 was successful.", status: "delivered", created_at: "2025-12-14T16:30:00.000Z" },
  { id: 32, user_id: 276, type: "unique", title: "Payment Received", body: "You received a payment of NGN 45,000 from Lagos Store.", status: "pending", created_at: "2025-12-14T09:20:00.000Z" },
  { id: 33, user_id: 534, type: "unique", title: "Withdrawal Completed", body: "Your withdrawal of NGN 90,000 has been processed.", status: "sent", created_at: "2025-12-13T21:45:00.000Z" },
  { id: 34, user_id: 112, type: "unique", title: "Transaction Failed", body: "Invalid account details. Transaction cancelled.", status: "failed", created_at: "2025-12-13T14:00:00.000Z" },
  { id: 35, user_id: 667, type: "unique", title: "Deposit Confirmed", body: "Your deposit of NGN 200,000 has been confirmed.", status: "delivered", created_at: "2025-12-12T17:30:00.000Z" },
  { id: 36, user_id: 389, type: "unique", title: "Transfer Initiated", body: "Transfer of NGN 55,000 to business account completed.", status: "read", created_at: "2025-12-12T10:15:00.000Z" },
  { id: 37, user_id: 823, type: "unique", title: "Account Debited", body: "Your account was debited NGN 25,000 for loan repayment.", status: "delivered", created_at: "2025-12-11T20:00:00.000Z" },
  { id: 38, user_id: 194, type: "unique", title: "Account Credited", body: "Your account was credited NGN 320,000.", status: "sent", created_at: "2025-12-11T13:45:00.000Z" },
  { id: 39, user_id: 456, type: "unique", title: "Funds Transferred", body: "Funds transfer of NGN 15,000 to Mike Brown was successful.", status: "read", created_at: "2025-12-10T18:30:00.000Z" },
  { id: 40, user_id: 621, type: "unique", title: "Payment Processed", body: "Payment of NGN 7,200 for cable TV processed.", status: "delivered", created_at: "2025-12-10T07:00:00.000Z" },
  { id: 41, user_id: 78, type: "unique", title: "Transaction Successful", body: "Your transaction of NGN 42,000 was successful.", status: "pending", created_at: "2025-12-09T15:20:00.000Z" },
  { id: 42, user_id: 945, type: "unique", title: "Payment Received", body: "You received a payment of NGN 65,000 from Freelance Client.", status: "delivered", created_at: "2025-12-09T11:45:00.000Z" },
  { id: 43, user_id: 267, type: "unique", title: "Withdrawal Completed", body: "Your withdrawal of NGN 35,000 has been processed.", status: "read", created_at: "2025-12-08T19:00:00.000Z" },
  { id: 44, user_id: 534, type: "unique", title: "Transaction Failed", body: "Daily limit exceeded. Try again tomorrow.", status: "failed", created_at: "2025-12-08T12:30:00.000Z" },
  { id: 45, user_id: 178, type: "unique", title: "Deposit Confirmed", body: "Your deposit of NGN 150,000 has been confirmed.", status: "sent", created_at: "2025-12-07T16:15:00.000Z" },
  { id: 46, user_id: 712, type: "unique", title: "Transfer Initiated", body: "Transfer of NGN 48,000 to joint account completed.", status: "delivered", created_at: "2025-12-07T08:45:00.000Z" },
  { id: 47, user_id: 345, type: "unique", title: "Account Debited", body: "Your account was debited NGN 6,000 for gym membership.", status: "read", created_at: "2025-12-06T21:30:00.000Z" },
  { id: 48, user_id: 589, type: "unique", title: "Account Credited", body: "Your account was credited NGN 88,000.", status: "delivered", created_at: "2025-12-06T14:00:00.000Z" },
  { id: 49, user_id: 123, type: "unique", title: "Funds Transferred", body: "Funds transfer of NGN 33,000 to Emma Wilson was successful.", status: "sent", created_at: "2025-12-05T17:45:00.000Z" },
  { id: 50, user_id: 867, type: "unique", title: "Payment Processed", body: "Payment of NGN 2,000 for parking fee processed.", status: "read", created_at: "2025-12-05T09:15:00.000Z" },

  // Broadcast notifications (admin-created) - IDs 51-100
  { id: 51, user_id: null, type: "broadcast", title: "System Maintenance Notice", body: "Our system will undergo maintenance on Saturday from 2 AM to 6 AM.", status: "delivered", created_at: "2025-12-29T08:00:00.000Z" },
  { id: 52, user_id: null, type: "broadcast", title: "New Feature Available", body: "We've added a new instant transfer feature. Try it now!", status: "sent", created_at: "2025-12-28T12:00:00.000Z" },
  { id: 53, user_id: null, type: "broadcast", title: "Security Update Required", body: "Please update your security settings for enhanced protection.", status: "delivered", created_at: "2025-12-27T10:30:00.000Z" },
  { id: 54, user_id: null, type: "broadcast", title: "Holiday Operating Hours", body: "Our support hours will be limited during the upcoming holiday.", status: "read", created_at: "2025-12-26T15:00:00.000Z" },
  { id: 55, user_id: null, type: "broadcast", title: "Service Improvement", body: "We've improved our transaction processing speed by 50%.", status: "delivered", created_at: "2025-12-25T09:00:00.000Z" },
  { id: 56, user_id: null, type: "broadcast", title: "Important Announcement", body: "Important changes to our terms of service effective next month.", status: "pending", created_at: "2025-12-24T11:30:00.000Z" },
  { id: 57, user_id: null, type: "broadcast", title: "Policy Update", body: "Our privacy policy has been updated. Please review the changes.", status: "sent", created_at: "2025-12-23T14:45:00.000Z" },
  { id: 58, user_id: null, type: "broadcast", title: "Promotional Offer", body: "Enjoy 0% transfer fees this weekend only!", status: "delivered", created_at: "2025-12-22T08:00:00.000Z" },
  { id: 59, user_id: null, type: "broadcast", title: "Account Verification Reminder", body: "Please verify your account details to continue enjoying our services.", status: "read", created_at: "2025-12-21T16:30:00.000Z" },
  { id: 60, user_id: null, type: "broadcast", title: "Scheduled Downtime Alert", body: "The app will be unavailable for 30 minutes tonight for upgrades.", status: "delivered", created_at: "2025-12-20T18:00:00.000Z" },
  { id: 61, user_id: null, type: "broadcast", title: "System Maintenance Notice", body: "Brief maintenance window scheduled for tomorrow at 3 AM.", status: "sent", created_at: "2025-12-19T20:15:00.000Z" },
  { id: 62, user_id: null, type: "broadcast", title: "New Feature Available", body: "Introducing budget tracking! Set and monitor your spending limits.", status: "delivered", created_at: "2025-12-18T10:00:00.000Z" },
  { id: 63, user_id: null, type: "broadcast", title: "Security Update Required", body: "New two-factor authentication options now available.", status: "read", created_at: "2025-12-17T13:30:00.000Z" },
  { id: 64, user_id: null, type: "broadcast", title: "Holiday Operating Hours", body: "Customer support will be available 24/7 during the festive season.", status: "pending", created_at: "2025-12-16T09:45:00.000Z" },
  { id: 65, user_id: null, type: "broadcast", title: "Service Improvement", body: "App loading time reduced by 40% in latest update.", status: "delivered", created_at: "2025-12-15T17:00:00.000Z" },
  { id: 66, user_id: null, type: "broadcast", title: "Important Announcement", body: "We're expanding our services to 5 new countries!", status: "sent", created_at: "2025-12-14T11:15:00.000Z" },
  { id: 67, user_id: null, type: "broadcast", title: "Policy Update", body: "Transaction limits have been increased for verified users.", status: "delivered", created_at: "2025-12-13T14:30:00.000Z" },
  { id: 68, user_id: null, type: "broadcast", title: "Promotional Offer", body: "Refer a friend and earn NGN 5,000 bonus!", status: "read", created_at: "2025-12-12T08:45:00.000Z" },
  { id: 69, user_id: null, type: "broadcast", title: "Account Verification Reminder", body: "Complete your KYC to unlock premium features.", status: "delivered", created_at: "2025-12-11T19:00:00.000Z" },
  { id: 70, user_id: null, type: "broadcast", title: "Scheduled Downtime Alert", body: "Server migration in progress. Some features may be slow.", status: "failed", created_at: "2025-12-10T22:30:00.000Z" },
  { id: 71, user_id: null, type: "broadcast", title: "System Maintenance Notice", body: "Database optimization completed. Enjoy faster queries!", status: "delivered", created_at: "2025-12-09T06:00:00.000Z" },
  { id: 72, user_id: null, type: "broadcast", title: "New Feature Available", body: "Dark mode is now available! Check your settings.", status: "sent", created_at: "2025-12-08T15:45:00.000Z" },
  { id: 73, user_id: null, type: "broadcast", title: "Security Update Required", body: "Please review your connected devices in security settings.", status: "delivered", created_at: "2025-12-07T11:30:00.000Z" },
  { id: 74, user_id: null, type: "broadcast", title: "Holiday Operating Hours", body: "Extended support hours available during Black Friday.", status: "read", created_at: "2025-12-06T09:00:00.000Z" },
  { id: 75, user_id: null, type: "broadcast", title: "Service Improvement", body: "Push notification delivery improved for better alerts.", status: "pending", created_at: "2025-12-05T13:15:00.000Z" },
  { id: 76, user_id: null, type: "broadcast", title: "Important Announcement", body: "New customer loyalty program launching next week!", status: "delivered", created_at: "2025-12-04T16:00:00.000Z" },
  { id: 77, user_id: null, type: "broadcast", title: "Policy Update", body: "Updated fee structure effective January 1st.", status: "sent", created_at: "2025-12-03T10:30:00.000Z" },
  { id: 78, user_id: null, type: "broadcast", title: "Promotional Offer", body: "Get 2% cashback on all transactions this month!", status: "delivered", created_at: "2025-12-02T14:45:00.000Z" },
  { id: 79, user_id: null, type: "broadcast", title: "Account Verification Reminder", body: "Update your phone number to ensure account security.", status: "read", created_at: "2025-12-01T08:15:00.000Z" },
  { id: 80, user_id: null, type: "broadcast", title: "Scheduled Downtime Alert", body: "Planned maintenance: Card services unavailable 2-4 AM.", status: "delivered", created_at: "2025-11-30T20:00:00.000Z" },
  { id: 81, user_id: null, type: "broadcast", title: "System Maintenance Notice", body: "Security patches applied. All systems operational.", status: "sent", created_at: "2025-11-29T12:30:00.000Z" },
  { id: 82, user_id: null, type: "broadcast", title: "New Feature Available", body: "QR code payments now supported at partner merchants!", status: "delivered", created_at: "2025-11-28T17:00:00.000Z" },
  { id: 83, user_id: null, type: "broadcast", title: "Security Update Required", body: "Enable biometric login for faster, secure access.", status: "read", created_at: "2025-11-27T09:45:00.000Z" },
  { id: 84, user_id: null, type: "broadcast", title: "Holiday Operating Hours", body: "Thanksgiving hours: Support available 9 AM - 5 PM.", status: "pending", created_at: "2025-11-26T11:00:00.000Z" },
  { id: 85, user_id: null, type: "broadcast", title: "Service Improvement", body: "International transfer fees reduced by 25%!", status: "delivered", created_at: "2025-11-25T15:30:00.000Z" },
  { id: 86, user_id: null, type: "broadcast", title: "Important Announcement", body: "Partnership announced with major e-commerce platform.", status: "sent", created_at: "2025-11-24T08:00:00.000Z" },
  { id: 87, user_id: null, type: "broadcast", title: "Policy Update", body: "New withdrawal limits for business accounts.", status: "delivered", created_at: "2025-11-23T13:15:00.000Z" },
  { id: 88, user_id: null, type: "broadcast", title: "Promotional Offer", body: "First 3 transactions free for new users!", status: "read", created_at: "2025-11-22T16:45:00.000Z" },
  { id: 89, user_id: null, type: "broadcast", title: "Account Verification Reminder", body: "Add a backup email for account recovery.", status: "failed", created_at: "2025-11-21T10:30:00.000Z" },
  { id: 90, user_id: null, type: "broadcast", title: "Scheduled Downtime Alert", body: "App update required. Please update from your app store.", status: "delivered", created_at: "2025-11-20T19:00:00.000Z" },
  { id: 91, user_id: null, type: "broadcast", title: "System Maintenance Notice", body: "Backend infrastructure upgraded for better performance.", status: "sent", created_at: "2025-11-19T07:30:00.000Z" },
  { id: 92, user_id: null, type: "broadcast", title: "New Feature Available", body: "Savings goals feature now live! Start saving today.", status: "delivered", created_at: "2025-11-18T14:00:00.000Z" },
  { id: 93, user_id: null, type: "broadcast", title: "Security Update Required", body: "Monthly security review: Check your transaction history.", status: "read", created_at: "2025-11-17T11:45:00.000Z" },
  { id: 94, user_id: null, type: "broadcast", title: "Holiday Operating Hours", body: "Weekend support: Available Saturday 10 AM - 4 PM.", status: "pending", created_at: "2025-11-16T09:15:00.000Z" },
  { id: 95, user_id: null, type: "broadcast", title: "Service Improvement", body: "Customer feedback implemented: Better receipt designs.", status: "delivered", created_at: "2025-11-15T17:30:00.000Z" },
  { id: 96, user_id: null, type: "broadcast", title: "Important Announcement", body: "Mobile app wins Best Fintech App award!", status: "sent", created_at: "2025-11-14T12:00:00.000Z" },
  { id: 97, user_id: null, type: "broadcast", title: "Policy Update", body: "Dispute resolution process simplified.", status: "delivered", created_at: "2025-11-13T15:45:00.000Z" },
  { id: 98, user_id: null, type: "broadcast", title: "Promotional Offer", body: "Double points on all purchases this weekend!", status: "read", created_at: "2025-11-12T08:30:00.000Z" },
  { id: 99, user_id: null, type: "broadcast", title: "Account Verification Reminder", body: "Annual account review due. Please update your info.", status: "delivered", created_at: "2025-11-11T18:15:00.000Z" },
  { id: 100, user_id: null, type: "broadcast", title: "Scheduled Downtime Alert", body: "Certificate renewal: Brief SSL interruption at midnight.", status: "sent", created_at: "2025-11-10T21:00:00.000Z" },
];

interface NotificationsClientProps {
  type: NotificationType;
}

export function NotificationsClient({ type }: NotificationsClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // Sheet state
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const prevFiltersRef = useRef({ searchValue, statusFilter, dateFrom, dateTo });

  // Filter notifications based on type and other filters
  const filteredNotifications = useMemo(() => {
    return ALL_NOTIFICATIONS.filter((notification) => {
      // Filter by type
      if (notification.type !== type) return false;

      // Filter by search (title or body)
      if (searchValue) {
        const search = searchValue.toLowerCase();
        if (
          !notification.title.toLowerCase().includes(search) &&
          !notification.body.toLowerCase().includes(search)
        ) {
          return false;
        }
      }

      // Filter by status
      if (statusFilter !== "all" && notification.status !== statusFilter) {
        return false;
      }

      // Filter by date range
      if (dateFrom) {
        const notificationDate = parseISO(notification.created_at);
        if (isBefore(notificationDate, startOfDay(dateFrom))) {
          return false;
        }
      }

      if (dateTo) {
        const notificationDate = parseISO(notification.created_at);
        if (isAfter(notificationDate, endOfDay(dateTo))) {
          return false;
        }
      }

      return true;
    });
  }, [type, searchValue, statusFilter, dateFrom, dateTo]);

  // Paginate the filtered results
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredNotifications.slice(start, end);
  }, [filteredNotifications, currentPage, pageSize]);

  const totalItems = filteredNotifications.length;

  const handleReset = useCallback(() => {
    setSearchValue("");
    setStatusFilter("all");
    setDateFrom(undefined);
    setDateTo(undefined);
    setCurrentPage(1);
  }, []);

  const handleRowClick = useCallback((notification: Notification) => {
    setSelectedNotification(notification);
    setIsSheetOpen(true);
  }, []);

  const handleEditNotification = useCallback((notification: Notification) => {
    // For now, just show a toast - this will be replaced with actual edit functionality later
    toast.info(`Edit notification: ${notification.title}`);
    setIsSheetOpen(false);
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    const filtersChanged =
      prevFiltersRef.current.searchValue !== searchValue ||
      prevFiltersRef.current.statusFilter !== statusFilter ||
      prevFiltersRef.current.dateFrom !== dateFrom ||
      prevFiltersRef.current.dateTo !== dateTo;

    if (filtersChanged && currentPage !== 1) {
      prevFiltersRef.current = { searchValue, statusFilter, dateFrom, dateTo };
      setTimeout(() => {
        setCurrentPage(1);
      }, 0);
      return;
    }

    prevFiltersRef.current = { searchValue, statusFilter, dateFrom, dateTo };

    // Simulate loading state for better UX
    if (filtersChanged) {
      setTimeout(() => {
        setIsLoading(true);
      }, 0);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchValue, statusFilter, dateFrom, dateTo, currentPage]);

  return (
    <>
      <DataTable
        columns={columns}
        data={paginatedData}
        totalItems={totalItems}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        isLoading={isLoading}
        onReset={handleReset}
        onRowClick={handleRowClick}
      />
      <NotificationDetailSheet
        notification={selectedNotification}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onEdit={type === "broadcast" ? handleEditNotification : undefined}
      />
    </>
  );
}
