import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Student,
  ListStudentsParams,
  RegisterStudentRequest,
  UpdateStudentRequest,
  StudentAvailability,
} from '../types/student';
import type { Course } from '../types/course';
import type { CourseGroup } from '../types/course-group';
import { studentMapper } from '../mappers/student.mapper';
import { courseMapper } from '../mappers/course.mapper';
import { courseGroupMapper } from '../mappers/course-group.mapper';

export interface StudentsService {
  list(params?: ListStudentsParams): Promise<PageResult<Student>>;
  listArchived(params?: ListStudentsParams): Promise<PageResult<Student>>;
  get(uniqueId: string): Promise<Student>;
  register(uniqueId: string, data: RegisterStudentRequest): Promise<Student>;
  update(uniqueId: string, data: UpdateStudentRequest): Promise<Student>;
  archive(uniqueId: string): Promise<void>;
  restore(uniqueId: string): Promise<Student>;
  getCourses(uniqueId: string): Promise<Course[]>;
  getAvailableCourses(uniqueId: string): Promise<Course[]>;
  getGroups(uniqueId: string): Promise<CourseGroup[]>;
  getContentTree(uniqueId: string, courseGroupUniqueId: string): Promise<unknown>;
  getAvailability(uniqueId: string): Promise<StudentAvailability[]>;
  addAvailability(uniqueId: string, data: { dayOfWeek: number; startTime: string; endTime: string; timezone?: string }): Promise<StudentAvailability>;
  updateAvailability(uniqueId: string, availabilityUniqueId: string, data: { dayOfWeek?: number; startTime?: string; endTime?: string; timezone?: string }): Promise<StudentAvailability>;
  updateAvailabilitySlots(uniqueId: string, slots: { dayOfWeek: number; startTime: string; endTime: string }[]): Promise<StudentAvailability[]>;
  deleteAvailability(uniqueId: string, availabilityUniqueId: string): Promise<void>;
  deleteAllAvailability(uniqueId: string): Promise<void>;
}

export function createStudentsService(transport: Transport, _config: { appId: string }): StudentsService {
  return {
    async list(params?: ListStudentsParams): Promise<PageResult<Student>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/users/', { params: queryParams });
      return decodePageResult(response, studentMapper);
    },

    async listArchived(params?: ListStudentsParams): Promise<PageResult<Student>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.search) queryParams['search'] = params.search;

      const response = await transport.get<unknown>('/users/status/archive', { params: queryParams });
      return decodePageResult(response, studentMapper);
    },

    async get(uniqueId: string): Promise<Student> {
      const response = await transport.get<unknown>(`/users/${uniqueId}/`);
      return decodeOne(response, studentMapper);
    },

    async register(uniqueId: string, data: RegisterStudentRequest): Promise<Student> {
      const response = await transport.post<unknown>(`/users/${uniqueId}/register/`, {
        user: {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          display_name: data.displayName,
          avatar_url: data.avatarUrl,
          payload: data.payload,
        },
      });
      return decodeOne(response, studentMapper);
    },

    async update(uniqueId: string, data: UpdateStudentRequest): Promise<Student> {
      const response = await transport.put<unknown>(`/users/${uniqueId}/`, {
        user: {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          display_name: data.displayName,
          avatar_url: data.avatarUrl,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, studentMapper);
    },

    async archive(uniqueId: string): Promise<void> {
      await transport.delete(`/users/${uniqueId}/archive`);
    },

    async restore(uniqueId: string): Promise<Student> {
      const response = await transport.put<unknown>(`/users/${uniqueId}/restore`, {});
      return decodeOne(response, studentMapper);
    },

    async getCourses(uniqueId: string): Promise<Course[]> {
      const response = await transport.get<unknown>(`/users/${uniqueId}/courses`);
      return decodeMany(response, courseMapper);
    },

    async getAvailableCourses(uniqueId: string): Promise<Course[]> {
      const response = await transport.get<unknown>(`/users/${uniqueId}/availables`);
      return decodeMany(response, courseMapper);
    },

    async getGroups(uniqueId: string): Promise<CourseGroup[]> {
      const response = await transport.get<unknown>(`/users/${uniqueId}/groups`);
      return decodeMany(response, courseGroupMapper);
    },

    async getContentTree(uniqueId: string, courseGroupUniqueId: string): Promise<unknown> {
      const response = await transport.get<unknown>(`/users/${uniqueId}/content_tree/${courseGroupUniqueId}`);
      return response;
    },

    async getAvailability(uniqueId: string): Promise<StudentAvailability[]> {
      const response = await transport.get<unknown>(`/users/${uniqueId}/availability`);
      return Array.isArray(response) ? response as StudentAvailability[] : [];
    },

    async addAvailability(uniqueId: string, data: { dayOfWeek: number; startTime: string; endTime: string; timezone?: string }): Promise<StudentAvailability> {
      const response = await transport.post<unknown>(`/users/${uniqueId}/availability`, {
        availability: {
          day_of_week: data.dayOfWeek,
          start_time: data.startTime,
          end_time: data.endTime,
          timezone: data.timezone,
        },
      });
      return response as StudentAvailability;
    },

    async updateAvailability(uniqueId: string, availabilityUniqueId: string, data: { dayOfWeek?: number; startTime?: string; endTime?: string; timezone?: string }): Promise<StudentAvailability> {
      const response = await transport.put<unknown>(`/users/${uniqueId}/availability/${availabilityUniqueId}`, {
        availability: {
          day_of_week: data.dayOfWeek,
          start_time: data.startTime,
          end_time: data.endTime,
          timezone: data.timezone,
        },
      });
      return response as StudentAvailability;
    },

    async updateAvailabilitySlots(uniqueId: string, slots: { dayOfWeek: number; startTime: string; endTime: string }[]): Promise<StudentAvailability[]> {
      const response = await transport.put<unknown>(`/users/${uniqueId}/availabilities/slots`, {
        slots: slots.map(s => ({
          day_of_week: s.dayOfWeek,
          start_time: s.startTime,
          end_time: s.endTime,
        })),
      });
      return Array.isArray(response) ? response as StudentAvailability[] : [];
    },

    async deleteAvailability(uniqueId: string, availabilityUniqueId: string): Promise<void> {
      await transport.delete(`/users/${uniqueId}/availability/${availabilityUniqueId}`);
    },

    async deleteAllAvailability(uniqueId: string): Promise<void> {
      await transport.delete(`/users/${uniqueId}/availability`);
    },
  };
}
