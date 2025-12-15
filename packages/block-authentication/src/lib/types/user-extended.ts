import type { User } from './user.js';
import type { PageResult } from '@23blocks/contracts';

/**
 * User Profile
 */
export interface UserProfile {
  id: string;
  uniqueId: string;
  userId: string;
  userUniqueId: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: string;
  ethnicity?: string;
  zipcode?: string;
  maritalStatus?: string;
  birthdate?: string;
  hhi?: string;
  children?: string;
  source?: string;
  email?: string;
  phoneNumber?: string;
  preferredDevice?: string;
  preferredLanguage?: string;
  webSite?: string;
  twitter?: string;
  fb?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  blog?: string;
  networkA?: string;
  networkB?: string;
  timeZone?: string;
  payload?: Record<string, unknown>;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Create/Update Profile Request
 */
export interface ProfileRequest {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: string;
  ethnicity?: string;
  zipcode?: string;
  maritalStatus?: string;
  birthdate?: string;
  hhi?: string;
  children?: string;
  source?: string;
  email?: string;
  phoneNumber?: string;
  preferredDevice?: string;
  preferredLanguage?: string;
  webSite?: string;
  twitter?: string;
  fb?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  blog?: string;
  networkA?: string;
  networkB?: string;
  timeZone?: string;
  payload?: string | Record<string, unknown>;
}

/**
 * Update Email Request
 */
export interface UpdateEmailRequest {
  email: string;
  password: string;
  confirmSuccessUrl?: string;
}

/**
 * User Device
 */
export interface UserDevice {
  id: string;
  uniqueId: string;
  userId: string;
  userUniqueId: string;
  deviceType?: string;
  pushId?: string;
  osType?: string;
  defaultDevice?: boolean;
  locationEnabled?: boolean;
  notificationsEnabled?: boolean;
  status?: string;
  enabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Add Device Request
 */
export interface AddDeviceRequest {
  uniqueId: string;
  deviceType: string;
  pushId?: string;
  osType?: string;
  defaultDevice?: boolean;
  locationEnabled?: boolean;
  notificationsEnabled?: boolean;
}

/**
 * User Search Request
 */
export interface UserSearchRequest {
  searchBy?: string;
  payload?: string;
  orderBy?: string;
}

/**
 * Add User Subscription Request
 */
export interface AddUserSubscriptionRequest {
  subscriptionUniqueId: string;
  payload?: string | Record<string, unknown>;
}

/**
 * Account Recovery Request
 */
export interface AccountRecoveryRequest {
  email: string;
  recoveryUrl: string;
}

/**
 * Account Recovery Response
 */
export interface AccountRecoveryResponse {
  success: boolean;
  message: string;
}

/**
 * Complete Recovery Request
 */
export interface CompleteRecoveryRequest {
  recoveryToken: string;
  password: string;
  passwordConfirmation: string;
}

/**
 * User Avatar
 */
export interface UserAvatar {
  id: string;
  uniqueId: string;
  userId: string;
  userUniqueId: string;
  bucket?: string;
  originalName?: string;
  name?: string;
  url?: string;
  thumbnail?: string;
  fileType?: string;
  fileSize?: number;
  description?: string;
  originalFile?: string;
  isPublic?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Create Avatar Request
 */
export interface CreateAvatarRequest {
  originalName: string;
  name: string;
  url: string;
  thumbnail?: string;
  fileType: string;
  fileSize: number;
  description?: string;
  originalFile?: string;
  isPublic?: boolean;
}

/**
 * Avatar Presign Response
 */
export interface AvatarPresignResponse {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

/**
 * Multipart Presign Request
 */
export interface MultipartPresignRequest {
  filename: string;
  partCount: number;
}

/**
 * Multipart Presign Response
 */
export interface MultipartPresignResponse {
  uploadId: string;
  key: string;
  parts: Array<{
    partNumber: number;
    uploadUrl: string;
  }>;
}

/**
 * Multipart Complete Request
 */
export interface MultipartCompleteRequest {
  filename: string;
  uploadId: string;
  parts: Array<{
    ETag: string;
    PartNumber: number;
  }>;
}

/**
 * Multipart Complete Response
 */
export interface MultipartCompleteResponse {
  publicUrl: string;
  fileName: string;
}
