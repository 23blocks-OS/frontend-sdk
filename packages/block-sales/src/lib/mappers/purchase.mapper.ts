import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Purchase } from '../types/purchase.js';
import { parseString, parseDate, parseNumber } from './utils.js';

export const purchaseMapper: ResourceMapper<Purchase> = {
  type: 'Purchase',
  map: (resource) => ({
    orderUniqueId: parseString(resource.attributes['order_unique_id']) || '',
    orderDisplayId: parseString(resource.attributes['order_display_id']) || '',
    subscriptionModelCode: parseString(resource.attributes['subscription_model_code']) || '',
    subscriptionStatus: parseString(resource.attributes['subscription_status']) || '',
    identityType: parseString(resource.attributes['identity_type']) || 'user',
    gateway: parseString(resource.attributes['gateway']) || 'none',
    amount: parseNumber(resource.attributes['amount']),
    purchasedAt: parseDate(resource.attributes['purchased_at']) || new Date(),
  }),
};
