"use server";

import type { ApiError, PartnerBalanceResponse } from "@/lib/types";
import { handlePartnersApiResponse } from "@/lib/utils";
import { getValueFromCookie } from "@/server/server-actions";

const API_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT;

export async function fetchPartnerBalance(): Promise<PartnerBalanceResponse | ApiError> {
  try {
    const accessToken = await getValueFromCookie("accessToken");

    if (!accessToken) {
      return {
        success: false,
        message: "No access token found",
        unauthorized: true,
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/misc/partner-balance`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    return await handlePartnersApiResponse(response);
  } catch (error) {
    console.error("Error fetching partner balance:", error);
    return {
      success: false,
      message: "Failed to fetch partner balance",
    };
  }
}
