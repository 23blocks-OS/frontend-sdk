import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { OfferCode } from '../types/offer-code';
import { parseString, parseDate, parseStatus, parseOptionalNumber, parseBoolean } from './utils';

export const offerCodeMapper: ResourceMapper<OfferCode> = {
  type: 'offer_code',
  map: (resource) => ({
    uniqueId: resource.id,
    code: parseString(resource.attributes['code']) ?? '',
    name: parseString(resource.attributes['name']),
    description: parseString(resource.attributes['description']),
    offerType: parseString(resource.attributes['offer_type']) ?? '',
    value: parseOptionalNumber(resource.attributes['value']),
    isRedeemed: parseBoolean(resource.attributes['is_redeemed']),
    redeemedAt: parseDate(resource.attributes['redeemed_at']),
    redeemedBy: parseString(resource.attributes['redeemed_by']),
    expiresAt: parseDate(resource.attributes['expires_at']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
