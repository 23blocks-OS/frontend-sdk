import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

/**
 * Content user identity - represents a user in the content system
 */
export interface ContentUser extends IdentityCore {
  uniqueId: string;

  // Name fields
  firstName?: string;
  lastName?: string;
  name?: string;

  // Contact
  email?: string;
  phone?: string;

  // Identity references
  userUniqueId?: string;
  userName?: string;
  avatarUrl?: string;

  // Role
  roleName?: string;
  roleUniqueId?: string;

  // Preferences
  timeZone?: string;
  preferredLanguage?: string;

  // Integrations
  stripeId?: string;
  walletCode?: string;

  // Notification preferences
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  whatsappNotifications?: boolean;
  otherNotifications?: boolean;

  // Business logic
  status: EntityStatus;
  payload?: Record<string, unknown>;

  // Legacy fields for backwards compatibility
  bio?: string;
  postsCount?: number;
  commentsCount?: number;
  followersCount?: number;
  followingCount?: number;
}

/**
 * Following relationship between users
 */
export interface Following extends IdentityCore {
  uniqueId: string;

  // The user being followed
  userUniqueId: string;
  userName?: string;
  userAlias?: string;
  userAvatarUrl?: string;

  // The follower
  followerUniqueId: string;
  followerName?: string;
  followerAlias?: string;
  followerAvatarUrl?: string;

  // Metadata
  followingSince?: Date;
  payload?: Record<string, unknown>;
}

export interface RegisterContentUserRequest {
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  timeZone?: string;
  preferredLanguage?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateContentUserRequest {
  name?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  timeZone?: string;
  preferredLanguage?: string;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  whatsappNotifications?: boolean;
  otherNotifications?: boolean;
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
