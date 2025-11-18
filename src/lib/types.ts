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
