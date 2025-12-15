import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  CalendarAccount,
  CreateCalendarAccountRequest,
  UpdateCalendarAccountRequest,
  ListCalendarAccountsParams,
  SyncCalendarRequest,
  SyncCalendarResponse,
} from '../types/calendar-account';
import { calendarAccountMapper } from '../mappers/calendar-account.mapper';

export interface CalendarAccountsService {
  list(userUniqueId: string, params?: ListCalendarAccountsParams): Promise<PageResult<CalendarAccount>>;
  get(userUniqueId: string, id: string): Promise<CalendarAccount>;
  create(userUniqueId: string, data: CreateCalendarAccountRequest): Promise<CalendarAccount>;
  update(userUniqueId: string, id: string, data: UpdateCalendarAccountRequest): Promise<CalendarAccount>;
  delete(userUniqueId: string, id: string): Promise<void>;
  syncUser(userUniqueId: string, request?: SyncCalendarRequest): Promise<SyncCalendarResponse>;
  syncTenant(request?: SyncCalendarRequest): Promise<SyncCalendarResponse>;
}

export function createCalendarAccountsService(transport: Transport, _config: { appId: string }): CalendarAccountsService {
  return {
    async list(userUniqueId: string, params?: ListCalendarAccountsParams): Promise<PageResult<CalendarAccount>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.provider) queryParams['provider'] = params.provider;
      if (params?.syncEnabled !== undefined) queryParams['sync_enabled'] = String(params.syncEnabled);
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/users/${userUniqueId}/calendar_accounts`, { params: queryParams });
      return decodePageResult(response, calendarAccountMapper);
    },

    async get(userUniqueId: string, id: string): Promise<CalendarAccount> {
      const response = await transport.get<unknown>(`/users/${userUniqueId}/calendar_accounts/${id}`);
      return decodeOne(response, calendarAccountMapper);
    },

    async create(userUniqueId: string, data: CreateCalendarAccountRequest): Promise<CalendarAccount> {
      const response = await transport.post<unknown>(`/users/${userUniqueId}/calendar_accounts`, {
        calendar_account: {
          provider: data.provider,
          email: data.email,
          name: data.name,
          access_token: data.accessToken,
          refresh_token: data.refreshToken,
          token_expires_at: data.tokenExpiresAt?.toISOString(),
          sync_enabled: data.syncEnabled,
          payload: data.payload,
        },
      });
      return decodeOne(response, calendarAccountMapper);
    },

    async update(userUniqueId: string, id: string, data: UpdateCalendarAccountRequest): Promise<CalendarAccount> {
      const response = await transport.put<unknown>(`/users/${userUniqueId}/calendar_accounts/${id}`, {
        calendar_account: {
          email: data.email,
          name: data.name,
          access_token: data.accessToken,
          refresh_token: data.refreshToken,
          token_expires_at: data.tokenExpiresAt?.toISOString(),
          sync_enabled: data.syncEnabled,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, calendarAccountMapper);
    },

    async delete(userUniqueId: string, id: string): Promise<void> {
      await transport.delete(`/users/${userUniqueId}/calendar_accounts/${id}`);
    },

    async syncUser(userUniqueId: string, request?: SyncCalendarRequest): Promise<SyncCalendarResponse> {
      const response = await transport.post<{ data: SyncCalendarResponse }>(`/users/${userUniqueId}/calendar/sync`, {
        sync: {
          force_refresh: request?.forceRefresh,
          sync_from: request?.syncFrom?.toISOString(),
          sync_to: request?.syncTo?.toISOString(),
        },
      });
      return response.data;
    },

    async syncTenant(request?: SyncCalendarRequest): Promise<SyncCalendarResponse> {
      const response = await transport.post<{ data: SyncCalendarResponse }>('/calendar/sync', {
        sync: {
          force_refresh: request?.forceRefresh,
          sync_from: request?.syncFrom?.toISOString(),
          sync_to: request?.syncTo?.toISOString(),
        },
      });
      return response.data;
    },
  };
}
