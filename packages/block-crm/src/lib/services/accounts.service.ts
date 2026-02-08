import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
  ListAccountsParams,
} from '../types/account.js';
import { accountMapper } from '../mappers/account.mapper.js';

export interface AccountsService {
  /**
   * List accounts with optional filtering, pagination, and sorting.
   * @param params - Optional filtering, pagination, and sorting parameters.
   * @returns Paginated result containing Account objects and metadata.
   */
  list(params?: ListAccountsParams): Promise<PageResult<Account>>;

  /**
   * Retrieve a single account by its unique identifier.
   * @param uniqueId - The unique identifier of the account.
   * @returns The matching Account object.
   */
  get(uniqueId: string): Promise<Account>;

  /**
   * Create a new account.
   * @param data - The account creation payload.
   * @returns The newly created Account object.
   */
  create(data: CreateAccountRequest): Promise<Account>;

  /**
   * Update an existing account.
   * @param uniqueId - The unique identifier of the account to update.
   * @param data - The fields to update on the account.
   * @returns The updated Account object.
   * @note Uses PUT (not PATCH) as required by the 23blocks backend.
   */
  update(uniqueId: string, data: UpdateAccountRequest): Promise<Account>;

  /**
   * Soft-delete an account.
   * @param uniqueId - The unique identifier of the account to delete.
   * @returns Resolves when the account has been deleted.
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Recover a previously soft-deleted account.
   * @param uniqueId - The unique identifier of the account to recover.
   * @returns The recovered Account object.
   */
  recover(uniqueId: string): Promise<Account>;

  /**
   * Search accounts by a query string with optional pagination.
   * @param query - The search query string.
   * @param params - Optional pagination parameters.
   * @returns Paginated result containing matching Account objects.
   * @note Performs a server-side POST-based search.
   */
  search(query: string, params?: ListAccountsParams): Promise<PageResult<Account>>;

  /**
   * List soft-deleted accounts with optional pagination.
   * @param params - Optional pagination parameters.
   * @returns Paginated result containing soft-deleted Account objects.
   */
  listDeleted(params?: ListAccountsParams): Promise<PageResult<Account>>;
}

export function createAccountsService(transport: Transport, _config: { appId: string }): AccountsService {
  return {
    async list(params?: ListAccountsParams): Promise<PageResult<Account>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/accounts', { params: queryParams });
      return decodePageResult(response, accountMapper);
    },

    async get(uniqueId: string): Promise<Account> {
      const response = await transport.get<unknown>(`/accounts/${uniqueId}`);
      return decodeOne(response, accountMapper);
    },

    async create(data: CreateAccountRequest): Promise<Account> {
      const response = await transport.post<unknown>('/accounts', {
        account: {
          code: data.code,
          name: data.name,
          label: data.label,
          preferred_domain: data.preferredDomain,
          preferred_language: data.preferredLanguage,
          payload: data.payload,
          tags: data.tags,
        },
      });
      return decodeOne(response, accountMapper);
    },

    async update(uniqueId: string, data: UpdateAccountRequest): Promise<Account> {
      const response = await transport.put<unknown>(`/accounts/${uniqueId}`, {
        account: {
          name: data.name,
          label: data.label,
          preferred_domain: data.preferredDomain,
          preferred_language: data.preferredLanguage,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
          tags: data.tags,
        },
      });
      return decodeOne(response, accountMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/accounts/${uniqueId}`);
    },

    async recover(uniqueId: string): Promise<Account> {
      const response = await transport.put<unknown>(`/accounts/${uniqueId}/recover`, {});
      return decodeOne(response, accountMapper);
    },

    async search(query: string, params?: ListAccountsParams): Promise<PageResult<Account>> {
      const queryParams: Record<string, string> = { search: query };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.post<unknown>('/accounts/search', { search: query }, { params: queryParams });
      return decodePageResult(response, accountMapper);
    },

    async listDeleted(params?: ListAccountsParams): Promise<PageResult<Account>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>('/accounts/trash/show', { params: queryParams });
      return decodePageResult(response, accountMapper);
    },
  };
}
