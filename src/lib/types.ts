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

export type AuditLog = {
  id: string;
  name: string;
  initials: string;
  event: string;
  reference: string;
  description: string;
  role: string;
  timestamp: string;
};

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
};

export type TransactionDetailsModalType = "deposit" | "withdrawal" | null;

export type Customer = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
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
