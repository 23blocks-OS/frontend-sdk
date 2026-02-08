import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Attendance,
  CreateAttendanceRequest,
  UpdateAttendanceRequest,
  ListAttendanceParams,
  BulkAttendanceRequest,
  AttendanceStats,
} from '../types/attendance.js';
import { attendanceMapper } from '../mappers/attendance.mapper.js';

export interface AttendanceService {
  /**
   * List attendance records with optional filtering and sorting.
   * @returns Paginated list of Attendance records with metadata.
   */
  list(params?: ListAttendanceParams): Promise<PageResult<Attendance>>;

  /**
   * Get a single attendance record by unique ID.
   * @returns The matching Attendance record.
   */
  get(uniqueId: string): Promise<Attendance>;

  /**
   * Create a new attendance record.
   * @returns The newly created Attendance record.
   */
  create(data: CreateAttendanceRequest): Promise<Attendance>;

  /**
   * Update an existing attendance record.
   * @returns The updated Attendance record.
   */
  update(uniqueId: string, data: UpdateAttendanceRequest): Promise<Attendance>;

  /**
   * Delete an attendance record.
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Create attendance records in bulk for a lesson.
   * @returns Array of newly created Attendance records.
   */
  bulkCreate(data: BulkAttendanceRequest): Promise<Attendance[]>;

  /**
   * List attendance records for a specific lesson.
   * @returns Paginated list of Attendance records for the lesson.
   */
  listByLesson(lessonUniqueId: string, params?: ListAttendanceParams): Promise<PageResult<Attendance>>;

  /**
   * List attendance records for a specific student.
   * @returns Paginated list of Attendance records for the student.
   */
  listByStudent(studentUniqueId: string, params?: ListAttendanceParams): Promise<PageResult<Attendance>>;

  /**
   * List attendance records for a specific course.
   * @returns Paginated list of Attendance records for the course.
   */
  listByCourse(courseUniqueId: string, params?: ListAttendanceParams): Promise<PageResult<Attendance>>;

  /**
   * Get attendance statistics for a student, optionally scoped to a course.
   * @returns AttendanceStats with totalLessons, present, absent, late, excused, and attendanceRate.
   */
  getStudentStats(studentUniqueId: string, courseUniqueId?: string): Promise<AttendanceStats>;

  /**
   * Verify an attendance record.
   * @returns The Attendance record with verified status.
   */
  verify(uniqueId: string): Promise<Attendance>;
}

export function createAttendanceService(transport: Transport, _config: { appId: string }): AttendanceService {
  return {
    async list(params?: ListAttendanceParams): Promise<PageResult<Attendance>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.lessonUniqueId) queryParams['lesson_unique_id'] = params.lessonUniqueId;
      if (params?.courseUniqueId) queryParams['course_unique_id'] = params.courseUniqueId;
      if (params?.studentUniqueId) queryParams['student_unique_id'] = params.studentUniqueId;
      if (params?.attendanceType) queryParams['attendance_type'] = params.attendanceType;
      if (params?.dateFrom) queryParams['date_from'] = params.dateFrom;
      if (params?.dateTo) queryParams['date_to'] = params.dateTo;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/attendances', { params: queryParams });
      return decodePageResult(response, attendanceMapper);
    },

    async get(uniqueId: string): Promise<Attendance> {
      const response = await transport.get<unknown>(`/attendances/${uniqueId}`);
      return decodeOne(response, attendanceMapper);
    },

    async create(data: CreateAttendanceRequest): Promise<Attendance> {
      const response = await transport.post<unknown>('/attendances', {
        attendance: {
          lesson_unique_id: data.lessonUniqueId,
          student_unique_id: data.studentUniqueId,
          attendance_type: data.attendanceType,
          attended_at: data.attendedAt,
          duration: data.duration,
          notes: data.notes,
          payload: data.payload,
        },
      });
      return decodeOne(response, attendanceMapper);
    },

    async update(uniqueId: string, data: UpdateAttendanceRequest): Promise<Attendance> {
      const response = await transport.put<unknown>(`/attendances/${uniqueId}`, {
        attendance: {
          attendance_type: data.attendanceType,
          attended_at: data.attendedAt,
          duration: data.duration,
          notes: data.notes,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, attendanceMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/attendances/${uniqueId}`);
    },

    async bulkCreate(data: BulkAttendanceRequest): Promise<Attendance[]> {
      const response = await transport.post<unknown>('/attendances/bulk', {
        lesson_unique_id: data.lessonUniqueId,
        attendances: data.attendances.map((a) => ({
          student_unique_id: a.studentUniqueId,
          attendance_type: a.attendanceType,
          notes: a.notes,
        })),
      });
      return decodeMany(response, attendanceMapper);
    },

    async listByLesson(lessonUniqueId: string, params?: ListAttendanceParams): Promise<PageResult<Attendance>> {
      const queryParams: Record<string, string> = {
        lesson_unique_id: lessonUniqueId,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.attendanceType) queryParams['attendance_type'] = params.attendanceType;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/attendances', { params: queryParams });
      return decodePageResult(response, attendanceMapper);
    },

    async listByStudent(studentUniqueId: string, params?: ListAttendanceParams): Promise<PageResult<Attendance>> {
      const queryParams: Record<string, string> = {
        student_unique_id: studentUniqueId,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.courseUniqueId) queryParams['course_unique_id'] = params.courseUniqueId;
      if (params?.attendanceType) queryParams['attendance_type'] = params.attendanceType;
      if (params?.dateFrom) queryParams['date_from'] = params.dateFrom;
      if (params?.dateTo) queryParams['date_to'] = params.dateTo;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/attendances', { params: queryParams });
      return decodePageResult(response, attendanceMapper);
    },

    async listByCourse(courseUniqueId: string, params?: ListAttendanceParams): Promise<PageResult<Attendance>> {
      const queryParams: Record<string, string> = {
        course_unique_id: courseUniqueId,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.studentUniqueId) queryParams['student_unique_id'] = params.studentUniqueId;
      if (params?.attendanceType) queryParams['attendance_type'] = params.attendanceType;
      if (params?.dateFrom) queryParams['date_from'] = params.dateFrom;
      if (params?.dateTo) queryParams['date_to'] = params.dateTo;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/attendances', { params: queryParams });
      return decodePageResult(response, attendanceMapper);
    },

    async getStudentStats(studentUniqueId: string, courseUniqueId?: string): Promise<AttendanceStats> {
      const params: Record<string, string> = {};
      if (courseUniqueId) params['course_unique_id'] = courseUniqueId;

      const response = await transport.get<Record<string, unknown>>(`/attendances/stats/${studentUniqueId}`, { params });
      return {
        totalLessons: Number(response.total_lessons ?? response.totalLessons ?? 0),
        present: Number(response.present ?? 0),
        absent: Number(response.absent ?? 0),
        late: Number(response.late ?? 0),
        excused: Number(response.excused ?? 0),
        attendanceRate: Number(response.attendance_rate ?? response.attendanceRate ?? 0),
      };
    },

    async verify(uniqueId: string): Promise<Attendance> {
      const response = await transport.put<unknown>(`/attendances/${uniqueId}/verify`, {});
      return decodeOne(response, attendanceMapper);
    },
  };
}
