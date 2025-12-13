// Block factory and types
export {
  createAuthenticationBlock,
  type AuthenticationBlock,
  type AuthenticationBlockConfig,
  authenticationBlockMetadata,
} from './lib/authentication.block.js';

// Domain types
export {
  // User types
  type User,
  type Role,
  type Permission,
  type UserAvatar,
  type UserProfile,

  // Company types
  type Company,
  type CompanyDetail,
  type CompanyBlock,
  type CompanyKey,
  type Tenant,

  // Auth types
  type SignInRequest,
  type SignInResponse,
  type SignUpRequest,
  type SignUpResponse,
  type PasswordResetRequest,
  type PasswordUpdateRequest,
  type TokenValidationResponse,
  type RefreshTokenRequest,
  type RefreshTokenResponse,
  type OAuthSignInRequest,
  type MagicLinkRequest,
  type MagicLinkVerifyRequest,
  type MfaSetupResponse,
  type MfaVerifyRequest,
  type InvitationRequest,
  type AcceptInvitationRequest,
  type AuthHeaders,

  // API Key types
  type ApiKey,
  type ApiKeyWithSecret,
  type CreateApiKeyRequest,
  type UpdateApiKeyRequest,
  type RevokeApiKeyRequest,
} from './lib/types/index.js';

// Services (for advanced usage)
export {
  type AuthService,
  type UsersService,
  type RolesService,
  type ApiKeysService,
  type UpdateUserRequest,
  type UpdateProfileRequest,
  type CreateRoleRequest,
  type UpdateRoleRequest,
  type ApiKeyUsageStats,
} from './lib/services/index.js';

// Mappers (for custom decoding)
export {
  userMapper,
  roleMapper,
  permissionMapper,
  userAvatarMapper,
  userProfileMapper,
  companyMapper,
  companyDetailMapper,
  companyBlockMapper,
  companyKeyMapper,
  tenantMapper,
  apiKeyMapper,
  apiKeyWithSecretMapper,
} from './lib/mappers/index.js';
