import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Quote,
  CreateQuoteRequest,
  UpdateQuoteRequest,
  ListQuotesParams,
} from '../types/quote';
import { quoteMapper } from '../mappers/quote.mapper';

export interface QuotesService {
  list(params?: ListQuotesParams): Promise<PageResult<Quote>>;
  get(uniqueId: string): Promise<Quote>;
  create(data: CreateQuoteRequest): Promise<Quote>;
  update(uniqueId: string, data: UpdateQuoteRequest): Promise<Quote>;
  delete(uniqueId: string): Promise<void>;
  recover(uniqueId: string): Promise<Quote>;
  search(query: string, params?: ListQuotesParams): Promise<PageResult<Quote>>;
  listDeleted(params?: ListQuotesParams): Promise<PageResult<Quote>>;
}

export function createQuotesService(transport: Transport, _config: { appId: string }): QuotesService {
  return {
    async list(params?: ListQuotesParams): Promise<PageResult<Quote>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.accountUniqueId) queryParams['account_unique_id'] = params.accountUniqueId;
      if (params?.contactUniqueId) queryParams['contact_unique_id'] = params.contactUniqueId;
      if (params?.ownerUniqueId) queryParams['owner_unique_id'] = params.ownerUniqueId;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/quotes', { params: queryParams });
      return decodePageResult(response, quoteMapper);
    },

    async get(uniqueId: string): Promise<Quote> {
      const response = await transport.get<unknown>(`/quotes/${uniqueId}`);
      return decodeOne(response, quoteMapper);
    },

    async create(data: CreateQuoteRequest): Promise<Quote> {
      const response = await transport.post<unknown>('/quotes', {
        data: {
          type: 'Quote',
          attributes: {
            account_unique_id: data.accountUniqueId,
            contact_unique_id: data.contactUniqueId,
            code: data.code,
            name: data.name,
            notes: data.notes,
            budget: data.budget,
            total: data.total,
            duration: data.duration,
            duration_unit: data.durationUnit,
            duration_description: data.durationDescription,
            payload: data.payload,
            next_action_at: data.nextActionAt,
            owner_unique_id: data.ownerUniqueId,
            tags: data.tags,
          },
        },
      });
      return decodeOne(response, quoteMapper);
    },

    async update(uniqueId: string, data: UpdateQuoteRequest): Promise<Quote> {
      const response = await transport.put<unknown>(`/quotes/${uniqueId}`, {
        data: {
          type: 'Quote',
          attributes: {
            name: data.name,
            notes: data.notes,
            budget: data.budget,
            total: data.total,
            duration: data.duration,
            duration_unit: data.durationUnit,
            duration_description: data.durationDescription,
            payload: data.payload,
            next_action_at: data.nextActionAt,
            owner_unique_id: data.ownerUniqueId,
            owner_name: data.ownerName,
            owner_email: data.ownerEmail,
            enabled: data.enabled,
            status: data.status,
            tags: data.tags,
          },
        },
      });
      return decodeOne(response, quoteMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/quotes/${uniqueId}`);
    },

    async recover(uniqueId: string): Promise<Quote> {
      const response = await transport.put<unknown>(`/quotes/${uniqueId}/recover`, {});
      return decodeOne(response, quoteMapper);
    },

    async search(query: string, params?: ListQuotesParams): Promise<PageResult<Quote>> {
      const queryParams: Record<string, string> = { search: query };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.post<unknown>('/quotes/search', { search: query }, { params: queryParams });
      return decodePageResult(response, quoteMapper);
    },

    async listDeleted(params?: ListQuotesParams): Promise<PageResult<Quote>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>('/quotes/trash/show', { params: queryParams });
      return decodePageResult(response, quoteMapper);
    },
  };
}
