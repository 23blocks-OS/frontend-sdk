import type { Transport } from '@23blocks/contracts';
import type {
  BillingReportParams,
  RevenueReport,
  AgingReport,
  ParticipantBillingReport,
} from '../types/billing-report';

export interface BillingReportsService {
  getRevenueReport(params?: BillingReportParams): Promise<RevenueReport>;
  getAgingReport(): Promise<AgingReport>;
  getParticipantReport(participantEmail: string): Promise<ParticipantBillingReport>;
}

export function createBillingReportsService(transport: Transport, _config: { appId: string }): BillingReportsService {
  return {
    async getRevenueReport(params?: BillingReportParams): Promise<RevenueReport> {
      const queryParams: Record<string, string> = {};
      if (params?.startDate) queryParams['start_date'] = params.startDate;
      if (params?.endDate) queryParams['end_date'] = params.endDate;
      if (params?.status) queryParams['status'] = params.status;

      const response = await transport.get<any>('/billings/reports/revenue', { params: queryParams });
      return {
        totalRevenue: response.total_revenue,
        totalBilled: response.total_billed,
        totalPaid: response.total_paid,
        totalOutstanding: response.total_outstanding,
        currency: response.currency,
        period: {
          startDate: new Date(response.period.start_date),
          endDate: new Date(response.period.end_date),
        },
        breakdown: {
          byMonth: response.breakdown.by_month,
          byStatus: response.breakdown.by_status,
        },
      };
    },

    async getAgingReport(): Promise<AgingReport> {
      const response = await transport.get<any>('/billings/reports/aging');
      return {
        current: response.current,
        thirtyDays: response.thirty_days,
        sixtyDays: response.sixty_days,
        ninetyDays: response.ninety_days,
        over90Days: response.over_90_days,
        total: response.total,
        items: (response.items || []).map((i: any) => ({
          billingUniqueId: i.billing_unique_id,
          accountName: i.account_name,
          contactName: i.contact_name,
          amount: i.amount,
          dueDate: new Date(i.due_date),
          daysOutstanding: i.days_outstanding,
        })),
      };
    },

    async getParticipantReport(participantEmail: string): Promise<ParticipantBillingReport> {
      const response = await transport.get<any>(`/billings/reports/participant/${encodeURIComponent(participantEmail)}`);
      return {
        participantEmail: response.participant_email,
        totalBilled: response.total_billed,
        totalPaid: response.total_paid,
        totalOutstanding: response.total_outstanding,
        sessions: (response.sessions || []).map((s: any) => ({
          meetingUniqueId: s.meeting_unique_id,
          date: new Date(s.date),
          amount: s.amount,
          status: s.status,
        })),
      };
    },
  };
}
