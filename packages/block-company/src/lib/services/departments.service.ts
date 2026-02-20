import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Department,
  DepartmentHierarchy,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  ListDepartmentsParams,
} from '../types/department.js';
import { departmentMapper } from '../mappers/department.mapper.js';

export interface DepartmentsService {
  /**
   * List departments with optional filtering and sorting.
   * @returns Paginated list of Department records with metadata.
   */
  list(params?: ListDepartmentsParams): Promise<PageResult<Department>>;

  /**
   * Get a single department by unique ID.
   * @returns The matching Department record.
   */
  get(uniqueId: string): Promise<Department>;

  /**
   * Create a new department.
   * @returns The newly created Department record.
   */
  create(data: CreateDepartmentRequest): Promise<Department>;

  /**
   * Update an existing department.
   * @returns The updated Department record.
   */
  update(uniqueId: string, data: UpdateDepartmentRequest): Promise<Department>;

  /**
   * Delete a department.
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * List all departments belonging to a specific company.
   * @returns Array of Department records for the company.
   */
  listByCompany(companyUniqueId: string): Promise<Department[]>;

  /**
   * Get the department hierarchy tree for a company.
   * @returns Array of DepartmentHierarchy records with nested children.
   */
  getHierarchy(companyUniqueId: string): Promise<DepartmentHierarchy[]>;
}

export function createDepartmentsService(transport: Transport, _config: { apiKey: string }): DepartmentsService {
  return {
    async list(params?: ListDepartmentsParams): Promise<PageResult<Department>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.companyUniqueId) queryParams['company_unique_id'] = params.companyUniqueId;
      if (params?.parentUniqueId) queryParams['parent_unique_id'] = params.parentUniqueId;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/departments', { params: queryParams });
      return decodePageResult(response, departmentMapper);
    },

    async get(uniqueId: string): Promise<Department> {
      const response = await transport.get<unknown>(`/departments/${uniqueId}`);
      return decodeOne(response, departmentMapper);
    },

    async create(data: CreateDepartmentRequest): Promise<Department> {
      const response = await transport.post<unknown>('/departments', {
        department: {
          company_unique_id: data.companyUniqueId,
          code: data.code,
          name: data.name,
          description: data.description,
          parent_unique_id: data.parentUniqueId,
          manager_unique_id: data.managerUniqueId,
          payload: data.payload,
        },
      });
      return decodeOne(response, departmentMapper);
    },

    async update(uniqueId: string, data: UpdateDepartmentRequest): Promise<Department> {
      const response = await transport.put<unknown>(`/departments/${uniqueId}`, {
        department: {
          name: data.name,
          description: data.description,
          parent_unique_id: data.parentUniqueId,
          manager_unique_id: data.managerUniqueId,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, departmentMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/departments/${uniqueId}`);
    },

    async listByCompany(companyUniqueId: string): Promise<Department[]> {
      const response = await transport.get<unknown>(`/companies/${companyUniqueId}/departments`);
      return decodeMany(response, departmentMapper);
    },

    async getHierarchy(companyUniqueId: string): Promise<DepartmentHierarchy[]> {
      const response = await transport.get<unknown>(`/companies/${companyUniqueId}/departments/hierarchy`);
      return decodeMany(response, departmentMapper) as unknown as DepartmentHierarchy[];
    },
  };
}
