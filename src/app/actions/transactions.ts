"use server";

import type { ApiError, ApiResponse } from "@/lib/types";
import { adjustDateTo, buildQueryParams, handleApiResponse } from "@/lib/utils";
import { getValueFromCookie } from "@/server/server-actions";

const API_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT;

interface FetchTransactionsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  currency?: string;
  type?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

function buildExportQueryParams(params: FetchTransactionsParams, adjustedDateTo?: string): URLSearchParams {
  const queryParams = new URLSearchParams();

  queryParams.append("format", "excel");

  const fieldsToExport = [
    "reference",
    "user_id",
    "currency",
    "amount",
    "type",
    "status",
    "description",
    "balance_before",
    "balance_after",
    "createdAt",
  ];
  fieldsToExport.forEach((field) => queryParams.append("fieldsToExport[]", field));

  if (params.search) queryParams.append("search", params.search);
  if (params.currency) queryParams.append("currency", params.currency);
  if (params.type) queryParams.append("type", params.type);
  if (params.status) queryParams.append("status", params.status);
  if (params.dateFrom) queryParams.append("dateFrom", params.dateFrom);
  if (adjustedDateTo) queryParams.append("dateTo", adjustedDateTo);

  return queryParams;
}

export async function fetchTransactions(params: FetchTransactionsParams = {}): Promise<ApiResponse | ApiError> {
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
      currency: params.currency,
      type: params.type,
      status: params.status,
      dateFrom: params.dateFrom,
      dateTo: adjustedDateTo,
    });

    const url = `${API_BASE_URL}/api/admin/transactions/wallet-transactions?${queryString}`;

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
    console.error("Error fetching transactions:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch transactions",
    };
  }
}

export async function fetchTransactionStats(): Promise<
  | {
      total: number;
      pending: number;
      success: number;
      failed: number;
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

    const url = `${API_BASE_URL}/api/admin/transactions/wallet-transactions`;

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

    const pendingResponse = await fetch(`${url}?status=pending`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const pendingResult = await handleApiResponse(pendingResponse);

    const successResponse = await fetch(`${url}?status=success`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const successResult = await handleApiResponse(successResponse);

    const failedResponse = await fetch(`${url}?status=failed`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const failedResult = await handleApiResponse(failedResponse);

    if ("success" in pendingResult || "success" in successResult || "success" in failedResult) {
      return {
        success: false,
        message: "Failed to fetch transaction stats",
      };
    }

    const total = result.data.paging.total_items;
    const pending = pendingResult.data.paging.total_items;
    const success = successResult.data.paging.total_items;
    const failed = failedResult.data.paging.total_items;

    return {
      total,
      pending,
      success,
      failed,
    };
  } catch (error) {
    console.error("Error fetching transaction stats:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch transaction stats",
    };
  }
}

export async function exportTransactions(params: FetchTransactionsParams = {}): Promise<Blob | ApiError> {
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
    const url = `${API_BASE_URL}/api/admin/transactions/wallet-transactions?${queryParams.toString()}`;

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
        message: "Failed to export transactions",
      };
    }

    return await response.blob();
  } catch (error) {
    console.error("Error exporting transactions:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to export transactions",
    };
  }
}
