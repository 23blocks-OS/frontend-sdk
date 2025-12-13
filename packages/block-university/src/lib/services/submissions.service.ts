import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Submission,
  SubmitAssignmentRequest,
  GradeSubmissionRequest,
  ListSubmissionsParams,
} from '../types/submission';
import { submissionMapper } from '../mappers/submission.mapper';

export interface SubmissionsService {
  list(params?: ListSubmissionsParams): Promise<PageResult<Submission>>;
  get(uniqueId: string): Promise<Submission>;
  submit(data: SubmitAssignmentRequest): Promise<Submission>;
  grade(uniqueId: string, data: GradeSubmissionRequest): Promise<Submission>;
  listByAssignment(assignmentUniqueId: string, params?: ListSubmissionsParams): Promise<PageResult<Submission>>;
  listByUser(userUniqueId: string, params?: ListSubmissionsParams): Promise<PageResult<Submission>>;
}

export function createSubmissionsService(transport: Transport, _config: { appId: string }): SubmissionsService {
  return {
    async list(params?: ListSubmissionsParams): Promise<PageResult<Submission>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.assignmentUniqueId) queryParams['assignment_unique_id'] = params.assignmentUniqueId;
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/submissions', { params: queryParams });
      return decodePageResult(response, submissionMapper);
    },

    async get(uniqueId: string): Promise<Submission> {
      const response = await transport.get<unknown>(`/submissions/${uniqueId}`);
      return decodeOne(response, submissionMapper);
    },

    async submit(data: SubmitAssignmentRequest): Promise<Submission> {
      const response = await transport.post<unknown>('/submissions', {
        data: {
          type: 'Submission',
          attributes: {
            assignment_unique_id: data.assignmentUniqueId,
            content: data.content,
            content_url: data.contentUrl,
          },
        },
      });
      return decodeOne(response, submissionMapper);
    },

    async grade(uniqueId: string, data: GradeSubmissionRequest): Promise<Submission> {
      const response = await transport.put<unknown>(`/submissions/${uniqueId}/grade`, {
        data: {
          type: 'SubmissionGrade',
          attributes: {
            score: data.score,
            feedback: data.feedback,
          },
        },
      });
      return decodeOne(response, submissionMapper);
    },

    async listByAssignment(assignmentUniqueId: string, params?: ListSubmissionsParams): Promise<PageResult<Submission>> {
      const queryParams: Record<string, string> = {
        assignment_unique_id: assignmentUniqueId,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/submissions', { params: queryParams });
      return decodePageResult(response, submissionMapper);
    },

    async listByUser(userUniqueId: string, params?: ListSubmissionsParams): Promise<PageResult<Submission>> {
      const queryParams: Record<string, string> = {
        user_unique_id: userUniqueId,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/submissions', { params: queryParams });
      return decodePageResult(response, submissionMapper);
    },
  };
}
