import type { Transport } from '@23blocks/contracts';

export interface CreateVisitorRequest {
  uniqueId?: string;
  provider?: string;
  uid?: string;
  email?: string;
}

export interface Visitor {
  uniqueId: string;
  provider?: string;
  uid?: string;
  email?: string;
  createdAt: Date;
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
          unique_id: data.uniqueId,
          provider: data.provider,
          uid: data.uid,
          email: data.email,
        },
      });
      return {
        uniqueId: response.unique_id,
        provider: response.provider,
        uid: response.uid,
        email: response.email,
        createdAt: new Date(response.created_at),
      };
    },
  };
}
