# @23blocks/block-jarvis

Jarvis block for the 23blocks SDK - AI assistant, agents, prompts, and workflows.

[![npm version](https://img.shields.io/npm/v/@23blocks/block-jarvis.svg)](https://www.npmjs.com/package/@23blocks/block-jarvis)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @23blocks/block-jarvis @23blocks/transport-http
```

## Overview

This package provides AI assistant and automation functionality including:

- **Agents** - AI agent management with chat and completion
- **Prompts** - Prompt templates and execution
- **Workflows** - Multi-step AI workflows
- **Conversations** - Conversation management
- **AI Models** - Model configuration
- **Entities & Clusters** - Entity-based AI interactions
- **Mail Templates** - AI-powered email templates

## Quick Start

```typescript
import { createHttpTransport } from '@23blocks/transport-http';
import { createJarvisBlock } from '@23blocks/block-jarvis';

const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  headers: () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});

const jarvis = createJarvisBlock(transport, {
  apiKey: 'your-api-key',
});

// Chat with an agent
const response = await jarvis.agents.chat('agent-id', {
  message: 'Hello, how can you help me today?',
  conversationId: 'conv-123',
});

console.log(response.message);
```

## Services

### agents - AI Agent Management

```typescript
// List agents
const { data: agents } = await jarvis.agents.list();

// Get agent by ID
const agent = await jarvis.agents.get('agent-id');

// Create agent
const newAgent = await jarvis.agents.create({
  name: 'Customer Support',
  description: 'Handles customer inquiries',
  systemPrompt: 'You are a helpful customer support assistant...',
  modelId: 'model-id',
  temperature: 0.7,
});

// Chat with agent
const chatResponse = await jarvis.agents.chat('agent-id', {
  message: 'What are your business hours?',
  conversationId: 'conv-id',
});

// Complete text
const completion = await jarvis.agents.complete('agent-id', {
  prompt: 'Write a product description for...',
  maxTokens: 200,
});

// Update agent
await jarvis.agents.update('agent-id', {
  temperature: 0.5,
});

// Delete agent
await jarvis.agents.delete('agent-id');
```

### prompts - Prompt Templates

```typescript
// List prompts
const { data: prompts } = await jarvis.prompts.list();

// Get prompt by ID
const prompt = await jarvis.prompts.get('prompt-id');

// Create prompt
const newPrompt = await jarvis.prompts.create({
  name: 'Product Description',
  template: 'Write a compelling product description for {{product_name}}...',
  variables: ['product_name', 'features', 'target_audience'],
  category: 'marketing',
});

// Execute prompt
const result = await jarvis.prompts.execute({
  promptId: 'prompt-id',
  variables: {
    product_name: 'Smart Watch X',
    features: 'heart rate monitor, GPS, waterproof',
    target_audience: 'fitness enthusiasts',
  },
});

// Test prompt
const testResult = await jarvis.prompts.test({
  promptId: 'prompt-id',
  variables: { product_name: 'Test Product' },
});

// Update prompt
await jarvis.prompts.update('prompt-id', {
  template: 'Updated template...',
});

// Delete prompt
await jarvis.prompts.delete('prompt-id');
```

### workflows - AI Workflows

```typescript
// List workflows
const { data: workflows } = await jarvis.workflows.list();

// Get workflow by ID
const workflow = await jarvis.workflows.get('workflow-id');

// Create workflow
const newWorkflow = await jarvis.workflows.create({
  name: 'Content Generation Pipeline',
  description: 'Generates and refines content',
  trigger: 'manual',
  steps: [
    { name: 'Generate', promptId: 'prompt-1', order: 1 },
    { name: 'Review', agentId: 'agent-1', order: 2 },
    { name: 'Refine', promptId: 'prompt-2', order: 3 },
  ],
});

// Run workflow
const run = await jarvis.workflows.run({
  workflowId: 'workflow-id',
  input: { topic: 'AI in healthcare' },
});

// Get workflow execution
const execution = await jarvis.executions.get('execution-id');
console.log(execution.status, execution.output);

// Update workflow
await jarvis.workflows.update('workflow-id', {
  name: 'Updated Pipeline',
});

// Delete workflow
await jarvis.workflows.delete('workflow-id');
```

### conversations - Conversation Management

```typescript
// List conversations
const { data: conversations } = await jarvis.conversations.list({
  userId: 'user-id',
});

// Get conversation by ID
const conversation = await jarvis.conversations.get('conv-id');

// Create conversation
const newConv = await jarvis.conversations.create({
  agentId: 'agent-id',
  userId: 'user-id',
  title: 'Support Chat',
});

// Send message
const response = await jarvis.conversations.sendMessage({
  conversationId: 'conv-id',
  content: 'I need help with my order',
});

// Delete conversation
await jarvis.conversations.delete('conv-id');
```

### aiModels - Model Configuration

```typescript
// List available models
const { data: models } = await jarvis.aiModels.list();

// Get model by ID
const model = await jarvis.aiModels.get('model-id');

// Create model configuration
const newModel = await jarvis.aiModels.create({
  name: 'GPT-4 Turbo',
  provider: 'openai',
  modelId: 'gpt-4-turbo',
  maxTokens: 4096,
  temperature: 0.7,
});

// Update model
await jarvis.aiModels.update('model-id', {
  temperature: 0.5,
});

// Delete model
await jarvis.aiModels.delete('model-id');
```

### entities - Entity-Based AI

```typescript
// Register entity for AI interactions
const entity = await jarvis.entities.register({
  entityType: 'product',
  entityId: 'prod-123',
  name: 'Product X',
  context: { category: 'electronics', price: 299 },
});

// Create context for entity
const context = await jarvis.entities.createContext({
  entityId: 'entity-id',
  systemPrompt: 'You are an expert on this product...',
});

// Send message about entity
const response = await jarvis.entities.sendMessage({
  entityId: 'entity-id',
  contextId: 'context-id',
  message: 'What are the key features?',
});

// Query entity files
const fileResponse = await jarvis.entities.queryFile({
  entityId: 'entity-id',
  fileId: 'file-id',
  question: 'Summarize the document',
});
```

### mailTemplates - Email Templates

```typescript
// List mail templates
const { data: templates } = await jarvis.mailTemplates.list();

// Create template
const newTemplate = await jarvis.mailTemplates.create({
  name: 'Welcome Email',
  subject: 'Welcome to {{company_name}}!',
  body: 'Hi {{user_name}}, welcome to our platform...',
  variables: ['company_name', 'user_name'],
});

// Update template
await jarvis.mailTemplates.update('template-id', {
  body: 'Updated content...',
});

// Delete template
await jarvis.mailTemplates.delete('template-id');
```

## Types

```typescript
import type {
  Agent,
  Prompt,
  Workflow,
  Conversation,
  AIModel,
  Entity,
  MailTemplate,
  ChatRequest,
  ChatResponse,
  ExecutePromptRequest,
  RunWorkflowRequest,
  RunWorkflowResponse,
} from '@23blocks/block-jarvis';
```

## Related Packages

- [`@23blocks/angular`](https://www.npmjs.com/package/@23blocks/angular) - Angular integration
- [`@23blocks/react`](https://www.npmjs.com/package/@23blocks/react) - React integration
- [`@23blocks/sdk`](https://www.npmjs.com/package/@23blocks/sdk) - Full SDK package

## License

MIT - Copyright (c) 2024 23blocks
