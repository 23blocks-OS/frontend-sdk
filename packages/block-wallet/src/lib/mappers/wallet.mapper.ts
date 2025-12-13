import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Wallet } from '../types/wallet';
import { parseString, parseDate, parseBoolean, parseNumber, parseStatus } from './utils';

export const walletMapper: ResourceMapper<Wallet> = {
  type: 'Wallet',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    userUniqueId: parseString(resource.attributes['user_unique_id']) || '',
    balance: parseNumber(resource.attributes['balance']),
    currency: parseString(resource.attributes['currency']) || 'USD',
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
