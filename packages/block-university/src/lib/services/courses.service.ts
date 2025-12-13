import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  ListCoursesParams,
} from '../types/course';
import { courseMapper } from '../mappers/course.mapper';

export interface CoursesService {
  list(params?: ListCoursesParams): Promise<PageResult<Course>>;
  get(uniqueId: string): Promise<Course>;
  create(data: CreateCourseRequest): Promise<Course>;
  update(uniqueId: string, data: UpdateCourseRequest): Promise<Course>;
  delete(uniqueId: string): Promise<void>;
  publish(uniqueId: string): Promise<Course>;
  unpublish(uniqueId: string): Promise<Course>;
  listByInstructor(instructorUniqueId: string, params?: ListCoursesParams): Promise<PageResult<Course>>;
  listByCategory(categoryUniqueId: string, params?: ListCoursesParams): Promise<PageResult<Course>>;
}

export function createCoursesService(transport: Transport, _config: { appId: string }): CoursesService {
  return {
    async list(params?: ListCoursesParams): Promise<PageResult<Course>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.categoryUniqueId) queryParams['category_unique_id'] = params.categoryUniqueId;
      if (params?.instructorUniqueId) queryParams['instructor_unique_id'] = params.instructorUniqueId;
      if (params?.level) queryParams['level'] = params.level;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/courses', { params: queryParams });
      return decodePageResult(response, courseMapper);
    },

    async get(uniqueId: string): Promise<Course> {
      const response = await transport.get<unknown>(`/courses/${uniqueId}`);
      return decodeOne(response, courseMapper);
    },

    async create(data: CreateCourseRequest): Promise<Course> {
      const response = await transport.post<unknown>('/courses', {
        data: {
          type: 'Course',
          attributes: {
            code: data.code,
            name: data.name,
            description: data.description,
            instructor_unique_id: data.instructorUniqueId,
            category_unique_id: data.categoryUniqueId,
            level: data.level,
            duration: data.duration,
            image_url: data.imageUrl,
            price: data.price,
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, courseMapper);
    },

    async update(uniqueId: string, data: UpdateCourseRequest): Promise<Course> {
      const response = await transport.put<unknown>(`/courses/${uniqueId}`, {
        data: {
          type: 'Course',
          attributes: {
            name: data.name,
            description: data.description,
            instructor_unique_id: data.instructorUniqueId,
            category_unique_id: data.categoryUniqueId,
            level: data.level,
            duration: data.duration,
            image_url: data.imageUrl,
            price: data.price,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, courseMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/courses/${uniqueId}`);
    },

    async publish(uniqueId: string): Promise<Course> {
      const response = await transport.put<unknown>(`/courses/${uniqueId}/publish`, {});
      return decodeOne(response, courseMapper);
    },

    async unpublish(uniqueId: string): Promise<Course> {
      const response = await transport.put<unknown>(`/courses/${uniqueId}/unpublish`, {});
      return decodeOne(response, courseMapper);
    },

    async listByInstructor(instructorUniqueId: string, params?: ListCoursesParams): Promise<PageResult<Course>> {
      const queryParams: Record<string, string> = {
        instructor_unique_id: instructorUniqueId,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/courses', { params: queryParams });
      return decodePageResult(response, courseMapper);
    },

    async listByCategory(categoryUniqueId: string, params?: ListCoursesParams): Promise<PageResult<Course>> {
      const queryParams: Record<string, string> = {
        category_unique_id: categoryUniqueId,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/courses', { params: queryParams });
      return decodePageResult(response, courseMapper);
    },
  };
}
