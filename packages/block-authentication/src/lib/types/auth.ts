import type { User } from './user.js';

/**
 * Sign in request
 */
export interface SignInRequest {
  email: string;
  password: string;
}

/**
 * Sign in response
 */
export interface SignInResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn?: number;
}

/**
 * Sign up request
 */
export interface SignUpRequest {
  email: string;
  password: string;
  passwordConfirmation: string;
  /** URL to redirect after email confirmation */
  confirmSuccessUrl: string;
  name?: string;
  username?: string;
  roleId?: string;
  /** User's timezone (e.g., 'America/New_York') */
  timeZone?: string;
  /** User's preferred language (e.g., 'en', 'es') */
  preferredLanguage?: string;
  /** Arbitrary JSON payload for custom user data */
  payload?: Record<string, unknown>;
  /** Custom unique identifier for the user */
  uniqueId?: string;
  /** OAuth provider (e.g., 'google', 'facebook') - for OAuth registrations */
  provider?: string;
  /** OAuth uid from the provider - for OAuth registrations */
  uid?: string;
  /** Subscription model unique_id - assigns user to a subscription/plan on registration */
  subscription?: string;
}

/**
 * Sign up response
 */
export interface SignUpResponse {
  user: User;
  accessToken?: string;
  message?: string;
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  email: string;
  redirectUrl?: string;
}

/**
 * Password update request
 */
export interface PasswordUpdateRequest {
  password: string;
  passwordConfirmation: string;
  resetPasswordToken?: string;
  currentPassword?: string;
}

/**
 * Token validation response
 */
export interface TokenValidationResponse {
  user: User;
  valid: boolean;
}

/**
 * Refresh token request
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Refresh token response
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn?: number;
}

/**
 * OAuth sign in request
 */
export interface OAuthSignInRequest {
  provider: string;
  accessToken: string;
  idToken?: string;
}

/**
 * Magic link request
 */
export interface MagicLinkRequest {
  email: string;
  redirectUrl?: string;
}

/**
 * Magic link verification
 */
export interface MagicLinkVerifyRequest {
  token: string;
}

/**
 * MFA setup response
 */
export interface MfaSetupResponse {
  secret: string;
  qrCodeUrl: string;
  backupCodes?: string[];
}

/**
 * MFA verify request
 */
export interface MfaVerifyRequest {
  code: string;
}

/**
 * Invitation request
 */
export interface InvitationRequest {
  email: string;
  roleId?: string;
  redirectUrl?: string;
}

/**
 * Accept invitation request
 */
export interface AcceptInvitationRequest {
  invitationToken: string;
  password: string;
  passwordConfirmation: string;
  name?: string;
}

/**
 * Resend confirmation email request
 */
export interface ResendConfirmationRequest {
  email: string;
  /** URL to redirect after email confirmation */
  confirmSuccessUrl: string;
}

/**
 * Email validation request (pre-registration check)
 */
export interface ValidateEmailRequest {
  email: string;
}

/**
 * Email validation response
 */
export interface ValidateEmailResponse {
  email: string | null;
  exists: boolean;
  maskedEmail: string | null;
  wellFormed: boolean;
  canRecover?: boolean;
  accountStatus?: string;
}

/**
 * Document validation request (pre-registration check)
 */
export interface ValidateDocumentRequest {
  documentType: string;
  documentNumber: string;
}

/**
 * Document validation response
 */
export interface ValidateDocumentResponse {
  documentType: string;
  documentNumber: string;
  exists: boolean;
  maskedEmail: string | null;
  maskedDocument: string | null;
  canRecover: boolean;
  accountStatus?: string;
}

/**
 * Auth headers extracted from response
 */
export interface AuthHeaders {
  accessToken: string;
  tokenType: string;
  client: string;
  expiry: string;
  uid: string;
}
