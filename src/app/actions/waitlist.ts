"use server";

import type { ApiError, WaitlistApiResponse } from "@/lib/types";
import { buildQueryParams, handleApiResponse } from "@/lib/utils";
import { getValueFromCookie } from "@/server/server-actions";

const API_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT;

interface FetchWaitlistParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
  dateFrom?: string;
  dateTo?: string;
}

function adjustDateTo(dateTo?: string): string | undefined {
  if (!dateTo) return undefined;
  const date = new Date(dateTo);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
}

function buildExportQueryParams(params: FetchWaitlistParams, fieldsToExport: string[]): string {
  const queryParams = new URLSearchParams();

  queryParams.append("format", "excel");
  fieldsToExport.forEach((field) => queryParams.append("fieldsToExport[]", field));

  if (params.search) queryParams.append("search", params.search);
  if (params.status && params.status !== "all") queryParams.append("status", params.status);
  if (params.dateFrom) queryParams.append("dateFrom", params.dateFrom);

  const adjustedDateTo = adjustDateTo(params.dateTo);
  if (adjustedDateTo) queryParams.append("dateTo", adjustedDateTo);

  return queryParams.toString();
}

export async function fetchWaitlist(params: FetchWaitlistParams): Promise<WaitlistApiResponse | ApiError> {
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

    const url = `${API_BASE_URL}/api/admin/waitlist?${queryString}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching waitlist:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while fetching the waitlist.",
    };
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

export async function exportWaitlist(params: FetchWaitlistParams = {}): Promise<Blob | ApiError> {
  try {
    const accessToken = await getValueFromCookie("accessToken");

    if (!accessToken) {
      return {
        success: false,
        message: "Authentication required",
        unauthorized: true,
      };
    }

    const fieldsToExport = ["email", "status", "createdAt", "updatedAt"];

    const queryString = buildExportQueryParams(params, fieldsToExport);
    const url = `${API_BASE_URL}/api/admin/waitlist?${queryString}`;

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
        message: `Export failed with status ${response.status}`,
      };
    }

    return await response.blob();
  } catch (error) {
    console.error("Error exporting waitlist:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while exporting waitlist",
    };
  }
}
