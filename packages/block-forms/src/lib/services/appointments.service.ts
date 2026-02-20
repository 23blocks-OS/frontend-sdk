import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Appointment,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  ListAppointmentsParams,
  AppointmentReportRequest,
  AppointmentReportSummary,
} from '../types/appointment.js';
import { appointmentMapper } from '../mappers/appointment.mapper.js';

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

export function createAppointmentsService(transport: Transport, _config: { apiKey: string }): AppointmentsService {
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
          middle_name: data.middleName,
          last_name: data.lastName,
          phone_number: data.phoneNumber,
          selected_option: data.selectedOption,
          form_fields: data.formFields,
          start_at: data.startAt instanceof Date ? data.startAt.toISOString() : data.startAt,
          end_at: data.endAt instanceof Date ? data.endAt.toISOString() : data.endAt,
          duration: data.duration,
          location_unique_id: data.locationUniqueId,
          location_name: data.locationName,
          location_address: data.locationAddress,
          assigned_to_unique_id: data.assignedToUniqueId,
          assigned_to_name: data.assignedToName,
          assigned_to_email: data.assignedToEmail,
          assigned_to_phone: data.assignedToPhone,
          notes: data.notes,
          source: data.source,
          source_alias: data.sourceAlias,
          source_id: data.sourceId,
          source_type: data.sourceType,
          visitor_unique_id: data.visitorUniqueId,
          visitor_type: data.visitorType,
          touch_id: data.touchId,
          touch_reference_id: data.touchReferenceId,
        },
      });
      return decodeOne(response, appointmentMapper);
    },

    async update(formUniqueId: string, uniqueId: string, data: UpdateAppointmentRequest): Promise<Appointment> {
      const response = await transport.put<unknown>(`/appointments/${formUniqueId}/instances/${uniqueId}`, {
        appointment: {
          email: data.email,
          first_name: data.firstName,
          middle_name: data.middleName,
          last_name: data.lastName,
          phone_number: data.phoneNumber,
          selected_option: data.selectedOption,
          form_fields: data.formFields,
          start_at: data.startAt instanceof Date ? data.startAt.toISOString() : data.startAt,
          end_at: data.endAt instanceof Date ? data.endAt.toISOString() : data.endAt,
          duration: data.duration,
          location_unique_id: data.locationUniqueId,
          location_name: data.locationName,
          location_address: data.locationAddress,
          assigned_to_unique_id: data.assignedToUniqueId,
          assigned_to_name: data.assignedToName,
          assigned_to_email: data.assignedToEmail,
          assigned_to_phone: data.assignedToPhone,
          notes: data.notes,
          source: data.source,
          source_alias: data.sourceAlias,
          source_id: data.sourceId,
          source_type: data.sourceType,
          visitor_unique_id: data.visitorUniqueId,
          visitor_type: data.visitorType,
          touch_id: data.touchId,
          touch_reference_id: data.touchReferenceId,
          status: data.status,
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
        query_params: {
          form_unique_id: data.formUniqueId,
          user_unique_id: data.userUniqueId,
          source: data.source,
          date_part: data.datePart,
          from_date: data.fromDate instanceof Date ? data.fromDate.toISOString() : data.fromDate,
          to_date: data.toDate instanceof Date ? data.toDate.toISOString() : data.toDate,
          status: data.status,
          page: data.page,
          records: data.records,
        },
      });
      const result = decodePageResult(response, appointmentMapper);
      return result.data;
    },

    async reportSummary(data: AppointmentReportRequest): Promise<AppointmentReportSummary> {
      const response = await transport.post<unknown>('/reports/appointments/summary', {
        query_params: {
          form_unique_id: data.formUniqueId,
          user_unique_id: data.userUniqueId,
          source: data.source,
          date_part: data.datePart,
          from_date: data.fromDate instanceof Date ? data.fromDate.toISOString() : data.fromDate,
          to_date: data.toDate instanceof Date ? data.toDate.toISOString() : data.toDate,
          status: data.status,
          page: data.page,
          records: data.records,
        },
      });
      return response as AppointmentReportSummary;
    },
  };
}
