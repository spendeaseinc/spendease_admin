"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT ?? "https://spendeasebackend-production.up.railway.app";

interface TwoFAInitiateResponse {
  status: boolean;
  message: string;
  data: {
    qrCode: string;
    secret: string;
  };
}

interface TwoFACompleteData {
  code: string;
  secret: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data?: any;
}

async function getAuthToken() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  return accessToken;
}

export async function initiateTwoFA() {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/api/v1/two-fa/initiate`, {
      method: "POST",
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
      throw new Error("Failed to initiate 2FA");
    }

    const data: TwoFAInitiateResponse = await response.json();

    if (data.status) {
      return {
        success: true,
        message: data.message,
        qrCode: data.data.qrCode,
        secret: data.data.secret,
      };
    }

    return {
      success: false,
      message: data.message || "Failed to initiate 2FA",
    };
  } catch (error) {
    console.error("Initiate 2FA error:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return {
        success: false,
        message: "Unauthorized",
        unauthorized: true,
      };
    }

    return {
      success: false,
      message: "An error occurred while initiating 2FA",
    };
  }
}

export async function completeTwoFA(data: TwoFACompleteData) {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/api/v1/two-fa/complete`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
      throw new Error("Failed to complete 2FA setup");
    }

    const result: ApiResponse = await response.json();

    if (result.status) {
      // Revalidate security settings page
      revalidatePath("/settings/security");

      return {
        success: true,
        message: result.message || "2FA enabled successfully",
      };
    }

    return {
      success: false,
      message: result.message || "Failed to complete 2FA setup",
    };
  } catch (error) {
    console.error("Complete 2FA error:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return {
        success: false,
        message: "Unauthorized",
        unauthorized: true,
      };
    }

    return {
      success: false,
      message: "An error occurred while completing 2FA setup",
    };
  }
}

export async function deactivateTwoFA() {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/api/v1/two-fa/deactivate`, {
      method: "POST",
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
      throw new Error("Failed to deactivate 2FA");
    }

    const data: ApiResponse = await response.json();

    if (data.status) {
      // Revalidate security settings page
      revalidatePath("/settings/security");

      return {
        success: true,
        message: data.message || "2FA deactivated successfully",
      };
    }

    return {
      success: false,
      message: data.message || "Failed to deactivate 2FA",
    };
  } catch (error) {
    console.error("Deactivate 2FA error:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return {
        success: false,
        message: "Unauthorized",
        unauthorized: true,
      };
    }

    return {
      success: false,
      message: "An error occurred while deactivating 2FA",
    };
  }
}
