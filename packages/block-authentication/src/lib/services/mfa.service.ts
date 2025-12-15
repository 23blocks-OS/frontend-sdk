import type { Transport } from '@23blocks/contracts';
import type {
  MfaSetupResponseFull,
  MfaEnableRequest,
  MfaDisableRequest,
  MfaVerifyRequestFull,
  MfaStatusResponse,
  MfaVerificationResponse,
  MfaOperationResponse,
} from '../types/index.js';

/**
 * MFA Service Interface
 */
export interface MfaService {
  /**
   * Setup MFA for a user (generates secret and QR code)
   */
  setup(userUniqueId: string, regenerate?: boolean): Promise<MfaSetupResponseFull>;

  /**
   * Enable MFA after setup (requires TOTP code verification)
   */
  enable(userUniqueId: string, request: MfaEnableRequest): Promise<MfaOperationResponse>;

  /**
   * Disable MFA (requires password verification)
   */
  disable(userUniqueId: string, request: MfaDisableRequest): Promise<MfaOperationResponse>;

  /**
   * Verify MFA code or backup code
   */
  verify(userUniqueId: string, request: MfaVerifyRequestFull): Promise<MfaVerificationResponse>;

  /**
   * Get MFA status for a user
   */
  status(userUniqueId: string): Promise<MfaStatusResponse>;
}

/**
 * Create the MFA service
 */
export function createMfaService(transport: Transport): MfaService {
  return {
    async setup(userUniqueId: string, regenerate?: boolean): Promise<MfaSetupResponseFull> {
      const response = await transport.post<{
        data: {
          attributes: {
            secret: string;
            qr_code_uri: string;
            backup_codes: string[];
            test_code: string;
          };
        };
      }>(`/users/${userUniqueId}/mfa/setup`, {
        regenerate: regenerate ? 'true' : undefined,
      });

      const attrs = response.data.attributes;
      return {
        secret: attrs.secret,
        qrCodeUri: attrs.qr_code_uri,
        backupCodes: attrs.backup_codes,
        testCode: attrs.test_code,
      };
    },

    async enable(userUniqueId: string, request: MfaEnableRequest): Promise<MfaOperationResponse> {
      const response = await transport.post<{
        data: {
          type: string;
          attributes: {
            enabled: boolean;
            message: string;
          };
        };
      }>(`/users/${userUniqueId}/mfa/enable`, {
        totp_code: request.totpCode,
      });

      return {
        enabled: response.data.attributes.enabled,
        message: response.data.attributes.message,
      };
    },

    async disable(userUniqueId: string, request: MfaDisableRequest): Promise<MfaOperationResponse> {
      const response = await transport.post<{
        data: {
          type: string;
          attributes: {
            enabled: boolean;
            message: string;
          };
        };
      }>(`/users/${userUniqueId}/mfa/disable`, {
        password: request.password,
      });

      return {
        enabled: response.data.attributes.enabled,
        message: response.data.attributes.message,
      };
    },

    async verify(userUniqueId: string, request: MfaVerifyRequestFull): Promise<MfaVerificationResponse> {
      const response = await transport.post<{
        data: {
          type: string;
          attributes: {
            valid: boolean;
            message: string;
          };
        };
      }>(`/users/${userUniqueId}/mfa/verify`, {
        code: request.code,
        backup_code: request.backupCode,
      });

      return {
        valid: response.data.attributes.valid,
        message: response.data.attributes.message,
      };
    },

    async status(userUniqueId: string): Promise<MfaStatusResponse> {
      const response = await transport.get<{
        data: {
          type: string;
          attributes: {
            enabled: boolean;
            setup_required: boolean;
            backup_codes_remaining: number;
            last_used_at: string | null;
          };
        };
      }>(`/users/${userUniqueId}/mfa/status`);

      return {
        enabled: response.data.attributes.enabled,
        setupRequired: response.data.attributes.setup_required,
        backupCodesRemaining: response.data.attributes.backup_codes_remaining,
        lastUsedAt: response.data.attributes.last_used_at,
      };
    },
  };
}
