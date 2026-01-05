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
  // JWKS types
  type JwksResponse,
  type RsaKey,
  type CreateRsaKeyRequest,
  type RotateRsaKeyRequest,
  // OIDC types
  type OidcDiscovery,
  type OidcAuthorizeRequest,
  type OidcTokenRequest,
  type OidcTokenResponse,
  type OidcUserInfo,
  // Permissions types
  type CreatePermissionRequest,
  type UpdatePermissionRequest,
  // App types
  type App,
  type Block,
  type Service,
  type CreateAppRequest,
  type UpdateAppRequest,
  // Subscription types
  type SubscriptionModel,
  type CompanySubscription,
  type SubscribeRequest,
  // Geography types
  type Country,
  type State,
  type County,
  type City,
  type Currency,
  // Guest and related types
  type Guest,
  type MagicLink,
  type RefreshToken,
  type UserDevice,
  type TenantUser,
  type MailTemplate,
  type CreateMagicLinkRequest,
  type RegisterDeviceRequest,
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
  // Permissions Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List all permissions with pagination
   */
  listPermissionsPaginated(params?: ListParams): Observable<PageResult<Permission>> {
    return from(this.ensureConfigured().permissions.list(params));
  }

  /**
   * Get a permission by ID
   */
  getPermission(id: string): Observable<Permission> {
    return from(this.ensureConfigured().permissions.get(id));
  }

  /**
   * Create a new permission
   */
  createPermission(request: CreatePermissionRequest): Observable<Permission> {
    return from(this.ensureConfigured().permissions.create(request));
  }

  /**
   * Update a permission
   */
  updatePermission(id: string, request: UpdatePermissionRequest): Observable<Permission> {
    return from(this.ensureConfigured().permissions.update(id, request));
  }

  /**
   * Delete a permission
   */
  deletePermission(id: string): Observable<void> {
    return from(this.ensureConfigured().permissions.delete(id));
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
  // Apps Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List apps with pagination
   */
  listApps(params?: ListParams): Observable<PageResult<App>> {
    return from(this.ensureConfigured().apps.list(params));
  }

  /**
   * Get an app by ID
   */
  getApp(id: string): Observable<App> {
    return from(this.ensureConfigured().apps.get(id));
  }

  /**
   * Create a new app
   */
  createApp(request: CreateAppRequest): Observable<App> {
    return from(this.ensureConfigured().apps.create(request));
  }

  /**
   * Update an app
   */
  updateApp(id: string, request: UpdateAppRequest): Observable<App> {
    return from(this.ensureConfigured().apps.update(id, request));
  }

  /**
   * Delete an app
   */
  deleteApp(id: string): Observable<void> {
    return from(this.ensureConfigured().apps.delete(id));
  }

  /**
   * Regenerate webhook secret for an app
   */
  regenerateAppWebhookSecret(id: string): Observable<App> {
    return from(this.ensureConfigured().apps.regenerateWebhookSecret(id));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Blocks Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List blocks for a company
   */
  listBlocks(companyId: string, params?: ListParams): Observable<PageResult<Block>> {
    return from(this.ensureConfigured().blocks.list(companyId, params));
  }

  /**
   * Get a block by ID
   */
  getBlock(id: string): Observable<Block> {
    return from(this.ensureConfigured().blocks.get(id));
  }

  /**
   * Add a block to a company
   */
  addBlock(companyId: string, blockCode: string): Observable<Block> {
    return from(this.ensureConfigured().blocks.add(companyId, blockCode));
  }

  /**
   * Remove a block from a company
   */
  removeBlock(id: string): Observable<void> {
    return from(this.ensureConfigured().blocks.remove(id));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Services Registry Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List registered services
   */
  listServices(params?: ListParams): Observable<PageResult<Service>> {
    return from(this.ensureConfigured().services.list(params));
  }

  /**
   * Get a service by ID
   */
  getService(id: string): Observable<Service> {
    return from(this.ensureConfigured().services.get(id));
  }

  /**
   * Get a service by code
   */
  getServiceByCode(code: string): Observable<Service> {
    return from(this.ensureConfigured().services.getByCode(code));
  }

  /**
   * Health check all services
   */
  healthCheckServices(): Observable<Service[]> {
    return from(this.ensureConfigured().services.healthCheck());
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Subscription Models Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List subscription models
   */
  listSubscriptionModels(params?: ListParams): Observable<PageResult<SubscriptionModel>> {
    return from(this.ensureConfigured().subscriptionModels.list(params));
  }

  /**
   * Get a subscription model by ID
   */
  getSubscriptionModel(id: string): Observable<SubscriptionModel> {
    return from(this.ensureConfigured().subscriptionModels.get(id));
  }

  /**
   * Get a subscription model by code
   */
  getSubscriptionModelByCode(code: string): Observable<SubscriptionModel> {
    return from(this.ensureConfigured().subscriptionModels.getByCode(code));
  }

  /**
   * List promotional subscription models
   */
  listPromotionalSubscriptionModels(): Observable<SubscriptionModel[]> {
    return from(this.ensureConfigured().subscriptionModels.promotional());
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // User Subscriptions Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List user subscriptions
   */
  listUserSubscriptions(params?: ListParams): Observable<PageResult<UserSubscription>> {
    return from(this.ensureConfigured().userSubscriptions.list(params));
  }

  /**
   * Get a user subscription by ID
   */
  getUserSubscription(id: string): Observable<UserSubscription> {
    return from(this.ensureConfigured().userSubscriptions.get(id));
  }

  /**
   * Get subscriptions for a user
   */
  getSubscriptionsForUser(userUniqueId: string): Observable<UserSubscription[]> {
    return from(this.ensureConfigured().userSubscriptions.forUser(userUniqueId));
  }

  /**
   * Subscribe a user to a plan
   */
  subscribeUser(userUniqueId: string, request: SubscribeRequest): Observable<UserSubscription> {
    return from(this.ensureConfigured().userSubscriptions.subscribe(userUniqueId, request));
  }

  /**
   * Cancel a user subscription
   */
  cancelUserSubscription(id: string): Observable<UserSubscription> {
    return from(this.ensureConfigured().userSubscriptions.cancel(id));
  }

  /**
   * Reactivate a user subscription
   */
  reactivateUserSubscription(id: string): Observable<UserSubscription> {
    return from(this.ensureConfigured().userSubscriptions.reactivate(id));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Company Subscriptions Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List company subscriptions
   */
  listCompanySubscriptions(params?: ListParams): Observable<PageResult<CompanySubscription>> {
    return from(this.ensureConfigured().companySubscriptions.list(params));
  }

  /**
   * Get a company subscription by ID
   */
  getCompanySubscription(id: string): Observable<CompanySubscription> {
    return from(this.ensureConfigured().companySubscriptions.get(id));
  }

  /**
   * Get subscriptions for a company
   */
  getSubscriptionsForCompany(companyUniqueId: string): Observable<CompanySubscription[]> {
    return from(this.ensureConfigured().companySubscriptions.forCompany(companyUniqueId));
  }

  /**
   * Subscribe a company to a plan
   */
  subscribeCompany(companyUniqueId: string, request: SubscribeRequest): Observable<CompanySubscription> {
    return from(this.ensureConfigured().companySubscriptions.subscribe(companyUniqueId, request));
  }

  /**
   * Cancel a company subscription
   */
  cancelCompanySubscription(id: string): Observable<CompanySubscription> {
    return from(this.ensureConfigured().companySubscriptions.cancel(id));
  }

  /**
   * Reactivate a company subscription
   */
  reactivateCompanySubscription(id: string): Observable<CompanySubscription> {
    return from(this.ensureConfigured().companySubscriptions.reactivate(id));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Countries Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List countries with pagination
   */
  listCountries(params?: ListParams): Observable<PageResult<Country>> {
    return from(this.ensureConfigured().countries.list(params));
  }

  /**
   * Get a country by ID
   */
  getCountry(id: string): Observable<Country> {
    return from(this.ensureConfigured().countries.get(id));
  }

  /**
   * Get a country by ISO code
   */
  getCountryByIsoCode(isoCode: string): Observable<Country> {
    return from(this.ensureConfigured().countries.getByIsoCode(isoCode));
  }

  /**
   * Get all countries (no pagination)
   */
  getAllCountries(): Observable<Country[]> {
    return from(this.ensureConfigured().countries.all());
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // States Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List states with pagination
   */
  listStates(params?: ListParams): Observable<PageResult<State>> {
    return from(this.ensureConfigured().states.list(params));
  }

  /**
   * Get a state by ID
   */
  getState(id: string): Observable<State> {
    return from(this.ensureConfigured().states.get(id));
  }

  /**
   * Get states for a country
   */
  getStatesForCountry(countryId: string): Observable<State[]> {
    return from(this.ensureConfigured().states.forCountry(countryId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Counties Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List counties with pagination
   */
  listCounties(params?: ListParams): Observable<PageResult<County>> {
    return from(this.ensureConfigured().counties.list(params));
  }

  /**
   * Get a county by ID
   */
  getCounty(id: string): Observable<County> {
    return from(this.ensureConfigured().counties.get(id));
  }

  /**
   * Get counties for a state
   */
  getCountiesForState(stateId: string): Observable<County[]> {
    return from(this.ensureConfigured().counties.forState(stateId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Cities Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List cities with pagination
   */
  listCities(params?: ListParams): Observable<PageResult<City>> {
    return from(this.ensureConfigured().cities.list(params));
  }

  /**
   * Get a city by ID
   */
  getCity(id: string): Observable<City> {
    return from(this.ensureConfigured().cities.get(id));
  }

  /**
   * Get cities for a state
   */
  getCitiesForState(stateId: string): Observable<City[]> {
    return from(this.ensureConfigured().cities.forState(stateId));
  }

  /**
   * Get cities for a county
   */
  getCitiesForCounty(countyId: string): Observable<City[]> {
    return from(this.ensureConfigured().cities.forCounty(countyId));
  }

  /**
   * Search cities by name
   */
  searchCities(query: string, params?: ListParams): Observable<PageResult<City>> {
    return from(this.ensureConfigured().cities.search(query, params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Currencies Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List currencies with pagination
   */
  listCurrencies(params?: ListParams): Observable<PageResult<Currency>> {
    return from(this.ensureConfigured().currencies.list(params));
  }

  /**
   * Get a currency by ID
   */
  getCurrency(id: string): Observable<Currency> {
    return from(this.ensureConfigured().currencies.get(id));
  }

  /**
   * Get a currency by code
   */
  getCurrencyByCode(code: string): Observable<Currency> {
    return from(this.ensureConfigured().currencies.getByCode(code));
  }

  /**
   * Get all currencies (no pagination)
   */
  getAllCurrencies(): Observable<Currency[]> {
    return from(this.ensureConfigured().currencies.all());
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Guests Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List guests with pagination
   */
  listGuests(params?: ListParams): Observable<PageResult<Guest>> {
    return from(this.ensureConfigured().guests.list(params));
  }

  /**
   * Get a guest by ID
   */
  getGuest(id: string): Observable<Guest> {
    return from(this.ensureConfigured().guests.get(id));
  }

  /**
   * Track a guest visit
   */
  trackGuest(): Observable<Guest> {
    return from(this.ensureConfigured().guests.track());
  }

  /**
   * Convert guest to user (registration)
   */
  convertGuest(id: string): Observable<Guest> {
    return from(this.ensureConfigured().guests.convert(id));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Magic Links Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List magic links with pagination
   */
  listMagicLinks(params?: ListParams): Observable<PageResult<MagicLink>> {
    return from(this.ensureConfigured().magicLinks.list(params));
  }

  /**
   * Get a magic link by ID
   */
  getMagicLink(id: string): Observable<MagicLink> {
    return from(this.ensureConfigured().magicLinks.get(id));
  }

  /**
   * Create a magic link
   */
  createMagicLink(request: CreateMagicLinkRequest): Observable<MagicLink> {
    return from(this.ensureConfigured().magicLinks.create(request));
  }

  /**
   * Validate a magic link token
   */
  validateMagicLink(token: string): Observable<MagicLink> {
    return from(this.ensureConfigured().magicLinks.validate(token));
  }

  /**
   * Expire a magic link
   */
  expireMagicLink(id: string): Observable<MagicLink> {
    return from(this.ensureConfigured().magicLinks.expire(id));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Refresh Tokens Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List refresh tokens for the current user
   */
  listRefreshTokens(params?: ListParams): Observable<PageResult<RefreshToken>> {
    return from(this.ensureConfigured().refreshTokens.list(params));
  }

  /**
   * Get a refresh token by ID
   */
  getRefreshToken(id: string): Observable<RefreshToken> {
    return from(this.ensureConfigured().refreshTokens.get(id));
  }

  /**
   * Revoke a refresh token
   */
  revokeRefreshToken(id: string): Observable<RefreshToken> {
    return from(this.ensureConfigured().refreshTokens.revoke(id));
  }

  /**
   * Revoke all refresh tokens for current user
   */
  revokeAllRefreshTokens(): Observable<void> {
    return from(this.ensureConfigured().refreshTokens.revokeAll());
  }

  /**
   * Revoke all refresh tokens except current
   */
  revokeOtherRefreshTokens(): Observable<void> {
    return from(this.ensureConfigured().refreshTokens.revokeOthers());
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // User Devices Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List devices for current user
   */
  listDevices(params?: ListParams): Observable<PageResult<UserDevice>> {
    return from(this.ensureConfigured().userDevices.list(params));
  }

  /**
   * Get a device by ID
   */
  getDevice(id: string): Observable<UserDevice> {
    return from(this.ensureConfigured().userDevices.get(id));
  }

  /**
   * Register a new device
   */
  registerDevice(request: RegisterDeviceRequest): Observable<UserDevice> {
    return from(this.ensureConfigured().userDevices.register(request));
  }

  /**
   * Update device settings
   */
  updateDevice(id: string, request: Partial<RegisterDeviceRequest>): Observable<UserDevice> {
    return from(this.ensureConfigured().userDevices.update(id, request));
  }

  /**
   * Unregister a device
   */
  unregisterDevice(id: string): Observable<void> {
    return from(this.ensureConfigured().userDevices.unregister(id));
  }

  /**
   * Set default device
   */
  setDefaultDevice(id: string): Observable<UserDevice> {
    return from(this.ensureConfigured().userDevices.setDefault(id));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Tenant Users Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get current tenant user context
   */
  getCurrentTenantUser(): Observable<TenantUser> {
    return from(this.ensureConfigured().tenantUsers.current());
  }

  /**
   * Get tenant user by user ID
   */
  getTenantUser(userUniqueId: string): Observable<TenantUser> {
    return from(this.ensureConfigured().tenantUsers.get(userUniqueId));
  }

  /**
   * List tenant users
   */
  listTenantUsers(params?: ListParams): Observable<TenantUser[]> {
    return from(this.ensureConfigured().tenantUsers.list(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Mail Templates Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List mail templates with pagination
   */
  listMailTemplates(params?: ListParams): Observable<PageResult<MailTemplate>> {
    return from(this.ensureConfigured().mailTemplates.list(params));
  }

  /**
   * Get a mail template by ID
   */
  getMailTemplate(id: string): Observable<MailTemplate> {
    return from(this.ensureConfigured().mailTemplates.get(id));
  }

  /**
   * Get a mail template by event name
   */
  getMailTemplateByEvent(eventName: string): Observable<MailTemplate> {
    return from(this.ensureConfigured().mailTemplates.getByEvent(eventName));
  }

  /**
   * Update a mail template
   */
  updateMailTemplate(id: string, template: Partial<MailTemplate>): Observable<MailTemplate> {
    return from(this.ensureConfigured().mailTemplates.update(id, template));
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
  // JWKS Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get the JSON Web Key Set (JWKS) for verifying tokens
   */
  getJwks(): Observable<JwksResponse> {
    return from(this.ensureConfigured().jwks.getJwks());
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Admin RSA Keys Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * List all RSA keys
   */
  listRsaKeys(): Observable<RsaKey[]> {
    return from(this.ensureConfigured().adminRsaKeys.list());
  }

  /**
   * Create a new RSA key
   */
  createRsaKey(request: CreateRsaKeyRequest): Observable<RsaKey> {
    return from(this.ensureConfigured().adminRsaKeys.create(request));
  }

  /**
   * Rotate an RSA key (creates new, deactivates old)
   */
  rotateRsaKey(kid: string, request?: RotateRsaKeyRequest): Observable<RsaKey> {
    return from(this.ensureConfigured().adminRsaKeys.rotate(kid, request));
  }

  /**
   * Delete an RSA key
   */
  deleteRsaKey(kid: string): Observable<void> {
    return from(this.ensureConfigured().adminRsaKeys.delete(kid));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // OIDC Service
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get OpenID Connect discovery document
   */
  getOidcDiscovery(): Observable<OidcDiscovery> {
    return from(this.ensureConfigured().oidc.discovery());
  }

  /**
   * Get authorization endpoint URL with parameters
   */
  getOidcAuthorizeUrl(request: OidcAuthorizeRequest): string {
    return this.ensureConfigured().oidc.authorize(request);
  }

  /**
   * Exchange authorization code for tokens
   */
  exchangeOidcToken(request: OidcTokenRequest): Observable<OidcTokenResponse> {
    return from(this.ensureConfigured().oidc.token(request));
  }

  /**
   * Get user info from OIDC userinfo endpoint
   */
  getOidcUserInfo(accessToken: string): Observable<OidcUserInfo> {
    return from(this.ensureConfigured().oidc.userinfo(accessToken));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get authenticationBlock(): AuthenticationBlock {
    return this.ensureConfigured();
  }
}
