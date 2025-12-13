import { Injectable, Inject } from '@angular/core';
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
import { TRANSPORT, CRM_CONFIG } from '../tokens.js';

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
  private readonly block: CrmBlock;

  constructor(
    @Inject(TRANSPORT) transport: Transport,
    @Inject(CRM_CONFIG) config: CrmBlockConfig
  ) {
    this.block = createCrmBlock(transport, config);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Accounts Service
  // ─────────────────────────────────────────────────────────────────────────────

  listAccounts(params?: ListAccountsParams): Observable<PageResult<Account>> {
    return from(this.block.accounts.list(params));
  }

  getAccount(uniqueId: string): Observable<Account> {
    return from(this.block.accounts.get(uniqueId));
  }

  createAccount(data: CreateAccountRequest): Observable<Account> {
    return from(this.block.accounts.create(data));
  }

  updateAccount(uniqueId: string, data: UpdateAccountRequest): Observable<Account> {
    return from(this.block.accounts.update(uniqueId, data));
  }

  deleteAccount(uniqueId: string): Observable<void> {
    return from(this.block.accounts.delete(uniqueId));
  }

  recoverAccount(uniqueId: string): Observable<Account> {
    return from(this.block.accounts.recover(uniqueId));
  }

  searchAccounts(query: string, params?: ListAccountsParams): Observable<PageResult<Account>> {
    return from(this.block.accounts.search(query, params));
  }

  listDeletedAccounts(params?: ListAccountsParams): Observable<PageResult<Account>> {
    return from(this.block.accounts.listDeleted(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Contacts Service
  // ─────────────────────────────────────────────────────────────────────────────

  listContacts(params?: ListContactsParams): Observable<PageResult<Contact>> {
    return from(this.block.contacts.list(params));
  }

  getContact(uniqueId: string): Observable<Contact> {
    return from(this.block.contacts.get(uniqueId));
  }

  createContact(data: CreateContactRequest): Observable<Contact> {
    return from(this.block.contacts.create(data));
  }

  updateContact(uniqueId: string, data: UpdateContactRequest): Observable<Contact> {
    return from(this.block.contacts.update(uniqueId, data));
  }

  deleteContact(uniqueId: string): Observable<void> {
    return from(this.block.contacts.delete(uniqueId));
  }

  recoverContact(uniqueId: string): Observable<Contact> {
    return from(this.block.contacts.recover(uniqueId));
  }

  searchContacts(query: string, params?: ListContactsParams): Observable<PageResult<Contact>> {
    return from(this.block.contacts.search(query, params));
  }

  listDeletedContacts(params?: ListContactsParams): Observable<PageResult<Contact>> {
    return from(this.block.contacts.listDeleted(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Leads Service
  // ─────────────────────────────────────────────────────────────────────────────

  listLeads(params?: ListLeadsParams): Observable<PageResult<Lead>> {
    return from(this.block.leads.list(params));
  }

  getLead(uniqueId: string): Observable<Lead> {
    return from(this.block.leads.get(uniqueId));
  }

  createLead(data: CreateLeadRequest): Observable<Lead> {
    return from(this.block.leads.create(data));
  }

  updateLead(uniqueId: string, data: UpdateLeadRequest): Observable<Lead> {
    return from(this.block.leads.update(uniqueId, data));
  }

  deleteLead(uniqueId: string): Observable<void> {
    return from(this.block.leads.delete(uniqueId));
  }

  recoverLead(uniqueId: string): Observable<Lead> {
    return from(this.block.leads.recover(uniqueId));
  }

  searchLeads(query: string, params?: ListLeadsParams): Observable<PageResult<Lead>> {
    return from(this.block.leads.search(query, params));
  }

  listDeletedLeads(params?: ListLeadsParams): Observable<PageResult<Lead>> {
    return from(this.block.leads.listDeleted(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Opportunities Service
  // ─────────────────────────────────────────────────────────────────────────────

  listOpportunities(params?: ListOpportunitiesParams): Observable<PageResult<Opportunity>> {
    return from(this.block.opportunities.list(params));
  }

  getOpportunity(uniqueId: string): Observable<Opportunity> {
    return from(this.block.opportunities.get(uniqueId));
  }

  createOpportunity(data: CreateOpportunityRequest): Observable<Opportunity> {
    return from(this.block.opportunities.create(data));
  }

  updateOpportunity(uniqueId: string, data: UpdateOpportunityRequest): Observable<Opportunity> {
    return from(this.block.opportunities.update(uniqueId, data));
  }

  deleteOpportunity(uniqueId: string): Observable<void> {
    return from(this.block.opportunities.delete(uniqueId));
  }

  recoverOpportunity(uniqueId: string): Observable<Opportunity> {
    return from(this.block.opportunities.recover(uniqueId));
  }

  searchOpportunities(query: string, params?: ListOpportunitiesParams): Observable<PageResult<Opportunity>> {
    return from(this.block.opportunities.search(query, params));
  }

  listDeletedOpportunities(params?: ListOpportunitiesParams): Observable<PageResult<Opportunity>> {
    return from(this.block.opportunities.listDeleted(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Meetings Service
  // ─────────────────────────────────────────────────────────────────────────────

  listMeetings(params?: ListMeetingsParams): Observable<PageResult<Meeting>> {
    return from(this.block.meetings.list(params));
  }

  getMeeting(uniqueId: string): Observable<Meeting> {
    return from(this.block.meetings.get(uniqueId));
  }

  createMeeting(data: CreateMeetingRequest): Observable<Meeting> {
    return from(this.block.meetings.create(data));
  }

  updateMeeting(uniqueId: string, data: UpdateMeetingRequest): Observable<Meeting> {
    return from(this.block.meetings.update(uniqueId, data));
  }

  deleteMeeting(uniqueId: string): Observable<void> {
    return from(this.block.meetings.delete(uniqueId));
  }

  recoverMeeting(uniqueId: string): Observable<Meeting> {
    return from(this.block.meetings.recover(uniqueId));
  }

  searchMeetings(query: string, params?: ListMeetingsParams): Observable<PageResult<Meeting>> {
    return from(this.block.meetings.search(query, params));
  }

  listDeletedMeetings(params?: ListMeetingsParams): Observable<PageResult<Meeting>> {
    return from(this.block.meetings.listDeleted(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Quotes Service
  // ─────────────────────────────────────────────────────────────────────────────

  listQuotes(params?: ListQuotesParams): Observable<PageResult<Quote>> {
    return from(this.block.quotes.list(params));
  }

  getQuote(uniqueId: string): Observable<Quote> {
    return from(this.block.quotes.get(uniqueId));
  }

  createQuote(data: CreateQuoteRequest): Observable<Quote> {
    return from(this.block.quotes.create(data));
  }

  updateQuote(uniqueId: string, data: UpdateQuoteRequest): Observable<Quote> {
    return from(this.block.quotes.update(uniqueId, data));
  }

  deleteQuote(uniqueId: string): Observable<void> {
    return from(this.block.quotes.delete(uniqueId));
  }

  recoverQuote(uniqueId: string): Observable<Quote> {
    return from(this.block.quotes.recover(uniqueId));
  }

  searchQuotes(query: string, params?: ListQuotesParams): Observable<PageResult<Quote>> {
    return from(this.block.quotes.search(query, params));
  }

  listDeletedQuotes(params?: ListQuotesParams): Observable<PageResult<Quote>> {
    return from(this.block.quotes.listDeleted(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): CrmBlock {
    return this.block;
  }
}
