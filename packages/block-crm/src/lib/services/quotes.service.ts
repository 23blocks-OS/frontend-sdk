import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Quote,
  CreateQuoteRequest,
  UpdateQuoteRequest,
  ListQuotesParams,
} from '../types/quote.js';
import { quoteMapper } from '../mappers/quote.mapper.js';

export interface QuotesService {
  /**
   * List quotes with optional filtering, pagination, and sorting.
   * @param params - Optional filtering (status, accountUniqueId, contactUniqueId, ownerUniqueId, search), pagination, and sorting.
   * @returns Paginated result containing Quote objects and metadata.
   */
  list(params?: ListQuotesParams): Promise<PageResult<Quote>>;

  /**
   * Retrieve a single quote by its unique identifier.
   * @param uniqueId - The unique identifier of the quote.
   * @returns The matching Quote object.
   */
  get(uniqueId: string): Promise<Quote>;

  /**
   * Create a new quote.
   * @param data - The quote creation payload with account, contact, budget, duration, and other fields.
   * @returns The newly created Quote object.
   */
  create(data: CreateQuoteRequest): Promise<Quote>;

  /**
   * Update an existing quote.
   * @param uniqueId - The unique identifier of the quote to update.
   * @param data - The fields to update on the quote.
   * @returns The updated Quote object.
   * @note Uses PUT (not PATCH) as required by the 23blocks backend.
   */
  update(uniqueId: string, data: UpdateQuoteRequest): Promise<Quote>;

  /**
   * Soft-delete a quote.
   * @param uniqueId - The unique identifier of the quote to delete.
   * @returns Resolves when the quote has been deleted.
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Recover a previously soft-deleted quote.
   * @param uniqueId - The unique identifier of the quote to recover.
   * @returns The recovered Quote object.
   */
  recover(uniqueId: string): Promise<Quote>;

  /**
   * Search quotes by a query string with optional pagination.
   * @param query - The search query string.
   * @param params - Optional pagination parameters.
   * @returns Paginated result containing matching Quote objects.
   * @note Performs a server-side POST-based search.
   */
  search(query: string, params?: ListQuotesParams): Promise<PageResult<Quote>>;

  /**
   * List soft-deleted quotes with optional pagination.
   * @param params - Optional pagination parameters.
   * @returns Paginated result containing soft-deleted Quote objects.
   */
  listDeleted(params?: ListQuotesParams): Promise<PageResult<Quote>>;
}

export function createQuotesService(transport: Transport, _config: { apiKey: string }): QuotesService {
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
        quote: {
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
      });
      return decodeOne(response, quoteMapper);
    },

    async update(uniqueId: string, data: UpdateQuoteRequest): Promise<Quote> {
      const response = await transport.put<unknown>(`/quotes/${uniqueId}`, {
        quote: {
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
