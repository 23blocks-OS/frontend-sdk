import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

/**
 * Company entity
 */
export interface Company extends IdentityCore {
  name: string;
  code: string;
  preferredLanguage: string | null;
  preferredDomain: string | null;
  apiUrl: string | null;
  apiAccessKey: string | null;
  payload: Record<string, unknown> | null;
  status: EntityStatus;
  publicStorageUrl: string | null;
  storageUrl: string | null;

  // Conditional attributes (admin only)
  schemaName?: string;
  urlId?: string;
  slackHook?: string;
  slackChannel?: string;
  slackUsername?: string;
  openAccess?: boolean;

  // Relationships
  companyDetail?: CompanyDetail | null;
  companyBlocks?: CompanyBlock[];
  companyKeys?: CompanyKey[];
}

/**
 * Company detail
 */
export interface CompanyDetail extends IdentityCore {
  companyUniqueId: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zipcode: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  description: string | null;
  logoUrl: string | null;
  payload: Record<string, unknown> | null;
}

/**
 * Company block (enabled features)
 */
export interface CompanyBlock extends IdentityCore {
  companyUniqueId: string;
  blockId: string;
  blockName: string;
  status: EntityStatus;
  payload: Record<string, unknown> | null;
}

/**
 * Company API key
 */
export interface CompanyKey extends IdentityCore {
  companyUniqueId: string;
  name: string;
  keyId: string;
  status: EntityStatus;
  expiresAt: Date | null;
  lastUsedAt: Date | null;
}

/**
 * Tenant context for multi-tenant operations
 */
export interface Tenant {
  gatewayUrl: string;
  tenantAccessKey: string;
  tenantUrlId: string;
  payload: Record<string, unknown> | null;
}
