/* eslint-disable sonarjs/no-commented-code */
"use server";

import { cookies } from "next/headers";

import type { ApiError, ApiResponse, RolesApiResponse } from "@/lib/types";
import { handleApiResponse, handleRolesApiResponse } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT;

interface FetchTeamsParams {
  page?: number;
  limit?: number;
  search?: string;
  role_id?: number;
  status?: string;
}

async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value ?? null;
}

function buildQueryParams(params: FetchTeamsParams): URLSearchParams {
  const queryParams = new URLSearchParams();
  //  if (params.page) queryParams.append("page", params.page.toString());
  //  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.search) queryParams.append("search", params.search);
  if (params.role_id) queryParams.append("role_id", params.role_id.toString());
  if (params.status) queryParams.append("status", params.status);

  return queryParams;
}

export async function fetchTeams(params: FetchTeamsParams = {}): Promise<ApiResponse | ApiError> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        message: "No access token found. Please log in.",
        unauthorized: true,
      };
    }

    const queryParams = buildQueryParams(params);
    const url = `${API_BASE_URL}/api/admin/users/teams?${queryParams.toString()}`;

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
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        success: false,
        message: "No access token found. Please log in.",
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
