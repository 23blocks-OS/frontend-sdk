import type { Transport, PageResult } from '@23blocks/contracts';
import { assertUuid } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ProductSubmission,
  ListAdminSubmissionsParams,
  AssignSubmissionRequest,
  ApproveSubmissionRequest,
  RejectSubmissionRequest,
  UpdateProductSubmissionRequest,
} from '../types/product-submission.js';
import { productSubmissionMapper } from '../mappers/product-submission.mapper.js';

/**
 * Admin-scoped service for reviewing and managing product submissions across all users.
 *
 * Admins can list, assign, approve, reject, and update submissions. Approving
 * a submission creates a corresponding Product in the catalog.
 */
export interface AdminSubmissionsService {
  /**
   * List submissions across all users, with optional filtering and sorting.
   * @param params - Optional filtering by status, assignee, sort, and pagination
   * @returns Paginated result containing ProductSubmission items and metadata
   */
  list(params?: ListAdminSubmissionsParams): Promise<PageResult<ProductSubmission>>;

  /**
   * Get a specific submission by unique id.
   * @param uniqueId - The unique identifier of the submission
   * @returns The matching ProductSubmission record
   * @note The response may include `relationships.history_records`; history is
   *   not decoded at this time.
   */
  get(uniqueId: string): Promise<ProductSubmission>;

  /**
   * Assign a submission to an admin user for review.
   * @param uniqueId - The unique identifier of the submission
   * @param data - Assignment payload with the admin user to assign
   * @returns The updated ProductSubmission record
   */
  assign(uniqueId: string, data: AssignSubmissionRequest): Promise<ProductSubmission>;

  /**
   * Approve a submission, optionally enriching it with vendor or tag data.
   * Approval creates a Product in the catalog and populates `productUniqueId`.
   * @param uniqueId - The unique identifier of the submission
   * @param data - Optional approval payload with review notes and enrichment data
   * @returns The updated ProductSubmission record with `approved` status
   */
  approve(uniqueId: string, data?: ApproveSubmissionRequest): Promise<ProductSubmission>;

  /**
   * Reject a submission with a reason and optional duplicate product reference.
   * @param uniqueId - The unique identifier of the submission
   * @param data - Rejection payload including required reason and optional details
   * @returns The updated ProductSubmission record with `rejected` (or `duplicate`) status
   */
  reject(uniqueId: string, data: RejectSubmissionRequest): Promise<ProductSubmission>;

  /**
   * Update a submission's attributes (admin-only edits).
   * @param uniqueId - The unique identifier of the submission
   * @param data - Partial submission fields to update
   * @returns The updated ProductSubmission record
   */
  update(uniqueId: string, data: UpdateProductSubmissionRequest): Promise<ProductSubmission>;
}

export function createAdminSubmissionsService(
  transport: Transport,
  _config: { apiKey: string }
): AdminSubmissionsService {
  return {
    async list(params?: ListAdminSubmissionsParams): Promise<PageResult<ProductSubmission>> {
      const queryParams: Record<string, string> = {};
      if (params?.status) queryParams['status'] = params.status;
      if (params?.assignedTo) queryParams['assigned_to'] = params.assignedTo;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['per_page'] = String(params.perPage);

      const response = await transport.get<unknown>('/admin/products/submissions', {
        params: queryParams,
      });
      return decodePageResult(response, productSubmissionMapper);
    },

    async get(uniqueId: string): Promise<ProductSubmission> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.get<unknown>(`/admin/products/submissions/${uniqueId}`);
      return decodeOne(response, productSubmissionMapper);
    },

    async assign(uniqueId: string, data: AssignSubmissionRequest): Promise<ProductSubmission> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.put<unknown>(`/admin/products/submissions/${uniqueId}/assign`, {
        assigned_to_user_id: data.assignedToUserId,
      });
      return decodeOne(response, productSubmissionMapper);
    },

    async approve(uniqueId: string, data?: ApproveSubmissionRequest): Promise<ProductSubmission> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.put<unknown>(`/admin/products/submissions/${uniqueId}/approve`, {
        approval: {
          review_notes: data?.reviewNotes,
          enriched_data: data?.enrichedData
            ? {
                category_id: data.enrichedData.categoryId,
                vendor_id: data.enrichedData.vendorId,
                tags: data.enrichedData.tags,
              }
            : undefined,
        },
      });
      return decodeOne(response, productSubmissionMapper);
    },

    async reject(uniqueId: string, data: RejectSubmissionRequest): Promise<ProductSubmission> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.put<unknown>(`/admin/products/submissions/${uniqueId}/reject`, {
        rejection: {
          rejection_reason: data.rejectionReason,
          review_notes: data.reviewNotes,
          duplicate_of_product_id: data.duplicateOfProductId,
          duplicate_of_submission_id: data.duplicateOfSubmissionId,
        },
      });
      return decodeOne(response, productSubmissionMapper);
    },

    async update(uniqueId: string, data: UpdateProductSubmissionRequest): Promise<ProductSubmission> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.put<unknown>(`/admin/products/submissions/${uniqueId}`, {
        submission: {
          name: data.name,
          description: data.description,
          brand: data.brand,
          upc: data.upc,
          sku: data.sku,
          suggested_price: data.suggestedPrice,
          price_currency: data.priceCurrency,
          submission_notes: data.submissionNotes,
          found_at_store: data.foundAtStore,
          source: data.source,
          image_urls: data.imageUrls?.map((img) => ({
            url: img.url,
            is_primary: img.isPrimary,
            caption: img.caption,
          })),
          payload: data.payload,
        },
      });
      return decodeOne(response, productSubmissionMapper);
    },
  };
}
