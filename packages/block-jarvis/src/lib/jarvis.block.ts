import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createAgentsService,
  createPromptsService,
  createWorkflowsService,
  createExecutionsService,
  createConversationsService,
  createAIModelsService,
  createEntitiesService,
  createClustersService,
  createJarvisUsersService,
  createWorkflowParticipantsService,
  createWorkflowStepsService,
  createWorkflowInstancesService,
  createAgentRuntimeService,
  createMailTemplatesService,
  createMarvinChatService,
  createPromptCommentsService,
  createExecutionCommentsService,
  type AgentsService,
  type PromptsService,
  type WorkflowsService,
  type ExecutionsService,
  type ConversationsService,
  type AIModelsService,
  type EntitiesService,
  type ClustersService,
  type JarvisUsersService,
  type WorkflowParticipantsService,
  type WorkflowStepsService,
  type WorkflowInstancesService,
  type AgentRuntimeService,
  type MailTemplatesService,
  type MarvinChatService,
  type PromptCommentsService,
  type ExecutionCommentsService,
} from './services/index.js';

/**
 * Configuration for the Jarvis block.
 */
export interface JarvisBlockConfig extends BlockConfig {
  /** Application ID */
  appId: string;
  /** Tenant ID (optional, for multi-tenant setups) */
  tenantId?: string;
}

/**
 * AI agents, prompts, and workflow management block interface.
 */
export interface JarvisBlock {
  /** AI agent management */
  agents: AgentsService;
  /** Prompt template management */
  prompts: PromptsService;
  /** Workflow definition management */
  workflows: WorkflowsService;
  /** Workflow execution tracking */
  executions: ExecutionsService;
  /** AI conversation management */
  conversations: ConversationsService;
  /** AI model configuration */
  aiModels: AIModelsService;
  /** Entity management for AI context */
  entities: EntitiesService;
  /** Entity cluster management */
  clusters: ClustersService;
  /** Jarvis user management */
  users: JarvisUsersService;
  /** Workflow participant management */
  workflowParticipants: WorkflowParticipantsService;
  /** Workflow step definition management */
  workflowSteps: WorkflowStepsService;
  /** Workflow instance management */
  workflowInstances: WorkflowInstancesService;
  /** Agent runtime execution */
  agentRuntime: AgentRuntimeService;
  /** Mail template management */
  mailTemplates: MailTemplatesService;
  /** Marvin chat interface */
  marvinChat: MarvinChatService;
  /** Prompt comment management */
  promptComments: PromptCommentsService;
  /** Execution comment management */
  executionComments: ExecutionCommentsService;
}

/**
 * Create the Jarvis block.
 *
 * @example
 * ```typescript
 * const block = createJarvisBlock(transport, { appId: 'xxx' });
 * const agents = await block.agents.list({ page: 1 });
 * ```
 */
export function createJarvisBlock(
  transport: Transport,
  config: JarvisBlockConfig
): JarvisBlock {
  return {
    agents: createAgentsService(transport, config),
    prompts: createPromptsService(transport, config),
    workflows: createWorkflowsService(transport, config),
    executions: createExecutionsService(transport, config),
    conversations: createConversationsService(transport, config),
    aiModels: createAIModelsService(transport, config),
    entities: createEntitiesService(transport, config),
    clusters: createClustersService(transport, config),
    users: createJarvisUsersService(transport, config),
    workflowParticipants: createWorkflowParticipantsService(transport, config),
    workflowSteps: createWorkflowStepsService(transport, config),
    workflowInstances: createWorkflowInstancesService(transport, config),
    agentRuntime: createAgentRuntimeService(transport, config),
    mailTemplates: createMailTemplatesService(transport, config),
    marvinChat: createMarvinChatService(transport, config),
    promptComments: createPromptCommentsService(transport, config),
    executionComments: createExecutionCommentsService(transport, config),
  };
}

export const jarvisBlockMetadata: BlockMetadata = {
  name: 'jarvis',
  version: '0.1.0',
  description: 'AI agents, prompts, workflows, executions, and conversation management',
  resourceTypes: [
    'Agent',
    'Prompt',
    'Workflow',
    'Execution',
    'Conversation',
  ],
};
