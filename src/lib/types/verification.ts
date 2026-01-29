import { PaginationData, User } from "../types";

export type VerificationStatus = "pending_ocr" | "pending_review" | "approved" | "declined";
export type VerificationDocumentType = "utility_bill" | "bank_statement";
export type VerificationRiskLevel = "low" | "medium" | "high";
export type VerificationDeclineReason =
  | "document_expired"
  | "document_unreadable"
  | "address_mismatch"
  | "name_mismatch"
  | "document_altered";

export interface VerificationRequest {
  id: number;
  reference: string;
  user_id: number;
  user?: User;
  document_type: VerificationDocumentType;
  file_key: string;
  original_filename?: string;
  file_size?: number;
  status: VerificationStatus;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ocr_data?: any;
  extracted_name?: string;
  extracted_address?: string;
  name_match_score?: number;
  address_match_score?: number;
  risk_level?: VerificationRiskLevel;
  decline_reason?: VerificationDeclineReason;
  reviewer_id?: number;
  review_notes?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface VerificationTimelineEvent {
  id: number;
  verification_request_id: number;
  event_type: "submitted" | "ocr_started" | "ocr_completed" | "auto_approved" | "approved" | "declined" | "resubmitted";
  actor_type: "system" | "admin" | "user";
  actor_id?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
  created_at: string;
  updated_at: string;
}

export interface VerificationFileMetadata {
  file_key: string;
  content_type: string;
  content_length: number;
  last_modified: string;
  etag?: string;
  metadata?: Record<string, string>;
}

export interface VerificationStats {
  totals: {
    pending_ocr: number;
    pending_review: number;
    approved: number;
    declined: number;
  };
  total_requests: number;
}

export interface VerificationsApiResponse {
  status: boolean;
  message: string;
  data: {
    data: VerificationRequest[];
    paging: PaginationData;
  };
}
