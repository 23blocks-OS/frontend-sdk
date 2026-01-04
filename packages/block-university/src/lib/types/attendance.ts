import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Attendance extends IdentityCore {
  lessonUniqueId: string;
  courseUniqueId: string;
  studentUniqueId: string;
  enrollmentUniqueId?: string;
  attendanceType: 'present' | 'absent' | 'late' | 'excused';
  attendedAt?: Date;
  duration?: number;
  notes?: string;
  verifiedByUniqueId?: string;
  verifiedAt?: Date;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface CreateAttendanceRequest {
  lessonUniqueId: string;
  studentUniqueId: string;
  attendanceType: 'present' | 'absent' | 'late' | 'excused';
  attendedAt?: string;
  duration?: number;
  notes?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateAttendanceRequest {
  attendanceType?: 'present' | 'absent' | 'late' | 'excused';
  attendedAt?: string;
  duration?: number;
  notes?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListAttendanceParams {
  page?: number;
  perPage?: number;
  lessonUniqueId?: string;
  courseUniqueId?: string;
  studentUniqueId?: string;
  attendanceType?: 'present' | 'absent' | 'late' | 'excused';
  dateFrom?: string;
  dateTo?: string;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BulkAttendanceRequest {
  lessonUniqueId: string;
  attendances: {
    studentUniqueId: string;
    attendanceType: 'present' | 'absent' | 'late' | 'excused';
    notes?: string;
  }[];
}

export interface AttendanceStats {
  totalLessons: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRate: number;
}
