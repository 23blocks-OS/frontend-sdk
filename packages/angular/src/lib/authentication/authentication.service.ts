import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, from, tap } from 'rxjs';
import type { Transport } from '@23blocks/contracts';
import {
  createAuthenticationBlock,
  type AuthenticationBlock,
  type AuthenticationBlockConfig,
  type SignInRequest,
  type SignInResponse,
  type SignUpRequest,
  type SignUpResponse,
  type RefreshTokenRequest,
  type RefreshTokenResponse,
  type MagicLinkVerifyRequest,
  type AcceptInvitationRequest,
  type OAuthSocialLoginRequest,
  type TenantLoginRequest,
} from '@23blocks/block-authentication';
import { TRANSPORT, AUTHENTICATION_TRANSPORT, AUTHENTICATION_CONFIG } from '../tokens';
import { TOKEN_MANAGER, SIMPLE_CONFIG, type TokenManagerService, type Simple23BlocksConfig } from '../simple-providers';

/**
 * Angular service wrapping the Authentication block.
 *
 * Auth-flow methods (signIn, signUp, signOut, OAuth, etc.) return Observables
 * with automatic token management via `tap()`.
 *
 * All other sub-services are exposed as typed getters returning Promise-based APIs.
 * Use `from()` to convert to Observables if needed.
 *
 * @example
 * ```typescript
 * // Auth flows (Observable with token management):
 * this.auth.signIn({ email, password }).subscribe(...)
 *
 * // Other services (Promise-based, wrap in from() if needed):
 * const user = await this.auth.users.get(userId);
 * from(this.auth.roles.list()).subscribe(...)
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
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createAuthenticationBlock(transport, config) : null;
    this.tokenManager = tokenManager;
    this.simpleConfig = simpleConfig;
  }

  private ensureConfigured(): AuthenticationBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] AuthenticationService is not configured. ' +
        "Add 'urls.authentication' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  private get isTokenMode(): boolean {
    return this.tokenManager !== null && this.simpleConfig?.authMode !== 'cookie';
  }

  private storeTokens(response: SignInResponse | RefreshTokenResponse): void {
    if (this.isTokenMode && this.tokenManager && response.accessToken) {
      this.tokenManager.setTokens(
        response.accessToken,
        'refreshToken' in response ? response.refreshToken : undefined
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Auth-flow methods (Observable with token management)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Sign in with email and password.
   * Returns an Observable that emits the sign-in response and automatically
   * stores access/refresh tokens in token mode.
   *
   * @param request - Email and password credentials
   * @returns Observable emitting SignInResponse with `user`, `accessToken`,
   *   optional `refreshToken`, `tokenType`, and `expiresIn`
   * @example
   * ```typescript
   * this.authService.signIn({ email: 'user@example.com', password: 'secret' })
   *   .subscribe(({ user, accessToken }) => console.log('Signed in:', user.email));
   * ```
   */
  signIn(request: SignInRequest): Observable<SignInResponse> {
    return from(this.ensureConfigured().auth.signIn(request)).pipe(
      tap((response) => this.storeTokens(response))
    );
  }

  /**
   * Sign up a new user.
   * Returns an Observable that emits the sign-up response and automatically
   * stores tokens if email confirmation is not required.
   *
   * @param request - User registration data (email, password, etc.)
   * @returns Observable emitting SignUpResponse with `user`, optional `accessToken`
   *   (absent if email confirmation is required), and optional `message`
   * @note If email confirmation is enabled, `accessToken` will be undefined until confirmed.
   */
  signUp(request: SignUpRequest): Observable<SignUpResponse> {
    return from(this.ensureConfigured().auth.signUp(request)).pipe(
      tap((response) => {
        if (this.isTokenMode && this.tokenManager && response.accessToken) {
          this.tokenManager.setTokens(response.accessToken);
        }
      })
    );
  }

  /**
   * Sign out the current user.
   * Invalidates the session server-side and clears locally stored tokens in token mode.
   *
   * @returns Observable that completes on successful sign-out
   */
  signOut(): Observable<void> {
    return from(this.ensureConfigured().auth.signOut()).pipe(
      tap(() => {
        if (this.isTokenMode && this.tokenManager) {
          this.tokenManager.clearTokens();
        }
      })
    );
  }

  /**
   * Refresh the access token using a refresh token.
   * Automatically stores the new token pair in token mode.
   *
   * @param request - Contains the `refreshToken` to exchange
   * @returns Observable emitting RefreshTokenResponse with new `accessToken`,
   *   optional new `refreshToken`, `tokenType`, and `expiresIn`
   */
  refreshToken(request: RefreshTokenRequest): Observable<RefreshTokenResponse> {
    return from(this.ensureConfigured().auth.refreshToken(request)).pipe(
      tap((response) => this.storeTokens(response))
    );
  }

  /**
   * Verify a magic link token and sign in.
   * Automatically stores tokens on successful verification.
   *
   * @param request - Contains the magic link `token` from the email link
   * @returns Observable emitting SignInResponse with `user`, `accessToken`, optional `refreshToken`
   */
  verifyMagicLink(request: MagicLinkVerifyRequest): Observable<SignInResponse> {
    return from(this.ensureConfigured().auth.verifyMagicLink(request)).pipe(
      tap((response) => this.storeTokens(response))
    );
  }

  /**
   * Accept an invitation and create the user's account.
   * Automatically stores tokens on successful acceptance.
   *
   * @param request - Invitation token and user account details (password, etc.)
   * @returns Observable emitting SignInResponse with the new `user`, `accessToken`,
   *   optional `refreshToken`
   */
  acceptInvitation(request: AcceptInvitationRequest): Observable<SignInResponse> {
    return from(this.ensureConfigured().auth.acceptInvitation(request)).pipe(
      tap((response) => this.storeTokens(response))
    );
  }

  /**
   * Sign in via Facebook OAuth.
   * Automatically stores tokens on successful authentication.
   *
   * @param request - Facebook OAuth access token
   * @returns Observable emitting SignInResponse with `user` and tokens
   */
  facebookLogin(request: OAuthSocialLoginRequest): Observable<SignInResponse> {
    return from(this.ensureConfigured().oauth.facebookLogin(request)).pipe(
      tap((response) => this.storeTokens(response))
    );
  }

  /**
   * Sign in via Google OAuth.
   * Automatically stores tokens on successful authentication.
   *
   * @param request - Google OAuth access token
   * @returns Observable emitting SignInResponse with `user` and tokens
   */
  googleLogin(request: OAuthSocialLoginRequest): Observable<SignInResponse> {
    return from(this.ensureConfigured().oauth.googleLogin(request)).pipe(
      tap((response) => this.storeTokens(response))
    );
  }

  /**
   * Sign in via tenant-specific login (white-label authentication).
   * Automatically stores tokens on successful authentication.
   *
   * @param request - Tenant login credentials and tenant identifier
   * @returns Observable emitting SignInResponse with `user` and tokens
   */
  tenantLogin(request: TenantLoginRequest): Observable<SignInResponse> {
    return from(this.ensureConfigured().oauth.tenantLogin(request)).pipe(
      tap((response) => this.storeTokens(response))
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Token Management (only applicable with provideBlocks23)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get the currently stored access token.
   * Only available in token mode (not cookie mode).
   *
   * @returns The access token string, or `null` if not set or in cookie mode
   */
  getAccessToken(): string | null {
    return this.tokenManager?.getAccessToken() ?? null;
  }

  /**
   * Get the currently stored refresh token.
   * Only available in token mode (not cookie mode).
   *
   * @returns The refresh token string, or `null` if not set or in cookie mode
   */
  getRefreshToken(): string | null {
    return this.tokenManager?.getRefreshToken() ?? null;
  }

  /**
   * Manually set access and refresh tokens.
   * Useful when tokens are obtained outside the normal auth flow
   * (e.g., from a server-side redirect or external OAuth callback).
   *
   * @param accessToken - The access token to store
   * @param refreshToken - Optional refresh token to store
   */
  setTokens(accessToken: string, refreshToken?: string): void {
    this.tokenManager?.setTokens(accessToken, refreshToken);
  }

  /**
   * Clear all stored tokens, effectively logging the user out locally.
   * Does NOT invalidate the session server-side — use `signOut()` for that.
   */
  clearTokens(): void {
    this.tokenManager?.clearTokens();
  }

  /**
   * Check if the user is currently authenticated based on token presence.
   *
   * @returns `true` if an access token is stored, `false` if not,
   *   or `null` if token management is unavailable (cookie mode or no TokenManager)
   */
  isAuthenticated(): boolean | null {
    if (!this.tokenManager || this.simpleConfig?.authMode === 'cookie') {
      return null;
    }
    return !!this.tokenManager.getAccessToken();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Delegated sub-services (Promise-based, auto-sync with block API)
  // ─────────────────────────────────────────────────────────────────────────────

  /** Core auth operations (signIn, signUp, signOut, password reset, magic links, invitations). Promise-based. */
  get auth() { return this.ensureConfigured().auth; }
  /** User CRUD, listing, search, and profile management */
  get users() { return this.ensureConfigured().users; }
  /** Role listing and assignment */
  get roles() { return this.ensureConfigured().roles; }
  /** Permission management */
  get permissions() { return this.ensureConfigured().permissions; }
  /** API key creation and management */
  get apiKeys() { return this.ensureConfigured().apiKeys; }
  /** Service token management for machine-to-machine authentication */
  get serviceTokens() { return this.ensureConfigured().serviceTokens; }
  /** Multi-factor authentication setup and verification */
  get mfa() { return this.ensureConfigured().mfa; }
  /** OAuth provider management (Facebook, Google, tenant login) */
  get oauth() { return this.ensureConfigured().oauth; }
  /** User avatar upload and management */
  get avatars() { return this.ensureConfigured().avatars; }
  /** Tenant CRUD and configuration */
  get tenants() { return this.ensureConfigured().tenants; }
  /** Application registration and management */
  get apps() { return this.ensureConfigured().apps; }
  /** Block configuration management */
  get blocks() { return this.ensureConfigured().blocks; }
  /** Service endpoint management */
  get services() { return this.ensureConfigured().services; }
  /** Subscription model/plan definitions */
  get subscriptionModels() { return this.ensureConfigured().subscriptionModels; }
  /** User-level subscription management */
  get userSubscriptions() { return this.ensureConfigured().userSubscriptions; }
  /** Company-level subscription management */
  get companySubscriptions() { return this.ensureConfigured().companySubscriptions; }
  /** Country listing (read-only reference data) */
  get countries() { return this.ensureConfigured().countries; }
  /** State/province listing (read-only reference data) */
  get states() { return this.ensureConfigured().states; }
  /** County listing (read-only reference data) */
  get counties() { return this.ensureConfigured().counties; }
  /** City listing (read-only reference data) */
  get cities() { return this.ensureConfigured().cities; }
  /** Currency listing (read-only reference data) */
  get currencies() { return this.ensureConfigured().currencies; }
  /** Guest/anonymous user management */
  get guests() { return this.ensureConfigured().guests; }
  /** Magic link token management */
  get magicLinks() { return this.ensureConfigured().magicLinks; }
  /** Refresh token listing and revocation */
  get refreshTokens() { return this.ensureConfigured().refreshTokens; }
  /** User device registration and management */
  get userDevices() { return this.ensureConfigured().userDevices; }
  /** Tenant-user association management */
  get tenantUsers() { return this.ensureConfigured().tenantUsers; }
  /** Email template management (Mandrill/SendGrid) */
  get mailTemplates() { return this.ensureConfigured().mailTemplates; }
  /** JSON Web Key Set management */
  get jwks() { return this.ensureConfigured().jwks; }
  /** Admin RSA key management */
  get adminRsaKeys() { return this.ensureConfigured().adminRsaKeys; }
  /** OpenID Connect configuration */
  get oidc() { return this.ensureConfigured().oidc; }

  /** Direct access to the underlying AuthenticationBlock instance */
  get authenticationBlock(): AuthenticationBlock { return this.ensureConfigured(); }
}
