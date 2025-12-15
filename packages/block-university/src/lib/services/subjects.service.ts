import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Subject,
  CreateSubjectRequest,
  UpdateSubjectRequest,
  ListSubjectsParams,
} from '../types/subject';
import { subjectMapper } from '../mappers/subject.mapper';

export interface SubjectsService {
  list(params?: ListSubjectsParams): Promise<PageResult<Subject>>;
  get(uniqueId: string): Promise<Subject>;
  create(data: CreateSubjectRequest): Promise<Subject>;
  update(uniqueId: string, data: UpdateSubjectRequest): Promise<Subject>;
  getResources(uniqueId: string): Promise<unknown[]>;
  getTeacherResources(uniqueId: string, teacherUniqueId: string): Promise<unknown[]>;
  getTests(uniqueId: string): Promise<unknown[]>;
  addLesson(uniqueId: string, lessonData: { name: string; description?: string }): Promise<unknown>;
  addResource(uniqueId: string, resourceData: unknown): Promise<unknown>;
  updateResource(uniqueId: string, resourceUniqueId: string, resourceData: unknown): Promise<unknown>;
  deleteResource(uniqueId: string, resourceUniqueId: string): Promise<void>;
}

export function createSubjectsService(transport: Transport, _config: { appId: string }): SubjectsService {
  return {
    async list(params?: ListSubjectsParams): Promise<PageResult<Subject>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.courseUniqueId) queryParams['course_unique_id'] = params.courseUniqueId;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/subjects/', { params: queryParams });
      return decodePageResult(response, subjectMapper);
    },

    async get(uniqueId: string): Promise<Subject> {
      const response = await transport.get<unknown>(`/subjects/${uniqueId}`);
      return decodeOne(response, subjectMapper);
    },

    async create(data: CreateSubjectRequest): Promise<Subject> {
      const response = await transport.post<unknown>('/subjects/', {
        subject: {
          name: data.name,
          description: data.description,
          sort_order: data.sortOrder,
          payload: data.payload,
        },
      });
      return decodeOne(response, subjectMapper);
    },

    async update(uniqueId: string, data: UpdateSubjectRequest): Promise<Subject> {
      const response = await transport.put<unknown>(`/subjects/${uniqueId}`, {
        subject: {
          name: data.name,
          description: data.description,
          sort_order: data.sortOrder,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, subjectMapper);
    },

    async getResources(uniqueId: string): Promise<unknown[]> {
      const response = await transport.get<unknown>(`/subjects/${uniqueId}/resources`);
      return Array.isArray(response) ? response : [];
    },

    async getTeacherResources(uniqueId: string, teacherUniqueId: string): Promise<unknown[]> {
      const response = await transport.get<unknown>(`/subjects/${uniqueId}/teachers/${teacherUniqueId}/resources`);
      return Array.isArray(response) ? response : [];
    },

    async getTests(uniqueId: string): Promise<unknown[]> {
      const response = await transport.get<unknown>(`/subjects/${uniqueId}/tests`);
      return Array.isArray(response) ? response : [];
    },

    async addLesson(uniqueId: string, lessonData: { name: string; description?: string }): Promise<unknown> {
      const response = await transport.post<unknown>(`/subjects/${uniqueId}/lessons`, {
        lesson: lessonData,
      });
      return response;
    },

    async addResource(uniqueId: string, resourceData: unknown): Promise<unknown> {
      const response = await transport.post<unknown>(`/subjects/${uniqueId}/resources`, {
        resource: resourceData,
      });
      return response;
    },

    async updateResource(uniqueId: string, resourceUniqueId: string, resourceData: unknown): Promise<unknown> {
      const response = await transport.put<unknown>(`/subjects/${uniqueId}/resources/${resourceUniqueId}`, {
        resource: resourceData,
      });
      return response;
    },

    async deleteResource(uniqueId: string, resourceUniqueId: string): Promise<void> {
      await transport.delete(`/subjects/${uniqueId}/resources/${resourceUniqueId}`);
    },
  };
}
