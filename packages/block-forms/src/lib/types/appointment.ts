import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Appointment extends IdentityCore {
  formUniqueId: string;
  userUniqueId?: string;
  email?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phoneNumber?: string;
  selectedOption?: string;
  formFields?: Record<string, unknown>;
  startAt: Date;
  endAt?: Date;
  duration?: number;
  locationUniqueId?: string;
  locationName?: string;
  locationAddress?: string;
  assignedToUniqueId?: string;
  assignedToName?: string;
  assignedToEmail?: string;
  assignedToPhone?: string;
  notes?: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  visitorUniqueId?: string;
  visitorType?: string;
  touchId?: string;
  touchReferenceId?: string;
  status: EntityStatus;
  confirmedAt?: Date;
  cancelledAt?: Date;
  payload?: Record<string, unknown>;
}

export interface CreateAppointmentRequest {
  formUniqueId?: string;
  email?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phoneNumber?: string;
  selectedOption?: string;
  formFields?: Record<string, unknown>;
  startAt: string | Date;
  endAt?: string | Date;
  duration?: number;
  locationUniqueId?: string;
  locationName?: string;
  locationAddress?: string;
  assignedToUniqueId?: string;
  assignedToName?: string;
  assignedToEmail?: string;
  assignedToPhone?: string;
  notes?: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  visitorUniqueId?: string;
  visitorType?: string;
  touchId?: string;
  touchReferenceId?: string;
}

export interface UpdateAppointmentRequest {
  email?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phoneNumber?: string;
  selectedOption?: string;
  formFields?: Record<string, unknown>;
  startAt?: string | Date;
  endAt?: string | Date;
  duration?: number;
  locationUniqueId?: string;
  locationName?: string;
  locationAddress?: string;
  assignedToUniqueId?: string;
  assignedToName?: string;
  assignedToEmail?: string;
  assignedToPhone?: string;
  notes?: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  visitorUniqueId?: string;
  visitorType?: string;
  touchId?: string;
  touchReferenceId?: string;
  status?: EntityStatus;
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
  userUniqueId?: string;
  source?: string;
  datePart?: string;
  fromDate?: string | Date;
  toDate?: string | Date;
  status?: EntityStatus;
  page?: number;
  records?: number;
}

export interface AppointmentReportSummary {
  total: number;
  confirmed: number;
  cancelled: number;
  pending: number;
  byDate?: Record<string, number>;
}
