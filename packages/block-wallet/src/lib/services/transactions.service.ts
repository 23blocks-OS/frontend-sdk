import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type { Transaction, ListTransactionsParams } from '../types/transaction';
import { transactionMapper } from '../mappers/transaction.mapper';

export interface TransactionsService {
  list(params?: ListTransactionsParams): Promise<PageResult<Transaction>>;
  get(uniqueId: string): Promise<Transaction>;
  listByWallet(walletUniqueId: string, params?: ListTransactionsParams): Promise<PageResult<Transaction>>;
  listByReference(referenceType: string, referenceUniqueId: string, params?: ListTransactionsParams): Promise<PageResult<Transaction>>;
}

export function createTransactionsService(transport: Transport, _config: { appId: string }): TransactionsService {
  return {
    async list(params?: ListTransactionsParams): Promise<PageResult<Transaction>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.walletUniqueId) queryParams['wallet_unique_id'] = params.walletUniqueId;
      if (params?.type) queryParams['type'] = params.type;
      if (params?.referenceType) queryParams['reference_type'] = params.referenceType;
      if (params?.referenceUniqueId) queryParams['reference_unique_id'] = params.referenceUniqueId;
      if (params?.startDate) queryParams['start_date'] = params.startDate.toISOString();
      if (params?.endDate) queryParams['end_date'] = params.endDate.toISOString();
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/transactions', { params: queryParams });
      return decodePageResult(response, transactionMapper);
    },

    async get(uniqueId: string): Promise<Transaction> {
      const response = await transport.get<unknown>(`/transactions/${uniqueId}`);
      return decodeOne(response, transactionMapper);
    },

    async listByWallet(walletUniqueId: string, params?: ListTransactionsParams): Promise<PageResult<Transaction>> {
      const queryParams: Record<string, string> = { wallet_unique_id: walletUniqueId };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.type) queryParams['type'] = params.type;
      if (params?.startDate) queryParams['start_date'] = params.startDate.toISOString();
      if (params?.endDate) queryParams['end_date'] = params.endDate.toISOString();
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/wallets/${walletUniqueId}/transactions`, { params: queryParams });
      return decodePageResult(response, transactionMapper);
    },

    async listByReference(
      referenceType: string,
      referenceUniqueId: string,
      params?: ListTransactionsParams
    ): Promise<PageResult<Transaction>> {
      const queryParams: Record<string, string> = {
        reference_type: referenceType,
        reference_unique_id: referenceUniqueId,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.type) queryParams['type'] = params.type;
      if (params?.startDate) queryParams['start_date'] = params.startDate.toISOString();
      if (params?.endDate) queryParams['end_date'] = params.endDate.toISOString();
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/transactions', { params: queryParams });
      return decodePageResult(response, transactionMapper);
    },
  };
}
