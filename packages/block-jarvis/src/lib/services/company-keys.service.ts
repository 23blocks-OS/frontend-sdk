import type { Transport, PageResult } from '@23blocks/contracts';
import { assertUuid } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type { CompanyKey, CreateCompanyKeyRequest } from '../types/company-key.js';
import { companyKeyMapper } from '../mappers/company-key.mapper.js';

export interface CompanyKeysService {
  list(urlId: string, params?: { page?: number; perPage?: number }): Promise<PageResult<CompanyKey>>;
  create(urlId: string, data: CreateCompanyKeyRequest): Promise<CompanyKey>;
  delete(urlId: string, keyUniqueId: string): Promise<void>;
}

export function createCompanyKeysService(transport: Transport, _config: { apiKey: string }): CompanyKeysService {
  return {
    async list(urlId: string, params?: { page?: number; perPage?: number }): Promise<PageResult<CompanyKey>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>(`/companies/${urlId}/keys`, { params: queryParams });
      return decodePageResult(response, companyKeyMapper);
    },

    async create(urlId: string, data: CreateCompanyKeyRequest): Promise<CompanyKey> {
      const body: Record<string, unknown> = {};
      if (data.name) body['name'] = data.name;
      body['key_value'] = data.keyValue;
      if (data.provider) body['provider'] = data.provider;
      if (data.apiSecret) body['api_secret'] = data.apiSecret;
      if (data.baseUrl) body['base_url'] = data.baseUrl;

      const response = await transport.post<unknown>(`/companies/${urlId}/keys`, {
        key: body,
      });
      return decodeOne(response, companyKeyMapper);
    },

    async delete(urlId: string, keyUniqueId: string): Promise<void> {
      assertUuid(keyUniqueId, 'keyUniqueId');
      await transport.delete(`/companies/${urlId}/keys/${keyUniqueId}`);
    },
  };
}
