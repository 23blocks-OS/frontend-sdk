import type { JsonApiResource, JsonApiMapper } from '@23blocks/jsonapi-codec';
import type { AccountDocument } from '../types/account-document';
import { parseString, parseDate, parseBoolean, parseStatus, parseOptionalNumber } from './utils';

export const accountDocumentMapper: JsonApiMapper<AccountDocument> = {
  type: 'account_document',
  map(resource: JsonApiResource): AccountDocument {
    const attrs = resource.attributes || {};
    return {
      id: resource.id,
      uniqueId: parseString(attrs['unique_id']) || resource.id,
      accountUniqueId: parseString(attrs['account_unique_id']) || '',
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
    };
  },
};
