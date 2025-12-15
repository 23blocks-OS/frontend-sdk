import type { IdentityCore, EntityStatus } from '@23blocks/contracts';
import type { Post } from './post';
import type { Comment } from './comment';

export interface ContentUser extends IdentityCore {
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  postsCount: number;
  commentsCount: number;
  followersCount: number;
  followingCount: number;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface RegisterContentUserRequest {
  email: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateContentUserRequest {
  name?: string;
  avatarUrl?: string;
  bio?: string;
  payload?: Record<string, unknown>;
}

export interface ListContentUsersParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
}

export interface UserActivity {
  uniqueId: string;
  activityType: string;
  targetType: string;
  targetUniqueId: string;
  description?: string;
  createdAt: Date;
  payload?: Record<string, unknown>;
}
