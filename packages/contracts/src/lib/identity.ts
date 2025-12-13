/**
 * Base identity interface for all domain objects
 * All entities in 23blocks have these common fields
 */
export interface IdentityCore {
  /** Database ID */
  id: string;
  /** UUID - globally unique identifier */
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
