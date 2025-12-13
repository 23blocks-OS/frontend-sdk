import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { AuthorizationCode } from '../types/authorization-code';
import { parseString, parseDate, parseNumber, parseStatus } from './utils';

export const authorizationCodeMapper: ResourceMapper<AuthorizationCode> = {
  type: 'AuthorizationCode',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    walletUniqueId: parseString(resource.attributes['wallet_unique_id']) || '',
    code: parseString(resource.attributes['code']) || '',
    amount: parseNumber(resource.attributes['amount']),
    purpose: parseString(resource.attributes['purpose']),
    expiresAt: parseDate(resource.attributes['expires_at']),
    usedAt: parseDate(resource.attributes['used_at']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
