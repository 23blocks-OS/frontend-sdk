import type { Transport, PageResult } from '@23blocks/contracts';
import { decodePageResult } from '@23blocks/jsonapi-codec';
import type { Activity, ListActivitiesParams } from '../types/activity';
import type { Comment, ListCommentsParams } from '../types/comment';
import { activityMapper } from '../mappers/activity.mapper';
import { commentMapper } from '../mappers/comment.mapper';

/**
 * Activity Service Interface - User activity feed operations
 */
export interface ActivityService {
  /**
   * Get activities for an identity (user)
   */
  getActivities(identityUniqueId: string, params?: ListActivitiesParams): Promise<PageResult<Activity>>;

  /**
   * Get comments by an identity (user)
   */
  getComments(identityUniqueId: string, params?: ListCommentsParams): Promise<PageResult<Comment>>;

  /**
   * Get the user's activity feed (activities from followed users)
   */
  getFeed(params?: ListActivitiesParams): Promise<PageResult<Activity>>;
}

/**
 * Create the Activity service
 */
export function createActivityService(
  transport: Transport,
  _config: { appId: string }
): ActivityService {
  return {
    async getActivities(
      identityUniqueId: string,
      params?: ListActivitiesParams
    ): Promise<PageResult<Activity>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.activityType) queryParams['activity_type'] = params.activityType;
      if (params?.targetType) queryParams['target_type'] = params.targetType;
      if (params?.dateFrom) queryParams['date_from'] = params.dateFrom;
      if (params?.dateTo) queryParams['date_to'] = params.dateTo;
      if (params?.sortBy) queryParams['sort_by'] = params.sortBy;
      if (params?.sortOrder) queryParams['sort_order'] = params.sortOrder;

      const response = await transport.get<unknown>(`/identities/${identityUniqueId}/activities`, {
        params: queryParams,
      });
      return decodePageResult(response, activityMapper);
    },

    async getComments(
      identityUniqueId: string,
      params?: ListCommentsParams
    ): Promise<PageResult<Comment>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.postUniqueId) queryParams['post_unique_id'] = params.postUniqueId;
      if (params?.status) queryParams['status'] = params.status;

      const response = await transport.get<unknown>(`/identities/${identityUniqueId}/comments`, {
        params: queryParams,
      });
      return decodePageResult(response, commentMapper);
    },

    async getFeed(params?: ListActivitiesParams): Promise<PageResult<Activity>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.activityType) queryParams['activity_type'] = params.activityType;
      if (params?.targetType) queryParams['target_type'] = params.targetType;
      if (params?.dateFrom) queryParams['date_from'] = params.dateFrom;
      if (params?.dateTo) queryParams['date_to'] = params.dateTo;
      if (params?.sortBy) queryParams['sort_by'] = params.sortBy;
      if (params?.sortOrder) queryParams['sort_order'] = params.sortOrder;

      const response = await transport.get<unknown>('/activities/feed', { params: queryParams });
      return decodePageResult(response, activityMapper);
    },
  };
}
