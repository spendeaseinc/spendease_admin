/* eslint-disable max-lines */
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

// Session user from authentication (comes from login response)
export interface SessionUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  phone_country_code?: string;
  status: string;
  role_name: {
    name: string;
    permissions: Record<string, Record<string, boolean>>;
  };
}

// Admin role names that can bypass approval
export type AdminRoleName = "owner" | "admin" | "customer_support" | "operations" | "developer";

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
  status: "verified" | "pending" | "active" | "unverified" | "locked" | "suspended";
  createdAt: string;
  updatedAt: string;
  username?: string;
  profile_image?: string;
  tier?: number; // Account level (0, 1, 2)
  meta: KycResponse;
  // Account information
  accounts?: CustomerAccount[];
  transactions?: CustomerTransaction[];
  bank_accounts?: CustomerBankAccount[];
};

// Bank account from backend (for beneficiaries)
export interface CustomerBankAccount {
  id: number;
  user_id: number;
  account_name: string;
  account_number: string;
  bank_name: string;
  bank_code: string;
  currency?: string;
  default?: boolean;
  created_at?: string;
  updated_at?: string;
}

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

  data: DashboardStats;
}

// Notification types
export type NotificationType = "unique" | "broadcast" | "general";
export type NotificationStatus = "pending" | "sent" | "delivered" | "read" | "failed";
export type NotificationApprovalStatus = "pending_approval" | "approved" | "rejected" | null;

export interface NotificationCreator {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role_name: string;
}

export interface Notification {
  id: number;
  user_id: number | null;
  type: NotificationType;
  title: string;
  body: string;
  status: NotificationStatus;
  approval_status?: NotificationApprovalStatus;
  created_by?: number | null;
  approved_by?: number | null;
  rejection_reason?: string | null;
  created_at: string;
  // Frontend-only fields for display (populated from created_by lookup)
  creator?: NotificationCreator;
}

// ============================================
// Customer Detail Page Types
// ============================================

// Extended wallet transaction with additional fields from backend
export interface WalletTransactionExtended extends WalletTransaction {
  fee?: string;
  payment_method?: string;
  processor?: string;
  source_currency?: string;
  destination_currency?: string;
  provider_rate?: string;
  marked_up_rate?: string;
  sending_country?: string;
  receiving_country?: string;
  meta?: {
    beneficiary?: {
      account_number: string;
      bank_name: string;
      account_name: string;
    };
    fromCurrency?: string;
    toCurrency?: string;
    exchangeRate?: number;
    localAmount?: number;
    usdAmount?: number;
    network?: string;
    [key: string]: any;
  };
}

// Customer Stats (calculated from transactions)
export interface CustomerStats {
  totalTransactions: number;
  totalTransactionVolume: number;
  averageTransactionValue: number;
  successRate: number;
  transactionFrequency: string; // e.g., "8.2 per month"
  totalBeneficiaries: number;
  baseCountry: string;
  countryCode: string;
  primaryCurrency: string; // e.g., "NGN", "USD"
}

// Customer beneficiary display type (derived from bank_accounts)
export interface CustomerBeneficiary {
  id: number;
  name: string;
  accountNumber: string; // May be masked
  accountNumberFull: string;
  bankName: string;
  bankCode: string;
  currency: string;
  country: string;
  isDefault: boolean;
  createdAt?: string;
}

// Transaction Swap from backend
export interface TransactionSwap {
  id: number;
  reference: string;
  user_id: number;
  type: string;
  status: string;
  currency: string;
  network?: string;
  deposit_amount: number;
  withdrawal_amount: number;
  deposit_fee: number;
  withdrawal_fee: number;
  exchange_rate: number;
  meta?: {
    beneficiary?: {
      account_number: string;
      bank_name: string;
      account_name: string;
    };
    source_currency?: string;
    target_currency?: string;
    from_currency?: string;
    to_currency?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at?: string;
}

// Transaction Swaps API Response
export interface SwapsApiResponse {
  status: boolean;
  message: string;
  data: {
    data: TransactionSwap[];
    paging: PaginationData;
    links: Array<{
      href: string;
      rel: string;
      method: string;
    }>;
  };
}

// Currency pair stats for analytics
export interface CurrencyPairStats {
  pair: string;
  fromCurrency: string;
  toCurrency: string;
  count: number;
  volume: number;
  percentage: number;
}

// Transaction status breakdown for analytics
export interface TransactionStatusBreakdown {
  status: string;
  count: number;
  percentage: number;
  fill: string; // Chart color
}

// Transaction type breakdown for analytics
export interface TransactionTypeBreakdown {
  type: string;
  count: number;
  percentage: number;
  fill: string;
}

// Customer transactions filter params
export interface CustomerTransactionsParams {
  userId: string;
  page?: number;
  status?: string;
  type?: string;
  currency?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}
