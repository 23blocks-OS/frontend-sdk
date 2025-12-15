import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Reward,
  RewardRedemption,
  CreateRewardRequest,
  UpdateRewardRequest,
  ListRewardsParams,
  RedeemRewardRequest,
} from '../types/reward';
import { rewardMapper, rewardRedemptionMapper } from '../mappers/reward.mapper';

export interface RewardsService {
  list(params?: ListRewardsParams): Promise<PageResult<Reward>>;
  get(uniqueId: string): Promise<Reward>;
  create(data: CreateRewardRequest): Promise<Reward>;
  update(uniqueId: string, data: UpdateRewardRequest): Promise<Reward>;
  delete(uniqueId: string): Promise<void>;
  redeem(data: RedeemRewardRequest): Promise<RewardRedemption>;
}

export function createRewardsService(transport: Transport, _config: { appId: string }): RewardsService {
  return {
    async list(params?: ListRewardsParams): Promise<PageResult<Reward>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.rewardType) queryParams['reward_type'] = params.rewardType;
      if (params?.minPoints) queryParams['min_points'] = String(params.minPoints);
      if (params?.maxPoints) queryParams['max_points'] = String(params.maxPoints);
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/rewards', { params: queryParams });
      return decodePageResult(response, rewardMapper);
    },

    async get(uniqueId: string): Promise<Reward> {
      const response = await transport.get<unknown>(`/rewards/${uniqueId}`);
      return decodeOne(response, rewardMapper);
    },

    async create(data: CreateRewardRequest): Promise<Reward> {
      const response = await transport.post<unknown>('/rewards', {
        reward: {
            code: data.code,
            name: data.name,
            description: data.description,
            reward_type: data.rewardType,
            points: data.points,
            value: data.value,
            image_url: data.imageUrl,
            payload: data.payload,
          },
      });
      return decodeOne(response, rewardMapper);
    },

    async update(uniqueId: string, data: UpdateRewardRequest): Promise<Reward> {
      const response = await transport.put<unknown>(`/rewards/${uniqueId}`, {
        reward: {
            name: data.name,
            description: data.description,
            reward_type: data.rewardType,
            points: data.points,
            value: data.value,
            image_url: data.imageUrl,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
      });
      return decodeOne(response, rewardMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/rewards/${uniqueId}`);
    },

    async redeem(data: RedeemRewardRequest): Promise<RewardRedemption> {
      const response = await transport.post<unknown>('/rewards/redeem', {
        rewardredemption: {
            reward_unique_id: data.rewardUniqueId,
            user_unique_id: data.userUniqueId,
            points: data.points,
          },
      });
      return decodeOne(response, rewardRedemptionMapper);
    },
  };
}
