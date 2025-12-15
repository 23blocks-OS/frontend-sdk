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
} from './services';

export interface JarvisBlockConfig extends BlockConfig {
  appId: string;
  tenantId?: string;
}

export interface JarvisBlock {
  agents: AgentsService;
  prompts: PromptsService;
  workflows: WorkflowsService;
  executions: ExecutionsService;
  conversations: ConversationsService;
  aiModels: AIModelsService;
  entities: EntitiesService;
  clusters: ClustersService;
  users: JarvisUsersService;
  workflowParticipants: WorkflowParticipantsService;
  workflowSteps: WorkflowStepsService;
  workflowInstances: WorkflowInstancesService;
  agentRuntime: AgentRuntimeService;
  mailTemplates: MailTemplatesService;
  marvinChat: MarvinChatService;
  promptComments: PromptCommentsService;
  executionComments: ExecutionCommentsService;
}

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
