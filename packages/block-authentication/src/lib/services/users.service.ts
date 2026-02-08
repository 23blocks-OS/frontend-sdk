import type { Transport, PageResult, ListParams } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  User,
  UserProfile,
  UserProfileFull,
  ProfileRequest,
  UpdateEmailRequest,
  UserDeviceFull,
  AddDeviceRequest,
  UserSearchRequest,
  AddUserSubscriptionRequest,
  Company,
  UserSubscription,
} from '../types/index.js';
import { userMapper, companyMapper } from '../mappers/index.js';
import type { AuthenticationBlockConfig } from '../authentication.block.js';

// Profile mapper
const profileMapper = {
  type: 'user_profile',
  map: (data: Record<string, unknown>): UserProfileFull => ({
    id: String(data['id'] ?? ''),
    uniqueId: String(data['unique_id'] ?? ''),
    userId: String(data['user_id'] ?? ''),
    userUniqueId: String(data['user_unique_id'] ?? ''),
    firstName: data['first_name'] as string | undefined,
    middleName: data['middle_name'] as string | undefined,
    lastName: data['last_name'] as string | undefined,
    gender: data['gender'] as string | undefined,
    ethnicity: data['ethnicity'] as string | undefined,
    zipcode: data['zipcode'] as string | undefined,
    maritalStatus: data['marital_status'] as string | undefined,
    birthdate: data['birthdate'] as string | undefined,
    hhi: data['hhi'] as string | undefined,
    children: data['children'] as string | undefined,
    source: data['source'] as string | undefined,
    email: data['email'] as string | undefined,
    phoneNumber: data['phone_number'] as string | undefined,
    preferredDevice: data['preferred_device'] as string | undefined,
    preferredLanguage: data['preferred_language'] as string | undefined,
    webSite: data['web_site'] as string | undefined,
    twitter: data['twitter'] as string | undefined,
    fb: data['fb'] as string | undefined,
    instagram: data['instagram'] as string | undefined,
    linkedin: data['linkedin'] as string | undefined,
    youtube: data['youtube'] as string | undefined,
    blog: data['blog'] as string | undefined,
    networkA: data['network_a'] as string | undefined,
    networkB: data['network_b'] as string | undefined,
    timeZone: data['time_zone'] as string | undefined,
    payload: data['payload'] as Record<string, unknown> | undefined,
    status: data['status'] as string | undefined,
    createdAt: data['created_at'] as string | undefined,
    updatedAt: data['updated_at'] as string | undefined,
  }),
};

// Device mapper
const deviceMapper = {
  type: 'user_device',
  map: (data: Record<string, unknown>): UserDeviceFull => ({
    id: String(data['id'] ?? ''),
    uniqueId: String(data['unique_id'] ?? ''),
    userId: String(data['user_id'] ?? ''),
    userUniqueId: String(data['user_unique_id'] ?? ''),
    deviceType: data['device_type'] as string | undefined,
    pushId: data['push_id'] as string | undefined,
    osType: data['os_type'] as string | undefined,
    defaultDevice: data['default_device'] as boolean | undefined,
    locationEnabled: data['location_enabled'] as boolean | undefined,
    notificationsEnabled: data['notifications_enabled'] as boolean | undefined,
    status: data['status'] as string | undefined,
    enabled: data['enabled'] as boolean | undefined,
    createdAt: data['created_at'] as string | undefined,
    updatedAt: data['updated_at'] as string | undefined,
  }),
};

// Subscription mapper
const subscriptionMapper = {
  type: 'user_subscription',
  map: (data: Record<string, unknown>): UserSubscription => ({
    id: String(data['id'] ?? ''),
    uniqueId: String(data['unique_id'] ?? ''),
    userId: data['user_id'] as string | undefined,
    userUniqueId: data['user_unique_id'] as string | undefined,
    subscriptionModelId: data['subscription_model_id'] as string | undefined,
    code: data['code'] as string | undefined,
    programCode: data['program_code'] as string | undefined,
    status: data['status'] as string | undefined,
    recurringPaymentFees: data['recurring_payment_fees'] as number | undefined,
    recurringPaymentAmount: data['recurring_payment_amount'] as number | undefined,
    payload: data['payload'] as Record<string, unknown> | undefined,
    createdAt: data['created_at'] as string | undefined,
    updatedAt: data['updated_at'] as string | undefined,
  }),
};

/**
 * User update request
 */
export interface UpdateUserRequest {
  name?: string;
  username?: string;
  nickname?: string;
  bio?: string;
  roleId?: string;
  status?: string;
}

/**
 * Profile update request
 */
export interface UpdateProfileRequest {
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
}

/**
 * Users service - CRUD operations on users, profiles, devices, companies, and subscriptions.
 */
