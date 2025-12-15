import type { Company } from './company.js';

/**
 * Tenant User
 */
export interface TenantUser {
  id: string;
  uniqueId: string;
  userUniqueId: string;
  userId: string;
  userName: string;
  userEmail: string;
  gatewayUrl?: string;
  tenantId: string;
  tenantUniqueId: string;
  tenantAccessKey: string;
  tenantUrlId: string;
  roleUniqueId?: string;
  roleName?: string;
  roleId?: string;
  parentOnboardingCompleted?: boolean;
  parentPurchaseCompleted?: boolean;
  onboardingCompleted?: boolean;
  purchaseCompleted?: boolean;
  payload?: Record<string, unknown>;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Create Tenant User Request
 */
export interface CreateTenantUserRequest {
  parentAppId: string;
  appId: string;
  id: string;
  email: string;
  name: string;
  roleUniqueId?: string;
  roleName?: string;
  roleId?: string;
  payload?: Record<string, unknown>;
}

/**
 * Validate Tenant Code Request
 */
export interface ValidateTenantCodeRequest {
  code: string;
}

/**
 * Validate Tenant Code Response
 */
export interface ValidateTenantCodeResponse {
  status: 'available' | 'taken';
  suggestedCode?: string;
}

/**
 * Search Tenant Request
 */
export interface SearchTenantRequest {
  name?: string;
  code?: string;
}

/**
 * Update Tenant User Onboarding Request
 */
export interface UpdateTenantUserOnboardingRequest {
  onboardingCompleted?: boolean;
  payload?: Record<string, unknown>;
}

/**
 * Update Tenant User Sales Request
 */
export interface UpdateTenantUserSalesRequest {
  purchaseCompleted?: boolean;
  payload?: Record<string, unknown>;
}

/**
 * Resend Invitation Request
 */
export interface ResendInvitationRequest {
  email: string;
  appid: string;
  acceptInvitationUrl?: string;
}
