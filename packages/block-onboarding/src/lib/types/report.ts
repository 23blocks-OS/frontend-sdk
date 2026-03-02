export interface UserJourneyReportParams {
  start_at?: string;
  end_at?: string;
  onboarding_unique_id?: string;
  user_unique_id?: string;
  step_unique_id?: string;
  source?: string;
  status?: string;
  group_by?: string;
  date_part?: string;
  page?: number;
  records?: number;
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
