import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Series, SeriesVisibility, SeriesCompletionStatus } from '../types/series';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus } from './utils';

function parseVisibility(value: unknown): SeriesVisibility | undefined {
  const str = parseString(value);
  if (str === 'public' || str === 'private' || str === 'unlisted') {
    return str;
  }
  return undefined;
}

function parseCompletionStatus(value: unknown): SeriesCompletionStatus | undefined {
  const str = parseString(value);
  if (str === 'ongoing' || str === 'completed' || str === 'hiatus' || str === 'cancelled') {
    return str;
  }
  return undefined;
}

export const seriesMapper: ResourceMapper<Series> = {
  type: 'Series',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']),
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    title: parseString(resource.attributes['title']) || '',
    description: parseString(resource.attributes['description']),
    slug: parseString(resource.attributes['slug']),
    thumbnailUrl: parseString(resource.attributes['thumbnail_url']),
    imageUrl: parseString(resource.attributes['image_url']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    visibility: parseVisibility(resource.attributes['visibility']),
    completionStatus: parseCompletionStatus(resource.attributes['completion_status']),

    // User
    userUniqueId: parseString(resource.attributes['user_unique_id']),
    userName: parseString(resource.attributes['user_name']),
    userAlias: parseString(resource.attributes['user_alias']),
    userAvatarUrl: parseString(resource.attributes['user_avatar_url']),

    // Engagement
    postsCount: parseOptionalNumber(resource.attributes['posts_count']),
    likes: parseOptionalNumber(resource.attributes['likes']),
    dislikes: parseOptionalNumber(resource.attributes['dislikes']),
    followers: parseOptionalNumber(resource.attributes['followers']),
    savers: parseOptionalNumber(resource.attributes['savers']),

    // AI
    aiGenerated: parseBoolean(resource.attributes['ai_generated']),
    aiModel: parseString(resource.attributes['ai_model']),

    // Moderation
    moderated: parseBoolean(resource.attributes['moderated']),

    // Metadata
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
