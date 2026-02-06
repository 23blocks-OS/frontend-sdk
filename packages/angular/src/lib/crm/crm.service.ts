import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, from } from 'rxjs';
import type { Transport, PageResult } from '@23blocks/contracts';
import {
  createCrmBlock,
  type CrmBlock,
  type CrmBlockConfig,
  // Account types
  type Account,
  type AccountDetail,
  type CreateAccountRequest,
  type UpdateAccountRequest,
  type ListAccountsParams,
  // Contact types
  type Contact,
  type ContactProfile,
  type CreateContactRequest,
  type UpdateContactRequest,
  type ListContactsParams,
  // Contact Event types
  type ContactEvent,
  type CreateContactEventRequest,
  type UpdateContactEventRequest,
  type ListContactEventsParams,
  type ConfirmationRequest,
  type CheckinRequest,
  type CheckoutRequest,
  type EventNotesRequest,
  // Lead types
  type Lead,
  type CreateLeadRequest,
  type UpdateLeadRequest,
  type ListLeadsParams,
  // Lead Follow types
  type LeadFollow,
  type CreateLeadFollowRequest,
  type UpdateLeadFollowRequest,
  type ListLeadFollowsParams,
  // Opportunity types
  type Opportunity,
  type CreateOpportunityRequest,
  type UpdateOpportunityRequest,
  type ListOpportunitiesParams,
  // Meeting types
  type Meeting,
  type CreateMeetingRequest,
  type UpdateMeetingRequest,
  type ListMeetingsParams,
  // Meeting Participant types
  type MeetingParticipant,
  type CreateMeetingParticipantRequest,
  type ListMeetingParticipantsParams,
  // Meeting Billing types
  type MeetingBilling,
  type CreateMeetingBillingRequest,
  type UpdateMeetingBillingRequest,
  type ListMeetingBillingsParams,
  type PaymentSplit,
  type EapSession,
  type OutstandingByPayer,
  type BillingRevenueReport,
  type BillingAgingReport,
  type BillingParticipantReport,
  // Quote types
  type Quote,
  type CreateQuoteRequest,
  type UpdateQuoteRequest,
  type ListQuotesParams,
  // Subscriber types
  type Subscriber,
  type CreateSubscriberRequest,
  type UpdateSubscriberRequest,
  type ListSubscribersParams,
  // Referral types
  type Referral,
  type CreateReferralRequest,
  type UpdateReferralRequest,
  type ListReferralsParams,
  // Touch types
  type Touch,
  type CreateTouchRequest,
  type UpdateTouchRequest,
  type ListTouchesParams,
  // Category types
  type Category,
  type CreateCategoryRequest,
  type UpdateCategoryRequest,
  type ListCategoriesParams,
  // Calendar Account types
  type CalendarAccount,
  type CreateCalendarAccountRequest,
  type UpdateCalendarAccountRequest,
  type ListCalendarAccountsParams,
  type SyncCalendarRequest,
  type SyncCalendarResponse,
  // Busy Block types
  type BusyBlock,
  type CreateBusyBlockRequest,
  type ListBusyBlocksParams,
  // ICS Token types
  type IcsToken,
  type CreateIcsTokenRequest,
  type ListIcsTokensParams,
  // Zoom Meeting types
  type ZoomMeeting,
  type ZoomAvailability,
  type ProvisionZoomMeetingRequest,
  type UpdateZoomMeetingRequest,
  // Zoom Host types
  type ZoomHost,
  type ZoomHostAvailability,
  type ZoomHostAllocation,
  type AvailableUser,
  type CreateZoomHostRequest,
  type UpdateZoomHostRequest,
  type ListZoomHostsParams,
  // Mail Template types
  type CrmMailTemplate,
  type CreateCrmMailTemplateRequest,
  type UpdateCrmMailTemplateRequest,
  type ListCrmMailTemplatesParams,
  type CreateMandrillTemplateRequest,
  type UpdateMandrillTemplateRequest,
  type MandrillTemplateStats,
  // Communication types
  type UnsubscribeRequest,
  type UnsubscribeResponse,
  // CRM User types
  type CrmUser,
  type RegisterCrmUserRequest,
  type ListCrmUsersParams,
  // Billing Report types
  type BillingReportParams,
  type RevenueReport,
  type AgingReport,
  type ParticipantBillingReport,
  // Calendar Sync types
  type CalendarSyncResult,
} from '@23blocks/block-crm';
import { TRANSPORT, CRM_TRANSPORT, CRM_CONFIG } from '../tokens';

