import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Reward, RewardType, RewardRedemption } from '../types/reward';
import { parseString, parseDate, parseBoolean, parseNumber, parseOptionalNumber, parseStatus } from './utils';

function parseRewardType(value: unknown): RewardType {
  const type = parseString(value);
  if (
    type === 'discount' ||
    type === 'product' ||
    type === 'points' ||
    type === 'cashback' ||
    type === 'free_shipping' ||
    type === 'gift' ||
    type === 'other'
  ) {
    return type;
  }
  return 'other';
}

export const rewardMapper: ResourceMapper<Reward> = {
  type: 'Reward',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    rewardType: parseRewardType(resource.attributes['reward_type']),
    points: parseNumber(resource.attributes['points']),
    value: parseOptionalNumber(resource.attributes['value']),
    imageUrl: parseString(resource.attributes['image_url']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};

export const rewardRedemptionMapper: ResourceMapper<RewardRedemption> = {
  type: 'RewardRedemption',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    rewardUniqueId: parseString(resource.attributes['reward_unique_id']) || '',
    userUniqueId: parseString(resource.attributes['user_unique_id']) || '',
    points: parseNumber(resource.attributes['points']),
    redeemedAt: parseDate(resource.attributes['redeemed_at']) || new Date(),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
