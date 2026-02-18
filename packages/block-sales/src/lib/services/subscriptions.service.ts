import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Subscription,
  SubscriptionItem,
  CreateSubscriptionRequest,
  CreateSubscriptionItemRequest,
  ListSubscriptionsParams,
} from '../types/subscription.js';
import { subscriptionMapper, subscriptionItemMapper } from '../mappers/subscription.mapper.js';

function buildItemBody(data: CreateSubscriptionItemRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.stripePriceId) body['stripe_price_id'] = data.stripePriceId;
  if (data.stripeProductId) body['stripe_product_id'] = data.stripeProductId;
  if (data.blockCode) body['block_code'] = data.blockCode;
  if (data.blockName) body['block_name'] = data.blockName;
  if (data.appUniqueId) body['app_unique_id'] = data.appUniqueId;
  if (data.appName) body['app_name'] = data.appName;
  if (data.appBlockUniqueId) body['app_block_unique_id'] = data.appBlockUniqueId;
  if (data.amountCents !== undefined) body['amount_cents'] = data.amountCents;
  if (data.quantity !== undefined) body['quantity'] = data.quantity;
  if (data.metadata) body['metadata'] = data.metadata;
  return body;
}

function buildSubscriptionBody(data: CreateSubscriptionRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.stripeCustomerId) body['stripe_customer_id'] = data.stripeCustomerId;
  if (data.accountUniqueId) body['account_unique_id'] = data.accountUniqueId;
  if (data.accountCode) body['account_code'] = data.accountCode;
  if (data.accountName) body['account_name'] = data.accountName;
  if (data.currency) body['currency'] = data.currency;
  if (data.billingInterval) body['billing_interval'] = data.billingInterval;
  if (data.trialPeriodDays !== undefined) body['trial_period_days'] = data.trialPeriodDays;
  if (data.metadata) body['metadata'] = data.metadata;
  if (data.items) {
    body['items'] = data.items.map(item => buildItemBody(item));
  }
  return body;
}

export interface SubscriptionsService {
  list(params?: ListSubscriptionsParams): Promise<PageResult<Subscription>>;
  get(uniqueId: string): Promise<Subscription>;
  create(data: CreateSubscriptionRequest): Promise<Subscription>;
  addItem(subscriptionUniqueId: string, data: CreateSubscriptionItemRequest): Promise<SubscriptionItem>;
}

export function createSubscriptionsService(transport: Transport, _config: { appId: string }): SubscriptionsService {
  return {
    async list(params?: ListSubscriptionsParams): Promise<PageResult<Subscription>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/subscriptions', { params: queryParams });
      return decodePageResult(response, subscriptionMapper);
    },

    async get(uniqueId: string): Promise<Subscription> {
      const response = await transport.get<unknown>(`/subscriptions/${uniqueId}`);
      return decodeOne(response, subscriptionMapper);
    },

    async create(data: CreateSubscriptionRequest): Promise<Subscription> {
      const response = await transport.post<unknown>('/subscriptions', {
        subscription: buildSubscriptionBody(data),
      });
      return decodeOne(response, subscriptionMapper);
    },

    async addItem(subscriptionUniqueId: string, data: CreateSubscriptionItemRequest): Promise<SubscriptionItem> {
      const response = await transport.post<unknown>(`/subscriptions/${subscriptionUniqueId}/items`, {
        item: buildItemBody(data),
      });
      return decodeOne(response, subscriptionItemMapper);
    },
  };
}
