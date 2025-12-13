import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Enrollment,
  EnrollRequest,
  UpdateEnrollmentProgressRequest,
  ListEnrollmentsParams,
} from '../types/enrollment';
import { enrollmentMapper } from '../mappers/enrollment.mapper';

export interface EnrollmentsService {
  list(params?: ListEnrollmentsParams): Promise<PageResult<Enrollment>>;
  get(uniqueId: string): Promise<Enrollment>;
  enroll(data: EnrollRequest): Promise<Enrollment>;
  updateProgress(uniqueId: string, data: UpdateEnrollmentProgressRequest): Promise<Enrollment>;
  complete(uniqueId: string): Promise<Enrollment>;
  drop(uniqueId: string): Promise<Enrollment>;
  listByCourse(courseUniqueId: string, params?: ListEnrollmentsParams): Promise<PageResult<Enrollment>>;
  listByUser(userUniqueId: string, params?: ListEnrollmentsParams): Promise<PageResult<Enrollment>>;
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
        data: {
          type: 'Enrollment',
          attributes: {
            course_unique_id: data.courseUniqueId,
            user_unique_id: data.userUniqueId,
          },
        },
      });
      return decodeOne(response, enrollmentMapper);
    },

    async updateProgress(uniqueId: string, data: UpdateEnrollmentProgressRequest): Promise<Enrollment> {
      const response = await transport.put<unknown>(`/enrollments/${uniqueId}/progress`, {
        data: {
          type: 'EnrollmentProgress',
          attributes: {
            lesson_unique_id: data.lessonUniqueId,
            progress: data.progress,
          },
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
