import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Wallet,
  CreateWalletRequest,
  UpdateWalletRequest,
  ListWalletsParams,
  CreditWalletRequest,
  DebitWalletRequest,
} from '../types/wallet';
import type { Transaction } from '../types/transaction';
import { walletMapper } from '../mappers/wallet.mapper';
import { transactionMapper } from '../mappers/transaction.mapper';

export interface WalletsService {
  list(params?: ListWalletsParams): Promise<PageResult<Wallet>>;
  get(uniqueId: string): Promise<Wallet>;
  getByUser(userUniqueId: string): Promise<Wallet>;
  create(data: CreateWalletRequest): Promise<Wallet>;
  update(uniqueId: string, data: UpdateWalletRequest): Promise<Wallet>;
  credit(uniqueId: string, data: CreditWalletRequest): Promise<Transaction>;
  debit(uniqueId: string, data: DebitWalletRequest): Promise<Transaction>;
  getBalance(uniqueId: string): Promise<{ balance: number; currency: string }>;
}

export function createWalletsService(transport: Transport, _config: { appId: string }): WalletsService {
  return {
    async list(params?: ListWalletsParams): Promise<PageResult<Wallet>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.currency) queryParams['currency'] = params.currency;

      const response = await transport.get<unknown>('/wallets', { params: queryParams });
      return decodePageResult(response, walletMapper);
    },

    async get(uniqueId: string): Promise<Wallet> {
      const response = await transport.get<unknown>(`/wallets/${uniqueId}`);
      return decodeOne(response, walletMapper);
    },

    async getByUser(userUniqueId: string): Promise<Wallet> {
      const response = await transport.get<unknown>('/wallets/user', {
        params: { user_unique_id: userUniqueId },
      });
      return decodeOne(response, walletMapper);
    },

    async create(data: CreateWalletRequest): Promise<Wallet> {
      const response = await transport.post<unknown>('/wallets', {
        wallet: {
            user_unique_id: data.userUniqueId,
            currency: data.currency,
            initial_balance: data.initialBalance,
            payload: data.payload,
          },
      });
      return decodeOne(response, walletMapper);
    },

    async update(uniqueId: string, data: UpdateWalletRequest): Promise<Wallet> {
      const response = await transport.put<unknown>(`/wallets/${uniqueId}`, {
        wallet: {
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
      });
      return decodeOne(response, walletMapper);
    },

    async credit(uniqueId: string, data: CreditWalletRequest): Promise<Transaction> {
      const response = await transport.post<unknown>(`/wallets/${uniqueId}/credit`, {
        transaction: {
            amount: data.amount,
            description: data.description,
            reference_type: data.referenceType,
            reference_unique_id: data.referenceUniqueId,
            payload: data.payload,
          },
      });
      return decodeOne(response, transactionMapper);
    },

    async debit(uniqueId: string, data: DebitWalletRequest): Promise<Transaction> {
      const response = await transport.post<unknown>(`/wallets/${uniqueId}/debit`, {
        transaction: {
            amount: data.amount,
            description: data.description,
            reference_type: data.referenceType,
            reference_unique_id: data.referenceUniqueId,
            payload: data.payload,
          },
      });
      return decodeOne(response, transactionMapper);
    },

    async getBalance(uniqueId: string): Promise<{ balance: number; currency: string }> {
      const response = await transport.get<unknown>(`/wallets/${uniqueId}/balance`);
      // Assuming the response has a simple structure with balance and currency
      const data = response as { balance: number; currency: string };
      return {
        balance: data.balance || 0,
        currency: data.currency || 'USD',
      };
    },
  };
}
