import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  SubscriptionModel,
  CreateSubscriptionModelRequest,
  UpdateSubscriptionModelRequest,
  ListSubscriptionModelsParams,
} from '../types/subscription-model.js';
import { subscriptionModelMapper } from '../mappers/subscription-model.mapper.js';

export interface SubscriptionModelsService {
  /**
   * List subscription models with optional filtering and sorting.
   * @returns Paginated list of SubscriptionModel records with metadata.
   */
  list(params?: ListSubscriptionModelsParams): Promise<PageResult<SubscriptionModel>>;

  /**
   * Get a single subscription model by unique ID.
   * @returns The matching SubscriptionModel record.
   */
  get(uniqueId: string): Promise<SubscriptionModel>;

  /**
   * Create a new subscription model.
   * @returns The newly created SubscriptionModel record.
   */
  create(data: CreateSubscriptionModelRequest): Promise<SubscriptionModel>;

  /**
   * Update an existing subscription model.
   * @returns The updated SubscriptionModel record.
   */
  update(uniqueId: string, data: UpdateSubscriptionModelRequest): Promise<SubscriptionModel>;
}

export function createSubscriptionModelsService(transport: Transport, _config: { appId: string }): SubscriptionModelsService {
  return {
    async list(params?: ListSubscriptionModelsParams): Promise<PageResult<SubscriptionModel>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/subscription_models', { params: queryParams });
      return decodePageResult(response, subscriptionModelMapper);
    },

    async get(uniqueId: string): Promise<SubscriptionModel> {
      const response = await transport.get<unknown>(`/subscription_models/${uniqueId}`);
      return decodeOne(response, subscriptionModelMapper);
    },

    async create(data: CreateSubscriptionModelRequest): Promise<SubscriptionModel> {
      const response = await transport.post<unknown>('/subscription_models', {
        subscription_model: {
          code: data.code,
          name: data.name,
          description: data.description,
          price: data.price,
          currency: data.currency,
          interval: data.interval,
          interval_count: data.intervalCount,
          trial_days: data.trialDays,
          features: data.features,
          limits: data.limits,
          payload: data.payload,
          allow_promotion_codes: data.allowPromotionCodes,
        },
      });
      return decodeOne(response, subscriptionModelMapper);
    },

    async update(uniqueId: string, data: UpdateSubscriptionModelRequest): Promise<SubscriptionModel> {
      const response = await transport.put<unknown>(`/subscription_models/${uniqueId}`, {
        subscription_model: {
          name: data.name,
          description: data.description,
          price: data.price,
          currency: data.currency,
          interval: data.interval,
          interval_count: data.intervalCount,
          trial_days: data.trialDays,
          features: data.features,
          limits: data.limits,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
          allow_promotion_codes: data.allowPromotionCodes,
        },
      });
      return decodeOne(response, subscriptionModelMapper);
    },
  };
}
