import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type {
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  PasswordResetRequest,
  PasswordUpdateRequest,
  TokenValidationResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  MagicLinkRequest,
  MagicLinkVerifyRequest,
  InvitationRequest,
  AcceptInvitationRequest,
  User,
} from '../types/index.js';
import { userMapper } from '../mappers/index.js';
import type { AuthenticationBlockConfig } from '../authentication.block.js';

/**
 * Authentication service
 */
export interface AuthService {
  /**
   * Sign in with email and password
   */
  signIn(request: SignInRequest): Promise<SignInResponse>;

  /**
   * Sign up a new user
   */
  signUp(request: SignUpRequest): Promise<SignUpResponse>;

  /**
   * Sign out the current user
   */
  signOut(): Promise<void>;

  /**
   * Validate the current token and get user info
   */
  validateToken(): Promise<TokenValidationResponse>;

  /**
   * Get the current authenticated user
   */
  getCurrentUser(): Promise<User>;

  /**
   * Request a password reset email
   */
  requestPasswordReset(request: PasswordResetRequest): Promise<void>;

  /**
   * Update password (with reset token or current password)
   */
  updatePassword(request: PasswordUpdateRequest): Promise<void>;

  /**
   * Refresh the access token
   */
  refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse>;

  /**
   * Request a magic link for passwordless login
   */
  requestMagicLink(request: MagicLinkRequest): Promise<void>;

  /**
   * Verify a magic link token
   */
  verifyMagicLink(request: MagicLinkVerifyRequest): Promise<SignInResponse>;

  /**
   * Send an invitation to a new user
   */
  sendInvitation(request: InvitationRequest): Promise<void>;

  /**
   * Accept an invitation
   */
  acceptInvitation(request: AcceptInvitationRequest): Promise<SignInResponse>;

  /**
   * Confirm email with token
   */
  confirmEmail(token: string): Promise<User>;

  /**
   * Resend confirmation email
   */
  resendConfirmation(email: string): Promise<void>;
}

/**
 * Create the auth service
 */
export function createAuthService(
  transport: Transport,
  _config: AuthenticationBlockConfig
): AuthService {
  return {
    async signIn(request: SignInRequest): Promise<SignInResponse> {
      const response = await transport.post<{
        data: unknown;
        meta?: { token?: string; access_token?: string; refresh_token?: string; expires_in?: number; auth?: { access_token?: string; refresh_token?: string; expires_in?: number } };
      }>('/auth/sign_in', {
        email: request.email,
        password: request.password,
      });

      const user = decodeOne(response, userMapper);

      return {
        user,
        accessToken: response.meta?.auth?.access_token ?? response.meta?.access_token ?? response.meta?.token ?? '',
        refreshToken: response.meta?.auth?.refresh_token ?? response.meta?.refresh_token,
        tokenType: 'Bearer',
        expiresIn: response.meta?.auth?.expires_in ?? response.meta?.expires_in,
      };
    },

    async signUp(request: SignUpRequest): Promise<SignUpResponse> {
      const response = await transport.post<{
        data: unknown;
        meta?: { token?: string; access_token?: string; message?: string; auth?: { access_token?: string; refresh_token?: string; expires_in?: number } };
      }>('/auth', {
        confirm_success_url: request.confirmSuccessUrl,
        subscription: request.subscription,
        user: {
          email: request.email,
          password: request.password,
          password_confirmation: request.passwordConfirmation,
          name: request.name,
          username: request.username,
          role_id: request.roleId,
          time_zone: request.timeZone,
          preferred_language: request.preferredLanguage,
          payload: request.payload,
          unique_id: request.uniqueId,
          provider: request.provider,
          uid: request.uid,
        },
      });

      const user = decodeOne(response, userMapper);

      return {
        user,
        accessToken: response.meta?.auth?.access_token ?? response.meta?.access_token ?? response.meta?.token,
        message: response.meta?.message,
      };
    },

    async signOut(): Promise<void> {
      await transport.delete('/auth/sign_out');
    },

    async validateToken(): Promise<TokenValidationResponse> {
      const response = await transport.get<{ data: unknown }>('/auth/validate_token');
      const user = decodeOne(response, userMapper);

      return {
        user,
        valid: true,
      };
    },

    async getCurrentUser(): Promise<User> {
      const response = await transport.get<{ data: unknown }>(
        '/auth/validate_token',
        { params: { include: 'role,user_avatar,user_profile' } }
      );
      return decodeOne(response, userMapper);
    },

    async requestPasswordReset(request: PasswordResetRequest): Promise<void> {
      await transport.post('/auth/password', {
        email: request.email,
        redirect_url: request.redirectUrl,
      });
    },

    async updatePassword(request: PasswordUpdateRequest): Promise<void> {
      await transport.put('/auth/password', {
        password: request.password,
        password_confirmation: request.passwordConfirmation,
        reset_password_token: request.resetPasswordToken,
        current_password: request.currentPassword,
      });
    },

    async refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
      const response = await transport.post<{
        meta: { access_token: string; refresh_token?: string; expires_in?: number };
      }>('/auth/refresh', {
        refresh_token: request.refreshToken,
      });

      return {
        accessToken: response.meta.access_token,
        refreshToken: response.meta.refresh_token,
        tokenType: 'Bearer',
        expiresIn: response.meta.expires_in,
      };
    },

    async requestMagicLink(request: MagicLinkRequest): Promise<void> {
      await transport.post('/auth/magic_link', {
        email: request.email,
        redirect_url: request.redirectUrl,
      });
    },

    async verifyMagicLink(request: MagicLinkVerifyRequest): Promise<SignInResponse> {
      const response = await transport.post<{
        data: unknown;
        meta?: { access_token?: string; refresh_token?: string; expires_in?: number };
      }>('/auth/magic_link/verify', {
        token: request.token,
      });

      const user = decodeOne(response, userMapper);

      return {
        user,
        accessToken: response.meta?.access_token ?? '',
        refreshToken: response.meta?.refresh_token,
        tokenType: 'Bearer',
        expiresIn: response.meta?.expires_in,
      };
    },

    async sendInvitation(request: InvitationRequest): Promise<void> {
      await transport.post('/auth/invitation', {
        user: {
          email: request.email,
          role_id: request.roleId,
          accept_invitation_url: request.redirectUrl,
        },
      });
    },

    async acceptInvitation(request: AcceptInvitationRequest): Promise<SignInResponse> {
      const response = await transport.put<{
        data: unknown;
        meta?: { access_token?: string; refresh_token?: string; expires_in?: number; auth?: { access_token?: string; refresh_token?: string; expires_in?: number } };
      }>('/auth/invitation', {
        invitation: {
          invitation_token: request.invitationToken,
          password: request.password,
          name: request.name,
        },
      });

      const user = decodeOne(response, userMapper);

      return {
        user,
        accessToken: response.meta?.auth?.access_token ?? response.meta?.access_token ?? '',
        refreshToken: response.meta?.auth?.refresh_token ?? response.meta?.refresh_token,
        tokenType: 'Bearer',
        expiresIn: response.meta?.auth?.expires_in ?? response.meta?.expires_in,
      };
    },

    async confirmEmail(token: string): Promise<User> {
      const response = await transport.get<{ data: unknown }>('/auth/confirmation', {
        params: { confirmation_token: token },
      });
      return decodeOne(response, userMapper);
    },

    async resendConfirmation(email: string): Promise<void> {
      await transport.post('/auth/confirmation', { email });
    },
  };
}
