import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Teacher,
  ListTeachersParams,
  TeacherAvailability,
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
} from '../types/teacher';
import type { Course } from '../types/course';
import type { CourseGroup } from '../types/course-group';
import { teacherMapper } from '../mappers/teacher.mapper';
import { courseMapper } from '../mappers/course.mapper';
import { courseGroupMapper } from '../mappers/course-group.mapper';

export interface TeachersService {
  list(params?: ListTeachersParams): Promise<PageResult<Teacher>>;
  listArchived(params?: ListTeachersParams): Promise<PageResult<Teacher>>;
  get(uniqueId: string): Promise<Teacher>;
  getCourses(uniqueId: string): Promise<Course[]>;
  getGroups(uniqueId: string): Promise<CourseGroup[]>;
  getAvailability(uniqueId: string): Promise<TeacherAvailability[]>;
  addAvailability(uniqueId: string, data: CreateAvailabilityRequest): Promise<TeacherAvailability>;
  updateAvailability(uniqueId: string, availabilityUniqueId: string, data: UpdateAvailabilityRequest): Promise<TeacherAvailability>;
  deleteAvailability(uniqueId: string, availabilityUniqueId: string): Promise<void>;
  deleteAllAvailability(uniqueId: string): Promise<void>;
  getContentTree(uniqueId: string, courseGroupUniqueId: string): Promise<unknown>;
  getStudentContentTree(uniqueId: string, userUniqueId: string, courseGroupUniqueId: string): Promise<unknown>;
  promoteStudent(uniqueId: string, userUniqueId: string): Promise<unknown>;
}

export function createTeachersService(transport: Transport, _config: { appId: string }): TeachersService {
  return {
    async list(params?: ListTeachersParams): Promise<PageResult<Teacher>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/teachers/', { params: queryParams });
      return decodePageResult(response, teacherMapper);
    },

    async listArchived(params?: ListTeachersParams): Promise<PageResult<Teacher>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.search) queryParams['search'] = params.search;

      const response = await transport.get<unknown>('/teachers/status/archive', { params: queryParams });
      return decodePageResult(response, teacherMapper);
    },

    async get(uniqueId: string): Promise<Teacher> {
      const response = await transport.get<unknown>(`/teachers/${uniqueId}`);
      return decodeOne(response, teacherMapper);
    },

    async getCourses(uniqueId: string): Promise<Course[]> {
      const response = await transport.get<unknown>(`/teachers/${uniqueId}/courses`);
      return decodeMany(response, courseMapper);
    },

    async getGroups(uniqueId: string): Promise<CourseGroup[]> {
      const response = await transport.get<unknown>(`/teachers/${uniqueId}/groups`);
      return decodeMany(response, courseGroupMapper);
    },

    async getAvailability(uniqueId: string): Promise<TeacherAvailability[]> {
      const response = await transport.get<unknown>(`/teachers/${uniqueId}/availability`);
      return Array.isArray(response) ? response as TeacherAvailability[] : [];
    },

    async addAvailability(uniqueId: string, data: CreateAvailabilityRequest): Promise<TeacherAvailability> {
      const response = await transport.post<unknown>(`/teachers/${uniqueId}/availability`, {
        availability: {
          day_of_week: data.dayOfWeek,
          start_time: data.startTime,
          end_time: data.endTime,
          timezone: data.timezone,
        },
      });
      return response as TeacherAvailability;
    },

    async updateAvailability(uniqueId: string, availabilityUniqueId: string, data: UpdateAvailabilityRequest): Promise<TeacherAvailability> {
      const response = await transport.put<unknown>(`/teachers/${uniqueId}/availability/${availabilityUniqueId}`, {
        availability: {
          day_of_week: data.dayOfWeek,
          start_time: data.startTime,
          end_time: data.endTime,
          timezone: data.timezone,
        },
      });
      return response as TeacherAvailability;
    },

    async deleteAvailability(uniqueId: string, availabilityUniqueId: string): Promise<void> {
      await transport.delete(`/teachers/${uniqueId}/availability/${availabilityUniqueId}`);
    },

    async deleteAllAvailability(uniqueId: string): Promise<void> {
      await transport.delete(`/teachers/${uniqueId}/availability`);
    },

    async getContentTree(uniqueId: string, courseGroupUniqueId: string): Promise<unknown> {
      const response = await transport.get<unknown>(`/teachers/${uniqueId}/content_tree/${courseGroupUniqueId}`);
      return response;
    },

    async getStudentContentTree(uniqueId: string, userUniqueId: string, courseGroupUniqueId: string): Promise<unknown> {
      const response = await transport.get<unknown>(`/teachers/${uniqueId}/users/${userUniqueId}/content_tree/${courseGroupUniqueId}`);
      return response;
    },

    async promoteStudent(uniqueId: string, userUniqueId: string): Promise<unknown> {
      const response = await transport.put<unknown>(`/teachers/${uniqueId}/users/${userUniqueId}/promote`, {});
      return response;
    },
  };
}
