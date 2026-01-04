import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

/**
 * Registration token for university/course enrollment
 */
export interface RegistrationToken extends IdentityCore {
  token: string;
  courseUniqueId?: string;
  courseGroupUniqueId?: string;
  userRole: 'student' | 'teacher' | 'admin';
  maxUses?: number;
  usedCount: number;
  expiresAt?: Date;
  createdByUniqueId?: string;
  metadata?: Record<string, unknown>;
  status: EntityStatus;
  enabled: boolean;
}

/**
 * Create registration token request
 */
export interface CreateRegistrationTokenRequest {
  courseUniqueId?: string;
  courseGroupUniqueId?: string;
  userRole: 'student' | 'teacher' | 'admin';
  maxUses?: number;
  expiresAt?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Update registration token request
 */
export interface UpdateRegistrationTokenRequest {
  maxUses?: number;
  expiresAt?: string;
  metadata?: Record<string, unknown>;
  enabled?: boolean;
  status?: EntityStatus;
}

/**
 * List registration tokens params
 */
export interface ListRegistrationTokensParams {
  page?: number;
  perPage?: number;
  courseUniqueId?: string;
  courseGroupUniqueId?: string;
  userRole?: 'student' | 'teacher' | 'admin';
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Token validation result
 */
export interface TokenValidationResult {
  valid: boolean;
  token?: RegistrationToken;
  error?: string;
}
