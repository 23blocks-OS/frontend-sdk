import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createAccountsService,
  createContactsService,
  createContactEventsService,
  createLeadsService,
  createLeadFollowsService,
  createOpportunitiesService,
  createMeetingsService,
  createMeetingParticipantsService,
  createMeetingBillingsService,
  createQuotesService,
  createSubscribersService,
  createReferralsService,
  createTouchesService,
  createCategoriesService,
  createCalendarAccountsService,
  createBusyBlocksService,
  createIcsTokensService,
  createZoomMeetingsService,
  createZoomHostsService,
  createCrmMailTemplatesService,
  createCommunicationsService,
  createCrmUsersService,
  createBillingReportsService,
  createCalendarSyncService,
  type AccountsService,
  type ContactsService,
  type ContactEventsService,
  type LeadsService,
  type LeadFollowsService,
  type OpportunitiesService,
  type MeetingsService,
  type MeetingParticipantsService,
  type MeetingBillingsService,
  type QuotesService,
  type SubscribersService,
  type ReferralsService,
  type TouchesService,
  type CategoriesService,
  type CalendarAccountsService,
  type BusyBlocksService,
  type IcsTokensService,
  type ZoomMeetingsService,
  type ZoomHostsService,
  type CrmMailTemplatesService,
  type CommunicationsService,
  type CrmUsersService,
  type BillingReportsService,
  type CalendarSyncService,
} from './services/index.js';

/**
 * Configuration for the CRM block.
 */
export interface CrmBlockConfig extends BlockConfig {
  /** Application ID */
  appId: string;
  /** Tenant ID (optional, for multi-tenant setups) */
  tenantId?: string;
}

/**
 * Customer relationship management block interface.
 */
export interface CrmBlock {
  /** Account CRUD operations */
  accounts: AccountsService;
  /** Contact management */
  contacts: ContactsService;
  /** Contact event tracking */
  contactEvents: ContactEventsService;
  /** Lead management */
  leads: LeadsService;
  /** Lead follow-up tracking */
  leadFollows: LeadFollowsService;
  /** Sales opportunity management */
  opportunities: OpportunitiesService;
  /** Meeting scheduling and management */
  meetings: MeetingsService;
  /** Meeting participant management */
  meetingParticipants: MeetingParticipantsService;
  /** Meeting billing management */
  meetingBillings: MeetingBillingsService;
  /** Quote/proposal management */
  quotes: QuotesService;
  /** Subscriber management */
  subscribers: SubscribersService;
  /** Referral tracking */
  referrals: ReferralsService;
  /** Touch-point tracking */
  touches: TouchesService;
  /** CRM category management */
  categories: CategoriesService;
  /** Calendar account integration */
  calendarAccounts: CalendarAccountsService;
  /** Calendar busy-block management */
  busyBlocks: BusyBlocksService;
  /** ICS calendar token management */
  icsTokens: IcsTokensService;
  /** Zoom meeting integration */
  zoomMeetings: ZoomMeetingsService;
  /** Zoom host management */
  zoomHosts: ZoomHostsService;
  /** CRM mail template management */
  mailTemplates: CrmMailTemplatesService;
  /** Communication log management */
  communications: CommunicationsService;
  /** CRM user management */
  users: CrmUsersService;
  /** Billing report generation */
  billingReports: BillingReportsService;
  /** Calendar sync operations */
  calendarSync: CalendarSyncService;
}

/**
 * Create the CRM block.
 *
 * @example
 * ```typescript
 * const block = createCrmBlock(transport, { appId: 'xxx' });
 * const leads = await block.leads.list({ page: 1 });
 * ```
 */
export function createCrmBlock(
  transport: Transport,
  config: CrmBlockConfig
): CrmBlock {
  return {
    accounts: createAccountsService(transport, config),
    contacts: createContactsService(transport, config),
    contactEvents: createContactEventsService(transport, config),
    leads: createLeadsService(transport, config),
    leadFollows: createLeadFollowsService(transport, config),
    opportunities: createOpportunitiesService(transport, config),
    meetings: createMeetingsService(transport, config),
    meetingParticipants: createMeetingParticipantsService(transport, config),
    meetingBillings: createMeetingBillingsService(transport, config),
    quotes: createQuotesService(transport, config),
    subscribers: createSubscribersService(transport, config),
    referrals: createReferralsService(transport, config),
    touches: createTouchesService(transport, config),
    categories: createCategoriesService(transport, config),
    calendarAccounts: createCalendarAccountsService(transport, config),
    busyBlocks: createBusyBlocksService(transport, config),
    icsTokens: createIcsTokensService(transport, config),
    zoomMeetings: createZoomMeetingsService(transport, config),
    zoomHosts: createZoomHostsService(transport, config),
    mailTemplates: createCrmMailTemplatesService(transport, config),
    communications: createCommunicationsService(transport, config),
    users: createCrmUsersService(transport, config),
    billingReports: createBillingReportsService(transport, config),
    calendarSync: createCalendarSyncService(transport, config),
  };
}

export const crmBlockMetadata: BlockMetadata = {
  name: 'crm',
  version: '0.1.0',
  description: 'CRM block for managing accounts, contacts, leads, opportunities, meetings, quotes, and more',
  resourceTypes: [
    'Account',
    'AccountDetail',
    'AccountDocument',
    'Contact',
    'ContactProfile',
    'ContactEvent',
    'Lead',
    'LeadFollow',
    'Opportunity',
    'Meeting',
    'MeetingParticipant',
    'MeetingBilling',
    'Quote',
    'Subscriber',
    'Referral',
    'Touch',
    'Category',
    'CalendarAccount',
    'BusyBlock',
    'IcsToken',
    'ZoomMeeting',
    'ZoomHost',
    'CrmMailTemplate',
    'CrmUser',
  ],
};
