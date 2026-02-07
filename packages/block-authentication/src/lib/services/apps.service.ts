import type { Transport, PageResult, ListParams } from '@23blocks/contracts';
import type { JsonApiDocument } from '@23blocks/jsonapi-codec';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type { App, Block, Service, CreateAppRequest, UpdateAppRequest } from '../types/index.js';
import { appMapper, blockMapper, serviceMapper } from '../mappers/index.js';
import type { AuthenticationBlockConfig } from '../authentication.block.js';

/**
 * Apps service interface
 */
export interface AppsService {
  /**
   * List apps with pagination
   */
  list(params?: ListParams): Promise<PageResult<App>>;

  /**
   * Get an app by unique ID
   */
  get(uniqueId: string): Promise<App>;

  /**
   * Create a new app
   */
  create(request: CreateAppRequest): Promise<App>;

  /**
   * Update an app
   */
  update(uniqueId: string, request: UpdateAppRequest): Promise<App>;

  /**
   * Delete an app
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Regenerate webhook secret
   */
  regenerateWebhookSecret(uniqueId: string): Promise<App>;
}

/**
 * Blocks service interface
 */
export interface BlocksService {
  /**
   * List blocks for a company
   */
  list(companyUniqueId: string, params?: ListParams): Promise<PageResult<Block>>;

  /**
   * Get a block by unique ID
   */
  get(uniqueId: string): Promise<Block>;

  /**
   * Add a block to a company
   */
  add(companyUniqueId: string, blockCode: string): Promise<Block>;

  /**
   * Remove a block from a company
   */
  remove(uniqueId: string): Promise<void>;
}

/**
 * Services registry service interface
 */
export interface ServicesRegistryService {
  /**
   * List registered services
   */
  list(params?: ListParams): Promise<PageResult<Service>>;

  /**
   * Get a service by unique ID
   */
  get(uniqueId: string): Promise<Service>;

  /**
   * Get a service by code
   */
  getByCode(code: string): Promise<Service>;

  /**
   * Health check all services
   */
  healthCheck(): Promise<Service[]>;
}

/**
 * Build filter params for list operations
 */
function buildListParams(params?: ListParams): Record<string, string | number | boolean | string[] | undefined> {
  if (!params) return {};

  const queryParams: Record<string, string | number | boolean | string[] | undefined> = {};

  if (params.page) {
    queryParams['page'] = params.page;
  }
  if (params.perPage) {
    queryParams['records'] = params.perPage;
  }

  if (params.sort) {
    const sorts = Array.isArray(params.sort) ? params.sort : [params.sort];
    queryParams['sort'] = sorts
      .map((s) => (s.direction === 'desc' ? `-${s.field}` : s.field))
      .join(',');
  }

  if (params.filter) {
    for (const [key, value] of Object.entries(params.filter)) {
      queryParams[`filter[${key}]`] = value;
    }
  }

  if (params.include) {
    queryParams['include'] = params.include.join(',');
  }

  return queryParams;
}

/**
 * Create the apps service
 */
export function createAppsService(
  transport: Transport,
  _config: AuthenticationBlockConfig
): AppsService {
  return {
    async list(params?: ListParams): Promise<PageResult<App>> {
      const response = await transport.get<JsonApiDocument>(
        '/apps',
        { params: buildListParams(params) }
      );
      return decodePageResult(response, appMapper);
    },

    async get(uniqueId: string): Promise<App> {
      const response = await transport.get<JsonApiDocument>(`/apps/${uniqueId}`);
      return decodeOne(response, appMapper);
    },

    async create(request: CreateAppRequest): Promise<App> {
      const response = await transport.post<JsonApiDocument>('/apps', {
        app: {
          name: request.name,
          description: request.description,
          app_type: request.appType,
          oauth_enabled: request.oauthEnabled,
          oauth_access_token_lifetime_hours: request.oauthAccessTokenLifetimeHours,
          oauth_refresh_token_lifetime_days: request.oauthRefreshTokenLifetimeDays,
          rate_limit_per_minute: request.rateLimitPerMinute,
          rate_limit_per_hour: request.rateLimitPerHour,
          webhook_url: request.webhookUrl,
          allowed_origins: request.allowedOrigins,
          metadata: request.metadata,
        },
      });
      return decodeOne(response, appMapper);
    },

    async update(uniqueId: string, request: UpdateAppRequest): Promise<App> {
      const response = await transport.put<JsonApiDocument>(`/apps/${uniqueId}`, {
        app: {
          name: request.name,
          description: request.description,
          app_type: request.appType,
          oauth_enabled: request.oauthEnabled,
          oauth_access_token_lifetime_hours: request.oauthAccessTokenLifetimeHours,
          oauth_refresh_token_lifetime_days: request.oauthRefreshTokenLifetimeDays,
          rate_limit_per_minute: request.rateLimitPerMinute,
          rate_limit_per_hour: request.rateLimitPerHour,
          webhook_url: request.webhookUrl,
          allowed_origins: request.allowedOrigins,
          metadata: request.metadata,
          status: request.status,
        },
      });
      return decodeOne(response, appMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/apps/${uniqueId}`);
    },

    async regenerateWebhookSecret(uniqueId: string): Promise<App> {
      const response = await transport.post<JsonApiDocument>(
        `/apps/${uniqueId}/regenerate_webhook_secret`
      );
      return decodeOne(response, appMapper);
    },
  };
}

/**
 * Create the blocks service
 */
export function createBlocksService(
  transport: Transport,
  _config: AuthenticationBlockConfig
): BlocksService {
  return {
    async list(companyUniqueId: string, params?: ListParams): Promise<PageResult<Block>> {
      const queryParams = buildListParams(params);
      queryParams['filter[company_unique_id]'] = companyUniqueId;

      const response = await transport.get<JsonApiDocument>(
        '/blocks',
        { params: queryParams }
      );
      return decodePageResult(response, blockMapper);
    },

    async get(uniqueId: string): Promise<Block> {
      const response = await transport.get<JsonApiDocument>(`/blocks/${uniqueId}`);
      return decodeOne(response, blockMapper);
    },

    async add(companyUniqueId: string, blockCode: string): Promise<Block> {
      const response = await transport.post<JsonApiDocument>('/blocks', {
        company_unique_id: companyUniqueId,
        block_code: blockCode,
      });
      return decodeOne(response, blockMapper);
    },

    async remove(uniqueId: string): Promise<void> {
      await transport.delete(`/blocks/${uniqueId}`);
    },
  };
}

/**
 * Create the services registry service
 */
export function createServicesRegistryService(
  transport: Transport,
  _config: AuthenticationBlockConfig
): ServicesRegistryService {
  return {
    async list(params?: ListParams): Promise<PageResult<Service>> {
      const response = await transport.get<JsonApiDocument>(
        '/services',
        { params: buildListParams(params) }
      );
      return decodePageResult(response, serviceMapper);
    },

    async get(uniqueId: string): Promise<Service> {
      const response = await transport.get<JsonApiDocument>(`/services/${uniqueId}`);
      return decodeOne(response, serviceMapper);
    },

    async getByCode(code: string): Promise<Service> {
      const response = await transport.get<JsonApiDocument>(
        `/services/by_code/${code}`
      );
      return decodeOne(response, serviceMapper);
    },

    async healthCheck(): Promise<Service[]> {
      const response = await transport.get<JsonApiDocument>('/services/health');
      return decodeMany(response, serviceMapper);
    },
  };
}
