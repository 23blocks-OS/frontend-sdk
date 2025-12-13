import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createAgentsService,
  createPromptsService,
  createWorkflowsService,
  createExecutionsService,
  createConversationsService,
  type AgentsService,
  type PromptsService,
  type WorkflowsService,
  type ExecutionsService,
  type ConversationsService,
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
