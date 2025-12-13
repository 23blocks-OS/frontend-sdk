import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createAccountsService,
  createContactsService,
  createLeadsService,
  createOpportunitiesService,
  createMeetingsService,
  createQuotesService,
  type AccountsService,
  type ContactsService,
  type LeadsService,
  type OpportunitiesService,
  type MeetingsService,
  type QuotesService,
} from './services';

export interface CrmBlockConfig extends BlockConfig {
  appId: string;
  tenantId?: string;
}

export interface CrmBlock {
  accounts: AccountsService;
  contacts: ContactsService;
  leads: LeadsService;
  opportunities: OpportunitiesService;
  meetings: MeetingsService;
  quotes: QuotesService;
}

export function createCrmBlock(
  transport: Transport,
  config: CrmBlockConfig
): CrmBlock {
  return {
    accounts: createAccountsService(transport, config),
    contacts: createContactsService(transport, config),
    leads: createLeadsService(transport, config),
    opportunities: createOpportunitiesService(transport, config),
    meetings: createMeetingsService(transport, config),
    quotes: createQuotesService(transport, config),
  };
}

export const crmBlockMetadata: BlockMetadata = {
  name: 'crm',
  version: '0.1.0',
  description: 'CRM block for managing accounts, contacts, leads, opportunities, meetings, and quotes',
  resourceTypes: [
    'Account',
    'AccountDetail',
    'Contact',
    'ContactProfile',
    'Lead',
    'Opportunity',
    'Meeting',
    'Quote',
  ],
};
