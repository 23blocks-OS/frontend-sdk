# @23blocks/block-conversations

Conversations block for 23blocks SDK - messaging, groups, notifications, and conversations management.

## Installation

```bash
npm install @23blocks/block-conversations
```

## Usage

```typescript
import { createConversationsBlock } from '@23blocks/block-conversations';

const conversationsBlock = createConversationsBlock(transport, {
  appId: 'your-app-id',
});

// Send a message
const message = await conversationsBlock.messages.create({
  content: 'Hello, world!',
  contextId: 'conversation-123',
  sourceId: 'user-456',
  targetId: 'user-789',
});

// Get conversation
const conversation = await conversationsBlock.conversations.get({
  context: 'conversation-123',
  includeFiles: true,
});

// Create a group
const group = await conversationsBlock.groups.create({
  name: 'My Group',
  members: ['user-1', 'user-2', 'user-3'],
});

// Send notification
const notification = await conversationsBlock.notifications.create({
  content: 'You have a new message',
  targetId: 'user-123',
  url: '/messages/456',
});
```

## Features

- **Messages**: Send, receive, and manage messages
- **Draft Messages**: Create and manage draft messages
- **Groups**: Create and manage conversation groups
- **Notifications**: Send and manage notifications
- **Conversations**: Get full conversation threads with messages and files

## API Reference

See the [full documentation](https://github.com/23blocks-OS/frontend-sdk/tree/main/packages/block-conversations) for detailed API reference.

## License

MIT
