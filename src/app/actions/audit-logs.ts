"use server";

import type { ApiResponse, ApiError } from "@/lib/types";
import { buildQueryParams, handleApiResponse } from "@/lib/utils";
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

    const queryString = buildQueryParams({
      page: params.page,
      search: params.search,
      event: params.event,
      actor: params.actor,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    });
    const url = `${API_BASE_URL}/api/admin/misc/audit-logs?${queryString}`;

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
