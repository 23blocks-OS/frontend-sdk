import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Landing,
  CreateLandingRequest,
  UpdateLandingRequest,
  ListLandingsParams,
} from '../types/landing.js';
import { landingMapper } from '../mappers/landing.mapper.js';

export interface LandingsService {
  /**
   * List all landing page submissions for a form
   * @param formUniqueId - The unique identifier of the parent form
   * @param params - Optional filtering by status and pagination
   * @returns Paginated result containing Landing items and metadata
   */
  list(formUniqueId: string, params?: ListLandingsParams): Promise<PageResult<Landing>>;

  /**
   * Get a specific landing page submission
   * @param formUniqueId - The unique identifier of the parent form
   * @param uniqueId - The unique identifier of the landing submission
   * @returns The matching Landing record
   */
  get(formUniqueId: string, uniqueId: string): Promise<Landing>;

  /**
   * Submit a new landing page form
   * @param formUniqueId - The unique identifier of the parent form
   * @param data - Submission details including contact information and form data
   * @returns The newly created Landing record
   */
  submit(formUniqueId: string, data: CreateLandingRequest): Promise<Landing>;

  /**
   * Update a landing page submission
   * @param formUniqueId - The unique identifier of the parent form
   * @param uniqueId - The unique identifier of the landing submission to update
   * @param data - Fields to update such as contact info, data, or status
   * @returns The updated Landing record
   */
  update(formUniqueId: string, uniqueId: string, data: UpdateLandingRequest): Promise<Landing>;

  /**
   * Delete a landing page submission
   * @param formUniqueId - The unique identifier of the parent form
   * @param uniqueId - The unique identifier of the landing submission to delete
   * @returns Resolves when the submission has been deleted
   */
  delete(formUniqueId: string, uniqueId: string): Promise<void>;
}

export function createLandingsService(transport: Transport, _config: { apiKey: string }): LandingsService {
  return {
    async list(formUniqueId: string, params?: ListLandingsParams): Promise<PageResult<Landing>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/landings/${formUniqueId}/instances`, { params: queryParams });
      return decodePageResult(response, landingMapper);
    },

    async get(formUniqueId: string, uniqueId: string): Promise<Landing> {
      const response = await transport.get<unknown>(`/landings/${formUniqueId}/instances/${uniqueId}`);
      return decodeOne(response, landingMapper);
    },

    async submit(formUniqueId: string, data: CreateLandingRequest): Promise<Landing> {
      const response = await transport.post<unknown>(`/landings/${formUniqueId}/instances`, {
        landing_instance: {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          company: data.company,
          data: data.data,
          payload: data.payload,
        },
      });
      return decodeOne(response, landingMapper);
    },

    async update(formUniqueId: string, uniqueId: string, data: UpdateLandingRequest): Promise<Landing> {
      const response = await transport.put<unknown>(`/landings/${formUniqueId}/instances/${uniqueId}`, {
        landing_instance: {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          company: data.company,
          data: data.data,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, landingMapper);
    },

    async delete(formUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/landings/${formUniqueId}/instances/${uniqueId}`);
    },
  };
}
