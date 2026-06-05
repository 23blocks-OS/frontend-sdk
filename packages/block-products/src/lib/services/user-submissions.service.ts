import type { Transport, PageResult } from '@23blocks/contracts';
import { assertUuid } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ProductSubmission,
  CreateProductSubmissionRequest,
  ListUserSubmissionsParams,
} from '../types/product-submission.js';
import { productSubmissionMapper } from '../mappers/product-submission.mapper.js';

/**
 * User-scoped service for managing product submissions submitted by an end user.
 *
 * Users create submissions to propose new products to the catalog. Submissions
 * start in `pending` status and are reviewed by admins via
 * {@link AdminSubmissionsService}.
 */
export interface UserSubmissionsService {
  /**
   * Create a new product submission for a user.
   * @param userUniqueId - The unique identifier of the submitting user
   * @param data - Submission details including name, brand, varietal, and image URLs
   * @returns The newly created ProductSubmission record
   */
  create(userUniqueId: string, data: CreateProductSubmissionRequest): Promise<ProductSubmission>;

  /**
   * List submissions created by a specific user.
   * @param userUniqueId - The unique identifier of the user
   * @param params - Optional filtering by status and pagination
   * @returns Paginated result containing ProductSubmission items and metadata
   */
  list(userUniqueId: string, params?: ListUserSubmissionsParams): Promise<PageResult<ProductSubmission>>;

  /**
   * Get a specific submission belonging to a user.
   * @param userUniqueId - The unique identifier of the user
   * @param uniqueId - The unique identifier of the submission
   * @returns The matching ProductSubmission record
   */
  get(userUniqueId: string, uniqueId: string): Promise<ProductSubmission>;
}

export function createUserSubmissionsService(
  transport: Transport,
  _config: { apiKey: string }
): UserSubmissionsService {
  return {
    async create(userUniqueId: string, data: CreateProductSubmissionRequest): Promise<ProductSubmission> {
      assertUuid(userUniqueId, 'userUniqueId');
      const response = await transport.post<unknown>(`/users/${userUniqueId}/submissions`, {
        submission: {
          name: data.name,
          description: data.description,
          brand: data.brand,
          upc: data.upc,
          sku: data.sku,
          vintage: data.vintage,
          varietal: data.varietal,
          region: data.region,
          alcohol_content: data.alcoholContent,
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
        },
      });
      return decodeOne(response, productSubmissionMapper);
    },

    async list(
      userUniqueId: string,
      params?: ListUserSubmissionsParams
    ): Promise<PageResult<ProductSubmission>> {
      assertUuid(userUniqueId, 'userUniqueId');
      const queryParams: Record<string, string> = {};
      if (params?.status) queryParams['status'] = params.status;
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['per_page'] = String(params.perPage);

      const response = await transport.get<unknown>(`/users/${userUniqueId}/submissions`, {
        params: queryParams,
      });
      return decodePageResult(response, productSubmissionMapper);
    },

    async get(userUniqueId: string, uniqueId: string): Promise<ProductSubmission> {
      assertUuid(userUniqueId, 'userUniqueId');
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.get<unknown>(`/users/${userUniqueId}/submissions/${uniqueId}`);
      return decodeOne(response, productSubmissionMapper);
    },
  };
}
