export interface PaginationData {
  total_items: number;
  page_size: number;
  current: number;
  count: number;
  next: number;
}

export interface ApiResponse {
  status: boolean;
  message: string;
  data: {
    data: AuditLog[];
    paging: PaginationData;
    links: Array<{
      href: string;
      rel: string;
      method: string;
    }>;
  };
}

export type ApiError = {
  success: false;
  message: string;
  unauthorized?: true;
};

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

export interface AuditLogSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  event?: string;
  actor?: string;
  actor_id?: string;
  dateFrom?: string;
  dateTo?: string;
  format?: "excel" | "csv";
}

export interface PaginationInfo {
  current: number;
  page_size: number;
  total_items: number;
}

export type AuditLogsSuccess = {
  success: true;
  auditLogs: AuditLog[];
  pagination: PaginationData;
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

export interface User {
  id: number;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  status: string;
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

export type Partner = {
  id: string;
  name: string;
  email: string;
  lastLogin: string;
  status: "Active" | "Pending" | "Inactive";
  balance: string;
  currency: string;
  initials: string;
  logo?: string;
};

export interface PartnerDisplay extends Partner {
  initials: string;
  statusDisplay: "Active" | "Inactive";
}

export type TransactionDetailsModalType = "deposit" | "withdrawal" | null;

export type Customer = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  phone_number: string;
  last_name: string;
  first_name: string;
  status: "verified" | "pending";
  initials: string;
  createdAt: string;
  // Customer profile details
  firstName?: string;
  lastName?: string;
  otherName?: string;
  gender?: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  placeOfBirth?: string;
  lgaOfOrigin?: string;
  stateOfOrigin?: string;
  nationality?: string;
  religion?: string;
  mothersMaidenName?: string;
  bvn?: string;
  // Address information
  housePlotNumber?: string;
  streetName?: string;
  landmark?: string;
  lga?: string;
  // Means of identification
  idType?: string;
  idNumber?: string;
  dateIssued?: string;
  expiryDate?: string;
  // Account information
  accounts?: CustomerAccount[];
  transactions?: CustomerTransaction[];
  kycLevel?: string;
  profileImage?: string;
};

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
