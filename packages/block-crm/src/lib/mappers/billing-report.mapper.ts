import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { RevenueReport, AgingReport, AgingItem, ParticipantBillingReport, ParticipantSession } from '../types/billing-report.js';
import { parseString, parseDate, parseNumber } from './utils.js';

export const revenueReportMapper: ResourceMapper<RevenueReport> = {
  type: 'revenue_report',
  map: (resource) => {
    const period = (resource.attributes['period'] || {}) as Record<string, unknown>;
    const breakdown = (resource.attributes['breakdown'] || {}) as Record<string, unknown>;
    return {
      totalRevenue: parseNumber(resource.attributes['total_revenue']),
      totalBilled: parseNumber(resource.attributes['total_billed']),
      totalPaid: parseNumber(resource.attributes['total_paid']),
      totalOutstanding: parseNumber(resource.attributes['total_outstanding']),
      currency: parseString(resource.attributes['currency']) || 'USD',
      period: {
        startDate: parseDate(period['start_date']),
        endDate: parseDate(period['end_date']),
      },
      breakdown: {
        byMonth: (breakdown['by_month'] || {}) as Record<string, number>,
        byStatus: (breakdown['by_status'] || {}) as Record<string, number>,
      },
    };
  },
};

export const agingReportMapper: ResourceMapper<AgingReport> = {
  type: 'aging_report',
  map: (resource) => ({
    current: parseNumber(resource.attributes['current']),
    thirtyDays: parseNumber(resource.attributes['thirty_days']),
    sixtyDays: parseNumber(resource.attributes['sixty_days']),
    ninetyDays: parseNumber(resource.attributes['ninety_days']),
    over90Days: parseNumber(resource.attributes['over_90_days']),
    total: parseNumber(resource.attributes['total']),
    items: parseAgingItems(resource.attributes['items']),
  }),
};

function parseAgingItems(value: unknown): AgingItem[] {
  if (!Array.isArray(value)) return [];
  return value.map((i: Record<string, unknown>) => ({
    billingUniqueId: String(i['billing_unique_id'] || ''),
    accountName: i['account_name'] ? String(i['account_name']) : undefined,
    contactName: i['contact_name'] ? String(i['contact_name']) : undefined,
    amount: Number(i['amount'] || 0),
    dueDate: new Date(i['due_date'] as string),
    daysOutstanding: Number(i['days_outstanding'] || 0),
  }));
}

export const participantBillingReportMapper: ResourceMapper<ParticipantBillingReport> = {
  type: 'participant_billing_report',
  map: (resource) => ({
    participantEmail: parseString(resource.attributes['participant_email']) || '',
    totalBilled: parseNumber(resource.attributes['total_billed']),
    totalPaid: parseNumber(resource.attributes['total_paid']),
    totalOutstanding: parseNumber(resource.attributes['total_outstanding']),
    sessions: parseSessions(resource.attributes['sessions']),
  }),
};

function parseSessions(value: unknown): ParticipantSession[] {
  if (!Array.isArray(value)) return [];
  return value.map((s: Record<string, unknown>) => ({
    meetingUniqueId: String(s['meeting_unique_id'] || ''),
    date: new Date(s['date'] as string),
    amount: Number(s['amount'] || 0),
    status: String(s['status'] || ''),
  }));
}
