"use server";

import type { ApiError, ApiResponse, Customer } from "@/lib/types";
import { adjustDateTo, buildQueryParams, handleApiResponse } from "@/lib/utils";
import { getValueFromCookie } from "@/server/server-actions";

const API_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT;

interface FetchUsersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  name?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
  dateFrom?: string;
  dateTo?: string;
  createdAt?: string;
}

function buildExportQueryParams(params: FetchUsersParams, adjustedDateTo?: string): URLSearchParams {
  const queryParams = new URLSearchParams();

  queryParams.append("format", "excel");

  const fieldsToExport = ["email", "first_name", "last_name", "username", "phone", "status", "createdAt"];
  fieldsToExport.forEach((field) => queryParams.append("fieldsToExport[]", field));

  if (params.page) queryParams.append("page", params.page.toString());
  if (params.search) queryParams.append("search", params.search);
  if (params.status) queryParams.append("status", params.status);
  if (params.dateFrom) queryParams.append("dateFrom", params.dateFrom);
  if (adjustedDateTo) queryParams.append("dateTo", adjustedDateTo);
  if (params.createdAt) queryParams.append("createdAt", params.createdAt);

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

    const adjustedDateTo = adjustDateTo(params.dateTo);

    const queryString = buildQueryParams({
      page: params.page,
      search: params.search,
      status: params.status,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      dateFrom: params.dateFrom,
      dateTo: adjustedDateTo,
    });

    const url = `${API_BASE_URL}/api/admin/users?${queryString}`;

    console.log(url);

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

export async function exportUsers(params: FetchUsersParams = {}): Promise<Blob | ApiError> {
  try {
    const accessToken = await getValueFromCookie("accessToken");

    if (!accessToken) {
      return {
        success: false,
        message: "Authentication required",
        unauthorized: true,
      };
    }

    const adjustedDateTo = adjustDateTo(params.dateTo);
    const queryParams = buildExportQueryParams(params, adjustedDateTo);
    const url = `${API_BASE_URL}/api/admin/users?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Failed to export users",
      };
    }

    return await response.blob();
  } catch (error) {
    console.error("Error exporting users:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to export users",
    };
  }
}
