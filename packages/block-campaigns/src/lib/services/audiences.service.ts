import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Audience,
  AudienceMember,
  CreateAudienceRequest,
  UpdateAudienceRequest,
  ListAudiencesParams,
} from '../types/audience';
import { audienceMapper, audienceMemberMapper } from '../mappers/audience.mapper';

export interface AudiencesService {
  list(params?: ListAudiencesParams): Promise<PageResult<Audience>>;
  get(uniqueId: string): Promise<Audience>;
  create(data: CreateAudienceRequest): Promise<Audience>;
  update(uniqueId: string, data: UpdateAudienceRequest): Promise<Audience>;
  delete(uniqueId: string): Promise<void>;
  getMembers(uniqueId: string): Promise<AudienceMember[]>;
}

export function createAudiencesService(transport: Transport, _config: { appId: string }): AudiencesService {
  return {
    async list(params?: ListAudiencesParams): Promise<PageResult<Audience>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;

      const response = await transport.get<unknown>('/audiences', { params: queryParams });
      return decodePageResult(response, audienceMapper);
    },

    async get(uniqueId: string): Promise<Audience> {
      const response = await transport.get<unknown>(`/audiences/${uniqueId}`);
      return decodeOne(response, audienceMapper);
    },

    async create(data: CreateAudienceRequest): Promise<Audience> {
      const response = await transport.post<unknown>('/audiences', {
        audience: {
            code: data.code,
            name: data.name,
            description: data.description,
            criteria: data.criteria,
            payload: data.payload,
          },
      });
      return decodeOne(response, audienceMapper);
    },

    async update(uniqueId: string, data: UpdateAudienceRequest): Promise<Audience> {
      const response = await transport.put<unknown>(`/audiences/${uniqueId}`, {
        audience: {
            name: data.name,
            description: data.description,
            criteria: data.criteria,
            member_count: data.memberCount,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
      });
      return decodeOne(response, audienceMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/audiences/${uniqueId}`);
    },

    async getMembers(uniqueId: string): Promise<AudienceMember[]> {
      const response = await transport.get<unknown>(`/audiences/${uniqueId}/members`);
      return decodeMany(response, audienceMemberMapper);
    },
  };
}
