/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PaginationData {
  total_items: number;
  page_size: number;
  current: number;
  count: number;
  next: number;
}

// API Responses

export interface ApiResponse {
  status: boolean;
  message: string;
  data: {
    data: any[];
    paging: PaginationData;
    links: Array<{
      href: string;
      rel: string;
      method: string;
    }>;
  };
}

export type ApiError = {
  success: boolean;
  message: string;
  unauthorized?: true;
};

export interface RolesApiResponse {
  status: boolean;
  message: string;
  data: TeamMemberRole[];
}

export interface UsersApiResponse {
  status: boolean;
  message: string;
  data: {
    data: User[];
    count: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PartnerBalanceResponse {
  status: boolean;
  message: string;
  data: PartnerBalanceData;
}

export interface WaitlistApiResponse {
  status: boolean;
  message: string;
  data: {
    data: WaitlistEntry[];
    paging: PaginationData;
    links: Array<{
      href: string;
      rel: string;
      method: string;
    }>;
  };
}

export interface TransactionsApiResponse {
  status: boolean;
  message: string;
  data: {
    data: WalletTransaction[];
    paging: PaginationData;
    links: Array<{
      href: string;
      rel: string;
      method: string;
    }>;
  };
}

// Data types

export interface AuditLog {
  id: number;
  reference: string;
  event: string;
  description: string;
  actor: string;
  actor_id: number;
  target: boolean;
  target_id: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  status: "unverified" | "verified" | "active" | "locked" | "suspended" | "deleted";
  created_at: string;
  updated_at: string;
}

export interface TeamMemberRole {
  id: number;
  name: string;
  type: string;
  permissions: Record<string, Record<string, boolean>>;
}

export interface TeamMemberData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  status: "active" | "inactive";
  role_id: number;
  admin_role: TeamMemberRole;
  created_at: string;
}

export type ModalType =
  | "add-user"
  | "edit-user"
  | "delete-user"
  | "user-added"
  | "user-updated"
  | "user-removed"
  | null;

export type Transaction = {
  id: string;
  userId: string;
  accountName: string;
  sessionId: string;
  date: string;
  status: "Successful" | "Pending" | "Failed";
  amount: string;
  currency: string;
  type: "Deposit" | "Withdrawal";
  wallet: string;
  accountNumber: string;
  beneficiaryName?: string;
  beneficiaryAccount?: string;
  bank?: string;
  reason?: string;
  transactionId: string;
};

export type TransactionDetailsModalType = "deposit" | "withdrawal" | null;

export type Customer = {
  id: string;
  email: string;
  phone: string;
  last_name: string;
  first_name: string;
  status: "verified" | "pending" | "active";
  createdAt: string;
  updatedAt: string;
  username?: string;
  profile_image?: string;
  meta: KycResponse;
  // Account information
  accounts?: CustomerAccount[];
  transactions?: CustomerTransaction[];
};

export interface KycResponse {
  kyc: any;
  bvn: BvnDetails;
  nin: NinDetails;
}

export interface BvnDetails {
  bvn: string;
  nin: string;
  email: string;
  phone: string;
  photo: string;
  title: string;
  gender: string;
  lastname: string;
  birthdate: string;
  firstname: string;
  middlename: string;
  nationality: string;
  lga_of_origin: string;
  marital_status: string;
  state_of_origin: string;
  level_of_account: string;
  lga_of_residence: string;
  registration_date: string;
  state_of_residence: string;
  residential_address: string;
}

export interface NinDetails {
  nin: string;
}

export type CustomerAccount = {
  id: string;
  currency: string;
  accountNumber: string;
  bankMobileMoney: string;
  status: "Active" | "Pending" | "Inactive";
  balance: string;
};

export type CustomerTransaction = {
  id: string;
  transactionId: string;
  currency: string;
  beneficiaryAccount: string;
  bankMobileMoney: string;
  status: "Active" | "Pending";
  timestamp: string;
  balance: string;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  lastLogin?: string;
  role: "Viewer" | "Admin" | "Analyst" | "Product Manager" | "Super Admin";
  status: "Active" | "Pending" | "Inactive";
  createdAt: string;
  initials: string;
};

export interface PartnerBalance {
  balance: string;
  account_name: string;
  account_number: string;
  bank_name: string;
}

export interface PartnerBalanceData {
  [key: string]: PartnerBalance;
}

export interface WaitlistEntry {
  id: number;
  email: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: number;
  reference: string;
  user_id: number;
  user?: {
    first_name: string;
    last_name: string;
  };
  currency: string;
  amount: string;
  type: string;
  status: string;
  description: string;
  balance_before: string;
  balance_after: string;
  created_at: string;
  updatedAt: string;
}

export interface WalletTransactionDetail extends WalletTransaction {
  session_id?: string;
  transaction_id?: string;
  wallet_type?: string;
  account_number?: string;
  beneficiary_name?: string;
  beneficiary_account?: string;
  beneficiary_bank?: string;
  payment_reason?: string;
}

export interface TransactionDetailResponse {
  status: boolean;
  message: string;
  data: WalletTransactionDetail;
}

export interface DashboardStats {
  overview: {
    totalUsers: number;
    activeUsers: number;
    transactingUsers: number;
    totalTransactions: number;
    successfulTransactions: number;
    successRate: number;
  };
  transactionOverview: {
    title: string;
    subtitle: string;
    data: Array<{
      month: string;
      count: number;
    }>;
  };
  customersComparison: {
    title: string;
    data: Array<{
      date: string;
      totalCustomers: number;
      transactingCustomers: number;
    }>;
  };
  newCustomers: {
    title: string;
    currentMonth: number;
    previousMonth: number;
    percentageChange: number;
    data: Array<{
      month: string;
      count: number;
    }>;
  };
}

export interface DashboardStatsResponse {
  status: boolean;
  message: string;
  // eslint-disable-next-line max-lines
  data: DashboardStats;
}

// Notification types
export type NotificationType = "unique" | "broadcast";
export type NotificationStatus = "pending" | "sent" | "delivered" | "read" | "failed";

export interface Notification {
  id: number;
  user_id: number | null;
  type: NotificationType;
  title: string;
  body: string;
  status: NotificationStatus;
  created_at: string;
}
