import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Account, AccountDetail } from '../types/account';
import { parseString, parseDate, parseBoolean, parseStatus, parseStringArray } from './utils';

export const accountMapper: ResourceMapper<Account> = {
  type: 'Account',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    label: parseString(resource.attributes['label']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    preferredDomain: parseString(resource.attributes['preferred_domain']),
    preferredLanguage: parseString(resource.attributes['preferred_language']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    tags: parseStringArray(resource.attributes['tags']),
    createdBy: parseString(resource.attributes['created_by']),
    updatedBy: parseString(resource.attributes['updated_by']),
  }),
};

export const accountDetailMapper: ResourceMapper<AccountDetail> = {
  type: 'AccountDetail',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    accountUniqueId: parseString(resource.attributes['account_unique_id']) || '',
    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    label: parseString(resource.attributes['label']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    preferredDomain: parseString(resource.attributes['preferred_domain']),
    preferredLanguage: parseString(resource.attributes['preferred_language']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    tags: parseStringArray(resource.attributes['tags']),
    createdBy: parseString(resource.attributes['created_by']),
    updatedBy: parseString(resource.attributes['updated_by']),
  }),
};
