import { BlockErrorException, type Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type {
  OAuthSocialLoginRequest,
  TenantLoginRequest,
  TokenIntrospectionResponse,
  TokenRevokeRequest,
  TokenRevokeAllRequest,
  TokenRevokeResponse,
  TenantContextCreateRequest,
  TenantContextResponse,
  TenantContextRevokeRequest,
  TenantContextAuditEntry,
  SignInResponse,
  DeviceAuthorizationRequest,
  DeviceAuthorizationResponse,
  DeviceVerificationRequest,
  DeviceVerificationResponse,
  DeviceTokenPollRequest,
  DeviceTokenResponse,
} from '../types/index.js';
import { userMapper } from '../mappers/index.js';

/**
 * OAuth service - social login, token introspection/revocation, and tenant context switching.
 */
export interface OAuthService {
  /**
   * Login with a Facebook access token. Creates or signs in the user.
   *
   * @returns SignInResponse with `user`, `accessToken`, optional `refreshToken`.
   */
  facebookLogin(request: OAuthSocialLoginRequest): Promise<SignInResponse>;

  /**
   * Login with a Google access token. Creates or signs in the user.
   *
   * @returns SignInResponse with `user`, `accessToken`, optional `refreshToken`.
   */
  googleLogin(request: OAuthSocialLoginRequest): Promise<SignInResponse>;

  /**
   * Login to a specific tenant with email and password.
   *
   * @returns SignInResponse scoped to the target tenant.
   */
  tenantLogin(request: TenantLoginRequest): Promise<SignInResponse>;

  /**
   * Introspect a token to check validity and get metadata.
   *
   * @param token - The token to introspect (defaults to the current session token).
   * @returns TokenIntrospectionResponse with `active`, `userUniqueId`, `scopes`, `expiresAt`.
   */
  introspectToken(token?: string): Promise<TokenIntrospectionResponse>;

  /**
   * Refresh an access token using a refresh token (OAuth2 endpoint).
   *
   * @returns New `accessToken`, optional `refreshToken`, `tokenType`, `expiresIn`.
   */
  refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    tokenType: string;
    expiresIn?: number;
  }>;

  /**
   * Revoke a single token (access or refresh).
   *
   * @returns TokenRevokeResponse with `revoked`, `message`, `revokedAt`.
   */
  revokeToken(request: TokenRevokeRequest): Promise<TokenRevokeResponse>;

  /**
   * Revoke all tokens for a user (or all tokens for a specific device).
   *
   * @returns TokenRevokeResponse with `revoked`, `message`, `revokedAt`.
   */
  revokeAllTokens(request: TokenRevokeAllRequest): Promise<TokenRevokeResponse>;

  /**
   * Create a tenant context - switch the current session to a different tenant/company.
   *
   * @returns TenantContextResponse with `tenantContextToken`, `expiresIn`, `tenantInfo`.
   */
  createTenantContext(request: TenantContextCreateRequest): Promise<TenantContextResponse>;

  /**
   * Revoke an active tenant context, returning to the original tenant.
   */
  revokeTenantContext(request: TenantContextRevokeRequest): Promise<{ message: string }>;

  /**
   * Get the audit log of tenant context switches.
   *
   * @returns Array of TenantContextAuditEntry with `companyName`, `switchReason`, `active`, `revoked`.
   */
  getTenantContextAudit(): Promise<TenantContextAuditEntry[]>;

  /**
   * Start an OAuth device authorization (RFC 8628). Show `userCode` and `verificationUri`
   * to the user, then call `pollDeviceToken`.
   *
   * @returns DeviceAuthorizationResponse with `deviceCode`, `userCode`, `verificationUri`, `expiresIn`, `interval`.
   */
  authorizeDevice(request?: DeviceAuthorizationRequest): Promise<DeviceAuthorizationResponse>;

  /**
   * Approve a device by its user code. Requires a signed-in user (Bearer token).
   *
   * @returns DeviceVerificationResponse with `status` ('approved').
   */
  verifyDevice(request: DeviceVerificationRequest): Promise<DeviceVerificationResponse>;

  /**
   * Poll `/oauth/token` until the user approves the device.
   * Waits `interval` seconds between polls, adds 5s on `slow_down`, and rejects with a
   * BlockErrorException (code `access_denied`, `expired_token`, or `aborted`) when the flow ends.
   *
   * @returns DeviceTokenResponse with `accessToken`, optional `refreshToken`, `tokenType`, `expiresIn`.
   */
  pollDeviceToken(request: DeviceTokenPollRequest): Promise<DeviceTokenResponse>;
}

/**
 * Create the OAuth service
 */
