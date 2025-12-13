// Block factory and metadata
export { createJarvisBlock, jarvisBlockMetadata } from './lib/jarvis.block';
export type { JarvisBlock, JarvisBlockConfig } from './lib/jarvis.block';

// Types
export type {
  // Agent types
  Agent,
  CreateAgentRequest,
  UpdateAgentRequest,
  ListAgentsParams,
  ChatRequest,
  ChatResponse,
  CompleteRequest,
  CompleteResponse,
  // Prompt types
  Prompt,
  CreatePromptRequest,
  UpdatePromptRequest,
  ListPromptsParams,
  ExecutePromptRequest,
  ExecutePromptResponse,
  TestPromptRequest,
  TestPromptResponse,
  // Workflow types
  Workflow,
  WorkflowStep,
  WorkflowTrigger,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  ListWorkflowsParams,
  RunWorkflowRequest,
  RunWorkflowResponse,
  // Execution types
  Execution,
  ExecutionStatus,
  ListExecutionsParams,
  // Conversation types
  Conversation,
  ConversationMessage,
  CreateConversationRequest,
  SendMessageRequest,
  SendMessageResponse,
  ListConversationsParams,
} from './lib/types';

// Services
export type {
  AgentsService,
  PromptsService,
  WorkflowsService,
  ExecutionsService,
  ConversationsService,
} from './lib/services';

export {
  createAgentsService,
  createPromptsService,
  createWorkflowsService,
  createExecutionsService,
  createConversationsService,
} from './lib/services';

// Mappers (for advanced use cases)
export {
  agentMapper,
  promptMapper,
  workflowMapper,
  executionMapper,
  conversationMapper,
} from './lib/mappers';
