"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT ?? "https://spendeasebackend-production.up.railway.app";

interface SendNotificationData {
  title: string;
  message: string;
  recipients?: string[];
  type?: "info" | "warning" | "success" | "error";
}

interface ApiResponse {
  status: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

async function getAuthToken() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  return accessToken;
}

export async function sendNotification(notificationData: SendNotificationData) {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/api/v1/admin/notifications/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notificationData),
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: "Unauthorized",
          unauthorized: true,
        };
      }
      throw new Error("Failed to send notification");
    }

    const data: ApiResponse = await response.json();

    if (data.status) {
      // Revalidate notifications page
      revalidatePath("/notifications");

      return {
        success: true,
        message: data.message || "Notification sent successfully",
      };
    }

    return {
      success: false,
      message: data.message || "Failed to send notification",
    };
  } catch (error) {
    console.error("Send notification error:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return {
        success: false,
        message: "Unauthorized",
        unauthorized: true,
      };
    }

    return {
      success: false,
      message: "An error occurred while sending notification",
    };
  }
}
