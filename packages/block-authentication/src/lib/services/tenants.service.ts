import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Company,
  TenantUserFull,
  CreateTenantUserRequest,
  ValidateTenantCodeRequest,
  ValidateTenantCodeResponse,
  SearchTenantRequest,
  UpdateTenantUserOnboardingRequest,
  UpdateTenantUserSalesRequest,
} from '../types/index.js';
import type { ListParams } from '@23blocks/contracts';
import { companyMapper } from '../mappers/index.js';

// Tenant user mapper
const tenantUserMapper = {
  type: 'tenant_user',
  map: (data: Record<string, unknown>): TenantUserFull => ({
    id: String(data['id'] ?? ''),
    uniqueId: String(data['unique_id'] ?? ''),
    userUniqueId: String(data['user_unique_id'] ?? ''),
    userId: String(data['user_id'] ?? ''),
    userName: String(data['user_name'] ?? ''),
    userEmail: String(data['user_email'] ?? ''),
    gatewayUrl: data['gateway_url'] as string | undefined,
    tenantId: String(data['tenant_id'] ?? ''),
    tenantUniqueId: String(data['tenant_unique_id'] ?? ''),
    tenantAccessKey: String(data['tenant_access_key'] ?? ''),
    tenantUrlId: String(data['tenant_url_id'] ?? ''),
    roleUniqueId: data['role_unique_id'] as string | undefined,
    roleName: data['role_name'] as string | undefined,
    roleId: data['role_id'] as string | undefined,
    parentOnboardingCompleted: data['parent_onboarding_completed'] as boolean | undefined,
    parentPurchaseCompleted: data['parent_purchase_completed'] as boolean | undefined,
    onboardingCompleted: data['onboarding_completed'] as boolean | undefined,
    purchaseCompleted: data['purchase_completed'] as boolean | undefined,
    payload: data['payload'] as Record<string, unknown> | undefined,
    status: data['status'] as string | undefined,
    createdAt: data['created_at'] as string | undefined,
    updatedAt: data['updated_at'] as string | undefined,
  }),
};

/**
 * Tenants Service Interface
 */
export interface TenantsService {
  /**
   * List child tenants
   */
  listChildren(params?: ListParams): Promise<PageResult<Company>>;

  /**
   * Validate tenant code availability
   */
  validateCode(request: ValidateTenantCodeRequest): Promise<ValidateTenantCodeResponse>;

  /**
   * Search for a tenant by name
   */
  searchByName(request: SearchTenantRequest): Promise<Company>;

  /**
   * Search for a tenant by code
   */
  searchByCode(request: SearchTenantRequest): Promise<Company>;

  /**
   * Create a tenant user relationship
   */
  createTenantUser(userUniqueId: string, request: CreateTenantUserRequest): Promise<TenantUserFull>;

  /**
   * Update tenant user onboarding status
   */
  updateOnboarding(
    userUniqueId: string,
    urlId: string,
    request: UpdateTenantUserOnboardingRequest
  ): Promise<TenantUserFull>;

  /**
   * Update tenant user sales/purchase status
   */
  updateSales(
    userUniqueId: string,
    urlId: string,
    request: UpdateTenantUserSalesRequest
  ): Promise<TenantUserFull>;
}

/**
 * Create the Tenants service
 */
export function createTenantsService(transport: Transport): TenantsService {
  return {
    async listChildren(params?: ListParams): Promise<PageResult<Company>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.search) queryParams['search'] = params.search;

      const response = await transport.get<unknown>('/auth/tenant/children', { params: queryParams });
      return decodePageResult(response, companyMapper);
    },

    async validateCode(request: ValidateTenantCodeRequest): Promise<ValidateTenantCodeResponse> {
      try {
        await transport.post<unknown>('/auth/tenant/validate', {
          company: {
            code: request.code,
          },
        });
        return { status: 'available' };
      } catch (error: unknown) {
        // API returns error with suggested code if taken
        const err = error as { meta?: { suggestedCode?: string } };
        return {
          status: 'taken',
          suggestedCode: err.meta?.suggestedCode,
        };
      }
    },

    async searchByName(request: SearchTenantRequest): Promise<Company> {
      const response = await transport.post<unknown>('/auth/tenant/search', {
        tenant: {
          name: request.name,
        },
      });
      return decodeOne(response, companyMapper);
    },

    async searchByCode(request: SearchTenantRequest): Promise<Company> {
      const response = await transport.post<unknown>('/auth/tenant/search/code', {
        tenant: {
          code: request.code,
        },
      });
      return decodeOne(response, companyMapper);
    },

    async createTenantUser(userUniqueId: string, request: CreateTenantUserRequest): Promise<TenantUserFull> {
      const response = await transport.post<unknown>(`/users/${userUniqueId}/tenant`, {
        user: {
          parent_app_id: request.parentAppId,
          app_id: request.appId,
          id: request.id,
          email: request.email,
          name: request.name,
          role_unique_id: request.roleUniqueId,
          role_name: request.roleName,
          role_id: request.roleId,
          payload: request.payload,
        },
      });
      return decodeOne(response, tenantUserMapper);
    },

    async updateOnboarding(
      userUniqueId: string,
      urlId: string,
      request: UpdateTenantUserOnboardingRequest
    ): Promise<TenantUserFull> {
      const response = await transport.put<unknown>(`/users/${userUniqueId}/tenant/${urlId}/onboarding`, {
        tenant_user: {
          onboarding_completed: request.onboardingCompleted,
          payload: request.payload,
        },
      });
      return decodeOne(response, tenantUserMapper);
    },

    async updateSales(
      userUniqueId: string,
      urlId: string,
      request: UpdateTenantUserSalesRequest
    ): Promise<TenantUserFull> {
      const response = await transport.put<unknown>(`/users/${userUniqueId}/tenant/${urlId}/sales`, {
        tenant_user: {
          purchase_completed: request.purchaseCompleted,
          payload: request.payload,
        },
      });
      return decodeOne(response, tenantUserMapper);
    },
  };
}
