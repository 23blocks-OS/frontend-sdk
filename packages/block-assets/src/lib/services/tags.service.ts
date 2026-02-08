import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
  ListTagsParams,
} from '../types/tag.js';
import { tagMapper } from '../mappers/tag.mapper.js';

export interface TagsService {
  /**
   * List tags with optional filtering and sorting.
   * @returns Paginated list of Tag records with metadata.
   */
  list(params?: ListTagsParams): Promise<PageResult<Tag>>;

  /**
   * Get a single tag by unique ID.
   * @returns The matching Tag record.
   */
  get(uniqueId: string): Promise<Tag>;

  /**
   * Create a new tag.
   * @returns The newly created Tag record.
   */
  create(data: CreateTagRequest): Promise<Tag>;

  /**
   * Update an existing tag.
   * @returns The updated Tag record.
   */
  update(uniqueId: string, data: UpdateTagRequest): Promise<Tag>;
}

export function createTagsService(transport: Transport, _config: { appId: string }): TagsService {
  return {
    async list(params?: ListTagsParams): Promise<PageResult<Tag>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.search) queryParams['search'] = params.search;

      const response = await transport.get<unknown>('/tags', { params: queryParams });
      return decodePageResult(response, tagMapper);
    },

    async get(uniqueId: string): Promise<Tag> {
      const response = await transport.get<unknown>(`/tags/${uniqueId}`);
      return decodeOne(response, tagMapper);
    },

    async create(data: CreateTagRequest): Promise<Tag> {
      const response = await transport.post<unknown>('/tags', {
        tag: {
          name: data.name,
          description: data.description,
          color: data.color,
          payload: data.payload,
        },
      });
      return decodeOne(response, tagMapper);
    },

    async update(uniqueId: string, data: UpdateTagRequest): Promise<Tag> {
      const response = await transport.put<unknown>(`/tags/${uniqueId}`, {
        tag: {
          name: data.name,
          description: data.description,
          color: data.color,
          payload: data.payload,
        },
      });
      return decodeOne(response, tagMapper);
    },
  };
}
