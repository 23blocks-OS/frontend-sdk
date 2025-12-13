import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

/**
 * Guest (anonymous/pre-registration user)
 */
export interface Guest extends IdentityCore {
  email: string | null;
  username: string | null;
  name: string | null;
  currentVisitingAt: Date | null;
  currentVisitingIp: string | null;
  lastVisitingAt: Date | null;
  lastVisitingIp: string | null;
  status: EntityStatus;
  registeredAt: Date | null;
  userUniqueId: string | null;
  accessToken: string | null;
}

/**
 * Magic link
 */
export interface MagicLink extends IdentityCore {
  userUniqueId: string;
  userName: string | null;
  userEmail: string | null;
  token: string;
  expiresAt: Date;
  targetUrl: string | null;
  expiredUrl: string | null;
  status: EntityStatus;
  validationUrl: string | null;
  description: string | null;
  thumbnailUrl: string | null;
  contentUrl: string | null;
  mediaUrl: string | null;
  imageUrl: string | null;
  payload: Record<string, unknown> | null;
}

/**
 * Refresh token
 */
export interface RefreshToken extends IdentityCore {
  token: string;
  expiresAt: Date;
  status: EntityStatus;
  revoked: boolean;
  scopes: string[];
  deviceId: string | null;
  userAgent: string | null;
  ipAddress: string | null;
  lastUsedAt: Date | null;

  // Computed
  expired: boolean;
  active: boolean;
  expiresInSeconds: number;
  daysUntilExpiry: number;
}

/**
 * User device
 */
export interface UserDevice extends IdentityCore {
  userUniqueId: string;
  status: EntityStatus;
  deviceType: string | null;
  pushId: string | null;
  osType: string | null;
  defaultDevice: boolean;
  locationEnabled: boolean;
  notificationsEnabled: boolean;
}

/**
 * Tenant user context
 */
export interface TenantUser {
  gatewayUrl: string;
  userId: string;
  userUniqueId: string;
  userEmail: string | null;
  userName: string | null;
  roleUniqueId: string | null;
  roleName: string | null;
  roleId: string | null;
  tenantId: string;
  tenantUniqueId: string;
  tenantAccessKey: string;
  tenantUrlId: string;
  payload: Record<string, unknown> | null;
  onboardingCompleted: boolean;
  purchaseCompleted: boolean;
  parentOnboardingCompleted: boolean;
  parentPurchaseCompleted: boolean;
}

/**
 * Mail template
 */
export interface MailTemplate extends IdentityCore {
  eventName: string;
  name: string;
  source: string | null;
  sourceAlias: string | null;
  sourceId: string | null;
  sourceType: string | null;
  templateName: string | null;
  templateHtml: string | null;
  templateText: string | null;
  fromDomain: string | null;
  fromAddress: string | null;
  fromName: string | null;
  fromSubject: string | null;
  payload: Record<string, unknown> | null;
  preferredLanguage: string | null;
  status: EntityStatus;
  provider: string | null;
}

/**
 * Create magic link request
 */
export interface CreateMagicLinkRequest {
  userUniqueId?: string;
  email?: string;
  targetUrl?: string;
  expiredUrl?: string;
  expiresInHours?: number;
  description?: string;
  payload?: Record<string, unknown>;
}

/**
 * Register device request
 */
export interface RegisterDeviceRequest {
  deviceType: string;
  pushId: string;
  osType?: string;
  defaultDevice?: boolean;
  locationEnabled?: boolean;
  notificationsEnabled?: boolean;
}
