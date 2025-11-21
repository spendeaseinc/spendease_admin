"use server";

import type { ApiResponse, ApiError } from "@/lib/types";
import { adjustDateTo, buildQueryParams, handleApiResponse } from "@/lib/utils";
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
  dateFrom?: string;
  dateTo?: string;
}

function buildExportQueryParams(params: FetchAuditLogsParams, adjustedDateTo?: string): URLSearchParams {
  const queryParams = new URLSearchParams();

  queryParams.append("format", "excel");

  const fieldsToExport = ["reference", "event", "actor", "description", "createdAt"];
  fieldsToExport.forEach((field) => queryParams.append("fieldsToExport[]", field));

  if (params.page) queryParams.append("page", params.page.toString());
  if (params.search) queryParams.append("search", params.search);
  if (params.event) queryParams.append("event", params.event);
  if (params.actor) queryParams.append("actor", params.actor);
  if (params.dateFrom) queryParams.append("dateFrom", params.dateFrom);
  if (adjustedDateTo) queryParams.append("dateTo", adjustedDateTo);

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

    const adjustedDateTo = adjustDateTo(params.dateTo);

    const queryString = buildQueryParams({
      page: params.page,
      search: params.search,
      event: params.event,
      actor: params.actor,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      dateFrom: params.dateFrom,
      dateTo: adjustedDateTo,
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

export async function exportAuditLogs(params: FetchAuditLogsParams = {}): Promise<Blob | ApiError> {
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
    const url = `${API_BASE_URL}/api/admin/misc/audit-logs?${queryParams.toString()}`;

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
        message: "Failed to export audit logs",
      };
    }

    return await response.blob();
  } catch (error) {
    console.error("Error exporting audit logs:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to export audit logs",
    };
  }
}
