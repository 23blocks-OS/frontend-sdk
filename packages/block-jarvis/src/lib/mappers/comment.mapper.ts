import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { PromptComment, ExecutionComment } from '../types/comment.js';
import { parseString, parseDate, parseBoolean, parseOptionalNumber } from './utils.js';

export const promptCommentMapper: ResourceMapper<PromptComment> = {
  type: 'comment',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    promptUniqueId: parseString(resource.attributes['prompt_unique_id']) || '',
    parentUniqueId: parseString(resource.attributes['parent_unique_id']),
    content: parseString(resource.attributes['content']) || '',
    thumbnailUrl: parseString(resource.attributes['thumbnail_url']),
    imageUrl: parseString(resource.attributes['image_url']),
    contentUrl: parseString(resource.attributes['content_url']),
    mediaUrl: parseString(resource.attributes['media_url']),
    userUniqueId: parseString(resource.attributes['user_unique_id']),
    userName: parseString(resource.attributes['user_name']),
    userAlias: parseString(resource.attributes['user_alias']),
    userAvatarUrl: parseString(resource.attributes['user_avatar_url']),
    aiGenerated: resource.attributes['ai_generated'] != null ? parseBoolean(resource.attributes['ai_generated']) : undefined,
    aiModel: parseString(resource.attributes['ai_model']),
    likesCount: parseOptionalNumber(resource.attributes['likes_count']),
    repliesCount: parseOptionalNumber(resource.attributes['replies_count']),
    status: parseString(resource.attributes['status']) || 'active',
    enabled: resource.attributes['enabled'] != null ? parseBoolean(resource.attributes['enabled']) : undefined,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};

export const executionCommentMapper: ResourceMapper<ExecutionComment> = {
  type: 'execution_comment',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    promptUniqueId: parseString(resource.attributes['prompt_unique_id']) || '',
    executionUniqueId: parseString(resource.attributes['execution_unique_id']) || '',
    parentUniqueId: parseString(resource.attributes['parent_unique_id']),
    content: parseString(resource.attributes['content']) || '',
    thumbnailUrl: parseString(resource.attributes['thumbnail_url']),
    imageUrl: parseString(resource.attributes['image_url']),
    contentUrl: parseString(resource.attributes['content_url']),
    mediaUrl: parseString(resource.attributes['media_url']),
    userUniqueId: parseString(resource.attributes['user_unique_id']),
    userName: parseString(resource.attributes['user_name']),
    userAlias: parseString(resource.attributes['user_alias']),
    userAvatarUrl: parseString(resource.attributes['user_avatar_url']),
    aiGenerated: resource.attributes['ai_generated'] != null ? parseBoolean(resource.attributes['ai_generated']) : undefined,
    aiModel: parseString(resource.attributes['ai_model']),
    likesCount: parseOptionalNumber(resource.attributes['likes_count']),
    repliesCount: parseOptionalNumber(resource.attributes['replies_count']),
    status: parseString(resource.attributes['status']) || 'active',
    enabled: resource.attributes['enabled'] != null ? parseBoolean(resource.attributes['enabled']) : undefined,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};
