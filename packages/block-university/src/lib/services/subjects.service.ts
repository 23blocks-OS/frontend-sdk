import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Subject,
  CreateSubjectRequest,
  UpdateSubjectRequest,
  ListSubjectsParams,
} from '../types/subject.js';
import { subjectMapper } from '../mappers/subject.mapper.js';

export interface SubjectsService {
  /**
   * List subjects with optional filtering and sorting.
   * @returns Paginated list of Subject records with metadata.
   */
  list(params?: ListSubjectsParams): Promise<PageResult<Subject>>;

  /**
   * Get a single subject by unique ID.
   * @returns The matching Subject record.
   */
  get(uniqueId: string): Promise<Subject>;

  /**
   * Create a new subject.
   * @returns The newly created Subject record.
   */
  create(data: CreateSubjectRequest): Promise<Subject>;

  /**
   * Update an existing subject.
   * @returns The updated Subject record.
   */
  update(uniqueId: string, data: UpdateSubjectRequest): Promise<Subject>;

  /**
   * Get resources for a subject.
   * @returns Array of resource objects.
   */
  getResources(uniqueId: string): Promise<unknown[]>;

  /**
   * Get resources for a subject assigned by a specific teacher.
   * @returns Array of resource objects.
   */
  getTeacherResources(uniqueId: string, teacherUniqueId: string): Promise<unknown[]>;

  /**
   * Get tests for a subject.
   * @returns Array of test objects.
   */
  getTests(uniqueId: string): Promise<unknown[]>;

  /**
   * Add a lesson to a subject.
   * @returns The newly created lesson data.
   */
  addLesson(uniqueId: string, lessonData: { name: string; description?: string }): Promise<unknown>;

  /**
   * Add a resource to a subject.
   * @returns The newly created resource data.
   */
  addResource(uniqueId: string, resourceData: unknown): Promise<unknown>;

  /**
   * Update a resource within a subject.
   * @returns The updated resource data.
   */
  updateResource(uniqueId: string, resourceUniqueId: string, resourceData: unknown): Promise<unknown>;

  /**
   * Delete a resource from a subject.
   */
  deleteResource(uniqueId: string, resourceUniqueId: string): Promise<void>;
}

export function createSubjectsService(transport: Transport, _config: { apiKey: string }): SubjectsService {
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
