export interface BillingReportParams {
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface RevenueReport {
  totalRevenue: number;
  totalBilled: number;
  totalPaid: number;
  totalOutstanding: number;
  currency: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  breakdown: {
    byMonth: Record<string, number>;
    byStatus: Record<string, number>;
  };
}

export interface AgingReport {
  current: number;
  thirtyDays: number;
  sixtyDays: number;
  ninetyDays: number;
  over90Days: number;
  total: number;
  items: AgingItem[];
}

export interface AgingItem {
  billingUniqueId: string;
  accountName?: string;
  contactName?: string;
  amount: number;
  dueDate: Date;
  daysOutstanding: number;
}

export interface ParticipantBillingReport {
  participantEmail: string;
  totalBilled: number;
  totalPaid: number;
  totalOutstanding: number;
  sessions: ParticipantSession[];
}

export interface ParticipantSession {
  meetingUniqueId: string;
  date: Date;
  amount: number;
  status: string;
}
