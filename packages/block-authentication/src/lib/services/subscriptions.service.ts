import type { Transport, PageResult, ListParams } from '@23blocks/contracts';
import type { JsonApiDocument } from '@23blocks/jsonapi-codec';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  SubscriptionModel,
  UserSubscription,
  CompanySubscription,
} from '../types/index.js';
import {
  subscriptionModelMapper,
  userSubscriptionMapper,
  companySubscriptionMapper,
} from '../mappers/index.js';
import type { AuthenticationBlockConfig } from '../authentication.block.js';

/**
 * Subscribe request
 */
export interface SubscribeRequest {
  subscriptionModelCode: string;
  initialPayment?: number;
}

/**
 * Subscription models service interface
 */
export interface SubscriptionModelsService {
  /**
   * List subscription models
   */
  list(params?: ListParams): Promise<PageResult<SubscriptionModel>>;

  /**
   * Get a subscription model by ID
   */
  get(id: string): Promise<SubscriptionModel>;

  /**
   * Get a subscription model by code
   */
  getByCode(code: string): Promise<SubscriptionModel>;

  /**
   * List promotional subscription models
   */
  promotional(): Promise<SubscriptionModel[]>;
}

/**
 * User subscriptions service interface
 */
export interface UserSubscriptionsService {
  /**
   * List user subscriptions
   */
  list(params?: ListParams): Promise<PageResult<UserSubscription>>;

  /**
   * Get a user subscription by ID
   */
  get(id: string): Promise<UserSubscription>;

  /**
   * Get subscriptions for a user
   */
  forUser(userUniqueId: string): Promise<UserSubscription[]>;

  /**
   * Subscribe a user to a plan
   */
  subscribe(userUniqueId: string, request: SubscribeRequest): Promise<UserSubscription>;

  /**
   * Cancel a subscription
   */
  cancel(id: string): Promise<UserSubscription>;

  /**
   * Reactivate a subscription
   */
  reactivate(id: string): Promise<UserSubscription>;
}

/**
 * Company subscriptions service interface
 */
export interface CompanySubscriptionsService {
  /**
   * List company subscriptions
   */
  list(params?: ListParams): Promise<PageResult<CompanySubscription>>;

  /**
   * Get a company subscription by ID
   */
  get(id: string): Promise<CompanySubscription>;

  /**
   * Get subscriptions for a company
   */
  forCompany(companyUniqueId: string): Promise<CompanySubscription[]>;

  /**
   * Subscribe a company to a plan
   */
  subscribe(companyUniqueId: string, request: SubscribeRequest): Promise<CompanySubscription>;

  /**
   * Cancel a subscription
   */
  cancel(id: string): Promise<CompanySubscription>;

  /**
   * Reactivate a subscription
   */
  reactivate(id: string): Promise<CompanySubscription>;
}

/**
 * Build filter params for list operations
 */
