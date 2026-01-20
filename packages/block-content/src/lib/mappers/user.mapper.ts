import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { ContentUser, Following } from '../types/user.js';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus } from './utils.js';

export const contentUserMapper: ResourceMapper<ContentUser> = {
  type: 'UserIdentity',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']),
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    // Name fields
    firstName: parseString(resource.attributes['first_name']),
    lastName: parseString(resource.attributes['last_name']),
    name: parseString(resource.attributes['user_name']) || parseString(resource.attributes['name']),

    // Contact
    email: parseString(resource.attributes['email']),
    phone: parseString(resource.attributes['phone']),

    // Identity references
    userUniqueId: parseString(resource.attributes['user_unique_id']),
    userName: parseString(resource.attributes['user_name']),
    avatarUrl: parseString(resource.attributes['avatar_url']),

    // Role
    roleName: parseString(resource.attributes['role_name']),
    roleUniqueId: parseString(resource.attributes['role_unique_id']),

    // Preferences
    timeZone: parseString(resource.attributes['time_zone']),
    preferredLanguage: parseString(resource.attributes['preferred_language']),

    // Integrations
    stripeId: parseString(resource.attributes['stripe_id']),
    walletCode: parseString(resource.attributes['wallet_code']),

    // Notification preferences
    emailNotifications: parseBoolean(resource.attributes['email_notifications']),
    smsNotifications: parseBoolean(resource.attributes['sms_notifications']),
    whatsappNotifications: parseBoolean(resource.attributes['whatsapp_notifications']),
    otherNotifications: parseBoolean(resource.attributes['other_notifications']),

    // Business logic
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,

    // Legacy/computed fields
    bio: parseString(resource.attributes['bio']),
    postsCount: parseOptionalNumber(resource.attributes['posts_count']),
    commentsCount: parseOptionalNumber(resource.attributes['comments_count']),
    followersCount: parseOptionalNumber(resource.attributes['followers_count']),
    followingCount: parseOptionalNumber(resource.attributes['following_count']),
  }),
};

export const followingMapper: ResourceMapper<Following> = {
  type: 'Following',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']),
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    // The user being followed
    userUniqueId: parseString(resource.attributes['user_unique_id']) || '',
    userName: parseString(resource.attributes['user_name']),
    userAlias: parseString(resource.attributes['user_alias']),
    userAvatarUrl: parseString(resource.attributes['user_avatar_url']),

    // The follower
    followerUniqueId: parseString(resource.attributes['follower_unique_id']) || '',
    followerName: parseString(resource.attributes['follower_name']),
    followerAlias: parseString(resource.attributes['follower_alias']),
    followerAvatarUrl: parseString(resource.attributes['follower_avatar_url']),

    // Metadata
    followingSince: parseDate(resource.attributes['following_since']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
