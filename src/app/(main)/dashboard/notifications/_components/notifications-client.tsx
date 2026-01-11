/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable prettier/prettier */
/* eslint-disable complexity */
"use client";

import { useCallback, useEffect, useMemo, useState, useRef, useTransition } from "react";

import { isAfter, isBefore, parseISO, startOfDay, endOfDay } from "date-fns";

import { fetchNotifications, type FetchNotificationsParams } from "@/app/actions/notifications";
import type { Notification, NotificationType } from "@/lib/types";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { NotificationDetailSheet } from "./notification-detail-sheet";

// Fallback dummy data for when API is unavailable
const FALLBACK_NOTIFICATIONS: Notification[] = [
  // Unique notifications
  { id: 1, user_id: 101, type: "unique", title: "Transaction Successful", body: "Your transaction of NGN 50,000 was successful.", status: "delivered", created_at: "2025-12-29T14:30:00.000Z" },
  { id: 2, user_id: 203, type: "unique", title: "Payment Received", body: "You received a payment of NGN 100,000 from John Doe.", status: "read", created_at: "2025-12-29T10:15:00.000Z" },
  // Broadcast notifications with pending approval for testing
  {
    id: 51,
    user_id: null,
    type: "broadcast",
    title: "New Feature Available",
    body: "We've added a new instant transfer feature to make your transactions faster.",
    status: "pending",
    approval_status: "pending_approval",
    created_by: 5,
    creator: { id: 5, first_name: "Sarah", last_name: "Johnson", email: "sarah@spendease.com", role_name: "customer_support" },
    created_at: "2026-01-08T10:30:00.000Z"
  },
];

interface NotificationsClientProps {
  type: NotificationType;
  userRole?: string;
}

export function NotificationsClient({ type, userRole }: NotificationsClientProps) {
  const [isPending, startTransition] = useTransition();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  // Sheet state
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const prevFiltersRef = useRef({ searchValue, statusFilter, dateFrom, dateTo, currentPage, pageSize });

  // Fetch notifications from API
  const loadNotifications = useCallback(async () => {
    setIsLoading(true);

    const params: FetchNotificationsParams = {
      page: currentPage,
      limit: pageSize,
      type: type === "broadcast" ? "general" : type,
      ...(statusFilter !== "all" && { status: statusFilter }),
      ...(searchValue && { search: searchValue }),
      ...(dateFrom && { dateFrom: dateFrom.toISOString().split("T")[0] }),
      ...(dateTo && { dateTo: dateTo.toISOString().split("T")[0] }),
    };

    startTransition(async () => {
      const result = await fetchNotifications(params);

      if ("success" in result) {
        // API error - use fallback data
        console.warn("Using fallback data:", result.message);
        setUseFallback(true);
      } else {
        // Success - use API data
        setNotifications(result.notifications);
        setTotalItems(result.paging.total_items);
        setUseFallback(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
    });
  }, [currentPage, pageSize, type, statusFilter, searchValue, dateFrom, dateTo]);

  // Filter fallback notifications client-side when API is unavailable
  const filteredFallbackNotifications = useMemo(() => {
    if (!useFallback) return [];

    return FALLBACK_NOTIFICATIONS.filter((notification) => {
      // Filter by type (handle both "broadcast" and "general" as the same)
      const notificationType = notification.type === "general" ? "broadcast" : notification.type;
      if (notificationType !== type) return false;

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
  }, [useFallback, type, searchValue, statusFilter, dateFrom, dateTo]);

  // Paginate fallback data
  const paginatedFallbackData = useMemo(() => {
    if (!useFallback) return [];
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredFallbackNotifications.slice(start, end);
  }, [useFallback, filteredFallbackNotifications, currentPage, pageSize]);

  // Final data to display
  const displayData = useFallback ? paginatedFallbackData : notifications;
  const displayTotalItems = useFallback ? filteredFallbackNotifications.length : totalItems;

  // Load data on mount and when filters change
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Reset to page 1 when filters change (but not when page changes)
  useEffect(() => {
    const filtersChanged =
      prevFiltersRef.current.searchValue !== searchValue ||
      prevFiltersRef.current.statusFilter !== statusFilter ||
      prevFiltersRef.current.dateFrom !== dateFrom ||
      prevFiltersRef.current.dateTo !== dateTo ||
      prevFiltersRef.current.pageSize !== pageSize;

    if (filtersChanged && currentPage !== 1) {
      prevFiltersRef.current = { searchValue, statusFilter, dateFrom, dateTo, currentPage, pageSize };
      setCurrentPage(1);
      return;
    }

    prevFiltersRef.current = { searchValue, statusFilter, dateFrom, dateTo, currentPage, pageSize };
  }, [searchValue, statusFilter, dateFrom, dateTo, pageSize, currentPage]);

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

  const handleSheetClose = useCallback((open: boolean) => {
    setIsSheetOpen(open);
    // Refresh data when sheet closes (in case of approval/rejection)
    if (!open) {
      loadNotifications();
    }
  }, [loadNotifications]);

  return (
    <>
      <DataTable
        columns={columns}
        data={displayData}
        totalItems={displayTotalItems}
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
        isLoading={isLoading || isPending}
        onReset={handleReset}
        onRowClick={handleRowClick}
      />
      <NotificationDetailSheet
        notification={selectedNotification}
        open={isSheetOpen}
        onOpenChange={handleSheetClose}
        userRole={userRole}
      />
    </>
  );
}