export interface UsersService {
  /**
   * List users with pagination and filtering.
   *
   * @returns PageResult containing User objects (without relationships by default).
   *   Use `include: ['role', 'user_avatar', 'user_profile']` in params to load relationships.
   */
  list(params?: ListParams): Promise<PageResult<User>>;

  /**
   * Get a user by unique ID with role, avatar, and profile pre-loaded.
   *
   * @param uniqueId - The user's UUID (not database ID).
   * @returns User with `role`, `avatar`, and `profile` relationships populated.
   */
  get(uniqueId: string): Promise<User>;

  /**
   * Get a user by unique ID via the `/by_unique_id/` endpoint. Same result as `get()`.
   *
   * @param uniqueId - The user's UUID.
   * @returns User with `role`, `avatar`, and `profile` relationships populated.
   */
  getByUniqueId(uniqueId: string): Promise<User>;

  /**
   * Update a user's core fields (name, username, nickname, bio, role, status).
   *
   * @param uniqueId - The user's UUID.
   * @returns The updated User.
   * @note This updates the User record, not the profile. Use `updateProfile()` for profile fields.
   */
  update(uniqueId: string, request: UpdateUserRequest): Promise<User>;

  /**
   * Update a user's profile (firstName, lastName, phone, social links, payload, etc.).
   *
   * @param userUniqueId - The user's UUID.
   * @returns The User object (not the profile directly). Access updated profile fields
   *   via `user.profile?.firstName`, `user.profile?.payload`, etc.
   * @note Returns a User, not a UserProfile. The updated profile is nested in `user.profile`.
   * @note The `payload` field must be a JSON object, not a string.
   * @example
   * const user = await auth.users.updateProfile(uid, {
   *   firstName: 'Jane',
   *   payload: { department: 'Engineering' },
   * });
   * console.log(user.profile?.firstName); // 'Jane'
   */
  updateProfile(userUniqueId: string, request: UpdateProfileRequest): Promise<User>;

  /**
   * Soft-delete a user.
   *
   * @param uniqueId - The user's UUID.
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Activate a deactivated user.
   *
   * @returns The User with `status: 'active'`.
   */
  activate(uniqueId: string): Promise<User>;

  /**
   * Deactivate a user (prevents sign-in without deleting).
   *
   * @returns The User with `status: 'inactive'`.
   */
  deactivate(uniqueId: string): Promise<User>;

  /**
   * Change a user's role. Optionally force re-authentication.
   *
   * @param uniqueId - User unique ID.
   * @param roleUniqueId - The unique ID of the new role.
   * @param reason - Reason for role change (minimum 10 characters).
   * @param forceReauth - If true, invalidates the user's existing tokens.
   * @returns The updated User with the new role.
   * @example
   * const user = await auth.users.changeRole(
   *   userUid, roleUid, 'Promoted to admin', true
   * );
   */
  changeRole(uniqueId: string, roleUniqueId: string, reason: string, forceReauth?: boolean): Promise<User>;

  /**
   * Search users by a text query (searches name, email, username).
   *
   * @param query - Free-text search string.
   * @returns Paginated User results.
   */
  search(query: string, params?: ListParams): Promise<PageResult<User>>;

  /**
   * Advanced search by structured criteria or payload fields.
   *
   * @param request - Contains `searchBy` (field-value pairs), `payload` (JSON query), `orderBy`.
   * @returns Paginated User results.
   * @example
   * const results = await auth.users.searchAdvanced({
   *   searchBy: { status: 'active', role_id: '123' },
   *   payload: { department: 'Engineering' },
   *   orderBy: 'created_at desc',
   * });
   */
  searchAdvanced(request: UserSearchRequest, params?: ListParams): Promise<PageResult<User>>;

  /**
   * Get a user's profile directly (not nested in User).
   *
   * @returns UserProfileFull with all profile fields including `payload`.
   */
  getProfile(userUniqueId: string): Promise<UserProfileFull>;

  /**
   * Create or update the current user's profile.
   *
   * @returns UserProfileFull with the created/updated profile data.
   * @note The `payload` field accepts both objects and strings (strings are JSON.stringify'd).
   */
  createProfile(request: ProfileRequest): Promise<UserProfileFull>;

  /**
   * Update a user's email address. Requires password confirmation.
   *
   * @returns The User with the updated email (may trigger re-confirmation).
   */
  updateEmail(userUniqueId: string, request: UpdateEmailRequest): Promise<User>;

  /**
   * Get devices registered to a user.
   *
   * @returns Paginated list of UserDeviceFull objects.
   */
  getDevices(userUniqueId: string, params?: ListParams): Promise<PageResult<UserDeviceFull>>;

  /**
   * Add a device to the current user.
   *
   * @returns The created UserDeviceFull.
   */
  addDevice(request: AddDeviceRequest): Promise<UserDeviceFull>;

