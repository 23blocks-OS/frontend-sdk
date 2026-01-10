import type { IdentityCore, EntityStatus } from '@23blocks/contracts';
import type { DocumentCategory } from './account-document';

/**
 * Document attached to a contact
 */
export interface ContactDocument extends IdentityCore {
  contactUniqueId: string;
  name: string;
  originalName?: string;
  description?: string;
  fileType?: string;
  fileSize?: number;
  url?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;

  // Category fields
  /** Document type category: 'license', 'certification', 'insurance', 'credential' */
  categoryName?: DocumentCategory;
  /** Link to Category record */
  categoryUniqueId?: string;

  // Expiration tracking fields
  /** Whether document can expire (default: false) */
  isExpirable?: boolean;
  /** Expiration date */
  expiresAt?: Date;
  /** Issue date */
  issuedAt?: Date;
  /** Issuing authority name */
  issuedBy?: string;
  /** Flexible metadata for additional data */
  metadata?: Record<string, unknown>;
}

// Request types
export interface AddContactDocumentRequest {
  name: string;
  originalName?: string;
  description?: string;
  fileType?: string;
  fileSize?: number;
  url: string;
  payload?: Record<string, unknown>;

  // Category fields
  categoryName?: DocumentCategory;
  categoryUniqueId?: string;

  // Expiration tracking fields
  /** Whether document can expire (default: false) */
  isExpirable?: boolean;
  /** Expiration date (ISO 8601) */
  expiresAt?: string;
  /** Issue date (ISO 8601) */
  issuedAt?: string;
  /** Issuing authority name */
  issuedBy?: string;
  /** Flexible metadata for additional data */
  metadata?: Record<string, unknown>;
}
