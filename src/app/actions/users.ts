"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { User } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_ENDPOINT ?? "https://spendeasebackend-production.up.railway.app";

interface PaginationData {
  total_items: number;
  page_size: number;
  current: number;
  count: number;
  next: number;
}

interface UsersResponse {
  status: boolean;
  message: string;
  data: {
    data: User[];
    paging: PaginationData;
    links: Array<{
      href: string;
      rel: string;
      method: string;
    }>;
  };
}

type UsersSuccess = {
  success: true;
  users: User[];
  pagination: PaginationData;
};

type UsersError = {
  success: false;
  message: string;
  unauthorized?: true;
};

type UsersResult = UsersSuccess | UsersError;

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

export async function getUsers(page: number): Promise<UsersResult> {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/api/admin/users?page=${page}`, {
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
      throw new Error("Failed to fetch users");
    }

    const data: UsersResponse = await response.json();

    if (data.status) {
      return {
        success: true,
        users: data.data.data,
        pagination: data.data.paging,
      };
    }

    return {
      success: false,
      message: data.message || "Failed to fetch users",
    };
  } catch (error) {
    console.error("Get users error:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return {
        success: false,
        message: "Unauthorized",
        unauthorized: true,
      };
    }

    return {
      success: false,
      message: "An error occurred while fetching users",
    };
  }
}

export async function deleteUser(userId: string) {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      method: "DELETE",
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
      throw new Error("Failed to delete user");
    }

    const data: ApiResponse = await response.json();

    if (data.status) {
      // Revalidate the users page to refresh the data
      revalidatePath("/users");

      return {
        success: true,
        message: data.message || "User deleted successfully",
      };
    }

    return {
      success: false,
      message: data.message || "Failed to delete user",
    };
  } catch (error) {
    console.error("Delete user error:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return {
        success: false,
        message: "Unauthorized",
        unauthorized: true,
      };
    }

    return {
      success: false,
      message: "An error occurred while deleting user",
    };
  }
}

export async function getUserProfile() {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/api/admin/users/profile`, {
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
      throw new Error("Failed to fetch user profile");
    }

    const data: ApiResponse = await response.json();

    if (data.status) {
      return {
        success: true,
        profile: data.data,
      };
    }

    return {
      success: false,
      message: data.message || "Failed to fetch user profile",
    };
  } catch (error) {
    console.error("Get user profile error:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return {
        success: false,
        message: "Unauthorized",
        unauthorized: true,
      };
    }

    return {
      success: false,
      message: "An error occurred while fetching user profile",
    };
  }
}

export async function updateUserProfile(profileData: any) {
  try {
    const token = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/api/admin/users/profile/update`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
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
      throw new Error("Failed to update user profile");
    }

    const data: ApiResponse = await response.json();

    if (data.status) {
      // Revalidate relevant paths
      revalidatePath("/settings/account");

      return {
        success: true,
        message: data.message || "Profile updated successfully",
        profile: data.data,
      };
    }

    return {
      success: false,
      message: data.message || "Failed to update user profile",
    };
  } catch (error) {
    console.error("Update user profile error:", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return {
        success: false,
        message: "Unauthorized",
        unauthorized: true,
      };
    }

    return {
      success: false,
      message: "An error occurred while updating user profile",
    };
  }
}
