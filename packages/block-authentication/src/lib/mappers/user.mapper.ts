import type { ResourceMapper, IncludedMap, JsonApiResource } from '@23blocks/jsonapi-codec';
import { resolveRelationship } from '@23blocks/jsonapi-codec';
import type { User, Role, UserAvatar, UserProfile, Permission } from '../types/index.js';
import { parseDate, parseBoolean, parseString } from './utils.js';

/**
 * Permission mapper
 */
export const permissionMapper: ResourceMapper<Permission> = {
  type: 'permission',

  map(resource: JsonApiResource, _included: IncludedMap): Permission {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id),
      name: parseString(attrs.name),
      level: Number(attrs.level) || 0,
      parentId: parseString(attrs.parent_id),
      description: parseString(attrs.description),
      status: (attrs.status as Permission['status']) ?? 'active',
      category: parseString(attrs.category),
      riskLevel: parseString(attrs.risk_level),
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
    };
  },
};

/**
 * Role mapper
 */
export const roleMapper: ResourceMapper<Role> = {
  type: 'role',

  map(resource: JsonApiResource, _included: IncludedMap): Role {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id),
      name: parseString(attrs.name),
      code: parseString(attrs.code),
      description: parseString(attrs.description),
      status: (attrs.status as Role['status']) ?? 'active',
      payload: attrs.payload as Record<string, unknown> | null,
      onBoardingUniqueId: parseString(attrs.on_boarding_unique_id),
      onBoardingUrl: parseString(attrs.on_boarding_url),
      onBoardingPayload: attrs.on_boarding_payload as Record<string, unknown> | null,
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
      // Note: permissions are typically not included in role responses
      permissions: [],
    };
  },
};

/**
 * User avatar mapper
 */
export const userAvatarMapper: ResourceMapper<UserAvatar> = {
  type: 'UserAvatar',

  map(resource: JsonApiResource, _included: IncludedMap): UserAvatar {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id),
      userUniqueId: parseString(attrs.user_unique_id),
      bucket: parseString(attrs.bucket),
      originalName: parseString(attrs.original_name),
      name: parseString(attrs.name),
      url: parseString(attrs.url),
      thumbnail: parseString(attrs.thumbnail),
      fileType: parseString(attrs.file_type),
      fileSize: attrs.file_size != null ? Number(attrs.file_size) : null,
      description: parseString(attrs.description),
      originalFile: parseString(attrs.original_file),
      status: (attrs.status as UserAvatar['status']) ?? 'active',
      isPublic: parseBoolean(attrs.is_public),
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
    };
  },
};

/**
 * User profile mapper
 */
export const userProfileMapper: ResourceMapper<UserProfile> = {
  type: 'UserProfile',

  map(resource: JsonApiResource, _included: IncludedMap): UserProfile {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id),
      userUniqueId: parseString(attrs.user_unique_id),
      firstName: parseString(attrs.first_name),
      middleName: parseString(attrs.middle_name),
      lastName: parseString(attrs.last_name),
      gender: parseString(attrs.gender),
      ethnicity: parseString(attrs.ethnicity),
      zipcode: parseString(attrs.zipcode),
      maritalStatus: parseString(attrs.marital_status),
      birthdate: parseDate(attrs.birthdate),
      hhi: parseString(attrs.hhi),
      children: attrs.children != null ? Number(attrs.children) : null,
      source: parseString(attrs.source),
      status: (attrs.status as UserProfile['status']) ?? 'active',
      phoneNumber: parseString(attrs.phone_number),
      email: parseString(attrs.email),
      preferredDevice: parseString(attrs.preferred_device),
      preferredLanguage: parseString(attrs.preferred_language),
      webSite: parseString(attrs.web_site),
      twitter: parseString(attrs.twitter),
      fb: parseString(attrs.fb),
      instagram: parseString(attrs.instagram),
      linkedin: parseString(attrs.linkedin),
      youtube: parseString(attrs.youtube),
      blog: parseString(attrs.blog),
      networkA: parseString(attrs.network_a),
      networkB: parseString(attrs.network_b),
      payload: attrs.payload as Record<string, unknown> | null,
      timeZone: parseString(attrs.time_zone),
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
    };
  },
};

/**
 * User mapper
 */
export const userMapper: ResourceMapper<User> = {
  type: 'User',

  map(resource: JsonApiResource, included: IncludedMap): User {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id),
      email: parseString(attrs.email),
      username: parseString(attrs.username),
      name: parseString(attrs.name),
      nickname: parseString(attrs.nickname),
      bio: parseString(attrs.bio),
      provider: parseString(attrs.provider) ?? 'email',
      uid: parseString(attrs.uid) ?? attrs.email as string,
      roleId: parseString(attrs.role_id),
      status: (attrs.status as User['status']) ?? 'active',
      mailStatus: parseString(attrs.mail_status),
      phoneStatus: parseString(attrs.phone_status),
      allowPasswordChange: parseBoolean(attrs.allow_password_change),
      lastSignInAt: parseDate(attrs.last_sign_in_at),
      confirmedAt: parseDate(attrs.confirmed_at),
      unconfirmedEmail: parseString(attrs.unconfirmed_email),
      invitationSentAt: parseDate(attrs.invitation_sent_at),
      invitationAcceptedAt: parseDate(attrs.invitation_accepted_at),
      invitationCreatedAt: parseDate(attrs.invitation_created_at),
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),

      // Resolve relationships from included resources
      role: resolveRelationship(resource, 'role', included, roleMapper),
      avatar: resolveRelationship(resource, 'user_avatar', included, userAvatarMapper),
      profile: resolveRelationship(resource, 'user_profile', included, userProfileMapper),
    };
  },
};
