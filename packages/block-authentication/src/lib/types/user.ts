import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

/**
 * User entity
 */
export interface User extends IdentityCore {
  email: string;
  username: string | null;
  name: string | null;
  nickname: string | null;
  bio: string | null;
  provider: string;
  uid: string;
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

  // Relationships (when included)
  role?: Role | null;
  avatar?: UserAvatar | null;
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
 * User profile
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
