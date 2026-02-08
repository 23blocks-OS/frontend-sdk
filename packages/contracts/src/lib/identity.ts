/**
 * Base identity interface for all domain objects in 23blocks.
 * Every entity (User, Role, Contact, Product, etc.) extends this interface.
 *
 * @note Always use `uniqueId` (UUID) for API calls, not `id` (database ID).
 *   The `id` is an internal database identifier and should not be used in client code.
 */
export interface IdentityCore {
  /** Internal database ID. Prefer `uniqueId` for API operations. */
  id: string;
  /** UUID - globally unique identifier. Use this for all API calls (get, update, delete). */
  uniqueId: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Status values common across many entities
 */
export type EntityStatus = 'active' | 'inactive' | 'pending' | 'archived' | 'deleted';

/**
 * Timestamps interface for entities that track creation/update times
 */
export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Soft delete interface for entities that support soft deletion
 */
export interface SoftDeletable {
  deletedAt?: Date | null;
}

/**
 * Auditable interface for entities that track who created/updated them
 */
export interface Auditable {
  createdBy?: string;
  updatedBy?: string;
}
