/**
 * OAuth Social Login Request (Facebook/Google)
 */
export interface OAuthSocialLoginRequest {
  token: string;
  subscription?: string;
  roleId?: string;
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
