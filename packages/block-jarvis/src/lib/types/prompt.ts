import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

/**
 * Prompt type (AI model provider)
 */
export type PromptType = 'openai' | 'claude' | 'gemini' | 'custom' | string;

/**
 * AI Provider
 */
export type AIProvider = 'openai' | 'anthropic' | 'google' | 'perplexity' | string;

/**
 * Prompt source
 */
export type PromptSource = 'draft' | 'published' | 'archived' | string;

/**
 * Template info metadata
 */
export interface TemplateInfo {
  name?: string;
  type?: string;
  description?: string;
}

export interface Prompt extends IdentityCore {
  // Core identifiers
  promptVersionUniqueId?: string;

  // Basic info
  name: string;
  code?: string;
  promptType?: PromptType;
  abstract?: string;
  keywords?: string;
  description?: string;

  // Content
  content?: string;
  template?: string;
  variables?: string[];

  // Template system
  templateData?: Record<string, unknown>;
  templateSchema?: Record<string, unknown>;
  templateInfo?: TemplateInfo;
  placeholders?: string[];
  provider?: AIProvider;

  // Media
  thumbnailUrl?: string;
  imageUrl?: string;
  mediaUrl?: string;
  contentUrl?: string;
  repoUrl?: string;

  // Publishing
  publishAt?: Date;
  publishUntil?: Date;
  isPublic?: boolean;
  source?: PromptSource;

  // AI Model Settings
  model?: string;
  frequencyPenalty?: number;
  maxTokens?: number;
  responses?: number;
  responseFormat?: string;
  seed?: number;
  temperature?: number;
  topP?: number;

  // Prompt Components
  user?: string;
  persona?: string;
  guidelines?: string;
  actions?: string;
  references?: string;
  sample?: string;
  outputTemplate?: string;
  safeguard?: string;

  // Versioning
  version?: number;
  status: EntityStatus;
  enabled?: boolean;

  // Engagement
  likes?: number;
  dislikes?: number;
  comments?: number;

  // Author info
  userUniqueId?: string;
  userName?: string;
  userAlias?: string;
  userAvatarUrl?: string;

  // Agent relationship
  agentUniqueId?: string;

  // Custom data
  payload?: Record<string, unknown>;
}

// Request types
export interface CreatePromptRequest {
  agentUniqueId?: string;
  name: string;
  code?: string;
  promptType?: PromptType;
  abstract?: string;
  keywords?: string;
  description?: string;
  content?: string;
  template?: string;
  variables?: string[];
  templateData?: Record<string, unknown>;
  templateSchema?: Record<string, unknown>;
  templateInfo?: TemplateInfo;
  placeholders?: string[];
  provider?: AIProvider;
  thumbnailUrl?: string;
  imageUrl?: string;
  mediaUrl?: string;
  contentUrl?: string;
  repoUrl?: string;
  publishAt?: Date;
  publishUntil?: Date;
  isPublic?: boolean;
  model?: string;
  frequencyPenalty?: number;
  maxTokens?: number;
  responses?: number;
  responseFormat?: string;
  seed?: number;
  temperature?: number;
  topP?: number;
  user?: string;
  persona?: string;
  guidelines?: string;
  actions?: string;
  references?: string;
  sample?: string;
  outputTemplate?: string;
  safeguard?: string;
  payload?: Record<string, unknown>;
}

export interface UpdatePromptRequest {
  name?: string;
  code?: string;
  promptType?: PromptType;
  abstract?: string;
  keywords?: string;
  description?: string;
  content?: string;
  template?: string;
  variables?: string[];
  templateData?: Record<string, unknown>;
  templateSchema?: Record<string, unknown>;
  templateInfo?: TemplateInfo;
  placeholders?: string[];
  provider?: AIProvider;
  thumbnailUrl?: string;
  imageUrl?: string;
  mediaUrl?: string;
  contentUrl?: string;
  repoUrl?: string;
  publishAt?: Date;
  publishUntil?: Date;
  isPublic?: boolean;
  model?: string;
  frequencyPenalty?: number;
  maxTokens?: number;
  responses?: number;
  responseFormat?: string;
  seed?: number;
  temperature?: number;
  topP?: number;
  user?: string;
  persona?: string;
  guidelines?: string;
  actions?: string;
  references?: string;
  sample?: string;
  outputTemplate?: string;
  safeguard?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListPromptsParams {
  page?: number;
  perPage?: number;
  agentUniqueId?: string;
  status?: EntityStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ExecutePromptRequest {
  agentUniqueId?: string;
  variables?: Record<string, string>;
  payload?: Record<string, unknown>;
}

export interface ExecutePromptResponse {
  output: string;
  executionUniqueId?: string;
  tokens?: number;
  cost?: number;
  duration?: number;
}

export interface TestPromptRequest {
  template: string;
  variables?: Record<string, string>;
  agentUniqueId?: string;
}

export interface TestPromptResponse {
  renderedPrompt: string;
  isValid: boolean;
  errors?: string[];
}

// Render endpoint types
export interface RenderPromptRequest {
  placeholders: Record<string, string>;
}

export interface RenderPromptMeta {
  placeholdersProvided: string[];
  placeholdersMissing: string[];
  allPlaceholders: string[];
  renderedAt: string;
}

export interface RenderPromptResponse {
  renderedContent: string;
  promptUniqueId: string;
  versionUniqueId?: string;
  name: string;
  promptType?: PromptType;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  provider?: AIProvider;
  meta: RenderPromptMeta;
}
