"use server";

import type { ApiError, ApiResponse, RolesApiResponse } from "@/lib/types";
import { adjustDateTo, buildQueryParams, handleApiResponse, handleRolesApiResponse } from "@/lib/utils";
import { getValueFromCookie } from "@/server/server-actions";

const API_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT;

interface FetchTeamsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role_id?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
  dateFrom?: string;
  dateTo?: string;
}

function buildExportQueryParams(params: FetchTeamsParams, fieldsToExport: string[]): string {
  const queryParams = new URLSearchParams();

  queryParams.append("format", "excel");
  fieldsToExport.forEach((field) => queryParams.append("fieldsToExport[]", field));

  if (params.search) queryParams.append("search", params.search);
  if (params.status && params.status !== "all") queryParams.append("status", params.status);
  if (params.role_id) queryParams.append("role_id", params.role_id.toString());
  if (params.dateFrom) queryParams.append("dateFrom", params.dateFrom);

  const adjustedDateTo = adjustDateTo(params.dateTo);
  if (adjustedDateTo) queryParams.append("dateTo", adjustedDateTo);

  return queryParams.toString();
}

export async function fetchTeams(params: FetchTeamsParams = {}): Promise<ApiResponse | ApiError> {
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
      role_id: params.role_id,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      dateFrom: params.dateFrom,
      dateTo: adjustedDateTo,
    });

    const url = `${API_BASE_URL}/api/admin/users/teams?${queryString}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    return handleApiResponse(response);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return {
      success: false,
      message: "An error occurred while fetching teams",
    };
  }
}

export async function fetchRoles(): Promise<RolesApiResponse | ApiError> {
  try {
    const accessToken = await getValueFromCookie("accessToken");

    if (!accessToken) {
      return {
        success: false,
        message: "Authentication required",
        unauthorized: true,
      };
    }

    const url = `${API_BASE_URL}/api/admin/users/roles`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    return handleRolesApiResponse(response);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return {
      success: false,
      message: "An error occurred while fetching roles",
    };
  }
}

export async function exportTeams(params: FetchTeamsParams = {}): Promise<Blob | ApiError> {
  try {
    const accessToken = await getValueFromCookie("accessToken");

    if (!accessToken) {
      return {
        success: false,
        message: "Authentication required",
        unauthorized: true,
      };
    }

    const fieldsToExport = ["email", "first_name", "last_name", "phone", "status", "createdAt"];

    const queryString = buildExportQueryParams(params, fieldsToExport);
    const url = `${API_BASE_URL}/api/admin/users/teams?${queryString}`;

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
    console.error("Error exporting teams:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while exporting teams",
    };
  }
}
