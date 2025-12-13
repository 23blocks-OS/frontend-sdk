import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { PremiseBooking } from '../types/booking';
import { parseString, parseDate, parseBoolean, parseStatus } from './utils';

export const premiseBookingMapper: ResourceMapper<PremiseBooking> = {
  type: 'PremiseBooking',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    qcode: parseString(resource.attributes['qcode']),
    premiseUniqueId: parseString(resource.attributes['premise_unique_id']) || '',
    premiseCode: parseString(resource.attributes['premise_code']),
    premiseName: parseString(resource.attributes['premise_name']),
    userType: parseString(resource.attributes['user_type']),
    userUniqueId: parseString(resource.attributes['user_unique_id']),
    checkInTime: parseDate(resource.attributes['check_in_time']),
    checkOutTime: parseDate(resource.attributes['check_out_time']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
  }),
};
