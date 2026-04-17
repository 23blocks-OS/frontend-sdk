export interface Agent {
  id: string;
  uniqueId: string;
  name: string;
  description?: string;
  instructions?: string;
  provider?: string;
  model?: string;
  source?: string;
  sourceId?: string;
  sourceType?: string;
  sourceAlias?: string;
  contentUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  agentIdentifier?: string;
  ragEnabled?: boolean;
  contextWindow?: number;
  encryptionKey?: string;
  rateLimitPerHour?: number;
  communicationEnabled?: boolean;
  email?: string;
  emailProcessorUrl?: string;
  allowedDomains?: string;
  phoneNumber?: string;
  smsProcessorUrl?: string;
  integrationServicesEnabled?: boolean;
  webhookUrl?: string;
  webhookSecret?: string;
  apiUrl?: string;
  imEnabled?: boolean;
  imAppsConfig?: string;
  supervisorEnabled?: boolean;
  supervisorEmail?: string;
  supervisorPhoneNumber?: string;
  lastActivityAt?: Date;
  totalMessagesProcessed?: number;
  averageResponseTime?: number;
  errorCount?: number;
  successRate?: number;
  status: string;
  enabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Matches agent_params in agents_controller.rb */
export interface CreateAgentRequest {
  name: string;
  description?: string;
  instructions?: string;
  provider?: string;
  model?: string;
  source?: string;
  sourceId?: string;
  sourceType?: string;
  sourceAlias?: string;
  contentUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  agentIdentifier?: string;
  ragEnabled?: boolean;
  contextWindow?: number;
  encryptionKey?: string;
  rateLimitPerHour?: number;
  communicationEnabled?: boolean;
  email?: string;
  emailProcessorUrl?: string;
  allowedDomains?: string;
  phoneNumber?: string;
  smsProcessorUrl?: string;
  integrationServicesEnabled?: boolean;
  webhookUrl?: string;
  webhookSecret?: string;
  apiUrl?: string;
  imEnabled?: boolean;
  imAppsConfig?: string;
  supervisorEnabled?: boolean;
  supervisorEmail?: string;
  supervisorPhoneNumber?: string;
  lastActivityAt?: Date;
  totalMessagesProcessed?: number;
  averageResponseTime?: number;
  errorCount?: number;
  successRate?: number;
}

export type UpdateAgentRequest = CreateAgentRequest;

export interface ListAgentsParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** Matches prompt_params in agents_controller.rb (add_prompt) */
export interface AddAgentPromptRequest {
  uniqueId: string;
}

/** Matches entity_params in agents_controller.rb (add_entity, remove_entity) */
export interface AddAgentEntityRequest {
  entityUniqueId: string;
  relationType?: string;
}
