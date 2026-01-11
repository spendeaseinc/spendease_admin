/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable max-lines */
/* eslint-disable prettier/prettier */
/* eslint-disable complexity */
"use server";

import { revalidatePath } from "next/cache";

import type { ApiError, Notification, PaginationData } from "@/lib/types";
import { adjustDateTo, buildQueryParams } from "@/lib/utils";
import { getValueFromCookie } from "@/server/server-actions";

const API_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT;

// ============================================
// Types
// ============================================

export interface NotificationStats {
  total: number;
  unique: number;
  general: number;
  sent: number;
  pending: number;
  read: number;
  pending_approval: number;
  approved: number;
  rejected: number;
}

interface NotificationsApiResponse {
  status: boolean;
  message: string;
  data: {
    rows: Notification[];
    count: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface NotificationStatsApiResponse {
  status: boolean;
  message: string;
  data: NotificationStats;
}

interface SingleNotificationApiResponse {
  status: boolean;
  message: string;
  data: Notification;
}

export interface FetchNotificationsParams {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  approval_status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CreateNotificationData {
  title: string;
  body: string;
}

export interface ApproveNotificationData {
  title?: string;
  body?: string;
}

export interface RejectNotificationData {
  reason?: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  paging: PaginationData;
}

// ============================================
// Helper Functions
// ============================================

async function getAuthToken(): Promise<string | ApiError> {
  const accessToken = await getValueFromCookie("accessToken");

  if (!accessToken) {
    return {
      success: false,
      message: "Authentication required",
      unauthorized: true,
    };
  }

  return accessToken;
}

async function handleNotificationsApiResponse(response: Response): Promise<NotificationsApiResponse | ApiError> {
  if (!response.ok) {
    if (response.status === 401) {
      return {
        success: false,
        message: "Unauthorized - Please log in again",
        unauthorized: true,
      };
    }

    try {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message ?? `Error: ${response.statusText}`,
      };
    } catch {
      return {
        success: false,
        message: `Error: ${response.statusText}`,
      };
    }
  }

  try {
    const data = await response.json();
    return data;
  } catch {
    return {
      success: false,
      message: "Failed to parse response",
    };
  }
}

// ============================================
// Fetch Notifications
// ============================================

export async function fetchNotifications(
  params: FetchNotificationsParams = {},
): Promise<NotificationsResponse | ApiError> {
  try {
    const token = await getAuthToken();
    if (typeof token !== "string") return token;

    const adjustedDateTo = adjustDateTo(params.dateTo);

    const queryString = buildQueryParams({
      page: params.page,
      limit: params.limit,
      type: params.type,
      status: params.status,
      approval_status: params.approval_status,
      search: params.search,
      dateFrom: params.dateFrom,
      dateTo: adjustedDateTo,
    });

    const url = `${API_BASE_URL}/api/admin/notifications?${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const result = await handleNotificationsApiResponse(response);

    if ("success" in result) {
      return result;
    }

    // Handle cases where data or rows might be null/undefined
    if (!result.data || !result.data.rows) {
      return {
        notifications: [],
        paging: {
          total_items: 0,
          page_size: params.limit ?? 10,
          current: params.page ?? 1,
          count: 0,
          next: 1,
        },
      };
    }

    return {
      notifications: result.data.rows,
      paging: {
        total_items: result.data.count ?? 0,
        page_size: result.data.limit ?? params.limit ?? 10,
        current: result.data.page ?? params.page ?? 1,
        count: result.data.rows.length,
        next: result.data.page < result.data.totalPages ? result.data.page + 1 : result.data.page,
      },
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch notifications",
    };
  }
}

// ============================================
// Fetch Notification Stats
// ============================================

export async function fetchNotificationStats(): Promise<NotificationStats | ApiError> {
  try {
    const token = await getAuthToken();
    if (typeof token !== "string") return token;

    const url = `${API_BASE_URL}/api/admin/notifications/stats`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: "Unauthorized - Please log in again",
          unauthorized: true,
        };
      }

      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message ?? `Error: ${response.statusText}`,
      };
    }

    const result: NotificationStatsApiResponse = await response.json();

    if (!result.status) {
      return {
        success: false,
        message: result.message || "Failed to fetch notification stats",
      };
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching notification stats:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch notification stats",
    };
  }
}

// ============================================
// Create Notification (Broadcast)
// ============================================

export async function createBroadcastNotification(
  data: CreateNotificationData,
): Promise<{ success: boolean; message: string; notification?: Notification; requiresApproval?: boolean } | ApiError> {
  try {
    const token = await getAuthToken();
    if (typeof token !== "string") return token;

    const url = `${API_BASE_URL}/api/admin/notifications`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: "Unauthorized - Please log in again",
          unauthorized: true,
        };
      }

      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message ?? "Failed to create notification",
      };
    }

    const result: SingleNotificationApiResponse = await response.json();

    // Revalidate notifications page
    revalidatePath("/dashboard/notifications");

    // If result.data exists, it means notification was created for approval
    // If result.data is null/undefined, it was sent directly (admin/owner)
    if (result.data) {
      return {
        success: true,
        message: result.message || "Notification submitted for approval",
        notification: result.data,
        requiresApproval: true,
      };
    }

    return {
      success: true,
      message: result.message || "Notification sent to all users",
      requiresApproval: false,
    };
  } catch (error) {
    console.error("Error creating notification:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create notification",
    };
  }
}

// ============================================
// Approve Notification
// ============================================

export async function approveNotification(
  id: number,
  data?: ApproveNotificationData,
): Promise<{ success: boolean; message: string; notification?: Notification } | ApiError> {
  try {
    const token = await getAuthToken();
    if (typeof token !== "string") return token;

    const url = `${API_BASE_URL}/api/admin/notifications/${id}/approve`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data ?? {}),
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: "Unauthorized - Please log in again",
          unauthorized: true,
        };
      }

      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message ?? "Failed to approve notification",
      };
    }

    const result: SingleNotificationApiResponse = await response.json();

    // Revalidate notifications page
    revalidatePath("/dashboard/notifications");

    return {
      success: true,
      message: result.message || "Notification approved and sent",
      notification: result.data,
    };
  } catch (error) {
    console.error("Error approving notification:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to approve notification",
    };
  }
}

// ============================================
// Reject Notification
// ============================================

export async function rejectNotification(
  id: number,
  data?: RejectNotificationData,
): Promise<{ success: boolean; message: string; notification?: Notification } | ApiError> {
  try {
    const token = await getAuthToken();
    if (typeof token !== "string") return token;

    const url = `${API_BASE_URL}/api/admin/notifications/${id}/reject`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data ?? {}),
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: "Unauthorized - Please log in again",
          unauthorized: true,
        };
      }

      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message ?? "Failed to reject notification",
      };
    }

    const result: SingleNotificationApiResponse = await response.json();

    // Revalidate notifications page
    revalidatePath("/dashboard/notifications");

    return {
      success: true,
      message: result.message || "Notification rejected",
      notification: result.data,
    };
  } catch (error) {
    console.error("Error rejecting notification:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to reject notification",
    };
  }
}

// ============================================
// Update Notification (for pending notifications)
// ============================================

export async function updateNotification(
  id: number,
  data: { title?: string; body?: string },
): Promise<{ success: boolean; message: string; notification?: Notification } | ApiError> {
  try {
    const token = await getAuthToken();
    if (typeof token !== "string") return token;

    const url = `${API_BASE_URL}/api/admin/notifications/${id}`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: "Unauthorized - Please log in again",
          unauthorized: true,
        };
      }

      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message ?? "Failed to update notification",
      };
    }

    const result: SingleNotificationApiResponse = await response.json();

    // Revalidate notifications page
    revalidatePath("/dashboard/notifications");

    return {
      success: true,
      message: result.message || "Notification updated",
      notification: result.data,
    };
  } catch (error) {
    console.error("Error updating notification:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update notification",
    };
  }
}

// ============================================
// Delete Notification
// ============================================

export async function deleteNotification(
  id: number,
): Promise<{ success: boolean; message: string } | ApiError> {
  try {
    const token = await getAuthToken();
    if (typeof token !== "string") return token;

    const url = `${API_BASE_URL}/api/admin/notifications/${id}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: "Unauthorized - Please log in again",
          unauthorized: true,
        };
      }

      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message ?? "Failed to delete notification",
      };
    }

    // Revalidate notifications page
    revalidatePath("/dashboard/notifications");

    return {
      success: true,
      message: "Notification deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting notification:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete notification",
    };
  }
}

