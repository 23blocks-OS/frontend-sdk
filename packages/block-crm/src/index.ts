// Block factory and metadata
export { createCrmBlock, crmBlockMetadata } from './lib/crm.block';
export type { CrmBlock, CrmBlockConfig } from './lib/crm.block';

// Types
export type {
  // Account types
  Account,
  AccountDetail,
  CreateAccountRequest,
  UpdateAccountRequest,
  ListAccountsParams,
  // Contact types
  Contact,
  ContactProfile,
  CreateContactRequest,
  UpdateContactRequest,
  ListContactsParams,
  // Lead types
  Lead,
  CreateLeadRequest,
  UpdateLeadRequest,
  ListLeadsParams,
  // Opportunity types
  Opportunity,
  CreateOpportunityRequest,
  UpdateOpportunityRequest,
  ListOpportunitiesParams,
  // Meeting types
  Meeting,
  CreateMeetingRequest,
  UpdateMeetingRequest,
  ListMeetingsParams,
  // Quote types
  Quote,
  CreateQuoteRequest,
  UpdateQuoteRequest,
  ListQuotesParams,
} from './lib/types';

// Services
export type {
  AccountsService,
  ContactsService,
  LeadsService,
  OpportunitiesService,
  MeetingsService,
  QuotesService,
} from './lib/services';

export {
  createAccountsService,
  createContactsService,
  createLeadsService,
  createOpportunitiesService,
  createMeetingsService,
  createQuotesService,
} from './lib/services';

// Mappers (for advanced use cases)
export {
  accountMapper,
  accountDetailMapper,
  contactMapper,
  contactProfileMapper,
  leadMapper,
  opportunityMapper,
  meetingMapper,
  quoteMapper,
} from './lib/mappers';
