import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  PremiseEvent,
  CreatePremiseEventRequest,
  UpdatePremiseEventRequest,
  ListPremiseEventsParams,
} from '../types/premise-event';
import { premiseEventMapper } from '../mappers/premise-event.mapper';

export interface PremiseEventsService {
  list(locationUniqueId: string, premiseUniqueId: string, params?: ListPremiseEventsParams): Promise<PageResult<PremiseEvent>>;
  get(locationUniqueId: string, premiseUniqueId: string, uniqueId: string): Promise<PremiseEvent>;
  create(locationUniqueId: string, premiseUniqueId: string, data: CreatePremiseEventRequest): Promise<PremiseEvent>;
  update(locationUniqueId: string, premiseUniqueId: string, uniqueId: string, data: UpdatePremiseEventRequest): Promise<PremiseEvent>;
  delete(locationUniqueId: string, premiseUniqueId: string, uniqueId: string): Promise<void>;
}

export function createPremiseEventsService(transport: Transport, _config: { appId: string }): PremiseEventsService {
  return {
    async list(locationUniqueId: string, premiseUniqueId: string, params?: ListPremiseEventsParams): Promise<PageResult<PremiseEvent>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.eventType) queryParams['event_type'] = params.eventType;
      if (params?.startDate) queryParams['start_date'] = params.startDate;
      if (params?.endDate) queryParams['end_date'] = params.endDate;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.organizerUniqueId) queryParams['organizer_unique_id'] = params.organizerUniqueId;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(
        `/locations/${locationUniqueId}/premises/${premiseUniqueId}/events`,
        { params: queryParams }
      );
      return decodePageResult(response, premiseEventMapper);
    },

    async get(locationUniqueId: string, premiseUniqueId: string, uniqueId: string): Promise<PremiseEvent> {
      const response = await transport.get<unknown>(
        `/locations/${locationUniqueId}/premises/${premiseUniqueId}/events/${uniqueId}`
      );
      return decodeOne(response, premiseEventMapper);
    },

    async create(locationUniqueId: string, premiseUniqueId: string, data: CreatePremiseEventRequest): Promise<PremiseEvent> {
      const response = await transport.post<unknown>(
        `/locations/${locationUniqueId}/premises/${premiseUniqueId}/events`,
        {
          event: {
            event_type: data.eventType,
            title: data.title,
            description: data.description,
            start_time: data.startTime,
            end_time: data.endTime,
            all_day: data.allDay,
            recurrence: data.recurrence,
            organizer_unique_id: data.organizerUniqueId,
            capacity: data.capacity,
            payload: data.payload,
            tags: data.tags,
          },
        }
      );
      return decodeOne(response, premiseEventMapper);
    },

    async update(locationUniqueId: string, premiseUniqueId: string, uniqueId: string, data: UpdatePremiseEventRequest): Promise<PremiseEvent> {
      const response = await transport.put<unknown>(
        `/locations/${locationUniqueId}/premises/${premiseUniqueId}/events/${uniqueId}`,
        {
          event: {
            event_type: data.eventType,
            title: data.title,
            description: data.description,
            start_time: data.startTime,
            end_time: data.endTime,
            all_day: data.allDay,
            recurrence: data.recurrence,
            capacity: data.capacity,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
            tags: data.tags,
          },
        }
      );
      return decodeOne(response, premiseEventMapper);
    },

    async delete(locationUniqueId: string, premiseUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/locations/${locationUniqueId}/premises/${premiseUniqueId}/events/${uniqueId}`);
    },
  };
}
