import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { PostTemplate, TemplateField, TemplateFieldType, PostValidationResult, ValidationIssue } from '../types/post-template.js';
import { parseString, parseDate, parseBoolean, parseStatus } from './utils.js';

function parseFieldType(value: unknown): TemplateFieldType {
  const str = parseString(value);
  if (str === 'object' || str === 'array' || str === 'string' || str === 'number' || str === 'boolean') {
    return str;
  }
  return 'string';
}

function parseTemplateFields(value: unknown): TemplateField[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((f: Record<string, unknown>) => ({
    key: parseString(f['key']) || '',
    label: parseString(f['label']) || '',
    type: parseFieldType(f['type']),
    required: parseBoolean(f['required']),
    description: parseString(f['description']),
    children: f['children'] ? parseTemplateFields(f['children']) : undefined,
  }));
}

export const postTemplateMapper: ResourceMapper<PostTemplate> = {
  type: 'PostTemplate',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    name: parseString(resource.attributes['name']) || '',
    slug: parseString(resource.attributes['slug']),
    description: parseString(resource.attributes['description']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    fields: parseTemplateFields(resource.attributes['fields']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};

function parseValidationIssues(value: unknown): ValidationIssue[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((issue: Record<string, unknown>) => ({
    key: parseString(issue['key']) || '',
    label: parseString(issue['label']),
    message: parseString(issue['message']),
  }));
}

export function parseValidationResult(response: unknown): PostValidationResult {
  const data = (response as Record<string, unknown>)?.['data'] as Record<string, unknown> | undefined;
  if (!data) {
    return {
      valid: false,
      missingRequired: [],
      missingOptional: [],
      warnings: [],
    };
  }

  return {
    valid: parseBoolean(data['valid']),
    missingRequired: parseValidationIssues(data['missing_required']),
    missingOptional: parseValidationIssues(data['missing_optional']),
    warnings: parseValidationIssues(data['warnings']),
  };
}
