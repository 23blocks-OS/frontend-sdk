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

/**
 * Placeholder value type supporting nested objects and arrays.
 *
 * Supported template syntax:
 * - `{{variable}}` - simple key
 * - `{{object.field}}` - nested object access
 * - `{{array[0]}}` - array index
 * - `{{array[0].field}}` - combined access
 * - `{{deep.nested[0].path.value}}` - deep nesting
 *
 * Array pipe transforms:
 * - `{{array}}` - smart default (strings join with newline)
 * - `{{array|bullets}}` - bullet list format
 * - `{{array|numbered}}` - numbered list format
 * - `{{array|join:, }}` - custom delimiter
 * - `{{array|length}}` - array length
 * - `{{array|first}}` - first element
 * - `{{array|last}}` - last element
 * - `{{objects|field:name}}` - extract field from each object
 */
export type PlaceholderValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | Record<string, unknown>
  | Array<Record<string, unknown>>;

export interface RenderPromptRequest {
  placeholders: Record<string, PlaceholderValue>;
}

export interface RenderPromptMeta {
  placeholdersProvided: string[];
  placeholdersMissing: string[];
  allPlaceholders: string[];
  renderedAt: string;
}

export interface RenderPromptResponse {
  /** Integer ID (note: changed from UUID in recent API update) */
  id: number;
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
