import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Submission,
  SubmitAssignmentRequest,
  GradeSubmissionRequest,
  ListSubmissionsParams,
} from '../types/submission.js';
import { submissionMapper } from '../mappers/submission.mapper.js';

export interface SubmissionsService {
  /**
   * List submissions with optional filtering and sorting.
   * @returns Paginated list of Submission records with metadata.
   */
  list(params?: ListSubmissionsParams): Promise<PageResult<Submission>>;

  /**
   * Get a single submission by unique ID.
   * @returns The matching Submission record.
   */
  get(uniqueId: string): Promise<Submission>;

  /**
   * Submit an assignment.
   * @returns The newly created Submission record.
   */
  submit(data: SubmitAssignmentRequest): Promise<Submission>;

  /**
   * Grade a submission with score and feedback.
   * @returns The updated Submission record with grade data.
   */
  grade(uniqueId: string, data: GradeSubmissionRequest): Promise<Submission>;

  /**
   * List submissions for a specific assignment.
   * @returns Paginated list of Submission records for the assignment.
   */
  listByAssignment(assignmentUniqueId: string, params?: ListSubmissionsParams): Promise<PageResult<Submission>>;

  /**
   * List submissions by a specific user.
   * @returns Paginated list of Submission records for the user.
   */
  listByUser(userUniqueId: string, params?: ListSubmissionsParams): Promise<PageResult<Submission>>;
}

export function createSubmissionsService(transport: Transport, _config: { apiKey: string }): SubmissionsService {
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
        submission: {
            assignment_unique_id: data.assignmentUniqueId,
            content: data.content,
            content_url: data.contentUrl,
          },
      });
      return decodeOne(response, submissionMapper);
    },

    async grade(uniqueId: string, data: GradeSubmissionRequest): Promise<Submission> {
      const response = await transport.put<unknown>(`/submissions/${uniqueId}/grade`, {
        submissiongrade: {
            score: data.score,
            feedback: data.feedback,
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
