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
} from '../types/contact-event.js';
import { contactEventMapper } from '../mappers/contact-event.mapper.js';

export interface ContactEventsService {
  /**
   * List contact events with optional filtering, pagination, and sorting.
   * @param params - Optional filtering (status, eventType, contactUniqueId, userUniqueId), pagination, and sorting.
   * @returns Paginated result containing ContactEvent objects and metadata.
   */
  list(params?: ListContactEventsParams): Promise<PageResult<ContactEvent>>;

  /**
   * Retrieve a single contact event by its unique identifier.
   * @param uniqueId - The unique identifier of the contact event.
   * @returns The matching ContactEvent object.
   */
  get(uniqueId: string): Promise<ContactEvent>;

  /**
   * Create a new contact event.
   * @param data - The event creation payload with contact, user, type, and scheduling details.
   * @returns The newly created ContactEvent object.
   */
  create(data: CreateContactEventRequest): Promise<ContactEvent>;

  /**
   * Update an existing contact event.
   * @param uniqueId - The unique identifier of the event to update.
   * @param data - The fields to update on the event.
   * @returns The updated ContactEvent object.
   * @note Uses PUT (not PATCH) as required by the 23blocks backend.
   */
  update(uniqueId: string, data: UpdateContactEventRequest): Promise<ContactEvent>;

  /**
   * Delete a contact event.
   * @param uniqueId - The unique identifier of the event to delete.
   * @returns Resolves when the event has been deleted.
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Record a student confirmation for a contact event.
   * @param uniqueId - The unique identifier of the event.
   * @param request - Optional confirmation payload with notes.
   * @returns The updated ContactEvent object reflecting the student confirmation.
   */
  studentConfirmation(uniqueId: string, request?: ConfirmationRequest): Promise<ContactEvent>;

  /**
   * Record a student check-in for a contact event.
   * @param uniqueId - The unique identifier of the event.
   * @param request - Optional check-in payload with notes.
   * @returns The updated ContactEvent object reflecting the student check-in.
   */
  studentCheckin(uniqueId: string, request?: CheckinRequest): Promise<ContactEvent>;

  /**
   * Record a teacher confirmation for a contact event.
   * @param uniqueId - The unique identifier of the event.
   * @param request - Optional confirmation payload with notes.
   * @returns The updated ContactEvent object reflecting the teacher confirmation.
   */
  teacherConfirmation(uniqueId: string, request?: ConfirmationRequest): Promise<ContactEvent>;

  /**
   * Record a teacher check-in for a contact event.
   * @param uniqueId - The unique identifier of the event.
   * @param request - Optional check-in payload with notes.
   * @returns The updated ContactEvent object reflecting the teacher check-in.
   */
  teacherCheckin(uniqueId: string, request?: CheckinRequest): Promise<ContactEvent>;

  /**
   * Record a teacher/employee checkout for a contact event.
   * @param uniqueId - The unique identifier of the event.
   * @param request - Optional checkout payload with notes.
   * @returns The updated ContactEvent object reflecting the checkout.
   */
  checkout(uniqueId: string, request?: CheckoutRequest): Promise<ContactEvent>;

  /**
   * Record a student checkout for a contact event.
   * @param uniqueId - The unique identifier of the event.
   * @param request - Optional checkout payload with notes.
   * @returns The updated ContactEvent object reflecting the student checkout.
   */
  checkoutStudent(uniqueId: string, request?: CheckoutRequest): Promise<ContactEvent>;

  /**
   * Add or update student notes on a contact event.
   * @param uniqueId - The unique identifier of the event.
   * @param request - The notes request containing the notes text.
   * @returns The updated ContactEvent object with the student notes applied.
   */
  studentNotes(uniqueId: string, request: EventNotesRequest): Promise<ContactEvent>;

  /**
   * Add or update admin notes on a contact event.
   * @param uniqueId - The unique identifier of the event.
   * @param request - The notes request containing the notes text.
   * @returns The updated ContactEvent object with the admin notes applied.
   */
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
