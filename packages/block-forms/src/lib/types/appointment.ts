import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Appointment extends IdentityCore {
  formUniqueId: string;
  userUniqueId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  scheduledAt: Date;
  duration?: number;
  timezone?: string;
  location?: string;
  notes?: string;
  data: Record<string, unknown>;
  status: EntityStatus;
  confirmedAt?: Date;
  cancelledAt?: Date;
  payload?: Record<string, unknown>;
}

export interface CreateAppointmentRequest {
  formUniqueId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  scheduledAt: string | Date;
  duration?: number;
  timezone?: string;
  location?: string;
  notes?: string;
  data?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface UpdateAppointmentRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  scheduledAt?: string | Date;
  duration?: number;
  timezone?: string;
  location?: string;
  notes?: string;
  data?: Record<string, unknown>;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListAppointmentsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  fromDate?: string | Date;
  toDate?: string | Date;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AppointmentReportRequest {
  formUniqueId?: string;
  fromDate?: string | Date;
  toDate?: string | Date;
  status?: EntityStatus;
  groupBy?: string;
}

export interface AppointmentReportSummary {
  total: number;
  confirmed: number;
  cancelled: number;
  pending: number;
  byDate?: Record<string, number>;
}
