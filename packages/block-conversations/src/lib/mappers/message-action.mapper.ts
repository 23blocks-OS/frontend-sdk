import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { MessageAction } from '../types/message-action.js';
import { parseString, parseDate, parseBoolean, parseStatus } from './utils.js';

export const messageActionMapper: ResourceMapper<MessageAction> = {
  type: 'MessageAction',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']),
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
    actionType: parseString(resource.attributes['action_type']),
    controlType: parseString(resource.attributes['control_type']),
    controlLabel: parseString(resource.attributes['control_label']),
    controlValue: parseString(resource.attributes['control_value']),
    controlName: parseString(resource.attributes['control_name']),
    controlId: parseString(resource.attributes['control_id']),
    controlClass: parseString(resource.attributes['control_class']),
    controlTag: parseString(resource.attributes['control_tag']),
    controlPlaceholder: parseString(resource.attributes['control_placeholder']),
    controlHref: parseString(resource.attributes['control_href']),
    controlSrc: parseString(resource.attributes['control_src']),
    controlAlt: parseString(resource.attributes['control_alt']),
    controlHelp: parseString(resource.attributes['control_help']),
    controlSetId: parseString(resource.attributes['control_set_id']),
    controlSetName: parseString(resource.attributes['control_set_name']),
    controlSetClass: parseString(resource.attributes['control_set_class']),
    messageUniqueId: parseString(resource.attributes['message_unique_id']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    response: resource.attributes['response'] as Record<string, unknown> | undefined,
  }),
};
