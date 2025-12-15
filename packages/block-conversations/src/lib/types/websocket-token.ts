import type { IdentityCore } from '@23blocks/contracts';

export interface WebSocketToken extends IdentityCore {
  token: string;
  expiresAt?: Date;
  channel?: string;
}

export interface CreateWebSocketTokenRequest {
  channel?: string;
  userId?: string;
}

export interface CreateWebSocketTokenResponse {
  token: string;
  expiresAt?: Date;
  channel?: string;
  url?: string;
}
