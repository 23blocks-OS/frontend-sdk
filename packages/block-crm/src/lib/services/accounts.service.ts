import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
  ListAccountsParams,
} from '../types/account';
import { accountMapper } from '../mappers/account.mapper';

export interface AccountsService {
  list(params?: ListAccountsParams): Promise<PageResult<Account>>;
  get(uniqueId: string): Promise<Account>;
  create(data: CreateAccountRequest): Promise<Account>;
  update(uniqueId: string, data: UpdateAccountRequest): Promise<Account>;
  delete(uniqueId: string): Promise<void>;
  recover(uniqueId: string): Promise<Account>;
  search(query: string, params?: ListAccountsParams): Promise<PageResult<Account>>;
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
