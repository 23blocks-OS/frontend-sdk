import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Survey } from '../types/survey';
import { parseString, parseDate, parseStatus } from './utils';

export const surveyMapper: ResourceMapper<Survey> = {
  type: 'survey_instance',
  map: (resource) => ({
    uniqueId: resource.id,
    formUniqueId: parseString(resource.attributes['form_unique_id']) ?? '',
    userUniqueId: parseString(resource.attributes['user_unique_id']),
    email: parseString(resource.attributes['email']),
    firstName: parseString(resource.attributes['first_name']),
    lastName: parseString(resource.attributes['last_name']),
    data: (resource.attributes['data'] as Record<string, unknown>) ?? {},
    status: parseStatus(resource.attributes['status']),
    token: parseString(resource.attributes['token']),
    startedAt: parseDate(resource.attributes['started_at']),
    completedAt: parseDate(resource.attributes['completed_at']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
