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
  ResendConfirmationRequest,
  ValidateEmailRequest,
  ValidateEmailResponse,
  ValidateDocumentRequest,
  ValidateDocumentResponse,
  ResendInvitationRequest,
  AccountRecoveryRequest,
  AccountRecoveryResponse,
  CompleteRecoveryRequest,
  User,
} from '../types/index.js';
import { userMapper } from '../mappers/index.js';
import type { AuthenticationBlockConfig } from '../authentication.block.js';

/**
 * Authentication service - handles sign in, sign up, sign out, password management,
 * magic links, invitations, email confirmation, and account recovery.
 */
export interface AuthService {
  /**
   * Sign in with email and password.
   *
   * @returns SignInResponse containing `user` (with role/avatar/profile if included),
   *   `accessToken`, optional `refreshToken`, `tokenType`, and `expiresIn`.
   * @example
   * const { user, accessToken } = await auth.auth.signIn({
   *   email: 'user@example.com',
   *   password: 'password',
   * });
   */
  signIn(request: SignInRequest): Promise<SignInResponse>;

  /**
   * Sign up a new user.
   *
   * @returns SignUpResponse containing `user`, optional `accessToken` (may be absent
   *   if email confirmation is required), and optional `message`.
   * @note If email confirmation is enabled, `accessToken` will be undefined until confirmed.
   */
  signUp(request: SignUpRequest): Promise<SignUpResponse>;

  /**
   * Sign out the current user. Invalidates the current session server-side.
   */
  signOut(): Promise<void>;

  /**
   * Validate the current token and get basic user info.
   *
   * @returns TokenValidationResponse with `user` (without relationships) and `valid: true`.
   * @note Unlike `getCurrentUser()`, this does NOT include role, avatar, or profile relationships.
   *   Use this for lightweight token checks; use `getCurrentUser()` for full user data.
   */
  validateToken(): Promise<TokenValidationResponse>;

  /**
   * Get the current authenticated user with all relationships pre-loaded.
   *
   * @returns User with `role`, `avatar`, and `profile` relationships populated.
   *   Access profile data via `user.profile?.firstName`, role via `user.role?.name`.
   * @example
   * const user = await auth.auth.getCurrentUser();
   * console.log(user.profile?.firstName); // 'Jane'
   * console.log(user.role?.name);         // 'admin'
   * console.log(user.avatar?.url);        // 'https://...'
   */
  getCurrentUser(): Promise<User>;

  /**
   * Request a password reset email. Sends an email with a reset link.
   *
   * @param request - Contains `email` and optional `redirectUrl` for the reset page.
   */
  requestPasswordReset(request: PasswordResetRequest): Promise<void>;

  /**
   * Update password using either a reset token or the current password.
   *
   * @param request - Provide `resetPasswordToken` for reset flow, or `currentPassword` for change flow.
   */
  updatePassword(request: PasswordUpdateRequest): Promise<void>;

  /**
   * Refresh the access token using a refresh token.
   *
   * @returns RefreshTokenResponse with new `accessToken`, optional new `refreshToken`,
   *   `tokenType`, and `expiresIn`.
   */
  refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse>;

  /**
   * Request a magic link for passwordless login. Sends an email with a login link.
   */
  requestMagicLink(request: MagicLinkRequest): Promise<void>;

  /**
   * Verify a magic link token and sign in.
   *
   * @returns SignInResponse with `user`, `accessToken`, optional `refreshToken`.
   */
  verifyMagicLink(request: MagicLinkVerifyRequest): Promise<SignInResponse>;

  /**
   * Send an invitation email to a new user.
   *
   * @param request - Contains `email`, optional `roleId`, and optional `redirectUrl`.
   */
  sendInvitation(request: InvitationRequest): Promise<void>;

  /**
   * Accept an invitation and create the user's account.
   *
   * @returns SignInResponse with the new `user`, `accessToken`, optional `refreshToken`.
   */
  acceptInvitation(request: AcceptInvitationRequest): Promise<SignInResponse>;

  /**
   * Confirm email address using a confirmation token (from the confirmation email link).
   *
   * @returns The confirmed User.
   */
  confirmEmail(token: string): Promise<User>;

