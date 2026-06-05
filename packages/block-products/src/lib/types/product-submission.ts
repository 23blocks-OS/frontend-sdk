import type { IdentityCore } from '@23blocks/contracts';

export type ProductSubmissionStatus = 'pending' | 'in_review' | 'approved' | 'rejected' | 'duplicate';

export interface ProductSubmissionImage {
  url: string;
  isPrimary?: boolean;
  caption?: string;
}

export interface ProductSubmission extends IdentityCore {
  userUniqueId?: string;
  status: ProductSubmissionStatus;
  name: string;
  description?: string;
  brand?: string;
  upc?: string;
  sku?: string;
  vintage?: string;
  varietal?: string;
  region?: string;
  alcoholContent?: number;
  suggestedPrice?: number;
  priceCurrency?: string;
  submissionNotes?: string;
  foundAtStore?: string;
  source?: string;
  imageUrls?: ProductSubmissionImage[];
  // Admin/review fields
  assignedToUserId?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  duplicateOfProductId?: string;
  productUniqueId?: string; // populated on approval (the created Product)
}

export interface CreateProductSubmissionRequest {
  name: string;
  description?: string;
  brand?: string;
  upc?: string;
  sku?: string;
  vintage?: string;
  varietal?: string;
  region?: string;
  alcoholContent?: number;
  suggestedPrice?: number;
  priceCurrency?: string;
  submissionNotes?: string;
  foundAtStore?: string;
  source?: string;
  imageUrls?: ProductSubmissionImage[];
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
    vendorId?: string;
    tags?: string[];
  };
}

export interface RejectSubmissionRequest {
  rejectionReason: string;
  reviewNotes?: string;
  duplicateOfProductId?: string;
}
