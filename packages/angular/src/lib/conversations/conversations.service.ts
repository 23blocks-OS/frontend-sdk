import { Injectable, Inject } from '@angular/core';
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
import { TRANSPORT, CONVERSATIONS_CONFIG } from '../tokens.js';

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
  private readonly block: ConversationsBlock;

  constructor(
    @Inject(TRANSPORT) transport: Transport,
    @Inject(CONVERSATIONS_CONFIG) config: ConversationsBlockConfig
  ) {
    this.block = createConversationsBlock(transport, config);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Messages Service
  // ─────────────────────────────────────────────────────────────────────────────

  listMessages(params?: ListMessagesParams): Observable<PageResult<Message>> {
    return from(this.block.messages.list(params));
  }

  getMessage(uniqueId: string): Observable<Message> {
    return from(this.block.messages.get(uniqueId));
  }

  createMessage(data: CreateMessageRequest): Observable<Message> {
    return from(this.block.messages.create(data));
  }

  updateMessage(uniqueId: string, data: UpdateMessageRequest): Observable<Message> {
    return from(this.block.messages.update(uniqueId, data));
  }

  deleteMessage(uniqueId: string): Observable<void> {
    return from(this.block.messages.delete(uniqueId));
  }

  recoverMessage(uniqueId: string): Observable<Message> {
    return from(this.block.messages.recover(uniqueId));
  }

  listMessagesByContext(contextId: string, params?: ListMessagesParams): Observable<PageResult<Message>> {
    return from(this.block.messages.listByContext(contextId, params));
  }

  listMessagesByParent(parentId: string, params?: ListMessagesParams): Observable<PageResult<Message>> {
    return from(this.block.messages.listByParent(parentId, params));
  }

  listDeletedMessages(params?: ListMessagesParams): Observable<PageResult<Message>> {
    return from(this.block.messages.listDeleted(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Draft Messages Service
  // ─────────────────────────────────────────────────────────────────────────────

  listDraftMessages(params?: ListDraftMessagesParams): Observable<PageResult<DraftMessage>> {
    return from(this.block.draftMessages.list(params));
  }

  getDraftMessage(uniqueId: string): Observable<DraftMessage> {
    return from(this.block.draftMessages.get(uniqueId));
  }

  createDraftMessage(data: CreateDraftMessageRequest): Observable<DraftMessage> {
    return from(this.block.draftMessages.create(data));
  }

  updateDraftMessage(uniqueId: string, data: UpdateDraftMessageRequest): Observable<DraftMessage> {
    return from(this.block.draftMessages.update(uniqueId, data));
  }

  deleteDraftMessage(uniqueId: string): Observable<void> {
    return from(this.block.draftMessages.delete(uniqueId));
  }

  listDraftMessagesByContext(contextId: string, params?: ListDraftMessagesParams): Observable<PageResult<DraftMessage>> {
    return from(this.block.draftMessages.listByContext(contextId, params));
  }

  publishDraftMessage(uniqueId: string): Observable<DraftMessage> {
    return from(this.block.draftMessages.publish(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Groups Service
  // ─────────────────────────────────────────────────────────────────────────────

  listGroups(params?: ListGroupsParams): Observable<PageResult<Group>> {
    return from(this.block.groups.list(params));
  }

  getGroup(uniqueId: string): Observable<Group> {
    return from(this.block.groups.get(uniqueId));
  }

  createGroup(data: CreateGroupRequest): Observable<Group> {
    return from(this.block.groups.create(data));
  }

  updateGroup(uniqueId: string, data: UpdateGroupRequest): Observable<Group> {
    return from(this.block.groups.update(uniqueId, data));
  }

  deleteGroup(uniqueId: string): Observable<void> {
    return from(this.block.groups.delete(uniqueId));
  }

  recoverGroup(uniqueId: string): Observable<Group> {
    return from(this.block.groups.recover(uniqueId));
  }

  searchGroups(query: string, params?: ListGroupsParams): Observable<PageResult<Group>> {
    return from(this.block.groups.search(query, params));
  }

  listDeletedGroups(params?: ListGroupsParams): Observable<PageResult<Group>> {
    return from(this.block.groups.listDeleted(params));
  }

  addGroupMember(uniqueId: string, memberId: string): Observable<Group> {
    return from(this.block.groups.addMember(uniqueId, memberId));
  }

  removeGroupMember(uniqueId: string, memberId: string): Observable<Group> {
    return from(this.block.groups.removeMember(uniqueId, memberId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Notifications Service
  // ─────────────────────────────────────────────────────────────────────────────

  listNotifications(params?: ListNotificationsParams): Observable<PageResult<Notification>> {
    return from(this.block.notifications.list(params));
  }

  getNotification(uniqueId: string): Observable<Notification> {
    return from(this.block.notifications.get(uniqueId));
  }

  createNotification(data: CreateNotificationRequest): Observable<Notification> {
    return from(this.block.notifications.create(data));
  }

  updateNotification(uniqueId: string, data: UpdateNotificationRequest): Observable<Notification> {
    return from(this.block.notifications.update(uniqueId, data));
  }

  deleteNotification(uniqueId: string): Observable<void> {
    return from(this.block.notifications.delete(uniqueId));
  }

  markNotificationAsRead(uniqueId: string): Observable<Notification> {
    return from(this.block.notifications.markAsRead(uniqueId));
  }

  markNotificationAsUnread(uniqueId: string): Observable<Notification> {
    return from(this.block.notifications.markAsUnread(uniqueId));
  }

  listNotificationsByTarget(targetId: string, params?: ListNotificationsParams): Observable<PageResult<Notification>> {
    return from(this.block.notifications.listByTarget(targetId, params));
  }

  listUnreadNotifications(params?: ListNotificationsParams): Observable<PageResult<Notification>> {
    return from(this.block.notifications.listUnread(params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Conversations Service
  // ─────────────────────────────────────────────────────────────────────────────

  getConversation(params: GetConversationParams): Observable<Conversation> {
    return from(this.block.conversations.get(params));
  }

  listContexts(): Observable<string[]> {
    return from(this.block.conversations.listContexts());
  }

  deleteContext(context: string): Observable<void> {
    return from(this.block.conversations.deleteContext(context));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): ConversationsBlock {
    return this.block;
  }
}
