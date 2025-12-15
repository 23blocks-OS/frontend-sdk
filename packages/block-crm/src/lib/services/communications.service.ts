import type { Transport } from '@23blocks/contracts';
import type { UnsubscribeRequest, UnsubscribeResponse } from '../types/communication';

export interface CommunicationsService {
  unsubscribe(data: UnsubscribeRequest): Promise<UnsubscribeResponse>;
}

export function createCommunicationsService(transport: Transport, _config: { appId: string }): CommunicationsService {
  return {
    async unsubscribe(data: UnsubscribeRequest): Promise<UnsubscribeResponse> {
      const response = await transport.post<any>('/communications/unsubscribe', {
        unsubscribe: {
          email: data.email,
          reason: data.reason,
          campaign_id: data.campaignId,
          payload: data.payload,
        },
      });
      return {
        success: response.success ?? true,
        email: response.email || data.email,
        unsubscribedAt: new Date(response.unsubscribed_at || Date.now()),
      };
    },
  };
}
