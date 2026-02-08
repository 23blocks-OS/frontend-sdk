import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

/**
 * User entity - the central identity object in 23blocks.
 *
 * Relationships (`role`, `avatar`, `profile`) are only populated when explicitly
 * included via the `include` parameter or when using endpoints that include them
 * by default (e.g., `auth.getCurrentUser()`, `users.get()`).
 *
 * @example
 * // Get user with relationships
 * const user = await auth.auth.getCurrentUser();
 * console.log(user.email);                // Always present
 * console.log(user.role?.name);           // Only if included
 * console.log(user.avatar?.url);          // Only if included
 * console.log(user.profile?.firstName);   // Only if included
 * console.log(user.profile?.payload);     // Custom JSON object
 */
export interface User extends IdentityCore {
  email: string;
  username: string | null;
  name: string | null;
  nickname: string | null;
  bio: string | null;
  /** Authentication provider (e.g., 'email', 'google', 'facebook') */
  provider: string;
  /** Provider-specific user identifier */
  uid: string;
  /** Role ID (use `role?.name` for the role name when relationship is included) */
  roleId: string | null;
  status: EntityStatus;
  mailStatus: string | null;
  phoneStatus: string | null;
  allowPasswordChange: boolean;
  lastSignInAt: Date | null;
  confirmedAt: Date | null;
  unconfirmedEmail: string | null;
  invitationSentAt: Date | null;
  invitationAcceptedAt: Date | null;
  invitationCreatedAt: Date | null;

  /** User's role. Only populated when included (e.g., `include: ['role']`). */
  role?: Role | null;
  /** User's avatar. Only populated when included (e.g., `include: ['user_avatar']`). */
  avatar?: UserAvatar | null;
  /** User's profile. Only populated when included (e.g., `include: ['user_profile']`). */
  profile?: UserProfile | null;
}

/**
 * User role
 */
export interface Role extends IdentityCore {
  name: string;
  code: string;
  description: string | null;
  status: EntityStatus;
  payload: Record<string, unknown> | null;
  onBoardingUniqueId: string | null;
  onBoardingUrl: string | null;
  onBoardingPayload: Record<string, unknown> | null;

  // Relationships
  permissions?: Permission[];
}

/**
 * Permission
 */
export interface Permission extends IdentityCore {
  name: string;
  level: number;
  parentId: string | null;
  description: string | null;
  status: EntityStatus;
  category: string | null;
  riskLevel: string | null;
}

/**
 * User avatar
 */
export interface UserAvatar extends IdentityCore {
  userUniqueId: string;
  bucket: string | null;
  originalName: string | null;
  name: string | null;
  url: string | null;
  thumbnail: string | null;
  fileType: string | null;
  fileSize: number | null;
  description: string | null;
  originalFile: string | null;
  status: EntityStatus;
  isPublic: boolean;
}

/**
 * User profile - extended demographic and contact information.
 *
 * Accessible via `user.profile` when the relationship is included, or directly
 * via `users.getProfile(userUniqueId)`.
 *
 * @note The `payload` field is a JSON object for storing custom data.
 *   When writing, pass an object (not a JSON string).
 */
export interface UserProfile extends IdentityCore {
  userUniqueId: string;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  gender: string | null;
  ethnicity: string | null;
  zipcode: string | null;
  maritalStatus: string | null;
  birthdate: Date | null;
  hhi: string | null;
  children: number | null;
  source: string | null;
  status: EntityStatus;
  phoneNumber: string | null;
  email: string | null;
  preferredDevice: string | null;
  preferredLanguage: string | null;
  webSite: string | null;
  twitter: string | null;
  fb: string | null;
  instagram: string | null;
  linkedin: string | null;
  youtube: string | null;
  blog: string | null;
  networkA: string | null;
  networkB: string | null;
  payload: Record<string, unknown> | null;
  timeZone: string | null;
}

/**
 * Full name helper
 */
export function getFullName(profile: UserProfile | null | undefined): string {
  if (!profile) return '';
  const parts = [profile.firstName, profile.middleName, profile.lastName].filter(Boolean);
  return parts.join(' ');
}
