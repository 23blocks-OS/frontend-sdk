/**
 * OAuth Social Login Request (Facebook/Google)
 */
export interface OAuthSocialLoginRequest {
  token: string;
  subscription?: string;
  /** When true, sends X-OAuth-Mode header to return an OAuth 2.0 token pair (access + refresh tokens). */
  oauthMode?: boolean;
}

/**
 * Tenant Login Request
 */
export interface TenantLoginRequest {
  email: string;
  password: string;
}

/**
 * Token Introspection Response
 */
export interface TokenIntrospectionResponse {
  active: boolean;
  userUniqueId?: string;
  userRoleId?: string;
  companyId?: string;
  scopes?: string[];
  expiresAt?: string;
  issuedAt?: string;
  issuer?: string;
  appId?: string;
  appName?: string;
  error?: string;
}

/**
 * Token Revoke Request
 */
export interface TokenRevokeRequest {
  token: string;
  tokenTypeHint?: 'refresh_token' | 'access_token';
}

/**
 * Token Revoke All Request
 */
export interface TokenRevokeAllRequest {
  userUniqueId: string;
  deviceId?: string;
}

/**
 * Token Revoke Response
 */
export interface TokenRevokeResponse {
  revoked: boolean;
  message?: string;
  revokedAt?: string;
}

/**
 * Tenant Context Create Request
 */
export interface TenantContextCreateRequest {
  companyUrlId?: string;
  companyId?: string;
  switchReason?: string;
}

/**
 * Tenant Info
 */
export interface TenantInfo {
  companyId: string;
  companyName: string;
  companyUrlId: string;
  roleId: number;
  roleName: string;
  permissions: string[];
  schemaName: string;
}

/**
 * Tenant Context Response
 */
export interface TenantContextResponse {
  tenantContextToken: string;
  expiresIn: number;
  expiresAt: string;
  tenantInfo: TenantInfo;
  auditId: number;
}

/**
 * Tenant Context Revoke Request
 */
export interface TenantContextRevokeRequest {
  tenantContextTokenId: string;
}

/**
 * Tenant Context Audit Entry
 */
export interface TenantContextAuditEntry {
  id: number;
  companyName: string;
  companyUrlId: string;
  switchReason: string;
  createdAt: string;
  expiresAt: string;
  revoked: boolean;
  revokedAt: string | null;
  ipAddress: string;
  active: boolean;
}

/**
 * Device Authorization Request (RFC 8628)
 */
export interface DeviceAuthorizationRequest {
  /** Free-text identifier of the requesting client (logged, not validated). */
  clientId?: string;
  scope?: string;
}

/**
 * Device Authorization Response (RFC 8628)
 */
export interface DeviceAuthorizationResponse {
  deviceCode: string;
  userCode: string;
  verificationUri: string;
  verificationUriComplete?: string;
  /** Seconds until the device and user codes expire. */
  expiresIn: number;
  /** Minimum seconds to wait between token polls. */
  interval: number;
}

/**
 * Device Verification Request - sent by the signed-in user approving the device.
 */
export interface DeviceVerificationRequest {
  userCode: string;
}

/**
 * Device Verification Response
 */
export interface DeviceVerificationResponse {
  status: string;
}

/**
 * Device Token Poll Request
 */
export interface DeviceTokenPollRequest {
  deviceCode: string;
  clientId?: string;
  /** Polling interval in seconds (from the authorize response). Defaults to 5. */
  interval?: number;
  /** Seconds until the device code expires (from the authorize response). */
  expiresIn?: number;
  /** Abort polling. */
  signal?: AbortSignal;
}

/**
 * Device Token Response
 */
export interface DeviceTokenResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn?: number;
}
