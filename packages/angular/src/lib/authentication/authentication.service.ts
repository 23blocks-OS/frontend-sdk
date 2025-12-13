import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, from, tap } from 'rxjs';
import type { Transport } from '@23blocks/contracts';
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
  type ApiKey,
  type ApiKeyWithSecret,
  type CreateApiKeyRequest,
  type UpdateApiKeyRequest,
  type UpdateUserRequest,
  type CreateRoleRequest,
  type UpdateRoleRequest,
} from '@23blocks/block-authentication';
import { TRANSPORT, AUTHENTICATION_CONFIG } from '../tokens.js';
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
  private readonly block: AuthenticationBlock;
  private readonly tokenManager: TokenManagerService | null;
  private readonly simpleConfig: Simple23BlocksConfig | null;

  constructor(
    @Inject(TRANSPORT) transport: Transport,
    @Inject(AUTHENTICATION_CONFIG) config: AuthenticationBlockConfig,
    @Optional() @Inject(TOKEN_MANAGER) tokenManager: TokenManagerService | null,
    @Optional() @Inject(SIMPLE_CONFIG) simpleConfig: Simple23BlocksConfig | null
  ) {
    this.block = createAuthenticationBlock(transport, config);
    this.tokenManager = tokenManager;
    this.simpleConfig = simpleConfig;
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
    return from(this.block.auth.signIn(request)).pipe(
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
    return from(this.block.auth.signUp(request)).pipe(
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
    return from(this.block.auth.signOut()).pipe(
      tap(() => {
        if (this.isTokenMode && this.tokenManager) {
          this.tokenManager.clearTokens();
        }
      })
    );
  }

  requestPasswordReset(request: PasswordResetRequest): Observable<void> {
    return from(this.block.auth.requestPasswordReset(request));
  }

  updatePassword(request: PasswordUpdateRequest): Observable<void> {
    return from(this.block.auth.updatePassword(request));
  }

  validateToken(token: string): Observable<TokenValidationResponse> {
    return from(this.block.auth.validateToken(token));
  }

  getCurrentUser(): Observable<User | null> {
    return from(this.block.auth.getCurrentUser());
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Users Service
  // ─────────────────────────────────────────────────────────────────────────────

  listUsers(params?: { page?: number; perPage?: number }): Observable<User[]> {
    return from(this.block.users.list(params));
  }

  getUser(id: string): Observable<User> {
    return from(this.block.users.get(id));
  }

  updateUser(id: string, request: UpdateUserRequest): Observable<User> {
    return from(this.block.users.update(id, request));
  }

  deleteUser(id: string): Observable<void> {
    return from(this.block.users.delete(id));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Roles Service
  // ─────────────────────────────────────────────────────────────────────────────

  listRoles(): Observable<Role[]> {
    return from(this.block.roles.list());
  }

  getRole(id: string): Observable<Role> {
    return from(this.block.roles.get(id));
  }

  createRole(request: CreateRoleRequest): Observable<Role> {
    return from(this.block.roles.create(request));
  }

  updateRole(id: string, request: UpdateRoleRequest): Observable<Role> {
    return from(this.block.roles.update(id, request));
  }

  deleteRole(id: string): Observable<void> {
    return from(this.block.roles.delete(id));
  }

  listPermissions(): Observable<Permission[]> {
    return from(this.block.roles.listPermissions());
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // API Keys Service
  // ─────────────────────────────────────────────────────────────────────────────

  listApiKeys(): Observable<ApiKey[]> {
    return from(this.block.apiKeys.list());
  }

  getApiKey(id: string): Observable<ApiKey> {
    return from(this.block.apiKeys.get(id));
  }

  createApiKey(request: CreateApiKeyRequest): Observable<ApiKeyWithSecret> {
    return from(this.block.apiKeys.create(request));
  }

  updateApiKey(id: string, request: UpdateApiKeyRequest): Observable<ApiKey> {
    return from(this.block.apiKeys.update(id, request));
  }

  revokeApiKey(id: string): Observable<void> {
    return from(this.block.apiKeys.revoke(id));
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
    return this.block;
  }
}
