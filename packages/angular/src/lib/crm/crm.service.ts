import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, from } from 'rxjs';
import type { Transport, PageResult } from '@23blocks/contracts';
import {
  createCrmBlock,
  type CrmBlock,
  type CrmBlockConfig,
  type Account,
  type AccountDetail,
  type CreateAccountRequest,
  type UpdateAccountRequest,
  type ListAccountsParams,
  type Contact,
  type ContactProfile,
  type CreateContactRequest,
  type UpdateContactRequest,
  type ListContactsParams,
  type Lead,
  type CreateLeadRequest,
  type UpdateLeadRequest,
  type ListLeadsParams,
  type Opportunity,
  type CreateOpportunityRequest,
  type UpdateOpportunityRequest,
  type ListOpportunitiesParams,
  type Meeting,
  type CreateMeetingRequest,
  type UpdateMeetingRequest,
  type ListMeetingsParams,
  type Quote,
  type CreateQuoteRequest,
  type UpdateQuoteRequest,
  type ListQuotesParams,
} from '@23blocks/block-crm';
import { TRANSPORT, CRM_TRANSPORT, CRM_CONFIG } from '../tokens.js';

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
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): CrmBlock {
    return this.ensureConfigured();
  }
}
