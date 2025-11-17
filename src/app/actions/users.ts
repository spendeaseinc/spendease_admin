"use server";

import type { ApiError, ApiResponse } from "@/lib/types";
import { handleApiResponse } from "@/lib/utils";
import { getValueFromCookie } from "@/server/server-actions";

const API_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT;

interface FetchUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
}

function buildQueryParams(params: FetchUsersParams): URLSearchParams {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.search) queryParams.append("search", params.search);
  if (params.name) queryParams.append("name", params.name);
  if (params.email) queryParams.append("email", params.email);
  if (params.phone) queryParams.append("phone", params.phone);
  if (params.status && params.status !== "all") queryParams.append("status", params.status);

  return queryParams;
}

export async function fetchUsers(params: FetchUsersParams = {}): Promise<ApiResponse | ApiError> {
  try {
    const accessToken = await getValueFromCookie("accessToken");

    if (!accessToken) {
      return {
        success: false,
        message: "Authentication required",
        unauthorized: true,
      };
    }

    const queryParams = buildQueryParams(params);
    const url = `${API_BASE_URL}/api/admin/users?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch users",
    };
  }
}

export async function fetchUserStats(): Promise<
  | {
      total: number;
      active: number;
      verified: number;
    }
  | ApiError
> {
  try {
    const accessToken = await getValueFromCookie("accessToken");

    if (!accessToken) {
      return {
        success: false,
        message: "Authentication required",
        unauthorized: true,
      };
    }

    // Fetch all users without pagination to calculate stats
    const url = `${API_BASE_URL}/api/admin/users`;

    const response = await fetch(url, {
      method: "GET",
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

    const activeResponse = await fetch(`${url}?status=active`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const activeResult = await handleApiResponse(activeResponse);

    if ("success" in activeResult) {
      return activeResult;
    }

    const verifiedResponse = await fetch(`${url}?status=verified`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const verifiedResult = await handleApiResponse(verifiedResponse);

    if ("success" in verifiedResult) {
      return verifiedResult;
    }

    // Calculate stats from the response
    const users = result.data.data;
    const total = result.data.paging.total_items || users.length;
    const active = activeResult.data.paging.total_items;
    const verified = verifiedResult.data.paging.total_items;

    return {
      total,
      active,
      verified,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch user stats",
    };
  }
}