function buildListParams(params?: ListParams): Record<string, string | number | boolean | string[] | undefined> {
  if (!params) return {};

  const queryParams: Record<string, string | number | boolean | string[] | undefined> = {};

  if (params.page) {
    queryParams['page[number]'] = params.page;
  }
  if (params.perPage) {
    queryParams['page[size]'] = params.perPage;
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
 * Create the subscription models service
 */
export function createSubscriptionModelsService(
  transport: Transport,
  _config: AuthenticationBlockConfig
): SubscriptionModelsService {
  return {
    async list(params?: ListParams): Promise<PageResult<SubscriptionModel>> {
      const response = await transport.get<JsonApiDocument>(
        '/subscription_models',
        { params: buildListParams(params) }
      );
      return decodePageResult(response, subscriptionModelMapper);
    },

    async get(id: string): Promise<SubscriptionModel> {
      const response = await transport.get<JsonApiDocument>(
        `/subscription_models/${id}`
      );
      return decodeOne(response, subscriptionModelMapper);
    },

    async getByCode(code: string): Promise<SubscriptionModel> {
      const response = await transport.get<JsonApiDocument>(
        `/subscription_models/by_code/${code}`
      );
      return decodeOne(response, subscriptionModelMapper);
    },

    async promotional(): Promise<SubscriptionModel[]> {
      const response = await transport.get<JsonApiDocument>(
        '/subscription_models/promotional'
      );
      return decodeMany(response, subscriptionModelMapper);
    },
  };
}

/**
 * Create the user subscriptions service
 */
export function createUserSubscriptionsService(
  transport: Transport,
  _config: AuthenticationBlockConfig
): UserSubscriptionsService {
  return {
    async list(params?: ListParams): Promise<PageResult<UserSubscription>> {
      const response = await transport.get<JsonApiDocument>(
        '/user_subscriptions',
        { params: { ...buildListParams(params), include: 'subscription_model' } }
      );
      return decodePageResult(response, userSubscriptionMapper);
    },

    async get(id: string): Promise<UserSubscription> {
      const response = await transport.get<JsonApiDocument>(
        `/user_subscriptions/${id}`,
        { params: { include: 'subscription_model' } }
      );
      return decodeOne(response, userSubscriptionMapper);
    },

    async forUser(userUniqueId: string): Promise<UserSubscription[]> {
      const response = await transport.get<JsonApiDocument>(
        `/users/${userUniqueId}/subscriptions`,
        { params: { include: 'subscription_model' } }
      );
      return decodeMany(response, userSubscriptionMapper);
    },

    async subscribe(
      userUniqueId: string,
      request: SubscribeRequest
    ): Promise<UserSubscription> {
      const response = await transport.post<JsonApiDocument>(
        `/users/${userUniqueId}/subscriptions`,
        {
          subscription_model_code: request.subscriptionModelCode,
          initial_payment: request.initialPayment,
        }
      );
      return decodeOne(response, userSubscriptionMapper);
    },

    async cancel(id: string): Promise<UserSubscription> {
      const response = await transport.post<JsonApiDocument>(
        `/user_subscriptions/${id}/cancel`
      );
      return decodeOne(response, userSubscriptionMapper);
    },

    async reactivate(id: string): Promise<UserSubscription> {
      const response = await transport.post<JsonApiDocument>(
        `/user_subscriptions/${id}/reactivate`
      );
      return decodeOne(response, userSubscriptionMapper);
    },
  };
}

/**
 * Create the company subscriptions service
 */
export function createCompanySubscriptionsService(
  transport: Transport,
  _config: AuthenticationBlockConfig
): CompanySubscriptionsService {
  return {
    async list(params?: ListParams): Promise<PageResult<CompanySubscription>> {
      const response = await transport.get<JsonApiDocument>(
        '/company_subscriptions',
        { params: { ...buildListParams(params), include: 'subscription_model' } }
      );
      return decodePageResult(response, companySubscriptionMapper);
    },

    async get(id: string): Promise<CompanySubscription> {
      const response = await transport.get<JsonApiDocument>(
        `/company_subscriptions/${id}`,
        { params: { include: 'subscription_model' } }
      );
      return decodeOne(response, companySubscriptionMapper);
    },

    async forCompany(companyUniqueId: string): Promise<CompanySubscription[]> {
      const response = await transport.get<JsonApiDocument>(
        `/companies/${companyUniqueId}/subscriptions`,
        { params: { include: 'subscription_model' } }
      );
      return decodeMany(response, companySubscriptionMapper);
    },

    async subscribe(
      companyUniqueId: string,
      request: SubscribeRequest
    ): Promise<CompanySubscription> {
      const response = await transport.post<JsonApiDocument>(
        `/companies/${companyUniqueId}/subscriptions`,
        {
          subscription_model_code: request.subscriptionModelCode,
          initial_payment: request.initialPayment,
        }
      );
      return decodeOne(response, companySubscriptionMapper);
    },

    async cancel(id: string): Promise<CompanySubscription> {
      const response = await transport.post<JsonApiDocument>(
        `/company_subscriptions/${id}/cancel`
      );
      return decodeOne(response, companySubscriptionMapper);
    },

    async reactivate(id: string): Promise<CompanySubscription> {
      const response = await transport.post<JsonApiDocument>(
        `/company_subscriptions/${id}/reactivate`
      );
      return decodeOne(response, companySubscriptionMapper);
    },
  };
}
