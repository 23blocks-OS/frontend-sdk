import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Lesson,
  CreateLessonRequest,
  UpdateLessonRequest,
  ListLessonsParams,
  ReorderLessonsRequest,
} from '../types/lesson';
import { lessonMapper } from '../mappers/lesson.mapper';

export interface LessonsService {
  list(params?: ListLessonsParams): Promise<PageResult<Lesson>>;
  get(uniqueId: string): Promise<Lesson>;
  create(data: CreateLessonRequest): Promise<Lesson>;
  update(uniqueId: string, data: UpdateLessonRequest): Promise<Lesson>;
  delete(uniqueId: string): Promise<void>;
  reorder(courseUniqueId: string, data: ReorderLessonsRequest): Promise<Lesson[]>;
  listByCourse(courseUniqueId: string, params?: ListLessonsParams): Promise<PageResult<Lesson>>;
}

export function createLessonsService(transport: Transport, _config: { appId: string }): LessonsService {
  return {
    async list(params?: ListLessonsParams): Promise<PageResult<Lesson>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.courseUniqueId) queryParams['course_unique_id'] = params.courseUniqueId;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/lessons', { params: queryParams });
      return decodePageResult(response, lessonMapper);
    },

    async get(uniqueId: string): Promise<Lesson> {
      const response = await transport.get<unknown>(`/lessons/${uniqueId}`);
      return decodeOne(response, lessonMapper);
    },

    async create(data: CreateLessonRequest): Promise<Lesson> {
      const response = await transport.post<unknown>('/lessons', {
        lesson: {
            course_unique_id: data.courseUniqueId,
            code: data.code,
            name: data.name,
            description: data.description,
            content: data.content,
            content_type: data.contentType,
            content_url: data.contentUrl,
            duration: data.duration,
            display_order: data.displayOrder,
            payload: data.payload,
          },
      });
      return decodeOne(response, lessonMapper);
    },

    async update(uniqueId: string, data: UpdateLessonRequest): Promise<Lesson> {
      const response = await transport.put<unknown>(`/lessons/${uniqueId}`, {
        lesson: {
            name: data.name,
            description: data.description,
            content: data.content,
            content_type: data.contentType,
            content_url: data.contentUrl,
            duration: data.duration,
            display_order: data.displayOrder,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
      });
      return decodeOne(response, lessonMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/lessons/${uniqueId}`);
    },

    async reorder(courseUniqueId: string, data: ReorderLessonsRequest): Promise<Lesson[]> {
      const response = await transport.put<unknown>(`/courses/${courseUniqueId}/lessons/reorder`, {
        lessonreorder: {
            lesson_unique_ids: data.lessonUniqueIds,
          },
      });
      return decodeMany(response, lessonMapper);
    },

    async listByCourse(courseUniqueId: string, params?: ListLessonsParams): Promise<PageResult<Lesson>> {
      const queryParams: Record<string, string> = {
        course_unique_id: courseUniqueId,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/lessons', { params: queryParams });
      return decodePageResult(response, lessonMapper);
    },
  };
}
