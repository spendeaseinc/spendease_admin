"use server";

import type { DashboardStatsResponse, ApiError } from "@/lib/types";
import { getValueFromCookie } from "@/server/server-actions";

const API_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT;

export async function fetchDashboardStats(): Promise<DashboardStatsResponse | ApiError> {
  try {
    const accessToken = await getValueFromCookie("accessToken");

    if (!accessToken) {
      return {
        success: false,
        message: "No access token found",
        unauthorized: true,
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, message: "Unauthorized", unauthorized: true };
      }
      return { success: false, message: `Failed to fetch dashboard stats: ${response.statusText}` };
    }

    const data: DashboardStatsResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, message: "An error occurred while fetching dashboard stats" };
  }
}
