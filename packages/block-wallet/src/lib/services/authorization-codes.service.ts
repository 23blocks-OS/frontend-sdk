import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  AuthorizationCode,
  CreateAuthorizationCodeRequest,
  ValidateAuthorizationCodeRequest,
  UseAuthorizationCodeRequest,
  ListAuthorizationCodesParams,
} from '../types/authorization-code';
import type { Transaction } from '../types/transaction';
import { authorizationCodeMapper } from '../mappers/authorization-code.mapper';
import { transactionMapper } from '../mappers/transaction.mapper';

export interface AuthorizationCodesService {
  list(params?: ListAuthorizationCodesParams): Promise<PageResult<AuthorizationCode>>;
  get(uniqueId: string): Promise<AuthorizationCode>;
  create(data: CreateAuthorizationCodeRequest): Promise<AuthorizationCode>;
  validate(data: ValidateAuthorizationCodeRequest): Promise<{ valid: boolean; authorizationCode?: AuthorizationCode }>;
  use(data: UseAuthorizationCodeRequest): Promise<Transaction>;
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
        data: {
          type: 'AuthorizationCode',
          attributes: {
            wallet_unique_id: data.walletUniqueId,
            amount: data.amount,
            purpose: data.purpose,
            expires_at: data.expiresAt?.toISOString(),
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, authorizationCodeMapper);
    },

    async validate(data: ValidateAuthorizationCodeRequest): Promise<{ valid: boolean; authorizationCode?: AuthorizationCode }> {
      try {
        const response = await transport.post<unknown>('/authorization_codes/validate', {
          data: {
            type: 'AuthorizationCode',
            attributes: {
              code: data.code,
              amount: data.amount,
            },
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
        data: {
          type: 'AuthorizationCode',
          attributes: {
            code: data.code,
            amount: data.amount,
            description: data.description,
          },
        },
      });
      return decodeOne(response, transactionMapper);
    },

    async invalidate(uniqueId: string): Promise<AuthorizationCode> {
      const response = await transport.put<unknown>(`/authorization_codes/${uniqueId}/invalidate`, {
        data: {
          type: 'AuthorizationCode',
          attributes: {},
        },
      });
      return decodeOne(response, authorizationCodeMapper);
    },
  };
}
