import type { Transport, PageResult, ListParams } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ApiKey,
  ApiKeyWithSecret,
  CreateApiKeyRequest,
  UpdateApiKeyRequest,
  RevokeApiKeyRequest,
} from '../types/index.js';
import { apiKeyMapper, apiKeyWithSecretMapper } from '../mappers/index.js';
import type { AuthenticationBlockConfig } from '../authentication.block.js';

/**
 * API Keys service
 */
export interface ApiKeysService {
  /**
   * List all API keys
   */
  list(params?: ListParams): Promise<PageResult<ApiKey>>;

  /**
   * Get an API key by ID
   */
  get(id: string): Promise<ApiKey>;

  /**
   * Get an API key by key ID
   */
  getByKeyId(keyId: string): Promise<ApiKey>;

  /**
   * Create a new API key (returns secret key only once)
   */
  create(request: CreateApiKeyRequest): Promise<ApiKeyWithSecret>;

  /**
   * Update an API key
   */
  update(id: string, request: UpdateApiKeyRequest): Promise<ApiKey>;

  /**
   * Regenerate an API key secret (returns new secret only once)
   */
  regenerate(id: string): Promise<ApiKeyWithSecret>;

  /**
   * Revoke an API key
   */
  revoke(id: string, request?: RevokeApiKeyRequest): Promise<ApiKey>;

  /**
   * Delete an API key permanently
   */
  delete(id: string): Promise<void>;

  /**
   * Get usage statistics for an API key
   */
  getUsage(id: string, period?: 'day' | 'week' | 'month'): Promise<ApiKeyUsageStats>;
}

/**
 * API Key usage statistics
 */
export interface ApiKeyUsageStats {
  apiKeyId: string;
  period: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatency: number;
  requestsByEndpoint: Record<string, number>;
  requestsByDay: Array<{ date: string; count: number }>;
}

/**
 * Create the API keys service
 */
export function createApiKeysService(
  transport: Transport,
  _config: AuthenticationBlockConfig
): ApiKeysService {
  return {
    async list(params?: ListParams): Promise<PageResult<ApiKey>> {
      const queryParams: Record<string, unknown> = {};

      if (params?.page) queryParams['page[number]'] = params.page;
      if (params?.perPage) queryParams['page[size]'] = params.perPage;
      if (params?.filter) {
        for (const [key, value] of Object.entries(params.filter)) {
          queryParams[`filter[${key}]`] = value;
        }
      }

      const response = await transport.get<{ data: unknown[]; meta?: unknown }>(
        '/api_keys',
        { params: queryParams as Record<string, string> }
      );
      return decodePageResult(response, apiKeyMapper);
    },

    async get(id: string): Promise<ApiKey> {
      const response = await transport.get<{ data: unknown }>(
        `/api_keys/${id}`
      );
      return decodeOne(response, apiKeyMapper);
    },

    async getByKeyId(keyId: string): Promise<ApiKey> {
      const response = await transport.get<{ data: unknown }>(
        `/api_keys/by_key_id/${keyId}`
      );
      return decodeOne(response, apiKeyMapper);
    },

    async create(request: CreateApiKeyRequest): Promise<ApiKeyWithSecret> {
      const response = await transport.post<{ data: unknown }>(
        '/api_keys',
        {
          api_key: {
            name: request.name,
            description: request.description,
            service_account: request.serviceAccount,
            scopes: request.scopes,
            expires_at: request.expiresAt,
            rate_limit_per_minute: request.rateLimitPerMinute,
            rate_limit_per_hour: request.rateLimitPerHour,
            rate_limit_per_day: request.rateLimitPerDay,
            allowed_origins: request.allowedOrigins,
            allowed_ips: request.allowedIps,
            payload: request.payload,
          },
        }
      );
      return decodeOne(response, apiKeyWithSecretMapper);
    },

    async update(id: string, request: UpdateApiKeyRequest): Promise<ApiKey> {
      const response = await transport.patch<{ data: unknown }>(
        `/api_keys/${id}`,
        {
          api_key: {
            name: request.name,
            description: request.description,
            scopes: request.scopes,
            rate_limit_per_minute: request.rateLimitPerMinute,
            rate_limit_per_hour: request.rateLimitPerHour,
            rate_limit_per_day: request.rateLimitPerDay,
            allowed_origins: request.allowedOrigins,
            allowed_ips: request.allowedIps,
            payload: request.payload,
          },
        }
      );
      return decodeOne(response, apiKeyMapper);
    },

    async regenerate(id: string): Promise<ApiKeyWithSecret> {
      const response = await transport.post<{ data: unknown }>(
        `/api_keys/${id}/regenerate`
      );
      return decodeOne(response, apiKeyWithSecretMapper);
    },

    async revoke(id: string, request?: RevokeApiKeyRequest): Promise<ApiKey> {
      const response = await transport.post<{ data: unknown }>(
        `/api_keys/${id}/revoke`,
        { reason: request?.reason }
      );
      return decodeOne(response, apiKeyMapper);
    },

    async delete(id: string): Promise<void> {
      await transport.delete(`/api_keys/${id}`);
    },

    async getUsage(id: string, period: 'day' | 'week' | 'month' = 'week'): Promise<ApiKeyUsageStats> {
      const response = await transport.get<{
        data: {
          attributes: {
            api_key_id: string;
            period: string;
            total_requests: number;
            successful_requests: number;
            failed_requests: number;
            average_latency: number;
            requests_by_endpoint: Record<string, number>;
            requests_by_day: Array<{ date: string; count: number }>;
          };
        };
      }>(`/api_keys/${id}/usage`, { params: { period } });

      const attrs = response.data.attributes;
      return {
        apiKeyId: attrs.api_key_id,
        period: attrs.period,
        totalRequests: attrs.total_requests,
        successfulRequests: attrs.successful_requests,
        failedRequests: attrs.failed_requests,
        averageLatency: attrs.average_latency,
        requestsByEndpoint: attrs.requests_by_endpoint,
        requestsByDay: attrs.requests_by_day,
      };
    },
  };
}
