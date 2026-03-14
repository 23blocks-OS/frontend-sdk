import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { PromptTemplate } from '../types/prompt-template.js';
import { parseString, parseDate } from './utils.js';

export const promptTemplateMapper: ResourceMapper<PromptTemplate> = {
  type: 'prompt_template',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']) || undefined,
    schema: resource.attributes['schema'] as Record<string, unknown> | undefined,
    formDefinition: resource.attributes['form_definition'] as Record<string, unknown> | undefined,
    status: parseString(resource.attributes['status']) || 'active',
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};
