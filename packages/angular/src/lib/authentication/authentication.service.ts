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

  signIn(request: SignInRequest): Observable<SignInResponse> {
    return from(this.ensureConfigured().auth.signIn(request)).pipe(
      tap((response) => this.storeTokens(response))
    );
  }

  signUp(request: SignUpRequest): Observable<SignUpResponse> {
    return from(this.ensureConfigured().auth.signUp(request)).pipe(
      tap((response) => {
        if (this.isTokenMode && this.tokenManager && response.accessToken) {
          this.tokenManager.setTokens(response.accessToken);
        }
      })
    );
  }

  signOut(): Observable<void> {
    return from(this.ensureConfigured().auth.signOut()).pipe(
      tap(() => {
        if (this.isTokenMode && this.tokenManager) {
          this.tokenManager.clearTokens();
        }
      })
    );
  }

  refreshToken(request: RefreshTokenRequest): Observable<RefreshTokenResponse> {
    return from(this.ensureConfigured().auth.refreshToken(request)).pipe(
      tap((response) => this.storeTokens(response))
    );
  }

  verifyMagicLink(request: MagicLinkVerifyRequest): Observable<SignInResponse> {
    return from(this.ensureConfigured().auth.verifyMagicLink(request)).pipe(
      tap((response) => this.storeTokens(response))
    );
  }

  acceptInvitation(request: AcceptInvitationRequest): Observable<SignInResponse> {
    return from(this.ensureConfigured().auth.acceptInvitation(request)).pipe(
      tap((response) => this.storeTokens(response))
    );
  }

  facebookLogin(request: OAuthSocialLoginRequest): Observable<SignInResponse> {
    return from(this.ensureConfigured().oauth.facebookLogin(request)).pipe(
      tap((response) => this.storeTokens(response))
    );
  }

  googleLogin(request: OAuthSocialLoginRequest): Observable<SignInResponse> {
    return from(this.ensureConfigured().oauth.googleLogin(request)).pipe(
      tap((response) => this.storeTokens(response))
    );
  }

  tenantLogin(request: TenantLoginRequest): Observable<SignInResponse> {
    return from(this.ensureConfigured().oauth.tenantLogin(request)).pipe(
      tap((response) => this.storeTokens(response))
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Token Management (only applicable with provideBlocks23)
  // ─────────────────────────────────────────────────────────────────────────────

  getAccessToken(): string | null {
    return this.tokenManager?.getAccessToken() ?? null;
  }

  getRefreshToken(): string | null {
    return this.tokenManager?.getRefreshToken() ?? null;
  }

  setTokens(accessToken: string, refreshToken?: string): void {
    this.tokenManager?.setTokens(accessToken, refreshToken);
  }

  clearTokens(): void {
    this.tokenManager?.clearTokens();
  }

  isAuthenticated(): boolean | null {
    if (!this.tokenManager || this.simpleConfig?.authMode === 'cookie') {
      return null;
    }
    return !!this.tokenManager.getAccessToken();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Delegated sub-services (Promise-based, auto-sync with block API)
  // ─────────────────────────────────────────────────────────────────────────────

  get auth() { return this.ensureConfigured().auth; }
  get users() { return this.ensureConfigured().users; }
  get roles() { return this.ensureConfigured().roles; }
  get permissions() { return this.ensureConfigured().permissions; }
  get apiKeys() { return this.ensureConfigured().apiKeys; }
  get mfa() { return this.ensureConfigured().mfa; }
  get oauth() { return this.ensureConfigured().oauth; }
  get avatars() { return this.ensureConfigured().avatars; }
  get tenants() { return this.ensureConfigured().tenants; }
  get apps() { return this.ensureConfigured().apps; }
  get blocks() { return this.ensureConfigured().blocks; }
  get services() { return this.ensureConfigured().services; }
  get subscriptionModels() { return this.ensureConfigured().subscriptionModels; }
  get userSubscriptions() { return this.ensureConfigured().userSubscriptions; }
  get companySubscriptions() { return this.ensureConfigured().companySubscriptions; }
  get countries() { return this.ensureConfigured().countries; }
  get states() { return this.ensureConfigured().states; }
  get counties() { return this.ensureConfigured().counties; }
  get cities() { return this.ensureConfigured().cities; }
  get currencies() { return this.ensureConfigured().currencies; }
  get guests() { return this.ensureConfigured().guests; }
  get magicLinks() { return this.ensureConfigured().magicLinks; }
  get refreshTokens() { return this.ensureConfigured().refreshTokens; }
  get userDevices() { return this.ensureConfigured().userDevices; }
  get tenantUsers() { return this.ensureConfigured().tenantUsers; }
  get mailTemplates() { return this.ensureConfigured().mailTemplates; }
  get jwks() { return this.ensureConfigured().jwks; }
  get adminRsaKeys() { return this.ensureConfigured().adminRsaKeys; }
  get oidc() { return this.ensureConfigured().oidc; }

  /** Full block access */
  get authenticationBlock(): AuthenticationBlock { return this.ensureConfigured(); }
}
