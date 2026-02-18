import type { CreateContextRequest, SendMessageRequest } from './entity.js';

export interface JarvisUser {
  id: string;
  uniqueId: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  roleName?: string;
  roleUniqueId?: string;
  timeZone?: string;
  preferredLanguage?: string;
  maxFileSize?: number;
  maxStorage?: number;
  status: string;
  enabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Matches user_params in users_controller.rb */
export interface RegisterJarvisUserRequest {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  roleName?: string;
  roleUniqueId?: string;
  timeZone?: string;
  preferredLanguage?: string;
  maxFileSize?: number;
  maxStorage?: number;
}

export type UpdateJarvisUserRequest = RegisterJarvisUserRequest;

export interface ListJarvisUsersParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type { CreateContextRequest, SendMessageRequest };