export function createOAuthService(transport: Transport, _config?: unknown): OAuthService {
  return {
    async facebookLogin(request: OAuthSocialLoginRequest): Promise<SignInResponse> {
      const response = await transport.post<{
        data: unknown;
        meta?: {
          auth?: {
            access_token?: string;
            refresh_token?: string;
            expires_in?: number;
          };
        };
      }>(
        '/auth/facebook',
        {
          token: request.token,
          subscription: request.subscription,
        },
        request.oauthMode ? { headers: { 'X-OAuth-Mode': 'true' } } : undefined,
      );

      const user = decodeOne(response, userMapper);
      return {
        user,
        accessToken: response.meta?.auth?.access_token ?? '',
        refreshToken: response.meta?.auth?.refresh_token,
        tokenType: 'Bearer',
        expiresIn: response.meta?.auth?.expires_in,
      };
    },

    async googleLogin(request: OAuthSocialLoginRequest): Promise<SignInResponse> {
      const response = await transport.post<{
        data: unknown;
        meta?: {
          auth?: {
            access_token?: string;
            refresh_token?: string;
            expires_in?: number;
          };
        };
      }>(
        '/auth/google',
        {
          token: request.token,
          subscription: request.subscription,
        },
        request.oauthMode ? { headers: { 'X-OAuth-Mode': 'true' } } : undefined,
      );

      const user = decodeOne(response, userMapper);
      return {
        user,
        accessToken: response.meta?.auth?.access_token ?? '',
        refreshToken: response.meta?.auth?.refresh_token,
        tokenType: 'Bearer',
        expiresIn: response.meta?.auth?.expires_in,
      };
    },

    async tenantLogin(request: TenantLoginRequest): Promise<SignInResponse> {
      const response = await transport.post<{
        data: unknown;
        meta?: {
          auth?: {
            access_token?: string;
            refresh_token?: string;
            expires_in?: number;
          };
        };
      }>('/auth/tenant/login', {
        email: request.email,
        password: request.password,
      });

      const user = decodeOne(response, userMapper);
      return {
        user,
        accessToken: response.meta?.auth?.access_token ?? '',
        refreshToken: response.meta?.auth?.refresh_token,
        tokenType: 'Bearer',
        expiresIn: response.meta?.auth?.expires_in,
      };
    },

    async introspectToken(token?: string): Promise<TokenIntrospectionResponse> {
      const response = await transport.post<{
        active: boolean;
        user_unique_id?: string;
        user_role_id?: string;
        company_id?: string;
        scopes?: string[];
        expires_at?: string;
        issued_at?: string;
        issuer?: string;
        app_id?: string;
        app_name?: string;
        error?: string;
      }>('/auth/introspect', token ? { token } : {});

      return {
        active: response.active,
        userUniqueId: response.user_unique_id,
        userRoleId: response.user_role_id,
        companyId: response.company_id,
        scopes: response.scopes,
        expiresAt: response.expires_at,
        issuedAt: response.issued_at,
        issuer: response.issuer,
        appId: response.app_id,
        appName: response.app_name,
        error: response.error,
      };
    },

    async refreshToken(refreshToken: string): Promise<{
      accessToken: string;
      refreshToken?: string;
      tokenType: string;
      expiresIn?: number;
    }> {
      const response = await transport.post<{
        access_token: string;
        refresh_token?: string;
        token_type: string;
        expires_in?: number;
      }>('/oauth/token/refresh', {
        refresh_token: refreshToken,
      });

      return {
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        tokenType: response.token_type,
        expiresIn: response.expires_in,
      };
    },

    async revokeToken(request: TokenRevokeRequest): Promise<TokenRevokeResponse> {
      const response = await transport.post<{
        revoked: boolean;
        message?: string;
        revoked_at?: string;
      }>('/oauth/token/revoke', {
        token: request.token,
        token_type_hint: request.tokenTypeHint,
      });

      return {
        revoked: response.revoked,
        message: response.message,
        revokedAt: response.revoked_at,
      };
    },

    async revokeAllTokens(request: TokenRevokeAllRequest): Promise<TokenRevokeResponse> {
      const response = await transport.post<{
        revoked: boolean;
        message?: string;
        revoked_at?: string;
      }>('/oauth/token/revoke_all', {
        user_unique_id: request.userUniqueId,
        device_id: request.deviceId,
      });

      return {
        revoked: response.revoked,
        message: response.message,
        revokedAt: response.revoked_at,
      };
    },

    async createTenantContext(request: TenantContextCreateRequest): Promise<TenantContextResponse> {
      const response = await transport.post<{
        data: {
          id: string;
          type: string;
          attributes: {
            tenant_context_token: string;
            expires_in: number;
            expires_at: string;
            tenant_info: {
              company_id: string;
              company_name: string;
              company_url_id: string;
              role_id: number;
              role_name: string;
              permissions: string[];
              schema_name: string;
            };
            audit_id: number;
          };
        };
      }>('/auth/tenant-context', {
        tenant_context: {
          company_url_id: request.companyUrlId,
          company_id: request.companyId,
          switch_reason: request.switchReason,
        },
      });

      const attrs = response.data.attributes;
      return {
        tenantContextToken: attrs.tenant_context_token,
        expiresIn: attrs.expires_in,
        expiresAt: attrs.expires_at,
        tenantInfo: {
          companyId: attrs.tenant_info.company_id,
          companyName: attrs.tenant_info.company_name,
          companyUrlId: attrs.tenant_info.company_url_id,
          roleId: attrs.tenant_info.role_id,
          roleName: attrs.tenant_info.role_name,
          permissions: attrs.tenant_info.permissions,
          schemaName: attrs.tenant_info.schema_name,
        },
        auditId: attrs.audit_id,
      };
    },

    async revokeTenantContext(request: TenantContextRevokeRequest): Promise<{ message: string }> {
      const response = await transport.post<{ message: string }>('/auth/tenant-context/revoke', {
        tenant_context: {
          tenant_context_token_id: request.tenantContextTokenId,
        },
      });
      return response;
    },

    async getTenantContextAudit(): Promise<TenantContextAuditEntry[]> {
      const response = await transport.get<{
        data: Array<{
          id: number;
          type: string;
          attributes: {
            company_name: string;
            company_url_id: string;
            switch_reason: string;
            created_at: string;
            expires_at: string;
            revoked: boolean;
            revoked_at: string | null;
            ip_address: string;
            active: boolean;
          };
        }>;
      }>('/auth/tenant-context/audit');

      return response.data.map((item) => ({
        id: item.id,
        companyName: item.attributes.company_name,
        companyUrlId: item.attributes.company_url_id,
        switchReason: item.attributes.switch_reason,
        createdAt: item.attributes.created_at,
        expiresAt: item.attributes.expires_at,
        revoked: item.attributes.revoked,
        revokedAt: item.attributes.revoked_at,
        ipAddress: item.attributes.ip_address,
        active: item.attributes.active,
      }));
    },

    async authorizeDevice(request?: DeviceAuthorizationRequest): Promise<DeviceAuthorizationResponse> {
      const response = await transport.post<{
        device_code: string;
        user_code: string;
        verification_uri: string;
        verification_uri_complete?: string;
        expires_in: number;
        interval: number;
      }>('/device/authorize', {
        client_id: request?.clientId,
        scope: request?.scope,
      });

      return {
        deviceCode: response.device_code,
        userCode: response.user_code,
        verificationUri: response.verification_uri,
        verificationUriComplete: response.verification_uri_complete,
        expiresIn: response.expires_in,
        interval: response.interval,
      };
    },

    async verifyDevice(request: DeviceVerificationRequest): Promise<DeviceVerificationResponse> {
      const response = await transport.post<{
        data: { type: string; attributes: { status: string } };
      }>('/device/verify', {
        user_code: request.userCode,
      });

      return { status: response.data.attributes.status };
    },

    async pollDeviceToken(request: DeviceTokenPollRequest): Promise<DeviceTokenResponse> {
      let intervalMs = (request.interval ?? 5) * 1000;
      const deadline = request.expiresIn ? Date.now() + request.expiresIn * 1000 : undefined;

      const wait = (ms: number) =>
        new Promise<void>((resolve, reject) => {
          const onAbort = () => {
            clearTimeout(timer);
            reject(new BlockErrorException({ code: 'aborted', message: 'Device polling aborted', status: 0 }));
          };
          const timer = setTimeout(() => {
            request.signal?.removeEventListener('abort', onAbort);
            resolve();
          }, ms);
          request.signal?.addEventListener('abort', onAbort, { once: true });
        });

      for (;;) {
        if (request.signal?.aborted) {
          throw new BlockErrorException({ code: 'aborted', message: 'Device polling aborted', status: 0 });
        }
        await wait(intervalMs);
        if (deadline && Date.now() > deadline) {
          throw new BlockErrorException({ code: 'expired_token', message: 'Device code expired', status: 400 });
        }

        try {
          const response = await transport.post<{
            access_token: string;
            refresh_token?: string;
            token_type: string;
            expires_in?: number;
          }>('/oauth/token', {
            grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
            device_code: request.deviceCode,
            client_id: request.clientId,
          });

          return {
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            tokenType: response.token_type,
            expiresIn: response.expires_in,
          };
        } catch (error) {
          if (error instanceof BlockErrorException) {
            if (error.code === 'authorization_pending') continue;
            if (error.code === 'slow_down') {
              intervalMs += 5000;
              continue;
            }
          }
          throw error;
        }
      }
    },
  };
}
