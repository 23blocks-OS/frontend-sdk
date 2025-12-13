import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

/**
 * Application (OAuth client)
 */
export interface App extends IdentityCore {
  name: string;
  description: string | null;
  appType: string;
  status: EntityStatus;
  appIcon: string | null;

  // OAuth settings
  oauthEnabled: boolean;
  oauthAccessTokenLifetimeHours: number;
  oauthRefreshTokenLifetimeDays: number;
  oauthRefreshTokenRotation: boolean;
  oauthMaxRefreshTokensPerDevice: number;
  oauthDeviceManagement: boolean;

  // Rate limiting
  rateLimitPerMinute: number | null;
  rateLimitPerHour: number | null;

  // Webhooks
  webhookUrl: string | null;
  webhookSecret: string | null;

  // Configuration
  allowedOrigins: string[];
  metadata: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;

  // Computed
  apiKeyCount: number;
  activeApiKeyCount: number;
}

/**
 * Block (company feature subscription)
 */
export interface Block extends IdentityCore {
  companyUniqueId: string;
  blockUniqueId: string;
  blockCode: string;
  blockName: string;
  addedAt: Date | null;
  status: EntityStatus;
  subscriptionModel: string | null;
  subscriptionPlan: string | null;
  subscriptionFee: number | null;
  subscriptionTaxes: number | null;
  subscriptionTotal: number | null;
  lastPaymentAt: Date | null;
  nextPaymentAt: Date | null;
  payload: Record<string, unknown> | null;
}

/**
 * Service (microservice registry entry)
 */
export interface Service extends IdentityCore {
  name: string;
  code: string;
  description: string | null;
  homePageUrl: string | null;
  healthCheckUrl: string | null;
  statusPageUrl: string | null;
  status: EntityStatus;
  registeredAt: Date | null;
  host: string | null;
  port: number | null;
  uri: string | null;
  groupName: string | null;
  ipaddress: string | null;
}

/**
 * Create app request
 */
export interface CreateAppRequest {
  name: string;
  description?: string;
  appType?: string;
  oauthEnabled?: boolean;
  oauthAccessTokenLifetimeHours?: number;
  oauthRefreshTokenLifetimeDays?: number;
  rateLimitPerMinute?: number;
  rateLimitPerHour?: number;
  webhookUrl?: string;
  allowedOrigins?: string[];
  metadata?: Record<string, unknown>;
}

/**
 * Update app request
 */
export interface UpdateAppRequest extends Partial<CreateAppRequest> {
  status?: string;
}
