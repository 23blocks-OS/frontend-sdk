import { Injectable, Inject } from '@angular/core';
import { Observable, from } from 'rxjs';
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

  constructor(
    @Inject(TRANSPORT) transport: Transport,
    @Inject(AUTHENTICATION_CONFIG) config: AuthenticationBlockConfig
  ) {
    this.block = createAuthenticationBlock(transport, config);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Auth Service
  // ─────────────────────────────────────────────────────────────────────────────

  signIn(request: SignInRequest): Observable<SignInResponse> {
    return from(this.block.auth.signIn(request));
  }

  signUp(request: SignUpRequest): Observable<SignUpResponse> {
    return from(this.block.auth.signUp(request));
  }

  signOut(): Observable<void> {
    return from(this.block.auth.signOut());
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
