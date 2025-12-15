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
} from '../types/meeting-billing';
import { meetingBillingMapper } from '../mappers/meeting-billing.mapper';

export interface MeetingBillingsService {
  list(meetingUniqueId: string, params?: ListMeetingBillingsParams): Promise<PageResult<MeetingBilling>>;
  get(uniqueId: string): Promise<MeetingBilling>;
  create(meetingUniqueId: string, data: CreateMeetingBillingRequest): Promise<MeetingBilling>;
  update(uniqueId: string, data: UpdateMeetingBillingRequest): Promise<MeetingBilling>;
  delete(uniqueId: string): Promise<void>;
  getPaymentSplit(uniqueId: string): Promise<PaymentSplit[]>;
  getEapSessions(participantEmail: string, payerName: string): Promise<EapSession>;
  getOutstandingByPayer(): Promise<OutstandingByPayer[]>;
  getRevenueReport(): Promise<BillingRevenueReport>;
  getAgingReport(): Promise<BillingAgingReport>;
  getParticipantReport(participantEmail: string): Promise<BillingParticipantReport>;
}

export function createMeetingBillingsService(transport: Transport, _config: { appId: string }): MeetingBillingsService {
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
