import type { Transport } from '@23blocks/contracts';
import type { UnsubscribeRequest, UnsubscribeResponse } from '../types/communication.js';

export interface CommunicationsService {
  /**
   * Unsubscribe an email address from communications.
   * @param data - The unsubscribe request containing email, optional reason, and campaign ID.
   * @returns An UnsubscribeResponse with success status, email, and unsubscription timestamp.
   */
  unsubscribe(data: UnsubscribeRequest): Promise<UnsubscribeResponse>;
}

export function createCommunicationsService(transport: Transport, _config: { apiKey: string }): CommunicationsService {
  return {
    async unsubscribe(data: UnsubscribeRequest): Promise<UnsubscribeResponse> {
      const response = await transport.post<any>('/communications/unsubscribe', {
        email: data.email,
      });
      return {
        success: response.success ?? true,
        email: response.email || data.email,
        unsubscribedAt: new Date(response.unsubscribed_at || Date.now()),
      };
    },
  };
}