/**
 * Angular service wrapping the CRM block.
 * Converts Promise-based APIs to RxJS Observables.
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class AccountsComponent {
 *   constructor(private crm: CrmService) {}
 *
 *   loadAccounts() {
 *     this.crm.listAccounts({ page: 1, perPage: 20 }).subscribe({
 *       next: (result) => console.log('Accounts:', result.data),
 *       error: (err) => console.error('Failed:', err),
 *     });
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class CrmService {
  private readonly block: CrmBlock | null;

  constructor(
    @Optional() @Inject(CRM_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(CRM_CONFIG) config: CrmBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createCrmBlock(transport, config) : null;
  }

  /**
   * Ensure the service is configured, throw helpful error if not
   */
  private ensureConfigured(): CrmBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] CrmService is not configured. ' +
        "Add 'urls.crm' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Accounts Service
  // ─────────────────────────────────────────────────────────────────────────────

  listAccounts(params?: ListAccountsParams): Observable<PageResult<Account>> {
    return from(this.ensureConfigured().accounts.list(params));
  }

  getAccount(uniqueId: string): Observable<Account> {
    return from(this.ensureConfigured().accounts.get(uniqueId));
  }

  createAccount(data: CreateAccountRequest): Observable<Account> {
    return from(this.ensureConfigured().accounts.create(data));
  }

  updateAccount(uniqueId: string, data: UpdateAccountRequest): Observable<Account> {
    return from(this.ensureConfigured().accounts.update(uniqueId, data));
  }

  deleteAccount(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().accounts.delete(uniqueId));
  }

  recoverAccount(uniqueId: string): Observable<Account> {
    return from(this.ensureConfigured().accounts.recover(uniqueId));
  }

  searchAccounts(query: string, params?: ListAccountsParams): Observable<PageResult<Account>> {
    return from(this.ensureConfigured().accounts.search(query, params));
  }

  listDeletedAccounts(params?: ListAccountsParams): Observable<PageResult<Account>> {
    return from(this.ensureConfigured().accounts.listDeleted(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Contacts Service
  // ─────────────────────────────────────────────────────────────────────────────

  listContacts(params?: ListContactsParams): Observable<PageResult<Contact>> {
    return from(this.ensureConfigured().contacts.list(params));
  }

  getContact(uniqueId: string): Observable<Contact> {
    return from(this.ensureConfigured().contacts.get(uniqueId));
  }

  createContact(data: CreateContactRequest): Observable<Contact> {
    return from(this.ensureConfigured().contacts.create(data));
  }

  updateContact(uniqueId: string, data: UpdateContactRequest): Observable<Contact> {
    return from(this.ensureConfigured().contacts.update(uniqueId, data));
  }

  deleteContact(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().contacts.delete(uniqueId));
  }

  recoverContact(uniqueId: string): Observable<Contact> {
    return from(this.ensureConfigured().contacts.recover(uniqueId));
  }

  searchContacts(query: string, params?: ListContactsParams): Observable<PageResult<Contact>> {
    return from(this.ensureConfigured().contacts.search(query, params));
  }

  listDeletedContacts(params?: ListContactsParams): Observable<PageResult<Contact>> {
    return from(this.ensureConfigured().contacts.listDeleted(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Contact Events Service
  // ─────────────────────────────────────────────────────────────────────────────

  listContactEvents(params?: ListContactEventsParams): Observable<PageResult<ContactEvent>> {
    return from(this.ensureConfigured().contactEvents.list(params));
  }

  getContactEvent(uniqueId: string): Observable<ContactEvent> {
    return from(this.ensureConfigured().contactEvents.get(uniqueId));
  }

  createContactEvent(data: CreateContactEventRequest): Observable<ContactEvent> {
    return from(this.ensureConfigured().contactEvents.create(data));
  }

  updateContactEvent(uniqueId: string, data: UpdateContactEventRequest): Observable<ContactEvent> {
    return from(this.ensureConfigured().contactEvents.update(uniqueId, data));
  }

  deleteContactEvent(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().contactEvents.delete(uniqueId));
  }

  studentConfirmation(uniqueId: string, request?: ConfirmationRequest): Observable<ContactEvent> {
    return from(this.ensureConfigured().contactEvents.studentConfirmation(uniqueId, request));
  }

  studentCheckin(uniqueId: string, request?: CheckinRequest): Observable<ContactEvent> {
    return from(this.ensureConfigured().contactEvents.studentCheckin(uniqueId, request));
  }

  teacherConfirmation(uniqueId: string, request?: ConfirmationRequest): Observable<ContactEvent> {
    return from(this.ensureConfigured().contactEvents.teacherConfirmation(uniqueId, request));
  }

  teacherCheckin(uniqueId: string, request?: CheckinRequest): Observable<ContactEvent> {
    return from(this.ensureConfigured().contactEvents.teacherCheckin(uniqueId, request));
  }

  checkout(uniqueId: string, request?: CheckoutRequest): Observable<ContactEvent> {
    return from(this.ensureConfigured().contactEvents.checkout(uniqueId, request));
  }

  checkoutStudent(uniqueId: string, request?: CheckoutRequest): Observable<ContactEvent> {
    return from(this.ensureConfigured().contactEvents.checkoutStudent(uniqueId, request));
  }

  studentNotes(uniqueId: string, request: EventNotesRequest): Observable<ContactEvent> {
    return from(this.ensureConfigured().contactEvents.studentNotes(uniqueId, request));
  }

  adminNotes(uniqueId: string, request: EventNotesRequest): Observable<ContactEvent> {
    return from(this.ensureConfigured().contactEvents.adminNotes(uniqueId, request));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Leads Service
  // ─────────────────────────────────────────────────────────────────────────────

  listLeads(params?: ListLeadsParams): Observable<PageResult<Lead>> {
    return from(this.ensureConfigured().leads.list(params));
  }

  getLead(uniqueId: string): Observable<Lead> {
    return from(this.ensureConfigured().leads.get(uniqueId));
  }

  createLead(data: CreateLeadRequest): Observable<Lead> {
    return from(this.ensureConfigured().leads.create(data));
  }

  updateLead(uniqueId: string, data: UpdateLeadRequest): Observable<Lead> {
    return from(this.ensureConfigured().leads.update(uniqueId, data));
  }

  deleteLead(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().leads.delete(uniqueId));
  }

  recoverLead(uniqueId: string): Observable<Lead> {
    return from(this.ensureConfigured().leads.recover(uniqueId));
  }

  searchLeads(query: string, params?: ListLeadsParams): Observable<PageResult<Lead>> {
    return from(this.ensureConfigured().leads.search(query, params));
  }

  listDeletedLeads(params?: ListLeadsParams): Observable<PageResult<Lead>> {
    return from(this.ensureConfigured().leads.listDeleted(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Lead Follows Service
  // ─────────────────────────────────────────────────────────────────────────────

  listLeadFollows(leadUniqueId: string, params?: ListLeadFollowsParams): Observable<PageResult<LeadFollow>> {
    return from(this.ensureConfigured().leadFollows.list(leadUniqueId, params));
  }

  getLeadFollow(leadUniqueId: string, followUniqueId: string): Observable<LeadFollow> {
    return from(this.ensureConfigured().leadFollows.get(leadUniqueId, followUniqueId));
  }

  createLeadFollow(leadUniqueId: string, data: CreateLeadFollowRequest): Observable<LeadFollow> {
    return from(this.ensureConfigured().leadFollows.create(leadUniqueId, data));
  }

  updateLeadFollow(leadUniqueId: string, followUniqueId: string, data: UpdateLeadFollowRequest): Observable<LeadFollow> {
    return from(this.ensureConfigured().leadFollows.update(leadUniqueId, followUniqueId, data));
  }

  deleteLeadFollow(leadUniqueId: string, followUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().leadFollows.delete(leadUniqueId, followUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Opportunities Service
  // ─────────────────────────────────────────────────────────────────────────────

  listOpportunities(params?: ListOpportunitiesParams): Observable<PageResult<Opportunity>> {
    return from(this.ensureConfigured().opportunities.list(params));
  }

  getOpportunity(uniqueId: string): Observable<Opportunity> {
    return from(this.ensureConfigured().opportunities.get(uniqueId));
  }

  createOpportunity(data: CreateOpportunityRequest): Observable<Opportunity> {
    return from(this.ensureConfigured().opportunities.create(data));
  }

  updateOpportunity(uniqueId: string, data: UpdateOpportunityRequest): Observable<Opportunity> {
    return from(this.ensureConfigured().opportunities.update(uniqueId, data));
  }

  deleteOpportunity(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().opportunities.delete(uniqueId));
  }

  recoverOpportunity(uniqueId: string): Observable<Opportunity> {
    return from(this.ensureConfigured().opportunities.recover(uniqueId));
  }

  searchOpportunities(query: string, params?: ListOpportunitiesParams): Observable<PageResult<Opportunity>> {
    return from(this.ensureConfigured().opportunities.search(query, params));
  }

  listDeletedOpportunities(params?: ListOpportunitiesParams): Observable<PageResult<Opportunity>> {
    return from(this.ensureConfigured().opportunities.listDeleted(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Meetings Service
  // ─────────────────────────────────────────────────────────────────────────────

  listMeetings(params?: ListMeetingsParams): Observable<PageResult<Meeting>> {
    return from(this.ensureConfigured().meetings.list(params));
  }

  getMeeting(uniqueId: string): Observable<Meeting> {
    return from(this.ensureConfigured().meetings.get(uniqueId));
  }

  createMeeting(data: CreateMeetingRequest): Observable<Meeting> {
    return from(this.ensureConfigured().meetings.create(data));
  }

  updateMeeting(uniqueId: string, data: UpdateMeetingRequest): Observable<Meeting> {
    return from(this.ensureConfigured().meetings.update(uniqueId, data));
  }

  deleteMeeting(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().meetings.delete(uniqueId));
  }

  recoverMeeting(uniqueId: string): Observable<Meeting> {
    return from(this.ensureConfigured().meetings.recover(uniqueId));
  }

  searchMeetings(query: string, params?: ListMeetingsParams): Observable<PageResult<Meeting>> {
    return from(this.ensureConfigured().meetings.search(query, params));
  }

  listDeletedMeetings(params?: ListMeetingsParams): Observable<PageResult<Meeting>> {
    return from(this.ensureConfigured().meetings.listDeleted(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Meeting Participants Service
  // ─────────────────────────────────────────────────────────────────────────────

  listMeetingParticipants(meetingUniqueId: string, params?: ListMeetingParticipantsParams): Observable<PageResult<MeetingParticipant>> {
    return from(this.ensureConfigured().meetingParticipants.list(meetingUniqueId, params));
  }

  createMeetingParticipant(meetingUniqueId: string, data: CreateMeetingParticipantRequest): Observable<MeetingParticipant> {
    return from(this.ensureConfigured().meetingParticipants.create(meetingUniqueId, data));
  }

  deleteMeetingParticipant(meetingUniqueId: string, participantUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().meetingParticipants.delete(meetingUniqueId, participantUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Meeting Billings Service
  // ─────────────────────────────────────────────────────────────────────────────

  listMeetingBillings(meetingUniqueId: string, params?: ListMeetingBillingsParams): Observable<PageResult<MeetingBilling>> {
    return from(this.ensureConfigured().meetingBillings.list(meetingUniqueId, params));
  }

  getMeetingBilling(uniqueId: string): Observable<MeetingBilling> {
    return from(this.ensureConfigured().meetingBillings.get(uniqueId));
  }

  createMeetingBilling(meetingUniqueId: string, data: CreateMeetingBillingRequest): Observable<MeetingBilling> {
    return from(this.ensureConfigured().meetingBillings.create(meetingUniqueId, data));
  }

  updateMeetingBilling(uniqueId: string, data: UpdateMeetingBillingRequest): Observable<MeetingBilling> {
    return from(this.ensureConfigured().meetingBillings.update(uniqueId, data));
  }

  deleteMeetingBilling(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().meetingBillings.delete(uniqueId));
  }

  getPaymentSplit(uniqueId: string): Observable<PaymentSplit[]> {
    return from(this.ensureConfigured().meetingBillings.getPaymentSplit(uniqueId));
  }

  getEapSessions(participantEmail: string, payerName: string): Observable<EapSession> {
    return from(this.ensureConfigured().meetingBillings.getEapSessions(participantEmail, payerName));
  }

  getOutstandingByPayer(): Observable<OutstandingByPayer[]> {
    return from(this.ensureConfigured().meetingBillings.getOutstandingByPayer());
  }

  getBillingRevenueReport(): Observable<BillingRevenueReport> {
    return from(this.ensureConfigured().meetingBillings.getRevenueReport());
  }

  getBillingAgingReport(): Observable<BillingAgingReport> {
    return from(this.ensureConfigured().meetingBillings.getAgingReport());
  }

  getBillingParticipantReport(participantEmail: string): Observable<BillingParticipantReport> {
    return from(this.ensureConfigured().meetingBillings.getParticipantReport(participantEmail));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Quotes Service
  // ─────────────────────────────────────────────────────────────────────────────

  listQuotes(params?: ListQuotesParams): Observable<PageResult<Quote>> {
    return from(this.ensureConfigured().quotes.list(params));
  }

  getQuote(uniqueId: string): Observable<Quote> {
    return from(this.ensureConfigured().quotes.get(uniqueId));
  }

  createQuote(data: CreateQuoteRequest): Observable<Quote> {
    return from(this.ensureConfigured().quotes.create(data));
  }

  updateQuote(uniqueId: string, data: UpdateQuoteRequest): Observable<Quote> {
    return from(this.ensureConfigured().quotes.update(uniqueId, data));
  }

  deleteQuote(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().quotes.delete(uniqueId));
  }

  recoverQuote(uniqueId: string): Observable<Quote> {
    return from(this.ensureConfigured().quotes.recover(uniqueId));
  }

  searchQuotes(query: string, params?: ListQuotesParams): Observable<PageResult<Quote>> {
    return from(this.ensureConfigured().quotes.search(query, params));
  }

  listDeletedQuotes(params?: ListQuotesParams): Observable<PageResult<Quote>> {
    return from(this.ensureConfigured().quotes.listDeleted(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Subscribers Service
  // ─────────────────────────────────────────────────────────────────────────────

  listSubscribers(params?: ListSubscribersParams): Observable<PageResult<Subscriber>> {
    return from(this.ensureConfigured().subscribers.list(params));
  }

  getSubscriber(uniqueId: string): Observable<Subscriber> {
    return from(this.ensureConfigured().subscribers.get(uniqueId));
  }

  createSubscriber(data: CreateSubscriberRequest): Observable<Subscriber> {
    return from(this.ensureConfigured().subscribers.create(data));
  }

  updateSubscriber(uniqueId: string, data: UpdateSubscriberRequest): Observable<Subscriber> {
    return from(this.ensureConfigured().subscribers.update(uniqueId, data));
  }

  deleteSubscriber(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().subscribers.delete(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Referrals Service
  // ─────────────────────────────────────────────────────────────────────────────

  listReferrals(params?: ListReferralsParams): Observable<PageResult<Referral>> {
    return from(this.ensureConfigured().referrals.list(params));
  }

  getReferral(uniqueId: string): Observable<Referral> {
    return from(this.ensureConfigured().referrals.get(uniqueId));
  }

  createReferral(data: CreateReferralRequest): Observable<Referral> {
    return from(this.ensureConfigured().referrals.create(data));
  }

  updateReferral(uniqueId: string, data: UpdateReferralRequest): Observable<Referral> {
    return from(this.ensureConfigured().referrals.update(uniqueId, data));
  }

  deleteReferral(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().referrals.delete(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Touches Service
  // ─────────────────────────────────────────────────────────────────────────────

  listTouches(params?: ListTouchesParams): Observable<PageResult<Touch>> {
    return from(this.ensureConfigured().touches.list(params));
  }

  getTouch(uniqueId: string): Observable<Touch> {
    return from(this.ensureConfigured().touches.get(uniqueId));
  }

  createTouch(data: CreateTouchRequest): Observable<Touch> {
    return from(this.ensureConfigured().touches.create(data));
  }

  updateTouch(uniqueId: string, data: UpdateTouchRequest): Observable<Touch> {
    return from(this.ensureConfigured().touches.update(uniqueId, data));
  }

  deleteTouch(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().touches.delete(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Categories Service
  // ─────────────────────────────────────────────────────────────────────────────

  listCategories(params?: ListCategoriesParams): Observable<PageResult<Category>> {
    return from(this.ensureConfigured().categories.list(params));
  }

  getCategory(uniqueId: string): Observable<Category> {
    return from(this.ensureConfigured().categories.get(uniqueId));
  }

  createCategory(data: CreateCategoryRequest): Observable<Category> {
    return from(this.ensureConfigured().categories.create(data));
  }

  updateCategory(uniqueId: string, data: UpdateCategoryRequest): Observable<Category> {
    return from(this.ensureConfigured().categories.update(uniqueId, data));
  }

  deleteCategory(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().categories.delete(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Calendar Accounts Service
  // ─────────────────────────────────────────────────────────────────────────────

  listCalendarAccounts(userUniqueId: string, params?: ListCalendarAccountsParams): Observable<PageResult<CalendarAccount>> {
    return from(this.ensureConfigured().calendarAccounts.list(userUniqueId, params));
  }

  getCalendarAccount(userUniqueId: string, id: string): Observable<CalendarAccount> {
    return from(this.ensureConfigured().calendarAccounts.get(userUniqueId, id));
  }

  createCalendarAccount(userUniqueId: string, data: CreateCalendarAccountRequest): Observable<CalendarAccount> {
    return from(this.ensureConfigured().calendarAccounts.create(userUniqueId, data));
  }

  updateCalendarAccount(userUniqueId: string, id: string, data: UpdateCalendarAccountRequest): Observable<CalendarAccount> {
    return from(this.ensureConfigured().calendarAccounts.update(userUniqueId, id, data));
  }

  deleteCalendarAccount(userUniqueId: string, id: string): Observable<void> {
    return from(this.ensureConfigured().calendarAccounts.delete(userUniqueId, id));
  }

  syncUserCalendar(userUniqueId: string, request?: SyncCalendarRequest): Observable<SyncCalendarResponse> {
    return from(this.ensureConfigured().calendarAccounts.syncUser(userUniqueId, request));
  }

  syncTenantCalendar(request?: SyncCalendarRequest): Observable<SyncCalendarResponse> {
    return from(this.ensureConfigured().calendarAccounts.syncTenant(request));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Busy Blocks Service
  // ─────────────────────────────────────────────────────────────────────────────

  listBusyBlocks(userUniqueId: string, params?: ListBusyBlocksParams): Observable<PageResult<BusyBlock>> {
    return from(this.ensureConfigured().busyBlocks.list(userUniqueId, params));
  }

  createBusyBlock(userUniqueId: string, data: CreateBusyBlockRequest): Observable<BusyBlock> {
    return from(this.ensureConfigured().busyBlocks.create(userUniqueId, data));
  }

  deleteBusyBlock(userUniqueId: string, id: string): Observable<void> {
    return from(this.ensureConfigured().busyBlocks.delete(userUniqueId, id));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ICS Tokens Service
  // ─────────────────────────────────────────────────────────────────────────────

  listIcsTokens(userUniqueId: string, params?: ListIcsTokensParams): Observable<PageResult<IcsToken>> {
    return from(this.ensureConfigured().icsTokens.list(userUniqueId, params));
  }

  createIcsToken(userUniqueId: string, data: CreateIcsTokenRequest): Observable<IcsToken> {
    return from(this.ensureConfigured().icsTokens.create(userUniqueId, data));
  }

  deleteIcsToken(userUniqueId: string, id: string): Observable<void> {
    return from(this.ensureConfigured().icsTokens.delete(userUniqueId, id));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Zoom Meetings Service
  // ─────────────────────────────────────────────────────────────────────────────

  getZoomMeeting(userUniqueId: string, meetingUniqueId: string): Observable<ZoomMeeting> {
    return from(this.ensureConfigured().zoomMeetings.get(userUniqueId, meetingUniqueId));
  }

  provisionZoomMeeting(userUniqueId: string, meetingUniqueId: string, request?: ProvisionZoomMeetingRequest): Observable<ZoomMeeting> {
    return from(this.ensureConfigured().zoomMeetings.provision(userUniqueId, meetingUniqueId, request));
  }

  updateZoomMeeting(userUniqueId: string, meetingUniqueId: string, request: UpdateZoomMeetingRequest): Observable<ZoomMeeting> {
    return from(this.ensureConfigured().zoomMeetings.update(userUniqueId, meetingUniqueId, request));
  }

  cancelZoomMeeting(userUniqueId: string, meetingUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().zoomMeetings.cancel(userUniqueId, meetingUniqueId));
  }

  checkZoomAvailability(userUniqueId: string): Observable<ZoomAvailability> {
    return from(this.ensureConfigured().zoomMeetings.checkAvailability(userUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Zoom Hosts Service
  // ─────────────────────────────────────────────────────────────────────────────

  listZoomHosts(params?: ListZoomHostsParams): Observable<PageResult<ZoomHost>> {
    return from(this.ensureConfigured().zoomHosts.list(params));
  }

  getZoomHost(uniqueId: string): Observable<ZoomHost> {
    return from(this.ensureConfigured().zoomHosts.get(uniqueId));
  }

  createZoomHost(data: CreateZoomHostRequest): Observable<ZoomHost> {
    return from(this.ensureConfigured().zoomHosts.create(data));
  }

  updateZoomHost(uniqueId: string, data: UpdateZoomHostRequest): Observable<ZoomHost> {
    return from(this.ensureConfigured().zoomHosts.update(uniqueId, data));
  }

  deleteZoomHost(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().zoomHosts.delete(uniqueId));
  }

  getZoomHostAvailability(uniqueId: string): Observable<ZoomHostAvailability> {
    return from(this.ensureConfigured().zoomHosts.getAvailability(uniqueId));
  }

  getZoomHostAllocations(uniqueId: string): Observable<ZoomHostAllocation[]> {
    return from(this.ensureConfigured().zoomHosts.getAllocations(uniqueId));
  }

  getAvailableZoomUsers(): Observable<AvailableUser[]> {
    return from(this.ensureConfigured().zoomHosts.getAvailableUsers());
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Mail Templates Service
  // ─────────────────────────────────────────────────────────────────────────────

  listMailTemplates(params?: ListCrmMailTemplatesParams): Observable<PageResult<CrmMailTemplate>> {
    return from(this.ensureConfigured().mailTemplates.list(params));
  }

  getMailTemplate(uniqueId: string): Observable<CrmMailTemplate> {
    return from(this.ensureConfigured().mailTemplates.get(uniqueId));
  }

  createMailTemplate(data: CreateCrmMailTemplateRequest): Observable<CrmMailTemplate> {
    return from(this.ensureConfigured().mailTemplates.create(data));
  }

  updateMailTemplate(uniqueId: string, data: UpdateCrmMailTemplateRequest): Observable<CrmMailTemplate> {
    return from(this.ensureConfigured().mailTemplates.update(uniqueId, data));
  }

  getMandrillStats(uniqueId: string): Observable<MandrillTemplateStats> {
    return from(this.ensureConfigured().mailTemplates.getMandrillStats(uniqueId));
  }

  createMandrillTemplate(uniqueId: string, data: CreateMandrillTemplateRequest): Observable<CrmMailTemplate> {
    return from(this.ensureConfigured().mailTemplates.createMandrillTemplate(uniqueId, data));
  }

  updateMandrillTemplate(uniqueId: string, data: UpdateMandrillTemplateRequest): Observable<CrmMailTemplate> {
    return from(this.ensureConfigured().mailTemplates.updateMandrillTemplate(uniqueId, data));
  }

  publishMandrill(uniqueId: string): Observable<CrmMailTemplate> {
    return from(this.ensureConfigured().mailTemplates.publishMandrill(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Communications Service
  // ─────────────────────────────────────────────────────────────────────────────

  unsubscribe(data: UnsubscribeRequest): Observable<UnsubscribeResponse> {
    return from(this.ensureConfigured().communications.unsubscribe(data));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CRM Users Service
  // ─────────────────────────────────────────────────────────────────────────────

  listCrmUsers(params?: ListCrmUsersParams): Observable<PageResult<CrmUser>> {
    return from(this.ensureConfigured().users.list(params));
  }

  getCrmUser(uniqueId: string): Observable<CrmUser> {
    return from(this.ensureConfigured().users.get(uniqueId));
  }

  registerCrmUser(uniqueId: string, data: RegisterCrmUserRequest): Observable<CrmUser> {
    return from(this.ensureConfigured().users.register(uniqueId, data));
  }

  deleteCrmUser(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().users.delete(uniqueId));
  }

  getCrmUserContacts(uniqueId: string): Observable<Contact[]> {
    return from(this.ensureConfigured().users.getContacts(uniqueId));
  }

  getCrmUserMeetings(uniqueId: string): Observable<Meeting[]> {
    return from(this.ensureConfigured().users.getMeetings(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Billing Reports Service
  // ─────────────────────────────────────────────────────────────────────────────

  getRevenueReport(params?: BillingReportParams): Observable<RevenueReport> {
    return from(this.ensureConfigured().billingReports.getRevenueReport(params));
  }

  getAgingReport(): Observable<AgingReport> {
    return from(this.ensureConfigured().billingReports.getAgingReport());
  }

  getParticipantBillingReport(participantEmail: string): Observable<ParticipantBillingReport> {
    return from(this.ensureConfigured().billingReports.getParticipantReport(participantEmail));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Calendar Sync Service
  // ─────────────────────────────────────────────────────────────────────────────

  syncCalendarUser(userUniqueId: string): Observable<CalendarSyncResult> {
    return from(this.ensureConfigured().calendarSync.syncUser(userUniqueId));
  }

  syncCalendarTenant(): Observable<CalendarSyncResult> {
    return from(this.ensureConfigured().calendarSync.syncTenant());
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get crmBlock(): CrmBlock {
    return this.ensureConfigured();
  }
}
