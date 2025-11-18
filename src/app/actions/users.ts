"use server";

import type { ApiError, ApiResponse, Customer } from "@/lib/types";
import { buildQueryParams, handleApiResponse } from "@/lib/utils";
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

    const queryString = buildQueryParams({
      page: params.page,
      limit: params.limit,
      search: params.search,
      name: params.name,
      email: params.email,
      phone: params.phone,
      status: params.status,
    });

    const url = `${API_BASE_URL}/api/admin/users?${queryString}`;

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

export async function fetchCustomerById(id: string): Promise<Customer | ApiError> {
  try {
    const accessToken = await getValueFromCookie("accessToken");

    if (!accessToken) {
      return {
        success: false,
        message: "Authentication required",
        unauthorized: true,
      };
    }

    const url = `${API_BASE_URL}/api/admin/users/${id}`;

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

    return result.data as any;
  } catch (error) {
    console.error("Error fetching customer:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch customer",
    };
  }
}
