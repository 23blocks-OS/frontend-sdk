import type { JsonApiResource, JsonApiMapper } from '@23blocks/jsonapi-codec';
import type { ContactDocument } from '../types/contact-document.js';
import type { DocumentCategory } from '../types/account-document.js';
import { parseString, parseDate, parseBoolean, parseStatus, parseOptionalNumber } from './utils.js';

/**
 * Parse document category from API response
 */
function parseDocumentCategory(value: unknown): DocumentCategory | undefined {
  const category = parseString(value);
  if (category === 'license' || category === 'certification' || category === 'insurance' || category === 'credential') {
    return category;
  }
  return undefined;
}

export const contactDocumentMapper: JsonApiMapper<ContactDocument> = {
  type: 'contact_document',
  map(resource: JsonApiResource): ContactDocument {
    const attrs = resource.attributes || {};
    return {
      id: resource.id,
      uniqueId: parseString(attrs['unique_id']),
      contactUniqueId: parseString(attrs['contact_unique_id']) || '',
      name: parseString(attrs['name']) || '',
      originalName: parseString(attrs['original_name']),
      description: parseString(attrs['description']),
      fileType: parseString(attrs['file_type']),
      fileSize: parseOptionalNumber(attrs['file_size']),
      url: parseString(attrs['url']),
      status: parseStatus(attrs['status']),
      enabled: parseBoolean(attrs['enabled']),
      payload: attrs['payload'] as Record<string, unknown> | undefined,
      createdAt: parseDate(attrs['created_at']),
      updatedAt: parseDate(attrs['updated_at']),
      // Category fields
      categoryName: parseDocumentCategory(attrs['category_name']),
      categoryUniqueId: parseString(attrs['category_unique_id']),
      // Expiration tracking fields
      isExpirable: attrs['is_expirable'] !== undefined ? parseBoolean(attrs['is_expirable']) : undefined,
      expiresAt: parseDate(attrs['expires_at']),
      issuedAt: parseDate(attrs['issued_at']),
      issuedBy: parseString(attrs['issued_by']),
      metadata: attrs['metadata'] as Record<string, unknown> | undefined,
    };
  },
};
