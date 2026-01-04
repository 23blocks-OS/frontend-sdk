import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { FileAccessRequest, AccessRequestStatus } from '../types/file-access-request';
import { parseString, parseDate, parseStatus, parseBoolean } from './utils';

export const fileAccessRequestMapper: ResourceMapper<FileAccessRequest> = {
  type: 'file_access_request',
  map: (resource) => ({
    uniqueId: resource.id,
    createdAt: parseDate(resource.attributes?.['created_at']) ?? new Date(),
    updatedAt: parseDate(resource.attributes?.['updated_at']) ?? new Date(),
    fileUniqueId: parseString(resource.attributes?.['file_unique_id']) ?? '',
    fileName: parseString(resource.attributes?.['file_name']),
    requesterUniqueId: parseString(resource.attributes?.['requester_unique_id']) ?? '',
    requesterName: parseString(resource.attributes?.['requester_name']),
    requesterEmail: parseString(resource.attributes?.['requester_email']),
    requesterType: parseString(resource.attributes?.['requester_type']) ?? 'user',
    requestedAccessLevel: (parseString(resource.attributes?.['requested_access_level']) as 'view' | 'download' | 'edit' | 'admin') ?? 'view',
    message: parseString(resource.attributes?.['message']),
    requestStatus: (parseString(resource.attributes?.['request_status']) as AccessRequestStatus) ?? 'pending',
    reviewedByUniqueId: parseString(resource.attributes?.['reviewed_by_unique_id']),
    reviewedAt: parseDate(resource.attributes?.['reviewed_at']),
    reviewNote: parseString(resource.attributes?.['review_note']),
    expiresAt: parseDate(resource.attributes?.['expires_at']),
    status: parseStatus(resource.attributes?.['status']),
    enabled: parseBoolean(resource.attributes?.['enabled']),
    payload: resource.attributes?.['payload'] as Record<string, unknown> | undefined,
  }),
};
