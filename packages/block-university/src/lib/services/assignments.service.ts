import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Assignment,
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
  ListAssignmentsParams,
} from '../types/assignment';
import { assignmentMapper } from '../mappers/assignment.mapper';

export interface AssignmentsService {
  list(params?: ListAssignmentsParams): Promise<PageResult<Assignment>>;
  get(uniqueId: string): Promise<Assignment>;
  create(data: CreateAssignmentRequest): Promise<Assignment>;
  update(uniqueId: string, data: UpdateAssignmentRequest): Promise<Assignment>;
  delete(uniqueId: string): Promise<void>;
  listByLesson(lessonUniqueId: string, params?: ListAssignmentsParams): Promise<PageResult<Assignment>>;
}

export function createAssignmentsService(transport: Transport, _config: { appId: string }): AssignmentsService {
  return {
    async list(params?: ListAssignmentsParams): Promise<PageResult<Assignment>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.lessonUniqueId) queryParams['lesson_unique_id'] = params.lessonUniqueId;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/assignments', { params: queryParams });
      return decodePageResult(response, assignmentMapper);
    },

    async get(uniqueId: string): Promise<Assignment> {
      const response = await transport.get<unknown>(`/assignments/${uniqueId}`);
      return decodeOne(response, assignmentMapper);
    },

    async create(data: CreateAssignmentRequest): Promise<Assignment> {
      const response = await transport.post<unknown>('/assignments', {
        assignment: {
            lesson_unique_id: data.lessonUniqueId,
            title: data.title,
            description: data.description,
            due_date: data.dueDate,
            max_score: data.maxScore,
            submission_type: data.submissionType,
            payload: data.payload,
          },
      });
      return decodeOne(response, assignmentMapper);
    },

    async update(uniqueId: string, data: UpdateAssignmentRequest): Promise<Assignment> {
      const response = await transport.put<unknown>(`/assignments/${uniqueId}`, {
        assignment: {
            title: data.title,
            description: data.description,
            due_date: data.dueDate,
            max_score: data.maxScore,
            submission_type: data.submissionType,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
      });
      return decodeOne(response, assignmentMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/assignments/${uniqueId}`);
    },

    async listByLesson(lessonUniqueId: string, params?: ListAssignmentsParams): Promise<PageResult<Assignment>> {
      const queryParams: Record<string, string> = {
        lesson_unique_id: lessonUniqueId,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/assignments', { params: queryParams });
      return decodePageResult(response, assignmentMapper);
    },
  };
}
