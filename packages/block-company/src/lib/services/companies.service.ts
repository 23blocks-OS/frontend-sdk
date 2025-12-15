import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Company,
  CreateCompanyRequest,
  UpdateCompanyRequest,
  ListCompaniesParams,
} from '../types/company';
import { companyMapper } from '../mappers/company.mapper';

export interface CompaniesService {
  list(params?: ListCompaniesParams): Promise<PageResult<Company>>;
  get(uniqueId: string): Promise<Company>;
  create(data: CreateCompanyRequest): Promise<Company>;
  update(uniqueId: string, data: UpdateCompanyRequest): Promise<Company>;
  delete(uniqueId: string): Promise<void>;
}

export function createCompaniesService(transport: Transport, _config: { appId: string }): CompaniesService {
  return {
    async list(params?: ListCompaniesParams): Promise<PageResult<Company>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/companies', { params: queryParams });
      return decodePageResult(response, companyMapper);
    },

    async get(uniqueId: string): Promise<Company> {
      const response = await transport.get<unknown>(`/companies/${uniqueId}`);
      return decodeOne(response, companyMapper);
    },

    async create(data: CreateCompanyRequest): Promise<Company> {
      const response = await transport.post<unknown>('/companies', {
        company: {
          code: data.code,
          name: data.name,
          description: data.description,
          legal_name: data.legalName,
          tax_id: data.taxId,
          industry: data.industry,
          website: data.website,
          logo_url: data.logoUrl,
          payload: data.payload,
        },
      });
      return decodeOne(response, companyMapper);
    },

    async update(uniqueId: string, data: UpdateCompanyRequest): Promise<Company> {
      const response = await transport.put<unknown>(`/companies/${uniqueId}`, {
        company: {
          name: data.name,
          description: data.description,
          legal_name: data.legalName,
          tax_id: data.taxId,
          industry: data.industry,
          website: data.website,
          logo_url: data.logoUrl,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, companyMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/companies/${uniqueId}`);
    },
  };
}
