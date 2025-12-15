/**
 * MFA Setup Response
 */
export interface MfaSetupResponse {
  secret: string;
  qrCodeUri: string;
  backupCodes: string[];
  testCode: string;
}

/**
 * MFA Enable Request
 */
export interface MfaEnableRequest {
  totpCode: string;
}

/**
 * MFA Disable Request
 */
export interface MfaDisableRequest {
  password: string;
}

/**
 * MFA Verify Request
 */
export interface MfaVerifyRequest {
  code?: string;
  backupCode?: string;
}

/**
 * MFA Status Response
 */
export interface MfaStatusResponse {
  enabled: boolean;
  setupRequired: boolean;
  backupCodesRemaining: number;
  lastUsedAt: string | null;
}

/**
 * MFA Verification Response
 */
export interface MfaVerificationResponse {
  valid: boolean;
  message: string;
}

/**
 * MFA Operation Response
 */
export interface MfaOperationResponse {
  enabled: boolean;
  message: string;
}
