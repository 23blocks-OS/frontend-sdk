import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, from } from 'rxjs';
import type { Transport, PageResult } from '@23blocks/contracts';
import {
  createConversationsBlock,
  type ConversationsBlock,
  type ConversationsBlockConfig,
  // Message types
  type Message,
  type CreateMessageRequest,
  type UpdateMessageRequest,
  type ListMessagesParams,
  // Draft Message types
  type DraftMessage,
  type CreateDraftMessageRequest,
  type UpdateDraftMessageRequest,
  type ListDraftMessagesParams,
  // Group types
  type Group,
  type CreateGroupRequest,
  type UpdateGroupRequest,
  type ListGroupsParams,
  // Group Invite types
  type GroupInvite,
  type CreateGroupInviteRequest,
  type JoinGroupRequest,
  type QRCodeResponse,
  type ListGroupInvitesParams,
  // Notification types
  type Notification,
  type CreateNotificationRequest,
  type UpdateNotificationRequest,
  type ListNotificationsParams,
  // Conversation types
  type Conversation,
  type GetConversationParams,
  // WebSocket Token types
  type CreateWebSocketTokenRequest,
  type CreateWebSocketTokenResponse,
  // Context types
  type Context,
  type CreateContextRequest,
  type UpdateContextRequest,
  type ListContextsParams,
  // Notification Settings types
  type NotificationSettings,
  type UpdateNotificationSettingsRequest,
  // Availability types
  type UserAvailability,
  type SetAvailabilityRequest,
  // Message File types
  type MessageFile,
  type CreateMessageFileRequest,
  type PresignMessageFileRequest,
  type PresignMessageFileResponse,
  // Source types
  type Source,
  // User types
  type ConversationsUser,
  type RegisterUserRequest,
  type UpdateUserRequest,
  type ListUsersParams,
  // Meeting types
  type Meeting,
  type MeetingSession,
  type CreateMeetingRequest,
  type UpdateMeetingRequest,
  type ListMeetingsParams,
  // Web Notification types
  type WebNotification,
  type CreateWebNotificationRequest,
  type BulkWebNotificationRequest,
  type ListWebNotificationsParams,
} from '@23blocks/block-conversations';
import { TRANSPORT, CONVERSATIONS_TRANSPORT, CONVERSATIONS_CONFIG } from '../tokens';

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
  // Group Invites Service
  // ─────────────────────────────────────────────────────────────────────────────

  listGroupInvites(groupUniqueId: string, params?: ListGroupInvitesParams): Observable<PageResult<GroupInvite>> {
    return from(this.ensureConfigured().groupInvites.list(groupUniqueId, params));
  }

  createGroupInvite(groupUniqueId: string, data?: CreateGroupInviteRequest): Observable<GroupInvite> {
    return from(this.ensureConfigured().groupInvites.create(groupUniqueId, data));
  }

  revokeGroupInvite(groupUniqueId: string, code: string): Observable<void> {
    return from(this.ensureConfigured().groupInvites.revoke(groupUniqueId, code));
  }

  getGroupInviteQRCode(groupUniqueId: string, code: string): Observable<QRCodeResponse> {
    return from(this.ensureConfigured().groupInvites.getQRCode(groupUniqueId, code));
  }

  joinGroupByInvite(code: string, data?: JoinGroupRequest): Observable<Group> {
    return from(this.ensureConfigured().groupInvites.join(code, data));
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

  listConversationContexts(): Observable<string[]> {
    return from(this.ensureConfigured().conversations.listContexts());
  }

  deleteConversationContext(context: string): Observable<void> {
    return from(this.ensureConfigured().conversations.deleteContext(context));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // WebSocket Tokens Service
  // ─────────────────────────────────────────────────────────────────────────────

  createWebSocketToken(data?: CreateWebSocketTokenRequest): Observable<CreateWebSocketTokenResponse> {
    return from(this.ensureConfigured().websocketTokens.create(data));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Contexts Service
  // ─────────────────────────────────────────────────────────────────────────────

  listContexts(params?: ListContextsParams): Observable<PageResult<Context>> {
    return from(this.ensureConfigured().contexts.list(params));
  }

  getContext(uniqueId: string): Observable<Context> {
    return from(this.ensureConfigured().contexts.get(uniqueId));
  }

  createContext(data: CreateContextRequest): Observable<Context> {
    return from(this.ensureConfigured().contexts.create(data));
  }

  updateContext(uniqueId: string, data: UpdateContextRequest): Observable<Context> {
    return from(this.ensureConfigured().contexts.update(uniqueId, data));
  }

  listContextGroups(contextUniqueId: string): Observable<PageResult<Group>> {
    return from(this.ensureConfigured().contexts.listGroups(contextUniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Notification Settings Service
  // ─────────────────────────────────────────────────────────────────────────────

  getNotificationSettings(userUniqueId: string): Observable<NotificationSettings> {
    return from(this.ensureConfigured().notificationSettings.get(userUniqueId));
  }

  updateNotificationSettings(userUniqueId: string, data: UpdateNotificationSettingsRequest): Observable<NotificationSettings> {
    return from(this.ensureConfigured().notificationSettings.update(userUniqueId, data));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Availabilities Service
  // ─────────────────────────────────────────────────────────────────────────────

  getUserAvailability(userUniqueId: string): Observable<UserAvailability> {
    return from(this.ensureConfigured().availabilities.get(userUniqueId));
  }

  goOnline(data?: SetAvailabilityRequest): Observable<UserAvailability> {
    return from(this.ensureConfigured().availabilities.goOnline(data));
  }

  goOffline(): Observable<void> {
    return from(this.ensureConfigured().availabilities.goOffline());
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Message Files Service
  // ─────────────────────────────────────────────────────────────────────────────

  getMessageFile(conversationUniqueId: string, fileUniqueId: string): Observable<MessageFile> {
    return from(this.ensureConfigured().messageFiles.get(conversationUniqueId, fileUniqueId));
  }

  createMessageFile(conversationUniqueId: string, data: CreateMessageFileRequest): Observable<MessageFile> {
    return from(this.ensureConfigured().messageFiles.create(conversationUniqueId, data));
  }

  deleteMessageFile(conversationUniqueId: string, fileUniqueId: string): Observable<void> {
    return from(this.ensureConfigured().messageFiles.delete(conversationUniqueId, fileUniqueId));
  }

  presignMessageFile(conversationUniqueId: string, data: PresignMessageFileRequest): Observable<PresignMessageFileResponse> {
    return from(this.ensureConfigured().messageFiles.presign(conversationUniqueId, data));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Sources Service
  // ─────────────────────────────────────────────────────────────────────────────

  getSource(uniqueId: string): Observable<Source> {
    return from(this.ensureConfigured().sources.get(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Users Service
  // ─────────────────────────────────────────────────────────────────────────────

  listConversationsUsers(params?: ListUsersParams): Observable<PageResult<ConversationsUser>> {
    return from(this.ensureConfigured().users.list(params));
  }

  getConversationsUser(uniqueId: string): Observable<ConversationsUser> {
    return from(this.ensureConfigured().users.get(uniqueId));
  }

  registerConversationsUser(uniqueId: string, data?: RegisterUserRequest): Observable<ConversationsUser> {
    return from(this.ensureConfigured().users.register(uniqueId, data));
  }

  updateConversationsUser(uniqueId: string, data: UpdateUserRequest): Observable<ConversationsUser> {
    return from(this.ensureConfigured().users.update(uniqueId, data));
  }

  listUserGroups(uniqueId: string): Observable<PageResult<Group>> {
    return from(this.ensureConfigured().users.listGroups(uniqueId));
  }

  listUserConversations(uniqueId: string, params?: { page?: number; perPage?: number }): Observable<PageResult<Conversation>> {
    return from(this.ensureConfigured().users.listConversations(uniqueId, params));
  }

  listUserGroupConversations(uniqueId: string, params?: { page?: number; perPage?: number }): Observable<PageResult<Conversation>> {
    return from(this.ensureConfigured().users.listGroupConversations(uniqueId, params));
  }

  listUserContextGroups(uniqueId: string, contextUniqueId: string): Observable<PageResult<Group>> {
    return from(this.ensureConfigured().users.listContextGroups(uniqueId, contextUniqueId));
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

  createMeetingSession(uniqueId: string): Observable<MeetingSession> {
    return from(this.ensureConfigured().meetings.createSession(uniqueId));
  }

  startMeeting(uniqueId: string): Observable<Meeting> {
    return from(this.ensureConfigured().meetings.start(uniqueId));
  }

  endMeeting(uniqueId: string): Observable<Meeting> {
    return from(this.ensureConfigured().meetings.end(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Web Notifications Service
  // ─────────────────────────────────────────────────────────────────────────────

  listWebNotifications(params?: ListWebNotificationsParams): Observable<PageResult<WebNotification>> {
    return from(this.ensureConfigured().webNotifications.list(params));
  }

  getWebNotification(uniqueId: string): Observable<WebNotification> {
    return from(this.ensureConfigured().webNotifications.get(uniqueId));
  }

  sendWebNotification(data: CreateWebNotificationRequest): Observable<WebNotification> {
    return from(this.ensureConfigured().webNotifications.send(data));
  }

  sendBulkWebNotifications(data: BulkWebNotificationRequest): Observable<{ sent: number; failed: number }> {
    return from(this.ensureConfigured().webNotifications.sendBulk(data));
  }

  markWebNotificationAsRead(uniqueId: string): Observable<WebNotification> {
    return from(this.ensureConfigured().webNotifications.markAsRead(uniqueId));
  }

  markWebNotificationAsClicked(uniqueId: string): Observable<WebNotification> {
    return from(this.ensureConfigured().webNotifications.markAsClicked(uniqueId));
  }

  markAllWebNotificationsAsRead(recipientUniqueId: string): Observable<{ updated: number }> {
    return from(this.ensureConfigured().webNotifications.markAllAsRead(recipientUniqueId));
  }

  deleteWebNotification(uniqueId: string): Observable<void> {
    return from(this.ensureConfigured().webNotifications.delete(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get conversationsBlock(): ConversationsBlock {
    return this.ensureConfigured();
  }
}
