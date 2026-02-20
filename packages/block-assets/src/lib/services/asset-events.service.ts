import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  AssetEvent,
  CreateAssetEventRequest,
  UpdateAssetEventRequest,
  ListAssetEventsParams,
  EventImagePresignResponse,
  CreateEventImageRequest,
  EventImage,
} from '../types/asset-event.js';
import type {
  EventReportParams,
  EventReportSummary,
  EventReportList,
} from '../types/report.js';
import { assetEventMapper } from '../mappers/asset-event.mapper.js';

export interface AssetEventsService {
  /**
   * List events for a specific asset.
   * @returns Paginated list of AssetEvent records with metadata.
   */
  list(assetUniqueId: string, params?: ListAssetEventsParams): Promise<PageResult<AssetEvent>>;

  /**
   * Get a specific event for an asset.
   * @returns The matching AssetEvent record.
   */
  get(assetUniqueId: string, eventUniqueId: string): Promise<AssetEvent>;

  /**
   * Create a new event for an asset.
   * @returns The newly created AssetEvent record.
   */
  create(assetUniqueId: string, data: CreateAssetEventRequest): Promise<AssetEvent>;

  /**
   * Update an existing event for an asset.
   * @returns The updated AssetEvent record.
   */
  update(assetUniqueId: string, eventUniqueId: string, data: UpdateAssetEventRequest): Promise<AssetEvent>;

  /**
   * Get a detailed event report list.
   * @returns EventReportList with events array, summary, and pagination meta.
   */
  reportList(params: EventReportParams): Promise<EventReportList>;

  /**
   * Get an event report summary.
   * @returns EventReportSummary with totals and breakdown by event type.
   */
  reportSummary(params: EventReportParams): Promise<EventReportSummary>;

  // Event Images

  /**
   * Get a presigned URL for uploading an event image.
   * @returns EventImagePresignResponse with `url`, `fields`, and `key`.
   */
  presignImage(assetUniqueId: string, eventUniqueId: string): Promise<EventImagePresignResponse>;

  /**
   * Create an event image record after upload.
   * @returns The newly created EventImage record with URL.
   */
  createImage(assetUniqueId: string, eventUniqueId: string, data: CreateEventImageRequest): Promise<EventImage>;

  /**
   * Delete an event image.
   */
  deleteImage(assetUniqueId: string, eventUniqueId: string, imageUniqueId: string): Promise<void>;
}

export function createAssetEventsService(transport: Transport, _config: { apiKey: string }): AssetEventsService {
  return {
    async list(assetUniqueId: string, params?: ListAssetEventsParams): Promise<PageResult<AssetEvent>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.eventType) queryParams['event_type'] = params.eventType;
      if (params?.startDate) queryParams['start_date'] = params.startDate.toISOString();
      if (params?.endDate) queryParams['end_date'] = params.endDate.toISOString();
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/assets/${assetUniqueId}/events`, { params: queryParams });
      return decodePageResult(response, assetEventMapper);
    },

    async get(assetUniqueId: string, eventUniqueId: string): Promise<AssetEvent> {
      const response = await transport.get<unknown>(`/assets/${assetUniqueId}/events/${eventUniqueId}`);
      return decodeOne(response, assetEventMapper);
    },

    async create(assetUniqueId: string, data: CreateAssetEventRequest): Promise<AssetEvent> {
      const response = await transport.post<unknown>(`/assets/${assetUniqueId}/events`, {
        event: {
          event_type: data.eventType,
          event_date: data.eventDate.toISOString(),
          description: data.description,
          performed_by_unique_id: data.performedByUniqueId,
          cost: data.cost,
          notes: data.notes,
          payload: data.payload,
        },
      });
      return decodeOne(response, assetEventMapper);
    },

    async update(assetUniqueId: string, eventUniqueId: string, data: UpdateAssetEventRequest): Promise<AssetEvent> {
      const response = await transport.put<unknown>(`/assets/${assetUniqueId}/events/${eventUniqueId}`, {
        event: {
          event_type: data.eventType,
          event_date: data.eventDate?.toISOString(),
          description: data.description,
          performed_by_unique_id: data.performedByUniqueId,
          cost: data.cost,
          notes: data.notes,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, assetEventMapper);
    },

    async reportList(params: EventReportParams): Promise<EventReportList> {
      const response = await transport.post<any>('/reports/events/list', {
        start_date: params.startDate,
        end_date: params.endDate,
        event_type: params.eventType,
        asset_unique_id: params.assetUniqueId,
        page: params.page,
        per_page: params.perPage,
      });
      return {
        events: (response.events || []).map((e: any) => ({
          uniqueId: e.unique_id,
          assetUniqueId: e.asset_unique_id,
          eventType: e.event_type,
          description: e.description,
          occurredAt: new Date(e.occurred_at),
        })),
        summary: {
          totalEvents: response.summary.total_events,
          eventsByType: response.summary.events_by_type,
          period: {
            startDate: new Date(response.summary.period.start_date),
            endDate: new Date(response.summary.period.end_date),
          },
        },
        meta: {
          totalCount: response.meta.total_count,
          page: response.meta.current_page,
          perPage: response.meta.per_page,
          totalPages: response.meta.total_pages,
        },
      };
    },

    async reportSummary(params: EventReportParams): Promise<EventReportSummary> {
      const response = await transport.post<any>('/reports/events/summary', {
        start_date: params.startDate,
        end_date: params.endDate,
        event_type: params.eventType,
        asset_unique_id: params.assetUniqueId,
      });
      return {
        totalEvents: response.total_events,
        eventsByType: response.events_by_type,
        period: {
          startDate: new Date(response.period.start_date),
          endDate: new Date(response.period.end_date),
        },
      };
    },

    async presignImage(assetUniqueId: string, eventUniqueId: string): Promise<EventImagePresignResponse> {
      const response = await transport.put<any>(`/assets/${assetUniqueId}/events/${eventUniqueId}/presign`, {});
      return {
        url: response.url,
        fields: response.fields,
        key: response.key,
      };
    },

    async createImage(assetUniqueId: string, eventUniqueId: string, data: CreateEventImageRequest): Promise<EventImage> {
      const response = await transport.post<any>(`/assets/${assetUniqueId}/events/${eventUniqueId}/images`, {
        image: {
          key: data.key,
          filename: data.filename,
          content_type: data.contentType,
        },
      });
      return {
        uniqueId: response.unique_id,
        url: response.url,
        filename: response.filename,
        contentType: response.content_type,
        createdAt: new Date(response.created_at),
      };
    },

    async deleteImage(assetUniqueId: string, eventUniqueId: string, imageUniqueId: string): Promise<void> {
      await transport.delete(`/assets/${assetUniqueId}/events/${eventUniqueId}/images/${imageUniqueId}`);
    },
  };
}
