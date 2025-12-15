import type { IdentityCore } from '@23blocks/contracts';

export interface AssetAlert extends IdentityCore {
  assetUniqueId?: string;
  alertType: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
  triggeredAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  payload?: Record<string, unknown>;
}

export interface CreateAssetAlertRequest {
  assetUniqueId?: string;
  alertType: string;
  message: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  payload?: Record<string, unknown>;
}
