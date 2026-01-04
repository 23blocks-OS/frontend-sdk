import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createMessagesService,
  createDraftMessagesService,
  createGroupsService,
  createGroupInvitesService,
  createNotificationsService,
  createConversationsService,
  createWebSocketTokensService,
  createContextsService,
  createNotificationSettingsService,
  createAvailabilitiesService,
  createMessageFilesService,
  createSourcesService,
  createUsersService,
  createMeetingsService,
  createWebNotificationsService,
  type MessagesService,
  type DraftMessagesService,
  type GroupsService,
  type GroupInvitesService,
  type NotificationsService,
  type ConversationsService,
  type WebSocketTokensService,
  type ContextsService,
  type NotificationSettingsService,
  type AvailabilitiesService,
  type MessageFilesService,
  type SourcesService,
  type UsersService,
  type MeetingsService,
  type WebNotificationsService,
} from './services';

export interface ConversationsBlockConfig extends BlockConfig {
  appId: string;
  tenantId?: string;
}

export interface ConversationsBlock {
  messages: MessagesService;
  draftMessages: DraftMessagesService;
  groups: GroupsService;
  groupInvites: GroupInvitesService;
  notifications: NotificationsService;
  conversations: ConversationsService;
  websocketTokens: WebSocketTokensService;
  contexts: ContextsService;
  notificationSettings: NotificationSettingsService;
  availabilities: AvailabilitiesService;
  messageFiles: MessageFilesService;
  sources: SourcesService;
  users: UsersService;
  meetings: MeetingsService;
  webNotifications: WebNotificationsService;
}

export function createConversationsBlock(
  transport: Transport,
  config: ConversationsBlockConfig
): ConversationsBlock {
  return {
    messages: createMessagesService(transport, config),
    draftMessages: createDraftMessagesService(transport, config),
    groups: createGroupsService(transport, config),
    groupInvites: createGroupInvitesService(transport, config),
    notifications: createNotificationsService(transport, config),
    conversations: createConversationsService(transport, config),
    websocketTokens: createWebSocketTokensService(transport, config),
    contexts: createContextsService(transport, config),
    notificationSettings: createNotificationSettingsService(transport, config),
    availabilities: createAvailabilitiesService(transport, config),
    messageFiles: createMessageFilesService(transport, config),
    sources: createSourcesService(transport, config),
    users: createUsersService(transport, config),
    meetings: createMeetingsService(transport, config),
    webNotifications: createWebNotificationsService(transport, config),
  };
}

export const conversationsBlockMetadata: BlockMetadata = {
  name: 'conversations',
  version: '0.1.0',
  description: 'Messaging, conversations, groups, notifications, and real-time communication management',
  resourceTypes: [
    'Message',
    'DraftMessage',
    'Group',
    'GroupInvite',
    'Notification',
    'Conversation',
    'Context',
    'MessageFile',
    'Source',
    'User',
    'Meeting',
    'WebNotification',
  ],
};
