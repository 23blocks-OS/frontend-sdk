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
  list(formUniqueId: string, params?: ListLandingsParams): Promise<PageResult<Landing>>;
  get(formUniqueId: string, uniqueId: string): Promise<Landing>;
  submit(formUniqueId: string, data: CreateLandingRequest): Promise<Landing>;
  update(formUniqueId: string, uniqueId: string, data: UpdateLandingRequest): Promise<Landing>;
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
        landing: {
          email: data.email,
          first_name: data.firstName,
          middle_name: data.middleName,
          last_name: data.lastName,
          phone_number: data.phoneNumber,
          message: data.message,
          notes: data.notes,
          selected_option: data.selectedOption,
          form_fields: data.formFields,
          source: data.source,
          source_alias: data.sourceAlias,
          source_id: data.sourceId,
          source_type: data.sourceType,
          visitor_unique_id: data.visitorUniqueId,
          visitor_type: data.visitorType,
          touch_id: data.touchId,
          touch_reference_id: data.touchReferenceId,
          preferred_language: data.preferredLanguage,
        },
      });
      return decodeOne(response, landingMapper);
    },

    async update(formUniqueId: string, uniqueId: string, data: UpdateLandingRequest): Promise<Landing> {
      const response = await transport.put<unknown>(`/landings/${formUniqueId}/instances/${uniqueId}`, {
        landing: {
          email: data.email,
          first_name: data.firstName,
          middle_name: data.middleName,
          last_name: data.lastName,
          phone_number: data.phoneNumber,
          message: data.message,
          notes: data.notes,
          selected_option: data.selectedOption,
          form_fields: data.formFields,
          source: data.source,
          source_alias: data.sourceAlias,
          source_id: data.sourceId,
          source_type: data.sourceType,
          visitor_unique_id: data.visitorUniqueId,
          visitor_type: data.visitorType,
          touch_id: data.touchId,
          touch_reference_id: data.touchReferenceId,
          preferred_language: data.preferredLanguage,
          status: data.status,
        },
      });
      return decodeOne(response, landingMapper);
    },

    async delete(formUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/landings/${formUniqueId}/instances/${uniqueId}`);
    },
  };
}
