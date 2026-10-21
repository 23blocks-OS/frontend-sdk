import type { AppleSubscription } from '../types/apple.js';
import { parseDate, parseString } from './utils.js';

/** Map an Apple subscription payload (plain JSON, snake_case) */
export function appleSubscriptionMapper(raw: Record<string, unknown>): AppleSubscription {
  return {
    source: 'apple',
    status: (raw['status'] as AppleSubscription['status']) ?? 'active',
    productId: parseString(raw['product_id']),
    environment: parseString(raw['environment']),
    autoRenew: raw['auto_renew'] === true,
    offerType: raw['offer_type'] ? parseString(raw['offer_type']) : null,
    expiresAt: raw['expires_at'] ? parseDate(raw['expires_at']) : null,
    gracePeriodExpiresAt: raw['grace_period_expires_at'] ? parseDate(raw['grace_period_expires_at']) : null,
    subscriptionUniqueId: parseString(raw['subscription_unique_id']),
    originalTransactionId: parseString(raw['original_transaction_id']),
    manageUrl: raw['manage_url'] ? parseString(raw['manage_url']) : null,
  };
}
