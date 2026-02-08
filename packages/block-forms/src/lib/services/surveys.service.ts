import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Survey,
  SurveyStatus,
  CreateSurveyRequest,
  UpdateSurveyRequest,
  UpdateSurveyStatusRequest,
  ListSurveysParams,
} from '../types/survey.js';
import { surveyMapper } from '../mappers/survey.mapper.js';

export interface SurveysService {
  /**
   * List all survey instances for a form
   * @param formUniqueId - The unique identifier of the parent form
   * @param params - Optional filtering by status, user, and pagination
   * @returns Paginated result containing Survey items and metadata
   */
  list(formUniqueId: string, params?: ListSurveysParams): Promise<PageResult<Survey>>;

  /**
   * List survey instances filtered by a specific status
   * @param formUniqueId - The unique identifier of the parent form
   * @param status - The survey status to filter by
   * @param params - Optional additional filtering by user and pagination
   * @returns Paginated result containing Survey items matching the status
   */
  listByStatus(formUniqueId: string, status: SurveyStatus, params?: ListSurveysParams): Promise<PageResult<Survey>>;

  /**
   * Get a specific survey instance
   * @param formUniqueId - The unique identifier of the parent form
   * @param uniqueId - The unique identifier of the survey instance
   * @returns The matching Survey record
   */
  get(formUniqueId: string, uniqueId: string): Promise<Survey>;

  /**
   * Create a new survey instance
   * @param formUniqueId - The unique identifier of the parent form
   * @param data - Survey details including user/contact info and initial data
   * @returns The newly created Survey record
   */
  create(formUniqueId: string, data: CreateSurveyRequest): Promise<Survey>;

  /**
   * Update a survey instance
   * @param formUniqueId - The unique identifier of the parent form
   * @param uniqueId - The unique identifier of the survey to update
   * @param data - Fields to update such as contact info, data, or status
   * @returns The updated Survey record
   */
  update(formUniqueId: string, uniqueId: string, data: UpdateSurveyRequest): Promise<Survey>;

  /**
   * Delete a survey instance
   * @param formUniqueId - The unique identifier of the parent form
   * @param uniqueId - The unique identifier of the survey to delete
   * @returns Resolves when the survey has been deleted
   */
  delete(formUniqueId: string, uniqueId: string): Promise<void>;

  /**
   * Update only the status of a survey instance
   * @param formUniqueId - The unique identifier of the parent form
   * @param uniqueId - The unique identifier of the survey
   * @param data - The new status value
   * @returns The updated Survey record with the new status
   */
  updateStatus(formUniqueId: string, uniqueId: string, data: UpdateSurveyStatusRequest): Promise<Survey>;

  /**
   * Resend magic link for a survey instance
   * @param formUniqueId - The unique identifier of the parent form
   * @param uniqueId - The unique identifier of the survey
   * @returns Resolves when the magic link email has been sent
   */
  resendMagicLink(formUniqueId: string, uniqueId: string): Promise<void>;

  /**
   * List all surveys assigned to a specific user
   * @param userUniqueId - The unique identifier of the user
   * @param params - Optional filtering by status and pagination
   * @returns Paginated result of Survey records for the given user
   * @note Uses POST to query across all forms for a user
   */
  listByUser(userUniqueId: string, params?: ListSurveysParams): Promise<PageResult<Survey>>;
}

export function createSurveysService(transport: Transport, _config: { appId: string }): SurveysService {
  return {
    async list(formUniqueId: string, params?: ListSurveysParams): Promise<PageResult<Survey>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = String(params.status);
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/surveys/${formUniqueId}/instances`, { params: queryParams });
      return decodePageResult(response, surveyMapper);
    },

    async listByStatus(formUniqueId: string, status: SurveyStatus, params?: ListSurveysParams): Promise<PageResult<Survey>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/surveys/${formUniqueId}/instances/status/${status}`, { params: queryParams });
      return decodePageResult(response, surveyMapper);
    },

    async get(formUniqueId: string, uniqueId: string): Promise<Survey> {
      const response = await transport.get<unknown>(`/surveys/${formUniqueId}/instances/${uniqueId}`);
      return decodeOne(response, surveyMapper);
    },

    async create(formUniqueId: string, data: CreateSurveyRequest): Promise<Survey> {
      const response = await transport.post<unknown>(`/surveys/${formUniqueId}/instances`, {
        survey_instance: {
          user_unique_id: data.userUniqueId,
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          data: data.data,
          payload: data.payload,
        },
      });
      return decodeOne(response, surveyMapper);
    },

    async update(formUniqueId: string, uniqueId: string, data: UpdateSurveyRequest): Promise<Survey> {
      const response = await transport.put<unknown>(`/surveys/${formUniqueId}/instances/${uniqueId}`, {
        survey_instance: {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          data: data.data,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, surveyMapper);
    },

    async delete(formUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/surveys/${formUniqueId}/instances/${uniqueId}`);
    },

    async updateStatus(formUniqueId: string, uniqueId: string, data: UpdateSurveyStatusRequest): Promise<Survey> {
      const response = await transport.put<unknown>(`/surveys/${formUniqueId}/instances/${uniqueId}/status`, {
        survey_instance: {
          status: data.status,
        },
      });
      return decodeOne(response, surveyMapper);
    },

    async resendMagicLink(formUniqueId: string, uniqueId: string): Promise<void> {
      await transport.post<unknown>(`/surveys/${formUniqueId}/instances/${uniqueId}/resend_magic_link`, {});
    },

    async listByUser(userUniqueId: string, params?: ListSurveysParams): Promise<PageResult<Survey>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = String(params.status);
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.post<unknown>('/surveys/users/', {
        user_unique_id: userUniqueId,
        ...queryParams,
      });
      return decodePageResult(response, surveyMapper);
    },
  };
}
