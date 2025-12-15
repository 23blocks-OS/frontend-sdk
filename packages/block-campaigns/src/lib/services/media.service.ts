import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Media,
  CreateMediaRequest,
  UpdateMediaRequest,
  ListMediaParams,
} from '../types/media';
import { mediaMapper } from '../mappers/media.mapper';

export interface MediaService {
  list(params?: ListMediaParams): Promise<PageResult<Media>>;
  get(uniqueId: string): Promise<Media>;
  create(data: CreateMediaRequest): Promise<Media>;
  update(uniqueId: string, data: UpdateMediaRequest): Promise<Media>;
  delete(uniqueId: string): Promise<void>;
}

export function createMediaService(
  transport: Transport,
  _config: { appId: string }
): MediaService {
  return {
    async list(params?: ListMediaParams): Promise<PageResult<Media>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.mediumType) queryParams['medium_type'] = params.mediumType;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/media', { params: queryParams });
      return decodePageResult(response, mediaMapper);
    },

    async get(uniqueId: string): Promise<Media> {
      const response = await transport.get<unknown>(`/media/${uniqueId}`);
      return decodeOne(response, mediaMapper);
    },

    async create(data: CreateMediaRequest): Promise<Media> {
      const response = await transport.post<unknown>('/media', {
        medium: {
          name: data.name,
          code: data.code,
          description: data.description,
          medium_type: data.mediumType,
          medium_link: data.mediumLink,
        },
      });
      return decodeOne(response, mediaMapper);
    },

    async update(uniqueId: string, data: UpdateMediaRequest): Promise<Media> {
      const response = await transport.put<unknown>(`/media/${uniqueId}`, {
        medium: {
          name: data.name,
          code: data.code,
          description: data.description,
          medium_type: data.mediumType,
          medium_link: data.mediumLink,
          status: data.status,
          enabled: data.enabled,
        },
      });
      return decodeOne(response, mediaMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/media/${uniqueId}`);
    },
  };
}
