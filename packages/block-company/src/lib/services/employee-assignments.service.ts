import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  EmployeeAssignment,
  CreateEmployeeAssignmentRequest,
  UpdateEmployeeAssignmentRequest,
  ListEmployeeAssignmentsParams,
} from '../types/employee-assignment.js';
import { employeeAssignmentMapper } from '../mappers/employee-assignment.mapper.js';

export interface EmployeeAssignmentsService {
  /**
   * List employee assignments with optional filtering and sorting.
   * @returns Paginated list of EmployeeAssignment records with metadata.
   */
  list(params?: ListEmployeeAssignmentsParams): Promise<PageResult<EmployeeAssignment>>;

  /**
   * Get a single employee assignment by unique ID.
   * @returns The matching EmployeeAssignment record.
   */
  get(uniqueId: string): Promise<EmployeeAssignment>;

  /**
   * Create a new employee assignment.
   * @returns The newly created EmployeeAssignment record.
   */
  create(data: CreateEmployeeAssignmentRequest): Promise<EmployeeAssignment>;

  /**
   * Update an existing employee assignment.
   * @returns The updated EmployeeAssignment record.
   */
  update(uniqueId: string, data: UpdateEmployeeAssignmentRequest): Promise<EmployeeAssignment>;

  /**
   * Delete an employee assignment.
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * List all assignments for a specific user.
   * @returns Array of EmployeeAssignment records for the user.
   */
  listByUser(userUniqueId: string): Promise<EmployeeAssignment[]>;

  /**
   * List all assignments for a specific position.
   * @returns Array of EmployeeAssignment records for the position.
   */
  listByPosition(positionUniqueId: string): Promise<EmployeeAssignment[]>;
}

export function createEmployeeAssignmentsService(transport: Transport, _config: { appId: string }): EmployeeAssignmentsService {
  return {
    async list(params?: ListEmployeeAssignmentsParams): Promise<PageResult<EmployeeAssignment>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.positionUniqueId) queryParams['position_unique_id'] = params.positionUniqueId;
      if (params?.departmentUniqueId) queryParams['department_unique_id'] = params.departmentUniqueId;
      if (params?.teamUniqueId) queryParams['team_unique_id'] = params.teamUniqueId;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/employee_assignments', { params: queryParams });
      return decodePageResult(response, employeeAssignmentMapper);
    },

    async get(uniqueId: string): Promise<EmployeeAssignment> {
      const response = await transport.get<unknown>(`/employee_assignments/${uniqueId}`);
      return decodeOne(response, employeeAssignmentMapper);
    },

    async create(data: CreateEmployeeAssignmentRequest): Promise<EmployeeAssignment> {
      const response = await transport.post<unknown>('/employee_assignments', {
        employee_assignment: {
          user_unique_id: data.userUniqueId,
          position_unique_id: data.positionUniqueId,
          department_unique_id: data.departmentUniqueId,
          team_unique_id: data.teamUniqueId,
          start_date: data.startDate,
          end_date: data.endDate,
          is_primary: data.isPrimary,
          payload: data.payload,
        },
      });
      return decodeOne(response, employeeAssignmentMapper);
    },

    async update(uniqueId: string, data: UpdateEmployeeAssignmentRequest): Promise<EmployeeAssignment> {
      const response = await transport.put<unknown>(`/employee_assignments/${uniqueId}`, {
        employee_assignment: {
          position_unique_id: data.positionUniqueId,
          department_unique_id: data.departmentUniqueId,
          team_unique_id: data.teamUniqueId,
          start_date: data.startDate,
          end_date: data.endDate,
          is_primary: data.isPrimary,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, employeeAssignmentMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/employee_assignments/${uniqueId}`);
    },

    async listByUser(userUniqueId: string): Promise<EmployeeAssignment[]> {
      const response = await transport.get<unknown>(`/users/${userUniqueId}/employee_assignments`);
      return decodeMany(response, employeeAssignmentMapper);
    },

    async listByPosition(positionUniqueId: string): Promise<EmployeeAssignment[]> {
      const response = await transport.get<unknown>(`/positions/${positionUniqueId}/employee_assignments`);
      return decodeMany(response, employeeAssignmentMapper);
    },
  };
}
