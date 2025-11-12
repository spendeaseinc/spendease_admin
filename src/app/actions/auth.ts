"use server";

import { cookies } from "next/headers";

import type z from "zod";

import type { LoginSchema, ForgotPasswordSchema, ResetPasswordSchema } from "@/lib/schema";

const API_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT ?? "https://spendeasebackend-production.up.railway.app";

interface SignInResponse {
  status: boolean;
  message: string;
  data: {
    accessToken: string;
    user: {
      id: number;
      email: string;
      first_name: string;
      last_name: string;
    };
    authorizationRequired?: boolean;
  };
}

interface OTPData {
  code: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

export async function signIn(data: z.infer<typeof LoginSchema>) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result: SignInResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Login failed",
      };
    }

    if (result.status) {
      if (result.data.authorizationRequired) {
        // Store temp token for 2FA
        const cookieStore = await cookies();
        cookieStore.set("tempToken", result.data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 15, // 15 minutes
        });

        return {
          success: true,
          message: result.message,
          requiresOTP: true,
        };
      } else {
        // Store access token
        const cookieStore = await cookies();
        cookieStore.set("accessToken", result.data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        cookieStore.set("user", JSON.stringify(result.data.user), {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return {
          success: true,
          message: result.message,
          requiresOTP: false,
        };
      }
    }

    return {
      success: false,
      message: result.message || "Login failed",
    };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      success: false,
      message: "An error occurred during login",
    };
  }
}

export async function verifyOTP(data: OTPData) {
  try {
    const cookieStore = await cookies();
    const tempToken = cookieStore.get("tempToken")?.value;

    if (!tempToken) {
      return {
        success: false,
        message: "No temporary token found. Please sign in again.",
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/auth/two-fa/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tempToken}`,
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result: ApiResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "OTP verification failed",
      };
    }

    if (result.status && result.data) {
      // Clear temp token and set access token
      cookieStore.delete("tempToken");

      cookieStore.set("accessToken", result.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      cookieStore.set("user", JSON.stringify(result.data.user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return {
        success: true,
        message: result.message,
      };
    }

    return {
      success: false,
      message: result.message || "OTP verification failed",
    };
  } catch (error) {
    console.error("OTP verification error:", error);
    return {
      success: false,
      message: "An error occurred during OTP verification",
    };
  }
}

export async function forgotPassword(data: z.infer<typeof ForgotPasswordSchema>) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result: ApiResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to send reset email",
      };
    }

    return {
      success: result.status,
      message: result.message,
      email: data.email,
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      message: "An error occurred while processing your request",
    };
  }
}

export async function resetPassword(token: string, data: z.infer<typeof ResetPasswordSchema>) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password: data.password,
      }),
      cache: "no-store",
    });

    const result: ApiResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to reset password",
      };
    }

    return {
      success: result.status,
      message: result.message,
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      message: "An error occurred while resetting your password",
    };
  }
}

export async function signOut() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("user");
    cookieStore.delete("tempToken");

    return {
      success: true,
      message: "Signed out successfully",
    };
  } catch (error) {
    console.error("Sign out error:", error);
    return {
      success: false,
      message: "An error occurred during sign out",
    };
  }
}

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const userCookie = cookieStore.get("user")?.value;

    if (!accessToken || !userCookie) {
      return null;
    }

    const user = JSON.parse(userCookie);

    return {
      accessToken,
      user,
    };
  } catch (error) {
    console.error("Get session error:", error);
    return null;
  }
}
