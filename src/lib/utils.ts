import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { ApiError, ApiResponse, PartnerBalanceResponse, RolesApiResponse } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildQueryParams(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
}

export function formatToTitleCase(inputString: string) {
  if (!inputString) {
    return "";
  }

  const spacedCamelCase = inputString.replace(/([a-z])([A-Z])/g, "$1 $2");

  const spacedString = spacedCamelCase.replace(/_/g, " ");

  const titleCaseString = spacedString.replace(/\b\w/g, (char) => char.toUpperCase());

  return titleCaseString;
}

type StatusType = "active" | "verified" | "unverified" | "locked" | "suspended" | "deleted";

const statusVariants: Record<StatusType, "default" | "primary" | "green" | "secondary" | "destructive" | "outline"> = {
  active: "primary",
  verified: "green",
  unverified: "outline",
  locked: "destructive",
  suspended: "destructive",
  deleted: "destructive",
};

export const getStatusVariant = (
  status: string,
): "default" | "primary" | "green" | "secondary" | "destructive" | "outline" => {
  if (status in statusVariants) {
    return statusVariants[status as StatusType];
  }
  return "outline";
};

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

export async function handlePartnersApiResponse(response: Response): Promise<PartnerBalanceResponse | ApiError> {
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
