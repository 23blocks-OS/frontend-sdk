import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Loyalty, LoyaltyTier, LoyaltyTransaction } from '../types/loyalty';
import { parseString, parseDate, parseBoolean, parseNumber, parseStatus } from './utils';

function parseLoyaltyTier(value: unknown): LoyaltyTier | undefined {
  const tier = parseString(value);
  if (tier === 'bronze' || tier === 'silver' || tier === 'gold' || tier === 'platinum' || tier === 'diamond') {
    return tier;
  }
  return undefined;
}

function parseTransactionType(value: unknown): 'earned' | 'redeemed' | 'expired' | 'adjusted' {
  const type = parseString(value);
  if (type === 'earned' || type === 'redeemed' || type === 'expired' || type === 'adjusted') {
    return type;
  }
  return 'earned';
}

export const loyaltyMapper: ResourceMapper<Loyalty> = {
  type: 'Loyalty',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    userUniqueId: parseString(resource.attributes['user_unique_id']) || '',
    totalPoints: parseNumber(resource.attributes['total_points']),
    availablePoints: parseNumber(resource.attributes['available_points']),
    tier: parseLoyaltyTier(resource.attributes['tier']),
    tierExpiresAt: parseDate(resource.attributes['tier_expires_at']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};

export const loyaltyTransactionMapper: ResourceMapper<LoyaltyTransaction> = {
  type: 'LoyaltyTransaction',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    loyaltyUniqueId: parseString(resource.attributes['loyalty_unique_id']) || '',
    userUniqueId: parseString(resource.attributes['user_unique_id']) || '',
    points: parseNumber(resource.attributes['points']),
    type: parseTransactionType(resource.attributes['type']),
    reason: parseString(resource.attributes['reason']),
    referenceId: parseString(resource.attributes['reference_id']),
    referenceType: parseString(resource.attributes['reference_type']),
    balanceBefore: parseNumber(resource.attributes['balance_before']),
    balanceAfter: parseNumber(resource.attributes['balance_after']),
    transactionDate: parseDate(resource.attributes['transaction_date']) || new Date(),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
