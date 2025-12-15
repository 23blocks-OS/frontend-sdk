import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { PublicForm, PublicFormResponse } from '../types/public-form';
import { parseString, parseDate, parseStatus } from './utils';

export const publicFormMapper: ResourceMapper<PublicForm> = {
  type: 'public_form',
  map: (resource) => ({
    uniqueId: resource.id,
    formUniqueId: parseString(resource.attributes['form_unique_id']) ?? '',
    title: parseString(resource.attributes['title']),
    description: parseString(resource.attributes['description']),
    schema: (resource.attributes['schema'] as Record<string, unknown>) ?? {},
    uiSchema: resource.attributes['ui_schema'] as Record<string, unknown> | undefined,
    settings: resource.attributes['settings'] as Record<string, unknown> | undefined,
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};

export const publicFormResponseMapper: ResourceMapper<PublicFormResponse> = {
  type: 'form_response',
  map: (resource) => ({
    uniqueId: resource.id,
    formUniqueId: parseString(resource.attributes['form_unique_id']) ?? '',
    data: (resource.attributes['data'] as Record<string, unknown>) ?? {},
    status: parseStatus(resource.attributes['status']),
    submittedAt: parseDate(resource.attributes['submitted_at']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
