import type { Transport } from '@23blocks/contracts';
import type {
  OidcDiscovery,
  OidcAuthorizeRequest,
  OidcTokenRequest,
  OidcTokenResponse,
  OidcUserInfo,
} from '../types/oidc.js';

/**
 * OIDC Service Interface - OpenID Connect operations
 */
export interface OidcService {
  /**
   * Get the OpenID Connect discovery document
   * Typically accessed at /.well-known/openid-configuration
   */
  getDiscovery(): Promise<OidcDiscovery>;

  /**
   * Build the authorization URL for redirect-based authentication
   */
  buildAuthorizeUrl(request: OidcAuthorizeRequest): string;

  /**
   * Exchange authorization code for tokens
   */
  exchangeCode(request: OidcTokenRequest): Promise<OidcTokenResponse>;

  /**
   * Refresh an access token using a refresh token
   */
  refreshToken(refreshToken: string, clientId: string): Promise<OidcTokenResponse>;

  /**
   * Get user info from the userinfo endpoint
   */
  getUserInfo(accessToken?: string): Promise<OidcUserInfo>;

  /**
   * Introspect a token (check if valid and get claims)
   */
  introspect(token: string): Promise<{
    active: boolean;
    scope?: string;
    clientId?: string;
    username?: string;
    tokenType?: string;
    exp?: number;
    iat?: number;
    nbf?: number;
    sub?: string;
    aud?: string | string[];
    iss?: string;
    jti?: string;
  }>;

  /**
   * Revoke a token
   */
  revoke(token: string, tokenTypeHint?: 'access_token' | 'refresh_token'): Promise<void>;

  /**
   * End the session (logout)
   */
  endSession(idToken?: string, postLogoutRedirectUri?: string, state?: string): string;
}

/**
 * Create the OIDC service
 */