  /**
   * Get all companies a user belongs to (in multi-tenant setups).
   *
   * @returns Array of Company objects.
   */
  getCompanies(userUniqueId: string): Promise<Company[]>;

  /**
   * Add a subscription to a user.
   *
   * @param request - Contains `subscriptionUniqueId` and optional `payload` (object, not string).
   * @returns The created UserSubscription.
   */
  addSubscription(userUniqueId: string, request: AddUserSubscriptionRequest): Promise<UserSubscription>;

  /**
   * Update a user's subscription.
   *
   * @returns The updated UserSubscription.
   */
  updateSubscription(userUniqueId: string, request: AddUserSubscriptionRequest): Promise<UserSubscription>;

  /**
   * Resend the confirmation email for a specific user (by their UUID, not email).
   */
  resendConfirmationByUniqueId(userUniqueId: string): Promise<void>;
}

/**
 * Build filter params for list operations
 */
function buildListParams(params?: ListParams): Record<string, string | number | boolean | string[] | undefined> {
  if (!params) return {};

  const queryParams: Record<string, string | number | boolean | string[] | undefined> = {};

  if (params.page) {
    queryParams['page'] = params.page;
  }
  if (params.perPage) {
    queryParams['records'] = params.perPage;
  }

  if (params.sort) {
    const sorts = Array.isArray(params.sort) ? params.sort : [params.sort];
    queryParams['sort'] = sorts
      .map((s) => (s.direction === 'desc' ? `-${s.field}` : s.field))
      .join(',');
  }

  if (params.filter) {
    for (const [key, value] of Object.entries(params.filter)) {
      queryParams[`filter[${key}]`] = value;
    }
  }

  if (params.include) {
    queryParams['include'] = params.include.join(',');
  }

  return queryParams;
}

/**
 * Create the users service
 */
