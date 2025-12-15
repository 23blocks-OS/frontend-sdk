import type { EntityStatus, IdentityCore } from '@23blocks/contracts';

export interface ExpirationRule extends IdentityCore {
  name: string;
  description?: string;
  ruleType: string;
  daysToExpire?: number;
  expirationDate?: Date;
  warningDays?: number;
  isActive: boolean;
  status: EntityStatus;
  payload?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateExpirationRuleRequest {
  name: string;
  description?: string;
  ruleType: string;
  daysToExpire?: number;
  expirationDate?: Date;
  warningDays?: number;
  isActive?: boolean;
  payload?: Record<string, unknown>;
}

export interface UpdateExpirationRuleRequest {
  name?: string;
  description?: string;
  ruleType?: string;
  daysToExpire?: number;
  expirationDate?: Date;
  warningDays?: number;
  isActive?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListExpirationRulesParams {
  page?: number;
  perPage?: number;
  status?: string;
  ruleType?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
