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
} from './services';

export interface CrmBlockConfig extends BlockConfig {
  appId: string;
  tenantId?: string;
}

export interface CrmBlock {
  accounts: AccountsService;
  contacts: ContactsService;
  contactEvents: ContactEventsService;
  leads: LeadsService;
  leadFollows: LeadFollowsService;
  opportunities: OpportunitiesService;
  meetings: MeetingsService;
  meetingParticipants: MeetingParticipantsService;
  meetingBillings: MeetingBillingsService;
  quotes: QuotesService;
  subscribers: SubscribersService;
  referrals: ReferralsService;
  touches: TouchesService;
  categories: CategoriesService;
  calendarAccounts: CalendarAccountsService;
  busyBlocks: BusyBlocksService;
  icsTokens: IcsTokensService;
  zoomMeetings: ZoomMeetingsService;
  zoomHosts: ZoomHostsService;
  mailTemplates: CrmMailTemplatesService;
  communications: CommunicationsService;
  users: CrmUsersService;
  billingReports: BillingReportsService;
  calendarSync: CalendarSyncService;
}

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
