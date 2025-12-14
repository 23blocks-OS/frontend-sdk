import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, from } from 'rxjs';
import type { Transport, PageResult } from '@23blocks/contracts';
import {
  createConversationsBlock,
  type ConversationsBlock,
  type ConversationsBlockConfig,
  type Message,
  type CreateMessageRequest,
  type UpdateMessageRequest,
  type ListMessagesParams,
  type DraftMessage,
  type CreateDraftMessageRequest,
  type UpdateDraftMessageRequest,
  type ListDraftMessagesParams,
  type Group,
  type CreateGroupRequest,
  type UpdateGroupRequest,
  type ListGroupsParams,
  type Notification,
  type CreateNotificationRequest,
  type UpdateNotificationRequest,
  type ListNotificationsParams,
  type Conversation,
  type GetConversationParams,
} from '@23blocks/block-conversations';
import { TRANSPORT, CONVERSATIONS_TRANSPORT, CONVERSATIONS_CONFIG } from '../tokens.js';

/**
 * Angular service wrapping the Conversations block.
 * Converts Promise-based APIs to RxJS Observables.
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class ChatComponent {
 *   constructor(private conversations: ConversationsService) {}
 *
 *   sendMessage(contextId: string, content: string) {
 *     this.conversations.createMessage({ contextId, content }).subscribe({
 *       next: (message) => console.log('Message sent:', message),
 *       error: (err) => console.error('Failed:', err),
 *     });
 *   }
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ConversationsService {
  private readonly block: ConversationsBlock | null;

  constructor(
    @Optional() @Inject(CONVERSATIONS_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(CONVERSATIONS_CONFIG) config: ConversationsBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createConversationsBlock(transport, config) : null;
  }

  /**
   * Ensure the service is configured, throw helpful error if not
   */
  private ensureConfigured(): ConversationsBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] ConversationsService is not configured. ' +
        "Add 'urls.conversations' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Messages Service
  // ─────────────────────────────────────────────────────────────────────────────

  listMessages(params?: ListMessagesParams): Observable<PageResult<Message>> {
    return from(this.ensureConfigured().messages.list(params));
  }

  getMessage(uniqueId: string): Observable<Message> {
    return from(this.ensureConfigured().messages.get(uniqueId));
  }

  createMessage(data: CreateMessageRequest): Observable<Message> {
    return from(this.ensureConfigured().messages.create(data));
  }

  updateMessage(uniqueId: string, data: UpdateMessageRequest): Observable<Message> {
    return from(this.ensureConfigured().messages.update(uniqueId, data));
  }

  deleteMessage(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().messages.delete(uniqueId));
  }

  recoverMessage(uniqueId: string): Observable<Message> {
    return from(this.ensureConfigured().messages.recover(uniqueId));
  }

  listMessagesByContext(contextId: string, params?: ListMessagesParams): Observable<PageResult<Message>> {
    return from(this.ensureConfigured().messages.listByContext(contextId, params));
  }

  listMessagesByParent(parentId: string, params?: ListMessagesParams): Observable<PageResult<Message>> {
    return from(this.ensureConfigured().messages.listByParent(parentId, params));
  }

  listDeletedMessages(params?: ListMessagesParams): Observable<PageResult<Message>> {
    return from(this.ensureConfigured().messages.listDeleted(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Draft Messages Service
  // ─────────────────────────────────────────────────────────────────────────────

  listDraftMessages(params?: ListDraftMessagesParams): Observable<PageResult<DraftMessage>> {
    return from(this.ensureConfigured().draftMessages.list(params));
  }

  getDraftMessage(uniqueId: string): Observable<DraftMessage> {
    return from(this.ensureConfigured().draftMessages.get(uniqueId));
  }

  createDraftMessage(data: CreateDraftMessageRequest): Observable<DraftMessage> {
    return from(this.ensureConfigured().draftMessages.create(data));
  }

  updateDraftMessage(uniqueId: string, data: UpdateDraftMessageRequest): Observable<DraftMessage> {
    return from(this.ensureConfigured().draftMessages.update(uniqueId, data));
  }

  deleteDraftMessage(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().draftMessages.delete(uniqueId));
  }

  listDraftMessagesByContext(contextId: string, params?: ListDraftMessagesParams): Observable<PageResult<DraftMessage>> {
    return from(this.ensureConfigured().draftMessages.listByContext(contextId, params));
  }

  publishDraftMessage(uniqueId: string): Observable<DraftMessage> {
    return from(this.ensureConfigured().draftMessages.publish(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Groups Service
  // ─────────────────────────────────────────────────────────────────────────────

  listGroups(params?: ListGroupsParams): Observable<PageResult<Group>> {
    return from(this.ensureConfigured().groups.list(params));
  }

  getGroup(uniqueId: string): Observable<Group> {
    return from(this.ensureConfigured().groups.get(uniqueId));
  }

  createGroup(data: CreateGroupRequest): Observable<Group> {
    return from(this.ensureConfigured().groups.create(data));
  }

  updateGroup(uniqueId: string, data: UpdateGroupRequest): Observable<Group> {
    return from(this.ensureConfigured().groups.update(uniqueId, data));
  }

  deleteGroup(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().groups.delete(uniqueId));
  }

  recoverGroup(uniqueId: string): Observable<Group> {
    return from(this.ensureConfigured().groups.recover(uniqueId));
  }

  searchGroups(query: string, params?: ListGroupsParams): Observable<PageResult<Group>> {
    return from(this.ensureConfigured().groups.search(query, params));
  }

  listDeletedGroups(params?: ListGroupsParams): Observable<PageResult<Group>> {
    return from(this.ensureConfigured().groups.listDeleted(params));
  }

  addGroupMember(uniqueId: string, memberId: string): Observable<Group> {
    return from(this.ensureConfigured().groups.addMember(uniqueId, memberId));
  }

  removeGroupMember(uniqueId: string, memberId: string): Observable<Group> {
    return from(this.ensureConfigured().groups.removeMember(uniqueId, memberId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Notifications Service
  // ─────────────────────────────────────────────────────────────────────────────

  listNotifications(params?: ListNotificationsParams): Observable<PageResult<Notification>> {
    return from(this.ensureConfigured().notifications.list(params));
  }

  getNotification(uniqueId: string): Observable<Notification> {
    return from(this.ensureConfigured().notifications.get(uniqueId));
  }

  createNotification(data: CreateNotificationRequest): Observable<Notification> {
    return from(this.ensureConfigured().notifications.create(data));
  }

  updateNotification(uniqueId: string, data: UpdateNotificationRequest): Observable<Notification> {
    return from(this.ensureConfigured().notifications.update(uniqueId, data));
  }

  deleteNotification(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().notifications.delete(uniqueId));
  }

  markNotificationAsRead(uniqueId: string): Observable<Notification> {
    return from(this.ensureConfigured().notifications.markAsRead(uniqueId));
  }

  markNotificationAsUnread(uniqueId: string): Observable<Notification> {
    return from(this.ensureConfigured().notifications.markAsUnread(uniqueId));
  }

  listNotificationsByTarget(targetId: string, params?: ListNotificationsParams): Observable<PageResult<Notification>> {
    return from(this.ensureConfigured().notifications.listByTarget(targetId, params));
  }

  listUnreadNotifications(params?: ListNotificationsParams): Observable<PageResult<Notification>> {
    return from(this.ensureConfigured().notifications.listUnread(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Conversations Service
  // ─────────────────────────────────────────────────────────────────────────────

  getConversation(params: GetConversationParams): Observable<Conversation> {
    return from(this.ensureConfigured().conversations.get(params));
  }

  listContexts(): Observable<string[]> {
    return from(this.ensureConfigured().conversations.listContexts());
  }

  deleteContext(context: string): Observable<void> {
    return from(this.ensureConfigured().conversations.deleteContext(context));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): ConversationsBlock {
    return this.ensureConfigured();
  }
}
