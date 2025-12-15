import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { RewardsCustomer } from '../types/rewards-customer';
import { parseString, parseDate, parseStatus, parseOptionalNumber } from './utils';

export const rewardsCustomerMapper: ResourceMapper<RewardsCustomer> = {
  type: 'customer',
  map: (resource) => ({
    uniqueId: resource.id,
    userUniqueId: parseString(resource.attributes['user_unique_id']),
    email: parseString(resource.attributes['email']),
    firstName: parseString(resource.attributes['first_name']),
    lastName: parseString(resource.attributes['last_name']),
    totalPoints: parseOptionalNumber(resource.attributes['total_points']),
    availablePoints: parseOptionalNumber(resource.attributes['available_points']),
    lifetimePoints: parseOptionalNumber(resource.attributes['lifetime_points']),
    loyaltyTierUniqueId: parseString(resource.attributes['loyalty_tier_unique_id']),
    loyaltyTierName: parseString(resource.attributes['loyalty_tier_name']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
