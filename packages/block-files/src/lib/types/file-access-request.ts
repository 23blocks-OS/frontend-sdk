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
  requestedAccessLevel: 'view' | 'download' | 'edit' | 'admin';
  message?: string;
  requestStatus: AccessRequestStatus;
  reviewedByUniqueId?: string;
  reviewedAt?: Date;
  reviewNote?: string;
  expiresAt?: Date;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

/**
 * Create file access request
 */
export interface CreateFileAccessRequestInput {
  fileUniqueId: string;
  requestedAccessLevel: 'view' | 'download' | 'edit' | 'admin';
  message?: string;
  payload?: Record<string, unknown>;
}

/**
 * Review file access request (approve/reject)
 */
export interface ReviewFileAccessRequestInput {
  decision: 'approve' | 'reject';
  reviewNote?: string;
  grantExpiresAt?: string;
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
