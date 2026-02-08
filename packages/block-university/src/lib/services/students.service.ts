import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Student,
  ListStudentsParams,
  RegisterStudentRequest,
  UpdateStudentRequest,
  StudentAvailability,
} from '../types/student.js';
import type { Course } from '../types/course.js';
import type { CourseGroup } from '../types/course-group.js';
import { studentMapper } from '../mappers/student.mapper.js';
import { courseMapper } from '../mappers/course.mapper.js';
import { courseGroupMapper } from '../mappers/course-group.mapper.js';

export interface StudentsService {
  /**
   * List students with optional filtering and sorting.
   * @returns Paginated list of Student records with metadata.
   */
  list(params?: ListStudentsParams): Promise<PageResult<Student>>;

  /**
   * List archived students.
   * @returns Paginated list of archived Student records.
   */
  listArchived(params?: ListStudentsParams): Promise<PageResult<Student>>;

  /**
   * Get a single student by unique ID.
   * @returns The matching Student record.
   */
  get(uniqueId: string): Promise<Student>;

  /**
   * Register a new student.
   * @returns The newly registered Student record.
   */
  register(uniqueId: string, data: RegisterStudentRequest): Promise<Student>;

  /**
   * Update a student's profile.
   * @returns The updated Student record.
   */
  update(uniqueId: string, data: UpdateStudentRequest): Promise<Student>;

  /**
   * Archive a student.
   */
  archive(uniqueId: string): Promise<void>;

  /**
   * Restore an archived student.
   * @returns The restored Student record.
   */
  restore(uniqueId: string): Promise<Student>;

  /**
   * Get courses the student is enrolled in.
   * @returns Array of Course records.
   */
  getCourses(uniqueId: string): Promise<Course[]>;

  /**
   * Get courses available for the student to enroll in.
   * @returns Array of available Course records.
   */
  getAvailableCourses(uniqueId: string): Promise<Course[]>;

  /**
   * Get course groups the student belongs to.
   * @returns Array of CourseGroup records.
   */
  getGroups(uniqueId: string): Promise<CourseGroup[]>;

  /**
   * Get the content tree for a student in a course group.
   * @returns Hierarchical content structure.
   */
  getContentTree(uniqueId: string, courseGroupUniqueId: string): Promise<unknown>;

  /**
   * Get availability slots for a student.
   * @returns Array of StudentAvailability records.
   */
  getAvailability(uniqueId: string): Promise<StudentAvailability[]>;

  /**
   * Add an availability slot for a student.
   * @returns The newly created StudentAvailability record.
   */
  addAvailability(uniqueId: string, data: { dayOfWeek: number; startTime: string; endTime: string; timezone?: string }): Promise<StudentAvailability>;

  /**
   * Update a specific availability slot for a student.
   * @returns The updated StudentAvailability record.
   */
  updateAvailability(uniqueId: string, availabilityUniqueId: string, data: { dayOfWeek?: number; startTime?: string; endTime?: string; timezone?: string }): Promise<StudentAvailability>;

  /**
   * Replace all availability slots for a student.
   * @returns Array of updated StudentAvailability records.
   * @note Replaces all existing slots with the provided set.
   */
  updateAvailabilitySlots(uniqueId: string, slots: { dayOfWeek: number; startTime: string; endTime: string }[]): Promise<StudentAvailability[]>;

  /**
   * Delete a specific availability slot.
   */
  deleteAvailability(uniqueId: string, availabilityUniqueId: string): Promise<void>;

  /**
   * Delete all availability slots for a student.
   */
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
