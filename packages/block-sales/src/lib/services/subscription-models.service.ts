import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  SubscriptionModel,
  CreateSubscriptionModelRequest,
  UpdateSubscriptionModelRequest,
  ListSubscriptionModelsParams,
} from '../types/subscription-model.js';
import { subscriptionModelMapper } from '../mappers/subscription-model.mapper.js';

function buildSubModelBody(data: CreateSubscriptionModelRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.uniqueId) body['unique_id'] = data.uniqueId;
  if (data.code) body['code'] = data.code;
  if (data.description) body['description'] = data.description;
  if (data.promotional !== undefined) body['promotional'] = data.promotional;
  if (data.programCode) body['program_code'] = data.programCode;
  if (data.duration !== undefined) body['duration'] = data.duration;
  if (data.durationUnit) body['duration_unit'] = data.durationUnit;
  if (data.durationDescription) body['duration_description'] = data.durationDescription;
  if (data.recurringPaymentFees !== undefined) body['recurring_payment_fees'] = data.recurringPaymentFees;
  if (data.recurringPaymentAmount !== undefined) body['recurring_payment_amount'] = data.recurringPaymentAmount;
  if (data.contentUrl) body['content_url'] = data.contentUrl;
  if (data.startAt) body['start_at'] = data.startAt;
  if (data.endAt) body['end_at'] = data.endAt;
  if (data.initialPayment !== undefined) body['initial_payment'] = data.initialPayment;
  if (data.subscriptionType) body['subscription_type'] = data.subscriptionType;
  if (data.maxItems !== undefined) body['max_items'] = data.maxItems;
  if (data.stripeProductId) body['stripe_product_id'] = data.stripeProductId;
  if (data.productType) body['product_type'] = data.productType;
  if (data.trialPeriodDays !== undefined) body['trial_period_days'] = data.trialPeriodDays;
  if (data.allowPromotionCodes !== undefined) body['allow_promotion_codes'] = data.allowPromotionCodes;
  if (data.features) body['features'] = data.features;
  return body;
}

export interface SubscriptionModelsService {
  list(params?: ListSubscriptionModelsParams): Promise<PageResult<SubscriptionModel>>;
  get(uniqueId: string): Promise<SubscriptionModel>;
  create(data: CreateSubscriptionModelRequest): Promise<SubscriptionModel>;
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
        subscription_model: buildSubModelBody(data),
      });
      return decodeOne(response, subscriptionModelMapper);
    },

    async update(uniqueId: string, data: UpdateSubscriptionModelRequest): Promise<SubscriptionModel> {
      const response = await transport.put<unknown>(`/subscription_models/${uniqueId}`, {
        subscription_model: buildSubModelBody(data),
      });
      return decodeOne(response, subscriptionModelMapper);
    },
  };
}
