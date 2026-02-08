import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Enrollment,
  EnrollRequest,
  UpdateEnrollmentProgressRequest,
  ListEnrollmentsParams,
} from '../types/enrollment.js';
import { enrollmentMapper } from '../mappers/enrollment.mapper.js';

export interface EnrollmentsService {
  /**
   * List enrollments with optional filtering and sorting.
   * @returns Paginated list of Enrollment records with metadata.
   */
  list(params?: ListEnrollmentsParams): Promise<PageResult<Enrollment>>;

  /**
   * Get a single enrollment by unique ID.
   * @returns The matching Enrollment record.
   */
  get(uniqueId: string): Promise<Enrollment>;

  /**
   * Enroll a user in a course.
   * @returns The newly created Enrollment record.
   */
  enroll(data: EnrollRequest): Promise<Enrollment>;

  /**
   * Update lesson progress for an enrollment.
   * @returns The updated Enrollment record.
   */
  updateProgress(uniqueId: string, data: UpdateEnrollmentProgressRequest): Promise<Enrollment>;

  /**
   * Mark an enrollment as complete.
   * @returns The Enrollment record with completed status.
   */
  complete(uniqueId: string): Promise<Enrollment>;

  /**
   * Drop an enrollment.
   * @returns The Enrollment record with dropped status.
   */
  drop(uniqueId: string): Promise<Enrollment>;

  /**
   * List enrollments for a specific course.
   * @returns Paginated list of Enrollment records for the course.
   */
  listByCourse(courseUniqueId: string, params?: ListEnrollmentsParams): Promise<PageResult<Enrollment>>;

  /**
   * List enrollments for a specific user.
   * @returns Paginated list of Enrollment records for the user.
   */
  listByUser(userUniqueId: string, params?: ListEnrollmentsParams): Promise<PageResult<Enrollment>>;

  /**
   * Get the certificate URL for a completed enrollment.
   * @returns Object with `certificateUrl` string.
   */
  getCertificate(uniqueId: string): Promise<{ certificateUrl: string }>;
}

export function createEnrollmentsService(transport: Transport, _config: { appId: string }): EnrollmentsService {
  return {
    async list(params?: ListEnrollmentsParams): Promise<PageResult<Enrollment>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.courseUniqueId) queryParams['course_unique_id'] = params.courseUniqueId;
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/enrollments', { params: queryParams });
      return decodePageResult(response, enrollmentMapper);
    },

    async get(uniqueId: string): Promise<Enrollment> {
      const response = await transport.get<unknown>(`/enrollments/${uniqueId}`);
      return decodeOne(response, enrollmentMapper);
    },

    async enroll(data: EnrollRequest): Promise<Enrollment> {
      const response = await transport.post<unknown>('/enrollments', {
        enrollment: {
            course_unique_id: data.courseUniqueId,
            user_unique_id: data.userUniqueId,
          },
      });
      return decodeOne(response, enrollmentMapper);
    },

    async updateProgress(uniqueId: string, data: UpdateEnrollmentProgressRequest): Promise<Enrollment> {
      const response = await transport.put<unknown>(`/enrollments/${uniqueId}/progress`, {
        enrollmentprogress: {
            lesson_unique_id: data.lessonUniqueId,
            progress: data.progress,
          },
      });
      return decodeOne(response, enrollmentMapper);
    },

    async complete(uniqueId: string): Promise<Enrollment> {
      const response = await transport.put<unknown>(`/enrollments/${uniqueId}/complete`, {});
      return decodeOne(response, enrollmentMapper);
    },

    async drop(uniqueId: string): Promise<Enrollment> {
      const response = await transport.put<unknown>(`/enrollments/${uniqueId}/drop`, {});
      return decodeOne(response, enrollmentMapper);
    },

    async listByCourse(courseUniqueId: string, params?: ListEnrollmentsParams): Promise<PageResult<Enrollment>> {
      const queryParams: Record<string, string> = {
        course_unique_id: courseUniqueId,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/enrollments', { params: queryParams });
      return decodePageResult(response, enrollmentMapper);
    },

    async listByUser(userUniqueId: string, params?: ListEnrollmentsParams): Promise<PageResult<Enrollment>> {
      const queryParams: Record<string, string> = {
        user_unique_id: userUniqueId,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/enrollments', { params: queryParams });
      return decodePageResult(response, enrollmentMapper);
    },

    async getCertificate(uniqueId: string): Promise<{ certificateUrl: string }> {
      const response = await transport.get<{ certificate_url: string }>(`/enrollments/${uniqueId}/certificate`);
      return { certificateUrl: response.certificate_url };
    },
  };
}
