import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Referral } from '../types/referral';
import { parseString, parseDate, parseStatus } from './utils';

export const referralMapper: ResourceMapper<Referral> = {
  type: 'referral',
  map: (resource) => ({
    uniqueId: resource.id,
    formUniqueId: parseString(resource.attributes['form_unique_id']) ?? '',
    referrerUniqueId: parseString(resource.attributes['referrer_unique_id']),
    referrerEmail: parseString(resource.attributes['referrer_email']),
    referrerName: parseString(resource.attributes['referrer_name']),
    refereeEmail: parseString(resource.attributes['referee_email']) ?? '',
    refereeName: parseString(resource.attributes['referee_name']),
    refereePhone: parseString(resource.attributes['referee_phone']),
    data: (resource.attributes['data'] as Record<string, unknown>) ?? {},
    status: parseStatus(resource.attributes['status']),
    convertedAt: parseDate(resource.attributes['converted_at']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
