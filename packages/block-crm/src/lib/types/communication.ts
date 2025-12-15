export interface UnsubscribeRequest {
  email: string;
  reason?: string;
  campaignId?: string;
  payload?: Record<string, unknown>;
}

export interface UnsubscribeResponse {
  success: boolean;
  email: string;
  unsubscribedAt: Date;
}
