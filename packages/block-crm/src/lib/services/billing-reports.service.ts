import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type {
  BillingReportParams,
  RevenueReport,
  AgingReport,
  ParticipantBillingReport,
} from '../types/billing-report.js';
import { revenueReportMapper, agingReportMapper, participantBillingReportMapper } from '../mappers/billing-report.mapper.js';

export interface BillingReportsService {
  /**
   * Retrieve the revenue report with optional date range and status filtering.
   * @param params - Optional date range and status filters.
   * @returns A RevenueReport containing totals, period info, and breakdowns by month and status.
   */
  getRevenueReport(params?: BillingReportParams): Promise<RevenueReport>;

  /**
   * Retrieve the aging report for outstanding billings.
   * @returns An AgingReport with amounts bucketed by days outstanding (current, 30, 60, 90, 90+) and individual items.
   */
  getAgingReport(): Promise<AgingReport>;

  /**
   * Retrieve billing report for a specific participant.
   * @param participantEmail - The email address of the participant.
   * @returns A ParticipantBillingReport with billing totals and session details for the participant.
   */
  getParticipantReport(participantEmail: string): Promise<ParticipantBillingReport>;
}

export function createBillingReportsService(transport: Transport, _config: { apiKey: string }): BillingReportsService {
  return {
    async getRevenueReport(params?: BillingReportParams): Promise<RevenueReport> {
      const queryParams: Record<string, string> = {};
      if (params?.startDate) queryParams['start_date'] = params.startDate;
      if (params?.endDate) queryParams['end_date'] = params.endDate;
      if (params?.status) queryParams['status'] = params.status;

      const response = await transport.get<unknown>('/billings/reports/revenue', { params: queryParams });
      return decodeOne(response, revenueReportMapper);
    },

    async getAgingReport(): Promise<AgingReport> {
      const response = await transport.get<unknown>('/billings/reports/aging');
      return decodeOne(response, agingReportMapper);
    },

    async getParticipantReport(participantEmail: string): Promise<ParticipantBillingReport> {
      const response = await transport.get<unknown>(`/billings/reports/participant/${encodeURIComponent(participantEmail)}`);
      return decodeOne(response, participantBillingReportMapper);
    },
  };
}
