import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  ListAppointmentsParams,
  AppointmentReportRequest,
  AppointmentReportSummary,
} from '../types/appointment';
import { appointmentMapper } from '../mappers/appointment.mapper';

export interface AppointmentsService {
  list(formUniqueId: string, params?: ListAppointmentsParams): Promise<PageResult<Appointment>>;
  get(formUniqueId: string, uniqueId: string): Promise<Appointment>;
  create(formUniqueId: string, data: CreateAppointmentRequest): Promise<Appointment>;
  update(formUniqueId: string, uniqueId: string, data: UpdateAppointmentRequest): Promise<Appointment>;
  delete(formUniqueId: string, uniqueId: string): Promise<void>;
  confirm(formUniqueId: string, uniqueId: string): Promise<Appointment>;
  cancel(formUniqueId: string, uniqueId: string): Promise<Appointment>;
  reportList(data: AppointmentReportRequest): Promise<Appointment[]>;
  reportSummary(data: AppointmentReportRequest): Promise<AppointmentReportSummary>;
}

export function createAppointmentsService(transport: Transport, _config: { appId: string }): AppointmentsService {
  return {
    async list(formUniqueId: string, params?: ListAppointmentsParams): Promise<PageResult<Appointment>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.fromDate) queryParams['from_date'] = params.fromDate instanceof Date ? params.fromDate.toISOString() : params.fromDate;
      if (params?.toDate) queryParams['to_date'] = params.toDate instanceof Date ? params.toDate.toISOString() : params.toDate;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/appointments/${formUniqueId}/instances`, { params: queryParams });
      return decodePageResult(response, appointmentMapper);
    },

    async get(formUniqueId: string, uniqueId: string): Promise<Appointment> {
      const response = await transport.get<unknown>(`/appointments/${formUniqueId}/instances/${uniqueId}`);
      return decodeOne(response, appointmentMapper);
    },

    async create(formUniqueId: string, data: CreateAppointmentRequest): Promise<Appointment> {
      const response = await transport.post<unknown>(`/appointments/${formUniqueId}/instances`, {
        appointment: {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          scheduled_at: data.scheduledAt instanceof Date ? data.scheduledAt.toISOString() : data.scheduledAt,
          duration: data.duration,
          timezone: data.timezone,
          location: data.location,
          notes: data.notes,
          data: data.data,
          payload: data.payload,
        },
      });
      return decodeOne(response, appointmentMapper);
    },

    async update(formUniqueId: string, uniqueId: string, data: UpdateAppointmentRequest): Promise<Appointment> {
      const response = await transport.put<unknown>(`/appointments/${formUniqueId}/instances/${uniqueId}`, {
        appointment: {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          scheduled_at: data.scheduledAt instanceof Date ? data.scheduledAt.toISOString() : data.scheduledAt,
          duration: data.duration,
          timezone: data.timezone,
          location: data.location,
          notes: data.notes,
          data: data.data,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, appointmentMapper);
    },

    async delete(formUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/appointments/${formUniqueId}/instances/${uniqueId}`);
    },

    async confirm(formUniqueId: string, uniqueId: string): Promise<Appointment> {
      const response = await transport.post<unknown>(`/appointments/${formUniqueId}/instances/${uniqueId}/confirm`, {});
      return decodeOne(response, appointmentMapper);
    },

    async cancel(formUniqueId: string, uniqueId: string): Promise<Appointment> {
      const response = await transport.post<unknown>(`/appointments/${formUniqueId}/instances/${uniqueId}/cancel`, {});
      return decodeOne(response, appointmentMapper);
    },

    async reportList(data: AppointmentReportRequest): Promise<Appointment[]> {
      const response = await transport.post<unknown>('/reports/appointments/list', {
        report: {
          form_unique_id: data.formUniqueId,
          from_date: data.fromDate instanceof Date ? data.fromDate.toISOString() : data.fromDate,
          to_date: data.toDate instanceof Date ? data.toDate.toISOString() : data.toDate,
          status: data.status,
          group_by: data.groupBy,
        },
      });
      const result = decodePageResult(response, appointmentMapper);
      return result.data;
    },

    async reportSummary(data: AppointmentReportRequest): Promise<AppointmentReportSummary> {
      const response = await transport.post<unknown>('/reports/appointments/summary', {
        report: {
          form_unique_id: data.formUniqueId,
          from_date: data.fromDate instanceof Date ? data.fromDate.toISOString() : data.fromDate,
          to_date: data.toDate instanceof Date ? data.toDate.toISOString() : data.toDate,
          status: data.status,
          group_by: data.groupBy,
        },
      });
      return response as AppointmentReportSummary;
    },
  };
}
