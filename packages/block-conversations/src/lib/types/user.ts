import type { IdentityCore, PageResult } from '@23blocks/contracts';
import type { Group } from './group';
import type { Conversation } from './conversation';

export interface ConversationsUser extends IdentityCore {
  email?: string;
  name?: string;
  username?: string;
  avatarUrl?: string;
  status?: string;
  lastSeenAt?: Date;
  payload?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RegisterUserRequest {
  email?: string;
  name?: string;
  username?: string;
  avatarUrl?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateUserRequest {
  name?: string;
  username?: string;
  avatarUrl?: string;
  status?: string;
  payload?: Record<string, unknown>;
}

export interface ListUsersParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
