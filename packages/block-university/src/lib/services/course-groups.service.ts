import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type {
  CourseGroup,
  CreateCourseGroupRequest,
} from '../types/course-group.js';
import { courseGroupMapper } from '../mappers/course-group.mapper.js';

export interface CourseGroupsService {
  /**
   * Get a course group by unique ID.
   * @returns The matching CourseGroup record.
   */
  get(uniqueId: string): Promise<CourseGroup>;

  /**
   * Create a new course group.
   * @returns The newly created CourseGroup record.
   */
  create(data: CreateCourseGroupRequest): Promise<CourseGroup>;

  /**
   * Enroll a student in a course group.
   * @returns The updated CourseGroup record.
   */
  addStudent(uniqueId: string, studentUniqueId: string): Promise<CourseGroup>;

  /**
   * Assign a teacher to a course group.
   * @returns The updated CourseGroup record.
   */
  addTeacher(uniqueId: string, teacherUniqueId: string): Promise<CourseGroup>;

  /**
   * Get tests for a course group.
   * @returns Array of test objects.
   */
  getTests(uniqueId: string): Promise<unknown[]>;

  /**
   * Get test responses for a specific test in a course group.
   * @returns Array of response objects.
   */
  getTestResponses(uniqueId: string, testUniqueId: string): Promise<unknown[]>;
}

export function createCourseGroupsService(transport: Transport, _config: { apiKey: string }): CourseGroupsService {
  return {
    async get(uniqueId: string): Promise<CourseGroup> {
      const response = await transport.get<unknown>(`/course_groups/${uniqueId}/`);
      return decodeOne(response, courseGroupMapper);
    },

    async create(data: CreateCourseGroupRequest): Promise<CourseGroup> {
      const response = await transport.post<unknown>('/course_groups/', {
        course_group: {
          course_unique_id: data.courseUniqueId,
          name: data.name,
          description: data.description,
          max_students: data.maxStudents,
          start_date: data.startDate?.toISOString(),
          end_date: data.endDate?.toISOString(),
          payload: data.payload,
        },
      });
      return decodeOne(response, courseGroupMapper);
    },

    async addStudent(uniqueId: string, studentUniqueId: string): Promise<CourseGroup> {
      const response = await transport.post<unknown>(`/course_groups/${uniqueId}/enrollment`, {
        student_unique_id: studentUniqueId,
      });
      return decodeOne(response, courseGroupMapper);
    },

    async addTeacher(uniqueId: string, teacherUniqueId: string): Promise<CourseGroup> {
      const response = await transport.post<unknown>(`/course_groups/${uniqueId}/teachers`, {
        teacher_unique_id: teacherUniqueId,
      });
      return decodeOne(response, courseGroupMapper);
    },

    async getTests(uniqueId: string): Promise<unknown[]> {
      const response = await transport.get<unknown>(`/course_groups/${uniqueId}/tests`);
      return Array.isArray(response) ? response : [];
    },

    async getTestResponses(uniqueId: string, testUniqueId: string): Promise<unknown[]> {
      const response = await transport.get<unknown>(`/course_groups/${uniqueId}/tests/${testUniqueId}/responses`);
      return Array.isArray(response) ? response : [];
    },
  };
}
