import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  CourseGroup,
  CreateCourseGroupRequest,
  ListCourseGroupsParams,
} from '../types/course-group';
import { courseGroupMapper } from '../mappers/course-group.mapper';

export interface CourseGroupsService {
  get(uniqueId: string): Promise<CourseGroup>;
  create(data: CreateCourseGroupRequest): Promise<CourseGroup>;
  addStudent(uniqueId: string, studentUniqueId: string): Promise<CourseGroup>;
  addTeacher(uniqueId: string, teacherUniqueId: string): Promise<CourseGroup>;
  getTests(uniqueId: string): Promise<unknown[]>;
  getTestResponses(uniqueId: string, testUniqueId: string): Promise<unknown[]>;
}

export function createCourseGroupsService(transport: Transport, _config: { appId: string }): CourseGroupsService {
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
