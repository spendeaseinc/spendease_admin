"use server";

import type { ApiError, WaitlistApiResponse } from "@/lib/types";
import { buildQueryParams, handleApiResponse } from "@/lib/utils";
import { getValueFromCookie } from "@/server/server-actions";

const API_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT;

interface FetchWaitlistParams {
  page: number;
  limit: number;
  email?: string;
  status?: string;
}

export async function fetchWaitlist(params: FetchWaitlistParams): Promise<WaitlistApiResponse | ApiError> {
  try {
    const accessToken = await getValueFromCookie("accessToken");

    if (!accessToken) {
      return { success: false, message: "Unauthorized", unauthorized: true };
    }

    const queryString = buildQueryParams({
      page: params.page,
      limit: params.limit,
      email: params.email,
      status: params.status,
    });

    const url = `${API_BASE_URL}/api/admin/waitlist?${queryString}`;

    const response = await fetch(`${API_BASE_URL}/api/admin/waitlist`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching waitlist:", error);
    return { success: false, message: "An error occurred while fetching the waitlist." };
  }
}

export async function fetchWaitlistStats(): Promise<
  | {
      total: number;
      pending: number;
      approved: number;
    }
  | ApiError
> {
  try {
    const accessToken = await getValueFromCookie("accessToken");

    if (!accessToken) {
      return { success: false, message: "Unauthorized", unauthorized: true };
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/waitlist`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const result = await handleApiResponse(response);

    if ("success" in result) {
      return result;
    }

    return {
      total: result.data.paging.total_items,
      pending: result.data.paging.total_items,
      approved: 0,
    };
  } catch (error) {
    console.error("Error fetching waitlist stats:", error);
    return { success: false, message: "An error occurred while fetching waitlist stats." };
  }
}
