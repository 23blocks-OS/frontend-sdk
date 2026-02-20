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
  /**
   * List all appointments for a form
   * @param formUniqueId - The unique identifier of the parent form
   * @param params - Optional filtering by status, date range, and pagination
   * @returns Paginated result containing Appointment items and metadata
   */
  list(formUniqueId: string, params?: ListAppointmentsParams): Promise<PageResult<Appointment>>;

  /**
   * Get a specific appointment
   * @param formUniqueId - The unique identifier of the parent form
   * @param uniqueId - The unique identifier of the appointment
   * @returns The matching Appointment record
   */
  get(formUniqueId: string, uniqueId: string): Promise<Appointment>;

  /**
   * Create a new appointment
   * @param formUniqueId - The unique identifier of the parent form
   * @param data - Appointment details including contact info, schedule, and location
   * @returns The newly created Appointment record
   */
  create(formUniqueId: string, data: CreateAppointmentRequest): Promise<Appointment>;

  /**
   * Update an existing appointment
   * @param formUniqueId - The unique identifier of the parent form
   * @param uniqueId - The unique identifier of the appointment to update
   * @param data - Fields to update such as schedule, contact info, or status
   * @returns The updated Appointment record
   */
  update(formUniqueId: string, uniqueId: string, data: UpdateAppointmentRequest): Promise<Appointment>;

  /**
   * Delete an appointment
   * @param formUniqueId - The unique identifier of the parent form
   * @param uniqueId - The unique identifier of the appointment to delete
   * @returns Resolves when the appointment has been deleted
   */
  delete(formUniqueId: string, uniqueId: string): Promise<void>;

  /**
   * Confirm an appointment
   * @param formUniqueId - The unique identifier of the parent form
   * @param uniqueId - The unique identifier of the appointment to confirm
   * @returns The updated Appointment record with confirmed status
   */
  confirm(formUniqueId: string, uniqueId: string): Promise<Appointment>;

  /**
   * Cancel an appointment
   * @param formUniqueId - The unique identifier of the parent form
   * @param uniqueId - The unique identifier of the appointment to cancel
   * @returns The updated Appointment record with cancelled status
   */
  cancel(formUniqueId: string, uniqueId: string): Promise<Appointment>;

  /**
   * Generate an appointment report list
   * @param data - Report criteria including form, date range, status, and grouping
   * @returns Array of Appointment records matching the report criteria
   */
  reportList(data: AppointmentReportRequest): Promise<Appointment[]>;

  /**
   * Generate an appointment report summary
   * @param data - Report criteria including form, date range, status, and grouping
   * @returns Aggregated summary statistics for matching appointments
   */
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
