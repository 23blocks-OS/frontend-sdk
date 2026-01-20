import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { PostVersion } from '../types/post-version.js';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus } from './utils.js';

export const postVersionMapper: ResourceMapper<PostVersion> = {
  type: 'PostVersion',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']),
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    postUniqueId: parseString(resource.attributes['post_unique_id']) || '',

    // Content
    title: parseString(resource.attributes['title']) || '',
    abstract: parseString(resource.attributes['abstract']),
    keywords: parseString(resource.attributes['keywords']),
    content: parseString(resource.attributes['content']),

    // Media
    thumbnailUrl: parseString(resource.attributes['thumbnail_url']),
    imageUrl: parseString(resource.attributes['image_url']),
    mediaUrl: parseString(resource.attributes['media_url']),

    // Metadata
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),

    // Publishing
    publishAt: parseDate(resource.attributes['publish_at']),
    publishUntil: parseDate(resource.attributes['publish_until']),

    // Author
    userUniqueId: parseString(resource.attributes['user_unique_id']),
    userName: parseString(resource.attributes['user_name']),
    userAlias: parseString(resource.attributes['user_alias']),
    userAvatarUrl: parseString(resource.attributes['user_avatar_url']),

    // Visibility
    isPublic: parseBoolean(resource.attributes['is_public']),

    // Versioning
    version: parseOptionalNumber(resource.attributes['version']),
    revision: parseOptionalNumber(resource.attributes['revision']),
    source: parseString(resource.attributes['source']),

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
