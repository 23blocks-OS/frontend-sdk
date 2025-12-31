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
  zipcode?: string;
  phoneNumber?: string;
  preferredLanguage?: string;
  timeZone?: string;
  webSite?: string;
  twitter?: string;
  fb?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  blog?: string;
  payload?: Record<string, unknown>;
}

/**
 * Users service
 */
export interface UsersService {
  /**
   * List users with pagination and filtering
   */
  list(params?: ListParams): Promise<PageResult<User>>;

  /**
   * Get a user by ID
   */
  get(id: string): Promise<User>;

  /**
   * Get a user by unique ID
   */
  getByUniqueId(uniqueId: string): Promise<User>;

  /**
   * Update a user
   */
  update(id: string, request: UpdateUserRequest): Promise<User>;

  /**
   * Update user profile
   */
  updateProfile(userId: string, request: UpdateProfileRequest): Promise<User>;

  /**
   * Delete a user
   */
  delete(id: string): Promise<void>;

  /**
   * Activate a user
   */
  activate(id: string): Promise<User>;

  /**
   * Deactivate a user
   */
  deactivate(id: string): Promise<User>;

  /**
   * Change user role
   * @param id - User unique ID
   * @param roleUniqueId - The unique ID of the new role
   * @param reason - Reason for role change (minimum 10 characters)
   * @param forceReauth - If true, invalidates user's existing tokens
   */
  changeRole(id: string, roleUniqueId: string, reason: string, forceReauth?: boolean): Promise<User>;

  /**
   * Search users
   */
  search(query: string, params?: ListParams): Promise<PageResult<User>>;

  /**
   * Advanced search users by criteria or payload
   */
  searchAdvanced(request: UserSearchRequest, params?: ListParams): Promise<PageResult<User>>;

  /**
   * Get user profile
   */
  getProfile(userUniqueId: string): Promise<UserProfileFull>;

  /**
   * Create or update user profile
   */
  createProfile(request: ProfileRequest): Promise<UserProfileFull>;

  /**
   * Update email address
   */
  updateEmail(userUniqueId: string, request: UpdateEmailRequest): Promise<User>;

  /**
   * Get user devices
   */
  getDevices(userUniqueId: string, params?: ListParams): Promise<PageResult<UserDeviceFull>>;

  /**
   * Add a device
   */
  addDevice(request: AddDeviceRequest): Promise<UserDeviceFull>;

  /**
   * Get user's companies
   */
  getCompanies(userUniqueId: string): Promise<Company[]>;

  /**
   * Add subscription to user
   */
  addSubscription(userUniqueId: string, request: AddUserSubscriptionRequest): Promise<UserSubscription>;

  /**
   * Update user subscription
   */
  updateSubscription(userUniqueId: string, request: AddUserSubscriptionRequest): Promise<UserSubscription>;

  /**
   * Resend confirmation email by user unique ID
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
    queryParams['page[number]'] = params.page;
  }
  if (params.perPage) {
    queryParams['page[size]'] = params.perPage;
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

    async get(id: string): Promise<User> {
      const response = await transport.get<{ data: unknown }>(
        `/users/${id}`,
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

    async update(id: string, request: UpdateUserRequest): Promise<User> {
      const response = await transport.put<{ data: unknown }>(
        `/users/${id}`,
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

    async updateProfile(userId: string, request: UpdateProfileRequest): Promise<User> {
      const response = await transport.put<{ data: unknown }>(
        `/users/${userId}/profile`,
        {
          profile: {
            first_name: request.firstName,
            middle_name: request.middleName,
            last_name: request.lastName,
            gender: request.gender,
            zipcode: request.zipcode,
            phone_number: request.phoneNumber,
            preferred_language: request.preferredLanguage,
            time_zone: request.timeZone,
            web_site: request.webSite,
            twitter: request.twitter,
            fb: request.fb,
            instagram: request.instagram,
            linkedin: request.linkedin,
            youtube: request.youtube,
            blog: request.blog,
            payload: request.payload,
          },
        }
      );
      return decodeOne(response, userMapper);
    },

    async delete(id: string): Promise<void> {
      await transport.delete(`/users/${id}`);
    },

    async activate(id: string): Promise<User> {
      const response = await transport.post<{ data: unknown }>(
        `/users/${id}/activate`
      );
      return decodeOne(response, userMapper);
    },

    async deactivate(id: string): Promise<User> {
      const response = await transport.post<{ data: unknown }>(
        `/users/${id}/deactivate`
      );
      return decodeOne(response, userMapper);
    },

    async changeRole(id: string, roleUniqueId: string, reason: string, forceReauth?: boolean): Promise<User> {
      const response = await transport.put<{ data: unknown }>(
        `/users/${id}/role`,
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
