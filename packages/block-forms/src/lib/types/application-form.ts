import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

/**
 * Verification status for OTP-protected forms
 */
export type VerificationStatus = 'pending' | 'verified';

/**
 * Application form retrieved via magic link (public access)
 * When OTP verification is required but not completed, only verification-related fields are populated.
 */
export interface ApplicationForm extends IdentityCore {
  formUniqueId: string;
  title?: string;
  description?: string;
  schema: Record<string, unknown>;
  uiSchema?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  status: EntityStatus;
  payload?: Record<string, unknown>;

  // OTP Verification fields (present when form requires OTP)
  /** Current verification status - 'pending' requires OTP, 'verified' means full access */
  verificationStatus?: VerificationStatus;
  /** Name of the user assigned to fill the form (visible even when pending) */
  assignedToName?: string;
  /** Masked email address for display (e.g., "j***e@e***e.com") */
  maskedEmail?: string;
  /** Whether an OTP has already been sent */
  otpSent?: boolean;
  /** Form name for display during verification */
  formName?: string;
}

export interface ApplicationFormSubmission {
  data: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface ApplicationFormDraft {
  data: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface ApplicationFormResponse extends IdentityCore {
  formUniqueId: string;
  data: Record<string, unknown>;
  status: EntityStatus;
  submittedAt?: Date;
  payload?: Record<string, unknown>;
}

// ============================================================================
// OTP Verification Types
// ============================================================================

/**
 * Response from sending an OTP code
 */
export interface SendOtpResponse {
  message: string;
  maskedEmail: string;
  expiresIn: number;
  sentCount: number;
}

/**
 * Request to verify an OTP code
 */
export interface VerifyOtpRequest {
  code: string;
}

/**
 * OTP error codes returned by the API
 */
export type OtpErrorCode =
  | 'OTP_NOT_REQUIRED'
  | 'ALREADY_VERIFIED'
  | 'RATE_LIMITED'
  | 'CODE_REQUIRED'
  | 'INVALID_CODE'
  | 'CODE_EXPIRED'
  | 'ATTEMPTS_EXCEEDED'
  | 'OTP_REQUIRED';

/**
 * Extended error information for OTP operations
 */
export interface OtpError {
  code: OtpErrorCode;
  message: string;
  /** Seconds to wait before retrying (for RATE_LIMITED errors) */
  retryAfter?: number;
  /** Remaining verification attempts (for INVALID_CODE errors) */
  attemptsRemaining?: number;
}
