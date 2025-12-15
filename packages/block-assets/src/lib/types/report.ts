export interface EventReportParams {
  startDate?: string;
  endDate?: string;
  eventType?: string;
  assetUniqueId?: string;
  page?: number;
  perPage?: number;
}

export interface EventReportSummary {
  totalEvents: number;
  eventsByType: Record<string, number>;
  period: {
    startDate: Date;
    endDate: Date;
  };
}

export interface EventReportItem {
  uniqueId: string;
  assetUniqueId: string;
  eventType: string;
  description?: string;
  occurredAt: Date;
}

export interface EventReportList {
  events: EventReportItem[];
  summary: EventReportSummary;
  meta: {
    totalCount: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}