export function createOidcService(transport: Transport, baseUrl?: string): OidcService {
  return {
    async getDiscovery(): Promise<OidcDiscovery> {
      const response = await transport.get<{
        issuer: string;
        authorization_endpoint: string;
        token_endpoint: string;
        userinfo_endpoint: string;
        jwks_uri: string;
        registration_endpoint?: string;
        scopes_supported: string[];
        response_types_supported: string[];
        response_modes_supported?: string[];
        grant_types_supported?: string[];
        subject_types_supported: string[];
        id_token_signing_alg_values_supported: string[];
        claims_supported?: string[];
        token_endpoint_auth_methods_supported?: string[];
      }>('/.well-known/openid-configuration');

      return {
        issuer: response.issuer,
        authorization_endpoint: response.authorization_endpoint,
        token_endpoint: response.token_endpoint,
        userinfo_endpoint: response.userinfo_endpoint,
        jwks_uri: response.jwks_uri,
        registration_endpoint: response.registration_endpoint,
        scopes_supported: response.scopes_supported,
        response_types_supported: response.response_types_supported,
        response_modes_supported: response.response_modes_supported,
        grant_types_supported: response.grant_types_supported,
        subject_types_supported: response.subject_types_supported,
        id_token_signing_alg_values_supported: response.id_token_signing_alg_values_supported,
        claims_supported: response.claims_supported,
        token_endpoint_auth_methods_supported: response.token_endpoint_auth_methods_supported,
      };
    },

    buildAuthorizeUrl(request: OidcAuthorizeRequest): string {
      const params = new URLSearchParams();
      params.set('response_type', request.responseType);
      params.set('client_id', request.clientId);
      params.set('redirect_uri', request.redirectUri);
      params.set('scope', request.scope);

      if (request.state) params.set('state', request.state);
      if (request.nonce) params.set('nonce', request.nonce);
      if (request.codeChallenge) params.set('code_challenge', request.codeChallenge);
      if (request.codeChallengeMethod) params.set('code_challenge_method', request.codeChallengeMethod);
      if (request.prompt) params.set('prompt', request.prompt);
      if (request.maxAge !== undefined) params.set('max_age', String(request.maxAge));
      if (request.uiLocales) params.set('ui_locales', request.uiLocales);
      if (request.loginHint) params.set('login_hint', request.loginHint);
      if (request.acrValues) params.set('acr_values', request.acrValues);

      const base = baseUrl ?? '';
      return `${base}/oauth/authorize?${params.toString()}`;
    },

    async exchangeCode(request: OidcTokenRequest): Promise<OidcTokenResponse> {
      const body: Record<string, string> = {
        grant_type: request.grantType,
        client_id: request.clientId,
      };

      if (request.code) body.code = request.code;
      if (request.redirectUri) body.redirect_uri = request.redirectUri;
      if (request.clientSecret) body.client_secret = request.clientSecret;
      if (request.refreshToken) body.refresh_token = request.refreshToken;
      if (request.codeVerifier) body.code_verifier = request.codeVerifier;
      if (request.scope) body.scope = request.scope;

      const response = await transport.post<{
        access_token: string;
        token_type: string;
        expires_in: number;
        refresh_token?: string;
        id_token?: string;
        scope?: string;
      }>('/oauth/token', body);

      return {
        access_token: response.access_token,
        token_type: response.token_type,
        expires_in: response.expires_in,
        refresh_token: response.refresh_token,
        id_token: response.id_token,
        scope: response.scope,
      };
    },

    async refreshToken(refreshToken: string, clientId: string): Promise<OidcTokenResponse> {
      return this.exchangeCode({
        grantType: 'refresh_token',
        refreshToken,
        clientId,
      });
    },

    async getUserInfo(accessToken?: string): Promise<OidcUserInfo> {
      const headers: Record<string, string> = {};
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await transport.get<{
        sub: string;
        name?: string;
        given_name?: string;
        family_name?: string;
        middle_name?: string;
        nickname?: string;
        preferred_username?: string;
        profile?: string;
        picture?: string;
        website?: string;
        email?: string;
        email_verified?: boolean;
        gender?: string;
        birthdate?: string;
        zoneinfo?: string;
        locale?: string;
        phone_number?: string;
        phone_number_verified?: boolean;
        address?: {
          formatted?: string;
          street_address?: string;
          locality?: string;
          region?: string;
          postal_code?: string;
          country?: string;
        };
        updated_at?: number;
      }>('/oauth/userinfo');

      return {
        sub: response.sub,
        name: response.name,
        given_name: response.given_name,
        family_name: response.family_name,
        middle_name: response.middle_name,
        nickname: response.nickname,
        preferred_username: response.preferred_username,
        profile: response.profile,
        picture: response.picture,
        website: response.website,
        email: response.email,
        email_verified: response.email_verified,
        gender: response.gender,
        birthdate: response.birthdate,
        zoneinfo: response.zoneinfo,
        locale: response.locale,
        phone_number: response.phone_number,
        phone_number_verified: response.phone_number_verified,
        address: response.address,
        updated_at: response.updated_at,
      };
    },

    async introspect(token: string): Promise<{
      active: boolean;
      scope?: string;
      clientId?: string;
      username?: string;
      tokenType?: string;
      exp?: number;
      iat?: number;
      nbf?: number;
      sub?: string;
      aud?: string | string[];
      iss?: string;
      jti?: string;
    }> {
      const response = await transport.post<{
        active: boolean;
        scope?: string;
        client_id?: string;
        username?: string;
        token_type?: string;
        exp?: number;
        iat?: number;
        nbf?: number;
        sub?: string;
        aud?: string | string[];
        iss?: string;
        jti?: string;
      }>('/oauth/introspect', { token });

      return {
        active: response.active,
        scope: response.scope,
        clientId: response.client_id,
        username: response.username,
        tokenType: response.token_type,
        exp: response.exp,
        iat: response.iat,
        nbf: response.nbf,
        sub: response.sub,
        aud: response.aud,
        iss: response.iss,
        jti: response.jti,
      };
    },

    async revoke(token: string, tokenTypeHint?: 'access_token' | 'refresh_token'): Promise<void> {
      const body: Record<string, string> = { token };
      if (tokenTypeHint) body.token_type_hint = tokenTypeHint;
      await transport.post('/oauth/revoke', body);
    },

    endSession(idToken?: string, postLogoutRedirectUri?: string, state?: string): string {
      const params = new URLSearchParams();
      if (idToken) params.set('id_token_hint', idToken);
      if (postLogoutRedirectUri) params.set('post_logout_redirect_uri', postLogoutRedirectUri);
      if (state) params.set('state', state);

      const base = baseUrl ?? '';
      const query = params.toString();
      return query ? `${base}/oauth/logout?${query}` : `${base}/oauth/logout`;
    },
  };
}
