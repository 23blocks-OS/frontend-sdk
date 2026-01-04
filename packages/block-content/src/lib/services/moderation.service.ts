import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ModerationResult,
  ModerateContentRequest,
  ContentFlag,
  CreateContentFlagRequest,
  ListContentFlagsParams,
  ModerationAction,
} from '../types/moderation';
import { contentFlagMapper } from '../mappers/moderation.mapper';

/**
 * Moderation Service Interface - Content moderation operations
 */
export interface ModerationService {
  /**
   * Moderate a post
   */
  moderatePost(postUniqueId: string, request: ModerateContentRequest): Promise<ModerationResult>;

  /**
   * Moderate a comment
   */
  moderateComment(postUniqueId: string, commentUniqueId: string, request: ModerateContentRequest): Promise<ModerationResult>;

  /**
   * List content flags
   */
  listFlags(params?: ListContentFlagsParams): Promise<PageResult<ContentFlag>>;

  /**
   * Get a specific flag
   */
  getFlag(flagUniqueId: string): Promise<ContentFlag>;

  /**
   * Create a content flag (report content)
   */
  createFlag(request: CreateContentFlagRequest): Promise<ContentFlag>;

  /**
   * Resolve a content flag
   */
  resolveFlag(flagUniqueId: string, resolution: string): Promise<ContentFlag>;

  /**
   * Dismiss a content flag
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
