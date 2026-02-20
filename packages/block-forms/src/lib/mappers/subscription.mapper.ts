import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Subscription } from '../types/subscription.js';
import { parseString, parseDate, parseStatus } from './utils.js';

export const subscriptionMapper: ResourceMapper<Subscription> = {
  type: 'subscription',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.id,
    formUniqueId: parseString(resource.attributes['form_unique_id']) ?? '',
    userUniqueId: parseString(resource.attributes['user_unique_id']),
    email: parseString(resource.attributes['email']) ?? '',
    firstName: parseString(resource.attributes['first_name']),
    middleName: parseString(resource.attributes['middle_name']),
    lastName: parseString(resource.attributes['last_name']),
    phoneNumber: parseString(resource.attributes['phone_number']),
    notes: parseString(resource.attributes['notes']),
    selectedOption: parseString(resource.attributes['selected_option']),
    formFields: resource.attributes['form_fields'] as Record<string, unknown> | undefined,
    source: parseString(resource.attributes['source']),
    sourceAlias: parseString(resource.attributes['source_alias']),
    sourceId: parseString(resource.attributes['source_id']),
    sourceType: parseString(resource.attributes['source_type']),
    visitorUniqueId: parseString(resource.attributes['visitor_unique_id']),
    visitorType: parseString(resource.attributes['visitor_type']),
    touchId: parseString(resource.attributes['touch_id']),
    touchReferenceId: parseString(resource.attributes['touch_reference_id']),
    status: parseStatus(resource.attributes['status']),
    subscribedAt: parseDate(resource.attributes['subscribed_at']),
    unsubscribedAt: parseDate(resource.attributes['unsubscribed_at']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
