import type { JsonApiResourceMapper } from '@23blocks/jsonapi-codec';
import type { ContentUser } from '../types/user';

export const contentUserMapper: JsonApiResourceMapper<ContentUser> = {
  type: 'user',
  map: (data: Record<string, unknown>): ContentUser => ({
    id: String(data['id'] ?? ''),
    uniqueId: String(data['unique_id'] ?? ''),
    name: String(data['name'] ?? ''),
    email: String(data['email'] ?? ''),
    avatarUrl: data['avatar_url'] as string | undefined,
    bio: data['bio'] as string | undefined,
    postsCount: Number(data['posts_count'] ?? 0),
    commentsCount: Number(data['comments_count'] ?? 0),
    followersCount: Number(data['followers_count'] ?? 0),
    followingCount: Number(data['following_count'] ?? 0),
    status: (data['status'] as ContentUser['status']) ?? 'active',
    payload: data['payload'] as Record<string, unknown> | undefined,
    createdAt: data['created_at'] ? new Date(data['created_at'] as string) : new Date(),
    updatedAt: data['updated_at'] ? new Date(data['updated_at'] as string) : new Date(),
  }),
};
