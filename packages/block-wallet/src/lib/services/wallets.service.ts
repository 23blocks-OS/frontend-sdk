import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Wallet,
  CreateWalletRequest,
  UpdateWalletRequest,
  ListWalletsParams,
  CreditWalletRequest,
  DebitWalletRequest,
  TransferWalletRequest,
  ValidateWalletRequest,
  ValidateWalletResponse,
  WalletContent,
  StoreWalletContentRequest,
} from '../types/wallet.js';
import type { Transaction } from '../types/transaction.js';
import { walletMapper } from '../mappers/wallet.mapper.js';
import { transactionMapper } from '../mappers/transaction.mapper.js';

export interface WalletsService {
  /**
   * List wallets with optional filtering.
   * @returns Paginated list of Wallet records with metadata.
   */
  list(params?: ListWalletsParams): Promise<PageResult<Wallet>>;

  /**
   * Get a single wallet by unique ID.
   * @returns The matching Wallet record.
   */
  get(uniqueId: string): Promise<Wallet>;

  /**
   * Get a wallet by user unique ID.
   * @returns The Wallet record belonging to the user.
   */
  getByUser(userUniqueId: string): Promise<Wallet>;

  /**
   * Get a specific wallet by user unique ID and wallet code.
   * @returns The matching Wallet record.
   */
  getUserWallet(userUniqueId: string, walletCode: string): Promise<Wallet>;

  /**
   * Create a new wallet.
   * @returns The newly created Wallet record.
   */
  create(data: CreateWalletRequest): Promise<Wallet>;

  /**
   * Update an existing wallet.
   * @returns The updated Wallet record.
   */
  update(uniqueId: string, data: UpdateWalletRequest): Promise<Wallet>;

  /**
   * Credit (add funds to) a wallet.
   * @returns The resulting credit Transaction record.
   */
  credit(uniqueId: string, data: CreditWalletRequest): Promise<Transaction>;

  /**
   * Debit (withdraw funds from) a wallet.
   * @returns The resulting debit Transaction record.
   */
  debit(uniqueId: string, data: DebitWalletRequest): Promise<Transaction>;

  /**
   * Get the current balance of a wallet.
   * @returns Object with `balance` (number) and `currency` (string).
   */
  getBalance(uniqueId: string): Promise<{ balance: number; currency: string }>;

  /**
   * Validate a wallet code and amount.
   * @returns ValidateWalletResponse with `valid`, `message`, `balance`, and `currency`.
   */
  validate(data: ValidateWalletRequest): Promise<ValidateWalletResponse>;

  /**
   * Transfer funds between wallets for a given user.
   * @returns The resulting transfer Transaction record.
   */
  transfer(userUniqueId: string, walletCode: string, data: TransferWalletRequest): Promise<Transaction>;

  /**
   * Get content stored in a user's wallet.
   * @returns Array of WalletContent items.
   */
  getContent(userUniqueId: string, walletCode: string): Promise<WalletContent[]>;

  /**
   * Store content in a user's wallet.
   * @returns The stored WalletContent item.
   */
  storeContent(userUniqueId: string, walletCode: string, data: StoreWalletContentRequest): Promise<WalletContent>;

  /**
   * List transactions for a user's wallet.
   * @returns Paginated list of Transaction records.
   */
  listTransactions(userUniqueId: string, walletCode: string): Promise<PageResult<Transaction>>;
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

    async getUserWallet(userUniqueId: string, walletCode: string): Promise<Wallet> {
      const response = await transport.get<unknown>(`/users/${userUniqueId}/wallets/${walletCode}`);
      return decodeOne(response, walletMapper);
    },

    async validate(data: ValidateWalletRequest): Promise<ValidateWalletResponse> {
      const response = await transport.post<unknown>('/wallets/validate/', {
        wallet_code: data.walletCode,
        amount: data.amount,
      });
      const result = response as ValidateWalletResponse;
      return {
        valid: result.valid ?? false,
        message: result.message,
        balance: result.balance,
        currency: result.currency,
      };
    },

    async transfer(userUniqueId: string, walletCode: string, data: TransferWalletRequest): Promise<Transaction> {
      const response = await transport.post<unknown>(`/users/${userUniqueId}/wallets/${walletCode}/transfer`, {
        transfer: {
          destination_wallet_code: data.destinationWalletCode,
          amount: data.amount,
          description: data.description,
          payload: data.payload,
        },
      });
      return decodeOne(response, transactionMapper);
    },

    async getContent(userUniqueId: string, walletCode: string): Promise<WalletContent[]> {
      const response = await transport.get<unknown>(`/users/${userUniqueId}/wallets/${walletCode}/content`);
      const data = response as { data?: WalletContent[] };
      return data.data || [];
    },

    async storeContent(userUniqueId: string, walletCode: string, data: StoreWalletContentRequest): Promise<WalletContent> {
      const response = await transport.put<unknown>(`/users/${userUniqueId}/wallets/${walletCode}/content`, {
        content: {
          content_type: data.contentType,
          content_data: data.contentData,
        },
      });
      return response as WalletContent;
    },

    async listTransactions(userUniqueId: string, walletCode: string): Promise<PageResult<Transaction>> {
      const response = await transport.get<unknown>(`/users/${userUniqueId}/wallets/${walletCode}/transactions`);
      return decodePageResult(response, transactionMapper);
    },
  };
}
