"use server";

import type { ApiResponse, ApiError } from "@/lib/types";
import { handleApiResponse } from "@/lib/utils";
import { getValueFromCookie } from "@/server/server-actions";

const API_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT;

interface FetchAuditLogsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  event?: string;
  actor?: string;
  sortBy?: string;
  sortOrder?: string;
}

function buildQueryParams(params: FetchAuditLogsParams): URLSearchParams {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page.toString());
  if (params.search) queryParams.append("search", params.search);
  if (params.event) queryParams.append("event", params.event);
  if (params.actor) queryParams.append("actor", params.actor);
  if (params.sortBy) queryParams.append("sort_by", params.sortBy);
  if (params.sortOrder) queryParams.append("sort_order", params.sortOrder);

  return queryParams;
}

export async function fetchAuditLogs(params: FetchAuditLogsParams = {}): Promise<ApiResponse | ApiError> {
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
    const url = `${API_BASE_URL}/api/admin/misc/audit-logs?${queryParams.toString()}`;

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
    console.error("Error fetching audit logs:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch audit logs",
    };
  }
}
