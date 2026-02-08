import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  AuthorizationCode,
  CreateAuthorizationCodeRequest,
  ValidateAuthorizationCodeRequest,
  UseAuthorizationCodeRequest,
  ListAuthorizationCodesParams,
} from '../types/authorization-code.js';
import type { Transaction } from '../types/transaction.js';
import { authorizationCodeMapper } from '../mappers/authorization-code.mapper.js';
import { transactionMapper } from '../mappers/transaction.mapper.js';

export interface AuthorizationCodesService {
  /**
   * List authorization codes with optional filtering.
   * @returns Paginated list of AuthorizationCode records with metadata.
   */
  list(params?: ListAuthorizationCodesParams): Promise<PageResult<AuthorizationCode>>;

  /**
   * Get a single authorization code by unique ID.
   * @returns The matching AuthorizationCode record.
   */
  get(uniqueId: string): Promise<AuthorizationCode>;

  /**
   * Create a new authorization code for a wallet.
   * @returns The newly created AuthorizationCode record.
   */
  create(data: CreateAuthorizationCodeRequest): Promise<AuthorizationCode>;

  /**
   * Validate an authorization code and amount.
   * @returns Object with `valid` boolean and the matching `authorizationCode` if valid.
   * @note Returns `{ valid: false }` on any validation error instead of throwing.
   */
  validate(data: ValidateAuthorizationCodeRequest): Promise<{ valid: boolean; authorizationCode?: AuthorizationCode }>;

  /**
   * Use an authorization code to execute a transaction.
   * @returns The resulting Transaction record.
   */
  use(data: UseAuthorizationCodeRequest): Promise<Transaction>;

  /**
   * Invalidate an authorization code so it can no longer be used.
   * @returns The updated AuthorizationCode record with invalidated status.
   */
  invalidate(uniqueId: string): Promise<AuthorizationCode>;
}

export function createAuthorizationCodesService(transport: Transport, _config: { appId: string }): AuthorizationCodesService {
  return {
    async list(params?: ListAuthorizationCodesParams): Promise<PageResult<AuthorizationCode>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.walletUniqueId) queryParams['wallet_unique_id'] = params.walletUniqueId;
      if (params?.includeExpired !== undefined) queryParams['include_expired'] = String(params.includeExpired);
      if (params?.includeUsed !== undefined) queryParams['include_used'] = String(params.includeUsed);

      const response = await transport.get<unknown>('/authorization_codes', { params: queryParams });
      return decodePageResult(response, authorizationCodeMapper);
    },

    async get(uniqueId: string): Promise<AuthorizationCode> {
      const response = await transport.get<unknown>(`/authorization_codes/${uniqueId}`);
      return decodeOne(response, authorizationCodeMapper);
    },

    async create(data: CreateAuthorizationCodeRequest): Promise<AuthorizationCode> {
      const response = await transport.post<unknown>('/authorization_codes', {
        authorization_code: {
            wallet_unique_id: data.walletUniqueId,
            amount: data.amount,
            purpose: data.purpose,
            expires_at: data.expiresAt?.toISOString(),
            payload: data.payload,
          },
      });
      return decodeOne(response, authorizationCodeMapper);
    },

    async validate(data: ValidateAuthorizationCodeRequest): Promise<{ valid: boolean; authorizationCode?: AuthorizationCode }> {
      try {
        const response = await transport.post<unknown>('/authorization_codes/validate', {
          authorization_code: {
              code: data.code,
              amount: data.amount,
            },
        });

        const authCode = decodeOne(response, authorizationCodeMapper);
        return {
          valid: true,
          authorizationCode: authCode,
        };
      } catch (error) {
        return {
          valid: false,
        };
      }
    },

    async use(data: UseAuthorizationCodeRequest): Promise<Transaction> {
      const response = await transport.post<unknown>('/authorization_codes/use', {
        authorization_code: {
            code: data.code,
            amount: data.amount,
            description: data.description,
          },
      });
      return decodeOne(response, transactionMapper);
    },

    async invalidate(uniqueId: string): Promise<AuthorizationCode> {
      const response = await transport.put<unknown>(`/authorization_codes/${uniqueId}/invalidate`, {
        authorization_code: {},
      });
      return decodeOne(response, authorizationCodeMapper);
    },
  };
}
