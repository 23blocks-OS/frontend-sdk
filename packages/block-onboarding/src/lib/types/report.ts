export interface UserJourneyReportParams {
  startDate?: string;
  endDate?: string;
  onboardingUniqueId?: string;
  status?: string;
  page?: number;
  perPage?: number;
}

export interface UserJourneyReportItem {
  uniqueId: string;
  userUniqueId: string;
  onboardingName: string;
  progress: number;
  status: string;
  startedAt: Date;
  completedAt?: Date;
}

export interface UserJourneyReportSummary {
  totalJourneys: number;
  totalCompleted: number;
  totalAbandoned: number;
  totalActive: number;
  averageProgress: number;
  completionRate: number;
  journeysByStatus: Record<string, number>;
  period: {
    startDate: Date;
    endDate: Date;
  };
}

export interface UserJourneyReportList {
  journeys: UserJourneyReportItem[];
  summary: UserJourneyReportSummary;
  meta: {
    totalCount: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}