export function createUsersService(
  transport: Transport,
  _config: AuthenticationBlockConfig
): UsersService {
  return {
    async list(params?: ListParams): Promise<PageResult<User>> {
      const response = await transport.get<{ data: unknown[]; meta?: unknown }>(
        '/users',
        { params: buildListParams(params) }
      );
      return decodePageResult(response, userMapper);
    },

    async get(uniqueId: string): Promise<User> {
      const response = await transport.get<{ data: unknown }>(
        `/users/${uniqueId}`,
        { params: { include: 'role,user_avatar,user_profile' } }
      );
      return decodeOne(response, userMapper);
    },

    async getByUniqueId(uniqueId: string): Promise<User> {
      const response = await transport.get<{ data: unknown }>(
        `/users/by_unique_id/${uniqueId}`,
        { params: { include: 'role,user_avatar,user_profile' } }
      );
      return decodeOne(response, userMapper);
    },

    async update(uniqueId: string, request: UpdateUserRequest): Promise<User> {
      const response = await transport.put<{ data: unknown }>(
        `/users/${uniqueId}`,
        {
          user: {
            name: request.name,
            username: request.username,
            nickname: request.nickname,
            bio: request.bio,
            role_id: request.roleId,
            status: request.status,
          },
        }
      );
      return decodeOne(response, userMapper);
    },

    async updateProfile(userUniqueId: string, request: UpdateProfileRequest): Promise<User> {
      const response = await transport.put<{ data: unknown }>(
        `/users/${userUniqueId}/profile`,
        {
          profile: {
            first_name: request.firstName,
            middle_name: request.middleName,
            last_name: request.lastName,
            gender: request.gender,
            ethnicity: request.ethnicity,
            zipcode: request.zipcode,
            marital_status: request.maritalStatus,
            birthdate: request.birthdate,
            hhi: request.hhi,
            children: request.children,
            source: request.source,
            email: request.email,
            phone_number: request.phoneNumber,
            preferred_device: request.preferredDevice,
            preferred_language: request.preferredLanguage,
            web_site: request.webSite,
            twitter: request.twitter,
            fb: request.fb,
            instagram: request.instagram,
            linkedin: request.linkedin,
            youtube: request.youtube,
            blog: request.blog,
            network_a: request.networkA,
            network_b: request.networkB,
            time_zone: request.timeZone,
            payload: request.payload,
          },
        }
      );
      return decodeOne(response, userMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/users/${uniqueId}`);
    },

    async activate(uniqueId: string): Promise<User> {
      const response = await transport.post<{ data: unknown }>(
        `/users/${uniqueId}/activate`
      );
      return decodeOne(response, userMapper);
    },

    async deactivate(uniqueId: string): Promise<User> {
      const response = await transport.post<{ data: unknown }>(
        `/users/${uniqueId}/deactivate`
      );
      return decodeOne(response, userMapper);
    },

    async changeRole(uniqueId: string, roleUniqueId: string, reason: string, forceReauth?: boolean): Promise<User> {
      const response = await transport.put<{ data: unknown }>(
        `/users/${uniqueId}/role`,
        {
          role: {
            role_unique_id: roleUniqueId,
            reason: reason,
            force_reauth: forceReauth,
          },
        }
      );
      return decodeOne(response, userMapper);
    },

    async search(query: string, params?: ListParams): Promise<PageResult<User>> {
      const queryParams = buildListParams(params);
      queryParams['q'] = query;

      const response = await transport.get<{ data: unknown[]; meta?: unknown }>(
        '/users/search',
        { params: queryParams }
      );
      return decodePageResult(response, userMapper);
    },

    async searchAdvanced(request: UserSearchRequest, params?: ListParams): Promise<PageResult<User>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.post<{ data: unknown[]; meta?: unknown }>(
        '/users/search',
        {
          search: {
            search_by: request.searchBy,
            payload: request.payload,
            order_by: request.orderBy,
          },
        },
        { params: queryParams }
      );
      return decodePageResult(response, userMapper);
    },

    async getProfile(userUniqueId: string): Promise<UserProfileFull> {
      const response = await transport.get<unknown>(`/users/${userUniqueId}/profile`);
      return decodeOne(response, profileMapper);
    },

    async createProfile(request: ProfileRequest): Promise<UserProfileFull> {
      const payload = typeof request.payload === 'string' ? request.payload : JSON.stringify(request.payload);
      const response = await transport.post<unknown>('/users/profile', {
        profile: {
          first_name: request.firstName,
          middle_name: request.middleName,
          last_name: request.lastName,
          gender: request.gender,
          ethnicity: request.ethnicity,
          zipcode: request.zipcode,
          marital_status: request.maritalStatus,
          birthdate: request.birthdate,
          hhi: request.hhi,
          children: request.children,
          source: request.source,
          email: request.email,
          phone_number: request.phoneNumber,
          preferred_device: request.preferredDevice,
          preferred_language: request.preferredLanguage,
          web_site: request.webSite,
          twitter: request.twitter,
          fb: request.fb,
          instagram: request.instagram,
          linkedin: request.linkedin,
          youtube: request.youtube,
          blog: request.blog,
          network_a: request.networkA,
          network_b: request.networkB,
          time_zone: request.timeZone,
          payload: payload,
        },
      });
      return decodeOne(response, profileMapper);
    },

    async updateEmail(userUniqueId: string, request: UpdateEmailRequest): Promise<User> {
      const response = await transport.put<{ data: unknown }>(`/users/${userUniqueId}/email`, {
        user: {
          email: request.email,
          password: request.password,
          confirm_success_url: request.confirmSuccessUrl,
        },
      });
      return decodeOne(response, userMapper);
    },

    async getDevices(userUniqueId: string, params?: ListParams): Promise<PageResult<UserDeviceFull>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>(`/users/${userUniqueId}/devices`, { params: queryParams });
      return decodePageResult(response, deviceMapper);
    },

    async addDevice(request: AddDeviceRequest): Promise<UserDeviceFull> {
      const response = await transport.post<unknown>('/users/device', {
        device: {
          unique_id: request.uniqueId,
          device_type: request.deviceType,
          push_id: request.pushId,
          os_type: request.osType,
          default_device: request.defaultDevice,
          location_enabled: request.locationEnabled,
          notifications_enabled: request.notificationsEnabled,
        },
      });
      return decodeOne(response, deviceMapper);
    },

    async getCompanies(userUniqueId: string): Promise<Company[]> {
      const response = await transport.get<{ data: unknown[] }>(`/users/${userUniqueId}/companies`);
      return (response.data || []).map((item) => companyMapper.map(item as Record<string, unknown>));
    },

    async addSubscription(userUniqueId: string, request: AddUserSubscriptionRequest): Promise<UserSubscription> {
      const payload = typeof request.payload === 'string' ? request.payload : JSON.stringify(request.payload);
      const response = await transport.post<unknown>(`/users/${userUniqueId}/subscription`, {
        subscription: {
          subscription_unique_id: request.subscriptionUniqueId,
          payload: payload,
        },
      });
      return decodeOne(response, subscriptionMapper);
    },

    async updateSubscription(userUniqueId: string, request: AddUserSubscriptionRequest): Promise<UserSubscription> {
      const payload = typeof request.payload === 'string' ? request.payload : JSON.stringify(request.payload);
      const response = await transport.put<unknown>(`/users/${userUniqueId}/subscription`, {
        subscription: {
          subscription_unique_id: request.subscriptionUniqueId,
          payload: payload,
        },
      });
      return decodeOne(response, subscriptionMapper);
    },

    async resendConfirmationByUniqueId(userUniqueId: string): Promise<void> {
      await transport.post(`/users/${userUniqueId}/confirmation`, {});
    },
  };
}
