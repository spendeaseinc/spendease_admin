"use server";

import { cookies } from "next/headers";

import { Partner } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT ?? "https://spendeasebackend-production.up.railway.app";

interface PartnerBalanceResponse {
  status: boolean;
  message: string;
  data: Partner[];
}

type GetPartnerBalancesResult =
  | {
      success: true;
      partners: Partner[];
    }
  | {
      success: false;
      message: string;
      unauthorized?: true;
    };

async function getAuthToken() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  return accessToken;
}

export async function getPartnerBalances(): Promise<GetPartnerBalancesResult> {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/api/admin/misc/partner-balance`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: "Unauthorized",
          unauthorized: true,
        };
      }
      throw new Error("Failed to fetch partner balances");
    }

    const data: PartnerBalanceResponse = await response.json();

    console.log(data);

    if (data.status) {
      return {
        success: true,
        partners: data.data,
      };
    }

    return {
      success: false,
      message: data.message || "Failed to fetch partner balances",
    };
  } catch (error) {
    console.error("Get partner balances error:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return {
        success: false,
        message: "Unauthorized",
        unauthorized: true,
      };
    }

    return {
      success: false,
      message: "An error occurred while fetching partner balances",
    };
  }
}
