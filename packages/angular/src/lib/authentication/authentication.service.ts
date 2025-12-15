import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, from, tap } from 'rxjs';
import type { Transport, PageResult, ListParams } from '@23blocks/contracts';
import {
  createAuthenticationBlock,
  type AuthenticationBlock,
  type AuthenticationBlockConfig,
  type User,
  type Role,
  type Permission,
  type SignInRequest,
  type SignInResponse,
  type SignUpRequest,
  type SignUpResponse,
  type PasswordResetRequest,
  type PasswordUpdateRequest,
  type TokenValidationResponse,
  type RefreshTokenRequest,
  type RefreshTokenResponse,
  type MagicLinkRequest,
  type MagicLinkVerifyRequest,
  type InvitationRequest,
  type AcceptInvitationRequest,
  type ResendConfirmationRequest,
  type ValidateEmailRequest,
  type ValidateEmailResponse,
  type ValidateDocumentRequest,
  type ValidateDocumentResponse,
  type ApiKey,
  type ApiKeyWithSecret,
  type CreateApiKeyRequest,
  type UpdateApiKeyRequest,
  type UpdateUserRequest,
  type UpdateProfileRequest,
  type CreateRoleRequest,
  type UpdateRoleRequest,
  // MFA types
  type MfaSetupResponseFull,
  type MfaEnableRequest,
  type MfaDisableRequest,
  type MfaVerifyRequestFull,
  type MfaStatusResponse,
  type MfaVerificationResponse,
  type MfaOperationResponse,
  // OAuth types
  type OAuthSocialLoginRequest,
  type TenantLoginRequest,
  type TokenIntrospectionResponse,
  type TokenRevokeRequest,
  type TokenRevokeAllRequest,
  type TokenRevokeResponse,
  type TenantContextCreateRequest,
  type TenantContextResponse,
  type TenantContextAuditEntry,
  // User extended types
  type UserProfileFull,
  type ProfileRequest,
  type UpdateEmailRequest,
  type UserDeviceFull,
  type AddDeviceRequest,
  type UserSearchRequest,
  type AddUserSubscriptionRequest,
  type AccountRecoveryRequest,
  type AccountRecoveryResponse,
  type CompleteRecoveryRequest,
  type Company,
  type UserSubscription,
  // Avatar types
  type UserAvatarFull,
  type CreateAvatarRequest,
  type AvatarPresignResponse,
  type MultipartPresignRequest,
  type MultipartPresignResponse,
  type MultipartCompleteRequest,
  type MultipartCompleteResponse,
  // Tenant types
  type TenantUserFull,
  type CreateTenantUserRequest,
  type ValidateTenantCodeRequest,
  type ValidateTenantCodeResponse,
  type SearchTenantRequest,
  type UpdateTenantUserOnboardingRequest,
  type UpdateTenantUserSalesRequest,
  type ResendInvitationRequest,
} from '@23blocks/block-authentication';
import { TRANSPORT, AUTHENTICATION_TRANSPORT, AUTHENTICATION_CONFIG } from '../tokens.js';
import { TOKEN_MANAGER, SIMPLE_CONFIG, type TokenManagerService, type Simple23BlocksConfig } from '../simple-providers.js';

