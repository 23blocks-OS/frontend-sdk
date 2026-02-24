import type { Transport, PageResult, ListParams } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ServiceToken,
  ServiceTokenWithJwt,
  CreateServiceTokenRequest,
} from '../types/index.js';
import { serviceTokenMapper, serviceTokenWithJwtMapper } from '../mappers/index.js';
import type { AuthenticationBlockConfig } from '../authentication.block.js';

/**
 * Service Tokens service - create and manage machine-to-machine authentication tokens.
 *
 * Supports two token categories:
 * - `agent` — Short-lived tokens (1-24h) for AI agents
 * - `service` — Long-lived tokens (30-365 days) for block-to-block communication
 *
 * @note `create()` and `regenerate()` return `ServiceTokenWithJwt` which includes the JWT.
 *   The JWT is only available at creation/regeneration time and cannot be retrieved later.
 */
export interface ServiceTokensService {
  /**
   * List all service tokens
   */
  list(params?: ListParams): Promise<PageResult<ServiceToken>>;

  /**
   * Get a service token by unique ID
   */
  get(uniqueId: string): Promise<ServiceToken>;

  /**
   * Create a new service token (returns JWT only once)
   */
  create(request: CreateServiceTokenRequest): Promise<ServiceTokenWithJwt>;

  /**
   * Revoke (soft delete) a service token
   */
  revoke(uniqueId: string): Promise<void>;

  /**
   * Regenerate a service token's JWT (returns new JWT only once)
   */
  regenerate(uniqueId: string): Promise<ServiceTokenWithJwt>;
}

/**
 * Create the service tokens service
 */
export function createServiceTokensService(
  transport: Transport,
  _config: AuthenticationBlockConfig
): ServiceTokensService {
  return {
    async list(params?: ListParams): Promise<PageResult<ServiceToken>> {
      const queryParams: Record<string, unknown> = {};

      if (params?.page) queryParams['page'] = params.page;
      if (params?.perPage) queryParams['records'] = params.perPage;
      if (params?.filter) {
        for (const [key, value] of Object.entries(params.filter)) {
          queryParams[`filter[${key}]`] = value;
        }
      }

      const response = await transport.get<{ data: unknown[]; meta?: unknown }>(
        '/service_tokens',
        { params: queryParams as Record<string, string> }
      );
      return decodePageResult(response, serviceTokenMapper);
    },

    async get(uniqueId: string): Promise<ServiceToken> {
      const response = await transport.get<{ data: unknown }>(
        `/service_tokens/${uniqueId}`
      );
      return decodeOne(response, serviceTokenMapper);
    },

    async create(request: CreateServiceTokenRequest): Promise<ServiceTokenWithJwt> {
      const response = await transport.post<{ data: unknown }>(
        '/service_tokens',
        {
          service_token: {
            name: request.name,
            token_category: request.tokenCategory,
            scopes: request.scopes,
            expires_in_days: request.expiresInDays,
          },
        }
      );
      return decodeOne(response, serviceTokenWithJwtMapper);
    },

    async revoke(uniqueId: string): Promise<void> {
      await transport.delete(`/service_tokens/${uniqueId}`);
    },

    async regenerate(uniqueId: string): Promise<ServiceTokenWithJwt> {
      const response = await transport.post<{ data: unknown }>(
        `/service_tokens/${uniqueId}/regenerate`
      );
      return decodeOne(response, serviceTokenWithJwtMapper);
    },
  };
}
