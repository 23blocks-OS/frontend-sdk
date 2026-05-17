import type { User } from './user.js';

/**
 * Sign in request
 */
export interface SignInRequest {
  email: string;
  password: string;
}

/**
 * Sign in response - returned by signIn, verifyMagicLink, acceptInvitation, and social login methods.
 *
 * @note The `user` object includes relationships only if the server returns included resources.
 *   For guaranteed relationship loading, call `auth.getCurrentUser()` after sign-in.
 */
export interface SignInResponse {
  /** The authenticated user. Relationships (role, avatar, profile) may or may not be populated. */
  user: User;
  /** JWT access token for authenticating subsequent requests. */
  accessToken: string;
  /** Refresh token for obtaining new access tokens (if refresh tokens are enabled). */
  refreshToken?: string;
  /** Always 'Bearer'. */
  tokenType: string;
  /** Token lifetime in seconds (if provided by the server). */
  expiresIn?: number;
}

/**
 * Sign up request
 */
export interface SignUpRequest {
  email: string;
  password: string;
  passwordConfirmation: string;
  name?: string;
  username?: string;
  roleId?: string;
  /** URL to redirect after email confirmation (required if email confirmation is enabled and no server default is set) */
  confirmSuccessUrl?: string;
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
 * Sign up response.
 *
 * @note If email confirmation is required, `accessToken` will be undefined.
 *   The user must confirm their email before they can sign in.
 */
export interface SignUpResponse {
  /** The newly created user. */
  user: User;
  /** Access token (only present if email confirmation is NOT required). */
  accessToken?: string;
  /** Server message (e.g., 'Confirmation email sent'). */
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
 * OTP-based password reset request (mobile flow).
 * Sends a 6-digit OTP code to the user's email.
 */
export interface PasswordOtpRequest {
  email: string;
}

/**
 * OTP-based password reset response.
 */
export interface PasswordOtpResponse {
  status: string;
  emailHint: string;
  expiresIn: number;
  message: string;
}

/**
 * OTP verification request for password reset.
 * Returns a scoped JWT (`password:reset`) that can be used with `updatePassword()`.
 */
export interface PasswordOtpVerifyRequest {
  email: string;
  code: string;
}

/**
 * Token validation response.
 *
 * @note The `user` object does NOT include relationships (role, avatar, profile).
 *   Use `auth.getCurrentUser()` for user data with relationships.
 */
export interface TokenValidationResponse {
  /** The authenticated user (without relationships). */
  user: User;
  /** Always `true` if the request succeeds (throws on invalid token). */
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
  /** URL to redirect after email confirmation (defaults to '#' if not provided) */
  confirmSuccessUrl?: string;
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
 * Passwordless login request — sends a 6-digit OTP to the user's email.
 */
export interface PasswordlessRequest {
  email: string;
}

/**
 * Passwordless login response (always 200 for anti-enumeration).
 */
export interface PasswordlessResponse {
  status: string;
  emailHint: string;
  expiresIn: number;
}

/**
 * Passwordless OTP verification request.
 * If MFA is enabled, include mfaCode or backupCode on the second attempt.
 */
export interface PasswordlessVerifyRequest {
  email: string;
  code: string;
  mfaCode?: string;
  backupCode?: string;
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
