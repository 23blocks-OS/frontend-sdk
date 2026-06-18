import type { Transport, PageResult } from '@23blocks/contracts';
import { assertUuid } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Premise,
  CreatePremiseRequest,
  UpdatePremiseRequest,
  ListPremisesParams,
} from '../types/premise.js';
import { premiseMapper } from '../mappers/premise.mapper.js';

export interface PremisesService {
  /**
   * List all premises
   * @param params - Optional filtering by type, location, address, area, parent, search, and pagination
   * @returns Paginated result containing Premise items and metadata
   */
  list(params?: ListPremisesParams): Promise<PageResult<Premise>>;

  /**
   * Get a specific premise
   * @param uniqueId - The unique identifier of the premise
   * @returns The matching Premise record
   */
  get(uniqueId: string): Promise<Premise>;

  /**
   * Create a new premise
   * @param data - Premise details including name, code, location, type, floor, and capacity
   * @returns The newly created Premise record
   */
  create(data: CreatePremiseRequest): Promise<Premise>;

  /**
   * Update an existing premise
   * @param uniqueId - The unique identifier of the premise to update
   * @param data - Fields to update such as name, type, capacity, instructions, or status
   * @returns The updated Premise record
   */
  update(uniqueId: string, data: UpdatePremiseRequest): Promise<Premise>;

  /**
   * Delete a premise (soft delete)
   * @param uniqueId - The unique identifier of the premise to delete
   * @returns Resolves when the premise has been deleted
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Recover a previously deleted premise
   * @param uniqueId - The unique identifier of the deleted premise
   * @returns The recovered Premise record
   */
  recover(uniqueId: string): Promise<Premise>;

  /**
   * Search premises within a location by query string. Premises are scoped
   * under a location on the geolocation API — this hits
   * `GET /locations/:locationUniqueId/premises?search=<query>`.
   * @param locationUniqueId - The location's UUID
   * @param query - The search query text
   * @param params - Optional pagination parameters
   * @returns Paginated result of Premise records matching the search query
   */
  search(locationUniqueId: string, query: string, params?: ListPremisesParams): Promise<PageResult<Premise>>;

  /**
   * List soft-deleted premises
   * @param params - Optional pagination parameters
   * @returns Paginated result of deleted Premise records
   */
  listDeleted(params?: ListPremisesParams): Promise<PageResult<Premise>>;
}

export function createPremisesService(transport: Transport, _config: { apiKey: string }): PremisesService {
  return {
    async list(params?: ListPremisesParams): Promise<PageResult<Premise>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.premiseType) queryParams['premise_type'] = params.premiseType;
      if (params?.locationUniqueId) queryParams['location_unique_id'] = params.locationUniqueId;
      if (params?.addressUniqueId) queryParams['address_unique_id'] = params.addressUniqueId;
      if (params?.areaUniqueId) queryParams['area_unique_id'] = params.areaUniqueId;
      if (params?.parentId) queryParams['parent_id'] = params.parentId;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/premises', { params: queryParams });
      return decodePageResult(response, premiseMapper);
    },

    async get(uniqueId: string): Promise<Premise> {
      const response = await transport.get<unknown>(`/premises/${uniqueId}`);
      return decodeOne(response, premiseMapper);
    },

    async create(data: CreatePremiseRequest): Promise<Premise> {
      const response = await transport.post<unknown>('/premises', {
        premise: {
            name: data.name,
            code: data.code,
            address_unique_id: data.addressUniqueId,
            area_unique_id: data.areaUniqueId,
            location_unique_id: data.locationUniqueId,
            parent_id: data.parentId,
            premise_type: data.premiseType,
            floor: data.floor,
            description: data.description,
            access_instructions: data.accessInstructions,
            capacity: data.capacity,
            allow_booking_overlap: data.allowBookingOverlap,
            tags: data.tags,
            payload: data.payload,
          },
      });
      return decodeOne(response, premiseMapper);
    },

    async update(uniqueId: string, data: UpdatePremiseRequest): Promise<Premise> {
      const response = await transport.put<unknown>(`/premises/${uniqueId}`, {
        premise: {
            name: data.name,
            code: data.code,
            address_unique_id: data.addressUniqueId,
            area_unique_id: data.areaUniqueId,
            location_unique_id: data.locationUniqueId,
            premise_type: data.premiseType,
            floor: data.floor,
            description: data.description,
            access_instructions: data.accessInstructions,
            additional_instructions: data.additionalInstructions,
            notes: data.notes,
            capacity: data.capacity,
            allow_booking_overlap: data.allowBookingOverlap,
            enabled: data.enabled,
            status: data.status,
            tags: data.tags,
            payload: data.payload,
          },
      });
      return decodeOne(response, premiseMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/premises/${uniqueId}`);
    },

    async recover(uniqueId: string): Promise<Premise> {
      const response = await transport.put<unknown>(`/premises/${uniqueId}/recover`, {});
      return decodeOne(response, premiseMapper);
    },

    async search(locationUniqueId: string, query: string, params?: ListPremisesParams): Promise<PageResult<Premise>> {
      // Premises are nested under locations on the geolocation API — search
      // is a query-string filter on /locations/:id/premises (confirmed by
      // api-geolocation in msg_1781742840_c5f7175b). The previous SDK
      // calling POST /premises/search was 404'ing.
      assertUuid(locationUniqueId, 'locationUniqueId');
      const queryParams: Record<string, string> = { search: query };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>(`/locations/${locationUniqueId}/premises`, { params: queryParams });
      return decodePageResult(response, premiseMapper);
    },

    async listDeleted(params?: ListPremisesParams): Promise<PageResult<Premise>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>('/premises/trash/show', { params: queryParams });
      return decodePageResult(response, premiseMapper);
    },
  };
}
