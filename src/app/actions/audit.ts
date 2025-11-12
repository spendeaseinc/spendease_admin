"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { ApiError, ApiResponse, AuditLogsSuccess } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT ?? "https://spendeasebackend-production.up.railway.app";

type AuditLogsResult = AuditLogsSuccess | ApiError;

async function getAuthToken() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    redirect("/auth/login");
  }

  return accessToken;
}

export async function getAuditLogs(page = 1): Promise<AuditLogsResult> {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/api/admin/misc/audit-logs?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401) {
        redirect("/auth/login");
      }
      throw new Error("Failed to fetch audit logs");
    }

    const data: ApiResponse = await response.json();

    if (data.status) {
      return {
        success: true,
        auditLogs: data.data.data,
        pagination: data.data.paging,
      };
    }

    return {
      success: false,
      message: data.message || "Failed to fetch audit logs",
    };
  } catch (error) {
    console.error("Get audit logs error:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return {
        success: false,
        message: "Unauthorized",
        unauthorized: true,
      };
    }

    return {
      success: false,
      message: "An error occurred while fetching audit logs",
    };
  }
}
