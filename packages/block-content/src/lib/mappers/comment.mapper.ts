import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Comment } from '../types/comment';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus } from './utils';

export const commentMapper: ResourceMapper<Comment> = {
  type: 'Comment',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    postUniqueId: parseString(resource.attributes['post_unique_id']) || '',
    postVersion: parseOptionalNumber(resource.attributes['post_version']),
    content: parseString(resource.attributes['content']) || '',
    thumbnailUrl: parseString(resource.attributes['thumbnail_url']),
    imageUrl: parseString(resource.attributes['image_url']),
    contentUrl: parseString(resource.attributes['content_url']),
    mediaUrl: parseString(resource.attributes['media_url']),

    // User
    userUniqueId: parseString(resource.attributes['user_unique_id']),
    userName: parseString(resource.attributes['user_name']),
    userAlias: parseString(resource.attributes['user_alias']),
    userAvatarUrl: parseString(resource.attributes['user_avatar_url']),

    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),

    // Threading
    parentId: parseString(resource.attributes['parent_id']),

    // Engagement
    likes: parseOptionalNumber(resource.attributes['likes']),
    dislikes: parseOptionalNumber(resource.attributes['dislikes']),
    followers: parseOptionalNumber(resource.attributes['followers']),
    savers: parseOptionalNumber(resource.attributes['savers']),

    // AI
    aiGenerated: parseBoolean(resource.attributes['ai_generated']),
    aiModel: parseString(resource.attributes['ai_model']),

    // Moderation
    moderated: parseBoolean(resource.attributes['moderated']),
    moderatedBy: parseString(resource.attributes['moderated_by']),
    moderatedAt: parseDate(resource.attributes['moderated_at']),
    moderationReason: parseString(resource.attributes['moderation_reason']),
    moderationDecision: parseString(resource.attributes['moderation_decision']),
  }),
};
