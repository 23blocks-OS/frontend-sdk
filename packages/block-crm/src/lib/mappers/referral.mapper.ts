import type { JsonApiResource, JsonApiMapper } from '@23blocks/jsonapi-codec';
import type { Referral } from '../types/referral';
import { parseString, parseDate, parseBoolean, parseStatus } from './utils';

export const referralMapper: JsonApiMapper<Referral> = {
  type: 'referral',
  map(resource: JsonApiResource): Referral {
    const attrs = resource.attributes || {};
    return {
      id: resource.id,
      uniqueId: parseString(attrs['unique_id']) || resource.id,
      referrerUniqueId: parseString(attrs['referrer_unique_id']),
      referredUniqueId: parseString(attrs['referred_unique_id']),
      referralCode: parseString(attrs['referral_code']),
      source: parseString(attrs['source']),
      status: parseStatus(attrs['status']),
      enabled: parseBoolean(attrs['enabled']),
      payload: attrs['payload'] as Record<string, unknown> | undefined,
      createdAt: parseDate(attrs['created_at']),
      updatedAt: parseDate(attrs['updated_at']),
    };
  },
};
