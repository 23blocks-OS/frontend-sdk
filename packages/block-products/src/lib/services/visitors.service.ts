import type { Transport } from '@23blocks/contracts';

export interface CreateVisitorRequest {
  uniqueId?: string;
  email?: string;
  username?: string;
  name?: string;
}

export interface Visitor {
  uniqueId: string;
  userUniqueId?: string;
  email?: string;
  username?: string;
  name?: string;
  status?: string;
  registeredAt?: Date;
  accessToken?: string;
  currentVisitingAt?: Date;
  currentVisitingIp?: string;
  lastVisitingAt?: Date;
  lastVisitingIp?: string;
}

export interface VisitorsService {
  /**
   * Create a new visitor (guest) record. The backend resolves the resource via
   * GuestSerializer; consumers commonly seed `uniqueId` and `email` and read
   * back the populated `accessToken` for downstream auth.
   *
   * @param data - Visitor details
   * @returns The newly created Visitor record
   */
  create(data: CreateVisitorRequest): Promise<Visitor>;
}

export function createVisitorsService(transport: Transport, _config: { apiKey: string }): VisitorsService {
  return {
    async create(data: CreateVisitorRequest): Promise<Visitor> {
      const response = await transport.post<{
        data: {
          attributes: {
            unique_id: string;
            user_unique_id?: string;
            email?: string;
            username?: string;
            name?: string;
            status?: string;
            registered_at?: string;
            access_token?: string;
            current_visiting_at?: string;
            current_visiting_ip?: string;
            last_visiting_at?: string;
            last_visiting_ip?: string;
          };
        };
      }>('/visitors', {
        visitor: {
          unique_id: data.uniqueId,
          email: data.email,
          username: data.username,
          name: data.name,
        },
      });
      const a = response.data.attributes;
      return {
        uniqueId: a.unique_id,
        userUniqueId: a.user_unique_id,
        email: a.email,
        username: a.username,
        name: a.name,
        status: a.status,
        registeredAt: a.registered_at ? new Date(a.registered_at) : undefined,
        accessToken: a.access_token,
        currentVisitingAt: a.current_visiting_at ? new Date(a.current_visiting_at) : undefined,
        currentVisitingIp: a.current_visiting_ip,
        lastVisitingAt: a.last_visiting_at ? new Date(a.last_visiting_at) : undefined,
        lastVisitingIp: a.last_visiting_ip,
      };
    },
  };
}
