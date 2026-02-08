import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ModerationResult,
  ModerateContentRequest,
  ContentFlag,
  CreateContentFlagRequest,
  ListContentFlagsParams,
  ModerationAction,
} from '../types/moderation.js';
import { contentFlagMapper } from '../mappers/moderation.mapper.js';

/**
 * Moderation Service Interface - Content moderation operations
 */
export interface ModerationService {
  /**
   * Moderate a post
   * @param postUniqueId - Unique ID of the post to moderate
   * @param request - Moderation action and reason
   * @returns ModerationResult with success status, action taken, and timestamp
   */
  moderatePost(postUniqueId: string, request: ModerateContentRequest): Promise<ModerationResult>;

  /**
   * Moderate a comment
   * @param postUniqueId - Unique ID of the parent post
   * @param commentUniqueId - Unique ID of the comment to moderate
   * @param request - Moderation action and reason
   * @returns ModerationResult with success status, action taken, and timestamp
   * @note Uses HTTP DELETE internally despite accepting a request body
   */
  moderateComment(postUniqueId: string, commentUniqueId: string, request: ModerateContentRequest): Promise<ModerationResult>;

  /**
   * List content flags
   * @param params - Optional filtering and pagination parameters
   * @returns Paginated list of ContentFlag records with pagination metadata
   */
  listFlags(params?: ListContentFlagsParams): Promise<PageResult<ContentFlag>>;

  /**
   * Get a specific flag
   * @param flagUniqueId - Unique ID of the flag to retrieve
   * @returns The matching ContentFlag record
   */
  getFlag(flagUniqueId: string): Promise<ContentFlag>;

  /**
   * Create a content flag (report content)
   * @param request - Flag details including content type, content ID, reason, and category
   * @returns The newly created ContentFlag record
   */
  createFlag(request: CreateContentFlagRequest): Promise<ContentFlag>;

  /**
   * Resolve a content flag
   * @param flagUniqueId - Unique ID of the flag to resolve
   * @param resolution - Resolution description
   * @returns The updated ContentFlag record with resolution applied
   */
  resolveFlag(flagUniqueId: string, resolution: string): Promise<ContentFlag>;

  /**
   * Dismiss a content flag
   * @param flagUniqueId - Unique ID of the flag to dismiss
   * @param reason - Optional reason for dismissal
   * @returns void on successful dismissal
   */
  dismissFlag(flagUniqueId: string, reason?: string): Promise<void>;
}

/**
 * Create the Moderation service
 */
export function createModerationService(
  transport: Transport,
  _config: { appId: string }
): ModerationService {
  return {
    async moderatePost(postUniqueId: string, request: ModerateContentRequest): Promise<ModerationResult> {
      const response = await transport.post<{
        success: boolean;
        action: ModerationAction;
        moderated_at: string;
        moderated_by?: string;
        reason?: string;
      }>(`/posts/${postUniqueId}/moderate`, {
        moderation: {
          action: request.action,
          reason: request.reason,
        },
      });

      return {
        success: response.success,
        action: response.action,
        moderatedAt: new Date(response.moderated_at),
        moderatedBy: response.moderated_by,
        reason: response.reason,
      };
    },

    async moderateComment(
      postUniqueId: string,
      commentUniqueId: string,
      request: ModerateContentRequest
    ): Promise<ModerationResult> {
      const response = await transport.delete<{
        success: boolean;
        action: ModerationAction;
        moderated_at: string;
        moderated_by?: string;
        reason?: string;
      }>(`/posts/${postUniqueId}/comments/${commentUniqueId}/moderate`);

      return {
        success: response.success ?? true,
        action: response.action ?? request.action,
        moderatedAt: response.moderated_at ? new Date(response.moderated_at) : new Date(),
        moderatedBy: response.moderated_by,
        reason: response.reason,
      };
    },

    async listFlags(params?: ListContentFlagsParams): Promise<PageResult<ContentFlag>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.contentType) queryParams['content_type'] = params.contentType;
      if (params?.category) queryParams['category'] = params.category;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort_by'] = params.sortBy;
      if (params?.sortOrder) queryParams['sort_order'] = params.sortOrder;

      const response = await transport.get<unknown>('/content_flags', { params: queryParams });
      return decodePageResult(response, contentFlagMapper);
    },

    async getFlag(flagUniqueId: string): Promise<ContentFlag> {
      const response = await transport.get<unknown>(`/content_flags/${flagUniqueId}`);
      return decodeOne(response, contentFlagMapper);
    },

    async createFlag(request: CreateContentFlagRequest): Promise<ContentFlag> {
      const response = await transport.post<unknown>('/content_flags', {
        content_flag: {
          content_type: request.contentType,
          content_unique_id: request.contentUniqueId,
          reason: request.reason,
          category: request.category,
        },
      });
      return decodeOne(response, contentFlagMapper);
    },

    async resolveFlag(flagUniqueId: string, resolution: string): Promise<ContentFlag> {
      const response = await transport.put<unknown>(`/content_flags/${flagUniqueId}/resolve`, {
        content_flag: {
          resolution,
        },
      });
      return decodeOne(response, contentFlagMapper);
    },

    async dismissFlag(flagUniqueId: string, reason?: string): Promise<void> {
      await transport.put(`/content_flags/${flagUniqueId}/dismiss`, {
        content_flag: {
          reason,
        },
      });
    },
  };
}
