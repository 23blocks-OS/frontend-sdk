import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Teacher,
  ListTeachersParams,
  TeacherAvailability,
  CreateTeacherAvailabilityRequest,
  UpdateTeacherAvailabilityRequest,
} from '../types/teacher.js';
import type { Course } from '../types/course.js';
import type { CourseGroup } from '../types/course-group.js';
import { teacherMapper } from '../mappers/teacher.mapper.js';
import { courseMapper } from '../mappers/course.mapper.js';
import { courseGroupMapper } from '../mappers/course-group.mapper.js';

export interface TeachersService {
  /**
   * List teachers with optional filtering and sorting.
   * @returns Paginated list of Teacher records with metadata.
   */
  list(params?: ListTeachersParams): Promise<PageResult<Teacher>>;

  /**
   * List archived teachers.
   * @returns Paginated list of archived Teacher records.
   */
  listArchived(params?: ListTeachersParams): Promise<PageResult<Teacher>>;

  /**
   * Get a single teacher by unique ID.
   * @returns The matching Teacher record.
   */
  get(uniqueId: string): Promise<Teacher>;

  /**
   * Get courses assigned to a teacher.
   * @returns Array of Course records.
   */
  getCourses(uniqueId: string): Promise<Course[]>;

  /**
   * Get course groups a teacher belongs to.
   * @returns Array of CourseGroup records.
   */
  getGroups(uniqueId: string): Promise<CourseGroup[]>;

  /**
   * Get availability slots for a teacher.
   * @returns Array of TeacherAvailability records.
   */
  getAvailability(uniqueId: string): Promise<TeacherAvailability[]>;

  /**
   * Add an availability slot for a teacher.
   * @returns The newly created TeacherAvailability record.
   */
  addAvailability(uniqueId: string, data: CreateTeacherAvailabilityRequest): Promise<TeacherAvailability>;

  /**
   * Update a specific availability slot for a teacher.
   * @returns The updated TeacherAvailability record.
   */
  updateAvailability(uniqueId: string, availabilityUniqueId: string, data: UpdateTeacherAvailabilityRequest): Promise<TeacherAvailability>;

  /**
   * Delete a specific availability slot for a teacher.
   */
  deleteAvailability(uniqueId: string, availabilityUniqueId: string): Promise<void>;

  /**
   * Delete all availability slots for a teacher.
   */
  deleteAllAvailability(uniqueId: string): Promise<void>;

  /**
   * Get the content tree for a teacher in a course group.
   * @returns Hierarchical content structure.
   */
  getContentTree(uniqueId: string, courseGroupUniqueId: string): Promise<unknown>;

  /**
   * Get a student's content tree as seen by a teacher.
   * @returns Hierarchical content structure with student progress.
   */
  getStudentContentTree(uniqueId: string, userUniqueId: string, courseGroupUniqueId: string): Promise<unknown>;

  /**
   * Promote a student within the teacher's scope.
   * @returns The promotion result data.
   */
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

    async addAvailability(uniqueId: string, data: CreateTeacherAvailabilityRequest): Promise<TeacherAvailability> {
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

    async updateAvailability(uniqueId: string, availabilityUniqueId: string, data: UpdateTeacherAvailabilityRequest): Promise<TeacherAvailability> {
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
