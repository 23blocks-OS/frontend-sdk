import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

/**
 * Access request status
 */
export type AccessRequestStatus = 'pending' | 'approved' | 'rejected' | 'expired' | 'cancelled';

/**
 * File access request - request to gain access to a file
 */
export interface FileAccessRequest extends IdentityCore {
  fileUniqueId: string;
  fileName?: string;
  requesterUniqueId: string;
  requesterName?: string;
  requesterEmail?: string;
  requesterType: string;
  accessType: 'view' | 'download' | 'edit' | 'admin';
  requestStatus: AccessRequestStatus;
  reviewedByUniqueId?: string;
  reviewedAt?: Date;
  expiresAt?: Date;
  startsAt?: Date;
  status: EntityStatus;
  enabled: boolean;
}

/**
 * Create file access request
 */
export interface CreateFileAccessRequestInput {
  userUniqueId: string;
  accessType: 'view' | 'download' | 'edit' | 'admin';
  startsAt?: string;
  expiresAt?: string;
}

/**
 * Review file access request (approve/reject)
 */
export interface ReviewFileAccessRequestInput {
  expiresAt?: string;
}

/**
 * List file access requests params
 */
export interface ListFileAccessRequestsParams {
  page?: number;
  perPage?: number;
  fileUniqueId?: string;
  requesterUniqueId?: string;
  requestStatus?: AccessRequestStatus;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