/**
 * Angular service wrapping the Authentication block.
 * Converts Promise-based APIs to RxJS Observables.
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class LoginComponent {
 *   constructor(private auth: AuthenticationService) {}
 *
 *   login(email: string, password: string) {
 *     this.auth.signIn({ email, password }).subscribe({
 *       next: (response) => console.log('Signed in:', response.user),
 *       error: (err) => console.error('Failed:', err),
 *     });
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private readonly block: AuthenticationBlock | null;
  private readonly tokenManager: TokenManagerService | null;
  private readonly simpleConfig: Simple23BlocksConfig | null;

  constructor(
    @Optional() @Inject(AUTHENTICATION_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(AUTHENTICATION_CONFIG) config: AuthenticationBlockConfig,
    @Optional() @Inject(TOKEN_MANAGER) tokenManager: TokenManagerService | null,
    @Optional() @Inject(SIMPLE_CONFIG) simpleConfig: Simple23BlocksConfig | null
  ) {
    // Prefer per-service transport, fall back to legacy TRANSPORT for backward compatibility
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createAuthenticationBlock(transport, config) : null;
    this.tokenManager = tokenManager;
    this.simpleConfig = simpleConfig;
  }

  /**
   * Ensure the service is configured, throw helpful error if not
   */
  private ensureConfigured(): AuthenticationBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] AuthenticationService is not configured. ' +
        "Add 'urls.authentication' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  /**
   * Check if using simplified API with automatic token management
   */
  private get isTokenMode(): boolean {
    return this.tokenManager !== null && this.simpleConfig?.authMode !== 'cookie';
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Auth Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Sign in with email and password.
   * When using simplified API (provideBlocks23), tokens are stored automatically.
   */
  signIn(request: SignInRequest): Observable<SignInResponse> {
    const block = this.ensureConfigured();
    return from(block.auth.signIn(request)).pipe(
      tap((response) => {
        if (this.isTokenMode && this.tokenManager && response.accessToken) {
          this.tokenManager.setTokens(response.accessToken, response.refreshToken);
        }
      })
    );
  }

  /**
   * Sign up a new user.
   * When using simplified API, tokens are stored automatically if returned.
   */
  signUp(request: SignUpRequest): Observable<SignUpResponse> {
    const block = this.ensureConfigured();
    return from(block.auth.signUp(request)).pipe(
      tap((response) => {
        if (this.isTokenMode && this.tokenManager && response.accessToken) {
          this.tokenManager.setTokens(response.accessToken);
        }
      })
    );
  }

  /**
   * Sign out the current user.
   * When using simplified API, tokens are cleared automatically.
   */
  signOut(): Observable<void> {
    const block = this.ensureConfigured();
    return from(block.auth.signOut()).pipe(
      tap(() => {
        if (this.isTokenMode && this.tokenManager) {
          this.tokenManager.clearTokens();
        }
      })
    );
  }

  requestPasswordReset(request: PasswordResetRequest): Observable<void> {
    return from(this.ensureConfigured().auth.requestPasswordReset(request));
  }

  updatePassword(request: PasswordUpdateRequest): Observable<void> {
    return from(this.ensureConfigured().auth.updatePassword(request));
  }

  validateToken(token: string): Observable<TokenValidationResponse> {
    return from(this.ensureConfigured().auth.validateToken(token));
  }

  getCurrentUser(): Observable<User | null> {
    return from(this.ensureConfigured().auth.getCurrentUser());
  }

  /**
   * Refresh the access token
   */
  refreshToken(request: RefreshTokenRequest): Observable<RefreshTokenResponse> {
    const block = this.ensureConfigured();
    return from(block.auth.refreshToken(request)).pipe(
      tap((response) => {
        if (this.isTokenMode && this.tokenManager && response.accessToken) {
          this.tokenManager.setTokens(response.accessToken, response.refreshToken);
        }
      })
    );
  }

  /**
   * Request a magic link for passwordless login
   */
  requestMagicLink(request: MagicLinkRequest): Observable<void> {
    return from(this.ensureConfigured().auth.requestMagicLink(request));
  }

  /**
   * Verify a magic link token
   */
  verifyMagicLink(request: MagicLinkVerifyRequest): Observable<SignInResponse> {
    const block = this.ensureConfigured();
    return from(block.auth.verifyMagicLink(request)).pipe(
      tap((response) => {
        if (this.isTokenMode && this.tokenManager && response.accessToken) {
          this.tokenManager.setTokens(response.accessToken, response.refreshToken);
        }
      })
    );
  }

  /**
   * Send an invitation to a new user
   */
  sendInvitation(request: InvitationRequest): Observable<void> {
    return from(this.ensureConfigured().auth.sendInvitation(request));
  }

  /**
   * Accept an invitation
   */
  acceptInvitation(request: AcceptInvitationRequest): Observable<SignInResponse> {
    const block = this.ensureConfigured();
    return from(block.auth.acceptInvitation(request)).pipe(
      tap((response) => {
        if (this.isTokenMode && this.tokenManager && response.accessToken) {
          this.tokenManager.setTokens(response.accessToken, response.refreshToken);
        }
      })
    );
  }

  /**
   * Confirm email with token
   */
  confirmEmail(token: string): Observable<User> {
    return from(this.ensureConfigured().auth.confirmEmail(token));
  }

  /**
   * Resend confirmation email
   */
  resendConfirmation(request: ResendConfirmationRequest): Observable<void> {
    return from(this.ensureConfigured().auth.resendConfirmation(request));
  }

  /**
   * Validate email before registration
   */
  validateEmail(request: ValidateEmailRequest): Observable<ValidateEmailResponse> {
    return from(this.ensureConfigured().auth.validateEmail(request));
  }

  /**
   * Validate document before registration
   */
  validateDocument(request: ValidateDocumentRequest): Observable<ValidateDocumentResponse> {
    return from(this.ensureConfigured().auth.validateDocument(request));
  }

  /**
   * Resend invitation email
   */
  resendInvitation(request: ResendInvitationRequest): Observable<User> {
    return from(this.ensureConfigured().auth.resendInvitation(request));
  }

  /**
   * Request account recovery (for deleted accounts)
   */
  requestAccountRecovery(request: AccountRecoveryRequest): Observable<AccountRecoveryResponse> {
    return from(this.ensureConfigured().auth.requestAccountRecovery(request));
  }

  /**
   * Complete account recovery with new password
   */
  completeAccountRecovery(request: CompleteRecoveryRequest): Observable<User> {
    return from(this.ensureConfigured().auth.completeAccountRecovery(request));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Users Service
  // ─────────────────────────────────────────────────────────────────────────────

  listUsers(params?: { page?: number; perPage?: number }): Observable<User[]> {
    return from(this.ensureConfigured().users.list(params));
  }

  getUser(id: string): Observable<User> {
    return from(this.ensureConfigured().users.get(id));
  }

  updateUser(id: string, request: UpdateUserRequest): Observable<User> {
    return from(this.ensureConfigured().users.update(id, request));
  }

  deleteUser(id: string): Observable<void> {
    return from(this.ensureConfigured().users.delete(id));
  }

  /**
   * Get a user by unique ID
   */
  getUserByUniqueId(uniqueId: string): Observable<User> {
    return from(this.ensureConfigured().users.getByUniqueId(uniqueId));
  }

  /**
   * Update user profile
   */
  updateUserProfile(userId: string, request: UpdateProfileRequest): Observable<User> {
    return from(this.ensureConfigured().users.updateProfile(userId, request));
  }

  /**
   * Activate a user
   */
  activateUser(id: string): Observable<User> {
    return from(this.ensureConfigured().users.activate(id));
  }

  /**
   * Deactivate a user
   */
  deactivateUser(id: string): Observable<User> {
    return from(this.ensureConfigured().users.deactivate(id));
  }

  /**
   * Change user role
   */
  changeUserRole(id: string, roleUniqueId: string, reason: string, forceReauth?: boolean): Observable<User> {
    return from(this.ensureConfigured().users.changeRole(id, roleUniqueId, reason, forceReauth));
  }

  /**
   * Search users by query
   */
  searchUsers(query: string, params?: ListParams): Observable<PageResult<User>> {
    return from(this.ensureConfigured().users.search(query, params));
  }

  /**
   * Advanced search users by criteria or payload
   */
  searchUsersAdvanced(request: UserSearchRequest, params?: ListParams): Observable<PageResult<User>> {
    return from(this.ensureConfigured().users.searchAdvanced(request, params));
  }

  /**
   * Get user profile
   */
  getUserProfile(userUniqueId: string): Observable<UserProfileFull> {
    return from(this.ensureConfigured().users.getProfile(userUniqueId));
  }

  /**
   * Create or update user profile
   */
  createUserProfile(request: ProfileRequest): Observable<UserProfileFull> {
    return from(this.ensureConfigured().users.createProfile(request));
  }

  /**
   * Update email address
   */
  updateUserEmail(userUniqueId: string, request: UpdateEmailRequest): Observable<User> {
    return from(this.ensureConfigured().users.updateEmail(userUniqueId, request));
  }

  /**
   * Get user devices
   */
  getUserDevices(userUniqueId: string, params?: ListParams): Observable<PageResult<UserDeviceFull>> {
    return from(this.ensureConfigured().users.getDevices(userUniqueId, params));
  }

  /**
   * Add a device
   */
  addUserDevice(request: AddDeviceRequest): Observable<UserDeviceFull> {
    return from(this.ensureConfigured().users.addDevice(request));
  }

  /**
   * Get user's companies
   */
  getUserCompanies(userUniqueId: string): Observable<Company[]> {
    return from(this.ensureConfigured().users.getCompanies(userUniqueId));
  }

  /**
   * Add subscription to user
   */
  addUserSubscription(userUniqueId: string, request: AddUserSubscriptionRequest): Observable<UserSubscription> {
    return from(this.ensureConfigured().users.addSubscription(userUniqueId, request));
  }

  /**
   * Update user subscription
   */
  updateUserSubscription(userUniqueId: string, request: AddUserSubscriptionRequest): Observable<UserSubscription> {
    return from(this.ensureConfigured().users.updateSubscription(userUniqueId, request));
  }

  /**
   * Resend confirmation email by user unique ID
   */
  resendConfirmationByUniqueId(userUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().users.resendConfirmationByUniqueId(userUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Roles Service
  // ─────────────────────────────────────────────────────────────────────────────

  listRoles(): Observable<Role[]> {
    return from(this.ensureConfigured().roles.list());
  }

  getRole(id: string): Observable<Role> {
    return from(this.ensureConfigured().roles.get(id));
  }

  createRole(request: CreateRoleRequest): Observable<Role> {
    return from(this.ensureConfigured().roles.create(request));
  }

  updateRole(id: string, request: UpdateRoleRequest): Observable<Role> {
    return from(this.ensureConfigured().roles.update(id, request));
  }

  deleteRole(id: string): Observable<void> {
    return from(this.ensureConfigured().roles.delete(id));
  }

  listPermissions(): Observable<Permission[]> {
    return from(this.ensureConfigured().roles.listPermissions());
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // API Keys Service
  // ─────────────────────────────────────────────────────────────────────────────

  listApiKeys(): Observable<ApiKey[]> {
    return from(this.ensureConfigured().apiKeys.list());
  }

  getApiKey(id: string): Observable<ApiKey> {
    return from(this.ensureConfigured().apiKeys.get(id));
  }

  createApiKey(request: CreateApiKeyRequest): Observable<ApiKeyWithSecret> {
    return from(this.ensureConfigured().apiKeys.create(request));
  }

  updateApiKey(id: string, request: UpdateApiKeyRequest): Observable<ApiKey> {
    return from(this.ensureConfigured().apiKeys.update(id, request));
  }

  revokeApiKey(id: string): Observable<void> {
    return from(this.ensureConfigured().apiKeys.revoke(id));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MFA Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Initialize MFA setup - generates secret, QR code, and backup codes
   */
  mfaSetup(): Observable<MfaSetupResponseFull> {
    return from(this.ensureConfigured().mfa.setup());
  }

  /**
   * Enable MFA after verifying setup with TOTP code
   */
  mfaEnable(request: MfaEnableRequest): Observable<MfaOperationResponse> {
    return from(this.ensureConfigured().mfa.enable(request));
  }

  /**
   * Disable MFA with password confirmation
   */
  mfaDisable(request: MfaDisableRequest): Observable<MfaOperationResponse> {
    return from(this.ensureConfigured().mfa.disable(request));
  }

  /**
   * Verify MFA code during login
   */
  mfaVerify(request: MfaVerifyRequestFull): Observable<MfaVerificationResponse> {
    return from(this.ensureConfigured().mfa.verify(request));
  }

  /**
   * Get current MFA status
   */
  mfaStatus(): Observable<MfaStatusResponse> {
    return from(this.ensureConfigured().mfa.status());
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // OAuth Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Login with Facebook OAuth token
   */
  loginWithFacebook(request: OAuthSocialLoginRequest): Observable<SignInResponse> {
    const block = this.ensureConfigured();
    return from(block.oauth.loginWithFacebook(request)).pipe(
      tap((response) => {
        if (this.isTokenMode && this.tokenManager && response.accessToken) {
          this.tokenManager.setTokens(response.accessToken, response.refreshToken);
        }
      })
    );
  }

  /**
   * Login with Google OAuth token
   */
  loginWithGoogle(request: OAuthSocialLoginRequest): Observable<SignInResponse> {
    const block = this.ensureConfigured();
    return from(block.oauth.loginWithGoogle(request)).pipe(
      tap((response) => {
        if (this.isTokenMode && this.tokenManager && response.accessToken) {
          this.tokenManager.setTokens(response.accessToken, response.refreshToken);
        }
      })
    );
  }

  /**
   * Login to a specific tenant
   */
  loginWithTenant(request: TenantLoginRequest): Observable<SignInResponse> {
    const block = this.ensureConfigured();
    return from(block.oauth.loginWithTenant(request)).pipe(
      tap((response) => {
        if (this.isTokenMode && this.tokenManager && response.accessToken) {
          this.tokenManager.setTokens(response.accessToken, response.refreshToken);
        }
      })
    );
  }

  /**
   * Introspect a token to validate and get information
   */
  introspectToken(token: string): Observable<TokenIntrospectionResponse> {
    return from(this.ensureConfigured().oauth.introspectToken(token));
  }

  /**
   * Revoke a specific token
   */
  revokeToken(request: TokenRevokeRequest): Observable<TokenRevokeResponse> {
    return from(this.ensureConfigured().oauth.revokeToken(request));
  }

  /**
   * Revoke all tokens for the current user
   */
  revokeAllTokens(request?: TokenRevokeAllRequest): Observable<TokenRevokeResponse> {
    return from(this.ensureConfigured().oauth.revokeAllTokens(request));
  }

  /**
   * Create a tenant context (switch to a different tenant)
   */
  createTenantContext(request: TenantContextCreateRequest): Observable<TenantContextResponse> {
    return from(this.ensureConfigured().oauth.createTenantContext(request));
  }

  /**
   * Revoke tenant context (exit tenant switch)
   */
  revokeTenantContext(): Observable<void> {
    return from(this.ensureConfigured().oauth.revokeTenantContext());
  }

  /**
   * Get tenant context audit log
   */
  auditTenantContext(): Observable<TenantContextAuditEntry[]> {
    return from(this.ensureConfigured().oauth.auditTenantContext());
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Avatars Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List avatars for a user
   */
  listAvatars(userUniqueId: string, params?: ListParams): Observable<PageResult<UserAvatarFull>> {
    return from(this.ensureConfigured().avatars.list(userUniqueId, params));
  }

  /**
   * Get a specific avatar
   */
  getAvatar(userUniqueId: string): Observable<UserAvatarFull> {
    return from(this.ensureConfigured().avatars.get(userUniqueId));
  }

  /**
   * Create/update an avatar
   */
  createAvatar(userUniqueId: string, request: CreateAvatarRequest): Observable<UserAvatarFull> {
    return from(this.ensureConfigured().avatars.create(userUniqueId, request));
  }

  /**
   * Update an avatar
   */
  updateAvatar(userUniqueId: string, request: Partial<CreateAvatarRequest>): Observable<UserAvatarFull> {
    return from(this.ensureConfigured().avatars.update(userUniqueId, request));
  }

  /**
   * Delete an avatar
   */
  deleteAvatar(userUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().avatars.delete(userUniqueId));
  }

  /**
   * Get presigned URL for direct upload
   */
  presignAvatarUpload(userUniqueId: string, filename: string): Observable<AvatarPresignResponse> {
    return from(this.ensureConfigured().avatars.presignUpload(userUniqueId, filename));
  }

  /**
   * Get presigned URLs for multipart upload
   */
  multipartAvatarPresign(userUniqueId: string, request: MultipartPresignRequest): Observable<MultipartPresignResponse> {
    return from(this.ensureConfigured().avatars.multipartPresign(userUniqueId, request));
  }

  /**
   * Complete a multipart upload
   */
  multipartAvatarComplete(userUniqueId: string, request: MultipartCompleteRequest): Observable<MultipartCompleteResponse> {
    return from(this.ensureConfigured().avatars.multipartComplete(userUniqueId, request));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Tenants Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List child tenants
   */
  listChildTenants(params?: ListParams): Observable<PageResult<Company>> {
    return from(this.ensureConfigured().tenants.listChildren(params));
  }

  /**
   * Validate tenant code availability
   */
  validateTenantCode(request: ValidateTenantCodeRequest): Observable<ValidateTenantCodeResponse> {
    return from(this.ensureConfigured().tenants.validateCode(request));
  }

  /**
   * Search for a tenant by name
   */
  searchTenantByName(request: SearchTenantRequest): Observable<Company> {
    return from(this.ensureConfigured().tenants.searchByName(request));
  }

  /**
   * Search for a tenant by code
   */
  searchTenantByCode(request: SearchTenantRequest): Observable<Company> {
    return from(this.ensureConfigured().tenants.searchByCode(request));
  }

  /**
   * Create a tenant user relationship
   */
  createTenantUser(userUniqueId: string, request: CreateTenantUserRequest): Observable<TenantUserFull> {
    return from(this.ensureConfigured().tenants.createTenantUser(userUniqueId, request));
  }

  /**
   * Update tenant user onboarding status
   */
  updateTenantUserOnboarding(
    userUniqueId: string,
    urlId: string,
    request: UpdateTenantUserOnboardingRequest
  ): Observable<TenantUserFull> {
    return from(this.ensureConfigured().tenants.updateOnboarding(userUniqueId, urlId, request));
  }

  /**
   * Update tenant user sales/purchase status
   */
  updateTenantUserSales(
    userUniqueId: string,
    urlId: string,
    request: UpdateTenantUserSalesRequest
  ): Observable<TenantUserFull> {
    return from(this.ensureConfigured().tenants.updateSales(userUniqueId, urlId, request));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Token Management (only applicable with provideBlocks23)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get the current access token (token mode only).
   * Returns null if using cookie mode or no token is stored.
   */
  getAccessToken(): string | null {
    return this.tokenManager?.getAccessToken() ?? null;
  }

  /**
   * Get the current refresh token (token mode only).
   * Returns null if using cookie mode or no token is stored.
   */
  getRefreshToken(): string | null {
    return this.tokenManager?.getRefreshToken() ?? null;
  }

  /**
   * Manually set tokens (token mode only).
   * Useful for SSR hydration or external auth flows.
   */
  setTokens(accessToken: string, refreshToken?: string): void {
    this.tokenManager?.setTokens(accessToken, refreshToken);
  }

  /**
   * Clear stored tokens.
   */
  clearTokens(): void {
    this.tokenManager?.clearTokens();
  }

  /**
   * Check if user is likely authenticated.
   * In token mode: checks if token exists.
   * In cookie mode: always returns null (use validateToken instead).
   */
  isAuthenticated(): boolean | null {
    if (!this.tokenManager || this.simpleConfig?.authMode === 'cookie') {
      return null;
    }
    return !!this.tokenManager.getAccessToken();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): AuthenticationBlock {
    return this.ensureConfigured();
  }
}
