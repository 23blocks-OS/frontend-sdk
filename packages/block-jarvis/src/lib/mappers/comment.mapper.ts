import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { PromptComment, ExecutionComment } from '../types/comment';
import { parseDate } from './utils';

export const promptCommentMapper: ResourceMapper<PromptComment> = {
  type: 'comment',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.attributes?.['unique_id'] as string,
    promptUniqueId: resource.attributes?.['prompt_unique_id'] as string,
    parentUniqueId: resource.attributes?.['parent_unique_id'] as string | undefined,
    userUniqueId: resource.attributes?.['user_unique_id'] as string,
    content: resource.attributes?.['content'] as string,
    likesCount: resource.attributes?.['likes_count'] as number,
    repliesCount: resource.attributes?.['replies_count'] as number,
    isLiked: resource.attributes?.['is_liked'] as boolean | undefined,
    isFollowed: resource.attributes?.['is_followed'] as boolean | undefined,
    isSaved: resource.attributes?.['is_saved'] as boolean | undefined,
    enabled: resource.attributes?.['enabled'] as boolean,
    status: resource.attributes?.['status'] as string,
    payload: resource.attributes?.['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes?.['created_at']),
    updatedAt: parseDate(resource.attributes?.['updated_at']),
  }),
};

export const executionCommentMapper: ResourceMapper<ExecutionComment> = {
  type: 'execution_comment',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.attributes?.['unique_id'] as string,
    promptUniqueId: resource.attributes?.['prompt_unique_id'] as string,
    executionUniqueId: resource.attributes?.['execution_unique_id'] as string,
    parentUniqueId: resource.attributes?.['parent_unique_id'] as string | undefined,
    userUniqueId: resource.attributes?.['user_unique_id'] as string,
    content: resource.attributes?.['content'] as string,
    likesCount: resource.attributes?.['likes_count'] as number,
    repliesCount: resource.attributes?.['replies_count'] as number,
    isLiked: resource.attributes?.['is_liked'] as boolean | undefined,
    isFollowed: resource.attributes?.['is_followed'] as boolean | undefined,
    isSaved: resource.attributes?.['is_saved'] as boolean | undefined,
    enabled: resource.attributes?.['enabled'] as boolean,
    status: resource.attributes?.['status'] as string,
    payload: resource.attributes?.['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes?.['created_at']),
    updatedAt: parseDate(resource.attributes?.['updated_at']),
  }),
};
