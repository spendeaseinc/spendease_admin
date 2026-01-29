"use server";

import { ApiError, ApiResponse } from "@/lib/types";
import { VerificationsApiResponse } from "@/lib/types/verification";
import { buildQueryParams, handleApiResponse } from "@/lib/utils";
import { getValueFromCookie } from "@/server/server-actions";

const API_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT;

interface FetchVerificationsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  document_type?: string;
  dateFrom?: string;
  dateTo?: string;
}

export async function fetchVerifications(
  params: FetchVerificationsParams = {},
): Promise<VerificationsApiResponse | ApiError> {
  try {
    const accessToken = await getValueFromCookie("accessToken");

    if (!accessToken) {
      return {
        success: false,
        message: "Authentication required",
        unauthorized: true,
      };
    }

    const { page = 1, pageSize = 10, search, status, document_type } = params;

    const queryString = buildQueryParams({
      page,
      limit: pageSize,
      search,
      status: status !== "all" ? status : undefined,
      document_type: document_type !== "all" ? document_type : undefined,
    });

    const url = `${API_BASE_URL}/api/admin/address-verification/queue?${queryString}`;

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
    console.error("Error fetching verifications:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch verifications",
    };
  }
}

export async function fetchVerificationStats(): Promise<ApiResponse | ApiError> {
  try {
    const accessToken = await getValueFromCookie("accessToken");

    if (!accessToken) {
      return {
        success: false,
        message: "Authentication required",
        unauthorized: true,
      };
    }

    const url = `${API_BASE_URL}/api/admin/address-verification/stats`;

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
    console.error("Error fetching verification stats:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch verification stats",
    };
  }
}

export async function fetchVerificationDetail(id: number): Promise<ApiResponse | ApiError> {
  try {
    const accessToken = await getValueFromCookie("accessToken");

    if (!accessToken) {
      return {
        success: false,
        message: "Authentication required",
        unauthorized: true,
      };
    }

    const url = `${API_BASE_URL}/api/admin/address-verification/${id}`;

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
    console.error("Error fetching verification detail:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch verification detail",
    };
  }
}

export async function fetchVerificationTimeline(id: number): Promise<ApiResponse | ApiError> {
  try {
    const accessToken = await getValueFromCookie("accessToken");

    if (!accessToken) {
      return {
        success: false,
        message: "Authentication required",
        unauthorized: true,
      };
    }

    const url = `${API_BASE_URL}/api/admin/address-verification/${id}/timeline`;

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
    console.error("Error fetching verification timeline:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch timeline",
    };
  }
}

export async function approveVerification(id: number, notes?: string): Promise<ApiResponse | ApiError> {
  try {
    const accessToken = await getValueFromCookie("accessToken");

    if (!accessToken) {
      return {
        success: false,
        message: "Authentication required",
        unauthorized: true,
      };
    }

    const url = `${API_BASE_URL}/api/admin/address-verification/${id}/approve`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ review_notes: notes }),
      cache: "no-store",
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error("Error approving verification:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to approve verification",
    };
  }
}

export async function declineVerification(id: number, reason: string, notes?: string): Promise<ApiResponse | ApiError> {
  try {
    const accessToken = await getValueFromCookie("accessToken");

    if (!accessToken) {
      return {
        success: false,
        message: "Authentication required",
        unauthorized: true,
      };
    }

    const url = `${API_BASE_URL}/api/admin/address-verification/${id}/decline`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ decline_reason: reason, review_notes: notes }),
      cache: "no-store",
    });

    return await handleApiResponse(response);
  } catch (error) {
    console.error("Error declining verification:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to decline verification",
    };
  }
}
