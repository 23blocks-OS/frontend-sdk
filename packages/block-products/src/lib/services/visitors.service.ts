import type { Transport } from '@23blocks/contracts';

export interface CreateVisitorRequest {
  sessionId?: string;
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
  landingPage?: string;
  payload?: Record<string, unknown>;
}

export interface Visitor {
  uniqueId: string;
  sessionId: string;
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
  landingPage?: string;
  createdAt: Date;
  payload?: Record<string, unknown>;
}

export interface VisitorsService {
  /**
   * Create a new visitor tracking record.
   * @param data - Visitor details including optional session ID, user agent, IP, referrer, and landing page
   * @returns The newly created Visitor with assigned uniqueId and sessionId
   */
  create(data: CreateVisitorRequest): Promise<Visitor>;
}

export function createVisitorsService(transport: Transport, _config: { apiKey: string }): VisitorsService {
  return {
    async create(data: CreateVisitorRequest): Promise<Visitor> {
      const response = await transport.post<any>('/visitors', {
        visitor: {
          session_id: data.sessionId,
          user_agent: data.userAgent,
          ip_address: data.ipAddress,
          referrer: data.referrer,
          landing_page: data.landingPage,
          payload: data.payload,
        },
      });
      return {
        uniqueId: response.unique_id,
        sessionId: response.session_id,
        userAgent: response.user_agent,
        ipAddress: response.ip_address,
        referrer: response.referrer,
        landingPage: response.landing_page,
        createdAt: new Date(response.created_at),
        payload: response.payload,
      };
    },
  };
}