// ============================================
// Export Notifications
// ============================================

export async function exportNotifications(
  params: FetchNotificationsParams = {},
): Promise<Blob | ApiError> {
  try {
    const token = await getAuthToken();
    if (typeof token !== "string") return token;

    const adjustedDateTo = adjustDateTo(params.dateTo);

    const queryParams = new URLSearchParams();
    queryParams.append("format", "excel");

    const fieldsToExport = [
      "id",
      "user_id",
      "type",
      "title",
      "body",
      "status",
      "approval_status",
      "created_by",
      "approved_by",
      "rejection_reason",
      "created_at",
    ];
    fieldsToExport.forEach((field) => queryParams.append("fieldsToExport[]", field));

    if (params.type) queryParams.append("type", params.type);
    if (params.status) queryParams.append("status", params.status);
    if (params.approval_status) queryParams.append("approval_status", params.approval_status);
    if (params.search) queryParams.append("search", params.search);
    if (params.dateFrom) queryParams.append("dateFrom", params.dateFrom);
    if (adjustedDateTo) queryParams.append("dateTo", adjustedDateTo);

    const url = `${API_BASE_URL}/api/admin/notifications?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Failed to export notifications",
      };
    }

    return await response.blob();
  } catch (error) {
    console.error("Error exporting notifications:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to export notifications",
    };
  }
}