  /**
   * Resend the confirmation email for an unconfirmed user.
   */
  resendConfirmation(request: ResendConfirmationRequest): Promise<void>;

  /**
   * Validate an email before registration. Checks format, existence, and account status.
   *
   * @returns ValidateEmailResponse with `exists`, `wellFormed`, `canRecover`, `accountStatus`.
   */
  validateEmail(request: ValidateEmailRequest): Promise<ValidateEmailResponse>;

  /**
   * Validate a document (e.g., ID number) before registration. Checks existence and account status.
   *
   * @returns ValidateDocumentResponse with `exists`, `canRecover`, `maskedEmail`, `accountStatus`.
   */
  validateDocument(request: ValidateDocumentRequest): Promise<ValidateDocumentResponse>;

  /**
   * Resend an invitation email to a previously invited user.
   *
   * @returns The User whose invitation was resent.
   */
  resendInvitation(request: ResendInvitationRequest): Promise<User>;

  /**
   * Request account recovery for a deleted/deactivated account. Sends a recovery email.
   *
   * @returns AccountRecoveryResponse with `success` and `message`.
   */
  requestAccountRecovery(request: AccountRecoveryRequest): Promise<AccountRecoveryResponse>;

  /**
   * Complete account recovery by setting a new password with the recovery token.
   *
   * @returns The recovered User.
   */
  completeAccountRecovery(request: CompleteRecoveryRequest): Promise<User>;
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

    async resendConfirmation(request: ResendConfirmationRequest): Promise<void> {
      await transport.post('/users/reconfirm', {
        confirm_success_url: request.confirmSuccessUrl,
        user: {
          email: request.email,
        },
      });
    },

    async validateEmail(request: ValidateEmailRequest): Promise<ValidateEmailResponse> {
      const response = await transport.post<{
        data: {
          attributes: {
            email: string | null;
            exists: boolean;
            masked_email: string | null;
            well_formed: boolean;
            can_recover?: boolean;
            account_status?: string;
          };
        };
      }>('/users/validate-email', {
        email: request.email,
      });

      const attrs = response.data.attributes;
      return {
        email: attrs.email,
        exists: attrs.exists,
        maskedEmail: attrs.masked_email,
        wellFormed: attrs.well_formed,
        canRecover: attrs.can_recover,
        accountStatus: attrs.account_status,
      };
    },

    async validateDocument(request: ValidateDocumentRequest): Promise<ValidateDocumentResponse> {
      const response = await transport.post<{
        data: {
          attributes: {
            document_type: string;
            document_number: string;
            exists: boolean;
            masked_email: string | null;
            masked_document: string | null;
            can_recover: boolean;
            account_status?: string;
          };
        };
      }>('/users/validate-document', {
        document_type: request.documentType,
        document_number: request.documentNumber,
      });

      const attrs = response.data.attributes;
      return {
        documentType: attrs.document_type,
        documentNumber: attrs.document_number,
        exists: attrs.exists,
        maskedEmail: attrs.masked_email,
        maskedDocument: attrs.masked_document,
        canRecover: attrs.can_recover,
        accountStatus: attrs.account_status,
      };
    },

    async resendInvitation(request: ResendInvitationRequest): Promise<User> {
      const response = await transport.post<{ data: unknown }>('/auth/invitation/resend', {
        invitation: {
          email: request.email,
          appid: request.appid,
          accept_invitation_url: request.acceptInvitationUrl,
        },
      });
      return decodeOne(response, userMapper);
    },

    async requestAccountRecovery(request: AccountRecoveryRequest): Promise<AccountRecoveryResponse> {
      const response = await transport.post<{
        data: {
          type: string;
          attributes: {
            success: boolean;
            message: string;
          };
        };
      }>('/users/recover', {
        email: request.email,
        recovery_url: request.recoveryUrl,
      });

      return {
        success: response.data.attributes.success,
        message: response.data.attributes.message,
      };
    },

    async completeAccountRecovery(request: CompleteRecoveryRequest): Promise<User> {
      const response = await transport.put<{ data: unknown }>('/users/recover', {
        recovery_token: request.recoveryToken,
        password: request.password,
        password_confirmation: request.passwordConfirmation,
      });
      return decodeOne(response, userMapper);
    },
  };
}
