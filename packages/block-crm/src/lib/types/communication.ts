export interface UnsubscribeRequest {
  email: string;
}

export interface UnsubscribeResponse {
  success: boolean;
  email: string;
  unsubscribedAt: Date;
}
