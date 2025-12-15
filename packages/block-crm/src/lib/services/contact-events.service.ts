import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ContactEvent,
  CreateContactEventRequest,
  UpdateContactEventRequest,
  ListContactEventsParams,
  ConfirmationRequest,
  CheckinRequest,
  CheckoutRequest,
  EventNotesRequest,
} from '../types/contact-event';
import { contactEventMapper } from '../mappers/contact-event.mapper';

export interface ContactEventsService {
  list(params?: ListContactEventsParams): Promise<PageResult<ContactEvent>>;
  get(uniqueId: string): Promise<ContactEvent>;
  create(data: CreateContactEventRequest): Promise<ContactEvent>;
  update(uniqueId: string, data: UpdateContactEventRequest): Promise<ContactEvent>;
  delete(uniqueId: string): Promise<void>;
  studentConfirmation(uniqueId: string, request?: ConfirmationRequest): Promise<ContactEvent>;
  studentCheckin(uniqueId: string, request?: CheckinRequest): Promise<ContactEvent>;
  teacherConfirmation(uniqueId: string, request?: ConfirmationRequest): Promise<ContactEvent>;
  teacherCheckin(uniqueId: string, request?: CheckinRequest): Promise<ContactEvent>;
  checkout(uniqueId: string, request?: CheckoutRequest): Promise<ContactEvent>;
  checkoutStudent(uniqueId: string, request?: CheckoutRequest): Promise<ContactEvent>;
  studentNotes(uniqueId: string, request: EventNotesRequest): Promise<ContactEvent>;
  adminNotes(uniqueId: string, request: EventNotesRequest): Promise<ContactEvent>;
}

export function createContactEventsService(transport: Transport, _config: { appId: string }): ContactEventsService {
  return {
    async list(params?: ListContactEventsParams): Promise<PageResult<ContactEvent>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.eventType) queryParams['event_type'] = params.eventType;
      if (params?.contactUniqueId) queryParams['contact_unique_id'] = params.contactUniqueId;
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/events', { params: queryParams });
      return decodePageResult(response, contactEventMapper);
    },

    async get(uniqueId: string): Promise<ContactEvent> {
      const response = await transport.get<unknown>(`/events/${uniqueId}`);
      return decodeOne(response, contactEventMapper);
    },

    async create(data: CreateContactEventRequest): Promise<ContactEvent> {
      const response = await transport.post<unknown>('/events', {
        event: {
          contact_unique_id: data.contactUniqueId,
          user_unique_id: data.userUniqueId,
          event_type: data.eventType,
          title: data.title,
          description: data.description,
          scheduled_at: data.scheduledAt?.toISOString(),
          start_time: data.startTime?.toISOString(),
          end_time: data.endTime?.toISOString(),
          payload: data.payload,
        },
      });
      return decodeOne(response, contactEventMapper);
    },

    async update(uniqueId: string, data: UpdateContactEventRequest): Promise<ContactEvent> {
      const response = await transport.put<unknown>(`/events/${uniqueId}`, {
        event: {
          event_type: data.eventType,
          title: data.title,
          description: data.description,
          scheduled_at: data.scheduledAt?.toISOString(),
          start_time: data.startTime?.toISOString(),
          end_time: data.endTime?.toISOString(),
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, contactEventMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/events/${uniqueId}`);
    },

    async studentConfirmation(uniqueId: string, request?: ConfirmationRequest): Promise<ContactEvent> {
      const response = await transport.put<unknown>(`/events/${uniqueId}/contacts/confirmation`, {
        event: {
          notes: request?.notes,
          payload: request?.payload,
        },
      });
      return decodeOne(response, contactEventMapper);
    },

    async studentCheckin(uniqueId: string, request?: CheckinRequest): Promise<ContactEvent> {
      const response = await transport.put<unknown>(`/events/${uniqueId}/contacts/checking`, {
        event: {
          notes: request?.notes,
          payload: request?.payload,
        },
      });
      return decodeOne(response, contactEventMapper);
    },

    async teacherConfirmation(uniqueId: string, request?: ConfirmationRequest): Promise<ContactEvent> {
      const response = await transport.put<unknown>(`/events/${uniqueId}/employees/confirmation`, {
        event: {
          notes: request?.notes,
          payload: request?.payload,
        },
      });
      return decodeOne(response, contactEventMapper);
    },

    async teacherCheckin(uniqueId: string, request?: CheckinRequest): Promise<ContactEvent> {
      const response = await transport.put<unknown>(`/events/${uniqueId}/employees/checking`, {
        event: {
          notes: request?.notes,
          payload: request?.payload,
        },
      });
      return decodeOne(response, contactEventMapper);
    },

    async checkout(uniqueId: string, request?: CheckoutRequest): Promise<ContactEvent> {
      const response = await transport.put<unknown>(`/events/${uniqueId}/employees/checkout`, {
        event: {
          notes: request?.notes,
          payload: request?.payload,
        },
      });
      return decodeOne(response, contactEventMapper);
    },

    async checkoutStudent(uniqueId: string, request?: CheckoutRequest): Promise<ContactEvent> {
      const response = await transport.put<unknown>(`/events/${uniqueId}/contacts/checkout`, {
        event: {
          notes: request?.notes,
          payload: request?.payload,
        },
      });
      return decodeOne(response, contactEventMapper);
    },

    async studentNotes(uniqueId: string, request: EventNotesRequest): Promise<ContactEvent> {
      const response = await transport.put<unknown>(`/events/${uniqueId}/contacts/notes`, {
        event: {
          notes: request.notes,
          payload: request.payload,
        },
      });
      return decodeOne(response, contactEventMapper);
    },

    async adminNotes(uniqueId: string, request: EventNotesRequest): Promise<ContactEvent> {
      const response = await transport.put<unknown>(`/events/${uniqueId}/admin/notes`, {
        event: {
          notes: request.notes,
          payload: request.payload,
        },
      });
      return decodeOne(response, contactEventMapper);
    },
  };
}
