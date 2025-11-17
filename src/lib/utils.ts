import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { ApiError, ApiResponse, RolesApiResponse } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatToTitleCase(inputString: string) {
  if (!inputString) {
    return "";
  }

  // Add space before capital letters (except at the start)
  const spacedCamelCase = inputString.replace(/([a-z])([A-Z])/g, "$1 $2");

  // Replace underscores with spaces
  const spacedString = spacedCamelCase.replace(/_/g, " ");

  // Capitalize the first letter of each word
  const titleCaseString = spacedString.replace(/\b\w/g, (char) => char.toUpperCase());

  return titleCaseString;
}

export const getInitials = (str: string): string => {
  if (typeof str !== "string" || !str.trim()) return "?";

  return (
    str
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "?"
  );
};

export function formatCurrency(
  amount: number,
  opts?: {
    currency?: string;
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    noDecimals?: boolean;
  },
) {
  const { currency = "USD", locale = "en-US", minimumFractionDigits, maximumFractionDigits, noDecimals } = opts ?? {};

  const formatOptions: Intl.NumberFormatOptions = {
    style: "currency",
    currency,
    minimumFractionDigits: noDecimals ? 0 : minimumFractionDigits,
    maximumFractionDigits: noDecimals ? 0 : maximumFractionDigits,
  };

  return new Intl.NumberFormat(locale, formatOptions).format(amount);
}

export async function handleApiResponse(response: Response): Promise<ApiResponse | ApiError> {
  if (!response.ok) {
    if (response.status === 401) {
      return {
        success: false,
        message: "Unauthorized - Please log in again",
        unauthorized: true,
      };
    }

    try {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message ?? `Error: ${response.statusText}`,
      };
    } catch {
      return {
        success: false,
        message: `Error: ${response.statusText}`,
      };
    }
  }

  try {
    const data = await response.json();
    return data;
  } catch {
    return {
      success: false,
      message: "Failed to parse response",
    };
  }
}

export async function handleRolesApiResponse(response: Response): Promise<RolesApiResponse | ApiError> {
  if (!response.ok) {
    if (response.status === 401) {
      return {
        success: false,
        message: "Unauthorized - Please log in again",
        unauthorized: true,
      };
    }

    try {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message ?? `Error: ${response.statusText}`,
      };
    } catch {
      return {
        success: false,
        message: `Error: ${response.statusText}`,
      };
    }
  }

  try {
    const data = await response.json();
    return data;
  } catch {
    return {
      success: false,
      message: "Failed to parse response",
    };
  }
}
