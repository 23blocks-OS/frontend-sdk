import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  MeetingBilling,
  CreateMeetingBillingRequest,
  UpdateMeetingBillingRequest,
  ListMeetingBillingsParams,
  PaymentSplit,
  EapSession,
  OutstandingByPayer,
  BillingRevenueReport,
  BillingAgingReport,
  BillingParticipantReport,
} from '../types/meeting-billing.js';
import { meetingBillingMapper } from '../mappers/meeting-billing.mapper.js';

export interface MeetingBillingsService {
  /**
   * List billing records for a specific meeting with optional filtering, pagination, and sorting.
   * @param meetingUniqueId - The unique identifier of the parent meeting.
   * @param params - Optional filtering (status, billingStatus, payerName, search), pagination, and sorting.
   * @returns Paginated result containing MeetingBilling objects and metadata.
   */
  list(meetingUniqueId: string, params?: ListMeetingBillingsParams): Promise<PageResult<MeetingBilling>>;

  /**
   * Retrieve a single billing record by its unique identifier.
   * @param uniqueId - The unique identifier of the billing record.
   * @returns The matching MeetingBilling object.
   */
  get(uniqueId: string): Promise<MeetingBilling>;

  /**
   * Create a new billing record for a meeting.
   * @param meetingUniqueId - The unique identifier of the parent meeting.
   * @param data - The billing creation payload with participant, amount, currency, and due date.
   * @returns The newly created MeetingBilling object.
   */
  create(meetingUniqueId: string, data: CreateMeetingBillingRequest): Promise<MeetingBilling>;

  /**
   * Update an existing billing record.
   * @param uniqueId - The unique identifier of the billing record to update.
   * @param data - The fields to update on the billing record.
   * @returns The updated MeetingBilling object.
   * @note Uses PUT (not PATCH) as required by the 23blocks backend.
   */
  update(uniqueId: string, data: UpdateMeetingBillingRequest): Promise<MeetingBilling>;

  /**
   * Delete a billing record.
   * @param uniqueId - The unique identifier of the billing record to delete.
   * @returns Resolves when the billing record has been deleted.
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Retrieve the payment split breakdown for a billing record.
   * @param uniqueId - The unique identifier of the billing record.
   * @returns An array of PaymentSplit objects showing how the payment is distributed.
   */
  getPaymentSplit(uniqueId: string): Promise<PaymentSplit[]>;

  /**
   * Retrieve EAP (Employee Assistance Program) session details for a participant and payer.
   * @param participantEmail - The email address of the participant.
   * @param payerName - The name of the payer.
   * @returns An EapSession object with session details.
   */
  getEapSessions(participantEmail: string, payerName: string): Promise<EapSession>;

  /**
   * Retrieve outstanding billing amounts grouped by payer.
   * @returns An array of OutstandingByPayer objects with payer names and amounts.
   */
  getOutstandingByPayer(): Promise<OutstandingByPayer[]>;

  /**
   * Retrieve the billing revenue report.
   * @returns A BillingRevenueReport with revenue totals and breakdowns.
   */
  getRevenueReport(): Promise<BillingRevenueReport>;

  /**
   * Retrieve the billing aging report.
   * @returns A BillingAgingReport with amounts bucketed by days outstanding.
   */
  getAgingReport(): Promise<BillingAgingReport>;

  /**
   * Retrieve billing report for a specific participant.
   * @param participantEmail - The email address of the participant.
   * @returns A BillingParticipantReport with billing totals and session details.
   */
  getParticipantReport(participantEmail: string): Promise<BillingParticipantReport>;
}

export function createMeetingBillingsService(transport: Transport, _config: { apiKey: string }): MeetingBillingsService {
  return {
    async list(meetingUniqueId: string, params?: ListMeetingBillingsParams): Promise<PageResult<MeetingBilling>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.billingStatus) queryParams['billing_status'] = params.billingStatus;
      if (params?.payerName) queryParams['payer_name'] = params.payerName;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/meetings/${meetingUniqueId}/billing`, { params: queryParams });
      return decodePageResult(response, meetingBillingMapper);
    },

    async get(uniqueId: string): Promise<MeetingBilling> {
      const response = await transport.get<unknown>(`/billings/${uniqueId}`);
      return decodeOne(response, meetingBillingMapper);
    },

    async create(meetingUniqueId: string, data: CreateMeetingBillingRequest): Promise<MeetingBilling> {
      const response = await transport.post<unknown>(`/meetings/${meetingUniqueId}/billing`, {
        billing: {
          participant_unique_id: data.participantUniqueId,
          participant_email: data.participantEmail,
          payer_name: data.payerName,
          amount: data.amount,
          currency: data.currency,
          billing_status: data.billingStatus,
          due_at: data.dueAt?.toISOString(),
          notes: data.notes,
          payload: data.payload,
        },
      });
      return decodeOne(response, meetingBillingMapper);
    },

    async update(uniqueId: string, data: UpdateMeetingBillingRequest): Promise<MeetingBilling> {
      const response = await transport.put<unknown>(`/billings/${uniqueId}`, {
        billing: {
          participant_unique_id: data.participantUniqueId,
          participant_email: data.participantEmail,
          payer_name: data.payerName,
          amount: data.amount,
          currency: data.currency,
          billing_status: data.billingStatus,
          paid_at: data.paidAt?.toISOString(),
          due_at: data.dueAt?.toISOString(),
          notes: data.notes,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, meetingBillingMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/billings/${uniqueId}`);
    },

    async getPaymentSplit(uniqueId: string): Promise<PaymentSplit[]> {
      const response = await transport.get<{ data: PaymentSplit[] }>(`/billings/${uniqueId}/payment_split`);
      return response.data || [];
    },

    async getEapSessions(participantEmail: string, payerName: string): Promise<EapSession> {
      const response = await transport.get<{ data: EapSession }>(`/billings/eap_sessions/${encodeURIComponent(participantEmail)}/${encodeURIComponent(payerName)}`);
      return response.data;
    },

    async getOutstandingByPayer(): Promise<OutstandingByPayer[]> {
      const response = await transport.get<{ data: OutstandingByPayer[] }>('/billings/outstanding_by_payer');
      return response.data || [];
    },

    async getRevenueReport(): Promise<BillingRevenueReport> {
      const response = await transport.get<{ data: BillingRevenueReport }>('/billings/reports/revenue');
      return response.data;
    },

    async getAgingReport(): Promise<BillingAgingReport> {
      const response = await transport.get<{ data: BillingAgingReport }>('/billings/reports/aging');
      return response.data;
    },

    async getParticipantReport(participantEmail: string): Promise<BillingParticipantReport> {
      const response = await transport.get<{ data: BillingParticipantReport }>(`/billings/reports/participant/${encodeURIComponent(participantEmail)}`);
      return response.data;
    },
  };
}
