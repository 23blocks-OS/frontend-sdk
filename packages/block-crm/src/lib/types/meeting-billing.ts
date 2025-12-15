import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface MeetingBilling extends IdentityCore {
  meetingUniqueId: string;
  participantUniqueId?: string;
  participantEmail?: string;
  payerName?: string;
  amount?: number;
  currency?: string;
  billingStatus?: string;
  paidAt?: Date;
  dueAt?: Date;
  notes?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface PaymentSplit {
  participantUniqueId: string;
  participantEmail?: string;
  payerName?: string;
  amount: number;
  percentage: number;
}

export interface EapSession {
  participantEmail: string;
  payerName: string;
  sessionCount: number;
  totalAmount: number;
  remainingSessions: number;
}

export interface OutstandingByPayer {
  payerName: string;
  totalOutstanding: number;
  billingsCount: number;
}

// Request types
export interface CreateMeetingBillingRequest {
  participantUniqueId?: string;
  participantEmail?: string;
  payerName?: string;
  amount?: number;
  currency?: string;
  billingStatus?: string;
  dueAt?: Date;
  notes?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateMeetingBillingRequest {
  participantUniqueId?: string;
  participantEmail?: string;
  payerName?: string;
  amount?: number;
  currency?: string;
  billingStatus?: string;
  paidAt?: Date;
  dueAt?: Date;
  notes?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListMeetingBillingsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  billingStatus?: string;
  payerName?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Report types
export interface BillingRevenueReport {
  totalRevenue: number;
  paidAmount: number;
  outstandingAmount: number;
  billingsCount: number;
  period?: string;
}

export interface BillingAgingReport {
  current: number;
  thirtyDays: number;
  sixtyDays: number;
  ninetyDays: number;
  overNinetyDays: number;
  total: number;
}

export interface BillingParticipantReport {
  participantEmail: string;
  totalBilled: number;
  totalPaid: number;
  outstanding: number;
  sessionsCount: number;
}
