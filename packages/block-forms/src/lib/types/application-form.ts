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
  verificationStatus?: VerificationStatus;
  assignedToName?: string;
  maskedEmail?: string;
  otpSent?: boolean;
  formName?: string;
}

export interface ApplicationFormSubmission {
  data: Record<string, unknown>;
}

export interface ApplicationFormDraft {
  data: Record<string, unknown>;
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

export interface SendOtpResponse {
  message: string;
  maskedEmail: string;
  expiresIn: number;
  sentCount: number;
}

export interface VerifyOtpRequest {
  code: string;
}

export type OtpErrorCode =
  | 'OTP_NOT_REQUIRED'
  | 'ALREADY_VERIFIED'
  | 'RATE_LIMITED'
  | 'CODE_REQUIRED'
  | 'INVALID_CODE'
  | 'CODE_EXPIRED'
  | 'ATTEMPTS_EXCEEDED'
  | 'OTP_REQUIRED';

export interface OtpError {
  code: OtpErrorCode;
  message: string;
  retryAfter?: number;
  attemptsRemaining?: number;
}
