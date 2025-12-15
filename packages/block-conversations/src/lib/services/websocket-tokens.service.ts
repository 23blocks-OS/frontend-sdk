import type { Transport } from '@23blocks/contracts';
import type {
  CreateWebSocketTokenRequest,
  CreateWebSocketTokenResponse,
} from '../types/websocket-token';

export interface WebSocketTokensService {
  create(data?: CreateWebSocketTokenRequest): Promise<CreateWebSocketTokenResponse>;
}

export function createWebSocketTokensService(transport: Transport, _config: { appId: string }): WebSocketTokensService {
  return {
    async create(data?: CreateWebSocketTokenRequest): Promise<CreateWebSocketTokenResponse> {
      const response = await transport.post<{ data: CreateWebSocketTokenResponse }>('/api/websocket_tokens', {
        websocket_token: {
          channel: data?.channel,
          user_id: data?.userId,
        },
      });

      const result = response.data;
      return {
        token: result.token,
        expiresAt: result.expiresAt ? new Date(result.expiresAt as unknown as string) : undefined,
        channel: result.channel,
        url: result.url,
      };
    },
  };
}
