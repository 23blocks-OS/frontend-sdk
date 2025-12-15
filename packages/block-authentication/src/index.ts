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
  type ResendConfirmationRequest,
  type ValidateEmailRequest,
  type ValidateEmailResponse,
  type ValidateDocumentRequest,
  type ValidateDocumentResponse,
  type AuthHeaders,

  // API Key types
  type ApiKey,
  type ApiKeyWithSecret,
  type CreateApiKeyRequest,
  type UpdateApiKeyRequest,
  type RevokeApiKeyRequest,

  // MFA types
  type MfaSetupResponseFull,
  type MfaEnableRequest,
  type MfaDisableRequest,
  type MfaVerifyRequestFull,
  type MfaStatusResponse,
  type MfaVerificationResponse,
  type MfaOperationResponse,

  // OAuth and Token types
  type OAuthSocialLoginRequest,
  type TenantLoginRequest,
  type TokenIntrospectionResponse,
  type TokenRevokeRequest,
  type TokenRevokeAllRequest,
  type TokenRevokeResponse,
  type TenantContextCreateRequest,
  type TenantInfo,
  type TenantContextResponse,
  type TenantContextRevokeRequest,
  type TenantContextAuditEntry,

  // Extended User types
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
  type MfaService,
  type OAuthService,
  type AvatarsService,
  type TenantsService,
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
