import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  RegistrationToken,
  CreateRegistrationTokenRequest,
  UpdateRegistrationTokenRequest,
  ListRegistrationTokensParams,
  TokenValidationResult,
} from '../types/registration-token';
import { registrationTokenMapper } from '../mappers/registration-token.mapper';

/**
 * Registration Tokens Service - Manage enrollment tokens
 */
export interface RegistrationTokensService {
  /**
   * List all registration tokens
   */
  list(params?: ListRegistrationTokensParams): Promise<PageResult<RegistrationToken>>;

  /**
   * Get a specific registration token
   */
  get(uniqueId: string): Promise<RegistrationToken>;

  /**
   * Create a new registration token
   */
  create(data: CreateRegistrationTokenRequest): Promise<RegistrationToken>;

  /**
   * Update a registration token
   */
  update(uniqueId: string, data: UpdateRegistrationTokenRequest): Promise<RegistrationToken>;

  /**
   * Delete a registration token
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Validate a token code
   */
  validate(tokenCode: string): Promise<TokenValidationResult>;

  /**
   * Use a token to register a user
   */
  use(tokenCode: string, userUniqueId: string): Promise<{
    success: boolean;
    enrollmentUniqueId?: string;
    error?: string;
  }>;

  /**
   * Revoke a registration token
   */
  revoke(uniqueId: string): Promise<RegistrationToken>;

  /**
   * Generate a batch of tokens
   */
  generateBatch(request: CreateRegistrationTokenRequest & { count: number }): Promise<RegistrationToken[]>;
}

/**
 * Create the Registration Tokens service
 */
export function createRegistrationTokensService(
  transport: Transport,
  _config: { appId: string }
): RegistrationTokensService {
  return {
    async list(params?: ListRegistrationTokensParams): Promise<PageResult<RegistrationToken>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.courseUniqueId) queryParams['course_unique_id'] = params.courseUniqueId;
      if (params?.courseGroupUniqueId) queryParams['course_group_unique_id'] = params.courseGroupUniqueId;
      if (params?.userRole) queryParams['user_role'] = params.userRole;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/tokens', { params: queryParams });
      return decodePageResult(response, registrationTokenMapper);
    },

    async get(uniqueId: string): Promise<RegistrationToken> {
      const response = await transport.get<unknown>(`/tokens/${uniqueId}`);
      return decodeOne(response, registrationTokenMapper);
    },

    async create(data: CreateRegistrationTokenRequest): Promise<RegistrationToken> {
      const response = await transport.post<unknown>('/tokens', {
        registration_token: {
          course_unique_id: data.courseUniqueId,
          course_group_unique_id: data.courseGroupUniqueId,
          user_role: data.userRole,
          max_uses: data.maxUses,
          expires_at: data.expiresAt,
          metadata: data.metadata,
        },
      });
      return decodeOne(response, registrationTokenMapper);
    },

    async update(uniqueId: string, data: UpdateRegistrationTokenRequest): Promise<RegistrationToken> {
      const response = await transport.put<unknown>(`/tokens/${uniqueId}`, {
        registration_token: {
          max_uses: data.maxUses,
          expires_at: data.expiresAt,
          metadata: data.metadata,
          enabled: data.enabled,
          status: data.status,
        },
      });
      return decodeOne(response, registrationTokenMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/tokens/${uniqueId}`);
    },

    async validate(tokenCode: string): Promise<TokenValidationResult> {
      try {
        const response = await transport.post<{
          valid: boolean;
          data?: unknown;
          error?: string;
        }>('/tokens/validate', { token: tokenCode });

        return {
          valid: response.valid,
          token: response.data ? registrationTokenMapper.map(response.data as Parameters<typeof registrationTokenMapper.map>[0]) : undefined,
          error: response.error,
        };
      } catch {
        return {
          valid: false,
          error: 'Token validation failed',
        };
      }
    },

    async use(tokenCode: string, userUniqueId: string): Promise<{
      success: boolean;
      enrollmentUniqueId?: string;
      error?: string;
    }> {
      const response = await transport.post<{
        success: boolean;
        enrollment_unique_id?: string;
        error?: string;
      }>('/tokens/use', {
        token: tokenCode,
        user_unique_id: userUniqueId,
      });

      return {
        success: response.success,
        enrollmentUniqueId: response.enrollment_unique_id,
        error: response.error,
      };
    },

    async revoke(uniqueId: string): Promise<RegistrationToken> {
      const response = await transport.put<unknown>(`/tokens/${uniqueId}/revoke`, {});
      return decodeOne(response, registrationTokenMapper);
    },

    async generateBatch(request: CreateRegistrationTokenRequest & { count: number }): Promise<RegistrationToken[]> {
      const response = await transport.post<{ data: unknown[] }>('/tokens/batch', {
        registration_token: {
          course_unique_id: request.courseUniqueId,
          course_group_unique_id: request.courseGroupUniqueId,
          user_role: request.userRole,
          max_uses: request.maxUses,
          expires_at: request.expiresAt,
          metadata: request.metadata,
          count: request.count,
        },
      });
      return (response.data ?? []).map((item) =>
        registrationTokenMapper.map(item as Parameters<typeof registrationTokenMapper.map>[0])
      );
    },
  };
}
