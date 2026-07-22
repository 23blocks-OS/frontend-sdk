import type { IdentityCore } from '@23blocks/contracts';

export type ProductSubmissionStatus = 'pending' | 'in_review' | 'approved' | 'rejected' | 'duplicate';

export type ProductSubmissionHistoryAction =
  | 'submitted'
  | 'assigned'
  | 'updated'
  | 'approved'
  | 'rejected'
  | 'marked_duplicate'
  | 'enriched';

export interface ProductSubmissionImage {
  url: string;
  isPrimary?: boolean;
  caption?: string;
}

export interface ProductSubmission extends IdentityCore {
  status: ProductSubmissionStatus;
  name: string;
  description?: string;
  brand?: string;
  upc?: string;
  sku?: string;
  suggestedPrice?: number;
  priceCurrency?: string;
  submissionNotes?: string;
  foundAtStore?: string;
  source?: string;
  imageUrls?: ProductSubmissionImage[];

  /**
   * Generic JSONB bag for product-type-specific attributes (same convention as
   * `Product.payload`). Wine submissions carry `{ vintage, varietal, region,
   * alcohol_content }` here; any other product type carries its own keys. On
   * approval this maps verbatim to the created `Product.payload`.
   */
  payload?: Record<string, unknown>;

  /** UUID of the submitting user. */
  submittedByUserId?: string;
  /** Display email of the submitter (when available). */
  submittedByEmail?: string;
  submittedAt?: Date;

  /** UUID of the admin/reviewer assigned to the submission. */
  assignedToUserId?: string;
  assignedAt?: Date;

  /** UUID of the reviewer who acted on the submission. */
  reviewedByUserId?: string;
  reviewedAt?: Date;
  /** Free-form reviewer notes (admin scope only). */
  reviewNotes?: string;
  /** Populated when status is 'rejected' or 'duplicate'. */
  rejectionReason?: string;

  /** Numeric DB id of the Product created on approval. */
  approvedProductId?: number;
  /** UUID of the Product created on approval. Prefer this for API calls. */
  approvedProductUniqueId?: string;
  /** Numeric DB id of the duplicate Product (when status='duplicate'). */
  duplicateOfProductId?: number;
  /** Numeric DB id of the duplicate Submission (when this one is itself marked duplicate). */
  duplicateOfSubmissionId?: number;

  /** Free-form JSONB metadata, including AI enrichment results. Reviewer scope. */
  metadata?: Record<string, unknown>;
}

export interface ProductSubmissionHistoryRecord extends IdentityCore {
  action: ProductSubmissionHistoryAction;
  performedByUserId: string;
  performedAt: Date;
  previousStatus?: ProductSubmissionStatus | null;
  newStatus?: ProductSubmissionStatus | null;
  notes?: string;
  metadata?: Record<string, unknown>;
  /** Foreign-key UUID of the parent ProductSubmission. */
  submissionUniqueId: string;
}

export interface CreateProductSubmissionRequest {
  name: string;
  description?: string;
  brand?: string;
  upc?: string;
  sku?: string;
  suggestedPrice?: number;
  priceCurrency?: string;
  submissionNotes?: string;
  foundAtStore?: string;
  source?: string;
  imageUrls?: ProductSubmissionImage[];

  /**
   * Product-type-specific attributes (e.g. wine: `{ vintage, varietal, region,
   * alcoholContent }`). Sent verbatim to the server's generic `payload` jsonb
   * column — arbitrary, nested keys allowed. Bypasses strong-params server-side.
   */
  payload?: Record<string, unknown>;
}

export type UpdateProductSubmissionRequest = Partial<CreateProductSubmissionRequest>;

export interface ListUserSubmissionsParams {
  status?: ProductSubmissionStatus;
  page?: number;
  perPage?: number;
}

export interface ListAdminSubmissionsParams {
  status?: ProductSubmissionStatus;
  assignedTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
}

export interface AssignSubmissionRequest {
  assignedToUserId: string;
}

export interface ApproveSubmissionRequest {
  reviewNotes?: string;
  enrichedData?: {
    categoryId?: string;
    vendorId?: string;
    tags?: string[];
  };
}

export interface RejectSubmissionRequest {
  rejectionReason: string;
  reviewNotes?: string;
  duplicateOfProductId?: string;
  duplicateOfSubmissionId?: string;
}
