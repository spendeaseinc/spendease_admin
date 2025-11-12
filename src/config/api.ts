// API Configuration
export const API_CONFIG = {
  // Base URL for the backend
  BASE_URL: process.env.VITE_PUBLIC_ENDPOINT,
  // Auth endpoints
  AUTH: {
    VERIFY_OTP: "/api/admin/auth/two-fa/complete",
    SIGN_IN: "/api/admin/auth/login",
    SIGN_UP: "/api/admin/auth/signup",
    FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
    RESET_PASSWORD: "/api/admin/auth/reset-password",
  },

  // User endpoints
  USERS: {
    PROFILE: "/api/admin/users/profile",
    UPDATE_PROFILE: "/api/admin/users/profile/update",
    LIST: "/api/admin/users",
    DELETE: (id: string) => `/api/admin/users/${id}`,
  },

  // Two-Factor Authentication
  TWO_FA: {
    INITIATE: "/api/v1/two-fa/initiate",
    COMPLETE: "/api/v1/two-fa/complete",
    DEACTIVATE: "/api/v1/two-fa/deactivate",
  },

  // Notifications
  NOTIFICATIONS: {
    SEND: "/api/v1/admin/notifications/send",
  },

  // Partner Balance
  PARTNER_BALANCE: {
    GET: "/api/admin/misc/partner-balance",
  },

  // Other endpoints can be added here as needed
} as const;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get auth endpoints
export const getAuthEndpoint = (key: keyof typeof API_CONFIG.AUTH): string => {
  return buildApiUrl(API_CONFIG.AUTH[key]);
};

// Helper function to get user endpoints
export const getUserEndpoint = (key: keyof typeof API_CONFIG.USERS, id?: string): string => {
  const endpoint = API_CONFIG.USERS[key];
  if (typeof endpoint === "function" && id) {
    return buildApiUrl(endpoint(id));
  }
  return buildApiUrl(endpoint as string);
};

// Helper function to get two-factor authentication endpoints
export const getTwoFAEndpoint = (key: keyof typeof API_CONFIG.TWO_FA): string => {
  return buildApiUrl(API_CONFIG.TWO_FA[key]);
};

// Helper function to get notification endpoints
export const getNotificationEndpoint = (key: keyof typeof API_CONFIG.NOTIFICATIONS): string => {
  return buildApiUrl(API_CONFIG.NOTIFICATIONS[key]);
};

// Helper function to get partner balance endpoints
export const getPartnerBalanceEndpoint = (key: keyof typeof API_CONFIG.PARTNER_BALANCE): string => {
  return buildApiUrl(API_CONFIG.PARTNER_BALANCE[key]);
};
