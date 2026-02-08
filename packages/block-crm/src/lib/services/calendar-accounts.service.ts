import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  CalendarAccount,
  CreateCalendarAccountRequest,
  UpdateCalendarAccountRequest,
  ListCalendarAccountsParams,
  SyncCalendarRequest,
  SyncCalendarResponse,
} from '../types/calendar-account.js';
import { calendarAccountMapper } from '../mappers/calendar-account.mapper.js';

export interface CalendarAccountsService {
  /**
   * List calendar accounts for a specific user with optional filtering, pagination, and sorting.
   * @param userUniqueId - The unique identifier of the user.
   * @param params - Optional filtering (status, provider, syncEnabled, search), pagination, and sorting.
   * @returns Paginated result containing CalendarAccount objects and metadata.
   */
  list(userUniqueId: string, params?: ListCalendarAccountsParams): Promise<PageResult<CalendarAccount>>;

  /**
   * Retrieve a single calendar account for a user.
   * @param userUniqueId - The unique identifier of the user.
   * @param uniqueId - The unique identifier of the calendar account.
   * @returns The matching CalendarAccount object.
   */
  get(userUniqueId: string, uniqueId: string): Promise<CalendarAccount>;

  /**
   * Create a new calendar account for a user.
   * @param userUniqueId - The unique identifier of the user.
   * @param data - The calendar account creation payload with provider, email, tokens, and sync settings.
   * @returns The newly created CalendarAccount object.
   */
  create(userUniqueId: string, data: CreateCalendarAccountRequest): Promise<CalendarAccount>;

  /**
   * Update an existing calendar account for a user.
   * @param userUniqueId - The unique identifier of the user.
   * @param uniqueId - The unique identifier of the calendar account to update.
   * @param data - The fields to update on the calendar account.
   * @returns The updated CalendarAccount object.
   * @note Uses PUT (not PATCH) as required by the 23blocks backend.
   */
  update(userUniqueId: string, uniqueId: string, data: UpdateCalendarAccountRequest): Promise<CalendarAccount>;

  /**
   * Delete a calendar account for a user.
   * @param userUniqueId - The unique identifier of the user.
   * @param uniqueId - The unique identifier of the calendar account to delete.
   * @returns Resolves when the calendar account has been deleted.
   */
  delete(userUniqueId: string, uniqueId: string): Promise<void>;

  /**
   * Trigger a calendar sync for a specific user's calendar accounts.
   * @param userUniqueId - The unique identifier of the user.
   * @param request - Optional sync parameters (forceRefresh, date range).
   * @returns A SyncCalendarResponse with sync results.
   */
  syncUser(userUniqueId: string, request?: SyncCalendarRequest): Promise<SyncCalendarResponse>;

  /**
   * Trigger a calendar sync for all calendar accounts across the tenant.
   * @param request - Optional sync parameters (forceRefresh, date range).
   * @returns A SyncCalendarResponse with sync results.
   */
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

    async get(userUniqueId: string, uniqueId: string): Promise<CalendarAccount> {
      const response = await transport.get<unknown>(`/users/${userUniqueId}/calendar_accounts/${uniqueId}`);
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

    async update(userUniqueId: string, uniqueId: string, data: UpdateCalendarAccountRequest): Promise<CalendarAccount> {
      const response = await transport.put<unknown>(`/users/${userUniqueId}/calendar_accounts/${uniqueId}`, {
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

    async delete(userUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/users/${userUniqueId}/calendar_accounts/${uniqueId}`);
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
