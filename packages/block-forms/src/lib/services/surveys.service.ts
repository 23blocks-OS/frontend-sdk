import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Survey,
  SurveyStatus,
  CreateSurveyRequest,
  UpdateSurveyRequest,
  UpdateSurveyStatusRequest,
  ListSurveysParams,
} from '../types/survey';
import { surveyMapper } from '../mappers/survey.mapper';

export interface SurveysService {
  list(formUniqueId: string, params?: ListSurveysParams): Promise<PageResult<Survey>>;
  listByStatus(formUniqueId: string, status: SurveyStatus, params?: ListSurveysParams): Promise<PageResult<Survey>>;
  get(formUniqueId: string, uniqueId: string): Promise<Survey>;
  create(formUniqueId: string, data: CreateSurveyRequest): Promise<Survey>;
  update(formUniqueId: string, uniqueId: string, data: UpdateSurveyRequest): Promise<Survey>;
  delete(formUniqueId: string, uniqueId: string): Promise<void>;
  updateStatus(formUniqueId: string, uniqueId: string, data: UpdateSurveyStatusRequest): Promise<Survey>;
  resendMagicLink(formUniqueId: string, uniqueId: string): Promise<void>;
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
